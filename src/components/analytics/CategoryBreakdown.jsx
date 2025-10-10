import React from 'react';
import { Card } from '../ui/card';

const CategoryBreakdown = ({ title, data, type = 'expense' }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No category data available
        </div>
      </Card>
    );
  }

  const getColorClass = (index, type) => {
    const expenseColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500'];
    const incomeColors = ['bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500'];
    
    const colors = type === 'income' ? incomeColors : expenseColors;
    return colors[index % colors.length];
  };

  const getTrendEmoji = (trend) => {
    switch (trend) {
      case 'UP':
        return '↗️';
      case 'DOWN':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">
          ${total.toLocaleString()}
        </span>
      </div>

      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => {
          const categoryName = item.category || item.source;
          const percentage = item.percentage;
          const amount = item.total;
          const trend = item.trend;

          return (
            <div key={categoryName} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getColorClass(index, type)}`}></div>
                  <span className="font-medium truncate">{categoryName}</span>
                  {trend && (
                    <span className="text-gray-500 flex-shrink-0">
                      {getTrendEmoji(trend)}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-semibold">{percentage.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">${amount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getColorClass(index, type)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show truncated indicator if there are more items */}
      {data.length > 5 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Showing top 5 of {data.length} categories
          </p>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Top Category:</span>
            <div className="font-semibold truncate">{data[0]?.category || data[0]?.source}</div>
          </div>
          <div>
            <span className="text-gray-500">Concentration:</span>
            <div className="font-semibold">
              {data.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}% (Top 3)
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4">
        {data[0]?.percentage > 50 && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs">
            <span className="text-yellow-800 dark:text-yellow-300">
              ⚠️ High concentration: {data[0].category || data[0].source} represents {data[0].percentage.toFixed(1)}% of total
            </span>
          </div>
        )}
        
        {type === 'expense' && data.filter(item => item.trend === 'UP').length >= 2 && (
          <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs mt-2">
            <span className="text-red-800 dark:text-red-300">
              📈 Multiple expense categories trending upward
            </span>
          </div>
        )}
        
        {type === 'income' && data.filter(item => item.trend === 'UP').length >= 2 && (
          <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs mt-2">
            <span className="text-green-800 dark:text-green-300">
              📈 Multiple income sources showing growth
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CategoryBreakdown;