(function() {
  const PANEL_BG = 'rgba(13, 20, 38, 0.05)';
  const COLORS = {
    coarse: '#ef476f',
    optimal: '#06d6a0',
    dense: '#ffd166'
  };

  function createSeededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 48271) % 0x7fffffff;
      if (state <= 0) state += 0x7ffffffe;
      return state / 0x7fffffff;
    };
  }

  function sampleNormal(rng) {
    const u1 = 1 - Math.min(rng(), 1 - Number.EPSILON);
    const u2 = 1 - Math.min(rng(), 1 - Number.EPSILON);
    const r = Math.sqrt(-2 * Math.log(u1));
    return r * Math.cos(2 * Math.PI * u2);
  }

  function sampleLogNormal(size, meanLog, sdLog, rng) {
    const values = new Array(size);
    for (let i = 0; i < size; i += 1) {
      const z = sampleNormal(rng);
      values[i] = Math.exp(meanLog + sdLog * z);
    }
    return values;
  }

  function safeNumber(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
  }

  window.initBinRulesVisual = function initBinRulesVisual(targetId = 'bin-rules-visual') {
    if (!window.d3) {
      console.warn('D3 not loaded. Bin rules visual will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 840;
    const containerHeight = Math.max(node.clientHeight || 0, 560);

    const margin = { top: 36, right: 32, bottom: 52, left: 48 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Histograms comparing bin count choices: coarse, balanced, and dense.');

    const baseGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rng = createSeededRandom(3201);
    const samples = sampleLogNormal(200, Math.log(12), 0.55, rng).filter(Number.isFinite);
    if (!samples.length) return;

    const n = samples.length;
    const minValue = d3.min(samples);
    const maxValue = d3.max(samples);
    const domainMin = Math.max(minValue - (maxValue - minValue) * 0.05, 0);
    const domainMax = maxValue * 1.05;

    const q1 = d3.quantile(samples, 0.25);
    const q3 = d3.quantile(samples, 0.75);
    const iqr = safeNumber(q3 - q1, 0);
    const stdev = safeNumber(d3.deviation(samples), 1);
    const range = domainMax - domainMin || 1;
    let fdWidth = (2 * (iqr || (0.79 * stdev))) / Math.cbrt(n);
    if (!Number.isFinite(fdWidth) || fdWidth <= 0) {
      fdWidth = range / Math.cbrt(n);
    }
    let fdBins = Math.round(range / fdWidth);
    if (!Number.isFinite(fdBins) || fdBins < 6) {
      fdBins = Math.max(6, Math.round(Math.sqrt(n)));
    }
    const coarseBins = Math.min(6, Math.max(3, Math.round(Math.sqrt(n) / 3)));
    const denseBins = Math.min(120, Math.max(fdBins + 10, Math.round(fdBins * 2.5)));

    const configs = [
      { key: 'coarse', label: 'Too few bins', sub: 'Under-smooths structure', bins: coarseBins },
      { key: 'optimal', label: 'Balanced bins', sub: 'Freedman-Diaconis', bins: fdBins },
      { key: 'dense', label: 'Too many bins', sub: 'Overfits noise', bins: denseBins }
    ];

    function buildBins(binCount) {
      const count = Math.max(1, binCount);
      const range = domainMax - domainMin || 1;
      const step = range / count;
      const thresholds = d3.range(domainMin, domainMax, step);
      if (thresholds[thresholds.length - 1] !== domainMax) {
        thresholds.push(domainMax);
      }
      const binGenerator = d3.bin()
        .domain([domainMin, domainMax])
        .thresholds(thresholds);
      return binGenerator(samples);
    }

    const histograms = configs.map(config => {
      const bins = buildBins(config.bins);
      return {
        ...config,
        bins
      };
    });

    const yMax = d3.max(histograms, h =>
      d3.max(h.bins, bin => safeNumber(bin.length / n, 0))
    ) || 1;

    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.15])
      .range([height, 0]);

    const gap = 24;
    const panelWidth = (width - gap * (configs.length - 1)) / configs.length;
    const panelXScale = d3.scaleLinear()
      .domain([domainMin, domainMax])
      .range([0, panelWidth]);

    histograms.forEach((hist, index) => {
      const panel = baseGroup.append('g')
        .attr('transform', `translate(${index * (panelWidth + gap)},0)`);

      panel.append('rect')
        .attr('x', -12)
        .attr('y', -20)
        .attr('width', panelWidth + 24)
        .attr('height', height + 36)
        .attr('fill', PANEL_BG)
        .attr('stroke', '#202d56')
        .attr('stroke-width', 1.2)
        .attr('rx', 12);

      panel.append('text')
        .attr('x', panelWidth / 2)
        .attr('y', -2)
        .attr('text-anchor', 'middle')
        .classed('d3-axis-label', true)
        .classed('d3-axis-label--small', true)
        .attr('fill', COLORS[hist.key] || '#9efcff')
        .attr('font-size', 15)
        .attr('font-weight', 800)
        .text(hist.label);

      // panel.append('text')
      //   .attr('x', panelWidth / 2)
      //   .attr('y', 16)
      //   .attr('text-anchor', 'middle')
      //   .attr('fill', '#94a3d1')
      //   .attr('font-size', 11)
      //   .attr('font-weight', 600)
      //   .text(`${hist.sub} • ${hist.bins} bins`);

      panel.selectAll('rect.bin')
        .data(hist.bins)
        .join('rect')
        .attr('class', 'bin')
        .attr('x', d => panelXScale(safeNumber(d.x0, domainMin)))
        .attr('y', d => yScale(safeNumber(d.length / n, 0)))
        .attr('width', d => {
          const start = panelXScale(safeNumber(d.x0, domainMin));
          const end = panelXScale(safeNumber(d.x1, domainMax));
          return Math.max(end - start - 1, 0);
        })
        .attr('height', d => Math.max(height - yScale(safeNumber(d.length / n, 0)), 0))
        .attr('fill', (COLORS[hist.key] || '#9efcff'))
        .attr('fill-opacity', hist.key === 'optimal' ? 0.55 : 0.35)
        .attr('stroke', COLORS[hist.key] || '#9efcff')
        .attr('stroke-width', 1);

      const axisGroup = panel.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(panelXScale).ticks(4))
        .classed('d3-axis', true);

      if (index === 0) {
        const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat(d3.format('.0%'));
        panel.append('g')
          .call(yAxis)
          .classed('d3-axis', true);
      } else {
        panel.append('g')
          .call(d3.axisRight(yScale).ticks(4).tickFormat(() => '').tickSize(0))
          .call(g => g.selectAll('path,line').remove());
      }

      panel.append('text')
        .attr('x', panelWidth / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Bin midpoint →')
        .classed('d3-axis-label', true)
        .classed('d3-axis-label--small', true);
    });
  };
})();
