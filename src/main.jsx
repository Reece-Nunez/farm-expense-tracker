import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";


// For React Modal
import Modal from "react-modal";
Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* React Hot Toast */}
    <Toaster />
  </React.StrictMode>
);
