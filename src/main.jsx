
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Home from "./pages/Home.jsx";
import App from "./App.jsx";

function Website() {
  const [page, setPage] = useState("home");

  function openWorkspace() {
    setPage("workspace");
  }

  return (
    <>
      {page === "home" ? (
        <Home onStart={openWorkspace} />
      ) : (
        <App onGoHome={() => setPage("home")} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Website />
  </StrictMode>
);
