import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
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
import { Expense } from "./models/index";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import { fetchAuthSession } from "@aws-amplify/auth";

Amplify.configure({ ...awsExports });
Modal.setAppElement("#root");

function AppContent() {
  // State declarations
  const [authChecked, setAuthChecked] = useState(false);
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [pendingExpense, setPendingExpense] = useState(null);

  // Create a ref for ExpenseForm (for resetting the form)
  const expenseFormRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // For testing, we disable forced sign-out so that the user stays signed in.
  useEffect(() => {
    console.log("[AppContent] Mounted. (Force sign-out is disabled for now)");
    setAuthChecked(true);
  }, []);

  // Always fetch expenses from DataStore (remove background check)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExpenses = await DataStore.query(Expense);
        console.debug("[fetchData] Fetched expenses:", allExpenses);
        setFetchedExpenses(allExpenses);
      } catch (error) {
        console.error("[fetchData] Error fetching expenses:", error);
      }
    };
    fetchData();
  }, []);

  // When the expense form is submitted, store the data and navigate to /confirm
  const handleExpenseSubmit = (data) => {
    console.debug("[handleExpenseSubmit] Received expense data:", data);
    setPendingExpense(data);
    console.debug(
      "[handleExpenseSubmit] Navigating to /confirm with background:",
      location
    );
    navigate("/confirm", { state: { background: location } });
  };

  // Confirm expense submission (from the confirmation modal)
  const confirmExpenseSubmit = async () => {
    console.debug("[confirmExpenseSubmit] Confirming expense submission...", {
      pendingExpense,
      editingExpense,
    });
    try {
      const session = await fetchAuthSession();
      console.debug("[confirmExpenseSubmit] Fetched auth session:", session);
      const userId = session.tokens.idToken.payload.sub;
      let newExpense;
      if (editingExpense) {
        console.debug("[confirmExpenseSubmit] Updating existing expense...");
        newExpense = await DataStore.save(
          Expense.copyOf(editingExpense, (updated) => {
            Object.assign(updated, pendingExpense);
            updated.userId = userId;
          })
        );
      } else {
        console.debug("[confirmExpenseSubmit] Saving new expense...");
        newExpense = await DataStore.save(
          new Expense({ ...pendingExpense, userId })
        );
      }
      console.debug("[confirmExpenseSubmit] Expense saved:", newExpense);
      setFetchedExpenses((prev) =>
        editingExpense
          ? prev.map((exp) => (exp.id === newExpense.id ? newExpense : exp))
          : [...prev, newExpense]
      );
      toast.success(
        editingExpense
          ? "Expense updated successfully!"
          : "Expense successfully added!"
      );
      setEditingExpense(null);
    } catch (error) {
      console.error("[confirmExpenseSubmit] Error saving expense:", error);
      toast.error("Failed to save expense.");
    } finally {
      console.debug(
        "[confirmExpenseSubmit] Navigating back and clearing pending expense."
      );
      // Navigate back to the expense form route
      if (location.state && location.state.background) {
        navigate(-1);
      } else {
        navigate("/dashboard");
      }
      setPendingExpense(null);
      expenseFormRef.current?.resetForm();
    }
  };

  // Edit an expense (opens the form for editing)
  const handleEdit = (expense) => {
    console.debug("[handleEdit] Editing expense:", expense);
    setEditingExpense(expense);
  };

  // When delete is clicked on an expense row, store its ID and show the delete modal
  const handleExpenseDelete = (id) => {
    console.debug("[handleExpenseDelete] Deleting expense with id:", id);
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle the deletion confirmation from the delete modal
  const handleDelete = async () => {
    console.debug(
      "[handleDelete] Attempting to delete expense with id:",
      expenseToDelete
    );
    try {
      const toDelete = await DataStore.query(Expense, expenseToDelete);
      if (toDelete) {
        await DataStore.delete(toDelete);
        console.debug("[handleDelete] Expense deleted:", expenseToDelete);
        setFetchedExpenses((prev) =>
          prev.filter((exp) => exp.id !== expenseToDelete)
        );
        toast.success("Expense deleted successfully!");
      } else {
        console.error("[handleDelete] Expense not found in DataStore.");
        toast.error("Expense not found in DataStore.");
      }
    } catch (error) {
      console.error("[handleDelete] Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    } finally {
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  if (!authChecked) {
    console.debug(
      "[AppContent] Auth not checked yet, displaying loading screen."
    );
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  console.debug(
    "[AppContent] Rendering AppRoutes with current location:",
    location
  );
  return (
    <>
      <AppRoutes
        fetchedExpenses={fetchedExpenses}
        handleEdit={handleEdit}
        handleExpenseDelete={handleExpenseDelete}
        editingExpense={editingExpense}
        handleExpenseSubmit={handleExpenseSubmit}
        confirmExpenseSubmit={confirmExpenseSubmit}
        expenseFormRef={expenseFormRef}
      />
      {/* Render the DeleteModal directly when state indicates */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onRequestClose={() => {
            // If no background exists, navigate to dashboard
            if (location.state && location.state.background) {
              setShowDeleteModal(false);
            } else {
              navigate("/dashboard");
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

function AppRoutes({
  fetchedExpenses,
  handleEdit,
  handleExpenseDelete,
  editingExpense,
  handleExpenseSubmit,
  confirmExpenseSubmit,
  expenseFormRef,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  console.debug(
    "[AppRoutes] Current location:",
    location,
    "Background:",
    background
  );

  return (
    <>
      <Routes location={background || location}>
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
              ref={expenseFormRef}
            />
          }
        />
        <Route path="/add-income" element={<IncomeForm />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/confirm"
            element={
              <ConfirmationModal
                isOpen={true}
                onRequestClose={() => {
                  console.debug("[ConfirmationModal] onRequestClose called.");
                  if (location.state && location.state.background) {
                    navigate(-1);
                  } else {
                    navigate("/dashboard");
                  }
                }}
                onConfirm={confirmExpenseSubmit}
              />
            }
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => {
          console.debug("[Authenticator] User signed in:", user);
          return <AppContent />;
        }}
      </Authenticator>
    </Router>
  );
}

export default App;
