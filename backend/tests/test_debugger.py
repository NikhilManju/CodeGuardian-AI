
from app import debugger
from app.debugger import debug_code


def test_empty_code_does_not_call_ai(monkeypatch):
    def fail_if_called(prompt):
        raise AssertionError("AI should not be called for empty code")

    monkeypatch.setattr(debugger, "ask_gemini", fail_if_called)

    result = debug_code("")

    assert result["success"] is False
    assert result["fixed_code"] is None
    assert result["verified"] is False
    assert result["errors"][0]["message"] == (
        "Please enter some Python code first."
    )


def test_syntax_error_does_not_call_ai(monkeypatch):
    def fail_if_called(prompt):
        raise AssertionError("AI should not be called for syntax errors")

    monkeypatch.setattr(debugger, "ask_gemini", fail_if_called)

    result = debug_code("def add(a, b)\n    return a + b")

    assert result["success"] is True
    assert result["fixed_code"] is None
    assert result["verified"] is False
    assert result["errors"][0]["line"] == 1
    assert "syntax error" in result["explanation"].lower()


def test_valid_code_calls_ai(monkeypatch):
    def fake_ai(prompt):
        return {
            "errors": [],
            "explanation": "The function adds two numbers.",
            "fixed_code": None,
            "algorithm": ["Receive two numbers", "Return their sum"],
            "trace": [],
            "flowchart": [],
        }

    monkeypatch.setattr(debugger, "ask_gemini", fake_ai)

    result = debug_code("def add(a, b):\n    return a + b")

    assert result["success"] is True
    assert result["errors"] == []
    assert result["explanation"] == "The function adds two numbers."
    assert result["algorithm"] == [
        "Receive two numbers",
        "Return their sum",
    ]


def test_invalid_ai_fixed_code_is_rejected(monkeypatch):
    def fake_ai(prompt):
        return {
            "errors": [],
            "explanation": "Suggested correction.",
            "fixed_code": "def add(a, b)\n    return a + b",
            "algorithm": [],
            "trace": [],
            "flowchart": [],
        }

    monkeypatch.setattr(debugger, "ask_gemini", fake_ai)

    result = debug_code("def add(a, b):\n    return a + b")

    assert result["fixed_code"] is None
    assert result["verified"] is False
