import React, { useState, useRef, useEffect } from 'react';
import Quagga from 'quagga';
import { FaTimes, FaCamera, FaSearch, FaBox, FaExclamationTriangle, FaCircle } from 'react-icons/fa';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const QuaggaBarcodeScanner = ({ onScan, onClose, onItemFound = null }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(null);
  const [scanMode, setScanMode] = useState('camera');
  const [lastScan, setLastScan] = useState(null);
  const [scanConfidence, setScanConfidence] = useState(0);

  const initializeScanner = async () => {
    try {
      setError(null);
      
      const config = {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader"
          ]
        },
        locate: true
      };

      await new Promise((resolve, reject) => {
        Quagga.init(config, (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            reject(err);
            return;
          }
          resolve();
        });
      });

      // Start scanning
      Quagga.start();
      setIsScanning(true);

      // Handle detection events
      Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;
        const confidence = result.codeResult.confidence || 0;
        
        console.log('Barcode detected:', barcode, 'Confidence:', confidence);
        
        // Only accept high confidence scans to reduce false positives
        if (confidence > 75) {
          handleBarcodeDetected(barcode, confidence);
        }
      });

      toast.success('Barcode scanner initialized! Point camera at barcode');
    } catch (err) {
      console.error('Scanner initialization error:', err);
      let errorMessage = 'Failed to initialize barcode scanner';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Try manual entry.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Barcode scanning not supported in this browser.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopScanner = () => {
    if (isScanning) {
      try {
        Quagga.stop();
        setIsScanning(false);
        toast.info('Scanner stopped');
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleBarcodeDetected = (barcode, confidence = 100) => {
    // Prevent duplicate scans of the same barcode within a short time
    if (lastScan === barcode && Date.now() - scanConfidence < 2000) {
      return;
    }

    setLastScan(barcode);
    setScanConfidence(Date.now());
    
    console.log('Processing barcode:', barcode);
    setScanResults(prev => {
      const newResults = [
        { barcode, confidence, timestamp: new Date() },
        ...prev.filter(item => item.barcode !== barcode)
      ].slice(0, 10); // Keep last 10 unique scans
      return newResults;
    });

    // Notify parent component
    onScan(barcode);
    
    // Check if this barcode matches an existing inventory item
    if (onItemFound) {
      // This would typically query your database
      checkInventoryItem(barcode);
    }

    toast.success(`Barcode scanned: ${barcode}`, {
      icon: '📄'
    });
  };

  const checkInventoryItem = async (barcode) => {
    // Mock inventory check - replace with actual database query
    try {
      // Simulate API call delay
      setTimeout(() => {
        const mockInventoryItems = [
          {
            barcode: '1234567890123',
            name: 'Premium Chicken Feed',
            currentStock: 12,
            category: 'Feed & Nutrition'
          },
          {
            barcode: '9876543210987',
            name: 'Cedar Fence Posts',
            currentStock: 3,
            category: 'Tools & Equipment'
          }
        ];

        const foundItem = mockInventoryItems.find(item => item.barcode === barcode);
        
        if (foundItem) {
          toast.success(`Found: ${foundItem.name}`, {
            duration: 4000,
            icon: '✅'
          });
          onItemFound(foundItem);
        } else {
          toast.info('Item not found in inventory. Add new item?', {
            duration: 4000,
            icon: '❓'
          });
          onItemFound({ barcode, isNew: true });
        }
      }, 500);
    } catch (error) {
      console.error('Error checking inventory item:', error);
      toast.error('Failed to check inventory item');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim(), 100);
      setManualBarcode('');
    }
  };

  const clearResults = () => {
    setScanResults([]);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [isScanning]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBox className="h-6 w-6 text-indigo-600" />
              Advanced Barcode Scanner
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={scanMode === 'camera' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setScanMode('camera')}
            >
              <FaCamera className="h-4 w-4 mr-2" />
              Camera Scan
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setScanMode('manual')}
            >
              <FaSearch className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scanner Area */}
            <div className="lg:col-span-2">
              {scanMode === 'camera' ? (
                <div className="space-y-4">
                  {error ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2 text-red-600">Scanner Error</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                      <div className="space-y-2">
                        <Button onClick={() => setScanMode('manual')}>
                          Switch to Manual Entry
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setError(null);
                          initializeScanner();
                        }}>
                          Retry Camera
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Camera View */}
                      <div className="relative rounded-lg overflow-hidden bg-black border-2 border-gray-300 dark:border-gray-600">
                        <div
                          ref={scannerRef}
                          className="w-full h-96 bg-black flex items-center justify-center"
                        >
                          {!isScanning && (
                            <div className="text-white text-center">
                              <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>Click "Start Scanner" to begin</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Scanner Status Overlay */}
                        {isScanning && (
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              Active Scanner
                            </div>
                            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                              Multi-format Detection
                            </div>
                          </div>
                        )}

                        {/* Scanning Guide Overlay */}
                        {isScanning && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="border-2 border-white border-dashed rounded-lg w-64 h-32 relative">
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
                                Position barcode here
                              </div>
                              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
                              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
                              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
                              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Scanner Controls */}
                      <div className="flex items-center justify-center gap-4">
                        {!isScanning ? (
                          <Button onClick={initializeScanner}>
                            <FaCamera className="h-4 w-4 mr-2" />
                            Start Scanner
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={stopScanner}>
                            Stop Scanner
                          </Button>
                        )}
                      </div>

                      {/* Scanner Info */}
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                          🔍 Supported Formats
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-indigo-700 dark:text-indigo-400">
                          <div>• Code 128</div>
                          <div>• EAN-13/8</div>
                          <div>• UPC-A/E</div>
                          <div>• Code 39</div>
                          <div>• Codabar</div>
                          <div>• Code 93</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Entry Mode */
                <div className="space-y-4">
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaSearch className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Manual Barcode Entry</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Enter barcode numbers manually or paste from clipboard
                    </p>
                    
                    <form onSubmit={handleManualSubmit} className="max-w-md mx-auto space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualBarcode}
                          onChange={(e) => setManualBarcode(e.target.value)}
                          placeholder="Enter barcode number..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          autoFocus
                        />
                        <Button type="submit" disabled={!manualBarcode.trim()}>
                          Add
                        </Button>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-xs text-gray-500 mb-2">Common formats:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                          <div>EAN-13: 13 digits</div>
                          <div>UPC-A: 12 digits</div>
                          <div>Code 128: Variable</div>
                          <div>Code 39: Alphanumeric</div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Results & Info */}
            <div className="space-y-4">
              {/* Recent Scans */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Scans
                  </h3>
                  {scanResults.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearResults}>
                      Clear
                    </Button>
                  )}
                </div>

                {scanResults.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaBox className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No barcodes scanned yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {scanResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {result.barcode}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{scanResults.length - index}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCircle className="h-3 w-3 text-green-500" />
                            {Math.round(result.confidence)}% confidence
                          </span>
                          <span>
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" fullWidth>
                    🔍 Look up item
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    ➕ Add to inventory
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    📝 Update stock
                  </Button>
                </div>
              </Card>

              {/* Tips */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  📱 Scanning Tips
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                  <li>• Hold device 6-12 inches from barcode</li>
                  <li>• Ensure barcode is well-lit</li>
                  <li>• Keep barcode flat and uncrumpled</li>
                  <li>• Try different angles if not working</li>
                  <li>• Clean camera lens if blurry</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <div className="text-sm text-gray-500">
              {scanResults.length > 0 && (
                <span>{scanResults.length} barcode{scanResults.length !== 1 ? 's' : ''} scanned</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                toast.success('Barcode session saved');
                onClose();
              }}>
                Save & Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuaggaBarcodeScanner;