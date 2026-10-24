
from pydantic import BaseModel, Field


class DebugRequest(BaseModel):
    code: str = Field(min_length=1, max_length=50000)
    language: str = "python"


class DebugError(BaseModel):
    line: int | None = None
    message: str


class TraceStep(BaseModel):
    step: int
    description: str
    variables: str = ""


class FlowchartNode(BaseModel):
    id: str
    label: str
    type: str
    next: list[str] = Field(default_factory=list)


class DebugResponse(BaseModel):
    # Indicates whether the analysis completed successfully.
    success: bool

    # Issues identified during code analysis.
    errors: list[DebugError] = Field(default_factory=list)

    # Explanation of the analysis results.
    explanation: str

    # AI-suggested corrected code, if applicable.
    fixed_code: str | None = None

    # True only if suggested code passes Python syntax parsing.
    # This does not confirm runtime behavior.
    verified: bool = Field(
        default=False,
        description=(
            "True only when suggested code passes Python syntax parsing. "
            "This does not confirm runtime behavior."
        ),
    )

    # Algorithm steps describing the code's logic.
    algorithm: list[str] = Field(default_factory=list)

    # Illustrative execution trace; not proof of actual execution.
    trace: list[TraceStep] = Field(default_factory=list)

    # Nodes used to represent the algorithm as a flowchart.
    flowchart: list[FlowchartNode] = Field(default_factory=list)
