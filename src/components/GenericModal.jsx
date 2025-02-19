// GenericModal.jsx
import React from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";

// A generic modal for confirmation (or deletion) actions
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
      className="bg-white p-4 rounded shadow max-w-md mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={onRequestClose}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
