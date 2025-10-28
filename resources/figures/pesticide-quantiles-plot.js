// Pesticide Concentrations in Surface Waters - Quantile Analysis
// Interactive D3.js visualization showing daily measurements with mean vs quantile comparison

(function() {
  window.initPesticideQuantiles = () => {
    // Generate realistic pesticide data: low baseline with occasional rainfall peaks
    const seed = (s) => {
      let value = s;
      return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
      };
    };
    
    const rng = seed(456);
    
    // Generate 30 days of data
    const days = 30;
    const data = [];
    
    // Baseline low concentration with occasional peaks
    for (let i = 1; i <= days; i++) {
      let concentration;
      
      // Create rainfall events on specific days (peaks)
      if ([5, 6, 15, 23, 24].includes(i)) {
        // Rainfall event: high concentration (1-2 µg/L)
        concentration = 1.0 + rng() * 1.0;
      } else if ([4, 7, 14, 16, 22, 25].includes(i)) {
        // Pre/post rainfall: moderate increase (0.2-0.5 µg/L)
        concentration = 0.2 + rng() * 0.3;
      } else {
        // Normal conditions: low baseline (0.01-0.08 µg/L)
        concentration = 0.01 + rng() * 0.07;
      }
      
      data.push({
        day: i,
        concentration: concentration,
        isRainfall: [5, 6, 15, 23, 24].includes(i)
      });
    }
    
    // Calculate statistics
    const values = data.map(d => d.concentration);
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const sd = Math.sqrt(variance);
    
    // Calculate quantiles
    const getQuantile = (p) => {
      const index = Math.floor(n * p);
      return sorted[index];
    };
    
    const q50 = getQuantile(0.50);  // Median
    const q75 = getQuantile(0.75);
    const q90 = getQuantile(0.90);
    const q95 = getQuantile(0.95);
    const q99 = getQuantile(0.99);
    
    // EU water quality threshold (example)
    const euThreshold = 0.5; // µg/L
    
    const width = 800;
    const height = 820;
    const margin = { top: 80, right: 50, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Clear and create SVG
    d3.select('#pesticide-quantiles-container').selectAll('*').remove();
    
    const svg = d3.select('#pesticide-quantiles-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain([1, days])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 2.2])
      .range([innerHeight, 0]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(days).tickFormat(d => d);
    const yAxis = d3.axisLeft(yScale).ticks(8);
    
    const xAxisGroup = svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .classed('d3-axis', true);

    xAxisGroup.selectAll('text')
      .style('font-size', '16px');

    svg.selectAll('.x-axis line, .x-axis path')
      .style('stroke-width', '2px');

    const yAxisGroup = svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .classed('d3-axis', true);

    yAxisGroup.selectAll('text')
      .style('font-size', '18px');

    svg.selectAll('.y-axis line, .y-axis path')
      .style('stroke-width', '2px');
    
    // Labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 60)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--large', true)
      .text('Day of Month');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -65)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--large', true)
      .text('Terbuthylazine Concentration (µg/L)');
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -50)
      .style('text-anchor', 'middle')
      .style('fill', '#ff139dff')
      .style('font-size', '26px')
      .style('font-weight', 'bold')
      .text('Pesticide Monitoring (30 Days)');
    
    // EU Threshold line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(euThreshold))
      .attr('y2', yScale(euThreshold))
      .style('stroke', '#ef476f')
      .style('stroke-width', 3)
      .style('stroke-dasharray', '8,6');
    
    svg.append('text')
      .attr('x', innerWidth - 10)
      .attr('y', yScale(euThreshold) - 8)
      .style('text-anchor', 'end')
      .style('fill', '#ef476f')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .text('EU Threshold (0.5 µg/L)');
    
    // Rainfall event highlights (background)
    const rainfallDays = [5, 6, 15, 23, 24];
    rainfallDays.forEach(day => {
      svg.append('rect')
        .attr('x', xScale(day - 0.4))
        .attr('y', 0)
        .attr('width', xScale(day + 0.4) - xScale(day - 0.4))
        .attr('height', innerHeight)
        .style('fill', '#ce007fff')
        .style('opacity', 0.1);
    });
    
    // Data line
    const line = d3.line()
      .x(d => xScale(d.day))
      .y(d => yScale(d.concentration))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data)
      .attr('class', 'data-line')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', '#06d6a0')
      .style('stroke-width', 3);
    
    // Data points
    svg.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.day))
      .attr('cy', d => yScale(d.concentration))
      .attr('r', d => d.isRainfall ? 7 : 5)
      .style('fill', d => d.isRainfall ? '#ffd60a' : '#06d6a0')
      .style('stroke', d => d.isRainfall ? '#ff6b35' : '#1a2340')
      .style('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 10)
          .style('stroke-width', 3);
        
        // Tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(d.day)},${yScale(d.concentration) - 30})`);
        
        tooltip.append('rect')
          .attr('x', -60)
          .attr('y', -25)
          .attr('width', 120)
          .attr('height', 22)
          .style('fill', '#1a2340')
          .style('stroke', '#ff139dff')
          .style('stroke-width', 2)
          .style('rx', 4);
        
        tooltip.append('text')
          .attr('y', -10)
          .style('text-anchor', 'middle')
          .style('fill', '#ff139dff')
          .style('font-size', '14px')
          .style('font-weight', '600')
          .text(`Day ${d.day}: ${d.concentration.toFixed(3)} µg/L`);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d.isRainfall ? 7 : 5)
          .style('stroke-width', 2);
        
        svg.selectAll('.tooltip').remove();
      });
    
    // Mean line (initially visible)
    const meanLine = svg.append('line')
      .attr('class', 'mean-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(mean))
      .attr('y2', yScale(mean))
      .style('stroke', '#9d4edd')
      .style('stroke-width', 3)
      .style('stroke-dasharray', '10,5')
      .style('display', 'none');
    
    svg.append('text')
      .attr('class', 'mean-label')
      .attr('x', 10)
      .attr('y', yScale(mean) - 8)
      .style('fill', '#9d4edd')
      .style('font-size', '15px')
      .style('font-weight', '600')
      .style('display', 'none')
      .text(`Mean (${mean.toFixed(3)} µg/L)`);
    
    // Quantile lines (initially hidden)
    const quantileLines = svg.append('g')
      .attr('class', 'quantile-lines')
      .style('display', 'none');
    
    const quantiles = [
      { value: q50, label: '50th (Median)', color: '#06d6a0' },
      { value: q75, label: '75th', color: '#f77f00' },
      { value: q90, label: '90th', color: '#ef476f' },
      { value: q95, label: '95th', color: '#e63946' },
      { value: q99, label: '99th', color: '#d62828' }
    ];
    
    quantiles.forEach((q, i) => {
      quantileLines.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth * 0.8)
        .attr('y1', yScale(q.value))
        .attr('y2', yScale(q.value))
        .style('stroke', q.color)
        .style('stroke-width', 2)
        .style('stroke-dasharray', '5,3');
      
      quantileLines.append('text')
        .attr('x', innerWidth * 0.8 + 10)
        .attr('y', yScale(q.value) + 4)
        .style('fill', q.color)
        .style('font-size', '13px')
        .style('font-weight', '600')
        .text(`${q.label} (${q.value.toFixed(3)})`);
    });
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${150}, ${10})`);
    
    legend.append('rect')
      .attr('x', -8)
      .attr('y', -8)
      .attr('width', 160)
      .attr('height', 100)
      .style('fill', '#1a2340')
      .style('opacity', 0.85)
      .style('stroke', '#ff139dff')
      .style('stroke-width', 1.5)
      .style('rx', 4);
    
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .style('fill', '#06d6a0')
      .style('stroke', '#1a2340')
      .style('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 12)
      .attr('y', 5)
      .style('fill', '#ffffffff')
      .style('font-size', '14px')
      .text('Normal Conditions');
    
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 30)
      .attr('r', 7)
      .style('fill', '#ffd60a')
      .style('stroke', '#ff6b35')
      .style('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 12)
      .attr('y', 35)
      .style('fill', '#ffffffff')
      .style('font-size', '14px')
      .text('Rainfall Event');
    
    legend.append('rect')
      .attr('x', -3)
      .attr('y', 55)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', '#118ab2')
      .style('opacity', 0.2);
    
    legend.append('text')
      .attr('x', 12)
      .attr('y', 65)
      .style('fill', '#ffffffff')
      .style('font-size', '14px')
      .text('Rain Period');
    
    // Button handlers
    const buttons = {
      'btn-raw-pesticide': () => {
        svg.selectAll('.mean-line, .mean-label').style('display', 'none');
        svg.select('.quantile-lines').style('display', 'none');
      },
      'btn-mean-pesticide': () => {
        svg.selectAll('.mean-line, .mean-label').style('display', 'block');
        svg.select('.quantile-lines').style('display', 'none');
      },
      'btn-quantiles-pesticide': () => {
        svg.selectAll('.mean-line, .mean-label').style('display', 'none');
        svg.select('.quantile-lines').style('display', 'block');
      }
    };
    
    Object.keys(buttons).forEach(btnId => {
      const btn = d3.select(`#${btnId}`);
      if (!btn.empty()) {
        btn.on('click', function() {
          d3.selectAll('.pesticide-view-btn')
            .style('border-color', '#555')
            .classed('active', false);
          d3.select(this)
            .style('border-color', '#ff139dff')
            .classed('active', true);
          buttons[btnId]();
        });
      }
    });
  };
})();
