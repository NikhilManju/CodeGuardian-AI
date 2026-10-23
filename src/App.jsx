
import { useState } from "react";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";

export default function App() {
  const [code, setCode] = useState("print('Hello World')");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [showVisualize, setShowVisualize] = useState(false);
  const [visualType, setVisualType] = useState(null);

  // Update editor and clear outdated analysis
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setResult(null);
    setRequestError("");
  };

  // Send Python code to FastAPI backend
  const handleDebug = async (currentCode) => {
    if (!currentCode.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setRequestError("");

    try {
      const response = await fetch(
        "http://localhost:8000/debug",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: currentCode,
            language: "python",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend request failed (${response.status})`
        );
      }

      const data = await response.json();

      setResult({
        success: data.success === true,
        errors: Array.isArray(data.errors)
          ? data.errors
          : [],
        explanation: data.explanation ?? null,
        fixed_code: data.fixed_code ?? null,
        verified: data.verified === true,
      });
    } catch (error) {
      setRequestError(
        "Unable to connect to the debugging backend. " +
        "Check that FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // Apply only syntax-verified corrections
  const handleFixAll = () => {
    if (
      !result?.fixed_code ||
      !result?.verified ||
      loading
    ) {
      return;
    }

    setCode(result.fixed_code);
    setResult(null);
    setRequestError("");
  };

  // Download current Python code
  const handleDownload = () => {
    const blob = new Blob([code], {
      type: "text/x-python;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "main.py";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="app">
      {/* Website Header */}
      <Header />

      <main className="workspace">
        {/* Workspace Title */}
        <div className="workspace-title">
          <h2>Developer Workspace</h2>
          <p>
            Write, analyze, debug and visualize
            Python code with AI assistance.
          </p>
        </div>

        {/* Main IDE Workspace */}
        <div className="workspace-grid">
          {/* Code Editor */}
          <CodeEditor
            code={code}
            setCode={handleCodeChange}
            onDebug={handleDebug}
            loading={loading}
          />

          {/* Temporary AI Assistant Panel */}
          <aside className="assistant-panel">
            <h2>🤖 AI Assistant</h2>

            {!loading && !result && !requestError && (
              <p>
                Enter Python code and click Debug Code
                to analyze syntax errors and get
                suggested corrections.
              </p>
            )}

            {loading && (
              <p>Analyzing Python code...</p>
            )}

            {requestError && (
              <div className="debug-result">
                <p>{requestError}</p>
              </div>
            )}

            {result && (
              <div className="debug-result">
                <h3>Analysis Result</h3>

                {result.success && (
                  <p>✓ No syntax errors detected.</p>
                )}

                {result.errors.map((error, index) => (
                  <p key={index}>
                    Line {error.line ?? "?"}: {error.message}
                  </p>
                ))}

                {result.explanation && (
                  <>
                    <h4>Explanation</h4>
                    <p>{result.explanation}</p>
                  </>
                )}

                {result.fixed_code !== null && (
                  <>
                    <h4>Suggested Fixed Code</h4>

                    <pre>
                      <code>{result.fixed_code}</code>
                    </pre>

                    <p>
                      {result.verified
                        ? "✓ Suggested code passed syntax validation."
                        : "⚠ Suggested fix is not syntax-verified."}
                    </p>
                  </>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Terminal / Debug Output */}
        <section className="terminal-panel">
          <div className="terminal-header">
            <span>⌘ Terminal — Debug Output</span>
            <span>Python</span>
          </div>

          <div className="terminal-body">
            {!loading && !result && !requestError && (
              <p>
                &gt; Ready for Python syntax analysis...
              </p>
            )}

            {loading && (
              <p>&gt; Analyzing Python code...</p>
            )}

            {requestError && (
              <p className="terminal-error">
                &gt; {requestError}
              </p>
            )}

            {result && (
              <>
                {result.success ? (
                  <p className="terminal-success">
                    ✓ Python syntax check passed.
                  </p>
                ) : result.errors.length > 0 ? (
                  result.errors.map((error, index) => (
                    <p
                      className="terminal-error"
                      key={index}
                    >
                      Line {error.line ?? "?"}: {error.message}
                    </p>
                  ))
                ) : (
                  <p>
                    {result.explanation ||
                      "No syntax diagnostics available."}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Main Action Buttons */}
        <div className="extra-actions">
          {/* Visualize Button */}
          <button
            type="button"
            className="action-button block-button"
            onClick={() => {
              setShowVisualize(true);
              setVisualType(null);
            }}
          >
            👁 Visualize
          </button>

          {/* Fix All Errors Button - UPDATED */}
          <button
            type="button"
            className="action-button flow-button"
            onClick={handleFixAll}
            disabled={
              !result?.fixed_code ||
              !result?.verified ||
              loading
            }
          >
            🔧 Fix All Errors
          </button>

          {/* Download Button */}
          <button
            type="button"
            className="action-button download-button"
            onClick={handleDownload}
          >
            ⬇ Download
          </button>
        </div>

        {/* Visualization Panel */}
        {showVisualize && (
          <section className="visualize-panel">
            <div className="visualize-header">
              <h2>Visualization Options</h2>

              <button
                type="button"
                aria-label="Close visualization panel"
                onClick={() => {
                  setShowVisualize(false);
                  setVisualType(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="visualize-options">
              <button
                type="button"
                onClick={() => setVisualType("flowchart")}
              >
                ◇ Flowchart
              </button>

              <button
                type="button"
                onClick={() => setVisualType("block")}
              >
                ▣ Block Diagram
              </button>
            </div>

            {visualType && (
              <div className="visualize-result">
                <h3>
                  {visualType === "flowchart"
                    ? "Flowchart"
                    : "Block Diagram"}
                </h3>

                <p>
                  Diagram generation from Python code
                  is not connected yet.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
