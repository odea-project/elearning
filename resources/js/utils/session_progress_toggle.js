/**
 * Creates a top-left overlay toggle that manages session progress JSON files.
 * The control exposes three states: "Load", "Off" (default), and "New".
 *
 * - Load: prompts the user to select an existing session JSON and validates
 *         its integrity by re-computing the stored hash.
 * - Off:  neutral state doing nothing.
 * - New:  generates a fresh session JSON template and triggers a download.
 *
 * The session envelope stored on disk has the following structure:
 * {
 *   "meta": { "version": 1, "createdAt": "ISO-8601", "updatedAt": "ISO-8601" },
 *   "data": {
 *     "slidesVisited": [
 *       { "slideId": "distance-matrix", "visitedAt": "ISO-8601" }
 *     ],
 *     "topicsCompleted": [],
 *     "exercisesSolved": []
 *   },
 *   "hash": "sha256-hex-over(meta+data)"
 * }
 */
(() => {
  const OVERLAY_ID = 'session-progress-toggle';
  const CONTROL_HEIGHT = 48;
  const CONTROL_WIDTH = 180;

  if (document.getElementById(OVERLAY_ID)) return;

  let sessionTrackingEnabled = false;
  let pendingActivateButton = null;
  let lastRecordedSlide = null;
  let activeButton = null;
  let fileHandle = null;
  let saveDebounce = null;

  const revealPromise = waitForReveal();
  attachGlobalListeners();

  const container = document.createElement('div');
  container.id = OVERLAY_ID;
  container.ariaLabel = 'Session tracking toggle';
  Object.assign(container.style, {
    position: 'fixed',
    top: '16px',
    left: '16px',
    zIndex: '100000',
    width: `${CONTROL_WIDTH}px`,
    height: `${CONTROL_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(6, 18, 51, 0.82)',
    borderRadius: '999px',
    boxShadow: '0 10px 30px rgba(0, 238, 255, 0.25)',
    border: '1px solid rgba(0, 238, 255, 0.45)',
    backdropFilter: 'blur(6px)',
    color: '#dff9ff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    userSelect: 'none',
    cursor: 'default',
    gap: '6px',
    padding: '4px 10px'
  });

  const hiddenFileInput = document.createElement('input');
  hiddenFieldSetup(hiddenFileInput);
  container.appendChild(hiddenFileInput);

  const buttons = [
    createToggleButton('load', 'Load'),
    createToggleButton('off', 'Off'),
    createToggleButton('new', 'New'),
    createToggleButton('save', 'Save')
  ];

  buttons.forEach((btn) => container.appendChild(btn));
  setActive(buttons[1]);
  document.body.appendChild(container);

  function createToggleButton(value, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.state = value;
    button.textContent = label;
    Object.assign(button.style, {
      flex: '1 1 0',
      height: '32px',
      borderRadius: '999px',
      border: 'none',
      background: 'transparent',
      color: 'inherit',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: 'inset 0 0 0 1px rgba(0, 238, 255, 0.35)'
    });

    button.addEventListener('click', async () => {
      switch (value) {
        case 'load':
          pendingActivateButton = button;
          await promptForExistingSession();
          break;
        case 'new':
          await createNewSession(button);
          break;
        case 'save':
          if (fileHandle) {
            await saveToDisk();
          } else {
            triggerDownload(window.sessionProgress);
          }
          break;
        case 'off':
        default:
          disableSessionTracking();
          break;
      }
    });

    return button;
  }

  function setActive(targetButton) {
    buttons.forEach((btn) => {
      const isActive = btn === targetButton;
      btn.setAttribute('aria-pressed', String(isActive));
      if (isActive) {
        btn.style.background = 'rgba(0, 238, 255, 0.18)';
        btn.style.color = '#00eaff';
        btn.style.boxShadow = 'inset 0 0 0 2px rgba(0, 238, 255, 0.65), 0 4px 14px rgba(0, 238, 255, 0.35)';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#dff9ff';
        btn.style.boxShadow = 'inset 0 0 0 1px rgba(0, 238, 255, 0.35)';
      }
    });
    activeButton = targetButton;
  }

  function hiddenFieldSetup(inputEl) {
    inputEl.type = 'file';
    inputEl.accept = 'application/json';
    inputEl.style.display = 'none';
    inputEl.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const contents = await file.text();
        const session = JSON.parse(contents);
        const { hash, meta, data } = session;
        if (!hash || !meta || !data) {
          throw new Error('Session file missing required keys.');
        }
        const computedHash = await computeHash(meta, data);
        if (computedHash !== hash) {
          throw new Error('Session file failed integrity check.');
        }
        fileHandle = null;
        const envelope = { meta, data, hash };
        normalizeSessionData(envelope);
        activateSessionTracking(envelope, pendingActivateButton || buttons.find((b) => b.dataset.state === 'load'), 'loaded');
      } catch (error) {
        console.error('Unable to load session file:', error);
        alert(`Unable to load session file: ${error.message}`);
        if (!sessionTrackingEnabled) {
          disableSessionTracking();
        } else if (activeButton) {
          setActive(activeButton);
        }
      } finally {
        event.target.value = '';
        pendingActivateButton = null;
      }
    });
  }

  async function promptForExistingSession() {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
          excludeAcceptAllOption: true,
          multiple: false
        });
        const file = await handle.getFile();
        const contents = await file.text();
        const session = JSON.parse(contents);
        const { hash, meta, data } = session;
        if (!hash || !meta || !data) {
          throw new Error('Session file missing required keys.');
        }
        const computedHash = await computeHash(meta, data);
        if (computedHash !== hash) {
          throw new Error('Session file failed integrity check.');
        }
        fileHandle = handle;
        const envelope = { meta, data, hash };
        normalizeSessionData(envelope);
        activateSessionTracking(envelope, pendingActivateButton || buttons.find((b) => b.dataset.state === 'load'), 'loaded');
        return;
      } catch (err) {
        console.warn('OpenFilePicker not available or cancelled, using fallback.', err);
        if (!sessionTrackingEnabled && activeButton) {
          setActive(activeButton);
        }
      }
    }
    hiddenFileInput.click();
  }

  async function createNewSession(sourceButton) {
    const timestamp = new Date().toISOString();
    const meta = {
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const data = {
      slidesVisited: [],
      topicsCompleted: [],
      exercisesSolved: []
    };
    try {
      const envelope = await buildEnvelope(meta, data);

      if ('showSaveFilePicker' in window) {
        try {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: buildFilename(),
            types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
            excludeAcceptAllOption: true
          });
          window.sessionProgress = envelope;
          normalizeSessionData(envelope);
          await saveToDisk();
        } catch (err) {
          console.warn('SaveFilePicker cancelled, falling back to download.', err);
          triggerDownload(envelope);
        }
      } else {
        triggerDownload(envelope);
      }

      normalizeSessionData(envelope);
      document.dispatchEvent(new CustomEvent('session-progress-created', { detail: envelope }));
      activateSessionTracking(envelope, sourceButton || buttons.find((b) => b.dataset.state === 'new'), 'created');
    } catch (error) {
      console.error('Unable to create new session file:', error);
      alert(`Unable to create new session file: ${error.message}`);
      if (!sessionTrackingEnabled) {
        disableSessionTracking();
      }
    }
  }

  function disableSessionTracking() {
    sessionTrackingEnabled = false;
    lastRecordedSlide = null;
    fileHandle = null;
    setActive(buttons.find((b) => b.dataset.state === 'off'));
    document.dispatchEvent(new CustomEvent('session-progress-disabled', {
      detail: window.sessionProgress || null
    }));
  }

  function buildFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `session-progress-${timestamp}.json`;
  }

  function normalizeSessionData(envelope) {
    if (!envelope.meta) envelope.meta = {};
    if (!envelope.meta.updatedAt) envelope.meta.updatedAt = new Date().toISOString();

    if (!envelope.data || typeof envelope.data !== 'object') {
      envelope.data = {};
    }

    if (!Array.isArray(envelope.data.topicsCompleted)) {
      envelope.data.topicsCompleted = [];
    }
    if (!Array.isArray(envelope.data.exercisesSolved)) {
      envelope.data.exercisesSolved = [];
    }

    const history = envelope.data.slidesVisited;
    if (!Array.isArray(history)) {
      envelope.data.slidesVisited = [];
    } else if (history.length && typeof history[0] === 'string') {
      envelope.data.slidesVisited = history.map((slideId) => ({ slideId, visitedAt: null }));
    } else {
      envelope.data.slidesVisited = history.filter((entry) => entry && entry.slideId);
    }
  }

  function ensureHistoryArray(progress) {
    normalizeSessionData(progress);
    return progress.data.slidesVisited;
  }

  async function activateSessionTracking(envelope, sourceButton, origin) {
    window.sessionProgress = envelope;
    sessionTrackingEnabled = true;
    const history = ensureHistoryArray(window.sessionProgress);
    lastRecordedSlide = history.length ? history[history.length - 1].slideId : null;
    setActive(sourceButton || buttons.find((b) => b.dataset.state === 'load'));
    document.dispatchEvent(new CustomEvent('session-progress-activated', {
      detail: { envelope, origin }
    }));
    try {
      await recordCurrentSlide();
    } catch (error) {
      console.error('Unable to record current slide:', error);
    }
  }

  function attachGlobalListeners() {
    revealPromise
      .then((reveal) => {
        if (reveal && typeof reveal.on === 'function') {
          reveal.on('slidechanged', (event) => {
            recordSlideFromElement(event.currentSlide);
          });
        }
      })
      .catch(() => {
        /* Reveal not present – rely on hashchange fallback */
      });

    window.addEventListener('hashchange', () => {
      recordCurrentSlide().catch((error) => {
        console.error('Unable to record slide from hashchange:', error);
      });
    });

    document.addEventListener('DOMContentLoaded', () => {
      recordCurrentSlide().catch(() => {});
    });
  }

  function recordSlideFromElement(slideEl) {
    if (!sessionTrackingEnabled) return;
    const slideId = resolveSlideIdFromElement(slideEl) || getSlideIdFromHash();
    if (slideId) {
      recordSlideVisit(slideId).catch((error) => {
        console.error('Unable to update slide visit history:', error);
      });
    }
  }

  async function recordCurrentSlide() {
    if (!sessionTrackingEnabled) return;
    let slideId = '';
    try {
      const reveal = await revealPromise;
      if (reveal && typeof reveal.getCurrentSlide === 'function') {
        const currentSlide = reveal.getCurrentSlide();
        slideId = resolveSlideIdFromElement(currentSlide) || '';
      }
    } catch (error) {
      console.warn('Reveal not ready, falling back to hash parsing.', error);
    }

    if (!slideId) {
      slideId = getSlideIdFromHash();
    }

    if (slideId) {
      await recordSlideVisit(slideId);
    }
  }

  async function saveToDiskDebounced() {
    if (!fileHandle) return;
    clearTimeout(saveDebounce);
    saveDebounce = setTimeout(saveToDisk, 400);
  }

  async function saveToDisk() {
    try {
      if (!fileHandle) return;
      await refreshSessionHash();
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(window.sessionProgress, null, 2));
      await writable.close();
    } catch (err) {
      console.warn('Autosave failed, falling back to download.', err);
      triggerDownload(window.sessionProgress);
    }
  }

  async function recordSlideVisit(slideId) {
    if (!sessionTrackingEnabled) return;
    if (!window.sessionProgress) return;
    if (slideId === lastRecordedSlide) return;

    const history = ensureHistoryArray(window.sessionProgress);
    const timestamp = new Date().toISOString();
    history.push({ slideId, visitedAt: timestamp });
    lastRecordedSlide = slideId;

    try {
      await refreshSessionHash();
      await saveToDiskDebounced();
      document.dispatchEvent(new CustomEvent('session-progress-updated', {
        detail: window.sessionProgress
      }));
    } catch (error) {
      console.error('Unable to refresh session hash:', error);
    }
  }

  async function refreshSessionHash() {
    if (!window.sessionProgress) return;
    window.sessionProgress.meta.updatedAt = new Date().toISOString();
    window.sessionProgress.hash = await computeHash(
      window.sessionProgress.meta,
      window.sessionProgress.data
    );
  }

  async function computeHash(meta, data) {
    const encoder = new TextEncoder();
    const raw = JSON.stringify({ meta, data });
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(raw));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function buildEnvelope(meta, data) {
    const hash = await computeHash(meta, data);
    return { meta, data, hash };
  }

  function triggerDownload(envelope) {
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = buildFilename();
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function waitForReveal(timeout = 8000) {
    if (window.Reveal && typeof window.Reveal.on === 'function') {
      return Promise.resolve(window.Reveal);
    }
    const interval = 100;
    let elapsed = 0;
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (window.Reveal && typeof window.Reveal.on === 'function') {
          clearInterval(timer);
          resolve(window.Reveal);
        } else {
          elapsed += interval;
          if (elapsed >= timeout) {
            clearInterval(timer);
            resolve(null);
          }
        }
      }, interval);
    });
  }

  function getSlideIdFromHash() {
    const hash = window.location.hash || '';
    const match = hash.match(/^#\/?([^/\s?]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function resolveSlideIdFromElement(slideEl) {
    if (!slideEl) return '';
    return slideEl.getAttribute('id') || slideEl.dataset?.slideId || '';
  }
})();
