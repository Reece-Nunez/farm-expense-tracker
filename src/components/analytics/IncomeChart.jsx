import React from 'react';
import { Card } from '../ui/card';

const IncomeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Income Sources</h3>
        <div className="text-center py-8 text-gray-500">
          No income data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item.total));
  const colors = [
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500'
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Income Sources</h3>
        <span className="text-sm text-gray-500">Total: ${data.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.source} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="font-medium">{item.source}</span>
                <span className="text-gray-500">
                  {item.trend === 'UP' ? 'up' : item.trend === 'DOWN' ? 'down' : 'flat'}
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


      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Top Source:</span>
            <div className="font-semibold">{data[0]?.source}</div>
          </div>
          <div>
            <span className="text-gray-500">Avg per Source:</span>
            <div className="font-semibold">
              ${(data.reduce((sum, item) => sum + item.total, 0) / data.length).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IncomeChart;