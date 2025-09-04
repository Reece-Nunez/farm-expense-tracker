import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import Button from '../components/ui/button';
import { useFarm } from '../context/FarmContext';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import ReportGenerator from '../components/analytics/ReportGenerator';
import CustomDashboardBuilder from '../components/analytics/CustomDashboardBuilder';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { currentFarm, hasPermission } = useFarm();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');

  useEffect(() => {
    if (currentFarm) {
      loadAnalyticsData();
    }
  }, [currentFarm, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls to load analytics data
      const [expenseData, incomeData, inventoryData, profitabilityData] = await Promise.all([
        loadExpenseAnalytics(),
        loadIncomeAnalytics(), 
        loadInventoryAnalytics(),
        loadProfitabilityData()
      ]);

      setAnalyticsData({
        expenses: expenseData,
        income: incomeData,
        inventory: inventoryData,
        profitability: profitabilityData,
        lastUpdated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenseAnalytics = async () => {
    // Mock expense analytics data
    return {
      totalExpenses: 45670.25,
      monthlyTrend: [
        { month: '2024-09', amount: 15420.50, change: 12.5 },
        { month: '2024-08', amount: 13720.75, change: -5.2 },
        { month: '2024-07', amount: 16529.00, change: 8.3 }
      ],
      categoryBreakdown: [
        { category: 'Feed & Livestock', total: 18500.00, percentage: 40.5, trend: 'UP' },
        { category: 'Equipment', total: 12200.50, percentage: 26.7, trend: 'STABLE' },
        { category: 'Labor', total: 8970.25, percentage: 19.6, trend: 'UP' },
        { category: 'Utilities', total: 3850.00, percentage: 8.4, trend: 'DOWN' },
        { category: 'Other', total: 2149.50, percentage: 4.7, trend: 'STABLE' }
      ],
      averageDaily: 1522.34,
      variance: 15.2
    };
  };

  const loadIncomeAnalytics = async () => {
    // Mock income analytics data
    return {
      totalIncome: 67850.75,
      monthlyTrend: [
        { month: '2024-09', amount: 23450.25, change: 15.3 },
        { month: '2024-08', amount: 20350.50, change: 8.7 },
        { month: '2024-07', amount: 24050.00, change: 22.1 }
      ],
      sourceBreakdown: [
        { source: 'Crop Sales', total: 35420.50, percentage: 52.2, trend: 'UP' },
        { source: 'Livestock Sales', total: 18650.25, percentage: 27.5, trend: 'UP' },
        { source: 'Equipment Rental', total: 8780.00, percentage: 12.9, trend: 'STABLE' },
        { source: 'Services', total: 3000.00, percentage: 4.4, trend: 'UP' },
        { source: 'Other', total: 2000.00, percentage: 2.9, trend: 'STABLE' }
      ],
      averageDaily: 2261.69,
      growthRate: 18.5
    };
  };

  const loadInventoryAnalytics = async () => {
    // Mock inventory analytics data
    return {
      totalItems: 234,
      totalValue: 125670.50,
      turnoverRate: 4.2,
      stockoutEvents: 12,
      lowStockItems: 8,
      categoryDistribution: [
        { category: 'Seeds', itemCount: 45, totalValue: 23450.00, percentage: 18.7 },
        { category: 'Feed', itemCount: 78, totalValue: 45680.25, percentage: 36.3 },
        { category: 'Tools', itemCount: 89, totalValue: 34560.75, percentage: 27.5 },
        { category: 'Supplies', itemCount: 22, totalValue: 21979.50, percentage: 17.5 }
      ],
      topMovingItems: [
        { itemName: 'Corn Seed', movementCount: 45, velocity: 8.5 },
        { itemName: 'Cattle Feed', movementCount: 38, velocity: 7.2 },
        { itemName: 'Fertilizer', movementCount: 32, velocity: 6.1 }
      ]
    };
  };

  const loadProfitabilityData = async () => {
    // Mock profitability data
    return {
      totalRevenue: 67850.75,
      totalExpenses: 45670.25,
      netProfit: 22180.50,
      profitMargin: 32.7,
      breakEvenPoint: 45670.25,
      monthlyProfitability: [
        { month: '2024-09', revenue: 23450.25, expenses: 15420.50, profit: 8029.75, margin: 34.2 },
        { month: '2024-08', revenue: 20350.50, expenses: 13720.75, profit: 6629.75, margin: 32.6 },
        { month: '2024-07', revenue: 24050.00, expenses: 16529.00, profit: 7521.00, margin: 31.3 }
      ]
    };
  };

  const refreshData = () => {
    loadAnalyticsData();
    toast.success('Analytics data refreshed');
  };

  const exportReport = async (type) => {
    try {
      toast.loading('Generating report...');
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${type} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (!hasPermission('VIEW_ANALYTICS')) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view analytics for this farm.
          </p>
        </Card>
      </div>
    );
  }

  if (!currentFarm) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <span className="text-4xl mb-4 block">🏡</span>
          <h2 className="text-xl font-semibold mb-2">No Farm Selected</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please select a farm to view analytics data.
          </p>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'custom', label: 'Custom Dashboard', icon: '⚙️' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {currentFarm.name} • Advanced insights and reporting
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="LAST_3_MONTHS">Last 3 Months</option>
            <option value="LAST_6_MONTHS">Last 6 Months</option>
            <option value="LAST_YEAR">Last Year</option>
            <option value="YEAR_TO_DATE">Year to Date</option>
          </select>

          <Button variant="outline" onClick={refreshData}>
            🔄 Refresh
          </Button>

          <Button onClick={() => exportReport('Summary')}>
            📥 Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard 
            data={analyticsData}
            loading={loading}
            dateRange={dateRange}
            onRefresh={refreshData}
          />
        )}
        
        {activeTab === 'reports' && (
          <ReportGenerator
            farmId={currentFarm.id}
            analyticsData={analyticsData}
            onExport={exportReport}
          />
        )}
        
        {activeTab === 'custom' && (
          <CustomDashboardBuilder
            farmId={currentFarm.id}
            analyticsData={analyticsData}
          />
        )}
      </div>

      {/* Last Updated Info */}
      {analyticsData && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;