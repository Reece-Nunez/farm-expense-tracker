import React from 'react';
import { Card } from '../ui/card';

const InventoryStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: '⚠️',
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      alert: stats.lowStockItems > 0
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      alert: stats.outOfStockItems > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        return (
          <Card
            key={stat.title}
            className={`p-6 ${stat.alert ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                {stat.alert && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                    Needs Attention
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryStats;