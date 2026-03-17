(function () {
  const slideId = 'why-curve-fitting-slide';
  const containerId = 'nts-curve-fitting-plot';

  function gaussian(x, amplitude, mean, sigma, baseline) {
    const z = (x - mean) / sigma;
    return baseline + amplitude * Math.exp(-0.5 * z * z);
  }

  function buildObservedPeak() {
    return d3.range(1.2, 8.81, 0.22).map((x) => {
      const signal = gaussian(x, 1.05, 5.2, 0.58, 0.035);
      const noise =
        0.028 * Math.sin(4.8 * x) +
        0.017 * Math.cos(9.1 * x + 0.35) +
        0.009 * Math.sin(13.7 * x + 1.1);

      return {
        x,
        y: Math.max(0, signal + noise),
      };
    });
  }

  function estimateGaussianFit(observed) {
    const edgePoints = observed.slice(0, 4).concat(observed.slice(-4));
    const baseline = d3.mean(edgePoints, (point) => point.y);
    const weights = observed.map((point) => ({
      ...point,
      weight: Math.max(point.y - baseline, 1e-6),
    }));

    const totalWeight = d3.sum(weights, (point) => point.weight);
    const mean = d3.sum(weights, (point) => point.x * point.weight) / totalWeight;
    const variance = d3.sum(
      weights,
      (point) => point.weight * Math.pow(point.x - mean, 2)
    ) / totalWeight;
    const sigma = Math.max(Math.sqrt(variance), 0.18);
    const amplitude = Math.max(d3.max(observed, (point) => point.y) - baseline, 0.05);

    return {
      amplitude,
      mean,
      sigma,
      baseline,
    };
  }

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 800;
    const height = 800;
    const margin = { top: 56, right: 34, bottom: 84, left: 90 };

    const observed = buildObservedPeak();
    const fitParams = estimateGaussianFit(observed);
    const fitCurve = d3.range(1.0, 9.01, 0.03).map((x) => ({
      x,
      y: gaussian(x, fitParams.amplitude, fitParams.mean, fitParams.sigma, fitParams.baseline),
    }));

    const yMax = Math.max(
      d3.max(observed, (point) => point.y),
      d3.max(fitCurve, (point) => point.y)
    ) * 1.14;

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    plotUtils.addAxes(fig, [1, 9], [0, yMax], 5, 6);

    d3.select(`#${containerId} svg`)
      .style('background', 'linear-gradient(180deg, rgba(3, 16, 24, 0.38), rgba(3, 16, 24, 0.14))')
      .style('border-radius', '14px')
      .style('border', '2px solid rgba(0, 255, 255, 0.18)')
      .style('box-shadow', '0 0 22px rgba(0, 255, 255, 0.08)');

    const horizontalGridValues = d3.range(0, yMax + 1e-9, yMax / 5);
    fig.svg.append('g')
      .selectAll('line')
      .data(horizontalGridValues)
      .enter()
      .append('line')
      .attr('x1', fig.xScale(1))
      .attr('x2', fig.xScale(9))
      .attr('y1', (value) => fig.yScale(value))
      .attr('y2', (value) => fig.yScale(value))
      .attr('stroke', 'rgba(255, 255, 255, 0.10)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5 7');

    const observedLine = d3.line()
      .x((point) => fig.xScale(point.x))
      .y((point) => fig.yScale(point.y))
      .curve(d3.curveMonotoneX);

    fig.svg.append('path')
      .datum(observed)
      .attr('d', observedLine)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 255, 213, 0.32)')
      .attr('stroke-width', 2.5);

    fig.svg.append('g')
      .selectAll('circle')
      .data(observed)
      .enter()
      .append('circle')
      .attr('cx', (point) => fig.xScale(point.x))
      .attr('cy', (point) => fig.yScale(point.y))
      .attr('r', 4.5)
      .attr('fill', '#00ffd5')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.95);

    fig.svg.append('path')
      .datum(fitCurve)
      .attr('d', d3.line()
        .x((point) => fig.xScale(point.x))
        .y((point) => fig.yScale(point.y))
        .curve(d3.curveMonotoneX))
      .attr('fill', 'none')
      .attr('stroke', '#ff5fd2')
      .attr('stroke-width', 5)
      .attr('opacity', 0.96);

    const apexY = gaussian(
      fitParams.mean,
      fitParams.amplitude,
      fitParams.mean,
      fitParams.sigma,
      fitParams.baseline
    );

    fig.svg.append('line')
      .attr('x1', fig.xScale(fitParams.mean))
      .attr('x2', fig.xScale(fitParams.mean))
      .attr('y1', fig.yScale(0))
      .attr('y2', fig.yScale(apexY))
      .attr('stroke', '#ffd166')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '7 6');

    fig.svg.append('circle')
      .attr('cx', fig.xScale(fitParams.mean))
      .attr('cy', fig.yScale(apexY))
      .attr('r', 6)
      .attr('fill', '#ffd166')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    fig.svg.append('text')
      .attr('x', fig.xScale(fitParams.mean) + 14)
      .attr('y', fig.yScale(apexY) - 14)
      .style('fill', '#ffd166')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .text('estimated apex');

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', -18)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '13px')
      .text('Chromatographic peak with Gaussian curve fit');

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 58)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Retention time (min)');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -62)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Signal intensity (a.u.)');

    const legend = fig.svg.append('g')
      .attr('transform', `translate(${fig.width - 220}, 18)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 36)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#ff5fd2')
      .attr('stroke-width', 5);

    legend.append('text')
      .attr('x', 48)
      .attr('y', 4)
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .text('Gaussian fit');

    legend.append('circle')
      .attr('cx', 4)
      .attr('cy', 28)
      .attr('r', 4.5)
      .attr('fill', '#00ffd5')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2);

    legend.append('text')
      .attr('x', 48)
      .attr('y', 32)
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .text('Observed noisy peak');
  }

  function register() {
    if (
      typeof window.d3 === 'undefined' ||
      typeof window.plotUtils === 'undefined' ||
      typeof window.Reveal === 'undefined'
    ) {
      setTimeout(register, 80);
      return;
    }

    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();