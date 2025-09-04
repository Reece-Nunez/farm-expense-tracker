import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarm } from '../context/FarmContext';
import { getCurrentUser } from '../utils/getCurrentUser';
import toast from 'react-hot-toast';

const FarmSettingsPage = () => {
  const { currentFarm, updateFarm } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    farmType: 'MIXED',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    acres: '',
    establishedYear: '',
    website: '',
    businessRegistration: '',
    taxId: '',
    certifications: []
  });
  const [loading, setLoading] = useState(false);

  const farmTypes = [
    { value: 'LIVESTOCK', label: 'Livestock', icon: '🐄' },
    { value: 'CROP', label: 'Crop', icon: '🌾' },
    { value: 'DAIRY', label: 'Dairy', icon: '🥛' },
    { value: 'POULTRY', label: 'Poultry', icon: '🐔' },
    { value: 'MIXED', label: 'Mixed', icon: '🚜' },
    { value: 'AQUACULTURE', label: 'Aquaculture', icon: '🐟' },
    { value: 'ORGANIC', label: 'Organic', icon: '🌱' },
    { value: 'GREENHOUSE', label: 'Greenhouse', icon: '🏠' },
    { value: 'ORCHARD', label: 'Orchard', icon: '🍎' },
    { value: 'VINEYARD', label: 'Vineyard', icon: '🍇' },
    { value: 'OTHER', label: 'Other', icon: '🏡' }
  ];

  useEffect(() => {
    if (currentFarm) {
      setFormData({
        name: currentFarm.name || '',
        farmType: currentFarm.farmType || 'MIXED',
        description: currentFarm.description || '',
        address: currentFarm.address || '',
        city: currentFarm.city || '',
        state: currentFarm.state || '',
        zipCode: currentFarm.zipCode || '',
        country: currentFarm.country || 'United States',
        acres: currentFarm.acres || '',
        establishedYear: currentFarm.establishedYear || '',
        website: currentFarm.website || '',
        businessRegistration: currentFarm.businessRegistration || '',
        taxId: currentFarm.taxId || '',
        certifications: currentFarm.certifications || []
      });
    }
  }, [currentFarm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentFarm) return;

    setLoading(true);
    try {
      await updateFarm(currentFarm.id, formData);
      toast.success('Farm settings updated successfully!');
    } catch (error) {
      console.error('Error updating farm settings:', error);
      toast.error('Failed to update farm settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!currentFarm) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🏡</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Farm Selected
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please select a farm to view its settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚜 Farm Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your farm operations, details, and business information
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Farm Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter farm name..."
            />
          </div>

          {/* Farm Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Farm Type *
            </label>
            <select
              value={formData.farmType}
              onChange={(e) => handleInputChange('farmType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {farmTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of your farm..."
            />
          </div>

          {/* Farm Size & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Farm Size (acres)
              </label>
              <input
                type="number"
                value={formData.acres}
                onChange={(e) => handleInputChange('acres', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Total acres..."
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Established Year
              </label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Year founded..."
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://yourfarm.com"
              />
            </div>
          </div>

          {/* Farm Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
              📍 Farm Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Farm street address..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="City..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="State or Province..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="ZIP or Postal Code..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
              🏢 Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Registration #
                </label>
                <input
                  type="text"
                  value={formData.businessRegistration}
                  onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Business license/registration number..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax ID / EIN
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tax identification number..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Farm Information Display */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Farm Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Farm ID:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{currentFarm.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Your Role:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{currentFarm.role}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <span className="ml-2 text-green-600 dark:text-green-400">Active</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Current session</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FarmSettingsPage;