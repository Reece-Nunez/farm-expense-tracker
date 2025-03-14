import React, { useEffect, useState, useMemo } from "react";
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

// =========================
// 🎨 Chart Colors
// =========================
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8D99AE",
  "#2B2D42",
  "#EF233C",
  "#FDCB82",
  "#70C1B3",
  "#247BA0",
  "#FF1654",
  "#00CFC1",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
  "#073B4C",
  "#E63946",
  "#F1FAEE",
  "#A8DADC",
  "#457B9D",
  "#1D3557",
];

// =========================
// 🚀 Dashboard Component
// =========================
export default function Dashboard() {
  // -------------------------
  // STATE & HOOKS
  // -------------------------
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------
  // FETCH DATA
  // -------------------------
  const fetchData = async () => {
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
  };

  // -------------------------
  // CALCULATIONS
  // -------------------------
  const totalExpense = expenses.reduce(
    (sum, e) => sum + (e.grandTotal || 0),
    0
  );
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const net = totalIncome - totalExpense;

  const aggregatedData = useMemo(
    () => aggregateData(timeRange, expenses, incomes),
    [timeRange, expenses, incomes]
  );
  const expenseCategoryData = getExpenseCategoryData(expenses);
  const totalCategoryAmount = expenseCategoryData.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const incomeItemData = getIncomeItemData(incomes);

  // -------------------------
  // RENDER JSX
  // -------------------------
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr]">
      <Header />

      <div className="hidden md:block"></div>

      <main className="p-6 space-y-6">
        <SummaryCards
        className="text-green-500"
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          net={net}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LineChartCard
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            data={aggregatedData}
          />
          <PieChartCard
            data={expenseCategoryData}
            total={totalCategoryAmount}
          />
        </div>

        <IncomeItemPieChart data={incomeItemData} />
      </main>

      <AsidePanel
        recentExpenses={recentExpenses}
        recentIncomes={recentIncomes}
      />
    </div>
  );
}

//
// =========================
// ⛏️ Helper Functions
// =========================
//
const getWeekString = (dateStr) => {
  const date = new Date(dateStr);
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${week.toString().padStart(2, "0")}`;
};

const getKeyByTimeRange = (dateStr, groupBy) => {
  if (groupBy === "month") return dateStr.slice(0, 7);
  if (groupBy === "week") return getWeekString(dateStr);
  return dateStr.slice(0, 10);
};

const aggregateData = (groupBy, expenses = [], incomes = []) => {
  const dataMap = {};

  expenses.forEach((exp) => {
    if (!exp.date) return;
    let key = getKeyByTimeRange(exp.date, groupBy);
    if (!dataMap[key]) dataMap[key] = { expenses: 0, incomes: 0 };
    dataMap[key].expenses += exp.grandTotal || 0;
  });

  incomes.forEach((inc) => {
    if (!inc.date) return;
    let key = getKeyByTimeRange(inc.date, groupBy);
    if (!dataMap[key]) dataMap[key] = { expenses: 0, incomes: 0 };
    dataMap[key].incomes += inc.amount || 0;
  });

  return Object.keys(dataMap)
    .sort()
    .map((key) => ({
      period: key,
      expenses: parseFloat(dataMap[key].expenses.toFixed(2)),
      incomes: parseFloat(dataMap[key].incomes.toFixed(2)),
    }));
};

const getExpenseCategoryData = (expenses = []) => {
  const map = {};
  expenses.forEach((exp) => {
    exp.lineItems?.forEach((li) => {
      const cat = li.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + (li.lineTotal || 0);
    });
  });

  return Object.entries(map).map(([category, total]) => ({
    category,
    total,
  }));
};

const getIncomeItemData = (incomes = []) => {
  const map = {};
  incomes.forEach((inc) => {
    const item = inc.item || "Other";
    map[item] = (map[item] || 0) + (inc.amount || 0);
  });

  return Object.entries(map).map(([item, total]) => ({
    item,
    total,
  }));
};

//
// =========================
// 🧩 Extracted Components
// =========================
//
const Header = () => (
  <header className="md:col-span-3 bg-white border-b border-gray-400 p-6 flex items-center justify-between">
    <h1 className="text-2xl font-extrabold">Financial Dashboard</h1>
  </header>
);

const SummaryCards = ({ totalExpense, totalIncome, net }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <Card title="Total Expenses" value={totalExpense} color="red" />
    <Card title="Total Income" value={totalIncome} color="green" />
    <Card
      title="Net (Income - Expenses)"
      value={net}
      color={net >= 0 ? "green" : "red"}
    />
  </div>
);

const Card = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className={`text-2xl font-bold text-${color}-500`}>
      ${value.toFixed(2)}
    </h2>
  </div>
);

const LineChartCard = ({ timeRange, setTimeRange, data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h2 className="text-lg font-semibold mb-2">
      Expenses vs. Income Over Time
    </h2>

    <div className="flex justify-end mb-4">
      {["day", "week", "month"].map((range) => (
        <button
          key={range}
          className={`px-3 py-1 rounded ${
            timeRange === range ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTimeRange(range)}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </button>
      ))}
    </div>

    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis tickCount={10} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#f87171"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="incomes"
            name="Income"
            stroke="#4ade80"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PieChartCard = ({ data, total }) => {
  const [chartSize, setChartSize] = useState({
    outerRadius: 200,
    innerRadius: 150,
    height: 510,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile
        setChartSize({
          outerRadius: 100,
          innerRadius: 60,
          height: 300,
        });
      } else if (width < 1028) {
        // Tablet
        setChartSize({
          outerRadius: 150,
          innerRadius: 100,
          height: 400,
        });
      } else {
        // Desktop
        setChartSize({
          outerRadius: 200,
          innerRadius: 150,
          height: 510,
        });
      }
    };

    // Initial call on mount
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Expenses by Category
      </h2>

      <div className="flex justify-center items-center mb-6">
        <ResponsiveContainer width="100%" height={chartSize.height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              outerRadius={chartSize.outerRadius}
              innerRadius={chartSize.innerRadius}
              paddingAngle={4}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Total"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percent = total > 0 ? (item.total / total) * 100 : 0;
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
  );
};

const IncomeItemPieChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h2 className="text-lg font-semibold mb-2">Income by Item</h2>
    {data.length > 0 ? (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="item"
              outerRadius={100}
              paddingAngle={3}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
);

const AsidePanel = ({ recentExpenses, recentIncomes }) => (
  <aside className="hidden md:block p-6 border-1 border-gray-400 bg-white">
    <RecentList title="Recent Expenses" items={recentExpenses} isExpense />
    <button
      onClick={() => window.location.assign("/expenses")}
      className="mb-8 w-full text-blue-600 hover:underline text-sm"
    >
      View All Expenses
    </button>

    <RecentList title="Recent Incomes" items={recentIncomes} />
    <button
      onClick={() => window.location.assign("/income")}
      className="mt-4 w-full text-blue-600 hover:underline text-sm"
    >
      View All Incomes
    </button>
  </aside>
);

const RecentList = ({ title, items, isExpense = false }) => (
  <>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="space-y-2 mb-6">
      {items.length ? (
        items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100"
          >
            <div>
              <p className="text-sm font-medium">
                {isExpense ? item.vendor : item.item}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            <p
              className={`text-sm font-bold ${
                isExpense ? "text-red-500" : "text-green-600"
              }`}
            >
              {isExpense
                ? `-$${item.grandTotal?.toFixed(2)}`
                : `+$${item.amount?.toFixed(2)}`}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">
          No recent {isExpense ? "expenses" : "incomes"} found.
        </p>
      )}
    </div>
  </>
);
