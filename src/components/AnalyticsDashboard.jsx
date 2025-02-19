import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Expense, Income } from "../models";

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const allExpenses = await DataStore.query(Expense);
      const groupedExpenses = allExpenses.reduce((acc, curr) => {
        acc[curr.category] =
          (acc[curr.category] || 0) + parseFloat(curr.totalCost || 0);
        return acc;
      }, {});
      setExpenses(
        Object.entries(groupedExpenses).map(([category, amount]) => ({
          category,
          amount,
        }))
      );
    };

    const fetchIncome = async () => {
      const allIncome = await DataStore.query(Income);
      const groupedIncome = allIncome.reduce((acc, curr) => {
        acc[curr.item] =
          (acc[curr.item] || 0) + parseFloat(curr.amount || 0);
        return acc;
      }, {});
      setIncome(
        Object.entries(groupedIncome).map(([item, amount]) => ({
          item,
          amount,
        }))
      );
    };

    fetchExpenses();
    fetchIncome();
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <Card className="max-w-6xl mx-auto p-6 mb-6">
      <CardHeader className="text-2xl font-bold flex items-center justify-center mb-6">
        Farm Analytics
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                expenses.length
                  ? expenses
                  : [{ category: "No Data", amount: 0 }]
              }
            >
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Income Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={income.length ? income : [{ item: "No Data", amount: 0 }]}
                dataKey="amount"
                nameKey="item"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {(income.length
                  ? income
                  : [{ item: "No Data", amount: 0 }]
                ).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
