import React from 'react';
import { Card } from '../ui/card';

const ExpenseChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <div className="text-center py-8 text-gray-500">
          No expense data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item.total));
  const colors = [
    'bg-red-500',
    'bg-orange-500', 
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500'
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Expense Breakdown</h3>
        <span className="text-sm text-gray-500">Total: ${data.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="font-medium">{item.category}</span>
                <span className="text-gray-500">
                  {item.trend === 'UP' ? '↗️' : item.trend === 'DOWN' ? '↘️' : '➡️'}
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${item.total.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${(item.total / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Top Category:</span>
            <div className="font-semibold">{data[0]?.category}</div>
          </div>
          <div>
            <span className="text-gray-500">Avg per Category:</span>
            <div className="font-semibold">
              ${(data.reduce((sum, item) => sum + item.total, 0) / data.length).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseChart;