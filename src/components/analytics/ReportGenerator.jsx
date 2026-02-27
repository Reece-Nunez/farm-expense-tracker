import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const ReportGenerator = ({ farmId, analyticsData, onExport }) => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'expense_summary',
      name: 'Expense Summary',
      description: 'Comprehensive breakdown of all expenses by category and time period',
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'income_analysis',
      name: 'Income Analysis',
      description: 'Detailed analysis of income sources and revenue trends',
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'profitability',
      name: 'Profitability Report',
      description: 'Profit margins, ROI analysis, and financial performance metrics',
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'cash_flow',
      name: 'Cash Flow Statement',
      description: 'Monthly cash flow analysis with projections',
      estimatedTime: '4-5 minutes'
    },
    {
      id: 'inventory_analysis',
      name: 'Inventory Analysis',
      description: 'Stock levels, turnover rates, and inventory optimization',
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'tax_summary',
      name: 'Tax Summary',
      description: 'Tax-ready financial summary with deductible expenses',
      estimatedTime: '5-6 minutes'
    },
    {
      id: 'budget_variance',
      name: 'Budget vs Actual',
      description: 'Compare planned budget against actual spending',
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'custom_dashboard',
      name: 'Custom Dashboard',
      description: 'Personalized report with selected metrics and charts',
      estimatedTime: '4-5 minutes'
    }
  ];

  const dateRangeOptions = [
    { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
    { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
    { value: 'LAST_6_MONTHS', label: 'Last 6 Months' },
    { value: 'LAST_YEAR', label: 'Last Year' },
    { value: 'YEAR_TO_DATE', label: 'Year to Date' },
    { value: 'CUSTOM', label: 'Custom Range' }
  ];

  const formatOptions = [
    { value: 'PDF', label: 'PDF Document' },
    { value: 'EXCEL', label: 'Excel Spreadsheet' },
    { value: 'CSV', label: 'CSV Data' },
    { value: 'JSON', label: 'JSON Data' }
  ];

  const handleReportToggle = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAllReports = () => {
    setSelectedReports(reportTypes.map(report => report.id));
  };

  const clearAllReports = () => {
    setSelectedReports([]);
  };

  const generateReports = async () => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report type');
      return;
    }

    setGenerating(true);
    
    try {
      for (const reportId of selectedReports) {
        const report = reportTypes.find(r => r.id === reportId);
        toast.loading(`Generating ${report.name}...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success(`${report.name} completed`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`All ${selectedReports.length} reports generated successfully!`);
      
      if (onExport) {
        onExport(`Combined Report (${selectedReports.length} reports)`);
      }

    } catch (error) {
      toast.error('Failed to generate reports');
    } finally {
      setGenerating(false);
    }
  };

  const getEstimatedTime = () => {
    if (selectedReports.length === 0) return '0 minutes';
    
    const totalMinutes = selectedReports.reduce((total, reportId) => {
      const report = reportTypes.find(r => r.id === reportId);
      const timeRange = report.estimatedTime.match(/(\d+)-(\d+)/);
      return total + (timeRange ? parseInt(timeRange[2]) : 3);
    }, 0);
    
    return `${totalMinutes} minutes`;
  };

  return (
    <div className="space-y-6">

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Report Generator</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Generate comprehensive reports for your farm's financial data. Select the report types you need and configure the output format.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


          <div className="flex items-end gap-2">
            <Button variant="outline" size="sm" onClick={selectAllReports}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllReports}>
              Clear
            </Button>
          </div>
        </div>
      </Card>


      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Report Types</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedReports.length} selected • Est. time: {getEstimatedTime()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedReports.includes(report.id)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleReportToggle(report.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </h4>
                    {selectedReports.includes(report.id) && (
                      <span className="text-indigo-600">(selected)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {report.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Est. time: {report.estimatedTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>


      {selectedReports.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generation Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{selectedReports.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reports Selected</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getEstimatedTime()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{reportFormat}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Export Format</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={generateReports}
              loading={generating}
              size="lg"
              className="px-8"
            >
              {generating ? 'Generating Reports...' : `Generate ${selectedReports.length} Report${selectedReports.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </Card>
      )}


      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        
        <div className="space-y-3">

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">[R]</span>
              <div>
                <div className="font-medium">Monthly Financial Summary</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Generated 2 days ago • PDF • 2.3 MB
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">[T]</span>
              <div>
                <div className="font-medium">Tax Summary 2024</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Generated 1 week ago • Excel • 1.8 MB
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">[A]</span>
              <div>
                <div className="font-medium">Inventory Analysis Q3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Generated 2 weeks ago • PDF • 3.1 MB
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Reports
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportGenerator;