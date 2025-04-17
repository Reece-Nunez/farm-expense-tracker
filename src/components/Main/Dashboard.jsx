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
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { listIncomes } from "@/graphql/queries";
import { useLoading } from "../../context/LoadingContext";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { LIST_EXPENSES_WITH_LINE_ITEMS } from "../../graphql/customQueries";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8D99AE",
  "#2B2D42",
  "#B5CDA3",
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

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [timeRange, setTimeRange] = useState("month");
  const { setIsLoading } = useLoading();
  const client = generateClient();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return;

      // Pass both id and sub
      await fetchDashboardData(
        user.id,
        user.sub,
        setExpenses,
        setIncomes,
        setRecentExpenses,
        setRecentIncomes,
        setIsLoading
      );
    })();
  }, []);

  const fetchDashboardData = async (
    userId,
    userSub,
    setExpenses,
    setIncomes,
    setRecentExpenses,
    setRecentIncomes,
    setIsLoading
  ) => {
    setIsLoading(true);
    try {
      const expenseRes = await client.graphql({
        query: LIST_EXPENSES_WITH_LINE_ITEMS,
        variables: {
          filter: {
            and: [{ userId: { eq: userId } }, { sub: { eq: userSub } }],
          },
          limit: 1000,
        },
      });

      console.log(expenseRes);

      const incomeRes = await client.graphql({
        query: listIncomes,
        variables: {
          filter: {
            and: [{ userId: { eq: userId } }, { sub: { eq: userSub } }],
          },
          limit: 1000,
        },
      });

      const allExpenses = expenseRes.data.listExpenses.items || [];
      const allIncomes = incomeRes.data.listIncomes.items || [];

      const parsedExpenses = allExpenses.map((exp) => ({
        ...exp,
        lineItems:
          exp.lineItems?.items?.map((li) => ({
            item: li.item ?? "",
            category: li.category ?? "Uncategorized",
            quantity: parseFloat(li.quantity ?? 0),
            unitCost: parseFloat(li.unitCost ?? 0),
            lineTotal: parseFloat(li.lineTotal ?? 0),
          })) ?? [],
      }));

      const sortedExpenses = [...parsedExpenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const sortedIncomes = [...allIncomes].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setExpenses(parsedExpenses);
      setIncomes(allIncomes);
      setRecentExpenses(sortedExpenses.slice(0, 5));
      setRecentIncomes(sortedIncomes.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const colorClassMap = {
    red: "text-red-500",
    green: "text-green-500",
  };

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
  console.log("expenseCategoryData", expenseCategoryData);
  const totalCategoryAmount = expenseCategoryData.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const incomeItemData = getIncomeItemData(incomes);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr]">
      <div className="hidden md:block"></div>

      <main className="space-y-6">
        <SummaryCards
          className="text-green-500"
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          net={net}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2">
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
    const items = exp.lineItems || []; // no .items
    items.forEach((li) => {
      const cat = li.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + (li.lineTotal || 0);
    });
  });

  return Object.entries(map).map(([category, total]) => ({ category, total }));
};

const getIncomeItemData = (incomes = []) => {
  const map = {};
  incomes.forEach((inc) => {
    const item = inc.item || "Other";
    map[item] = (map[item] || 0) + (inc.amount || 0);
  });

  return Object.entries(map).map(([item, total]) => ({ item, total }));
};

const SummaryCards = ({ totalExpense, totalIncome, net }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
    <Card title="Total Expenses" value={totalExpense} color="red" />
    <Card title="Total Income" value={totalIncome} color="green" />
    <Card
      title="Net (Income - Expenses)"
      value={net}
      color={net >= 0 ? "green" : "red"}
    />
  </div>
);

const Card = ({ title, value, color }) => {
  const colorClassMap = {
    red: "text-red-500",
    green: "text-green-500",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${colorClassMap[color]}`}>
        ${value.toFixed(2)}
      </h2>
    </div>
  );
};

const LineChartCard = ({ timeRange, setTimeRange, data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h2 className="text-lg font-semibold mb-2">
      Expenses vs. Income Over Time
    </h2>

    <div className="flex justify-end mb-4">
      {["day", "week", "month"].map((range) => (
        <button
          key={range}
          className={`px-3 py-1 mx-1 rounded ${
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
            {/* CHANGE: Use (value, name, entry) => ... */}
            <Tooltip
              formatter={(value, name, entry) => {
                const label = entry?.payload?.category ?? name ?? "Unknown";
                return [`$${value.toFixed(2)}`, label];
              }}
            />
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
            {/* CHANGE: Similarly, use the 'entry' param to get the item name */}
            <Tooltip
              formatter={(value, name, entry) => {
                // entry.payload might look like: { item: 'Salary', total: 2000 }
                const itemName = entry?.payload?.item ?? "No item";
                return [`$${value.toFixed(2)}`, itemName];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="text-gray-500 text-sm mt-2">No income records found.</p>
    )}
  </div>
);

const AsidePanel = ({ recentExpenses, recentIncomes }) => {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:block p-6 border-1 border-gray-400 bg-white">
      <RecentList title="Recent Expenses" items={recentExpenses} isExpense />
      <button
        onClick={() => navigate("/dashboard/expenses")}
        className="mb-8 w-full text-blue-600 hover:underline text-sm"
      >
        View All Expenses
      </button>

      <RecentList title="Recent Incomes" items={recentIncomes} />
      <button
        onClick={() => navigate("/dashboard/income")}
        className="mt-4 w-full text-blue-600 hover:underline text-sm"
      >
        View All Incomes
      </button>
    </aside>
  );
};

const RecentList = ({ title, items, isExpense = false }) => (
  <>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="space-y-2 mb-6">
      {items.length ? (
        items.map((item) => (
          <div
            key={item.id || item.date + Math.random()}
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
