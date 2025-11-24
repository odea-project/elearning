/**
 * ANOVA Group and Overall Means - Violin Plot Visualization
 * 
 * Shows violin plots for 4 sites with toggle between original data and 
 * z-transformed data (Brown-Forsythe Levene test).
 * 
 * Dependencies: D3.js v7
 */

(function() {
  'use strict';

  let currentMode = 'original'; // 'original' or 'z-transformed'

  function drawGroupMeansViolin() {
    // Check if container exists
    const container = document.getElementById('anova-group-means-chart');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Chart dimensions
    const width = 1000;
    const height = 700;
    const margin = { top: 80, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Data: actual measurements from the example
    const originalData = [
      { site: 'Site A', values: [7.2, 7.5, 7.1, 7.4], median: 7.30, mean: 7.30 },
      { site: 'Site B', values: [8.1, 8.3, 8.0, 8.2], median: 8.15, mean: 8.15 },
      { site: 'Site C', values: [6.5, 6.8, 6.4, 6.7], median: 6.60, mean: 6.60 },
      { site: 'Site D', values: [7.8, 7.6, 7.9, 7.7], median: 7.75, mean: 7.75 }
    ];

    // Calculate z-transformed data (absolute deviations from median)
    const zTransformedData = originalData.map(siteData => {
      const zValues = siteData.values.map(v => Math.abs(v - siteData.median));
      const zMean = d3.mean(zValues);
      return {
        site: siteData.site,
        values: zValues,
        mean: zMean,
        median: d3.median(zValues)
      };
    });

    const overallMean = 7.45;
    const overallMeanZ = d3.mean(zTransformedData.flatMap(d => d.values));

    // Select data based on current mode
    const data = currentMode === 'original' ? originalData : zTransformedData;
    const displayMean = currentMode === 'original' ? overallMean : overallMeanZ;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'anova-group-means-svg');

    // Create toggle buttons
    const toggleContainer = svg.append('g')
      .attr('transform', `translate(${margin.left}, 20)`);

    const buttonWidth = 150;
    const buttonHeight = 35;
    const buttonGap = 10;

    // Original data button
    const originalButton = toggleContainer.append('g')
      .attr('class', 'toggle-button')
      .style('cursor', 'pointer');

    originalButton.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', 5)
      .attr('fill', currentMode === 'original' ? '#00d4ff' : '#444444')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2);

    originalButton.append('text')
      .attr('x', buttonWidth / 2)
      .attr('y', buttonHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('Original Data');

    // Z-transformed button
    const zButton = toggleContainer.append('g')
      .attr('class', 'toggle-button')
      .attr('transform', `translate(${buttonWidth + buttonGap}, 0)`)
      .style('cursor', 'pointer');

    zButton.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', 5)
      .attr('fill', currentMode === 'z-transformed' ? '#ff6b35' : '#444444')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 2);

    zButton.append('text')
      .attr('x', buttonWidth / 2)
      .attr('y', buttonHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('Z-Transformed');

    // Button click handlers
    originalButton.on('click', () => {
      if (currentMode !== 'original') {
        currentMode = 'original';
        drawGroupMeansViolin();
      }
    });

    zButton.on('click', () => {
      if (currentMode !== 'z-transformed') {
        currentMode = 'z-transformed';
        drawGroupMeansViolin();
      }
    });

    // Create plot group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.site))
      .range([0, plotWidth])
      .padding(0.3);

    const allValues = data.flatMap(d => d.values);
    const yMin = Math.min(...allValues) - 0.5;
    const yMax = Math.max(...allValues) + 0.5;

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([plotHeight, 0]);

    // Add axes
    const xAxis = g.append('g')
      .attr('class', 'd3-axis')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale));

    const yAxis = g.append('g')
      .attr('class', 'd3-axis')
      .call(d3.axisLeft(yScale).ticks(6));

    // Add axis labels
    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('x', margin.left + plotWidth / 2)
      .attr('y', height - 15)
      .style('text-anchor', 'middle')
      .text('Sites');

    const yAxisLabel = currentMode === 'original' 
      ? 'Dissolved Oxygen (mg/L)' 
      : 'Absolute Deviation from Median |z|';

    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -margin.top - plotHeight / 2)
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .text(yAxisLabel);

    // Add title
    const chartTitle = currentMode === 'original'
      ? 'Group Means and Overall Mean'
      : 'Z-Transformed Data (Brown-Forsythe Test)';

    svg.append('text')
      .attr('class', 'd3-chart-title')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .text(chartTitle);

    // Function to generate violin shape using kernel density estimation
    function kernelDensityEstimator(kernel, thresholds) {
      return function(sample) {
        return thresholds.map(t => [t, d3.mean(sample, d => kernel(t - d))]);
      };
    }

    function kernelEpanechnikov(bandwidth) {
      return function(v) {
        return Math.abs(v /= bandwidth) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
      };
    }

    // Draw violin plots for each site
    data.forEach((siteData, i) => {
      const xPos = xScale(siteData.site) + xScale.bandwidth() / 2;
      const bandwidth = 0.3;
      
      // Generate kernel density estimation
      const thresholds = d3.range(yMin, yMax, 0.05);
      const density = kernelDensityEstimator(
        kernelEpanechnikov(bandwidth),
        thresholds
      )(siteData.values);

      // Normalize density for violin width
      const maxDensity = d3.max(density, d => d[1]);
      const violinWidth = xScale.bandwidth() * 0.8;

      // Create violin path
      const violinPath = d3.area()
        .x0(d => xPos - (d[1] / maxDensity) * violinWidth / 2)
        .x1(d => xPos + (d[1] / maxDensity) * violinWidth / 2)
        .y(d => yScale(d[0]))
        .curve(d3.curveCatmullRom);

      // Color scheme
      const colors = ['#00ff88', '#00d4ff', '#ff6b35', '#ffaa00'];
      const color = colors[i];

      // Draw violin
      g.append('path')
        .datum(density)
        .attr('class', 'violin-path')
        .attr('d', violinPath)
        .attr('fill', color)
        .attr('fill-opacity', 0.3)
        .attr('stroke', color)
        .attr('stroke-width', 2);

      // Draw individual data points
      g.selectAll(`.point-${i}`)
        .data(siteData.values)
        .enter()
        .append('circle')
        .attr('class', `data-point point-${i}`)
        .attr('cx', () => xPos + (Math.random() - 0.5) * violinWidth * 0.3)
        .attr('cy', d => yScale(d))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);

      // Draw group mean line
      const meanLineWidth = violinWidth * 0.6;
      g.append('line')
        .attr('class', 'group-mean-line')
        .attr('x1', xPos - meanLineWidth / 2)
        .attr('x2', xPos + meanLineWidth / 2)
        .attr('y1', yScale(siteData.mean))
        .attr('y2', yScale(siteData.mean))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 3)
        .attr('opacity', 0.9);

      // Draw mean value label
      g.append('text')
        .attr('class', 'd3-legend-text')
        .attr('x', xPos)
        .attr('y', yScale(siteData.mean) - 8)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', color)
        .text(siteData.mean.toFixed(2));
    });

    // Draw overall mean line (horizontal across all sites)
    const meanLineColor = currentMode === 'original' ? '#ff00ff' : '#00d4ff';
    const meanLabel = currentMode === 'original' 
      ? `Overall: ${displayMean.toFixed(2)}` 
      : `Mean |z|: ${displayMean.toFixed(3)}`;

    g.append('line')
      .attr('class', 'overall-mean-line')
      .attr('x1', 0)
      .attr('x2', plotWidth)
      .attr('y1', yScale(displayMean))
      .attr('y2', yScale(displayMean))
      .attr('stroke', meanLineColor)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '8,4')
      .attr('opacity', 0.8);

    // Overall mean label
    g.append('text')
      .attr('class', 'd3-legend-text')
      .attr('x', plotWidth - 5)
      .attr('y', yScale(displayMean) - 8)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', meanLineColor)
      .text(meanLabel);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left + 10}, ${margin.top + 10})`);

    const legendItems = [
      { label: 'Group mean', color: '#ffffff', type: 'line' },
      { label: 'Overall mean', color: '#ff00ff', type: 'dashed' },
      { label: 'Data points', color: '#00d4ff', type: 'circle' }
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      if (item.type === 'line') {
        legendRow.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', item.color)
          .attr('stroke-width', 2.5);
      } else if (item.type === 'dashed') {
        legendRow.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', item.color)
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '5,3');
      } else if (item.type === 'circle') {
        legendRow.append('circle')
          .attr('cx', 10)
          .attr('cy', 0)
          .attr('r', 4)
          .attr('fill', item.color)
          .attr('stroke', '#000000')
          .attr('stroke-width', 1);
      }

      legendRow.append('text')
        .attr('class', 'd3-legend-text')
        .attr('x', 28)
        .attr('y', 4)
        .style('font-size', '11px')
        .text(item.label);
    });
  }

  // Initialize on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector('#anova-group-means-chart')) {
        setTimeout(drawGroupMeansViolin, 100);
      }
    });

    // Also initialize if already on the slide
    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide && currentSlide.querySelector('#anova-group-means-chart')) {
      setTimeout(drawGroupMeansViolin, 100);
    }
  } else {
    // Fallback if Reveal is not available
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', drawGroupMeansViolin);
    } else {
      drawGroupMeansViolin();
    }
  }

})();
