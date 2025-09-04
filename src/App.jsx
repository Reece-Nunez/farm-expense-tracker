import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";
import "../AuthOverides.css";
import DataMigrationUI from "./components/Util/DataMigrationUI";
import { getCurrentUser } from "./utils/getCurrentUser";
// Amplify configuration moved to main.jsx
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { signOut } from "aws-amplify/auth";
import { useLoading, LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FarmProvider } from "./context/FarmContext";
import { deleteIncomeSafe } from "./graphql/customMutations";
import GlobalLoadingSpinner from "./components/Util/GlobalLoadingSpinner";
import {
  deleteExpense,
  deleteIncome,
  createIncome,
  updateIncome,
  deleteLineItem,
} from "./graphql/mutations";
import {
  listExpenses as listExpensesQuery,
  listIncomes as listIncomesQuery,
  listLineItems,
} from "./graphql/queries";
import { getExpense as getExpenseQuery } from "./graphql/queries";
import AuthPageLayout from "./components/Auth/AuthPageLayout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";
import AuthGate from "./components/Auth/AuthGate";
import GenericModal from "./components/Util/GenericModal";
import { uploadData } from "aws-amplify/storage";
import LandingPage from "./components/Main/LandingPage";
import About from "./components/Main/About";
import Contact from "./components/Main/Contact";
import Dashboard from "./components/Main/Dashboard";
import ExpenseTable from "./components/Expenses/ExpenseTable";
import ExpenseForm from "./components/Expenses/ExpenseForm";
import IncomeForm from "./components/Income/IncomeForm";
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
import LivestockMedicalRecords from "./components/Livestock/LivestockMedicalRecords";
import LivestockMedicalForm from "./components/Livestock/LivestockMedicalForm";
import FloatingDonationButton from "./components/Util/FloatingDonationButton";
import InvoicesPage from "./pages/InvoicesPage";
import CustomersPage from "./pages/CustomersPage";
import ReceiptScanPage from "./pages/ReceiptScanPage";
import InventoryPage from "./pages/InventoryPage";
import TeamPage from "./pages/TeamPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FarmSettingsPage from "./pages/FarmSettingsPage";

// Amplify configuration moved to main.jsx
Modal.setAppElement("#root");

export default function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <FarmProvider>
          <Authenticator.Provider>
            <GlobalLoadingSpinner />
            <Router>
              <AppInner />
            </Router>
          </Authenticator.Provider>
        </FarmProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

function EditExpenseWrapper({ onSubmit }) {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    async function fetch() {
      const client = generateClient();
      const res = await client.graphql({
        query: getExpenseQuery,
        variables: { id },
      });
      const data = res.data.getExpense;
      const liRes = await client.graphql({
        query: listLineItems,
        variables: { filter: { expenseID: { eq: id } }, limit: 1000 },
      });
      const items = liRes.data.listLineItems.items;
      setExpense({
        id: data.id,
        vendor: data.vendor,
        date: data.date,
        description: data.description,
        receiptImageKey: data.receiptImageKey,
        lineItems: items.map((li) => ({
          item: li.item,
          category: li.category,
          unitCost: li.unitCost.toString(),
          quantity: li.quantity.toString(),
        })),
      });
    }
    fetch();
  }, [id]);

  if (!expense) return <div>Loading...</div>;
  return <ExpenseForm defaultValues={expense} onValidSubmit={onSubmit} />;
}

function AppInner() {
  const [authChecked, setAuthChecked] = useState(false);
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [fetchedIncomes, setFetchedIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => { });
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(() => { });
  const [deleteMessage, setDeleteMessage] = useState("");
  const incomeFormRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoading } = useLoading();
  const client = generateClient();
  const [pendingExpenseData, setPendingExpenseData] = useState(null);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const shouldFetch = location.pathname === "/dashboard/expenses";
    if (!shouldFetch) return;

    async function fetchExpenses() {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        const res = await client.graphql({
          query: listExpensesQuery,
          variables: {
            filter: {
              and: [{ userId: { eq: user.id } }, { sub: { eq: user.sub } }],
            },
            limit: 1000,
          },
        });
        setFetchedExpenses(res.data.listExpenses.items);
      } catch (error) {
        console.error("[fetchExpenses] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, [location.pathname]);


  useEffect(() => {
    async function fetchIncome() {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        const res = await client.graphql({
          query: listIncomesQuery,
          variables: {
            filter: {
              and: [{ userId: { eq: user.id } }, { sub: { eq: user.sub } }],
            },
            limit: 1000,
          },
        });
        setFetchedIncomes(res.data.listIncomes.items);
      } catch (error) {
        console.error("[fetchIncome] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIncome();
  }, [setIsLoading]);

  useEffect(() => {
    const AUTO_LOGOUT_TIME = 60 * 60 * 1000;
    let inactivityTimer;
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        toast("Logging out due to inactivity...");
        signOut();
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

  useEffect(() => {
    const handle = (e) => {
      const validatedFormData = e.detail;
      setPendingExpenseData(validatedFormData);
      setConfirmMessage("Are you sure you want to accept this expense?");
      setConfirmAction(() => () => handleExpenseSubmit(validatedFormData));
      setShowConfirmModal(true);
    };

    window.addEventListener("expenseFormReady", handle);
    return () => window.removeEventListener("expenseFormReady", handle);
  }, []);

  const handleExpenseSubmit = async (validatedFormData) => {
    setIsLoading(true);
    const client = generateClient();

    try {
      const user = await getCurrentUser();
      const isoDate = validatedFormData.date
        ? new Date(validatedFormData.date).toISOString().split("T")[0]
        : "";

      let receiptImageKey = validatedFormData.receiptImageKey || null;
      if (validatedFormData.receiptFile && validatedFormData.receiptFile[0]) {
        if (receiptImageKey) {
          try {
            await fetch(
              `https://farmexpensetrackerreceipts94813-main.s3.amazonaws.com/${receiptImageKey}`,
              {
                method: "DELETE",
              }
            );
          } catch (deleteErr) {
            console.warn("Failed to delete old image:", deleteErr);
          }
        }
        const file = validatedFormData.receiptFile[0];
        const fileKey = `receipts/${Date.now()}_${file.name}`;
        const upload = uploadData({
          path: fileKey,
          data: file,
          options: { contentType: file.type },
        });
        await upload.result;
        receiptImageKey = fileKey;
        toast.success("Receipt uploaded successfully!");
      }

      const lineItems = validatedFormData.lineItems.map((li) => {
        const unitCost = parseFloat(li.unitCost || 0);
        const quantity = parseFloat(li.quantity || 0);
        return {
          ...li,
          unitCost,
          quantity,
          lineTotal: unitCost * quantity,
        };
      });

      const grandTotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

      const input = {
        vendor: validatedFormData.vendor,
        description: validatedFormData.description,
        date: isoDate,
        receiptImageKey,
        grandTotal,
        userId: user.id,
        sub: user.sub,
      };

      let createdExpense;
      if (validatedFormData.id) {
        const result = await client.graphql({
          query: /* GraphQL */ `
            mutation UpdateExpense($input: UpdateExpenseInput!) {
              updateExpense(input: $input) {
                id
              }
            }
          `,
          variables: { input: { ...input, id: validatedFormData.id } },
        });

        createdExpense = result.data.updateExpense;

        const lineItemRes = await client.graphql({
          query: listLineItems,
          variables: {
            filter: { expenseID: { eq: validatedFormData.id } },
            limit: 1000,
          },
        });

        const oldLineItems = lineItemRes?.data?.listLineItems?.items || [];
        await Promise.all(
          oldLineItems.map((li) =>
            client.graphql({
              query: /* GraphQL */ `
                mutation DeleteLineItem($input: DeleteLineItemInput!) {
                  deleteLineItem(input: $input) {
                    id
                  }
                }
              `,
              variables: { input: { id: li.id } },
            })
          )
        );

        setFetchedExpenses((prev) =>
          prev.map((e) => (e.id === createdExpense.id ? createdExpense : e))
        );
        setEditingExpense(null);
        toast.success("Expense updated successfully!");
      } else {
        const result = await client.graphql({
          query: /* GraphQL */ `
            mutation CreateExpense($input: CreateExpenseInput!) {
              createExpense(input: $input) {
                id
                vendor
                date
                grandTotal
                description
                receiptImageKey
              }
            }
          `,
          variables: { input },
        });

        createdExpense = result.data.createExpense;
        setFetchedExpenses((prev) => [...prev, createdExpense]);
        toast.success("Expense successfully added!");
      }

      await Promise.all(
        lineItems.map((li) =>
          client.graphql({
            query: /* GraphQL */ `
              mutation CreateLineItem($input: CreateLineItemInput!) {
                createLineItem(input: $input) {
                  id
                }
              }
            `,
            variables: {
              input: {
                expenseID: createdExpense.id,
                item: li.item,
                category: li.category,
                unitCost: li.unitCost,
                quantity: li.quantity,
                lineTotal: li.lineTotal,
                sub: user.sub,
              },
            },
          })
        )
      );
    } catch (error) {
      console.error("[handleExpenseSubmit] Error:", error);
      toast.error("Failed to save expense.");
    } finally {
      setIsLoading(false);
      setConfirmMessage("");
      setConfirmAction(() => { });
      setShowConfirmModal(false);
      navigate(-1);
    }
  };

  const handleExpenseDelete = (id) => {
    setDeleteMessage("Are you sure you want to delete this expense?");
    setDeleteAction(() => async () => {
      setIsLoading(true);
      const client = generateClient();

      try {
        const res = await client.graphql({
          query: listLineItems,
          variables: {
            filter: { expenseID: { eq: id } },
            limit: 1000,
          },
        });

        const itemsToDelete = res?.data?.listLineItems?.items || [];
        await Promise.all(
          itemsToDelete.map((item) =>
            client.graphql({
              query: /* GraphQL */ `
                mutation DeleteLineItem($input: DeleteLineItemInput!) {
                  deleteLineItem(input: $input) {
                    id
                  }
                }
              `,
              variables: { input: { id: item.id } },
            })
          )
        );

        await client.graphql({
          query: /* GraphQL */ `
            mutation DeleteExpense($input: DeleteExpenseInput!) {
              deleteExpense(input: $input) {
                id
              }
            }
          `,
          variables: { input: { id } },
        });

        setFetchedExpenses((prev) => prev.filter((e) => e.id !== id));
        toast.success("Expense and its line items deleted successfully.");
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

  const handleExpenseEdit = (expense) =>
    navigate(`/dashboard/edit-expense/${expense.id}`);

  const handleIncomeSubmit = (incomeData) => {
    setConfirmMessage("Are you sure you want to accept this income?");
    setConfirmAction(() => async () => {
      setIsLoading(true);
      const client = generateClient();

      try {
        const user = await getCurrentUser();

        if (editingIncome) {
          const updated = await client.graphql({
            query: updateIncome,
            variables: {
              input: {
                ...incomeData,
                userId: user.id,
                sub: user.sub,
              },
            },
          });
          setFetchedIncomes((prev) =>
            prev.map((i) =>
              i.id === updated.data.updateIncome.id
                ? updated.data.updateIncome
                : i
            )
          );
          setEditingIncome(null);
          toast.success("Income updated successfully!");
        } else {
          const created = await client.graphql({
            query: createIncome,
            variables: {
              input: {
                ...incomeData,
                userId: user.id,
                sub: user.sub,
              },
            },
          });
          setFetchedIncomes((prev) => [...prev, created.data.createIncome]);
          toast.success("Income added successfully!");
        }
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

  const handleIncomeEdit = (income) =>
    navigate(`/dashboard/edit-income/${income.id}`);

  const handleIncomeDelete = (id) => {
    setDeleteMessage("Are you sure you want to delete this income?");
    setDeleteAction(() => async () => {
      setIsLoading(true);
      const client = generateClient();

      try {
        await client.graphql({
          query: deleteIncomeSafe,
          variables: { input: { id } },
        });
        setFetchedIncomes((prev) => prev.filter((i) => i.id !== id));
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

  if (!authChecked)
    return <div style={{ padding: 20 }}>Checking authentication...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/util/debug" element={<DebugComponent />} />
        <Route element={<AuthPageLayout />}>
          <Route path="/auth" element={<AuthGate />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="admin/migrate" element={<DataMigrationUI />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="inventory/livestock" element={<LivestockManager />} />
          <Route
            path="inventory/livestock/:animalId"
            element={<LivestockProfile />}
          />
          <Route path="inventory/chickens" element={<ChickenManager />} />
          <Route path="inventory/fields" element={<FieldManager />} />
          <Route
            path="inventory/inventory-items"
            element={<InventoryItemManager />}
          />
          <Route
            path="inventory/livestock/:animalId/medical-records"
            element={<LivestockMedicalRecords />}
          />
          <Route
            path="inventory/livestock/:animalId/medical-records/new"
            element={<LivestockMedicalForm />}
          />
          <Route index element={<Dashboard />} />
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
            element={<ExpenseForm onValidSubmit={handleExpenseSubmit} />}
          />
          <Route
            path="edit-expense/:id"
            element={<EditExpenseWrapper onSubmit={handleExpenseSubmit} />}
          />{" "}
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
          <Route path="scan-receipt" element={<ReceiptScanPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="inventory-management" element={<InventoryPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="farm-settings" element={<FarmSettingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="import-csv" element={<ImportExpensesCSV />} />
          <Route path="import-income" element={<ImportIncomeCSV />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

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
      <FloatingDonationButton />
    </>
  );
}
