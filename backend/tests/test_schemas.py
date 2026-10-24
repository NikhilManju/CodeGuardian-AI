
from pydantic import ValidationError

from app.schemas import DebugRequest, DebugResponse


def test_valid_request():
    request = DebugRequest(code="print('Hello')")
    assert request.code == "print('Hello')"
    assert request.language == "python"


def test_empty_code_is_rejected():
    try:
        DebugRequest(code="")
    except ValidationError:
        return

    raise AssertionError("Empty code should be rejected")


def test_code_over_limit_is_rejected():
    try:
        DebugRequest(code="x" * 50001)
    except ValidationError:
        return

    raise AssertionError("Code exceeding 50000 characters should be rejected")


def test_response_defaults():
    response = DebugResponse(
        success=True,
        explanation="Analysis completed.",
    )
    assert response.errors == []
    assert response.fixed_code is None
    assert response.verified is False
    assert response.algorithm == []
    assert response.trace == []
    assert response.flowchart == []
