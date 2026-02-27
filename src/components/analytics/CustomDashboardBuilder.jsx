import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const CustomDashboardBuilder = ({ farmId, analyticsData }) => {
  const [dashboards, setDashboards] = useState([
    {
      id: 'default',
      name: 'Default Dashboard',
      isDefault: true,
      widgets: ['revenue_kpi', 'expense_breakdown', 'profit_trend', 'quick_stats']
    }
  ]);
  
  const [selectedDashboard, setSelectedDashboard] = useState('default');
  const [isEditing, setIsEditing] = useState(false);
  const [showNewDashboard, setShowNewDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const availableWidgets = [
    {
      id: 'revenue_kpi',
      name: 'Revenue KPI',
      description: 'Total revenue with trend indicator',
      category: 'KPIs',
      icon: '$',
      size: 'small'
    },
    {
      id: 'expense_kpi',
      name: 'Expense KPI',
      description: 'Total expenses with trend indicator',
      category: 'KPIs',
      icon: '-$',
      size: 'small'
    },
    {
      id: 'profit_kpi',
      name: 'Profit KPI',
      description: 'Net profit with margin percentage',
      category: 'KPIs',
      icon: '+/-',
      size: 'small'
    },
    {
      id: 'margin_kpi',
      name: 'Profit Margin KPI',
      description: 'Profit margin percentage',
      category: 'KPIs',
      icon: '%',
      size: 'small'
    },
    {
      id: 'expense_breakdown',
      name: 'Expense Breakdown',
      description: 'Pie chart of expense categories',
      category: 'Charts',
      icon: '[=]',
      size: 'medium'
    },
    {
      id: 'income_sources',
      name: 'Income Sources',
      description: 'Bar chart of income sources',
      category: 'Charts',
      icon: '[+]',
      size: 'medium'
    },
    {
      id: 'profit_trend',
      name: 'Profitability Trend',
      description: 'Line chart showing profit over time',
      category: 'Charts',
      icon: '[~]',
      size: 'large'
    },
    {
      id: 'cash_flow',
      name: 'Cash Flow Chart',
      description: 'Monthly cash flow visualization',
      category: 'Charts',
      icon: '[$]',
      size: 'large'
    },
    {
      id: 'quick_stats',
      name: 'Quick Statistics',
      description: 'Overview of key metrics',
      category: 'Stats',
      icon: '[#]',
      size: 'medium'
    },
    {
      id: 'inventory_status',
      name: 'Inventory Status',
      description: 'Current inventory levels and alerts',
      category: 'Inventory',
      icon: '[i]',
      size: 'medium'
    },
    {
      id: 'low_stock_alerts',
      name: 'Low Stock Alerts',
      description: 'Items requiring attention',
      category: 'Alerts',
      icon: '[!]',
      size: 'small'
    },
    {
      id: 'recent_transactions',
      name: 'Recent Transactions',
      description: 'Latest income and expense entries',
      category: 'Lists',
      icon: '[*]',
      size: 'large'
    }
  ];

  const getCurrentDashboard = () => {
    return dashboards.find(d => d.id === selectedDashboard);
  };

  const getWidgetsByCategory = () => {
    const categories = {};
    availableWidgets.forEach(widget => {
      if (!categories[widget.category]) {
        categories[widget.category] = [];
      }
      categories[widget.category].push(widget);
    });
    return categories;
  };

  const addWidget = (widgetId) => {
    const currentDashboard = getCurrentDashboard();
    if (currentDashboard.widgets.includes(widgetId)) {
      toast.error('Widget already added to dashboard');
      return;
    }

    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === selectedDashboard
        ? { ...dashboard, widgets: [...dashboard.widgets, widgetId] }
        : dashboard
    ));

    toast.success('Widget added to dashboard');
  };

  const removeWidget = (widgetId) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === selectedDashboard
        ? { ...dashboard, widgets: dashboard.widgets.filter(w => w !== widgetId) }
        : dashboard
    ));

    toast.success('Widget removed from dashboard');
  };

  const createNewDashboard = () => {
    if (!newDashboardName.trim()) {
      toast.error('Please enter a dashboard name');
      return;
    }

    const newDashboard = {
      id: Date.now().toString(),
      name: newDashboardName.trim(),
      isDefault: false,
      widgets: []
    };

    setDashboards(prev => [...prev, newDashboard]);
    setSelectedDashboard(newDashboard.id);
    setNewDashboardName('');
    setShowNewDashboard(false);
    toast.success('New dashboard created');
  };

  const deleteDashboard = (dashboardId) => {
    if (dashboards.find(d => d.id === dashboardId)?.isDefault) {
      toast.error('Cannot delete default dashboard');
      return;
    }

    setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    if (selectedDashboard === dashboardId) {
      setSelectedDashboard('default');
    }
    toast.success('Dashboard deleted');
  };

  const saveDashboard = () => {
    toast.success('Dashboard configuration saved');
    setIsEditing(false);
  };

  const currentDashboard = getCurrentDashboard();
  const widgetCategories = getWidgetsByCategory();

  return (
    <div className="space-y-6">

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Custom Dashboard Builder</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedDashboard}
              onChange={(e) => setSelectedDashboard(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {dashboards.map((dashboard) => (
                <option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name} {dashboard.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewDashboard(true)}
            >
              + New Dashboard
            </Button>
            
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Exit Edit Mode' : 'Edit Dashboard'}
            </Button>
          </div>
        </div>

        {showNewDashboard && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Enter dashboard name..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <Button size="sm" onClick={createNewDashboard}>
                Create
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowNewDashboard(false);
                  setNewDashboardName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-400">
          Customize your dashboard by adding, removing, and arranging widgets to suit your needs.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {currentDashboard?.name} Widgets ({currentDashboard?.widgets.length})
              </h3>
              {isEditing && currentDashboard?.widgets.length > 0 && (
                <Button variant="outline" size="sm" onClick={saveDashboard}>
                  Save Changes
                </Button>
              )}
            </div>

            {currentDashboard?.widgets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <span className="text-4xl block mb-3">--</span>
                <p className="text-lg font-medium mb-2">No widgets added yet</p>
                <p className="text-sm">
                  {isEditing 
                    ? 'Add widgets from the panel on the right to get started.'
                    : 'Enable edit mode to customize your dashboard.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDashboard.widgets.map((widgetId) => {
                  const widget = availableWidgets.find(w => w.id === widgetId);
                  if (!widget) return null;

                  return (
                    <div
                      key={widgetId}
                      className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${
                        widget.size === 'large' ? 'md:col-span-2' : ''
                      } ${isEditing ? 'ring-2 ring-indigo-200 dark:ring-indigo-800' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{widget.icon}</span>
                          <div>
                            <h4 className="font-medium">{widget.name}</h4>
                            <p className="text-sm text-gray-500">{widget.description}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeWidget(widgetId)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            X
                          </button>
                        )}
                      </div>
                      

                      <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-center text-sm text-gray-500">
                        Widget Preview ({widget.category})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>


        {isEditing && (
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Widgets</h3>
              
              <div className="space-y-4">
                {Object.entries(widgetCategories).map(([category, widgets]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="text-sm">{category}</span>
                      <span className="text-xs text-gray-500">({widgets.length})</span>
                    </h4>
                    
                    <div className="space-y-2">
                      {widgets.map((widget) => {
                        const isAdded = currentDashboard.widgets.includes(widget.id);
                        
                        return (
                          <div
                            key={widget.id}
                            className={`p-3 border rounded-lg transition-colors ${
                              isAdded 
                                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <span className="text-lg flex-shrink-0">{widget.icon}</span>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm">{widget.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{widget.description}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Size: {widget.size} • {widget.category}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant={isAdded ? 'outline' : 'primary'}
                                onClick={() => isAdded ? removeWidget(widget.id) : addWidget(widget.id)}
                                className="flex-shrink-0 ml-2"
                              >
                                {isAdded ? 'Remove' : 'Add'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>


            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Dashboard Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" fullWidth size="sm">
                  Export Dashboard
                </Button>
                
                <Button variant="outline" fullWidth size="sm">
                  Duplicate Dashboard
                </Button>
                
                <Button variant="outline" fullWidth size="sm">
                  Share Dashboard
                </Button>
                
                {!currentDashboard?.isDefault && (
                  <Button 
                    variant="outline" 
                    fullWidth 
                    size="sm"
                    onClick={() => deleteDashboard(currentDashboard.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete Dashboard
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>


      {!isEditing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dashboard Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">E</span>
                <h4 className="font-medium">Executive Summary</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                High-level KPIs and key metrics for quick overview
              </p>
              <Button size="sm" variant="outline" fullWidth>
                Use Template
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">F</span>
                <h4 className="font-medium">Financial Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Detailed financial charts and profitability analysis
              </p>
              <Button size="sm" variant="outline" fullWidth>
                Use Template
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">O</span>
                <h4 className="font-medium">Operations Focus</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Inventory, alerts, and operational metrics
              </p>
              <Button size="sm" variant="outline" fullWidth>
                Use Template
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CustomDashboardBuilder;