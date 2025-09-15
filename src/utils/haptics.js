// Haptic feedback utilities for mobile devices
export const haptics = {
  // Light impact feedback (for button taps, selections)
  light: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  },

  // Medium impact feedback (for toggle switches, confirmations)
  medium: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  },

  // Heavy impact feedback (for errors, important actions)
  heavy: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  },

  // Success feedback (for completed actions)
  success: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([10, 50, 10]);
    }
  },

  // Error feedback (for failed actions)
  error: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 100, 50]);
    }
  },

  // Selection feedback (for list item selection)
  selection: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  },

  // Check if haptics are supported
  isSupported: () => {
    return !!(window.navigator && window.navigator.vibrate);
  }
};

export default haptics;