(function() {
  const helperSrc = 'js/webr-helper.js';
  let loadingPromise = null;

  /**
   * Ensure the WebR helper script is loaded before use.
   * Returns the helper instance once available.
   */
  async function loadWebRHelper() {
    if (window.webRHelper) {
      return window.webRHelper;
    }

    if (!loadingPromise) {
      loadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = helperSrc;
        script.async = true;
        script.onload = () => {
          if (window.webRHelper) {
            resolve(window.webRHelper);
          } else {
            reject(new Error('WebR helper script loaded but did not initialize.'));
          }
        };
        script.onerror = () => {
          reject(new Error(`Failed to load WebR helper script from ${helperSrc}.`));
        };
        document.head.appendChild(script);
      }).finally(() => {
        loadingPromise = null;
      });
    }

    return loadingPromise;
  }

  window.ensureWebRHelper = loadWebRHelper;
})();
