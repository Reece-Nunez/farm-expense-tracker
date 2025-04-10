import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getExpense as getExpenseQuery, listLineItems } from "@/graphql/queries";
import { updateExpense as updateExpenseMutation } from "@/graphql/mutations";
import ExpenseForm from "@/components/Expenses/ExpenseForm";
import { toast } from "react-hot-toast";
import GenericModal from "../Util/GenericModal";
import { getCurrentUser } from "@/utils/getCurrentUser";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const expenseFormRef = useRef(null);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});

  useEffect(() => {
    const fetchExpenseById = async () => {
      try {
        const client = generateClient();
  
        // Fetch base expense info
        const res = await client.graphql({
          query: getExpenseQuery,
          variables: { id },
        });
  
        const found = res?.data?.getExpense;
  
        if (!found) {
          toast.error("Expense not found!");
          navigate("/dashboard/expenses");
          return;
        }
  
        // Fetch associated line items
        const lineItemRes = await client.graphql({
          query: listLineItems,
          variables: {
            filter: {
              expenseID: { eq: id },
            },
            limit: 1000,
          },
        });
  
        const lineItems = lineItemRes?.data?.listLineItems?.items || [];
  
        const transformedLineItems = lineItems.map((li) => ({
          item: li.item || "",
          category: li.category || "",
          unitCost: typeof li.unitCost === "number" ? li.unitCost.toString() : li.unitCost || "",
          quantity: typeof li.quantity === "number" ? li.quantity.toString() : li.quantity || "",
        }));
  
        setCurrentExpense({
          ...found,
          lineItems: transformedLineItems,
        });
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
        const client = generateClient();
        const currentUser = await getCurrentUser();
        if(!currentUser) return;

        const input = {
          id: currentExpense.id,
          date: formattedExpense.date,
          vendor: formattedExpense.vendor,
          description: formattedExpense.description,
          receiptImageKey: formattedExpense.receiptImageKey,
          lineItems: formattedExpense.lineItems,
          grandTotal: formattedExpense.grandTotal,
          userId: currentUser.id,
        };

        await client.graphql({
          query: updateExpenseMutation,
          variables: { input },
        });

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
    <div className="max-w-8xl mx-4 p-8">
      <div className="bg-white rounded-2xl shadow p-4">
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
