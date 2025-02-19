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
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { signOut } from "@aws-amplify/auth";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

import Dashboard from "./components/Dashboard";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import ConfirmationModal from "./components/ConfirmationModal";
import DeleteModal from "./components/DeleteModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import EditExpense from "./components/EditExpense";

import { Expense, Income } from "./models/index";

Amplify.configure({ ...awsExports });
Modal.setAppElement("#root");

/**
 * The main content component that manages state for Expenses & Incomes.
 */
function AppContent() {
  // -------------- State Declarations --------------
  const [authChecked, setAuthChecked] = useState(false);

  // Expense states
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [pendingExpense, setPendingExpense] = useState(null);

  // Income states
  const [fetchedIncomes, setFetchedIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);

  // Form refs (to reset the forms from parent if needed)
  const expenseFormRef = useRef(null);
  const incomeFormRef = useRef(null);

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // -------------- Effects --------------
  // 1. On mount, skip forced sign-out, just set authChecked
  useEffect(() => {
    console.log("[AppContent] Mounted. (Force sign-out is disabled for now)");
    setAuthChecked(true);
  }, []);

  // 2. Fetch Expenses once on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await DataStore.query(Expense);
        console.debug("[fetchExpenses] Fetched expenses:", allExpenses);
        setFetchedExpenses(allExpenses);
      } catch (error) {
        console.error("[fetchExpenses] Error fetching expenses:", error);
      }
    };
    fetchExpenses();
    const subscription = DataStore.observe(Expense).subscribe((msg) => {
      if (
        msg.opType === "INSERT" ||
        msg.opType === "UPDATE" ||
        msg.opType === "DELETE"
      ) {
        // re-fetch the entire list
        console.debug("[DataStore.observe] Expense changed, re-fetching...");
        fetchExpenses();
      }
    });
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // 3. Fetch Incomes once on mount
  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const allIncome = await DataStore.query(Income);
        console.debug("[fetchIncomes] Fetched incomes:", allIncome);
        setFetchedIncomes(allIncome);
      } catch (error) {
        console.error("[fetchIncomes] Error fetching incomes:", error);
      }
    };
    fetchIncome();
  }, []);

  // -------------- Expense Handlers --------------
  /** Called when the ExpenseForm is submitted (but before confirmation). */
  const handleExpenseSubmit = (data) => {
    console.debug("[handleExpenseSubmit] Received expense data:", data);
    setPendingExpense(data);
    console.debug("[handleExpenseSubmit] Navigating to /confirm");
    // Navigate to the confirm route with background
    navigate("/confirm", { state: { background: location } });
  };

  /** Actually save the expense to DataStore after confirmation. */
  const confirmExpenseSubmit = async () => {
    console.debug("[confirmExpenseSubmit] Confirming expense submission...", {
      pendingExpense,
      editingExpense,
    });
    if (!pendingExpense) return;

    try {
      const session = await fetchAuthSession();
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
      // Update local state
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
      // Clear pendingExpense, reset form, and navigate
      setPendingExpense(null);
      expenseFormRef.current?.resetForm();

      if (location.state?.background) {
        navigate(-1);
      } else {
        navigate("/dashboard");
      }
    }
  };

  /** Edit an existing expense (opens the expense form for editing). */
  const handleEdit = (expense) => {
    console.debug("[handleEdit] Editing expense:", expense);
    setEditingExpense(expense);
  };

  /** Prompt to delete an expense. */
  const handleExpenseDelete = (id) => {
    console.debug("[handleExpenseDelete] Deleting expense with id:", id);
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  /** Actually delete the expense. */
  const handleDelete = async () => {
    console.debug(
      "[handleDelete] Attempting to delete expense:",
      expenseToDelete
    );
    try {
      const toDelete = await DataStore.query(Expense, expenseToDelete);
      if (!toDelete) {
        toast.error("Expense not found in DataStore.");
        return;
      }
      await DataStore.delete(toDelete);
      console.debug("[handleDelete] Expense deleted:", expenseToDelete);
      setFetchedExpenses((prev) =>
        prev.filter((exp) => exp.id !== expenseToDelete)
      );
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("[handleDelete] Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    } finally {
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  // -------------- Income Handlers --------------
  /** Called when the IncomeForm is submitted. */
  const handleIncomeSubmit = async (incomeData) => {
    console.log("[AppContent] handleIncomeSubmit received:", incomeData);
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens.idToken.payload.sub;

      let newIncome;
      if (editingIncome) {
        // If editing an existing income
        newIncome = await DataStore.save(
          Income.copyOf(editingIncome, (updated) => {
            Object.assign(updated, incomeData);
            updated.userId = userId;
          })
        );
        toast.success("Income updated successfully!");
        setEditingIncome(null);
      } else {
        // If creating a new income
        newIncome = await DataStore.save(
          new Income({ ...incomeData, userId: userId })
        );
        toast.success("Income added successfully!");
      }
      console.log("[AppContent] Income saved:", newIncome);

      // Update local state
      setFetchedIncomes((prev) =>
        editingIncome
          ? prev.map((inc) => (inc.id === newIncome.id ? newIncome : inc))
          : [...prev, newIncome]
      );
    } catch (error) {
      console.error("[AppContent] Error saving income:", error);
      toast.error("Failed to save income.");
    } finally {
      // If you want to reset the IncomeForm
      incomeFormRef.current?.resetForm();
    }
  };

  // -------------- Render --------------
  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  console.debug("[AppContent] Rendering with location:", location);

  return (
    <>
      <AppRoutes
        // Expense states/handlers
        fetchedExpenses={fetchedExpenses}
        editingExpense={editingExpense}
        handleEdit={handleEdit}
        handleExpenseDelete={handleExpenseDelete}
        handleExpenseSubmit={handleExpenseSubmit}
        confirmExpenseSubmit={confirmExpenseSubmit}
        expenseFormRef={expenseFormRef}
        // Income states/handlers
        fetchedIncomes={fetchedIncomes}
        editingIncome={editingIncome}
        incomeFormRef={incomeFormRef}
        handleIncomeSubmit={handleIncomeSubmit}
      />

      {/* Delete Modal for expenses */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

/** Defines all routes. Receives the states and handlers as props. */
function AppRoutes({
  fetchedExpenses,
  editingExpense,
  handleEdit,
  handleExpenseDelete,
  handleExpenseSubmit,
  confirmExpenseSubmit,
  expenseFormRef,

  fetchedIncomes,
  editingIncome,
  handleIncomeSubmit,
  incomeFormRef,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Show the table of expenses */}
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

        {/* Edit Expenses */}
        <Route path="/edit-expense/:id" element={<EditExpense />} />

        {/* Add or edit an expense */}
        <Route
          path="/add-expense"
          element={
            <ExpenseForm
              ref={expenseFormRef}
              editingExpense={editingExpense}
              onValidSubmit={handleExpenseSubmit}
            />
          }
        />

        {/* Add or edit an income */}
        <Route
          path="/add-income"
          element={
            <IncomeForm
              ref={incomeFormRef}
              onValidSubmit={handleIncomeSubmit}
            />
          }
        />

        <Route path="/analytics" element={<AnalyticsDashboard />} />

        {/* Catch-all: go back to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* If there's a background, render the confirm modal route on top */}
      {background && (
        <Routes>
          <Route
            path="/confirm"
            element={
              <ConfirmationModal
                isOpen={true}
                onRequestClose={() => {
                  console.debug("[ConfirmationModal] onRequestClose called.");
                  if (background) {
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

/** The top-level App that wraps everything in Router & Authenticator. */
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
