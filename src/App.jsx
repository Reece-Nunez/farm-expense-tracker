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
import "../AuthOverides.css";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

// Your components
import Dashboard from "./components/Dashboard";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import EditExpense from "./components/EditExpense";
import IncomeTable from "./components/IncomeTable";
import EditIncome from "./components/EditIncome";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import GenericModal from "./components/GenericModal";
import ImportExpensesCSV from "./components/ImportExpensesCSV";
import ImportIncomeCSV from "./components/ImportIncomeCSV";
import { Expense, Income } from "./models";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Profile from "./components/Profile";
import { fixOwnerField } from "./utils/fixOwnerField";


// Amplify init
Amplify.configure({ ...awsExports });
Modal.setAppElement("#root");

// -------------------------
// Main App Content
// -------------------------
function AppContent() {
  // -------------- State --------------
  const [authChecked, setAuthChecked] = useState(false);

  // Expenses
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Incomes
  const [fetchedIncomes, setFetchedIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);

  // Generic confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => { });
  const [confirmMessage, setConfirmMessage] = useState("");

  // Generic delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(() => { });
  const [deleteMessage, setDeleteMessage] = useState("");

  // Form refs
  const expenseFormRef = useRef(null);
  const incomeFormRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // -------------- Effects --------------

  // 1) Mark auth as checked
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    // Fire it once when the app loads
    fixOwnerField();
  }, []);
  

  // 2) Fetch & subscribe to expenses for the current user
  useEffect(() => {
    async function fetchExpenses() {
      try {
        // 🔧 Clear and restart syncing to avoid stale cache
        await DataStore.clear();
        await DataStore.start(); // Optional: waits for sync (depends on setup)

        const session = await fetchAuthSession();
        const userSub = session.tokens.idToken.payload.sub;
        console.log("[fetchExpenses] Current user sub:", userSub);

        // Query AFTER clearing
        const userExpenses = await DataStore.query(Expense, (e) =>
          e.userId.eq(userSub)
        );
        console.log("[fetchExpenses] Type of userExpenses:", Array.isArray(userExpenses));
        console.log("[fetchExpenses] JSON:", JSON.stringify(userExpenses, null, 2));

        setFetchedExpenses(userExpenses);
      } catch (error) {
        console.error("[fetchExpenses] Error:", error);
      }
    }

    // 1) fetch once
    fetchExpenses();

    // 2) subscribe for real-time updates
    const expenseSub = DataStore.observe(Expense).subscribe((msg) => {
      if (["INSERT", "UPDATE", "DELETE"].includes(msg.opType)) {
        fetchExpenses();
      }
    });

    // cleanup subscription on unmount
    return () => expenseSub.unsubscribe();
  }, []);


  // 3) Fetch & subscribe to all incomes (no user filter?)
  useEffect(() => {
    async function fetchIncome() {
      try {
        const allIncome = await DataStore.query(Income);
        setFetchedIncomes(allIncome);
      } catch (error) {
        console.error("[fetchIncome] Error:", error);
      }
    }

    // fetch once
    fetchIncome();

    // subscribe
    const incomeSub = DataStore.observe(Income).subscribe((msg) => {
      if (["INSERT", "UPDATE", "DELETE"].includes(msg.opType)) {
        fetchIncome();
      }
    });

    return () => incomeSub.unsubscribe();
  }, []);

  // -------------- Expense Handlers --------------
  const handleExpenseSubmit = (formattedExpense) => {
    setConfirmMessage("Are you sure you want to accept this expense?");
    setConfirmAction(() => async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session.tokens.idToken.payload.sub;

        if (editingExpense) {
          // Edit existing expense
          const updatedExpense = await DataStore.save(
            Expense.copyOf(editingExpense, (updated) => {
              Object.assign(updated, formattedExpense);
              updated.userId = userId;
            })
          );
          setFetchedExpenses((prev) =>
            prev.map((exp) =>
              exp.id === updatedExpense.id ? updatedExpense : exp
            )
          );
          toast.success("Expense updated successfully!");
          setEditingExpense(null);
        } else {
          // Create new expense
          const newExpense = await DataStore.save(
            new Expense({ ...formattedExpense, userId })
          );
          setFetchedExpenses((prev) => [...prev, newExpense]);
          toast.success("Expense successfully added!");
        }
      } catch (error) {
        console.error("[handleExpenseSubmit] Error saving expense:", error);
        toast.error("Failed to save expense.");
      } finally {
        setConfirmMessage("");
        setConfirmAction(() => { });
        setShowConfirmModal(false);
        expenseFormRef.current?.resetForm();
      }
    });
    setShowConfirmModal(true);
  };

  const handleExpenseEdit = (expense) => {
    navigate(`/edit-expense/${expense.id}`);
  };

  const handleExpenseDelete = (id) => {
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
    setConfirmMessage("Are you sure you want to accept this income?");
    setConfirmAction(() => async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session.tokens.idToken.payload.sub;

        let newIncome;
        if (editingIncome) {
          // Update existing income
          newIncome = await DataStore.save(
            Income.copyOf(editingIncome, (updated) => {
              Object.assign(updated, incomeData);
              updated.userId = userId;
            })
          );
          toast.success("Income updated successfully!");
          setEditingIncome(null);
        } else {
          // Create new
          newIncome = await DataStore.save(
            new Income({ ...incomeData, userId })
          );
          toast.success("Income added successfully!");
        }
        // update local state
        setFetchedIncomes((prev) =>
          editingIncome
            ? prev.map((inc) => (inc.id === newIncome.id ? newIncome : inc))
            : [...prev, newIncome]
        );
      } catch (error) {
        console.error("[handleIncomeSubmit] Error:", error);
        toast.error("Failed to save income.");
      } finally {
        setConfirmMessage("");
        setConfirmAction(() => { });
        setShowConfirmModal(false);
        incomeFormRef.current?.resetForm();
      }
    });
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

  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  return (
    <>
      <AppRoutes
        // Expense
        fetchedExpenses={fetchedExpenses}
        handleExpenseEdit={handleExpenseEdit}
        handleExpenseDelete={handleExpenseDelete}
        handleExpenseSubmit={handleExpenseSubmit}
        expenseFormRef={expenseFormRef}

        // Income
        fetchedIncomes={fetchedIncomes}
        handleIncomeEdit={handleIncomeEdit}
        handleIncomeDelete={handleIncomeDelete}
        handleIncomeSubmit={handleIncomeSubmit}
        incomeFormRef={incomeFormRef}
      />

      {/* Confirmation Modal */}
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

      {/* Deletion Modal */}
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

// -------------------------
// Routing
// -------------------------
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
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Expenses */}
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
            <ExpenseForm ref={expenseFormRef} onValidSubmit={handleExpenseSubmit} />
          }
        />
        <Route path="/edit-expense/:id" element={<EditExpense />} />

        {/* Income */}
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
            <IncomeForm ref={incomeFormRef} onValidSubmit={handleIncomeSubmit} />
          }
        />
        <Route path="/edit-income/:id" element={<EditIncome />} />

        {/* Profile & CSV */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/import-csv" element={<ImportExpensesCSV />} />
        <Route path="/import-income" element={<ImportIncomeCSV />} />

        {/* Analytics */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Route>

      {/* Catch-all: If no route, go to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

// -------------------------
// Main Export
// -------------------------
function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", margin: ".5em" }}>Hi! Welcome to Harvest Hub</h2>
        <Authenticator>
          {({ user }) => {
            console.debug("[Authenticator] User signed in:", user);
            return <AppContent />;
          }}
        </Authenticator>
      </div>
    </Router>
  );
}

export default App;
