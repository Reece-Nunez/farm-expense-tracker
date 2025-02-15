import React, { useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "react-hot-toast";
import "./index.css";


export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // Called by ExpenseForm when the form is valid
  const handleValidSubmit = (formData) => {
    // We have valid data, open the confirm modal
    setPendingData(formData);
    setIsConfirmOpen(true);
  };

  // Actually finalize the submission after confirm
  const confirmSubmit = () => {
    if (!pendingData) return;
    // Add to local array
    setExpenses((prev) => [...prev, pendingData]);
    toast.success("Expense submitted!");
    // close modal
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  const cancelSubmit = () => {
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* FORM */}
      <ExpenseForm onValidSubmit={handleValidSubmit} />

      {/* TABLE */}
      <ExpenseTable expenses={expenses} />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onRequestClose={cancelSubmit}
        onConfirm={confirmSubmit}
      />
    </div>
  );
}