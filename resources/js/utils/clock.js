/**
 * Keeps the on-page clock in sync with the current time.
 * The logic runs lazily to avoid touching the DOM when the clock element is absent.
 */
(() => {
	const clockEl = document.getElementById('clock');
	if (!clockEl) return;

	const updateClock = () => {
		const now = new Date();
		const hh = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		clockEl.textContent = `${hh}:${mm}`;
	};

	updateClock();
	setInterval(updateClock, 1000);
})();