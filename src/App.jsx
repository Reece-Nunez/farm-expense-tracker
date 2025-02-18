// App.jsx
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
  const [authChecked, setAuthChecked] = useState(false);
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [pendingExpense, setPendingExpense] = useState(null);

  const expenseFormRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("[AppContent] Mounted. (Force sign-out is disabled for now)");
    /*
    const forceSignOut = async () => {
      try {
        console.log("[forceSignOut] Calling signOut()...");
        await signOut();
        console.log("[forceSignOut] Sign out successful. Clearing storage...");
        sessionStorage.clear();
        localStorage.clear();
      } catch (error) {
        console.error("[forceSignOut] Error signing out:", error);
      } finally {
        console.log("[forceSignOut] Setting authChecked to true.");
        setAuthChecked(true);
      }
    };
    forceSignOut();
    */
    // Set authChecked to true immediately for testing
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    console.debug("[AppContent] Fetching expenses from DataStore...");
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

  const handleExpenseSubmit = (data) => {
    console.debug("[handleExpenseSubmit] Received expense data:", data);
    setPendingExpense(data);
    // Navigate to /confirm with the current location as background
    console.debug(
      "[handleExpenseSubmit] Navigating to /confirm with background:",
      location
    );
    navigate("/confirm", { state: { background: location } });
  };

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
        "[confirmExpenseSubmit] Navigating back (-1) and clearing pending expense."
      );
      // Navigate back to the background location (expense form)
      navigate(-1);
      setPendingExpense(null);
      // Call the reset method on the form via the ref
      expenseFormRef.current?.resetForm();
    }
  };

  const handleEdit = (expense) => {
    console.debug("[handleEdit] Editing expense:", expense);
    setEditingExpense(expense);
  };

  const handleExpenseDelete = (id) => {
    console.debug("[handleExpenseDelete] Deleting expense with id:", id);
    setShowDeleteModal(true);
    setExpenseToDelete(id);
  };

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
        <Route path="/delete" element={<DeleteModal />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* Render the confirmation modal as a modal route */}
      {background && (
        <Routes>
          <Route
            path="/confirm"
            element={
              <ConfirmationModal
                isOpen={true}
                onRequestClose={() => {
                  console.debug(
                    "[ConfirmationModal] onRequestClose called, navigating back."
                  );
                  navigate(-1);
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
