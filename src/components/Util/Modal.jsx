import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-auto animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
      </div>
      <div>{children}</div>
    </Modal>
  );
};

export default ModalWrapper;
