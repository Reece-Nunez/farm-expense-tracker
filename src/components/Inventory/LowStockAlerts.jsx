import React from 'react';
import { FaExclamationTriangle, FaTimes, FaClock, FaCircle } from 'react-icons/fa';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const LowStockAlerts = ({ alerts, onAlertClick, onMarkAsRead }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <FaTimes className="h-5 w-5 text-red-500" />;
      case 'HIGH':
        return <FaExclamationTriangle className="h-5 w-5 text-orange-500" />;
      case 'MEDIUM':
        return <FaClock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FaCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'HIGH':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'MEDIUM':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');

  if (alerts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaCircle className="h-5 w-5 text-green-500" />
          Inventory Alerts
        </h3>
        <div className="text-center py-8">
          <FaCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All inventory levels look good!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            No stock alerts at this time
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaExclamationTriangle className="h-5 w-5 text-orange-500" />
          Inventory Alerts
        </h3>
        {unreadAlerts.length > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium">
            {unreadAlerts.length} new
          </span>
        )}
      </div>

      {/* Critical Alerts Summary */}
      {criticalAlerts.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FaTimes className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-800 dark:text-red-300">
              Critical Issues
            </span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400">
            {criticalAlerts.length} item{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
          </p>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 p-3 rounded-r-lg cursor-pointer transition-colors hover:shadow-md ${getSeverityColor(alert.severity)} ${
              !alert.isRead ? 'font-medium' : 'opacity-75'
            }`}
            onClick={() => onAlertClick(alert)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white leading-tight">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.item.name}
                    </span>
                    {!alert.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
              
              {!alert.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(alert.id);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-2"
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
            
            {/* Additional Alert Details */}
            {alert.alertType === 'LOW_STOCK' && alert.currentStock !== undefined && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Current: {alert.currentStock} | Minimum: {alert.thresholdStock}
              </div>
            )}
            
            {alert.expirationDate && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Expires: {new Date(alert.expirationDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {alerts.length > 10 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing 10 of {alerts.length} alerts
          </p>
          <Button variant="outline" size="sm" fullWidth className="mt-2">
            View All Alerts
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          {unreadAlerts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => unreadAlerts.forEach(alert => onMarkAsRead(alert.id))}
            >
              Mark All Read
            </Button>
          )}
          {criticalAlerts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              Create Orders
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LowStockAlerts;