import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const InvoiceFormTemp = ({ onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Invoice Form (Demo)
        </h2>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold mb-2">Invoice Form Ready</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The invoice form components have been created but require the GraphQL schema to be deployed to AWS Amplify.
          </p>
          
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p>✅ InvoiceForm.jsx component created</p>
            <p>✅ Complete form with line items</p>
            <p>✅ Customer selection and product integration</p>
            <p>✅ Dynamic calculations and validation</p>
            <p>⏳ Requires: amplify push to deploy GraphQL schema</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-left max-w-md mx-auto">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>Run `amplify push` to deploy schema</li>
              <li>Replace temp components with full versions</li>
              <li>Test invoice creation workflow</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 md:flex-none"
          >
            Back to List
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceFormTemp;