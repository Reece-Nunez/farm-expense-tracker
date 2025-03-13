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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DataStore } from "@aws-amplify/datastore";
import { Expense, Income } from "@/models";

const COLORS = [
  "#FF6384", // Red/Pink
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#8D99AE", // Cool Gray
  "#2B2D42", // Dark Gray
  "#EF233C", // Deep Red
  "#FDCB82", // Light Orange
  "#70C1B3", // Mint
  "#247BA0", // Dark Cyan
  "#FF1654", // Vivid Red
  "#00CFC1", // Cyan
  "#FFD166", // Soft Yellow
  "#06D6A0", // Green Mint
  "#118AB2", // Blue Shade
  "#073B4C", // Deep Blue
  "#E63946", // Coral Red
  "#F1FAEE", // Off-White
  "#A8DADC", // Light Teal
  "#457B9D", // Dusty Blue
  "#1D3557"  // Navy Blue
];


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

        const sortedExpenses = [...allExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedIncomes = [...allIncomes].sort((a, b) => new Date(b.date) - new Date(a.date));

        setRecentExpenses(sortedExpenses.slice(0, 5));
        setRecentIncomes(sortedIncomes.slice(0, 5));
        setExpenses(allExpenses);
        setIncomes(allIncomes);
      } catch (err) {
        console.error("Error fetching data for Dashboard:", err);
      }
    })();
  }, []);

  // Totals
  const totalExpense = expenses.reduce((sum, e) => sum + (e.grandTotal || 0), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const net = totalIncome - totalExpense;

  // Monthly line chart data
  const monthlyDataMap = {};
  expenses.forEach((exp) => {
    if (!exp.date) return;
    const monthKey = exp.date.slice(0, 7);
    if (!monthlyDataMap[monthKey]) monthlyDataMap[monthKey] = { expenses: 0, incomes: 0 };
    monthlyDataMap[monthKey].expenses += exp.grandTotal || 0;
  });
  incomes.forEach((inc) => {
    if (!inc.date) return;
    const monthKey = inc.date.slice(0, 7);
    if (!monthlyDataMap[monthKey]) monthlyDataMap[monthKey] = { expenses: 0, incomes: 0 };
    monthlyDataMap[monthKey].incomes += inc.amount || 0;
  });
  const combinedLineData = Object.keys(monthlyDataMap).sort().map((month) => ({
    month,
    expenses: parseFloat(monthlyDataMap[month].expenses.toFixed(2)),
    incomes: parseFloat(monthlyDataMap[month].incomes.toFixed(2)),
  }));

  // Expense categories (sum of line items)
  const expenseCategoryMap = {};
  expenses.forEach((exp) => {
    if (!exp.lineItems) return;
    exp.lineItems.forEach((li) => {
      const cat = li.category || "Uncategorized";
      expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + (li.lineTotal || 0);
    });
  });
  const expenseCategoryData = Object.entries(expenseCategoryMap).map(([category, total]) => ({
    category,
    total,
  }));

  // Calculate total for percentage bars
  const totalCategoryAmount = expenseCategoryData.reduce((sum, item) => sum + item.total, 0);

  // Income item data
  const incomeItemMap = {};
  incomes.forEach((inc) => {
    const item = inc.item || "Other";
    incomeItemMap[item] = (incomeItemMap[item] || 0) + (inc.amount || 0);
  });
  const incomeItemData = Object.entries(incomeItemMap).map(([item, total]) => ({
    item,
    total,
  }));

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr]">
      {/* HEADER */}
      <header className="md:col-span-3 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Financial Dashboard</h1>
      </header>

      <div className="hidden md:block"></div>

      {/* MAIN CONTENT */}
      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-red-500">${totalExpense.toFixed(2)}</h2>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</h2>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Net (Income - Expenses)</p>
            <h2 className={`text-2xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${net.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Line Chart */}
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

          {/* Donut Chart + Breakdown */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-center">Expenses by Category</h2>

            <div className="flex justify-center items-center mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    dataKey="total"
                    nameKey="category"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Total"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Bar Breakdown */}
            <div className="space-y-4">
              {expenseCategoryData.map((item, index) => {
                const percent = totalCategoryAmount > 0 ? (item.total / totalCategoryAmount) * 100 : 0;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{item.category}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Income by Item Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Income by Item</h2>
          {incomeItemData.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={incomeItemData}
                    dataKey="total"
                    nameKey="item"
                    outerRadius={100}
                    paddingAngle={3}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeItemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Total"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No income records found.</p>
          )}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="hidden md:block p-6 border-l border-gray-200 bg-white">
        <h2 className="text-lg font-semibold mb-2">Recent Expenses</h2>
        <div className="space-y-2 mb-6">
          {recentExpenses.length ? (
            recentExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100">
                <div>
                  <p className="text-sm font-medium">{exp.vendor}</p>
                  <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-bold text-red-500">-${exp.grandTotal?.toFixed(2)}</p>
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
