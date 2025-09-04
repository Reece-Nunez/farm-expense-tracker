import React from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';

const InvoiceViewTemp = ({ onEdit, onClose, onGeneratePDF }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoice View (Demo)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Invoice viewing component placeholder
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Placeholder Content */}
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">👁️</div>
        <h3 className="text-xl font-semibold mb-2">Invoice View Ready</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The invoice view component has been created and will display detailed invoice information once the GraphQL schema is deployed.
        </p>
        
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <p>✅ InvoiceView.jsx component created</p>
          <p>✅ Status management functionality</p>
          <p>✅ Customer and line item display</p>
          <p>✅ PDF generation integration ready</p>
          <p>⏳ Requires: GraphQL schema deployment</p>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceViewTemp;