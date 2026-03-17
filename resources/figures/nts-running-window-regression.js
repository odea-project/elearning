(function () {
  const slideId = 'running-window-regression-slide';
  const plotId = 'nts-running-window-regression-plot';

  function buildChromatogram() {
    return d3.range(50).map((x) => {
      const baseline = 0.2 + 0.015 * Math.sin(x / 5.2) + 0.012 * Math.cos(x / 8.4);
      const peak = 1.35 * Math.exp(-0.5 * Math.pow((x - 25) / 1.55, 2));
      const shoulder = 0.08 * Math.exp(-0.5 * Math.pow((x - 30) / 3.8, 2));
      const noise = 0.012 * Math.sin(x * 1.73) + 0.007 * Math.cos(x * 0.93 + 0.4);
      return {
        x,
        y: Math.max(0.04, baseline + peak + shoulder + noise),
      };
    });
  }

  function solveLinearSystem(matrix, vector) {
    const n = vector.length;
    const augmented = matrix.map((row, index) => row.concat(vector[index]));

    for (let pivot = 0; pivot < n; pivot += 1) {
      let maxRow = pivot;
      for (let row = pivot + 1; row < n; row += 1) {
        if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[maxRow][pivot])) {
          maxRow = row;
        }
      }

      if (Math.abs(augmented[maxRow][pivot]) < 1e-10) {
        return new Array(n).fill(0);
      }

      if (maxRow !== pivot) {
        const tmp = augmented[pivot];
        augmented[pivot] = augmented[maxRow];
        augmented[maxRow] = tmp;
      }

      const pivotValue = augmented[pivot][pivot];
      for (let column = pivot; column <= n; column += 1) {
        augmented[pivot][column] /= pivotValue;
      }

      for (let row = 0; row < n; row += 1) {
        if (row === pivot) continue;
        const factor = augmented[row][pivot];
        for (let column = pivot; column <= n; column += 1) {
          augmented[row][column] -= factor * augmented[pivot][column];
        }
      }
    }

    return augmented.map((row) => row[n]);
  }

  function piecewiseBasis(localX) {
    const squared = localX * localX;
    return [1, localX, localX < 0 ? squared : 0, localX >= 0 ? squared : 0];
  }

  function fitPiecewiseLogModel(points, centerIndex) {
    const matrix = Array.from({ length: 4 }, () => new Array(4).fill(0));
    const vector = new Array(4).fill(0);

    points.forEach((point) => {
      const localX = point.x - centerIndex;
      const row = piecewiseBasis(localX);
      const logY = Math.log(Math.max(point.y, 1e-8));
      for (let i = 0; i < 4; i += 1) {
        vector[i] += row[i] * logY;
        for (let j = 0; j < 4; j += 1) {
          matrix[i][j] += row[i] * row[j];
        }
      }
    });

    const [beta0, beta1, beta2, beta3] = solveLinearSystem(matrix, vector);
    return { beta0, beta1, beta2, beta3 };
  }

  function evaluatePiecewiseLogFit(localX, fit) {
    const quadratic = localX < 0 ? fit.beta2 * localX * localX : fit.beta3 * localX * localX;
    return fit.beta0 + fit.beta1 * localX + quadratic;
  }

  function buildFitSegment(start, end, centerIndex, fit) {
    return d3.range(start, end + 0.001, 0.08).map((globalX) => {
      const localX = globalX - centerIndex;
      const logFit = evaluatePiecewiseLogFit(localX, fit);
      return {
        x: globalX,
        y: Math.exp(logFit),
      };
    });
  }

  function draw() {
    const container = document.getElementById(plotId);
    if (!container || container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    const width = 1600;
    const height = 800;
    const margin = { top: 80, right: 72, bottom: 90, left: 100 };
    const fig = plotUtils.createFigure(plotId, width, height, margin);
    const data = buildChromatogram();
    const yMax = d3.max(data, (point) => point.y) * 1.2;

    plotUtils.addAxes(fig, [0, 49], [0, yMax], 10, 7);

    d3.select(`#${plotId} svg`)
      .style('background', 'linear-gradient(180deg, rgba(4, 17, 26, 0.48), rgba(4, 17, 26, 0.16))')
      .style('border-radius', '18px')
      .style('border', '2px solid rgba(0, 255, 255, 0.16)')
      .style('box-shadow', '0 0 30px rgba(0, 255, 255, 0.08)');

    const xScale = fig.xScale;
    const yScale = fig.yScale;

    const xLabel = fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 62)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '13px')
      .text('sample index');

    const yLabel = fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -70)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '13px')
      .text('signal intensity');

    const windowBand = fig.svg.append('rect')
      .attr('y', 0)
      .attr('height', fig.height)
      .attr('fill', 'rgba(255, 209, 102, 0.12)')
      .attr('stroke', 'rgba(255, 209, 102, 0.6)')
      .attr('stroke-width', 2)
      .attr('rx', 12);

    const historyGroup = fig.svg.append('g');

    const chromatogramGlow = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 255, 213, 0.18)')
      .attr('stroke-width', 12)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const chromatogramPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#d9f7ff')
      .attr('stroke-width', 3.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const pointLayer = fig.svg.append('g');
    pointLayer.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (point) => xScale(point.x))
      .attr('cy', (point) => yScale(point.y))
      .attr('r', 4.2)
      .attr('fill', '#08161c')
      .attr('stroke', 'rgba(217, 247, 255, 0.92)')
      .attr('stroke-width', 1.5);

    const activePointLayer = fig.svg.append('g');

    const currentFitGlow = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 209, 102, 0.20)')
      .attr('stroke-width', 14)
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0.9);

    const currentFitPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ffd166')
      .attr('stroke-width', 5.2)
      .attr('stroke-linecap', 'round');

    const lineGenerator = d3.line()
      .x((point) => xScale(point.x))
      .y((point) => yScale(point.y))
      .curve(d3.curveMonotoneX);

    chromatogramGlow.attr('d', lineGenerator(data));
    chromatogramPath.attr('d', lineGenerator(data));

    const history = [];
    const aValues = [2, 3, 4, 5];
    let aIndex = 0;
    let centerIndex = aValues[aIndex];
    let lastStepTime = 0;
    const stepMs = 50;

    function renderHistory() {
      const historySelection = historyGroup.selectAll('path').data(history, (entry) => entry.id);

      historySelection.enter()
        .append('path')
        .merge(historySelection)
        .attr('fill', 'none')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', (entry, index) => 1.6 + (index / Math.max(1, history.length)) * 1.8)
        .attr('stroke', (entry, index) => {
          const age = (index + 1) / Math.max(1, history.length);
          return d3.interpolateRgb('rgba(255, 95, 210, 0.28)', 'rgba(0, 255, 213, 0.74)')(age);
        })
        .attr('opacity', (entry, index) => 0.16 + (index / Math.max(1, history.length)) * 0.48)
        .attr('d', (entry) => lineGenerator(entry.segment));

      historySelection.exit().remove();
    }

    function advanceWindow() {
      const a = aValues[aIndex];
      const start = centerIndex - a;
      const end = centerIndex + a;
      const windowPoints = data.slice(start, end + 1);
      const fit = fitPiecewiseLogModel(windowPoints, centerIndex);
      const segment = buildFitSegment(start, end, centerIndex, fit);

      history.push({
        id: `fit-${Date.now()}-${centerIndex}-${a}`,
        segment,
      });
      if (history.length > 20) history.shift();

      const leftEdge = xScale(start - 0.5);
      const rightEdge = xScale(end + 0.5);
      windowBand
        .attr('x', leftEdge)
        .attr('width', rightEdge - leftEdge);

      currentFitGlow.attr('d', lineGenerator(segment));
      currentFitPath.attr('d', lineGenerator(segment));

      const activeSelection = activePointLayer.selectAll('circle').data(windowPoints, (point) => point.x);
      activeSelection.enter()
        .append('circle')
        .merge(activeSelection)
        .attr('cx', (point) => xScale(point.x))
        .attr('cy', (point) => yScale(point.y))
        .attr('r', 7)
        .attr('fill', '#ffd166')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.6);
      activeSelection.exit().remove();

      renderHistory();

      centerIndex += 1;
      if (centerIndex > data.length - a - 1) {
        aIndex = (aIndex + 1) % aValues.length;
        centerIndex = aValues[aIndex];
      }
    }

    advanceWindow();

    d3.timer(function (elapsed) {
      if (elapsed - lastStepTime < stepMs) return;
      lastStepTime = elapsed;
      advanceWindow();
    });
  }

  function register() {
    if (typeof window.d3 === 'undefined' || typeof window.plotUtils === 'undefined' || typeof window.Reveal === 'undefined') {
      setTimeout(register, 80);
      return;
    }

    plotUtils.renderOnSlideOnce({ slideId, containerId: plotId, draw });
  }

  register();
})();