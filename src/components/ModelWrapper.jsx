import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModalWrapper({ children }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow relative max-w-xl w-full">
        <button onClick={() => navigate(-1)} className="absolute top-2 right-2">
          X
        </button>
        {children}
      </div>
    </div>
  );
}
