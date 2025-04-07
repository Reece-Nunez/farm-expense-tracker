// App.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import { signOut } from "@aws-amplify/auth";

import { useLoading, LoadingProvider } from "./context/LoadingContext";
import GlobalLoadingSpinner from "./components/Util/GlobalLoadingSpinner";

// Models
import { Expense, Income } from "./models";

// Custom
import AuthPageLayout from "./components/Auth/AuthPageLayout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";
import AuthGate from "./components/Auth/AuthGate";
import { fixOwnerField } from "./utils/fixOwnerField";
import GenericModal from "./components/Util/GenericModal";

// Pages
import LandingPage from "./components/Main/LandingPage";
import About from "./components/Main/About";
import Contact from "./components/Main/Contact";
import Dashboard from "./components/Main/Dashboard";
import ExpenseTable from "./components/Expenses/ExpenseTable";
import ExpenseForm from "./components/Expenses/ExpenseForm";
import IncomeForm from "./components/Income/IncomeForm";
import EditExpense from "./components/Expenses/EditExpense";
import IncomeTable from "./components/Income/IncomeTable";
import EditIncome from "./components/Income/EditIncome";
import Reports from "./components/Other/Reports";
import ImportExpensesCSV from "./components/CSV/ImportExpensesCSV";
import ImportIncomeCSV from "./components/CSV/ImportIncomeCSV";
import Profile from "./components/Other/Profile";
import LivestockManager from "./components/Inventory/LivestockManager";
import InventoryDashboard from "./components/Inventory/InventoryDashboard";
import LivestockProfile from "./components/Livestock/LivestockProfile";
import ChickenManager from "./components/Inventory/ChickenManager";
import FieldManager from "./components/Inventory/FieldManager";
import InventoryItemManager from "./components/Inventory/InventoryItemManager";
import DebugComponent from "./components/Util/DebugComponent";
import ClearDataStoreOnce from "./components/Util/ClearDataStoreOnce";
import LivestockMedicalRecords from "./components/Livestock/LivestockMedicalRecords";
import LivestockMedicalForm from "./components/Livestock/LivestockMedicalForm";

// Amplify init
Amplify.configure({ ...awsExports });
DataStore.start();
Modal.setAppElement("#root");

/**
 * 1) The top-level App just sets up Providers + Router.
 *    It does NOT call useNavigate/useLocation.
 */
export default function App() {
  return (
    <LoadingProvider>
      <Authenticator.Provider>
        <GlobalLoadingSpinner />
        <Router>
          {/* We render our "inner" app logic inside <Router> so hooks work */}
          <AppInner />
        </Router>
      </Authenticator.Provider>
    </LoadingProvider>
  );
}

/**
 * 2) AppInner has all your logic: states, side effects, useNavigate, etc.
 *    Because AppInner is rendered inside <Router>, the React Router hooks
 *    are safe to use (no "invalid hook call" error).
 */
function AppInner() {
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

  // We can safely call these router hooks here:
  const navigate = useNavigate();
  const location = useLocation();

  // Our loading context
  const { setIsLoading } = useLoading();

  // -------------- Effects --------------

  // 1) Mark auth as checked
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  // 2) Fix the owner field once on app load
  useEffect(() => {
    fixOwnerField();
  }, []);

  // 3) Fetch & subscribe to expenses
  useEffect(() => {
    async function fetchExpenses() {
      setIsLoading(true);
      try {
        const session = await fetchAuthSession();
        const userSub = session.tokens.idToken.payload.sub;
        console.log("[fetchExpenses] Current user sub:", userSub);

        const userExpenses = await DataStore.query(Expense, (e) =>
          e.userId.eq(userSub)
        );
        setFetchedExpenses(userExpenses);
      } catch (error) {
        console.error("[fetchExpenses] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
    const expenseSub = DataStore.observe(Expense).subscribe((msg) => {
      if (["INSERT", "UPDATE", "DELETE"].includes(msg.opType)) {
        fetchExpenses();
      }
    });

    return () => expenseSub.unsubscribe();
  }, [setIsLoading]);

  // 4) Fetch & subscribe to all incomes
  useEffect(() => {
    async function fetchIncome() {
      setIsLoading(true);
      try {
        const allIncome = await DataStore.query(Income);
        setFetchedIncomes(allIncome);
      } catch (error) {
        console.error("[fetchIncome] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncome();
    const incomeSub = DataStore.observe(Income).subscribe((msg) => {
      if (["INSERT", "UPDATE", "DELETE"].includes(msg.opType)) {
        fetchIncome();
      }
    });

    return () => incomeSub.unsubscribe();
  }, [setIsLoading]);

  // 5) Auto logout after inactivity
  useEffect(() => {
    const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 1 hour
    let inactivityTimer;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        toast("Logging out due to inactivity...");
        signOut(); // Logs the user out
      }, AUTO_LOGOUT_TIME);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(inactivityTimer);
    };
  }, []);

  // -------------- Expense Handlers --------------
  const handleExpenseSubmit = (formattedExpense) => {
    setConfirmMessage("Are you sure you want to accept this expense?");
    setConfirmAction(() => async () => {
      setIsLoading(true);
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
        setIsLoading(false);
        setConfirmMessage("");
        setConfirmAction(() => { });
        setShowConfirmModal(false);
        expenseFormRef.current?.resetForm();
      }
    });
    setShowConfirmModal(true);
  };

  const handleExpenseEdit = (expense) => {
    navigate(`/dashboard/edit-expense/${expense.id}`);
  };

  const handleExpenseDelete = (id) => {
    setDeleteMessage("Are you sure you want to delete this expense?");
    setDeleteAction(() => async () => {
      setIsLoading(true);
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
        setIsLoading(false);
        setShowDeleteModal(false);
      }
    });
    setShowDeleteModal(true);
  };

  // -------------- Income Handlers --------------
  const handleIncomeSubmit = (incomeData) => {
    setConfirmMessage("Are you sure you want to accept this income?");
    setConfirmAction(() => async () => {
      setIsLoading(true);
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
        setIsLoading(false);
        setConfirmMessage("");
        setConfirmAction(() => { });
        setShowConfirmModal(false);
        incomeFormRef.current?.resetForm();
      }
    });
    setShowConfirmModal(true);
  };

  const handleIncomeEdit = (income) => {
    navigate(`/dashboard/edit-income/${income.id}`);
  };

  const handleIncomeDelete = (id) => {
    setDeleteMessage("Are you sure you want to delete this income?");
    setDeleteAction(() => async () => {
      setIsLoading(true);
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
        setIsLoading(false);
        setShowDeleteModal(false);
      }
    });
    setShowDeleteModal(true);
  };

  // -------------- Render --------------
  // If auth check not done, show a quick loader
  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  return (
    <>
      {/* Your nested routes: these define the site’s entire routing */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/util/debug" element={<DebugComponent />} />

        {/* Auth route */}
        <Route element={<AuthPageLayout />}>
          <Route path="/auth" element={<AuthGate />} />
        </Route>

        {/* Private /dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="inventory/livestock" element={<LivestockManager />} />
          <Route path="inventory/livestock/:animalId" element={<LivestockProfile />} />
          <Route path="inventory/chickens" element={<ChickenManager />} />
          <Route path="inventory/fields" element={<FieldManager />} />
          <Route path="inventory/inventory-items" element={<InventoryItemManager />} />
          <Route
            path="inventory/livestock/:animalId/medical-records"
            element={<LivestockMedicalRecords />}
          />
          <Route path="inventory/livestock/:animalId/medical-records/new" element={<LivestockMedicalForm />} />

          {/* index => /dashboard */}
          <Route index element={<Dashboard />} />

          {/* Expenses */}
          <Route
            path="expenses"
            element={
              <ExpenseTable
                expenses={fetchedExpenses}
                onEdit={handleExpenseEdit}
                onDelete={handleExpenseDelete}
              />
            }
          />
          <Route
            path="add-expense"
            element={
              <ExpenseForm
                ref={expenseFormRef}
                onValidSubmit={handleExpenseSubmit}
              />
            }
          />
          <Route path="edit-expense/:id" element={<EditExpense />} />

          {/* Income */}
          <Route
            path="income"
            element={
              <IncomeTable
                incomes={fetchedIncomes}
                onEdit={handleIncomeEdit}
                onDelete={handleIncomeDelete}
              />
            }
          />
          <Route
            path="add-income"
            element={
              <IncomeForm
                ref={incomeFormRef}
                onValidSubmit={handleIncomeSubmit}
              />
            }
          />
          <Route path="edit-income/:id" element={<EditIncome />} />

          {/* Additional pages */}
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="import-csv" element={<ImportExpensesCSV />} />
          <Route path="import-income" element={<ImportIncomeCSV />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

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
