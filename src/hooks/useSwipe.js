import { useState, useEffect } from 'react';

// Custom hook for swipe gestures
export const useSwipe = (onSwipe = () => {}, threshold = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = threshold;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe('left');
    } else if (isRightSwipe) {
      onSwipe('right');
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Hook for pull-to-refresh
export const usePullToRefresh = (onRefresh = () => {}, threshold = 100) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const onTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const onTouchMove = (e) => {
    if (startY === 0) return;

    const currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;

    if (pullDistance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setCurrentY(currentY);
      setIsPulling(pullDistance > 30);
    }
  };

  const onTouchEnd = async () => {
    if (startY === 0) return;

    const pullDistance = currentY - startY;
    
    if (pullDistance > threshold && window.scrollY === 0) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error during refresh:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartY(0);
    setCurrentY(0);
    setIsPulling(false);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isRefreshing,
    isPulling,
    pullDistance: Math.max(0, currentY - startY),
  };
};

// Hook for long press gestures
export const useLongPress = (onLongPress = () => {}, delay = 500) => {
  const [pressTimer, setPressTimer] = useState(null);

  const onTouchStart = (e) => {
    const timer = setTimeout(() => {
      onLongPress(e);
    }, delay);
    setPressTimer(timer);
  };

  const onTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const onTouchMove = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  };
};