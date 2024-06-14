import { createRoot } from "react-dom/client";
import React from "react";
import "./style.css";
import Main from './pages/Main'


function App() {
  return (
      <Main />
  );
}

createRoot(document.getElementById("root")).render(<App />);
