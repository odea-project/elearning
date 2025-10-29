(function () {
  // ---------- Utilities ----------
  function createSeededRandom(seed) {
    let value = seed >>> 0; // ensure uint32
    return () => {
      // Park-Miller LCG, Modulus 2^31-1
      value = (value * 48271) % 0x7fffffff;
      if (value === 0) value = 1; // 0 vermeiden
      return value / 0x7fffffff;
    };
  }

  // Normale Zufallszahl via Box-Muller, robust auf (0,1)
  function sampleNormal(rng) {
    // u1 in (0,1], u2 in (0,1)
    const u1 = 1 - Math.min(rng(), 1 - Number.EPSILON);
    const u2 = 1 - Math.min(rng(), 1 - Number.EPSILON);
    const r = Math.sqrt(-2 * Math.log(u1));
    const z = r * Math.cos(2 * Math.PI * u2);
    return z;
  }

  function sampleLogNormal(n, meanLog, sdLog, rng) {
    const samples = new Array(n);
    for (let i = 0; i < n; i += 1) {
      const normalValue = sampleNormal(rng);
      samples[i] = Math.exp(meanLog + sdLog * normalValue);
    }
    return samples;
  }

  const isFiniteNumber = (v) => Number.isFinite(v);

  function formatLegendMarker(svg, color, label, x, y, symbol = 'rect') {
    const group = svg.append('g').attr('transform', `translate(${x},${y})`);

    if (symbol === 'line') {
      group.append('line')
        .attr('x1', 0)
        .attr('x2', 28)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', color)
        .attr('stroke-width', 4);
    } else if (symbol === 'circle') {
      group.append('circle')
        .attr('cx', 12)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('fill', color)
        .attr('stroke', color)
        .attr('stroke-width', 1.6)
        .attr('opacity', 0.22);
    } else {
      group.append('rect')
        .attr('x', 0)
        .attr('y', -8)
        .attr('width', 26)
        .attr('height', 16)
        .attr('fill', color)
        .attr('stroke', color)
        .attr('stroke-width', 1.6)
        .attr('opacity', 0.36);
    }

    group.append('text')
      .attr('x', 34)
      .attr('y', 5)
      .classed('d3-legend-text', true)
      .text(label);
  }

  // ---------- Main ----------
  window.initDistributionHistogram = function initDistributionHistogram(targetId = 'distribution-histogram-container') {
    if (!window.d3) {
      console.warn('D3 not loaded. Histogram will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;

    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight, 720);
    const margin = { top: 40, right: 32, bottom: 60, left: 68 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // ---- Daten erzeugen (robust) ----
    const rng = createSeededRandom(421);

    const rawLogNormal = sampleLogNormal(260, Math.log(10), 0.5, rng);
    const rawNormal = Array.from({ length: 220 }, () => {
      const z = sampleNormal(rng);
      // Beispiel: N(40, 8^2), abgeschnitten bei 0
      const v = z * 8 + 40;
      return v > 0 ? v : 0;
    });

    // Auf endliche Zahlen filtern
    const nitrateLogNormal = rawLogNormal.filter(isFiniteNumber);
    const nitrateNormal = rawNormal.filter(isFiniteNumber);

    const datasets = [
      { key: 'lognormal', values: nitrateLogNormal, color: '#06d6a0', label: 'NO3- (log-normal like)' },
      { key: 'normal', values: nitrateNormal, color: '#ff6b35', label: 'Temperature (normal like)' }
    ];

    const allValues = datasets.flatMap(d => d.values).filter(isFiniteNumber);

    // Robuste Domain
    const maxAll = d3.max(allValues);
    const xMax = Number.isFinite(maxAll) && maxAll > 0 ? maxAll * 1.05 : 1;

    const binGenerator = d3.bin()
      .domain([0, xMax])
      .thresholds(18)
      .value(d => d);

    const binsByDataset = datasets.map(dataset => ({
      key: dataset.key,
      label: dataset.label,
      color: dataset.color,
      bins: binGenerator(dataset.values.filter(isFiniteNumber))
    }));

    // Dichten robust berechnen
    const densityByDataset = binsByDataset.map(set => {
      const total = set.bins.reduce((sum, bin) => sum + bin.length, 0) || 1;
      return set.bins.map(bin => {
        const x0 = Number.isFinite(bin.x0) ? bin.x0 : 0;
        const x1 = Number.isFinite(bin.x1) ? bin.x1 : x0;
        const widthBin = Math.max(x1 - x0, 1e-6);
        const v = (bin.length / total) / widthBin;
        return Number.isFinite(v) ? v : 0;
      });
    });

    const maxDensity = d3.max(densityByDataset.flat()) || 1;

    const xScale = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, maxDensity * 1.1])
      .nice()
      .range([height, 0]);

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient fuer erstes Histogramm
    const gradientId = `${targetId}-fill-gradient`;
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#06d6a0')
      .attr('stop-opacity', 0.9);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#118ab2')
      .attr('stop-opacity', 0.85);

    // Balken zeichnen
    binsByDataset.forEach((set, datasetIndex) => {
      svg.append('g')
        .selectAll('rect')
        .data(set.bins)
        .join('rect')
        .attr('x', d => {
          const x0 = Number.isFinite(d.x0) ? d.x0 : 0;
          return xScale(x0);
        })
        .attr('width', d => {
          const x0 = Number.isFinite(d.x0) ? d.x0 : 0;
          const x1 = Number.isFinite(d.x1) ? d.x1 : x0;
          return Math.max(xScale(x1) - xScale(x0) - 2, 0);
        })
        .attr('y', (d, i) => {
          const yv = densityByDataset[datasetIndex][i] ?? 0;
          return yScale(Number.isFinite(yv) ? yv : 0);
        })
        .attr('height', (d, i) => {
          const yv = densityByDataset[datasetIndex][i] ?? 0;
          const yVal = Number.isFinite(yv) ? yv : 0;
          return Math.max(height - yScale(yVal), 0);
        })
        .attr('fill', () => {
          if (datasetIndex === 0) return `url(#${gradientId})`;
          const base = d3.color(set.color);
          if (base) {
            const copy = base.copy();
            copy.opacity = 0.15;
            return copy.formatRgb();
          }
          return set.color;
        })
        .attr('stroke', set.color)
        .attr('stroke-width', 1)
        .attr('rx', 1.5)
        .attr('ry', 1.5);
    });

    // Linien ueber den Bins
    binsByDataset.forEach((set, datasetIndex) => {
      const density = densityByDataset[datasetIndex];
      const line = d3.line()
        .x((d, i) => {
          const x0 = Number.isFinite(set.bins[i].x0) ? set.bins[i].x0 : 0;
          const x1 = Number.isFinite(set.bins[i].x1) ? set.bins[i].x1 : x0;
          const mid = (x0 + x1) / 2;
          return xScale(Number.isFinite(mid) ? mid : 0);
        })
        .y((_, i) => yScale(Number.isFinite(density[i]) ? density[i] : 0))
        .curve(d3.curveCatmullRom.alpha(0.6));

      svg.append('path')
        .datum(set.bins)
        .attr('fill', 'none')
        .attr('stroke', set.color)
        .attr('stroke-width', datasetIndex === 0 ? 3.2 : 2.6)
        .attr('stroke-dasharray', datasetIndex === 0 ? '4,0' : '6,4')
        .attr('d', line);
    });

    // Mittelwerte (nur wenn endlich)
    datasets.forEach(dataset => {
      const mean = d3.mean(dataset.values.filter(isFiniteNumber));
      if (!Number.isFinite(mean)) return;
      svg.append('line')
        .attr('x1', xScale(mean))
        .attr('x2', xScale(mean))
        .attr('y1', yScale.range()[0])
        .attr('y2', yScale.range()[1])
        .attr('stroke', dataset.key === 'lognormal' ? '#06d6a0' : '#ff6b35')
        .attr('stroke-width', 2.4)
        .attr('stroke-dasharray', dataset.key === 'lognormal' ? '4,4' : '2,3');
    });

    datasets.forEach((dataset, index) => {
      const meanValue = d3.mean(dataset.values.filter(isFiniteNumber));
      if (!Number.isFinite(meanValue)) return;
      svg.append('text')
        .attr('x', xScale(meanValue) + 6)
        .attr('y', 24 + index * 14)
        .classed('d3-chart-body-text', true)
        .attr('fill', dataset.key === 'lognormal' ? '#06d6a0' : '#ff6b35')
        .text(`${dataset.key === 'lognormal' ? 'NO3-' : 'Temp'} mean ${meanValue.toFixed(2)}`);
    });

    // Achsen
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .classed('d3-axis', true);

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .classed('d3-axis', true);

    // Labels & Titel
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 42)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Measurement value');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -48)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Probability density');

    // Legende
    formatLegendMarker(svg, '#06d6a0', 'NO3- histogram', width - 210, 16, 'rect');
    formatLegendMarker(svg, '#ff6b35', 'Temperature histogram', width - 210, 38, 'circle');
    formatLegendMarker(svg, '#06d6a0', 'NO3- mean', width - 210, 60, 'line');
    formatLegendMarker(svg, '#ff6b35', 'Temperature mean', width - 210, 78, 'line');
  };
})();






