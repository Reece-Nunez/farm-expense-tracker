import React from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";

// Make sure to call Modal.setAppElement("#root") in your main app
// or do it here if you prefer.

export default function ConfirmationModal({
  isOpen,
  onRequestClose,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      // example Tailwind-based styles
      className="bg-white p-4 rounded shadow max-w-md mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
      <p className="mb-4">
        Are you sure you want to submit this expense? You can review it now.
      </p>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={onRequestClose}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}