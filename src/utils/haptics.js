export const haptics = {
  light: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  },

  medium: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  },

  heavy: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  },

  success: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([10, 50, 10]);
    }
  },

  error: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 100, 50]);
    }
  },

  selection: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  },

  isSupported: () => {
    return !!(window.navigator && window.navigator.vibrate);
  }
};

export default haptics;