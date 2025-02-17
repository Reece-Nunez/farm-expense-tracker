import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { deleteExpense } from "@/graphql/mutations";
import { API } from "aws-amplify";

export default function ExpenseTable({ expenses, onEdit }) {
  if (!expenses.length) {
    return null; // nothing to show
  }

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await API.graphql({
        query: deleteExpense,
        variables: { input: { id: expenseId } },
      });
      toast.success("Expense deleted successfully");
      window.location.reload(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-4 rounded-xl shadow bg-white mt-6">
      <CardHeader className="text-xl font-bold mb-2">Submitted Expenses</CardHeader>
      <CardContent>
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Cost</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{exp.dateStr}</td>
                <td className="p-2 border">{exp.category}</td>
                <td className="p-2 border">{exp.item}</td>
                <td className="p-2 border">{exp.vendor}</td>
                <td className="p-2 border">${exp.unitCost}</td>
                <td className="p-2 border">{exp.quantity}</td>
                <td className="p-2 border">${exp.totalCost.toFixed(2)}</td>
                <td className="p-2 border">{exp.description || ""}</td>
                <td className="p-2 border flex gap-2">
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white" onClick={() => onEdit(exp)}>Edit</Button>
                  <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={() => handleDelete(exp.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
