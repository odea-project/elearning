(function() {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_EMPIRICAL = '#1864ab';
  const COLOR_FIT = '#f9844a';
  const COLOR_FILL = '#c0ebf9';

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
    const out = new Array(size);
    for (let i = 0; i < size; i += 1) {
      const z = sampleNormal(rng);
      out[i] = Math.exp(meanLog + sdLog * z);
    }
    return out;
  }

  function erf(x) {
    const sign = Math.sign(x);
    const ax = Math.abs(x);
    const p = 0.3275911;
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const t = 1 / (1 + p * ax);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
    return sign * y;
  }

  function logNormalPdf(x, meanLog, sdLog) {
    if (!Number.isFinite(x) || x <= 0) return 0;
    const denom = x * sdLog * Math.sqrt(2 * Math.PI);
    if (denom === 0) return 0;
    const diff = Math.log(x) - meanLog;
    return Math.exp(-0.5 * (diff * diff) / (sdLog * sdLog)) / denom;
  }

  function logNormalCdf(x, meanLog, sdLog) {
    if (!Number.isFinite(x) || x <= 0) return 0;
    const z = (Math.log(x) - meanLog) / (sdLog * Math.SQRT2);
    return 0.5 * (1 + erf(z));
  }

  function finiteNumber(v) {
    return Number.isFinite(v);
  }

  window.initFitDistributionDemo = function initFitDistributionDemo(targetId = 'fit-distribution-plot') {
    if (!window.d3) {
      console.warn('D3 not loaded. Fit distribution slide will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 780;
    const containerHeight = Math.max(node.clientHeight || 0, 360);

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Histogram and CDF comparing empirical data to a fitted log-normal model.');

    const margin = { top: 56, right: 44, bottom: 60, left: 68 };
    const gap = 56;
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;
    const panelWidth = Math.max((innerWidth - gap) / 2, 240);
    const panelHeight = innerHeight;

    const baseGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rng = createSeededRandom(2025);
    const samples = sampleLogNormal(220, Math.log(2), 0.55, rng).filter(finiteNumber);
    const n = samples.length;
    if (!n) return;

    const logValues = samples.filter(v => v > 0).map(v => Math.log(v));
    const fitMeanLog = d3.mean(logValues);
    const fitSdLog = d3.deviation(logValues);
    const sampleMean = d3.mean(samples);

    const upperQuantile = d3.quantile(samples, 0.995);
    const xMax = Number.isFinite(upperQuantile) ? upperQuantile * 1.02 : d3.max(samples);
    const domainMax = Number.isFinite(xMax) && xMax > 0 ? xMax : 10;

    const binGenerator = d3.bin()
      .domain([0, domainMax])
      .thresholds(18);

    const bins = binGenerator(samples);
    const densityData = bins.map(bin => {
      const width = (bin.x1 || 0) - (bin.x0 || 0);
      const safeWidth = Number.isFinite(width) && width > 0 ? width : 1;
      const density = bin.length / (n * safeWidth);
      return {
        x0: bin.x0 || 0,
        x1: bin.x1 || 0,
        density: Number.isFinite(density) ? density : 0,
        mid: ((bin.x0 || 0) + (bin.x1 || 0)) / 2
      };
    });

    const maxDensity = d3.max(densityData, d => d.density) || 1;

    const histXScale = d3.scaleLinear()
      .domain([0, domainMax])
      .range([0, panelWidth]);

    const histYScale = d3.scaleLinear()
      .domain([0, maxDensity * 1.08])
      .range([panelHeight, 0]);

    const pdfSamples = d3.range(0, domainMax * 1.001, domainMax / 240)
      .map(x => ({
        x,
        y: logNormalPdf(x, fitMeanLog, fitSdLog || 1e-6)
      }))
      .filter(point => finiteNumber(point.x) && finiteNumber(point.y));

    const histGroup = baseGroup.append('g');
    const cdfGroup = baseGroup.append('g')
      .attr('transform', `translate(${panelWidth + gap},0)`);

    histGroup.selectAll('rect')
      .data(densityData)
      .join('rect')
      .attr('x', d => histXScale(Math.max(0, d.x0)))
      .attr('y', d => histYScale(d.density))
      .attr('width', d => Math.max(histXScale(d.x1) - histXScale(d.x0), 0))
      .attr('height', d => Math.max(panelHeight - histYScale(d.density), 0))
      .attr('fill', COLOR_FILL)
      .attr('stroke', COLOR_EMPIRICAL)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.82);

    const pdfLine = d3.line()
      .x(d => histXScale(d.x))
      .y(d => histYScale(d.y))
      .curve(d3.curveMonotoneX);

    histGroup.append('path')
      .datum(pdfSamples)
      .attr('fill', 'none')
      .attr('stroke', COLOR_FIT)
      .attr('stroke-width', 3)
      .attr('d', pdfLine);

    if (Number.isFinite(sampleMean)) {
      const meanX = histXScale(sampleMean);
      histGroup.append('line')
        .attr('x1', meanX)
        .attr('x2', meanX)
        .attr('y1', histYScale.range()[0])
        .attr('y2', histYScale.range()[1])
        .attr('stroke', COLOR_EMPIRICAL)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');

      histGroup.append('text')
        .attr('x', meanX + 6)
        .attr('y', 18)
        .attr('fill', COLOR_EMPIRICAL)
        .attr('font-size', 14)
        .attr('font-weight', 700)
        .text(`Sample mean ≈ ${sampleMean.toFixed(2)} mg/L`);
    }

    histGroup.append('g')
      .attr('transform', `translate(0,${panelHeight})`)
      .call(d3.axisBottom(histXScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.6));

    histGroup.append('g')
      .call(d3.axisLeft(histYScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.6));

    histGroup.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight + 44)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 15)
      .attr('font-weight', 800)
      .text('[NO3-] concentration (mg/L)');

    histGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(panelHeight / 2))
      .attr('y', -48)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .text('Probability density');

    const sorted = [...samples].sort((a, b) => a - b);
    const ecdfData = sorted.map((value, index) => ({
      x: value,
      y: (index + 1) / n
    }));

    const cdfXScale = d3.scaleLinear()
      .domain([0, domainMax])
      .range([0, panelWidth]);

    const cdfYScale = d3.scaleLinear()
      .domain([0, 1])
      .range([panelHeight, 0]);

    const fittedCdfData = d3.range(0, domainMax * 1.001, domainMax / 240)
      .map(x => ({
        x,
        y: logNormalCdf(x, fitMeanLog, fitSdLog || 1e-6)
      }))
      .filter(point => finiteNumber(point.x) && finiteNumber(point.y));

    const ecdfLine = d3.line()
      .x(d => cdfXScale(d.x))
      .y(d => cdfYScale(d.y))
      .curve(d3.curveStepAfter);

    cdfGroup.append('path')
      .datum(ecdfData)
      .attr('fill', 'none')
      .attr('stroke', COLOR_EMPIRICAL)
      .attr('stroke-width', 3)
      .attr('d', ecdfLine);

    cdfGroup.selectAll('.ecdf-point')
      .data(ecdfData.filter((_, index) => index % Math.ceil(n / 16) === 0))
      .join('circle')
      .attr('class', 'ecdf-point')
      .attr('cx', d => cdfXScale(d.x))
      .attr('cy', d => cdfYScale(d.y))
      .attr('r', 4)
      .attr('fill', '#ffd60a')
      .attr('stroke', COLOR_EMPIRICAL)
      .attr('stroke-width', 1.4);

    const cdfLine = d3.line()
      .x(d => cdfXScale(d.x))
      .y(d => cdfYScale(d.y))
      .curve(d3.curveMonotoneX);

    cdfGroup.append('path')
      .datum(fittedCdfData)
      .attr('fill', 'none')
      .attr('stroke', COLOR_FIT)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '6,3')
      .attr('d', cdfLine);

    cdfGroup.append('g')
      .attr('transform', `translate(0,${panelHeight})`)
      .call(d3.axisBottom(cdfXScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.6));

    cdfGroup.append('g')
      .call(d3.axisLeft(cdfYScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.6));

    cdfGroup.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight + 44)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 15)
      .attr('font-weight', 800)
      .text('Cumulative probability F(x)');

    cdfGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(panelHeight / 2))
      .attr('y', -48)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .text('Probability');

    // Legend and title intentionally omitted to keep the diagram minimal.
  };
})();
