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

// If you have "vendor", "grandTotal", "lineItems[]" in Expense,
// each lineItem has "category", "lineTotal", etc.

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

        // Sort by date descending
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

  // 1) TOTALS
  // We'll trust exp.grandTotal as the total cost for each expense
  const totalExpense = expenses.reduce((sum, e) => sum + (e.grandTotal || 0), 0);
  // For income, we assume inc.amount is the total
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const net = totalIncome - totalExpense;

  // 2) Monthly Data for the combined line chart
  // We'll group by "YYYY-MM" from expense.date, and sum grandTotal
  const monthlyDataMap = {};
  expenses.forEach((exp) => {
    if (!exp.date) return;
    const monthKey = exp.date.slice(0, 7); // "YYYY-MM"
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { expenses: 0, incomes: 0 };
    }
    monthlyDataMap[monthKey].expenses += exp.grandTotal || 0;
  });
  incomes.forEach((inc) => {
    if (!inc.date) return;
    const monthKey = inc.date.slice(0, 7);
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { expenses: 0, incomes: 0 };
    }
    monthlyDataMap[monthKey].incomes += inc.amount || 0;
  });

  // Build an array sorted by month
  const combinedLineData = Object.keys(monthlyDataMap)
    .sort()
    .map((month) => ({
      month,
      expenses: parseFloat(monthlyDataMap[month].expenses.toFixed(2)),
      incomes: parseFloat(monthlyDataMap[month].incomes.toFixed(2)),
    }));

  // 3) Expense Categories – we now sum them from lineItems
  // Because top-level "category" is gone, we loop over each expense's lineItems
  const expenseCategoryMap = {};
  expenses.forEach((exp) => {
    if (!exp.lineItems) return;
    exp.lineItems.forEach((li) => {
      const cat = li.category || "Uncategorized";
      expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + (li.lineTotal || 0);
    });
  });
  const expenseCategoryData = Object.entries(expenseCategoryMap).map(
    ([category, total]) => ({ category, total })
  );

  // 4) Income by item (same as your existing code, if you have inc.item & inc.amount)
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
      <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_300px] grid-rows-[auto_1fr] gap-4">

        {/* HEADER */}
        <header className="md:col-span-2 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-extrabold">Financial Dashboard</h1>
        </header>

        {/* MAIN CONTENT */}
        <main className="px-4 py-6 md:px-6 md:py-8 space-y-8">

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Total Expenses</p>
              <h2 className="text-3xl font-bold text-red-500">${totalExpense.toFixed(2)}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Total Income</p>
              <h2 className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Net (Income - Expenses)</p>
              <h2 className={`text-3xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${net.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div className="flex flex-col xl:flex-row gap-6">

            {/* Expenses vs. Income Over Time */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold mb-4">Expenses vs. Income Over Time</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={combinedLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={3} />
                  <Line type="monotone" dataKey="incomes" name="Income" stroke="#4ade80" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expenses by Category */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
              {expenseCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={expenseCategoryData} layout="vertical" barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={150} />
                    <Tooltip formatter={(val) => [`$${val}`, "Total"]} />
                    <Bar dataKey="total" fill="#fbbf24" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm mt-4">No expenses found.</p>
              )}
            </div>

          </div>

          {/* INCOME BY ITEM PIE */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Income by Item</h2>
            {incomeItemData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={incomeItemData}
                    dataKey="total"
                    nameKey="item"
                    outerRadius={120}
                    labelLine={false}
                    label={({ percent, item }) =>
                      `${item} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {incomeItemData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`$${val}`, "Total"]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm mt-4">No income records found.</p>
            )}
          </div>

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden md:block bg-white p-6 space-y-8 border-l border-gray-200">

          {/* Recent Expenses */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
            {recentExpenses.length > 0 ? (
              <div className="space-y-3">
                {recentExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">{exp.vendor}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-red-500">
                      -${exp.grandTotal?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent expenses found.</p>
            )}
            <button
              onClick={() => window.location.assign("/expenses")}
              className="mt-4 w-full text-blue-600 hover:underline text-sm"
            >
              View All Expenses
            </button>
          </div>

          {/* Recent Incomes */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Incomes</h2>
            {recentIncomes.length > 0 ? (
              <div className="space-y-3">
                {recentIncomes.map((inc) => (
                  <div
                    key={inc.id}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">{inc.item}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(inc.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      +${inc.amount?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent incomes found.</p>
            )}
            <button
              onClick={() => window.location.assign("/income")}
              className="mt-4 w-full text-blue-600 hover:underline text-sm"
            >
              View All Incomes
            </button>
          </div>
        </aside>
      </div>
    );
  }