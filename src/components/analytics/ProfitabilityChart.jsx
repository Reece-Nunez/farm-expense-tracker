import React from 'react';
import { Card } from '../ui/card';

const ProfitabilityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Profitability</h3>
        <div className="text-center py-8 text-gray-500">
          No profitability data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => Math.max(item.revenue, item.expenses)));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Monthly Profitability</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Expenses</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Profit</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((item) => {
          const revenueWidth = (item.revenue / maxValue) * 100;
          const expenseWidth = (item.expenses / maxValue) * 100;
          const profitWidth = (item.profit / maxValue) * 100;
          
          return (
            <div key={item.month} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                  {new Date(item.month + '-01').toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </h4>
                <div className="text-right text-sm">
                  <div className="font-semibold text-blue-600">
                    ${item.profit.toLocaleString()} ({item.margin.toFixed(1)}%)
                  </div>
                </div>
              </div>
              
              {/* Revenue Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Revenue</span>
                  <span>${item.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${revenueWidth}%` }}
                  ></div>
                </div>
              </div>

              {/* Expenses Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Expenses</span>
                  <span>${item.expenses.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-red-500 rounded-full"
                    style={{ width: `${expenseWidth}%` }}
                  ></div>
                </div>
              </div>

              {/* Profit Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Net Profit</span>
                  <span className={item.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${item.profit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.profit >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(profitWidth)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Avg Revenue</div>
            <div className="font-semibold">
              ${(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Avg Expenses</div>
            <div className="font-semibold">
              ${(data.reduce((sum, item) => sum + item.expenses, 0) / data.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Avg Margin</div>
            <div className="font-semibold">
              {(data.reduce((sum, item) => sum + item.margin, 0) / data.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfitabilityChart;