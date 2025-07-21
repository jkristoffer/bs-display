// Ensure React is available globally
(function() {
  if (typeof window !== 'undefined') {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
  }
})();