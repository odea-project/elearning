(function () {
  const slideId = 'running-window-fit-grid-slide';
  const plotId = 'nts-running-window-fit-grid-plot';
  const nonPeakToggleId = 'running-window-fit-grid-toggle-non-peak';
  const edgeToggleId = 'running-window-fit-grid-toggle-edge-apex';
  const areaToggleId = 'running-window-fit-grid-toggle-insignificant-area';
  const nestedFTestToggleId = 'running-window-fit-grid-toggle-nested-f-test';
  const apexHighestToggleId = 'running-window-fit-grid-toggle-apex-highest';
  const heatmapToggleId = 'running-window-fit-grid-toggle-mse-heatmap';

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
        const temp = augmented[pivot];
        augmented[pivot] = augmented[maxRow];
        augmented[maxRow] = temp;
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

  function invertMatrix(matrix) {
    const size = matrix.length;
    return matrix.map((_, columnIndex) => {
      const unitVector = new Array(size).fill(0);
      unitVector[columnIndex] = 1;
      return solveLinearSystem(matrix, unitVector);
    }).reduce((inverse, column, columnIndex) => {
      column.forEach((value, rowIndex) => {
        inverse[rowIndex][columnIndex] = value;
      });
      return inverse;
    }, Array.from({ length: size }, () => new Array(size).fill(0)));
  }

  function multiplyMatrixVector(matrix, vector) {
    return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
  }

  function dotProduct(left, right) {
    return left.reduce((sum, value, index) => sum + value * right[index], 0);
  }

  function trapezoidArea(segment) {
    let area = 0;
    for (let index = 1; index < segment.length; index += 1) {
      const dx = segment[index].x - segment[index - 1].x;
      area += dx * (segment[index].y + segment[index - 1].y) / 2;
    }
    return area;
  }

  function peakAreaUncertainty(entry) {
    const { fit, covariance, area } = entry;
    const deltaX = 1;
    const epsilon = 1e-10;

    if (!covariance || Math.abs(fit.beta2) < epsilon || Math.abs(fit.beta3) < epsilon) {
      return Number.POSITIVE_INFINITY;
    }

    const jacobi = [area / deltaX, 0, 0, 0];
    jacobi[1] = (Math.exp(fit.beta0) / 2 - jacobi[0] * fit.beta1 / 2) * (1 / fit.beta2 + 1 / fit.beta3);
    jacobi[2] = -(jacobi[0] + jacobi[1] * fit.beta1) / (2 * fit.beta2);
    jacobi[3] = -(jacobi[0] + jacobi[1] * fit.beta1) / (2 * fit.beta3);

    const covarianceTimesJacobi = multiplyMatrixVector(covariance, jacobi);
    const areaVariance = dotProduct(jacobi, covarianceTimesJacobi);
    if (!Number.isFinite(areaVariance) || areaVariance <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.sqrt(areaVariance);
  }

  function fitPiecewiseLogModel(points, centerIndex) {
    const matrix = Array.from({ length: 4 }, () => new Array(4).fill(0));
    const vector = new Array(4).fill(0);

    points.forEach((point) => {
      const localX = point.x - centerIndex;
      const basis = piecewiseBasis(localX);
      const logY = Math.log(Math.max(point.y, 1e-8));
      for (let i = 0; i < 4; i += 1) {
        vector[i] += basis[i] * logY;
        for (let j = 0; j < 4; j += 1) {
          matrix[i][j] += basis[i] * basis[j];
        }
      }
    });

    const [beta0, beta1, beta2, beta3] = solveLinearSystem(matrix, vector);
    const residuals = points.map((point) => {
      const localX = point.x - centerIndex;
      const fitted = beta0 + beta1 * localX + (localX < 0 ? beta2 * localX * localX : beta3 * localX * localX);
      return Math.log(Math.max(point.y, 1e-8)) - fitted;
    });
    const rss = d3.sum(residuals, (value) => value * value);
    const dof = Math.max(1, points.length - 4);
    const sigmaSquared = rss / dof;
    const xtxInverse = invertMatrix(matrix);
    const covariance = xtxInverse.map((row) => row.map((value) => value * sigmaSquared));

    return { beta0, beta1, beta2, beta3, covariance };
  }

  function fitLinearLogModel(points, centerIndex) {
    let sum1 = 0;
    let sumX = 0;
    let sumXX = 0;
    let sumY = 0;
    let sumXY = 0;

    points.forEach((point) => {
      const localX = point.x - centerIndex;
      const logY = Math.log(Math.max(point.y, 1e-8));
      sum1 += 1;
      sumX += localX;
      sumXX += localX * localX;
      sumY += logY;
      sumXY += localX * logY;
    });

    const denominator = sum1 * sumXX - sumX * sumX;
    const beta1 = Math.abs(denominator) < 1e-10 ? 0 : (sum1 * sumXY - sumX * sumY) / denominator;
    const beta0 = (sumY - beta1 * sumX) / Math.max(1, sum1);
    return { beta0, beta1 };
  }

  function evaluatePiecewiseLogFit(localX, fit) {
    const quadratic = localX < 0 ? fit.beta2 * localX * localX : fit.beta3 * localX * localX;
    return fit.beta0 + fit.beta1 * localX + quadratic;
  }

  function isNonPeakFit(fit) {
    if (fit.beta2 > 0 && fit.beta3 > 0) return true;
    if (fit.beta1 < 0 && fit.beta2 > 0) return true;
    if (fit.beta1 > 0 && fit.beta3 > 0) return true;
    return false;
  }

  function isEdgeApexFit(fit, a) {
    const epsilon = 1e-10;
    let apex = 0;

    if (fit.beta1 < 0) {
      if (Math.abs(fit.beta2) < epsilon) return true;
      apex = -fit.beta1 / (2 * fit.beta2);
    } else if (fit.beta1 > 0) {
      if (Math.abs(fit.beta3) < epsilon) return true;
      apex = -fit.beta1 / (2 * fit.beta3);
    }

    if (!Number.isFinite(apex)) return true;
    return a - Math.abs(apex) < 1;
  }

  function isApexHighestFit(entry) {
    const { fit, a, segment } = entry;
    const epsilon = 1e-10;
    let apexLocalX = 0;

    if (fit.beta1 < 0) {
      if (Math.abs(fit.beta2) < epsilon) return false;
      apexLocalX = -fit.beta1 / (2 * fit.beta2);
    } else if (fit.beta1 > 0) {
      if (Math.abs(fit.beta3) < epsilon) return false;
      apexLocalX = -fit.beta1 / (2 * fit.beta3);
    }

    if (!Number.isFinite(apexLocalX) || Math.abs(apexLocalX) > a) {
      return false;
    }

    const apexY = Math.exp(evaluatePiecewiseLogFit(apexLocalX, fit));
    const maxSegmentY = d3.max(segment, (point) => point.y) || 0;
    const tolerance = Math.max(1e-8, maxSegmentY * 1e-4);
    return apexY >= maxSegmentY - tolerance;
  }

  function isApexNotHighestFit(entry) {
    return !isApexHighestFit(entry);
  }

  function isInsignificantAreaFit(entry) {
    const sigmaArea = entry.areaUncertainty;
    if (!Number.isFinite(sigmaArea) || sigmaArea <= 0) return true;
    return entry.area / sigmaArea < 3;
  }

  function nestedFCritical95(df2) {
    const lookup = {
      1: 199.5,
      2: 19.0,
      3: 9.55,
      4: 6.94,
      5: 5.79,
      6: 5.14,
      7: 4.74,
    };
    return lookup[df2] || 4.46;
  }

  function nestedFStatistic(mseReduced, mseFull, df1, df2) {
    const numerator = (mseReduced - mseFull) / df1;
    const denominator = mseFull / df2;
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
      return Number.POSITIVE_INFINITY;
    }
    return numerator / denominator;
  }

  function computeBestGridLayout(count, width, height, outerPadding, tileGap) {
    if (count <= 0) {
      return { columns: 1, rows: 1, tileWidth: width - outerPadding * 2, tileHeight: height - outerPadding * 2 };
    }

    let bestLayout = null;
    for (let columns = 1; columns <= count; columns += 1) {
      const rows = Math.ceil(count / columns);
      const tileWidth = (width - outerPadding * 2 - tileGap * (columns - 1)) / columns;
      const tileHeight = (height - outerPadding * 2 - tileGap * (rows - 1)) / rows;
      if (tileWidth <= 0 || tileHeight <= 0) continue;
      const score = tileWidth * tileHeight;

      if (!bestLayout || score > bestLayout.score) {
        bestLayout = { columns, rows, tileWidth, tileHeight, score };
      }
    }

    return bestLayout || { columns: 1, rows: count, tileWidth: width - outerPadding * 2, tileHeight: (height - outerPadding * 2) / Math.max(1, count) };
  }

  function commonComparisonRange(entries, dataLength) {
    if (!entries.length) {
      return { start: 0, end: 0 };
    }

    const start = Math.max(0, d3.min(entries, (entry) => entry.start));
    const end = Math.min(dataLength - 1, d3.max(entries, (entry) => entry.end));
    return { start, end };
  }

  function extrapolatedExpMSE(entry, data, comparisonRange) {
    const squaredErrors = [];

    for (let globalX = comparisonRange.start; globalX <= comparisonRange.end; globalX += 1) {
      const observed = data[globalX];
      if (!observed) continue;
      const predicted = Math.exp(evaluatePiecewiseLogFit(globalX - entry.centerIndex, entry.fit));
      const residual = observed.y - predicted;
      squaredErrors.push(residual * residual);
    }

    return squaredErrors.length ? d3.mean(squaredErrors) : 0;
  }

  function isNestedFTestInsignificant(entry) {
    const criticalValue = nestedFCritical95(entry.nestedFdf2);
    if (!Number.isFinite(entry.nestedFStatisticExp) || !Number.isFinite(entry.nestedFStatisticLog)) return true;
    return entry.nestedFStatisticExp <= criticalValue || entry.nestedFStatisticLog <= criticalValue;
  }

  function collectFits(data, tileCount) {
    const aValues = [2, 3, 4, 5];
    const fits = [];

    while (fits.length < tileCount) {
      for (const a of aValues) {
        for (let centerIndex = a; centerIndex <= data.length - a - 1; centerIndex += 1) {
          const start = centerIndex - a;
          const end = centerIndex + a;
          const windowPoints = data.slice(start, end + 1);
          const fit = fitPiecewiseLogModel(windowPoints, centerIndex);
          const linearFit = fitLinearLogModel(windowPoints, centerIndex);
          const segment = d3.range(start, end + 0.001, 0.08).map((globalX) => ({
            x: globalX,
            y: Math.exp(evaluatePiecewiseLogFit(globalX - centerIndex, fit)),
          }));

          const domainErrors = windowPoints.map((point) => {
            const localX = point.x - centerIndex;
            const observedLog = Math.log(Math.max(point.y, 1e-8));
            const fullLogPrediction = evaluatePiecewiseLogFit(localX, fit);
            const reducedLogPrediction = linearFit.beta0 + linearFit.beta1 * localX;
            const fullPrediction = Math.exp(evaluatePiecewiseLogFit(localX, fit));
            const reducedPrediction = Math.exp(reducedLogPrediction);
            const fullResidual = point.y - fullPrediction;
            const reducedResidual = point.y - reducedPrediction;
            return {
              fullExp: fullResidual * fullResidual,
              reducedExp: reducedResidual * reducedResidual,
              fullLog: (observedLog - fullLogPrediction) * (observedLog - fullLogPrediction),
              reducedLog: (observedLog - reducedLogPrediction) * (observedLog - reducedLogPrediction),
            };
          });

          const n = windowPoints.length;
          const pReduced = 2;
          const pFull = 4;
          const df1 = pFull - pReduced;
          const df2 = Math.max(1, n - pFull);
          const mseFullExp = d3.mean(domainErrors, (entry) => entry.fullExp) || 0;
          const mseReducedExp = d3.mean(domainErrors, (entry) => entry.reducedExp) || 0;
          const mseFullLog = d3.mean(domainErrors, (entry) => entry.fullLog) || 0;
          const mseReducedLog = d3.mean(domainErrors, (entry) => entry.reducedLog) || 0;
          const nestedFStatisticExp = nestedFStatistic(mseReducedExp, mseFullExp, df1, df2);
          const nestedFStatisticLog = nestedFStatistic(mseReducedLog, mseFullLog, df1, df2);

          const area = trapezoidArea(segment);
          const entry = {
            a,
            start,
            end,
            centerIndex,
            fit,
            linearFit,
            windowPoints,
            segment,
            covariance: fit.covariance,
            area,
            areaUncertainty: Number.POSITIVE_INFINITY,
            nestedFStatisticExp,
            nestedFStatisticLog,
            nestedFdf2: df2,
          };
          entry.areaUncertainty = peakAreaUncertainty(entry);

          fits.push(entry);
          if (fits.length >= tileCount) return fits;
        }
      }
    }

    return fits;
  }

  function draw() {
    const container = document.getElementById(plotId);
    const nonPeakToggle = document.getElementById(nonPeakToggleId);
    const edgeToggle = document.getElementById(edgeToggleId);
    const areaToggle = document.getElementById(areaToggleId);
    const nestedFTestToggle = document.getElementById(nestedFTestToggleId);
    const apexHighestToggle = document.getElementById(apexHighestToggleId);
    const heatmapToggle = document.getElementById(heatmapToggleId);
    if (!container || !nonPeakToggle || !edgeToggle || !areaToggle || !nestedFTestToggle || !apexHighestToggle || !heatmapToggle || container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    const width = 1600;
    const height = 800;
    const columns = 20;
    const rows = 10;
    const outerPadding = 12;
    const tileGap = 8;
    const tileWidth = (width - outerPadding * 2 - tileGap * (columns - 1)) / columns;
    const tileHeight = (height - outerPadding * 2 - tileGap * (rows - 1)) / rows;
    const innerPaddingX = 6;
    const innerPaddingY = 7;
    const tileCount = columns * rows;

    const data = buildChromatogram();
    const fits = collectFits(data, tileCount);
    const globalYMax = d3.max(fits, (entry) => d3.max(entry.segment, (point) => point.y));

    const svg = d3.select(`#${plotId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', 'linear-gradient(180deg, rgba(4, 17, 26, 0.48), rgba(4, 17, 26, 0.16))')
      .style('border-radius', '18px')
      .style('border', '2px solid rgba(0, 255, 255, 0.16)')
      .style('box-shadow', '0 0 30px rgba(0, 255, 255, 0.08)');

    const tiles = svg.append('g')
      .selectAll('g')
      .data(fits)
      .enter()
      .append('g')
      .attr('transform', 'translate(-9999,-9999)');

    tiles.append('rect')
      .attr('class', 'tile-bg')
      .attr('width', tileWidth)
      .attr('height', tileHeight)
      .attr('rx', 7)
      .attr('fill', 'rgba(255,255,255,0.03)')
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1);

    tiles.append('path')
      .attr('class', 'tile-fit')
      .attr('fill', 'none')
      .attr('stroke', '#00ffd5')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    tiles.append('g').attr('class', 'tile-points');

    tiles.append('text')
      .attr('class', 'tile-heatmap-label')
      .attr('text-anchor', 'middle')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .style('fill', '#08161c')
      .style('opacity', 0);

    function renderTile(tile, entry, currentTileWidth, currentTileHeight, heatmapMode, mseScale) {
      const currentInnerPaddingX = Math.max(4, currentTileWidth * 0.06);
      const currentInnerPaddingY = Math.max(5, currentTileHeight * 0.08);
      const xMin = entry.segment[0].x;
      const xMax = entry.segment[entry.segment.length - 1].x;
      const xScale = d3.scaleLinear().domain([xMin, xMax]).range([currentInnerPaddingX, currentTileWidth - currentInnerPaddingX]);
      const yScale = d3.scaleLinear().domain([0, globalYMax]).range([currentTileHeight - currentInnerPaddingY, currentInnerPaddingY]);
      const line = d3.line()
        .x((point) => xScale(point.x))
        .y((point) => yScale(point.y))
        .curve(d3.curveMonotoneX);

      tile.select('.tile-bg')
        .attr('width', currentTileWidth)
        .attr('height', currentTileHeight)
        .attr('fill', 'rgba(255,255,255,0.03)')
        .attr('stroke', heatmapMode ? mseScale(entry.extrapolatedMSE) : 'rgba(255,255,255,0.08)')
        .attr('stroke-width', heatmapMode ? Math.max(3, Math.min(8, currentTileWidth * 0.08)) : 1);

      tile.select('.tile-fit')
        .attr('d', line(entry.segment))
        .attr('stroke', heatmapMode ? 'rgba(239,239,239,0.9)' : '#00ffd5')
        .style('opacity', heatmapMode ? 0.72 : 1)
        .attr('stroke-width', Math.max(1.2, Math.min(2.4, currentTileWidth * 0.022)));

      const points = tile.select('.tile-points').selectAll('circle').data(entry.windowPoints, (point) => point.x);
      points.enter()
        .append('circle')
        .merge(points)
        .attr('cx', (point) => xScale(point.x))
        .attr('cy', (point) => yScale(point.y))
        .attr('r', Math.max(1.2, Math.min(2.6, currentTileWidth * 0.018)))
        .attr('fill', '#ffd166')
        .attr('opacity', heatmapMode ? 0 : 0.9);
      points.exit().remove();

      tile.select('.tile-heatmap-label')
        .attr('x', currentTileWidth / 2)
        .attr('y', currentTileHeight / 2 + 4)
        .style('opacity', heatmapMode ? 1 : 0)
        .style('font-size', `${Math.max(8, Math.min(12, currentTileWidth * 0.12))}px`)
        .style('fill', heatmapMode ? '#efefef' : '#08161c')
        .text(entry.extrapolatedMSE.toExponential(1));
    }

    function applyFilters() {
      const hideNonPeak = !!nonPeakToggle.checked;
      const hideEdgeApex = !!edgeToggle.checked;
      const hideInsignificantArea = !!areaToggle.checked;
      const hideInsignificantNestedF = !!nestedFTestToggle.checked;
      const hideApexNotHighest = !!apexHighestToggle.checked;
      const heatmapMode = !!heatmapToggle.checked;
      const visibleEntries = fits.filter((entry) => {
        const filteredByNonPeak = hideNonPeak && isNonPeakFit(entry.fit);
        const filteredByEdge = hideEdgeApex && isEdgeApexFit(entry.fit, entry.a);
        const filteredByArea = hideInsignificantArea && isInsignificantAreaFit(entry);
        const filteredByNestedF = hideInsignificantNestedF && isNestedFTestInsignificant(entry);
        const filteredByApexHighest = hideApexNotHighest && isApexNotHighestFit(entry);
        return !(filteredByNonPeak || filteredByEdge || filteredByArea || filteredByNestedF || filteredByApexHighest);
      });

      if (!visibleEntries.length) {
        tiles.style('display', 'none');
        return;
      }

      const comparisonRange = commonComparisonRange(visibleEntries, data.length);
      visibleEntries.forEach((entry) => {
        entry.extrapolatedMSE = extrapolatedExpMSE(entry, data, comparisonRange);
      });

      const mseExtent = d3.extent(visibleEntries, (entry) => entry.extrapolatedMSE);
      const mseScale = d3.scaleSequential()
        .domain(mseExtent[0] === mseExtent[1] ? [mseExtent[0], mseExtent[0] + 1e-8] : mseExtent)
        .interpolator((t) => d3.interpolateRgbBasis(['#00ffd5', '#9cfb8f', '#ffd166', '#ff5fd2'])(t));

      const layout = computeBestGridLayout(visibleEntries.length, width, height, outerPadding, tileGap);
      let visibleIndex = 0;

      tiles.each(function (entry) {
        const tile = d3.select(this);
        if (!visibleEntries.includes(entry)) {
          tile.style('display', 'none');
          return;
        }

        const column = visibleIndex % layout.columns;
        const row = Math.floor(visibleIndex / layout.columns);
        const x = outerPadding + column * (layout.tileWidth + tileGap);
        const y = outerPadding + row * (layout.tileHeight + tileGap);
        visibleIndex += 1;

        tile.style('display', null);
        tile.attr('transform', `translate(${x},${y})`);
        renderTile(tile, entry, layout.tileWidth, layout.tileHeight, heatmapMode, mseScale);
      });
    }

    nonPeakToggle.addEventListener('change', applyFilters);
    edgeToggle.addEventListener('change', applyFilters);
    areaToggle.addEventListener('change', applyFilters);
    nestedFTestToggle.addEventListener('change', applyFilters);
    apexHighestToggle.addEventListener('change', applyFilters);
    heatmapToggle.addEventListener('change', applyFilters);
    applyFilters();
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