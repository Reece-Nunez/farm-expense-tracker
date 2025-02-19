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
import { toast } from "react-hot-toast";
import Modal from "react-modal";

import Dashboard from "./components/Dashboard";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import EditExpense from "./components/EditExpense";
import IncomeTable from "./components/IncomeTable";
import EditIncome from "./components/EditIncome";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import GenericModal from "./components/GenericModal";

import { Expense, Income } from "./models";

Amplify.configure({ ...awsExports });
Modal.setAppElement("#root");

function AppContent() {
  // -------------- State Declarations --------------
  const [authChecked, setAuthChecked] = useState(false);

  // Expense states
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [pendingExpense, setPendingExpense] = useState(null);

  // Income states
  const [fetchedIncomes, setFetchedIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);

  // Generic modal state for confirmations (can be used for expense or income actions)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {}); // function to run on confirm
  const [confirmMessage, setConfirmMessage] = useState("");

  // Generic modal state for deletions (can be used for expense or income deletions)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(() => {}); // function to run on deletion confirm
  const [deleteMessage, setDeleteMessage] = useState("");

  // Form refs
  const expenseFormRef = useRef(null);
  const incomeFormRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // -------------- Effects --------------
  useEffect(() => {
    console.log("[AppContent] Mounted. (Force sign-out is disabled)");
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await DataStore.query(Expense);
        setFetchedExpenses(allExpenses);
      } catch (error) {
        console.error("[fetchExpenses] Error:", error);
      }
    };
    fetchExpenses();

    const expenseSub = DataStore.observe(Expense).subscribe((msg) => {
      if (["INSERT", "UPDATE", "DELETE"].includes(msg.opType)) {
        fetchExpenses();
      }
    });
    return () => expenseSub.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const allIncome = await DataStore.query(Income);
        setFetchedIncomes(allIncome);
      } catch (error) {
        console.error("[fetchIncome] Error:", error);
      }
    };
    fetchIncome();
  }, []);

  // -------------- Expense Handlers --------------
  const handleExpenseSubmit = (data) => {
    // Set the confirmation message
    setConfirmMessage("Are you sure you want to accept this expense?");

    // Set the confirm action to a function that saves the expense
    setConfirmAction(() => async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session.tokens.idToken.payload.sub;
        let newExpense;
        if (editingExpense) {
          newExpense = await DataStore.save(
            Expense.copyOf(editingExpense, (updated) => {
              Object.assign(updated, data);
              updated.userId = userId;
            })
          );
        } else {
          newExpense = await DataStore.save(new Expense({ ...data, userId }));
        }
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
        console.error("[handleExpenseSubmit] Error saving expense:", error);
        toast.error("Failed to save expense.");
      } finally {
        setConfirmMessage("");
        setConfirmAction(() => {});
        setShowConfirmModal(false);
        expenseFormRef.current?.resetForm();
      }
    });

    // Show the confirmation modal
    setShowConfirmModal(true);
  };

  const handleExpenseEdit = (expense) => {
    // For editing, navigate to a dedicated edit page (or open a modal)
    navigate(`/edit-expense/${expense.id}`);
  };

  const handleExpenseDelete = (id) => {
    // Set up a generic delete confirmation
    setDeleteMessage("Are you sure you want to delete this expense?");
    setDeleteAction(() => async () => {
      try {
        const record = await DataStore.query(Expense, id);
        if (!record) {
          toast.error("Expense not found.");
          return;
        }
        await DataStore.delete(record);
        setFetchedExpenses((prev) => prev.filter((exp) => exp.id !== id));
        toast.success("Expense deleted successfully!");
      } catch (error) {
        console.error("[handleExpenseDelete] Error:", error);
        toast.error("Failed to delete expense.");
      } finally {
        setShowDeleteModal(false);
      }
    });
    setShowDeleteModal(true);
  };

  // -------------- Income Handlers --------------
  const handleIncomeSubmit = (incomeData) => {
    // Set the confirmation message for income submission
    setConfirmMessage("Are you sure you want to accept this income?");

    // Set the confirm action to save the income record
    setConfirmAction(() => async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session.tokens.idToken.payload.sub;
        let newIncome;
        if (editingIncome) {
          newIncome = await DataStore.save(
            Income.copyOf(editingIncome, (updated) => {
              Object.assign(updated, incomeData);
              updated.userId = userId;
            })
          );
          toast.success("Income updated successfully!");
          setEditingIncome(null);
        } else {
          newIncome = await DataStore.save(
            new Income({ ...incomeData, userId })
          );
          toast.success("Income added successfully!");
        }
        setFetchedIncomes((prev) =>
          editingIncome
            ? prev.map((inc) => (inc.id === newIncome.id ? newIncome : inc))
            : [...prev, newIncome]
        );
      } catch (error) {
        console.error("[handleIncomeSubmit] Error:", error);
        toast.error("Failed to save income.");
      } finally {
        // Clear the confirmation message and action, hide the modal, and reset the form.
        setConfirmMessage("");
        setConfirmAction(() => {});
        setShowConfirmModal(false);
        incomeFormRef.current?.resetForm();
      }
    });

    // Show the confirmation modal
    setShowConfirmModal(true);
  };

  const handleIncomeEdit = (income) => {
    navigate(`/edit-income/${income.id}`);
  };

  const handleIncomeDelete = (id) => {
    setDeleteMessage("Are you sure you want to delete this income?");
    setDeleteAction(() => async () => {
      try {
        const record = await DataStore.query(Income, id);
        if (!record) {
          toast.error("Income record not found.");
          return;
        }
        await DataStore.delete(record);
        setFetchedIncomes((prev) => prev.filter((inc) => inc.id !== id));
        toast.success("Income deleted successfully!");
      } catch (error) {
        console.error("[handleIncomeDelete] Error:", error);
        toast.error("Failed to delete income.");
      } finally {
        setShowDeleteModal(false);
      }
    });
    setShowDeleteModal(true);
  };

  // -------------- Render --------------
  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  return (
    <>
      <AppRoutes
        // Expense handlers
        fetchedExpenses={fetchedExpenses}
        handleExpenseEdit={handleExpenseEdit}
        handleExpenseDelete={handleExpenseDelete}
        handleExpenseSubmit={handleExpenseSubmit}
        expenseFormRef={expenseFormRef}
        // Income handlers
        fetchedIncomes={fetchedIncomes}
        handleIncomeEdit={handleIncomeEdit}
        handleIncomeDelete={handleIncomeDelete}
        handleIncomeSubmit={handleIncomeSubmit}
        incomeFormRef={incomeFormRef}
      />

      {/* Generic Confirmation Modal (for delete or confirm actions) */}
      {showConfirmModal && (
        <GenericModal
          isOpen={showConfirmModal}
          onRequestClose={() => setShowConfirmModal(false)}
          onConfirm={confirmAction}
          title="Confirm Submission"
          message={confirmMessage}
          confirmText="Submit"
        />
      )}

      {/* Generic Delete Modal */}
      {showDeleteModal && (
        <GenericModal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          onConfirm={deleteAction}
          title="Confirm Deletion"
          message={deleteMessage}
          confirmText="Delete"
        />
      )}
    </>
  );
}

function AppRoutes({
  fetchedExpenses,
  handleExpenseEdit,
  handleExpenseDelete,
  handleExpenseSubmit,
  expenseFormRef,

  fetchedIncomes,
  handleIncomeEdit,
  handleIncomeDelete,
  handleIncomeSubmit,
  incomeFormRef,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Expense Routes */}
        <Route
          path="/expenses"
          element={
            <ExpenseTable
              expenses={fetchedExpenses}
              onEdit={handleExpenseEdit}
              onDelete={handleExpenseDelete}
            />
          }
        />
        <Route
          path="/add-expense"
          element={
            <ExpenseForm
              ref={expenseFormRef}
              onValidSubmit={handleExpenseSubmit}
            />
          }
        />
        <Route path="/edit-expense/:id" element={<EditExpense />} />

        {/* Income Routes */}
        <Route
          path="/income"
          element={
            <IncomeTable
              incomes={fetchedIncomes}
              onEdit={handleIncomeEdit}
              onDelete={handleIncomeDelete}
            />
          }
        />
        <Route
          path="/add-income"
          element={
            <IncomeForm
              ref={incomeFormRef}
              onValidSubmit={handleIncomeSubmit}
            />
          }
        />
        <Route path="/edit-income/:id" element={<EditIncome />} />

        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Authenticator>
        {({ user }) => {
          console.debug("[Authenticator] User signed in:", user);
          return <AppContent />;
        }}
      </Authenticator>
    </Router>
  );
}

export default App;
