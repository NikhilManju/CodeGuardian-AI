
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({
  code,
  setCode,
  onDebug,
  loading = false,
}) {
  const [localCode, setLocalCode] = useState(
    "print('Hello World')"
  );

  const currentCode = code ?? localCode;
  const updateCode = setCode ?? setLocalCode;

  return (
    <section className="code-editor">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <span>Python 3</span>
      </div>

      <div className="monaco-container">
        <Editor
          height="410px"
          language="python"
          theme="vs-dark"
          value={currentCode}
          onChange={(value) => updateCode(value ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, Consolas, monospace",
            lineHeight: 24,
            lineNumbers: "on",
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            tabSize: 4,
            insertSpaces: true,
            bracketPairColorization: {
              enabled: true,
            },
            padding: {
              top: 18,
              bottom: 18,
            },
          }}
        />
      </div>

      <div className="editor-footer">
        <span>{currentCode.split("\n").length} lines</span>

        <button
          type="button"
          className="debug-button"
          onClick={() => onDebug?.(currentCode)}
          disabled={loading || !currentCode.trim()}
        >
          {loading ? "Analyzing..." : "🔍 Debug Code"}
        </button>
      </div>
    </section>
  );
}
