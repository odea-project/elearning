// Boxplots for Different Distribution Shapes
// D3.js visualization showing how different distributions appear in boxplots

(function() {
  window.initBoxplotDistributions = () => {
    // Random number generators
    const seed = (s) => {
      let value = s;
      return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
      };
    };
    
    const rng = seed(999);
    
    // Normal distribution (Box-Muller transform)
    const rnorm = (n, mean, sd) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        const u1 = rng();
        const u2 = rng();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + z * sd);
      }
      return data;
    };
    
    // Uniform distribution
    const runif = (n, min, max) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        data.push(min + rng() * (max - min));
      }
      return data;
    };
    
    // F distribution (approximate using ratio of chi-squared)
    const rf = (n, df1, df2) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        let chi1 = 0, chi2 = 0;
        for (let j = 0; j < df1; j++) {
          const z = rnorm(1, 0, 1)[0];
          chi1 += z * z;
        }
        for (let j = 0; j < df2; j++) {
          const z = rnorm(1, 0, 1)[0];
          chi2 += z * z;
        }
        data.push((chi1 / df1) / (chi2 / df2));
      }
      return data;
    };
    
    // Bimodal distribution (two normal distributions)
    const rbimodal = (n, mean1, mean2, sd) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        // 50% from each mode
        if (rng() < 0.5) {
          data.push(rnorm(1, mean1, sd)[0]);
        } else {
          data.push(rnorm(1, mean2, sd)[0]);
        }
      }
      return data;
    };
    
    // Generate data for different distributions
    const distributions = [
      {
        name: 'Data 1',
        data: rnorm(1000, 50, 10),
        color: '#06d6a0',
        description: 'Symmetric, bell-shaped'
      },
      {
        name: 'Data 2',
        data: runif(1000, 30, 70),
        color: '#ffd166',
        description: 'Flat, equal probability'
      },
      {
        name: 'Data 3',
        data: rf(1000, 5, 10).map(x => Math.min(x * 20 + 30, 100)),  // Scale and cap
        color: '#ef476f',
        description: 'Long tail to right'
      },
      {
        name: 'Data 4',
        data: rbimodal(1000, 15, 85, 5),
        color: '#118ab2',
        description: 'Two peaks'
      }
    ];
    
    // Calculate boxplot statistics
    const calculateBoxplotStats = (data) => {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      const q1 = sorted[Math.floor(n * 0.25)];
      const median = sorted[Math.floor(n * 0.5)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      
      const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
      const upperWhisker = Math.min(sorted[n - 1], q3 + 1.5 * iqr);
      
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
        iqr,
        min: sorted[0],
        max: sorted[n - 1]
      };
    };
    
    // Process all distributions
    const boxplotData = distributions.map(dist => ({
      name: dist.name,
      color: dist.color,
      description: dist.description,
      rawData: dist.data,
      stats: calculateBoxplotStats(dist.data)
    }));
    
    const width = 1800;
    const height = 900;
    const margin = { top: 80, right: 50, bottom: 100, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Clear and create SVG
    d3.select('#boxplot-distributions-container').selectAll('*').remove();
    
    const svg = d3.select('#boxplot-distributions-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
      .domain(distributions.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.25);
    
    const yScale = d3.scaleLinear()
      .domain([0, 110])
      .range([innerHeight, 0]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(11);
    
    const xAxisGroup = svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .classed('d3-axis', true);

    xAxisGroup.selectAll('text')
      .style('font-size', '18px')
      .style('font-weight', '600');

    svg.selectAll('.x-axis line, .x-axis path')
      .style('stroke-width', '2px');

    const yAxisGroup = svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .classed('d3-axis', true);

    yAxisGroup.selectAll('text')
      .style('font-size', '16px');

    svg.selectAll('.y-axis line, .y-axis path')
      .style('stroke-width', '2px');
    
    // Labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 70)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--large', true)
      .text('Distribution Type');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -55)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--large', true)
      .text('Value');
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -45)
      .style('text-anchor', 'middle')
      .style('fill', '#ff139dff')
      .style('font-size', '28px')
      .style('font-weight', 'bold')
      .text('How Different Distributions Appear in Boxplots');
    
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -18)
      .style('text-anchor', 'middle')
      .style('fill', '#ffd60a')
      .style('font-size', '18px')
      .text('Understanding distribution shape through boxplot characteristics');
    
    // Draw boxplots
    const boxWidth = xScale.bandwidth();
    
    boxplotData.forEach((dist, i) => {
      const x = xScale(dist.name);
      const stats = dist.stats;
      
      // Add a subtle histogram/dots in background to show actual distribution
      const binWidth = boxWidth / 15;
      const jitterAmount = boxWidth * 0.8;
      
      // Sample 50 points to show as dots
      const sampleSize = 0;
      const step = Math.floor(dist.rawData.length / sampleSize);
      const sampledData = dist.rawData.filter((_, idx) => idx % step === 0);
      
      sampledData.forEach(value => {
        const jitter = (rng() - 0.5) * jitterAmount;
        svg.append('circle')
          .attr('cx', x + boxWidth / 2 + jitter)
          .attr('cy', yScale(value))
          .attr('r', 2.5)
          .style('fill', dist.color)
          .style('opacity', 0.15);
      });
      
      // Whisker lines (vertical)
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.q1))
        .style('stroke', dist.color)
        .style('stroke-width', 2.5);
      
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(stats.q3))
        .attr('y2', yScale(stats.upperWhisker))
        .style('stroke', dist.color)
        .style('stroke-width', 2.5);
      
      // Whisker ends (horizontal)
      svg.append('line')
        .attr('x1', x + boxWidth * 0.25)
        .attr('x2', x + boxWidth * 0.75)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.lowerWhisker))
        .style('stroke', dist.color)
        .style('stroke-width', 2.5);
      
      svg.append('line')
        .attr('x1', x + boxWidth * 0.25)
        .attr('x2', x + boxWidth * 0.75)
        .attr('y1', yScale(stats.upperWhisker))
        .attr('y2', yScale(stats.upperWhisker))
        .style('stroke', dist.color)
        .style('stroke-width', 2.5);
      
      // Box (IQR)
      svg.append('rect')
        .attr('x', x)
        .attr('y', yScale(stats.q3))
        .attr('width', boxWidth)
        .attr('height', yScale(stats.q1) - yScale(stats.q3))
        .style('fill', dist.color)
        .style('fill-opacity', 0.4)
        .style('stroke', dist.color)
        .style('stroke-width', 3);
      
      // Median line
      svg.append('line')
        .attr('x1', x)
        .attr('x2', x + boxWidth)
        .attr('y1', yScale(stats.median))
        .attr('y2', yScale(stats.median))
        .style('stroke', '#1a2340')
        .style('stroke-width', 4);
      
      // Mean point (diamond)
      const meanSize = 10;
      const meanX = x + boxWidth / 2;
      const meanY = yScale(stats.mean);
      
      svg.append('path')
        .attr('d', `M ${meanX},${meanY - meanSize} L ${meanX + meanSize},${meanY} L ${meanX},${meanY + meanSize} L ${meanX - meanSize},${meanY} Z`)
        .style('fill', '#702914')
        .style('stroke', '#1a2340')
        .style('stroke-width', 2);
      
      // Outliers
      stats.outliers.forEach(outlier => {
        svg.append('circle')
          .attr('cx', x + boxWidth / 2)
          .attr('cy', yScale(outlier))
          .attr('r', 5)
          .style('fill', 'none')
          .style('stroke', dist.color)
          .style('stroke-width', 2.5);
      });
      
      // ...no description below for group discussion
    });
    
    // Add annotations for key features
    
    // Legend
  };
})();
