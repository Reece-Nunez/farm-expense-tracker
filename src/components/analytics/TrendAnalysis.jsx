import React from 'react';
import { Card } from '../ui/card';

const TrendAnalysis = ({ revenueData, expenseData }) => {
  if (!revenueData || !expenseData || revenueData.length === 0 || expenseData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses Trend</h3>
        <div className="text-center py-8 text-gray-500">
          No trend data available
        </div>
      </Card>
    );
  }

  const combinedData = [];
  const monthMap = {};

  revenueData.forEach(item => {
    monthMap[item.month] = { revenue: item.amount, revenueChange: item.change };
  });

  expenseData.forEach(item => {
    if (monthMap[item.month]) {
      monthMap[item.month].expenses = item.amount;
      monthMap[item.month].expenseChange = item.change;
    } else {
      monthMap[item.month] = { expenses: item.amount, expenseChange: item.change };
    }
  });

  Object.keys(monthMap).forEach(month => {
    combinedData.push({
      month,
      ...monthMap[month],
      netFlow: (monthMap[month].revenue || 0) - (monthMap[month].expenses || 0)
    });
  });

  combinedData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));

  const maxAmount = Math.max(
    ...combinedData.map(item => Math.max(item.revenue || 0, item.expenses || 0))
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue vs Expenses Trend</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {combinedData.map((item) => {
          const revenueWidth = ((item.revenue || 0) / maxAmount) * 100;
          const expenseWidth = ((item.expenses || 0) / maxAmount) * 100;
          const netFlowPositive = item.netFlow >= 0;
          
          return (
            <div key={item.month} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                  {new Date(item.month + '-01').toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </h4>
                <div className="text-right text-xs">
                  <div className={`font-semibold ${netFlowPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {netFlowPositive ? '+' : ''}${item.netFlow.toLocaleString()}
                  </div>
                  <div className="text-gray-500">Net Flow</div>
                </div>
              </div>


              <div className="space-y-2">

                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-gray-500">Revenue</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full relative"
                        style={{ width: `${revenueWidth}%` }}
                      >
                        {item.revenueChange !== undefined && (
                          <span className="absolute -top-5 right-0 text-xs text-green-600">
                            {item.revenueChange > 0 ? '+' : ''}{item.revenueChange.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-xs text-right font-medium">
                    ${(item.revenue || 0).toLocaleString()}
                  </div>
                </div>


                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-gray-500">Expenses</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-red-500 rounded-full relative"
                        style={{ width: `${expenseWidth}%` }}
                      >
                        {item.expenseChange !== undefined && (
                          <span className="absolute -top-5 right-0 text-xs text-red-600">
                            {item.expenseChange > 0 ? '+' : ''}{item.expenseChange.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-xs text-right font-medium">
                    ${(item.expenses || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Revenue Trend</div>
            <div className="flex items-center gap-1">
              {revenueData[0]?.change > 0 ? (
                <>
                  <span className="font-semibold text-green-600">
                    +{revenueData[0].change.toFixed(1)}% up
                  </span>
                </>
              ) : revenueData[0]?.change < 0 ? (
                <>
                  <span className="font-semibold text-red-600">
                    {revenueData[0].change.toFixed(1)}% down
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-600">Stable</span>
                </>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Expense Trend</div>
            <div className="flex items-center gap-1">
              {expenseData[0]?.change > 0 ? (
                <>
                  <span className="font-semibold text-red-600">
                    +{expenseData[0].change.toFixed(1)}% up
                  </span>
                </>
              ) : expenseData[0]?.change < 0 ? (
                <>
                  <span className="font-semibold text-green-600">
                    {expenseData[0].change.toFixed(1)}% down
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-600">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendAnalysis;