import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import Dashboard from "./components/Dashboard";
import ExpenseTable from "@/components/ExpenseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpenseTable />} />
        <Route path="/add-expense" element={<ExpenseForm />} />
        <Route path="/add-income" element={<IncomeForm />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/confirm" element={<ConfirmationModal />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
