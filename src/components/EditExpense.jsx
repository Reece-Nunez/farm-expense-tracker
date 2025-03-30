import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Expense } from "@/models";
import ExpenseForm from "@/components/ExpenseForm";
import { toast } from "react-hot-toast";
import GenericModal from "./GenericModal";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const expenseFormRef = useRef(null);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => { });

  useEffect(() => {
    const fetchExpenseById = async () => {
      try {
        const found = await DataStore.query(Expense, id);
        if (!found) {
          toast.error("Expense not found!");
          navigate("/dashboard/expenses");
          return;
        }
        setCurrentExpense(found);
      } catch (error) {
        toast.error("Error fetching expense.");
        console.error("[EditExpense] fetch error:", error);
      }
    };
    fetchExpenseById();
  }, [id, navigate]);

  const handleUpdateExpense = async (formattedExpense) => {
    setConfirmMessage("Are you sure you want to update this expense?");
    setConfirmAction(() => async () => {
      try {
        const updated = await DataStore.save(
          Expense.copyOf(currentExpense, (updated) => {
            // Explicitly update receiptImageKey + other fields
            updated.date = formattedExpense.date;
            updated.vendor = formattedExpense.vendor;
            updated.description = formattedExpense.description;
            updated.receiptImageKey = formattedExpense.receiptImageKey;
            updated.lineItems = formattedExpense.lineItems;
            updated.grandTotal = formattedExpense.grandTotal;
          })
        );
        toast.success("Expense updated successfully!");
        navigate("/dashboard/expenses");
      } catch (error) {
        console.error("[EditExpense] update error:", error);
        toast.error("Failed to update expense.");
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };


  if (!currentExpense) {
    return <div className="p-8 text-center">Loading expense...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Expense</h2>
        <ExpenseForm
          ref={expenseFormRef}
          editingExpense={currentExpense}
          onValidSubmit={handleUpdateExpense}
        />
      </div>
      {showConfirm && (
        <GenericModal
          isOpen={showConfirm}
          onRequestClose={() => setShowConfirm(false)}
          onConfirm={confirmAction}
          title="Confirm Update"
          message={confirmMessage}
        />
      )}
    </div>
  );
}