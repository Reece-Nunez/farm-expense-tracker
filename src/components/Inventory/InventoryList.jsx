import React, { useState } from 'react';
import { LuPencil, LuEye, LuPlus, LuMinus, LuMapPin } from 'react-icons/lu';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const InventoryList = ({ items, view, onItemClick, onStockUpdate }) => {
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');

  const handleStockEdit = (item) => {
    setEditingStock(item.id);
    setStockValue(item.currentStock.toString());
  };

  const handleStockSave = (item) => {
    const newStock = parseFloat(stockValue);
    if (!isNaN(newStock) && newStock >= 0) {
      onStockUpdate(item.id, newStock);
    }
    setEditingStock(null);
    setStockValue('');
  };

  const handleStockCancel = () => {
    setEditingStock(null);
    setStockValue('');
  };

  const getStatusBadge = (status, isLowStock) => {
    let badgeClass = 'px-2 py-1 text-xs font-medium rounded-full ';
    
    if (status === 'OUT_OF_STOCK') {
      badgeClass += 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    } else if (isLowStock) {
      badgeClass += 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    } else {
      badgeClass += 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }

    return (
      <span className={badgeClass}>
        {status === 'OUT_OF_STOCK' ? 'Out of Stock' : 
         isLowStock ? 'Low Stock' : 'In Stock'}
      </span>
    );
  };

  const getStockBar = (current, minimum, maximum) => {
    const percentage = maximum > 0 ? (current / maximum) * 100 : 0;
    const isLow = current <= minimum;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isLow ? 'bg-red-500' : current <= minimum * 1.5 ? 'bg-orange-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  SKU: {item.sku}
                </p>
              </div>
              <div className="ml-4">
                {getStatusBadge(item.status, item.isLowStock)}
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">{item.category.icon}</span>
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: item.category.color + '20',
                  color: item.category.color 
                }}
              >
                {item.category.name}
              </span>
            </div>

            {/* Stock Information */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Stock Level</span>
                {editingStock === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border rounded"
                      min="0"
                      step="0.1"
                    />
                    <button
                      onClick={() => handleStockSave(item)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleStockCancel}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.currentStock} {item.unit.toLowerCase()}
                    </span>
                    <button
                      onClick={() => handleStockEdit(item)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      <LuPencil className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {getStockBar(item.currentStock, item.minimumStock, item.maximumStock)}
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {item.minimumStock}</span>
                <span>Max: {item.maximumStock || 'N/A'}</span>
              </div>
            </div>

            {/* Location & Value */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <LuMapPin className="h-4 w-4" />
                <span>{item.location.name}</span>
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                ${item.totalValue?.toFixed(2) || '0.00'}
              </div>
            </div>

            {/* Last Purchase */}
            {item.lastPurchaseDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Last purchase: {new Date(item.lastPurchaseDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onItemClick(item)}
                className="flex-1"
              >
                <LuEye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockEdit(item)}
              >
                <LuPencil className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Table view
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.sku}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.category.icon}</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {item.category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingStock === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          className="w-20 px-2 py-1 text-sm border rounded"
                          min="0"
                          step="0.1"
                        />
                        <button
                          onClick={() => handleStockSave(item)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleStockCancel}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {item.currentStock} {item.unit.toLowerCase()}
                        </span>
                        <button
                          onClick={() => handleStockEdit(item)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="mt-1">
                    {getStockBar(item.currentStock, item.minimumStock, item.maximumStock)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(item.status, item.isLowStock)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  ${item.totalValue?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {item.location.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemClick(item)}
                    >
                      <LuEye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default InventoryList;