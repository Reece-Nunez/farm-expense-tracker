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

  const totalExpense = expenses.reduce((sum, e) => sum + (e.grandTotal || 0), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const net = totalIncome - totalExpense;

  const monthlyDataMap = {};
  expenses.forEach((exp) => {
    if (!exp.date) return;
    const monthKey = exp.date.slice(0, 7);
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

  const combinedLineData = Object.keys(monthlyDataMap)
    .sort()
    .map((month) => ({
      month,
      expenses: parseFloat(monthlyDataMap[month].expenses.toFixed(2)),
      incomes: parseFloat(monthlyDataMap[month].incomes.toFixed(2)),
    }));

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
    <div className="h-full w-full overflow-x-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Financial Dashboard</h1>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-8 space-y-8">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-3xl font-bold text-red-500">
              ${totalExpense.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-3xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Net (Income - Expenses)</p>
            <h2 className={`text-3xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${net.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Expenses vs. Income Over Time</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Income by Item</h2>
            {incomeItemData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
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

        {/* FULL WIDTH EXPENSE CATEGORY CHART */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          {expenseCategoryData.length > 0 ? (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={expenseCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={200} />
                  <Tooltip formatter={(val) => [`$${val}`, "Total"]} />
                  <Bar dataKey="total" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No expenses found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
