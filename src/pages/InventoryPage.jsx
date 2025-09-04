import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaExclamationTriangle, FaBox, FaChartBar, FaShoppingCart, FaCamera } from 'react-icons/fa';
import { Card } from '../components/ui/card';
import Button from '../components/ui/button';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryList from '../components/inventory/InventoryList';
import InventoryFilters from '../components/inventory/InventoryFilters';
import AddInventoryModal from '../components/inventory/AddInventoryModal';
import LowStockAlerts from '../components/inventory/LowStockAlerts';
import QuaggaBarcodeScanner from '../components/inventory/QuaggaBarcodeScanner';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '../utils/getCurrentUser';
import toast from 'react-hot-toast';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedView, setSelectedView] = useState('grid'); // grid, list, table
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: '',
    lowStock: false
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });

  const client = generateClient();

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      // Load inventory items, categories, locations, and alerts in parallel
      const [itemsResult, categoriesResult, locationsResult, alertsResult] = await Promise.all([
        loadInventoryItems(user),
        loadCategories(user),
        loadLocations(user),
        loadAlerts(user)
      ]);

      setInventory(itemsResult);
      setCategories(categoriesResult);
      setLocations(locationsResult);
      setAlerts(alertsResult);
      
      calculateStats(itemsResult);
      setLoading(false);
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('Failed to load inventory data');
      setLoading(false);
    }
  };

  const loadInventoryItems = async (user) => {
    // TODO: Implement GraphQL query for inventory items
    // For now, return mock data
    return [
      {
        id: '1',
        name: 'Premium Chicken Feed',
        description: '50lb bag of premium layer feed',
        sku: 'FEED-001',
        currentStock: 12,
        minimumStock: 5,
        maximumStock: 50,
        unit: 'BAGS',
        unitCost: 18.99,
        totalValue: 227.88,
        status: 'ACTIVE',
        isLowStock: false,
        category: { name: 'Feed & Nutrition', color: '#10B981' },
        location: { name: 'Feed Storage Barn' },
        lastPurchaseDate: '2024-08-15'
      },
      {
        id: '2',
        name: 'Fence Posts - Cedar',
        description: '8ft treated cedar fence posts',
        sku: 'FENCE-002',
        currentStock: 3,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'PIECES',
        unitCost: 12.50,
        totalValue: 37.50,
        status: 'LOW_STOCK',
        isLowStock: true,
        category: { name: 'Tools & Equipment', color: '#F59E0B' },
        location: { name: 'Main Storage Shed' },
        lastPurchaseDate: '2024-07-20'
      },
      {
        id: '3',
        name: 'Organic Fertilizer',
        description: '40lb bag organic all-purpose fertilizer',
        sku: 'FERT-003',
        currentStock: 0,
        minimumStock: 8,
        maximumStock: 30,
        unit: 'BAGS',
        unitCost: 24.99,
        totalValue: 0,
        status: 'OUT_OF_STOCK',
        isLowStock: true,
        category: { name: 'Fertilizers', color: '#8B5CF6' },
        location: { name: 'Greenhouse Storage' },
        lastPurchaseDate: '2024-06-10'
      }
    ];
  };

  const loadCategories = async (user) => {
    return [
      { id: '1', name: 'Feed & Nutrition', color: '#10B981', icon: '🌾' },
      { id: '2', name: 'Tools & Equipment', color: '#F59E0B', icon: '🔧' },
      { id: '3', name: 'Fertilizers', color: '#8B5CF6', icon: '🧪' },
      { id: '4', name: 'Seeds & Plants', color: '#EC4899', icon: '🌱' },
      { id: '5', name: 'Pesticides', color: '#EF4444', icon: '🦟' },
      { id: '6', name: 'Supplies', color: '#6B7280', icon: '📦' }
    ];
  };

  const loadLocations = async (user) => {
    return [
      { id: '1', name: 'Main Storage Shed', type: 'SHED' },
      { id: '2', name: 'Feed Storage Barn', type: 'BARN' },
      { id: '3', name: 'Greenhouse Storage', type: 'GREENHOUSE' },
      { id: '4', name: 'Field Equipment Yard', type: 'OUTDOOR' },
      { id: '5', name: 'Chemical Storage Room', type: 'STORAGE_ROOM' }
    ];
  };

  const loadAlerts = async (user) => {
    return [
      {
        id: '1',
        alertType: 'LOW_STOCK',
        severity: 'HIGH',
        message: 'Cedar Fence Posts running low (3 remaining, minimum 10)',
        isRead: false,
        item: { name: 'Fence Posts - Cedar' }
      },
      {
        id: '2',
        alertType: 'OUT_OF_STOCK',
        severity: 'CRITICAL',
        message: 'Organic Fertilizer is out of stock',
        isRead: false,
        item: { name: 'Organic Fertilizer' }
      }
    ];
  };

  const calculateStats = (items) => {
    const stats = items.reduce((acc, item) => {
      acc.totalItems += 1;
      acc.totalValue += item.totalValue || 0;
      if (item.isLowStock) acc.lowStockItems += 1;
      if (item.status === 'OUT_OF_STOCK') acc.outOfStockItems += 1;
      return acc;
    }, { totalItems: 0, totalValue: 0, lowStockItems: 0, outOfStockItems: 0 });

    setStats(stats);
  };

  const handleAddItem = async (itemData) => {
    try {
      // TODO: Implement GraphQL mutation to add inventory item
      console.log('Adding inventory item:', itemData);
      toast.success('Inventory item added successfully');
      setShowAddModal(false);
      loadInventoryData(); // Refresh data
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
    }
  };

  const handleBarcodeScanned = (barcode) => {
    console.log('Barcode scanned:', barcode);
    
    // Search for existing inventory item with this barcode
    const existingItem = inventory.find(item => item.barcode === barcode);
    
    if (existingItem) {
      toast.success(`Found item: ${existingItem.name}`);
      // You could highlight the item in the list or open its details
      setSearchTerm(existingItem.name);
    } else {
      toast.info('Item not found. Would you like to add it?');
      // Pre-populate the add item modal with the barcode
      setShowAddModal(true);
      // You could pass the barcode to the modal to pre-fill it
    }
  };

  const handleItemFoundByBarcode = (item) => {
    if (item.isNew) {
      // Open add modal for new item
      toast.info('Adding new item to inventory');
      setShowAddModal(true);
    } else {
      // Show existing item details
      toast.success(`Found: ${item.name}`);
      setSearchTerm(item.name);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || item.category?.name === filters.category;
    const matchesLocation = !filters.location || item.location?.name === filters.location;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesLowStock = !filters.lowStock || item.isLowStock;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesLowStock;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaBox className="h-8 w-8 text-green-600" />
                Inventory Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track and manage your farm supplies and equipment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedView(selectedView === 'grid' ? 'list' : 'grid')}
              >
                {selectedView === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBarcodeScanner(true)}
              >
                <FaCamera className="h-4 w-4 mr-2" />
                Scan Barcode
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <InventoryStats stats={stats} />

            {/* Search and Filters */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <Button variant="outline">
                  <FaFilter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <InventoryFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                locations={locations}
              />
            </Card>

            {/* Inventory List */}
            <InventoryList
              items={filteredInventory}
              view={selectedView}
              onItemClick={(item) => console.log('Item clicked:', item)}
              onStockUpdate={(itemId, newStock) => console.log('Stock update:', itemId, newStock)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <LowStockAlerts
              alerts={alerts}
              onAlertClick={(alert) => console.log('Alert clicked:', alert)}
              onMarkAsRead={(alertId) => console.log('Mark as read:', alertId)}
            />

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  <FaCamera className="h-4 w-4 mr-2" />
                  Scan Barcode
                </Button>
                <Button variant="outline" fullWidth>
                  <FaChartBar className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" fullWidth>
                  <FaShoppingCart className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
                <Button variant="outline" fullWidth>
                  📊 Export Inventory
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddInventoryModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
          categories={categories}
          locations={locations}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <QuaggaBarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
          onItemFound={handleItemFoundByBarcode}
        />
      )}
    </div>
  );
};

export default InventoryPage;