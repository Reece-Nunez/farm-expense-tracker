import React, { useRef, useState, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const CameraCapture = ({ onCapture, onClose, mode = 'receipt' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        // Create file object for upload
        const file = new File([blob], `${mode}-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        onCapture?.(file, imageUrl);
      }
    }, 'image/jpeg', 0.8);
  }, [mode, onCapture]);

  const retake = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    startCamera();
  }, [capturedImage, startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    onClose?.();
  }, [stopCamera, capturedImage, onClose]);

  // Auto-start camera on mount
  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center p-6">
            <div className="text-xl mb-4 font-semibold text-gray-500">Camera</div>
            <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={startCamera} fullWidth>
                Try Again
              </Button>
              <Button variant="primary" onClick={handleClose} fullWidth>
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
        <h2 className="text-lg font-semibold">
          {mode === 'receipt' ? 'Capture Receipt' : 'Take Photo'}
        </h2>
        <Button variant="ghost" size="sm" onClick={handleClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Camera overlay */}
            {isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-48 border-2 border-white border-dashed rounded-lg opacity-50" />
              </div>
            )}

            {/* Capture button */}
            {isStreaming && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full" />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            
            {/* Action buttons */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button variant="outline" size="lg" onClick={retake}>
                Retake
              </Button>
              <Button variant="primary" size="lg" onClick={handleClose}>
                Use Photo
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;