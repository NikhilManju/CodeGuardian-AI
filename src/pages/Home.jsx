
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Code2,
  MonitorSmartphone,
  Smartphone,
  Tablet,
  Laptop,
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Home({ onStart }) {
  const [language, setLanguage] = useState("Python");
  const [device, setDevice] = useState("Laptop");
  const [darkMode, setDarkMode] = useState(true);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

  const languageMenuRef = useRef(null);
  const systemMenuRef = useRef(null);

  const languages = [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "C#",
    "Go",
    "Rust",
  ];

  const devices = [
    { name: "Phone", Icon: Smartphone },
    { name: "Tablet", Icon: Tablet },
    { name: "Laptop", Icon: Laptop },
  ];

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setLanguageOpen(false);
      }

      if (
        systemMenuRef.current &&
        !systemMenuRef.current.contains(event.target)
      ) {
        setSystemOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setSystemOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const textColor = darkMode ? "#f8fafc" : "#172033";
  const panelColor = darkMode ? "#202635" : "#d4dce9";

  const controlStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 15px",
    background: panelColor,
    color: textColor,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
    boxShadow: darkMode
      ? "5px 5px 12px #0d111b, -4px -4px 12px #2b3445"
      : "5px 5px 12px #bec7d6, -4px -4px 12px #ffffff",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: 220,
    maxHeight: 310,
    overflowY: "auto",
    background: darkMode ? "#202635" : "#e8edf5",
    color: textColor,
    border: darkMode
      ? "1px solid #39445b"
      : "1px solid #c4cfdf",
    borderRadius: 14,
    padding: 9,
    zIndex: 100,
    boxShadow: darkMode
      ? "8px 8px 20px #0d111b, -4px -4px 14px #30384a"
      : "8px 8px 20px #bec7d6",
  };

  function optionStyle(selected) {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      width: "100%",
      padding: "11px 12px",
      marginBottom: 3,
      textAlign: "left",
      background: selected ? "#548cff" : "transparent",
      color: selected ? "#ffffff" : textColor,
      border: "none",
      borderRadius: 9,
      cursor: "pointer",
      fontSize: 14,
    };
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#171c28" : "#e8edf5",
        color: textColor,
        transition: "background 0.3s, color 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "22px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ShieldCheck color="#548cff" size={30} />
          <strong style={{ fontSize: 21 }}>
            CodeGuardian AI
          </strong>
        </div>

        {/* NAVIGATION CONTROLS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* LANGUAGE BUTTON */}
          <div
            ref={languageMenuRef}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              style={controlStyle}
              onClick={() => {
                setLanguageOpen((previous) => !previous);
                setSystemOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={languageOpen}
            >
              <Code2 size={17} />
              Language
              <ChevronDown size={15} />
            </button>

            {languageOpen && (
              <div style={dropdownStyle}>
                <p
                  style={{
                    margin: "4px 8px 10px",
                    fontSize: 12,
                    opacity: 0.8,
                  }}
                >
                  Choose programming language
                </p>

                {languages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setLanguage(item);
                      setLanguageOpen(false);
                    }}
                    style={optionStyle(language === item)}
                  >
                    <span>{item}</span>
                    {language === item && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SYSTEM BUTTON */}
          <div
            ref={systemMenuRef}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              style={controlStyle}
              onClick={() => {
                setSystemOpen((previous) => !previous);
                setLanguageOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={systemOpen}
            >
              <MonitorSmartphone size={17} />
              System
              <ChevronDown size={15} />
            </button>

            {systemOpen && (
              <div style={dropdownStyle}>
                <p
                  style={{
                    margin: "4px 8px 10px",
                    fontSize: 12,
                    opacity: 0.8,
                  }}
                >
                  Choose device
                </p>

                {devices.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setDevice(name);
                      setSystemOpen(false);
                    }}
                    style={optionStyle(device === name)}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Icon size={17} />
                      {name}
                    </span>

                    {device === name && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LIGHT / DARK TOGGLE */}
          <button
            type="button"
            aria-label={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              ...controlStyle,
              padding: "11px 13px",
            }}
          >
            {darkMode ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "60px 24px",
          gap: 20,
        }}
      >
        <p
          style={{
            color: "#548cff",
            fontWeight: 600,
          }}
        >
          AI-POWERED CODE DEBUGGING
        </p>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            margin: 0,
          }}
        >
          Welcome to CodeGuardian AI
        </h1>

        <h2
          style={{
            color: "#548cff",
            margin: 0,
          }}
        >
          Write. Debug. Improve.
        </h2>

        <p
          style={{
            maxWidth: 650,
            lineHeight: 1.8,
            opacity: 0.85,
          }}
        >
          CodeGuardian AI helps developers identify Python
          syntax errors, understand mistakes, and review
          suggested corrections through a simple and
          intelligent debugging workspace.
        </p>

        {language !== "Python" && (
          <p
            style={{
              color: darkMode ? "#e6a94f" : "#945900",
              fontSize: 14,
            }}
          >
            {language} debugging is coming soon.
            Python is currently supported.
          </p>
        )}

        {/* START DEBUGGING BUTTON */}
        <button
          type="button"
          onClick={() => onStart?.()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "15px 30px",
            background: "#548cff",
            color: "#ffffff",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: darkMode
              ? "6px 6px 14px #0d111b"
              : "6px 6px 14px #bec7d6",
          }}
        >
          Start Debugging
          <ArrowRight size={17} />
        </button>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: 20,
          opacity: 0.6,
        }}
      >
        © 2026 CodeGuardian AI
      </footer>
    </div>
  );
}
