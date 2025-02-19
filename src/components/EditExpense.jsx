// EditExpense.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Expense } from "@/models";
import ExpenseForm from "@/components/ExpenseForm";
import { toast } from "react-hot-toast";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const expenseFormRef = useRef(null);

  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    const fetchExpenseById = async () => {
      try {
        const found = await DataStore.query(Expense, id);
        if (!found) {
          toast.error("Expense not found!");
          navigate("/expenses");
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

  // Called when the user submits the form
  const handleUpdateExpense = async (formData) => {
    try {
      const updated = await DataStore.save(
        Expense.copyOf(currentExpense, (updated) => {
          Object.assign(updated, formData);
        })
      );
      toast.success("Expense updated successfully!");
      navigate("/expenses");
    } catch (error) {
      console.error("[EditExpense] update error:", error);
      toast.error("Failed to update expense.");
    }
  };

  if (!currentExpense) {
    return <div style={{ padding: 20 }}>Loading expense...</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h2 className="text-xl mb-4">Edit Expense</h2>
      <ExpenseForm
        ref={expenseFormRef}
        editingExpense={currentExpense}
        onValidSubmit={handleUpdateExpense}
      />
    </div>
  );
}
