import React from 'react';
import { LuX } from 'react-icons/lu';

const InventoryFilters = ({ filters, onFiltersChange, categories, locations }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'LOW_STOCK', label: 'Low Stock' },
    { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
    { value: 'DISCONTINUED', label: 'Discontinued' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      location: '',
      status: '',
      lowStock: false
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    typeof filter === 'boolean' ? filter : filter !== ''
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Low Stock Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Level
          </label>
          <label className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer dark:border-gray-600">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={(e) => handleFilterChange('lowStock', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Low stock only
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active filters:
          </span>
          
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
              >
                <LuX className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.location && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <LuX className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', '')}
                className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
              >
                <LuX className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.lowStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">
              Low Stock Only
              <button
                onClick={() => handleFilterChange('lowStock', false)}
                className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
              >
                <LuX className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;