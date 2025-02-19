// AnalyticsDashboard.jsx
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
        acc[curr.item] = (acc[curr.item] || 0) + parseFloat(curr.amount || 0);
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Farm Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Expense Chart Card */}
          <Card className="p-6">
            <CardHeader className="text-2xl font-bold mb-4">
              Expenses by Category
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    expenses.length
                      ? expenses
                      : [{ category: "No Data", amount: 0 }]
                  }
                >
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Chart Card */}
          <Card className="p-6">
            <CardHeader className="text-2xl font-bold mb-4">
              Income Breakdown
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={
                      income.length ? income : [{ item: "No Data", amount: 0 }]
                    }
                    dataKey="amount"
                    nameKey="item"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(props) => {
                      const {
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                      } = props;
                      const RADIAN = Math.PI / 180;
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="black"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {`$${value}`}
                        </text>
                      );
                    }}
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
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
