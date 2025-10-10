import React, { useState } from 'react';
import { LuX, LuPackage, LuDollarSign, LuMapPin, LuTag } from 'react-icons/lu';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const AddInventoryModal = ({ onClose, onSubmit, categories, locations }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    categoryId: '',
    locationId: '',
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    unit: 'PIECES',
    unitCost: '',
    supplierName: '',
    supplierContact: '',
    expirationDate: '',
    storageRequirements: '',
    weight: '',
    dimensions: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stockUnits = [
    { value: 'PIECES', label: 'Pieces' },
    { value: 'POUNDS', label: 'Pounds' },
    { value: 'OUNCES', label: 'Ounces' },
    { value: 'KILOGRAMS', label: 'Kilograms' },
    { value: 'GRAMS', label: 'Grams' },
    { value: 'GALLONS', label: 'Gallons' },
    { value: 'LITERS', label: 'Liters' },
    { value: 'FEET', label: 'Feet' },
    { value: 'METERS', label: 'Meters' },
    { value: 'BAGS', label: 'Bags' },
    { value: 'BOXES', label: 'Boxes' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
    }

    if (!formData.currentStock || parseFloat(formData.currentStock) < 0) {
      newErrors.currentStock = 'Valid current stock is required';
    }

    if (!formData.minimumStock || parseFloat(formData.minimumStock) < 0) {
      newErrors.minimumStock = 'Valid minimum stock is required';
    }

    if (formData.maximumStock && parseFloat(formData.maximumStock) < parseFloat(formData.minimumStock)) {
      newErrors.maximumStock = 'Maximum stock must be greater than minimum stock';
    }

    if (formData.unitCost && parseFloat(formData.unitCost) < 0) {
      newErrors.unitCost = 'Unit cost must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Calculate total value
      const totalValue = (parseFloat(formData.currentStock) || 0) * (parseFloat(formData.unitCost) || 0);
      
      const itemData = {
        ...formData,
        currentStock: parseFloat(formData.currentStock),
        minimumStock: parseFloat(formData.minimumStock),
        maximumStock: formData.maximumStock ? parseFloat(formData.maximumStock) : null,
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : null,
        totalValue: totalValue,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        status: 'ACTIVE',
        isLowStock: parseFloat(formData.currentStock) <= parseFloat(formData.minimumStock)
      };

      await onSubmit(itemData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <LuPackage className="h-6 w-6 text-green-600" />
              Add Inventory Item
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <LuX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter item name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter SKU"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter item description"
              />
            </div>

            {/* Categorization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <select
                  value={formData.locationId}
                  onChange={(e) => handleInputChange('locationId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                    errors.locationId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId}</p>}
              </div>
            </div>

            {/* Stock Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuPackage className="h-5 w-5" />
                Stock Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.currentStock}
                    onChange={(e) => handleInputChange('currentStock', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.currentStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.currentStock && <p className="text-red-500 text-xs mt-1">{errors.currentStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.minimumStock}
                    onChange={(e) => handleInputChange('minimumStock', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.minimumStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.minimumStock && <p className="text-red-500 text-xs mt-1">{errors.minimumStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.maximumStock}
                    onChange={(e) => handleInputChange('maximumStock', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.maximumStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.maximumStock && <p className="text-red-500 text-xs mt-1">{errors.maximumStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  >
                    {stockUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuDollarSign className="h-5 w-5" />
                Pricing Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitCost}
                    onChange={(e) => handleInputChange('unitCost', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.unitCost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.unitCost && <p className="text-red-500 text-xs mt-1">{errors.unitCost}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Value
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                    ${((parseFloat(formData.currentStock) || 0) * (parseFloat(formData.unitCost) || 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Supplier Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier Contact
                  </label>
                  <input
                    type="text"
                    value={formData.supplierContact}
                    onChange={(e) => handleInputChange('supplierContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Phone or email"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Additional Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Scan or enter barcode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="L x W x H"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Storage Requirements
                  </label>
                  <input
                    type="text"
                    value={formData.storageRequirements}
                    onChange={(e) => handleInputChange('storageRequirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Cool, dry place"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                Add Item
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddInventoryModal;