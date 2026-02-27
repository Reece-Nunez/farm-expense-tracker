import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const ReceiptScanner = ({ onCapture, onClose, onProcessReceipt }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Start with rear camera
  const streamRef = useRef(null);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Add a small delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (videoRef.current && videoRef.current.srcObject === stream) {
          try {
            await videoRef.current.play();
            setIsStreaming(true);
            toast.success('Camera ready! Position your receipt in the frame');
          } catch (playError) {
            // Handle AbortError and other play() errors
            if (playError.name === 'AbortError') {
              console.log('Video play was interrupted, this is normal during camera switching');
              // Don't show error for AbortError as it's usually due to quick re-renders
            } else {
              console.error('Error playing video:', playError);
              setError('Failed to start video stream');
              toast.error('Failed to start camera stream');
            }
          }
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Could not access camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported by this browser';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    // Stop tracks from the stored stream reference
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopCamera();
        toast.success('Receipt captured! Review and process.');
        
        // Notify parent component
        onCapture?.(blob, imageUrl);
      }
    }, 'image/jpeg', 0.8);
  }, [onCapture, stopCamera]);

  // Toggle camera (front/back)
  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, [stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    startCamera();
  }, [capturedImage, startCamera]);

  // Process receipt with OCR
  const processReceipt = async () => {
    if (!capturedImage) return;
    
    setProcessing(true);
    try {
      // Convert captured image to File object for processing
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'receipt.jpg', { type: 'image/jpeg' });
      
      // Call parent's processing function
      await onProcessReceipt?.(file, capturedImage);
      
      toast.success('Receipt processed successfully!');
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle file input (for devices without camera)
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      stopCamera();
      onCapture?.(file, imageUrl);
      toast.success('Image selected! Review and process.');
    }
  };

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Scan Receipt
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Camera/Image Area */}
        <div className="p-4">
          {error ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4 font-semibold text-gray-500">Camera</div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Camera Error</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              
              {/* Fallback file input */}
              <div className="space-y-4">
                <label className="block">
                  <span className="sr-only">Choose receipt image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
                <Button variant="outline" onClick={startCamera} fullWidth>
                  Try Camera Again
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Preview captured image */
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={capturedImage}
                  alt="Captured receipt"
                  className="w-full h-auto max-h-96 object-contain"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                  Captured
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={retakePhoto} fullWidth>
                  Retake
                </Button>
                <Button 
                  variant="primary" 
                  onClick={processReceipt} 
                  loading={processing}
                  fullWidth
                >
                  {processing ? 'Processing...' : 'Process Receipt'}
                </Button>
              </div>
            </div>
          ) : (
            /* Live camera view */
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-96 object-cover"
                />
                
                {/* Camera overlay guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                    <p className="text-sm font-medium mb-1">Position receipt here</p>
                    <p className="text-xs opacity-75">Ensure all text is visible and clear</p>
                  </div>
                </div>
                
                {/* Camera controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={toggleCamera}>
                      Flip
                    </Button>
                    
                    <button
                      onClick={capturePhoto}
                      disabled={!isStreaming}
                      className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                      </div>
                    </button>
                    
                    <label className="cursor-pointer">
                      <span className="sr-only">Upload image</span>
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                        Upload
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Real OCR Active</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Receipt text will be extracted using advanced OCR technology
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Tips:</strong> Hold steady, ensure good lighting, and capture the entire receipt
                </p>
              </div>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Card>
    </div>
  );
};

export default ReceiptScanner;