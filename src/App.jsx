import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import Dashboard from "./components/Dashboard";
import ExpenseTable from "@/components/ExpenseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { Amplify } from "aws-amplify";
import { signOut } from "@aws-amplify/auth";
import awsExports from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import { DataStore } from "@aws-amplify/datastore";
import { Expense } from "./models";
import { toast } from 'react-hot-toast';

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

function App() {
  const [authChecked, setAuthChecked] = useState(false);

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

  if (!authChecked) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  const handleExpenseSubmit = async (data) => {
    try {
      const newExpense = await DataStore.save(
        new Expense({
          userId: data.userId || "currentUserId", // Replace with actual user logic
          date: data.dateStr,
          category: data.category,
          item: data.item,
          vendor: data.vendor,
          unitCost: parseFloat(data.unitCost),
          quantity: parseInt(data.quantity),
          totalCost: parseFloat(data.totalCost),
          description: data.description || "",
        })
      );

      console.log("Expense successfully saved:", newExpense);
      toast.success("Expense successfully added!");
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense.");
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpenseTable />} />
            <Route
              path="/add-expense"
              element={<ExpenseForm onValidSubmit={handleExpenseSubmit} />}
            />
            <Route path="/add-income" element={<IncomeForm />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/confirm" element={<ConfirmationModal />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
