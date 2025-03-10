// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DataStore } from "@aws-amplify/datastore";
import { Expense, Income } from "@/models";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [allExpenses, allIncomes] = await Promise.all([
          DataStore.query(Expense),
          DataStore.query(Income),
        ]);

        const sortedExpenses = [...allExpenses].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const sortedIncomes = [...allIncomes].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setRecentExpenses(sortedExpenses.slice(0, 5));
        setRecentIncomes(sortedIncomes.slice(0, 5));
        setExpenses(allExpenses);
        setIncomes(allIncomes);
      } catch (err) {
        console.error("Error fetching data for Dashboard:", err);
      }
    })();
  }, []);

  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.totalCost || 0), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const net = totalIncome - totalExpense;

  // Combined line chart data (group by month)
  const monthlyDataMap = {};
  expenses.forEach((exp) => {
    if (!exp.date) return;
    const monthKey = exp.date.slice(0, 7);
    monthlyDataMap[monthKey] = (monthlyDataMap[monthKey] || { expenses: 0, incomes: 0 });
    monthlyDataMap[monthKey].expenses += exp.totalCost || 0;
  });
  incomes.forEach((inc) => {
    if (!inc.date) return;
    const monthKey = inc.date.slice(0, 7);
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { expenses: 0, incomes: 0 };
    }
    monthlyDataMap[monthKey].incomes += inc.amount || 0;
  });
  const combinedLineData = Object.keys(monthlyDataMap)
    .sort()
    .map((month) => ({
      month,
      expenses: monthlyDataMap[month].expenses,
      incomes: monthlyDataMap[month].incomes,
    }));

  // Expense Categories Bar Chart
  const expenseCategoryMap = {};
  expenses.forEach((exp) => {
    const cat = exp.category || "Uncategorized";
    expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + (exp.totalCost || 0);
  });
  const expenseCategoryData = Object.entries(expenseCategoryMap).map(([category, total]) => ({
    category,
    total,
  }));

  // Income by Item Pie Chart
  const incomeItemMap = {};
  incomes.forEach((inc) => {
    const item = inc.item || "Other";
    incomeItemMap[item] = (incomeItemMap[item] || 0) + (inc.amount || 0);
  });
  const incomeItemData = Object.entries(incomeItemMap).map(([item, total]) => ({
    item,
    total,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a78bfa", "#f87171"];

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr]">
      {/* HEADER */}
      <header className="md:col-span-3 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Financial Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Extra controls can be added here */}
        </div>
      </header>

      {/* For md+ screens, leave an empty space where sidebar is provided by DashboardLayout */}
      <div className="hidden md:block"></div>

      {/* MAIN CONTENT */}
      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-red-500">
              ${totalExpense.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Net (Income - Expenses)</p>
            <h2 className={`text-2xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${net.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Combined Line Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Expenses vs. Income Over Time</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={combinedLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} />
                  <Line type="monotone" dataKey="incomes" name="Income" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2-Chart Grid for Expense Categories & Income by Item */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
              {expenseCategoryData.length > 0 ? (
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={expenseCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(val) => [`$${val}`, "Total"]} />
                      <Bar dataKey="total" fill="#fbbf24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2">No expenses found.</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Income by Item</h2>
              {incomeItemData.length > 0 ? (
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={incomeItemData}
                        dataKey="total"
                        nameKey="item"
                        outerRadius={80}
                        label={(entry) => `$${entry.value.toFixed(0)}`}
                      >
                        {incomeItemData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [`$${val}`, "Total"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2">No income records found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL: Only visible on md+ */}
      <aside className="hidden md:block p-6 border-l border-gray-200 bg-white">
        {/* Recent Expenses */}
        <h2 className="text-lg font-semibold mb-2">Recent Expenses</h2>
        <div className="space-y-2 mb-6">
          {recentExpenses.length ? (
            recentExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100">
                <div>
                  <p className="text-sm font-medium">{exp.item}</p>
                  <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-bold text-red-500">-${exp.totalCost?.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent expenses found.</p>
          )}
        </div>
        <button
          onClick={() => window.location.assign("/expenses")}
          className="mb-8 w-full text-blue-600 hover:underline text-sm"
        >
          View All Expenses
        </button>

        {/* Recent Incomes */}
        <h2 className="text-lg font-semibold mb-2">Recent Incomes</h2>
        <div className="space-y-2">
          {recentIncomes.length ? (
            recentIncomes.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100">
                <div>
                  <p className="text-sm font-medium">{inc.item}</p>
                  <p className="text-xs text-gray-500">{new Date(inc.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-bold text-green-600">+${inc.amount?.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent incomes found.</p>
          )}
        </div>
        <button
          onClick={() => window.location.assign("/income")}
          className="mt-4 w-full text-blue-600 hover:underline text-sm"
        >
          View All Incomes
        </button>
      </aside>
    </div>
  );
}
