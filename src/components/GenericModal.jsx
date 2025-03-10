// GenericModal.jsx
import React from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";

export default function GenericModal({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded-2xl shadow-2xl max-w-md mx-auto my-8 animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <Button
          onClick={onRequestClose}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition-colors"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
