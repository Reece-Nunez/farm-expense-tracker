import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import Button from '../ui/button';
import { useFarm } from '../../context/FarmContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Portal from '../ui/Portal';

const FarmSelector = ({ showCreateOption = true }) => {
  const navigate = useNavigate();
  const { currentFarm, farms, loading, switchFarm, createFarm } = useFarm();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateFarm, setShowCreateFarm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFarmSelect = (farm) => {
    switchFarm(farm);
    setIsOpen(false);
  };

  const getFarmTypeIcon = (farmType) => {
    const iconMap = {
      LIVESTOCK: '🐄',
      CROP: '🌾', 
      DAIRY: '🥛',
      POULTRY: '🐔',
      MIXED: '🚜',
      AQUACULTURE: '🐟',
      ORGANIC: '🌱',
      GREENHOUSE: '🏠',
      ORCHARD: '🍎',
      VINEYARD: '🍇',
      OTHER: '🏡'
    };
    return iconMap[farmType] || '🏡';
  };

  const getRoleBadgeColor = (role) => {
    const colorMap = {
      OWNER: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800', 
      MANAGER: 'bg-blue-100 text-blue-800',
      EMPLOYEE: 'bg-green-100 text-green-800',
      VIEWER: 'bg-gray-100 text-gray-800',
      CONTRACTOR: 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Farm Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[200px]"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">
            {currentFarm ? getFarmTypeIcon(currentFarm.farmType) : '🏡'}
          </span>
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {currentFarm?.name || 'Select Farm'}
            </p>
            {currentFarm && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentFarm.role?.toLowerCase().replace('_', ' ')}
              </p>
            )}
          </div>
        </div>
        <span 
          className={`text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        >
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading farms...</p>
            </div>
          ) : (
            <>
              {/* Farm List */}
              {farms.length > 0 ? (
                <div className="py-2">
                  {farms.map((farm) => (
                    <button
                      key={farm.id}
                      onClick={() => handleFarmSelect(farm)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">{getFarmTypeIcon(farm.farmType)}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {farm.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(farm.role)}`}>
                            {farm.role?.toLowerCase().replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {farm.farmType?.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {currentFarm?.id === farm.id && (
                        <FontAwesomeIcon icon={faCircle} className="h-4 w-4 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <span className="text-4xl text-gray-400 block mb-2">🏡</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    No farms available
                  </p>
                </div>
              )}

              {/* Create New Farm Option */}
              {showCreateOption && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowCreateFarm(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                    >
                      <span className="text-lg">+</span>
                      <span className="text-sm font-medium">Create New Farm</span>
                    </button>
                  </div>
                </>
              )}

              {/* Manage Farms Link */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <button
                  onClick={() => {
                    navigate('/dashboard/farm-settings');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <span className="text-lg">⚙️</span>
                  <span className="text-sm">Manage Farms</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Farm Modal */}
      {showCreateFarm && (
        <Portal>
          <CreateFarmModal
            onClose={() => setShowCreateFarm(false)}
            onSuccess={() => setShowCreateFarm(false)}
          />
        </Portal>
      )}
    </div>
  );
};

const CreateFarmModal = ({ onClose, onSuccess }) => {
  const { createFarm } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    farmType: 'MIXED',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createFarm(formData);
      setFormData({ name: '', farmType: 'MIXED', description: '', address: '', city: '', state: '', zipCode: '', phoneNumber: '', email: '' });
      onSuccess();
    } catch (error) {
      console.error('Error creating farm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Farm
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>

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
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, farmType: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of your farm..."
              />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Street address..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="City..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="State..."
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Phone number..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contact email..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create Farm
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default FarmSelector;