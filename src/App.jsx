import { useState } from "react";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";

const API_BASE = "http://127.0.0.1:8000";
const CHAT_URL = `${API_BASE}/chat`;
const DEBUG_URL = `${API_BASE}/debug`;
const RUN_URL = `${API_BASE}/run`;

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e8eefb",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  workspace: {
    width: "min(1500px, calc(100% - 32px))",
    margin: "0 auto",
    padding: "24px 0 36px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    gap: 18,
    alignItems: "stretch",
  },
  mainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  panel: {
    background: "linear-gradient(145deg, #111d31, #101827)",
    border: "1px solid #24334d",
    borderRadius: 16,
    boxShadow: "0 14px 36px rgba(0,0,0,.18)",
    minWidth: 0,
  },
  assistant: { padding: 18, display: "flex", flexDirection: "column", minHeight: 360 },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#1c3e79",
    color: "#8bb8ff",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    flexShrink: 0,
  },
  heading: { margin: 0, fontSize: 21, lineHeight: 1.2, fontWeight: 750 },
  subtitle: { margin: "5px 0 0", color: "#9eacc4", fontSize: 13 },
  messages: {
    flex: 1,
    minHeight: 190,
    maxHeight: 310,
    overflowY: "auto",
    border: "1px solid #25344b",
    borderRadius: 12,
    padding: 14,
    background: "rgba(5, 11, 21, .55)",
  },
  message: { marginBottom: 14, minWidth: 0 },
  role: { display: "block", color: "#91a8c8", fontSize: 11, fontWeight: 700, marginBottom: 5 },
  messageText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    lineHeight: 1.55,
    fontSize: 13,
  },
  userBubble: {
    marginLeft: "auto",
    maxWidth: "85%",
    background: "#1d62dc",
    borderRadius: "12px 12px 3px 12px",
    padding: "10px 13px",
  },
  assistantBubble: {
    maxWidth: "94%",
    background: "#1b2940",
    border: "1px solid #293a55",
    borderRadius: "3px 12px 12px 12px",
    padding: "10px 13px",
  },
  codeBlock: {
    margin: "10px 0 0",
    padding: 12,
    borderRadius: 9,
    background: "#080e18",
    border: "1px solid #293a55",
    color: "#cfe0ff",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    overflowX: "auto",
    fontSize: 12,
    lineHeight: 1.55,
  },
  composer: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 105px",
    gap: 10,
    marginTop: 12,
    alignItems: "stretch",
  },
  textarea: {
    display: "block",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 46,
    maxHeight: 140,
    border: "1px solid #344966",
    borderRadius: 10,
    background: "#0b1423",
    color: "#e8eefb",
    padding: "12px 13px",
    font: "inherit",
    fontSize: 13,
    outline: "none",
  },
  primaryButton: {
    border: 0,
    borderRadius: 10,
    background: "#2672f4",
    color: "white",
    fontWeight: 700,
    padding: "11px 15px",
    cursor: "pointer",
    minHeight: 44,
  },
  secondaryButton: {
    border: "1px solid #344966",
    borderRadius: 9,
    background: "#17263d",
    color: "#e8eefb",
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: 650,
  },
  sideColumn: { display: "flex", flexDirection: "column", gap: 16, padding: 16 },
  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    width: "100%",
    textAlign: "left",
    padding: 15,
    borderRadius: 13,
    border: "1px solid #2a3a54",
    background: "linear-gradient(145deg, #1a2940, #131e30)",
    color: "#edf3ff",
    cursor: "pointer",
    minHeight: 112,
  },
  actionIcon: {
    display: "grid",
    placeItems: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    flexShrink: 0,
    fontSize: 23,
    background: "#3a36b9",
  },
  actionTitle: { margin: 0, fontSize: 16, fontWeight: 750 },
  actionDescription: { margin: "6px 0 0", color: "#a9b7ce", fontSize: 12, lineHeight: 1.5 },
  workspacePanel: { padding: 18 },
  workspaceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  terminal: {
    background: "#070d16",
    border: "1px solid #26364d",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  terminalLabel: { display: "block", color: "#9eacc4", fontSize: 12, marginBottom: 7 },
  terminalOutput: {
    margin: "12px 0 0",
    minHeight: 54,
    maxHeight: 180,
    overflow: "auto",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    color: "#cde0ff",
    fontSize: 12,
    lineHeight: 1.55,
  },
  muted: { color: "#9eacc4", fontSize: 12 },
  error: { color: "#ffb4b4", background: "#351b27", padding: 10, borderRadius: 8, marginTop: 10 },
};

function extractCode(text) {
  if (typeof text !== "string") return null;
  const match = text.match(/```(?:python|py)?\s*\n?([\s\S]*?)```/i);
  return match ? match[1].trim() : null;
}

function normalizeText(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"');
}

export default function App({ onGoHome }) {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm CodeGuardian, your coding partner. I can help you write Python code, explain concepts, debug errors, and improve your program.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [code, setCode] = useState("print('Hello World')");
  const [debugLoading, setDebugLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [runOutput, setRunOutput] = useState("");
  const [runInput, setRunInput] = useState("");
  const [activeView, setActiveView] = useState("ide");
  const [visualType, setVisualType] = useState("algorithm");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setResult(null);
    setRequestError("");
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt || chatLoading) return;

    setChatMessages((messages) => [...messages, { role: "user", content: prompt }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, current_code: code, language: "python" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Chat request failed (${response.status})`);

      const reply = normalizeText(data.reply || data.response || "The AI returned an empty response.");
      const returnedCode =
        typeof data.code === "string" && data.code.trim()
          ? normalizeText(data.code)
          : extractCode(reply);

      setChatMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: returnedCode && !data.code
            ? (reply.replace(/```[\s\S]*?```/i, "").trim() || "Here's the code:")
            : reply,
          code: returnedCode || null,
        },
      ]);
    } catch (error) {
      setChatMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: `I couldn't reach the AI backend: ${error.message}\nCheck that FastAPI is running and that its /chat endpoint is available.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDebug = async (currentCode = code) => {
    if (!currentCode.trim() || debugLoading) return;
    setDebugLoading(true);
    setResult(null);
    setRequestError("");
    try {
      const response = await fetch(DEBUG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: currentCode, language: "python" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Debug request failed (${response.status})`);
      if (data.fixed_code) setCode(data.fixed_code);
      setResult({
        success: data.success === true,
        errors: Array.isArray(data.errors) ? data.errors : [],
        explanation: data.explanation || "",
        fixed_code: data.fixed_code ?? null,
        verified: data.verified === true,
        algorithm: Array.isArray(data.algorithm) ? data.algorithm : [],
        trace: Array.isArray(data.trace) ? data.trace : [],
        flowchart: Array.isArray(data.flowchart) ? data.flowchart : [],
      });
    } catch (error) {
      setRequestError(`Could not analyze the code: ${error.message}`);
    } finally {
      setDebugLoading(false);
    }
  };

const handleFixAllErrors = async () => {
  if (!code.trim() || debugLoading) return;

  setDebugLoading(true);
  setRequestError("");

  try {
    const response = await fetch(DEBUG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language: "python" }),
    });

    const data = await response.json();
    console.log("Fix All Errors response:", data);

    if (!response.ok) {
      throw new Error(data.detail || `Fix request failed (${response.status})`);
    }

    if (!data.fixed_code || !data.fixed_code.trim()) {
      throw new Error("The AI did not return corrected code.");
    }

    setCode(data.fixed_code);
    setResult({
      success: data.success === true,
      errors: Array.isArray(data.errors) ? data.errors : [],
      explanation: data.explanation || "",
      fixed_code: data.fixed_code,
      verified: data.verified === true,
      algorithm: Array.isArray(data.algorithm) ? data.algorithm : [],
      trace: Array.isArray(data.trace) ? data.trace : [],
      flowchart: Array.isArray(data.flowchart) ? data.flowchart : [],
    });
  } catch (error) {
    setRequestError(`Could not fix the code: ${error.message}`);
  } finally {
    setDebugLoading(false);
  }
};


  const handleRunCode = async () => {
    if (!code.trim() || runLoading) return;
    setRunLoading(true);
    setRunOutput("Running Python code...");
    try {
      const response = await fetch(RUN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, stdin: runInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Execution request failed (${response.status})`);
      const output = [
        data.stdout || "",
        data.stderr ? `STDERR:\n${data.stderr}` : "",
        data.timed_out ? "Execution timed out." : "",
        !data.stdout && !data.stderr && !data.timed_out ? "Program finished with no output." : "",
        `Process exited with code ${data.return_code ?? "unknown"}.`,
      ].filter(Boolean).join("\n");
      setRunOutput(output);
    } catch (error) {
      setRunOutput(`Execution failed: ${error.message}\nCheck whether your backend implements POST /run.`);
    } finally {
      setRunLoading(false);
    }
  };

  const insertCode = (newCode) => {
    if (typeof newCode !== "string" || !newCode.trim()) return;
    handleCodeChange(newCode);
    setActiveView("ide");
  };

  const handleFixAll = () => {
    if (result?.fixed_code && result.verified) insertCode(result.fixed_code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "main.py";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const openVisualization = (type = "algorithm") => {
    setVisualType(type);
    setActiveView("visualize");
  };

  const renderAnalysis = () => {
    if (debugLoading) return <p style={styles.muted}>Analyzing Python code…</p>;
    if (requestError) return <p style={styles.error}>{requestError}</p>;
    if (!result) return <p style={styles.muted}>Click Debug Code to see errors, explanations, and suggested fixes.</p>;

    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Analysis Result</h3>
        {result.errors.length ? (
          result.errors.map((item, index) => (
            <p key={index} style={styles.muted}>Line {item.line ?? "?"}: {item.message || String(item)}</p>
          ))
        ) : (
          <p style={styles.muted}>{result.success ? "✓ No issues were reported." : "Analysis completed."}</p>
        )}
        {result.explanation && <p>{result.explanation}</p>}
        {result.fixed_code && (
          <>
            <h4>Suggested Fixed Code</h4>
            <pre style={styles.codeBlock}>{result.fixed_code}</pre>
            <button style={{ ...styles.secondaryButton, marginTop: 8 }} disabled={!result.verified} onClick={handleFixAll}>
              Insert Fixed Code into IDE
            </button>
            <p style={styles.muted}>{result.verified ? "Verified syntax" : "Not verified yet"}</p>
          </>
        )}
        {result.algorithm.length > 0 && <><h4>Algorithm</h4><ol>{result.algorithm.map((step, i) => <li key={i}>{step}</li>)}</ol></>}
        {result.trace.length > 0 && <><h4>Illustrative Trace</h4>{result.trace.map((step, i) => <p key={i}>Step {step.step ?? i + 1}: {step.description}</p>)}</>}
      </div>
    );
  };

  const renderVisualization = () => {
    if (!result) return <p style={styles.muted}>Run Debug Code first to request visualization data.</p>;
    if (visualType === "algorithm") {
      return result.algorithm.length ? <ol>{result.algorithm.map((step, i) => <li key={i}>{step}</li>)}</ol> : <p style={styles.muted}>No algorithm breakdown was returned.</p>;
    }
    if (visualType === "trace") {
      return result.trace.length ? result.trace.map((step, i) => <p key={i}>Step {step.step ?? i + 1}: {step.description}</p>) : <p style={styles.muted}>No trace data was returned.</p>;
    }
    return result.flowchart?.length ? (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: "12px 0",
      width: "100%",
    }}
  >
    {result.flowchart.map((node, i) => {
      const type = (node.type || "process").toLowerCase();

      const isStart = type === "start";
      const isEnd = type === "end";
      const isDecision = type === "decision";

      return (
        <div
          key={node.id ?? i}
          style={{
            border: "1px solid #477fe4",
            background: isStart || isEnd ? "#19334a" : "#14243c",
            borderRadius: isStart || isEnd ? 24 : isDecision ? 6 : 10,
            padding: "14px 18px",
            width: "min(440px, 100%)",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <strong>{node.label || `Step ${i + 1}`}</strong>

          {node.next?.length > 0 && (
            <div
              style={{
                marginTop: 5,
                fontSize: 12,
                color: "#9caec8",
              }}
            >
              Next: {node.next.join(", ")}
            </div>
          )}
        </div>
      );
    })}
  </div>
) : (
  <p style={styles.muted}>No flowchart data was returned.</p>
);
  };

  return (
    <div style={styles.app}>
      
          <Header onGoHome={onGoHome} />
          
      <main style={styles.workspace}>
        {activeView === "ide" ? (
          <>
            <div style={{ ...styles.grid, gridTemplateColumns: "minmax(0, 1.65fr) minmax(300px, 1fr)", alignItems: "start" }}>
              <div style={styles.mainColumn}>
                <section style={{ ...styles.panel, ...styles.workspacePanel }}>
                  <div style={styles.workspaceHeader}>
                    <div>
                      <h2 style={styles.heading}>Developer Workspace</h2>
                      <p style={styles.subtitle}>Write, run, and test your code here.</p>
                    </div>
                    <button style={styles.primaryButton} onClick={handleRunCode} disabled={runLoading || !code.trim()}>
                      {runLoading ? "Running…" : "▶ Run Code"}
                    </button>
                  </div>
                  <div style={{ border: "1px solid #293a55", borderRadius: 10, overflow: "hidden", minWidth: 0 }}>
                    <CodeEditor code={code} setCode={handleCodeChange} onDebug={handleDebug} loading={debugLoading} />
                  </div>
                  <div style={styles.terminal}>
                    <label htmlFor="terminal-input" style={styles.terminalLabel}>Terminal — Python Output</label>
                    <label htmlFor="terminal-input" style={{ ...styles.terminalLabel, marginTop: 10 }}>Program input (for input() prompts)</label>
                    <textarea id="terminal-input" value={runInput} onChange={(event) => setRunInput(event.target.value)} rows={2} placeholder="Enter input values, one per line" style={{ ...styles.textarea, minHeight: 58 }} />
                    <pre style={styles.terminalOutput}>{runOutput || "Ready. Click Run Code to execute your program."}</pre>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                    <button style={styles.secondaryButton} onClick={() => openVisualization("algorithm")}>▥ Visualize</button>
                    <button
                    style={styles.secondaryButton}
                    onClick={handleFixAllErrors}
                    disabled={debugLoading}
                    >
                      Fix All Errors
                      </button>
                    <button style={styles.secondaryButton} onClick={handleDownload}>↓ Download</button>
                  </div>
                  <details style={{ marginTop: 14 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700 }}>Latest code analysis</summary>
                    <div style={{ padding: "12px 2px" }}>{renderAnalysis()}</div>
                  </details>
                </section>
              </div>

              <aside style={{ ...styles.panel, ...styles.assistant, minHeight: 0, height: "100%" }}>
                <div style={styles.panelHeader}>
                  <div style={styles.iconBubble}>●</div>
                  <div>
                    <h1 style={styles.heading}>AI Assistant</h1>
                    <p style={styles.subtitle}>Your coding partner — write, debug, explain and improve your code.</p>
                  </div>
                </div>
                <div style={{ ...styles.messages, maxHeight: "min(70vh, 700px)", minHeight: 300 }} aria-live="polite">
                  {chatMessages.map((message, index) => (
                    <div key={index} style={styles.message}>
                      <span style={styles.role}>{message.role === "user" ? "YOU" : "CODEGUARDIAN"}</span>
                      <div style={message.role === "user" ? styles.userBubble : styles.assistantBubble}>
                        <p style={styles.messageText}>{message.content}</p>
                        {message.code && (
                          <>
                            <pre style={styles.codeBlock}><code>{message.code}</code></pre>
                            <button style={{ ...styles.secondaryButton, marginTop: 9 }} onClick={() => insertCode(message.code)}>Insert into IDE</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && <p style={styles.muted}>CodeGuardian is thinking…</p>}
                </div>
                <form onSubmit={sendMessage} style={{ ...styles.composer, gridTemplateColumns: "minmax(0, 1fr)", gap: 9 }}>
                  <textarea
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Ask me to write a program, explain code, debug a problem, or improve your code…"
                    aria-label="Message CodeGuardian AI"
                    rows={3}
                    disabled={chatLoading}
                    style={styles.textarea}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" disabled={!chatInput.trim() || chatLoading} style={{ ...styles.primaryButton, minWidth: 105 }}>
                      {chatLoading ? "Thinking…" : "➤ Send"}
                    </button>
                  </div>
                </form>
              </aside>
            </div>
          </>
        ) : (
          <section style={{ ...styles.panel, ...styles.workspacePanel }}>
            <div style={styles.workspaceHeader}>
              <div>
                <h2 style={styles.heading}>Code Visualization</h2>
                <p style={styles.subtitle}>Algorithm steps, execution trace, and flowchart.</p>
              </div>
              <button style={styles.secondaryButton} onClick={() => setActiveView("ide")}>← Back to IDE</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {["algorithm", "trace", "flowchart"].map((type) => (
                <button key={type} style={{ ...styles.secondaryButton, background: visualType === type ? "#1d62dc" : "#17263d" }} onClick={() => setVisualType(type)}>
                  {type === "trace" ? "Execution Trace" : type === "flowchart" ? "Flowchart" : "Algorithm"}
                </button>
              ))}
            </div>
            {renderVisualization()}
          </section>
        )}
      </main>

      <style>{`
        * { box-sizing: border-box; }
        button:disabled { cursor: not-allowed !important; opacity: .55; }
        button:not(:disabled):hover { filter: brightness(1.08); }
        textarea:focus { border-color: #4e8df8 !important; }
        @media (max-width: 850px) {
          main { width: min(100% - 20px, 700px) !important; }
          main > div[style*="grid-template-columns"] { grid-template-columns: minmax(0, 1fr) !important; }
          aside { min-height: auto !important; }
          textarea { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
