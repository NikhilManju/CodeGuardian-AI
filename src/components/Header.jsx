
export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">🛡️</div>

        <div>
          <h1>CodeGuardian AI</h1>
          <p>AI-Powered Python Debugging Workspace</p>
        </div>
      </div>

      <div className="header-actions">
        <span className="language-badge">
          Python
        </span>

        <span className="status-badge">
          ● Workspace Ready
        </span>
      </div>
    </header>
  );
}
