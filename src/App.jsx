import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import Dashboard from "./components/Dashboard";
import ExpenseTable from "@/components/ExpenseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteModal from "@/components/DeleteModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { Amplify } from "aws-amplify";
import { signOut } from "@aws-amplify/auth";
import awsExports from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import { DataStore } from "@aws-amplify/datastore";
import { Expense } from "./models";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import { fetchAuthSession } from "@aws-amplify/auth";

Amplify.configure({
  ...awsExports,
  API: {
    graphql_endpoint: awsExports.aws_appsync_graphqlEndpoint,
    graphql_endpoint_iam_region: awsExports.aws_project_region,
    graphql_headers: async () => ({
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
    }),
  },
});
Modal.setAppElement("#root");

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    const forceSignOut = async () => {
      try {
        await signOut();
        sessionStorage.clear();
        localStorage.clear();
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    forceSignOut();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const allExpenses = await DataStore.query(Expense);
      setFetchedExpenses(allExpenses);
    };
    fetchData();
  }, []);

  const handleExpenseSubmit = async (data) => {
    try {
      // Convert date field to a string in "YYYY-MM-DD" format if it's a Date object.
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split("T")[0];
      }

      const session = await fetchAuthSession();
      const userId = session.idToken.payload.sub;

      if (editingExpense) {
        const updatedExpense = await DataStore.save(
          Expense.copyOf(editingExpense, (updated) => {
            Object.assign(updated, data);
            updated.userId = userId;
          })
        );
        setFetchedExpenses((prev) =>
          prev.map((exp) =>
            exp.id === updatedExpense.id ? updatedExpense : exp
          )
        );
        setEditingExpense(null);
      } else {
        // For a new expense, you need to create an instance.
        const newExpense = await DataStore.save(
          new Expense({ ...data, userId })
        );
        setFetchedExpenses((prev) => [...prev, newExpense]);
      }
      toast.success(
        editingExpense
          ? "Expense updated successfully!"
          : "Expense successfully added!"
      );
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense.");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleExpenseDelete = (id) => {
    setShowDeleteModal(true);
    setExpenseToDelete(id); // store ID
  };

  // 2. Actually delete
  const handleDelete = async () => {
    try {
      // first, query the actual Expense object by that ID
      const toDelete = await DataStore.query(Expense, expenseToDelete);
      if (toDelete) {
        await DataStore.delete(toDelete);

        setFetchedExpenses((prev) =>
          prev.filter((exp) => exp.id !== expenseToDelete)
        );

        toast.success("Expense deleted successfully!");
      } else {
        toast.error("Expense not found in DataStore.");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    } finally {
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/expenses"
              element={
                <ExpenseTable
                  expenses={fetchedExpenses}
                  onEdit={handleEdit}
                  onDelete={handleExpenseDelete}
                />
              }
            />
            <Route
              path="/add-expense"
              element={
                <ExpenseForm
                  onValidSubmit={handleExpenseSubmit}
                  editingExpense={editingExpense}
                />
              }
            />
            <Route path="/add-income" element={<IncomeForm />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/confirm" element={<ConfirmationModal />} />
            <Route path="/delete" element={<DeleteModal />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Modal
            isOpen={showDeleteModal}
            onRequestClose={() => setShowDeleteModal(false)}
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this expense?</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white">
                Delete
              </Button>
            </div>
          </Modal>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
