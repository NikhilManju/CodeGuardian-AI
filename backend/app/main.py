import os
import subprocess
import sys
import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.schemas import DebugRequest, DebugResponse
from app.debugger import debug_code
from app.ai_services import generate_chat_response

app = FastAPI(
    title="CodeGuardian AI",
    description="AI-powered coding assistant and Python debugging API",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=6000)
    current_code: str = Field(default="", max_length=12000)
    language: str = Field(default="python", max_length=40)


class ChatResponse(BaseModel):
    reply: str
    code: str | None = None
    language: str = "python"

class RunRequest(BaseModel):
    code: str = Field(min_length=1, max_length=12000)
    stdin: str = Field(default="", max_length=4000)

@app.get("/")
def home():
    return {"message": "CodeGuardian AI API is running!"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/debug", response_model=DebugResponse)
def debug(request: DebugRequest):
    if request.language.strip().lower() != "python":
        return {
            "success": False,
            "errors": [],
            "explanation": "Currently, only Python debugging is supported.",
            "fixed_code": None,
            "verified": False,
            "algorithm": [],
            "trace": [],
            "flowchart": [],
        }

    return debug_code(request.code)


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Please enter a message.",
        )

    try:
        result = generate_chat_response(
            message=message,
            current_code=request.current_code,
            language=request.language,
        )

        return ChatResponse(**result)

    except Exception as error:
        # Keep API keys and internal exception details out of client responses.
        print(f"CodeGuardian chat error: {type(error).__name__}: {error}")

        raise HTTPException(
            status_code=502,
            detail=(
                "The AI assistant could not generate a response. "
                "Please try again shortly."
            ),
        ) from error

@app.post("/run")
def run_code(request: RunRequest):
    code = request.code

    if not code.strip():
        raise HTTPException(
            status_code=422,
            detail="Please enter some Python code."
        )

    try:
        with tempfile.TemporaryDirectory(prefix="codeguardian_") as temp_dir:
            file_path = os.path.join(temp_dir, "main.py")

            with open(file_path, "w", encoding="utf-8") as file:
                file.write(code)

            try:
                completed = subprocess.run(
                    [sys.executable, "-I", file_path],
                    input=request.stdin,
                    capture_output=True,
                    text=True,
                    timeout=3,
                    cwd=temp_dir,
                    env={
                        "PATH": os.environ.get("PATH", ""),
                        "PYTHONIOENCODING": "utf-8",
                    },
                    check=False,
                )

                return {
                    "success": completed.returncode == 0,
                    "stdout": completed.stdout[-10000:],
                    "stderr": completed.stderr[-10000:],
                    "return_code": completed.returncode,
                    "timed_out": False,
                }

            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "stdout": "",
                    "stderr": "Execution timed out after 3 seconds.",
                    "return_code": None,
                    "timed_out": True,
                }

    except Exception as error:
        print(f"CodeGuardian execution error: {type(error).__name__}")

        raise HTTPException(
            status_code=500,
            detail="The code runner encountered an internal error.",
        ) from error