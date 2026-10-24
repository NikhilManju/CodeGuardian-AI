export default function Header({ onGoHome }) {
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
        <button
          onClick={onGoHome}
          aria-label="Go to Home page"
          title="Home"
          className="home-button"
        >
          ⌂
        </button>

        <span className="language-badge">Python</span>

        <span className="status-badge">
          ● Workspace Ready
        </span>
      </div>
    </header>
  );
}