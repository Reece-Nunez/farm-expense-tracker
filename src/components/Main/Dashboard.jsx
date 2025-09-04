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
import { getCurrentUser } from "../../utils/getCurrentUser";
import { LIST_EXPENSES_WITH_LINE_ITEMS } from "../../graphql/customQueries";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { usePullToRefresh } from "../../hooks/useSwipe";

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
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const client = generateClient();
  const navigate = useNavigate();

  // Pull to refresh functionality
  const refreshData = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    await fetchDashboardData(
      user.id,
      user.sub,
      setExpenses,
      setIncomes,
      setRecentExpenses,
      setRecentIncomes,
    );
  };

  const pullToRefreshHook = usePullToRefresh(refreshData, 80);
  const { onTouchStart, onTouchMove, onTouchEnd, isRefreshing, isPulling } = pullToRefreshHook;

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
  ) => {
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
  const totalCategoryAmount = expenseCategoryData.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const incomeItemData = getIncomeItemData(incomes);

  // Handle click outside to close quick add menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQuickAdd && !event.target.closest('.quick-add-container')) {
        setShowQuickAdd(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuickAdd]);

  const handleExportReport = async () => {
    try {
      // Simple CSV export functionality
      const csvData = [
        ['Type', 'Date', 'Description', 'Amount'],
        ...expenses.map(expense => ['Expense', expense.date, expense.vendor, expense.grandTotal]),
        ...incomes.map(income => ['Income', income.date, income.item, income.amount])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farm-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4">
          <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {isRefreshing ? '🔄 Refreshing...' : '⬇️ Pull to refresh'}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 space-y-6 lg:space-y-8">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              🌾 Farm Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Track your farm's financial performance
            </p>
          </div>
          
          {/* Desktop Quick Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportReport}
            >
              📊 Export Report
            </Button>
            <div className="relative quick-add-container">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
              >
                ➕ Quick Add
              </Button>
              {showQuickAdd && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      onClick={() => {
                        navigate('/dashboard/add-expense');
                        setShowQuickAdd(false);
                      }}
                    >
                      💸 Add Expense
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      onClick={() => {
                        navigate('/dashboard/add-income');
                        setShowQuickAdd(false);
                      }}
                    >
                      💰 Add Income
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      onClick={() => {
                        navigate('/dashboard/inventory');
                        setShowQuickAdd(false);
                      }}
                    >
                      📦 Manage Inventory
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Quick Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportReport}
              className="flex-1"
            >
              📊 Export
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex-1"
            >
              ➕ Add
            </Button>
            {showQuickAdd && (
              <div className="absolute right-4 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => {
                      navigate('/dashboard/add-expense');
                      setShowQuickAdd(false);
                    }}
                  >
                    💸 Add Expense
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => {
                      navigate('/dashboard/add-income');
                      setShowQuickAdd(false);
                    }}
                  >
                    💰 Add Income
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => {
                      navigate('/dashboard/inventory');
                      setShowQuickAdd(false);
                    }}
                  >
                    📦 Inventory
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          net={net}
        />

        {/* Main Charts Grid - Mobile Optimized */}
        <div className="space-y-6">
          <LineChartCard
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            data={aggregatedData}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartCard
              data={expenseCategoryData}
              total={totalCategoryAmount}
            />
            <IncomeItemPieChart data={incomeItemData} />
          </div>
        </div>

        {/* Recent Activity - Full Width on Mobile */}
        <RecentActivity
          recentExpenses={recentExpenses}
          recentIncomes={recentIncomes}
        />
      </div>
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
    const items = exp.lineItems || [];
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <SummaryCard 
      title="Total Expenses" 
      value={totalExpense} 
      color="red"
      icon="💸"
      trend={-5.2}
    />
    <SummaryCard 
      title="Total Income" 
      value={totalIncome} 
      color="green"
      icon="💰"
      trend={12.8}
    />
    <SummaryCard
      title="Net (Income - Expenses)"
      value={net}
      color={net >= 0 ? "green" : "red"}
      icon={net >= 0 ? "📈" : "📉"}
      trend={net >= 0 ? 8.3 : -2.1}
    />
  </div>
);

const SummaryCard = ({ title, value, color, icon, trend }) => {
  const colorClassMap = {
    red: "text-red-600 dark:text-red-400",
    green: "text-green-600 dark:text-green-400",
  };

  const bgColorMap = {
    red: "bg-red-50 dark:bg-red-900/10",
    green: "bg-green-50 dark:bg-green-900/10",
  };

  return (
    <Card variant="elevated" className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          </div>
          <h2 className={`text-3xl font-bold ${colorClassMap[color]} mb-2`}>
            ${Math.abs(value).toFixed(2)}
          </h2>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-1 rounded-full ${bgColorMap[color]} ${colorClassMap[color]} font-medium`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const LineChartCard = ({ timeRange, setTimeRange, data }) => (
  <Card variant="elevated" className="h-full">
    <div className="flex items-center justify-between mb-6">
      <CardHeader size="lg">📊 Expenses vs. Income Over Time</CardHeader>
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {["day", "week", "month"].map((range) => (
          <Button
            key={range}
            size="sm"
            variant={timeRange === range ? "primary" : "ghost"}
            onClick={() => setTimeRange(range)}
            className="text-xs"
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>
    </div>

    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            tickCount={6}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="incomes"
            name="Income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const PieChartCard = ({ data, total }) => {
  return (
    <Card variant="elevated" className="h-full">
      <CardHeader size="lg">🏷️ Expenses by Category</CardHeader>
      
      {data.length > 0 ? (
        <>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value, name, entry) => {
                    const label = entry?.payload?.category ?? name ?? "Unknown";
                    return [`$${value.toFixed(2)}`, label];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend */}
          <div className="space-y-3">
            {data.slice(0, 6).map((item, index) => {
              const percent = total > 0 ? (item.total / total) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ${item.total.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
            {data.length > 6 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All Categories
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-sm">No expense data available</p>
        </div>
      )}
    </Card>
  );
};

const IncomeItemPieChart = ({ data }) => (
  <Card variant="elevated" className="h-full">
    <CardHeader size="lg">💰 Income by Source</CardHeader>
    
    {data.length > 0 ? (
      <>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="item"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value, name, entry) => {
                  const itemName = entry?.payload?.item ?? "No item";
                  return [`$${value.toFixed(2)}`, itemName];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income Legend */}
        <div className="space-y-3">
          {data.slice(0, 6).map((item, index) => {
            const totalIncome = data.reduce((sum, d) => sum + d.total, 0);
            const percent = totalIncome > 0 ? (item.total / totalIncome) * 100 : 0;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {item.item}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${item.total.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-4">💰</div>
        <p className="text-sm">No income records found</p>
      </div>
    )}
  </Card>
);

const RecentActivity = ({ recentExpenses, recentIncomes }) => {
  const navigate = useNavigate();

  const allActivity = [
    ...recentExpenses.map(item => ({
      ...item,
      type: 'expense',
      icon: '💸',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/10',
    })),
    ...recentIncomes.map(item => ({
      ...item,
      type: 'income',
      icon: '💰',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  return (
    <Card variant="elevated" className="h-full">
      <div className="flex items-center justify-between mb-6">
        <CardHeader size="lg">⚡ Recent Activity</CardHeader>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </div>
      
      {allActivity.length > 0 ? (
        <div className="space-y-3">
          {allActivity.map((item, index) => (
            <div 
              key={`${item.type}-${item.id}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              onClick={() => navigate(item.type === 'expense' ? '/dashboard/expenses' : '/dashboard/income')}
            >
              <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center text-lg`}>
                {item.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.type === 'expense' ? item.vendor : item.item}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.bgColor} ${item.color}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-bold ${item.color}`}>
                  {item.type === 'expense' ? '-' : '+'}${(item.type === 'expense' ? item.grandTotal : item.amount)?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">⚡</div>
          <p className="text-sm">No recent activity</p>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/dashboard/expenses')}
          >
            View Expenses
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/dashboard/income')}
          >
            View Income
          </Button>
        </div>
      </div>
    </Card>
  );
};
