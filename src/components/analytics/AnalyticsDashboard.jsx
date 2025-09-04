import React from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';
import KPICard from './KPICard';
import ExpenseChart from './ExpenseChart';
import IncomeChart from './IncomeChart';
import ProfitabilityChart from './ProfitabilityChart';
import CategoryBreakdown from './CategoryBreakdown';
import TrendAnalysis from './TrendAnalysis';

const AnalyticsDashboard = ({ data, loading, dateRange, onRefresh }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <span className="text-4xl mb-4 block">📊</span>
        <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unable to load analytics data for the selected period.
        </p>
        <Button onClick={onRefresh}>
          Try Again
        </Button>
      </Card>
    );
  }

  const { expenses, income, inventory, profitability } = data;

  // Calculate key metrics
  const totalProfit = profitability.netProfit;
  const profitMargin = profitability.profitMargin;
  const totalRevenue = profitability.totalRevenue;
  const totalExpenses = profitability.totalExpenses;

  // Calculate trends (simplified)
  const revenueTrend = income.monthlyTrend.length >= 2 
    ? ((income.monthlyTrend[0].amount - income.monthlyTrend[1].amount) / income.monthlyTrend[1].amount * 100).toFixed(1)
    : 0;

  const expenseTrend = expenses.monthlyTrend.length >= 2
    ? ((expenses.monthlyTrend[0].amount - expenses.monthlyTrend[1].amount) / expenses.monthlyTrend[1].amount * 100).toFixed(1)
    : 0;

  const profitTrend = profitability.monthlyProfitability.length >= 2
    ? ((profitability.monthlyProfitability[0].profit - profitability.monthlyProfitability[1].profit) / profitability.monthlyProfitability[1].profit * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={revenueTrend}
          trend={revenueTrend > 0 ? 'up' : revenueTrend < 0 ? 'down' : 'stable'}
          icon="💰"
          color="green"
        />
        
        <KPICard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          change={expenseTrend}
          trend={expenseTrend > 0 ? 'up' : expenseTrend < 0 ? 'down' : 'stable'}
          icon="💸"
          color="red"
        />
        
        <KPICard
          title="Net Profit"
          value={`$${totalProfit.toLocaleString()}`}
          change={profitTrend}
          trend={profitTrend > 0 ? 'up' : profitTrend < 0 ? 'down' : 'stable'}
          icon="📈"
          color="blue"
        />
        
        <KPICard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          change={profitTrend}
          trend={profitTrend > 0 ? 'up' : profitTrend < 0 ? 'down' : 'stable'}
          icon="🎯"
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitabilityChart data={profitability.monthlyProfitability} />
        <TrendAnalysis 
          revenueData={income.monthlyTrend}
          expenseData={expenses.monthlyTrend}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart data={expenses.categoryBreakdown} />
        <IncomeChart data={income.sourceBreakdown} />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryBreakdown
          title="Expense Categories"
          data={expenses.categoryBreakdown}
          type="expense"
        />
        
        <CategoryBreakdown
          title="Income Sources"
          data={income.sourceBreakdown}
          type="income"
        />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📦</span>
            Inventory Overview
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Items</span>
              <span className="font-semibold">{inventory.totalItems}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
              <span className="font-semibold">${inventory.totalValue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Turnover Rate</span>
              <span className="font-semibold">{inventory.turnoverRate}x/year</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</span>
              <span className={`font-semibold ${inventory.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {inventory.lowStockItems}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stockout Events</span>
              <span className={`font-semibold ${inventory.stockoutEvents > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {inventory.stockoutEvents}
              </span>
            </div>
          </div>

          {inventory.lowStockItems > 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">
                ⚠️ {inventory.lowStockItems} items need restocking
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            📊 Generate Report
          </Button>
          <Button variant="outline" size="sm">
            📤 Export Data
          </Button>
          <Button variant="outline" size="sm">
            📈 View Trends
          </Button>
          <Button variant="outline" size="sm">
            🔄 Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            ⚙️ Configure Dashboard
          </Button>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          Performance Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
              Strong Performance
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Profit margin of {profitMargin.toFixed(1)}% exceeds industry average
            </p>
          </div>
          
          {inventory.lowStockItems > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Inventory Alert
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {inventory.lowStockItems} items running low on stock
              </p>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
              Growth Opportunity
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Top category represents {expenses.categoryBreakdown[0]?.percentage.toFixed(1)}% of expenses
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;