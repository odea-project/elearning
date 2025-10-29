// Boxplot for Water Quality Data - Multiple Monitoring Sites
// D3.js visualization comparing 5 water monitoring sites

(function() {
  window.initBoxplotWaterQuality = () => {
    // Generate realistic water quality data for 5 sites with different characteristics
    const seed = (s) => {
      let value = s;
      return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
      };
    };
    
    const rnorm = (n, mean, sd, rng) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        const u1 = rng();
        const u2 = rng();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + z * sd);
      }
      return data;
    };
    
    const rng = seed(789);
    
    // Generate data for 5 sites with varying water quality
    const sites = [
      {
        name: 'Upstream',
        data: rnorm(40, 8, 1.2, rng).concat([3.5, 14]),  // Add some outliers
        color: '#06d6a0'
      },
      {
        name: 'Urban Area',
        data: rnorm(45, 15, 3.5, rng).concat([5, 28, 30]),  // More variation, outliers
        color: '#ffd166'
      },
      {
        name: 'Industrial',
        data: rnorm(38, 22, 4, rng).concat([10, 35, 38]),  // High values, wide spread
        color: '#ef476f'
      },
      {
        name: 'Agricultural',
        data: rnorm(42, 18, 5, rng).concat([6, 32]),  // Wide variation
        color: '#f77f00'
      },
      {
        name: 'Downstream',
        data: rnorm(40, 12, 2.5, rng).concat([4, 22]),  // Moderate
        color: '#118ab2'
      }
    ];
    
    // Calculate boxplot statistics for each site
    const calculateBoxplotStats = (data) => {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      const q1 = sorted[Math.floor(n * 0.25)];
      const median = sorted[Math.floor(n * 0.5)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      
      // Whiskers extend to min/max within 1.5×IQR
      const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
      const upperWhisker = Math.min(sorted[n - 1], q3 + 1.5 * iqr);
      
      // Outliers are points beyond whiskers
      const outliers = sorted.filter(d => d < lowerWhisker || d > upperWhisker);
      
      const mean = sorted.reduce((a, b) => a + b, 0) / n;
      
      return {
        q1,
        median,
        q3,
        lowerWhisker,
        upperWhisker,
        outliers,
        mean,
        iqr
      };
    };
    
    // Process all sites
    const boxplotData = sites.map(site => ({
      name: site.name,
      color: site.color,
      stats: calculateBoxplotStats(site.data)
    }));
    
    const width = 900;
    const height = 600;
    const margin = { top: 60, right: 50, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Clear and create SVG
    d3.select('#boxplot-water-quality-container').selectAll('*').remove();
    
    const svg = d3.select('#boxplot-water-quality-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
      .domain(sites.map(s => s.name))
      .range([0, innerWidth])
      .padding(0.3);
    
    const yScale = d3.scaleLinear()
      .domain([0, 40])
      .range([innerHeight, 0]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(8);
    
    const xAxisGroup = svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .classed('d3-axis', true);

    const yAxisGroup = svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .classed('d3-axis', true);
    
    // Labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 60)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Monitoring Site');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -55)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Nitrate Concentration (mg/L)');

    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .text('Water Quality Comparison Across Monitoring Sites');
    
    // Draw boxplots
    const boxWidth = xScale.bandwidth();
    
    boxplotData.forEach((site, i) => {
      const x = xScale(site.name);
      const stats = site.stats;
      
      // Whisker lines (vertical)
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.q1))
        .style('stroke', site.color)
        .style('stroke-width', 2);
      
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(stats.q3))
        .attr('y2', yScale(stats.upperWhisker))
        .style('stroke', site.color)
        .style('stroke-width', 2);
      
      // Whisker ends (horizontal)
      svg.append('line')
        .attr('x1', x + boxWidth * 0.3)
        .attr('x2', x + boxWidth * 0.7)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.lowerWhisker))
        .style('stroke', site.color)
        .style('stroke-width', 2);
      
      svg.append('line')
        .attr('x1', x + boxWidth * 0.3)
        .attr('x2', x + boxWidth * 0.7)
        .attr('y1', yScale(stats.upperWhisker))
        .attr('y2', yScale(stats.upperWhisker))
        .style('stroke', site.color)
        .style('stroke-width', 2);
      
      // Box (IQR)
      svg.append('rect')
        .attr('x', x)
        .attr('y', yScale(stats.q3))
        .attr('width', boxWidth)
        .attr('height', yScale(stats.q1) - yScale(stats.q3))
        .style('fill', site.color)
        .style('fill-opacity', 0.3)
        .style('stroke', site.color)
        .style('stroke-width', 2);
      
      // Median line
      svg.append('line')
        .attr('x1', x)
        .attr('x2', x + boxWidth)
        .attr('y1', yScale(stats.median))
        .attr('y2', yScale(stats.median))
        .style('stroke', site.color)
        .style('stroke-width', 3);
      
      // Mean point (diamond)
      const meanSize = 8;
      const meanX = x + boxWidth / 2;
      const meanY = yScale(stats.mean);
      
      svg.append('path')
        .attr('d', `M ${meanX},${meanY - meanSize} L ${meanX + meanSize},${meanY} L ${meanX},${meanY + meanSize} L ${meanX - meanSize},${meanY} Z`)
        .style('fill', '#702914')
        .style('stroke', '#1a2340')
        .style('stroke-width', 1.5);
      
      // Outliers
      stats.outliers.forEach(outlier => {
        svg.append('circle')
          .attr('cx', x + boxWidth / 2)
          .attr('cy', yScale(outlier))
          .attr('r', 4)
          .style('fill', 'none')
          .style('stroke', site.color)
          .style('stroke-width', 2);
      });
    });
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 150}, 20)`);
    
    legend.append('rect')
      .attr('x', -10)
      .attr('y', -10)
      .attr('width', 160)
      .attr('height', 70)
      .style('fill', '#1a2340')
      .style('opacity', 0.85)
      .style('stroke', '#ff139dff')
      .style('stroke-width', 1.5)
      .style('rx', 4);
    
    // Median line
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 30)
      .attr('y1', 5)
      .attr('y2', 5)
      .style('stroke', '#ff139dff')
      .style('stroke-width', 3);
    
    legend.append('text')
      .attr('x', 35)
      .attr('y', 10)
      .classed('d3-legend-text', true)
      .text('Median');
    
    // Mean diamond
    const legendMeanX = 15;
    const legendMeanY = 30;
    const legendMeanSize = 6;
    
    legend.append('path')
      .attr('d', `M ${legendMeanX},${legendMeanY - legendMeanSize} L ${legendMeanX + legendMeanSize},${legendMeanY} L ${legendMeanX},${legendMeanY + legendMeanSize} L ${legendMeanX - legendMeanSize},${legendMeanY} Z`)
      .style('fill', '#702914')
      .style('stroke', '#1a2340')
      .style('stroke-width', 1.5);
    
    legend.append('text')
      .attr('x', 35)
      .attr('y', 35)
      .classed('d3-legend-text', true)
      .text('Mean');
    
    // Outlier
    legend.append('circle')
      .attr('cx', legendMeanX)
      .attr('cy', 50)
      .attr('r', 4)
      .style('fill', 'none')
      .style('stroke', '#ff139dff')
      .style('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 35)
      .attr('y', 55)
      .classed('d3-legend-text', true)
      .text('Outlier');
  };
})();
