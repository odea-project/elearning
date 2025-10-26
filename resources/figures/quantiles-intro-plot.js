// Quantiles Introduction Plot - Three Rivers Nitrate Monitoring
// Interactive D3.js visualization with three view modes: Raw Data, Mean ± SD, Quantiles

(function() {
  window.initQuantilesIntro = () => {
    // Generate three rivers with different sample sizes
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

    const rng = seed(123);
    
    // Helper function to shuffle array using Fisher-Yates algorithm
    const shuffle = (array, rng) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    
    // Helper to insert outliers at random positions
    const insertOutliersRandomly = (base, outliers, rng) => {
      const combined = [...base, ...outliers];
      return shuffle(combined, rng);
    };
    
    // River A: >60% above threshold (50), mean should be middle
    // Using mean=58, sd=8 gives roughly 65% above 50, mean=58
    const riverA_base = rnorm(90, 58, 8, rng);
    const riverA_outliers = rnorm(10, 35, 6, rng);  // Add some low outliers
    const riverA = insertOutliersRandomly(riverA_base, riverA_outliers, rng)
      .map((v, i) => ({ index: i, value: v - 4, river: 'A' }));
    
    // River B: >30% above threshold (50), mean should be highest
    // Using mean=62, sd=12 gives roughly 35% above 50, mean=62 (highest)
    const riverB_base = rnorm(380, 62, 12, rng);
    const riverB_outliers = rnorm(20, 35, 8, rng);  // Add some low outliers
    const riverB = insertOutliersRandomly(riverB_base, riverB_outliers, rng)
      .map((v, i) => ({ index: i, value: v - 17, river: 'B' }));
    
    // River C: >5% above threshold (50), mean should be lowest
    // Using mean=35, sd=8 with small fraction of outliers gives ~7% above 50, mean~37 (lowest)
    const riverC_base = rnorm(1300, 35, 8, rng);
    const riverC_outliers = rnorm(100, 58, 6, rng);  // High outliers
    const riverC = insertOutliersRandomly(riverC_base, riverC_outliers, rng)
      .map((v, i) => ({ index: i, value: v + 5, river: 'C' }));

    const allData = { A: riverA, B: riverB, C: riverC};
    const threshold = 50;

    // Calculate statistics
    const calcStats = (data) => {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      const mean = sorted.reduce((a, b) => a + b, 0) / n;
      const variance = sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
      const sd = Math.sqrt(variance);
      const q25 = sorted[Math.floor(n * 0.25)];
      const q50 = sorted[Math.floor(n * 0.50)];
      const q75 = sorted[Math.floor(n * 0.75)];
      return { mean, sd, q25, q50, q75 };
    };

    const statsA = calcStats(riverA.map(d => d.value));
    const statsB = calcStats(riverB.map(d => d.value));
    const statsC = calcStats(riverC.map(d => d.value));

    // Improved color scheme for better distinction
    const colors = { 
      A: '#e63946',  // Bright red
      B: '#f77f00',  // Bright orange
      C: '#06d6a0'   // Bright teal/green
    };
    
    const width = 1820;
    const height = 820;
    const margin = { top: 60, right: 140, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear and create SVG
    d3.select('#quantiles-intro-container').selectAll('*').remove();
    
    const svg = d3.select('#quantiles-intro-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, 1400])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 90])
      .range([innerHeight, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(7);
    const yAxis = d3.axisLeft(yScale).ticks(6);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', '#ff00eaff')
      .style('font-size', '20px');

    svg.selectAll('.x-axis line, .x-axis path')
      .style('stroke', '#ff00eaff')
      .style('stroke-width', '2px');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('fill', '#ff00eaff')
      .style('font-size', '20px');

    svg.selectAll('.y-axis line, .y-axis path')
      .style('stroke', '#ff00eaff')
      .style('stroke-width', '2px');

    // Labels
    svg.append('text')
      .attr('class', 'raw-x-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 48)
      .style('text-anchor', 'middle')
      .style('fill', '#ff00eaff')
      .style('font-size', '25px')
      .style('font-weight', '600')
      .text('Measurement Index');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -42)
      .style('text-anchor', 'middle')
      .style('fill', '#ff00eaff')
      .style('font-size', '25px')
      .style('font-weight', '600')
      .text('NO₃ (mg/L)');

    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -30)
      .style('text-anchor', 'middle')
      .style('fill', '#ff00eaff')
      .style('font-size', '25px')
      .style('font-weight', 'bold')
      .text('Three Rivers - Nitrate Monitoring');

    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -8)
      .style('text-anchor', 'middle')
      .style('fill', '#ff00eaff')
      .style('font-size', '20px')
      .text('EU Threshold: 50 mg/L  •  River A: 100 samples  •  River B: 400 samples  •  River C: 1400 samples');

    // Threshold line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(threshold))
      .attr('y2', yScale(threshold))
      .style('stroke', '#ffd60a')
      .style('stroke-width', 3)
      .style('stroke-dasharray', '8,6');

    svg.append('text')
      .attr('x', innerWidth - 10)
      .attr('y', yScale(threshold) - 8)
      .style('text-anchor', 'end')
      .style('fill', '#ffd60a')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .text('EU Threshold (50 mg/L)');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth + 20}, 20)`);

    ['A', 'B', 'C'].forEach((river, i) => {
      const samples = allData[river].length;
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', i * 30)
        .attr('r', 6)
        .style('fill', colors[river]);
      
      legend.append('text')
        .attr('x', 15)
        .attr('y', i * 30 + 5)
        .style('fill', '#ff00eaff')
        .style('font-size', '20px')
        .style('font-weight', '600')
        .text(`River ${river} (n=${samples})`);
    });

    // Data points group
    const pointsGroup = svg.append('g').attr('class', 'points-group');
    const meanGroup = svg.append('g').attr('class', 'mean-group').style('display', 'none');
    const quantGroup = svg.append('g').attr('class', 'quant-group').style('display', 'none');

    // Draw raw data points
    ['A', 'B', 'C'].forEach(river => {
      pointsGroup.selectAll(`.point-${river}`)
        .data(allData[river])
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.index))
        .attr('cy', d => yScale(d.value))
        .attr('r', 5)
        .style('fill', colors[river])
        .style('opacity', 0.7)
        .style('stroke', colors[river])
        .style('stroke-width', 0.5);
    });

    // Draw mean ± SD bands
    const drawMeanSD = () => {
      // Create categorical scale for rivers
      const categoryScale = d3.scaleBand()
        .domain(['River A', 'River B', 'River C'])
        .range([0, innerWidth])
        .padding(0.2);

      const categoryWidth = categoryScale.bandwidth();

      // Create categorical x-axis
      const categoryAxis = d3.axisBottom(categoryScale);

      meanGroup.append('g')
        .attr('class', 'mean-x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(categoryAxis)
        .selectAll('text')
        .style('fill', '#ff00eaff')
        .style('font-size', '20px')
        .style('font-weight', '600');

      meanGroup.selectAll('.mean-x-axis line, .mean-x-axis path')
        .style('stroke', '#ff00eaff')
        .style('stroke-width', '2px');

      // X-axis label
      meanGroup.append('text')
        .attr('class', 'mean-x-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 48)
        .style('text-anchor', 'middle')
        .style('fill', '#ff00eaff')
        .style('font-size', '25px')
        .style('font-weight', '600')
        .text('River');

      const bands = [
        { river: 'A', category: 'River A', stats: statsA },
        { river: 'B', category: 'River B', stats: statsB },
        { river: 'C', category: 'River C', stats: statsC }
      ];

      bands.forEach((b, i) => {
        const xStart = categoryScale(b.category);
        const xEnd = xStart + categoryWidth;

        // SD band
        meanGroup.append('rect')
          .attr('x', xStart)
          .attr('y', yScale(b.stats.mean + b.stats.sd))
          .attr('width', categoryWidth)
          .attr('height', yScale(b.stats.mean - b.stats.sd) - yScale(b.stats.mean + b.stats.sd))
          .style('fill', colors[b.river])
          .style('opacity', 0.25)
          .style('stroke', colors[b.river])
          .style('stroke-width', 2)
          .style('stroke-dasharray', '4,4');

        // Mean line (within category)
        meanGroup.append('line')
          .attr('x1', xStart)
          .attr('x2', xEnd)
          .attr('y1', yScale(b.stats.mean))
          .attr('y2', yScale(b.stats.mean))
          .style('stroke', colors[b.river])
          .style('stroke-width', 4);

        // Label above mean line
        meanGroup.append('text')
          .attr('x', xStart + categoryWidth / 2)
          .attr('y', yScale(b.stats.mean) - 10)
          .style('text-anchor', 'middle')
          .style('fill', colors[b.river])
          .style('font-size', '12px')
          .style('font-weight', '700')
          .text(`μ=${b.stats.mean.toFixed(1)}, σ=${b.stats.sd.toFixed(1)}`);
      });
    };

    // Draw quantile curves
    const drawQuantiles = () => {
      // Calculate quantiles for each river
      const calcQuantileCurve = (data) => {
        const sorted = [...data].sort((a, b) => a - b);
        const n = sorted.length;
        const quantiles = [];
        for (let p = 0.1; p <= 0.9; p += 0.1) {
          const index = Math.floor(n * p);
          quantiles.push({ p: p, value: sorted[index] });
        }
        return quantiles;
      };

      const riverData = {
        A: calcQuantileCurve(riverA.map(d => d.value)),
        B: calcQuantileCurve(riverB.map(d => d.value)),
        C: calcQuantileCurve(riverC.map(d => d.value))
      };

      // Create scales for quantile view (x = percentile, y = value)
      const qXScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, innerWidth]);

      const qYScale = d3.scaleLinear()
        .domain([0, 90])
        .range([innerHeight, 0]);

      // Draw axes for quantile view
      const qXAxis = d3.axisBottom(qXScale).ticks(10).tickFormat(d => (d * 100).toFixed(0) + '%');
      const qYAxis = d3.axisLeft(qYScale).ticks(6);

      quantGroup.append('g')
        .attr('class', 'qx-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(qXAxis)
        .selectAll('text')
        .style('fill', '#ff00eaff')
        .style('font-size', '25px');

      quantGroup.selectAll('.qx-axis line, .qx-axis path')
        .style('stroke', '#ff00eaff')
        .style('stroke-width', '2px');

      quantGroup.append('g')
        .attr('class', 'qy-axis')
        .call(qYAxis)
        .selectAll('text')
        .style('fill', '#ff00eaff')
        .style('font-size', '25px');

      quantGroup.selectAll('.qy-axis line, .qy-axis path')
        .style('stroke', '#ff00eaff')
        .style('stroke-width', '2px');

      // Axis labels for quantile view
      quantGroup.append('text')
        .attr('class', 'quant-x-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 48)
        .style('text-anchor', 'middle')
        .style('fill', '#ff00eaff')
        .style('font-size', '25px')
        .style('font-weight', '600')
        .text('Percentile');

      quantGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -42)
        .style('text-anchor', 'middle')
        .style('fill', '#ff00eaff')
        .style('font-size', '25px')
        .style('font-weight', '600')
        .text('NO₃ (mg/L)');

      // Draw quantile curves for each river
      ['A', 'B', 'C'].forEach(river => {
        const data = riverData[river];
        
        // Line generator
        const line = d3.line()
          .x(d => qXScale(d.p))
          .y(d => qYScale(d.value))
          .curve(d3.curveMonotoneX);

        // Draw curve
        quantGroup.append('path')
          .datum(data)
          .attr('d', line)
          .style('fill', 'none')
          .style('stroke', colors[river])
          .style('stroke-width', 3);

        // Draw points
        quantGroup.selectAll(`.qpoint-${river}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', d => qXScale(d.p))
          .attr('cy', d => qYScale(d.value))
          .attr('r', 4)
          .style('fill', colors[river])
          .style('stroke', '#1a2340')
          .style('stroke-width', 1.5);
      });

      // Legend for quantile view (positioned inside plot area)
      const qLegend = quantGroup.append('g')
        .attr('transform', `translate(20, 20)`);

      // Background for legend
      qLegend.append('rect')
        .attr('x', -5)
        .attr('y', -15)
        .attr('width', 100)
        .attr('height', 80)
        .style('fill', '#1a2340')
        .style('opacity', 0.85)
        .style('stroke', '#ff00eaff')
        .style('stroke-width', 1.5)
        .style('rx', 4);

      ['A', 'B', 'C'].forEach((river, i) => {
        qLegend.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', i * 25)
          .attr('y2', i * 25)
          .style('stroke', colors[river])
          .style('stroke-width', 3);
        
        qLegend.append('text')
          .attr('x', 25)
          .attr('y', i * 25 + 5)
          .style('fill', '#ff00eaff')
          .style('font-size', '25px')
          .style('font-weight', '600')
          .text(`River ${river}`);
      });
    };

    drawMeanSD();
    drawQuantiles();

    // Button handlers
    const buttons = {
      'btn-raw-data': () => {
        pointsGroup.style('display', 'block');
        meanGroup.style('display', 'none');
        quantGroup.style('display', 'none');
        // Show original axes
        svg.select('.x-axis').style('display', 'block');
        svg.select('.y-axis').style('display', 'block');
        // Show/hide x-axis labels
        svg.select('.raw-x-label').style('display', 'block');
        svg.select('.mean-x-label').style('display', 'none');
        svg.select('.quant-x-label').style('display', 'none');
      },
      'btn-mean-sd': () => {
        pointsGroup.style('display', 'none');
        meanGroup.style('display', 'block');
        quantGroup.style('display', 'none');
        // Hide original x-axis (mean view has its own categorical x-axis)
        svg.select('.x-axis').style('display', 'none');
        svg.select('.y-axis').style('display', 'block');
        // Show/hide x-axis labels
        svg.select('.raw-x-label').style('display', 'none');
        svg.select('.mean-x-label').style('display', 'block');
        svg.select('.quant-x-label').style('display', 'none');
      },
      'btn-quantiles': () => {
        pointsGroup.style('display', 'none');
        meanGroup.style('display', 'none');
        quantGroup.style('display', 'block');
        // Hide original axes (quantiles view has its own)
        svg.select('.x-axis').style('display', 'none');
        svg.select('.y-axis').style('display', 'none');
        // Show/hide x-axis labels
        svg.select('.raw-x-label').style('display', 'none');
        svg.select('.mean-x-label').style('display', 'none');
        svg.select('.quant-x-label').style('display', 'block');
      }
    };

    Object.keys(buttons).forEach(btnId => {
      d3.select(`#${btnId}`).on('click', function() {
        d3.selectAll('.view-btn')
          .style('border-color', '#555')
          .classed('active', false);
        d3.select(this)
          .style('border-color', '#ff00eaff')
          .classed('active', true);
        buttons[btnId]();
      });
    });
  };
})();
