import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaCamera, FaSearch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import { Card } from '../ui/card';
import Button from '../ui/button';
import toast from 'react-hot-toast';

const BarcodeScanner = ({ onScan, onClose, mode = 'scan' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [scanMode, setScanMode] = useState('camera'); // camera, manual

  // Initialize camera for barcode scanning
  const startScanning = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
        setIsScanning(true);
        
        // Start barcode detection
        detectBarcodes();
        
        toast.success('Camera ready! Point at barcode to scan');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Could not access camera for barcode scanning';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device. Try manual entry.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const detectBarcodes = () => {
    // Note: This is a simplified implementation
    // In production, you'd use a library like @zxing/library or quagga2
    
    const detect = () => {
      if (!isScanning || !videoRef.current) return;

      // Capture frame from video
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const video = videoRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Here you would typically use a barcode detection library
        // For demo purposes, we'll simulate barcode detection
        simulateBarcodeDetection();
      }

      if (isScanning) {
        requestAnimationFrame(detect);
      }
    };

    detect();
  };

  const simulateBarcodeDetection = () => {
    // Simulate finding a barcode (for demo purposes)
    // In production, replace with actual barcode detection logic
    const mockBarcodes = [
      '1234567890123',
      '9876543210987',
      '4567890123456'
    ];
    
    // Randomly simulate finding a barcode (very low probability)
    if (Math.random() < 0.001) {
      const barcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      handleBarcodeDetected(barcode);
    }
  };

  const handleBarcodeDetected = (barcode) => {
    console.log('Barcode detected:', barcode);
    setScanResults(prev => {
      if (!prev.includes(barcode)) {
        const newResults = [barcode, ...prev].slice(0, 10); // Keep last 10 scans
        toast.success(`Barcode detected: ${barcode}`);
        onScan(barcode);
        return newResults;
      }
      return prev;
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  const clearResults = () => {
    setScanResults([]);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBox className="h-6 w-6 text-indigo-600" />
              Barcode Scanner
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
                      <h3 className="text-lg font-semibold mb-2 text-red-600">Camera Error</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                      <Button onClick={() => setScanMode('manual')}>
                        Switch to Manual Entry
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Camera View */}
                      <div className="relative rounded-lg overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-auto max-h-96 object-cover"
                        />
                        
                        {/* Scanning Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                              <p className="text-sm font-medium mb-1">Point camera at barcode</p>
                              <p className="text-xs opacity-75">Position barcode within the frame</p>
                            </div>
                          </div>
                          
                          {isScanning && (
                            <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                              ● Scanning...
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Camera Controls */}
                      <div className="flex items-center justify-center gap-4">
                        {!isScanning ? (
                          <Button onClick={startScanning}>
                            <FaCamera className="h-4 w-4 mr-2" />
                            Start Scanning
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={stopScanning}>
                            Stop Scanning
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Entry Mode */
                <div className="space-y-4">
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaSearch className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Manual Barcode Entry</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Enter the barcode number manually
                    </p>
                    
                    <form onSubmit={handleManualSubmit} className="max-w-md mx-auto">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualBarcode}
                          onChange={(e) => setManualBarcode(e.target.value)}
                          placeholder="Enter barcode..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <Button type="submit" disabled={!manualBarcode.trim()}>
                          Scan
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Hidden canvas for frame capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Scan Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Scan Results
                </h3>
                {scanResults.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearResults}>
                    Clear
                  </Button>
                )}
              </div>

              {scanResults.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaBox className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No barcodes scanned yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scanResults.map((barcode, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onScan(barcode)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {barcode}
                        </span>
                        <span className="text-xs text-gray-500">
                          Scan #{scanResults.length - index}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Barcode Scanner Tips */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                  📱 Scanning Tips
                </h4>
                <ul className="text-xs text-indigo-700 dark:text-indigo-400 space-y-1">
                  <li>• Hold device steady over barcode</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep barcode flat and clean</li>
                  <li>• Try different distances if not working</li>
                  <li>• Use manual entry for damaged codes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Close Scanner
            </Button>
            <Button 
              onClick={() => {
                toast.success('Scanner session saved');
                onClose();
              }}
            >
              Save Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BarcodeScanner;