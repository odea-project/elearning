/* -------------------------------------*/
/* SPECTROSCOPY ERROR PROPAGATION CHART */
/* Shows contribution of each variable  */
/* -------------------------------------*/
(function () {
  function initSpectroscopyErrorChart() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initSpectroscopyErrorChart, 100);
      return;
    }

    const containerId = 'spectroscopy-error-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Configuration
    const margin = { top: 40, right: 120, bottom: 70, left: 100 };
    const width = 580 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    // Theme-aware colors
    const theme = {
      // Bar colors - these work on both backgrounds (saturated, high contrast)
      barColorEpsilon: '#d48800',  // darker orange - good on white & dark
      barColorA: '#0088aa',        // teal - good on white & dark
      barColorL: '#cc4444',        // darker red - good on white & dark
      // Text colors
      titleColor: isPerformanceMode ? '#000000' : '#ffffff',
      axisTextColor: isPerformanceMode ? '#333333' : '#aaaaaa',
      axisLineColor: isPerformanceMode ? '#666666' : '#555555',
      yAxisTextColor: isPerformanceMode ? '#000000' : '#ffffff',
      barLabelColor: '#ffffff',    // always white (on colored bars)
      fullNameColor: isPerformanceMode ? '#444444' : '#cccccc',  // brighter in dark mode
      // Result box
      resultBoxBg: isPerformanceMode ? '#2d5a3d' : '#1a472a',
      resultTextColor: '#00dd77',  // bright green - good on dark green bg
      // Insight text
      insightColor: '#cc7700',     // darker orange for better contrast
      // Background bar
      bgBarColor: isPerformanceMode ? '#dddddd' : '#333333'
    };

    // Beer-Lambert Law parameters (with theme colors)
    const params = {
      A: { value: 0.542, sigma: 0.008, label: 'Absorbance (A)', color: theme.barColorA },
      epsilon: { value: 15000, sigma: 300, label: 'Molar absorptivity (ε)', color: theme.barColorEpsilon },
      l: { value: 1.00, sigma: 0.01, label: 'Path length (l)', color: theme.barColorL }
    };

    // Calculate concentration and partial derivatives
    const c = params.A.value / (params.epsilon.value * params.l.value);
    
    // Partial derivatives
    const dc_dA = 1 / (params.epsilon.value * params.l.value);
    const dc_deps = -params.A.value / (Math.pow(params.epsilon.value, 2) * params.l.value);
    const dc_dl = -params.A.value / (params.epsilon.value * Math.pow(params.l.value, 2));

    // Uncertainty contributions (squared)
    const contrib_A = Math.pow(dc_dA * params.A.sigma, 2);
    const contrib_eps = Math.pow(dc_deps * params.epsilon.sigma, 2);
    const contrib_l = Math.pow(dc_dl * params.l.sigma, 2);
    
    const total_variance = contrib_A + contrib_eps + contrib_l;
    const sigma_c = Math.sqrt(total_variance);

    // Data for chart (percentages)
    const data = [
      { 
        variable: 'ε', 
        fullName: 'Molar absorptivity',
        contribution: (contrib_eps / total_variance) * 100, 
        color: theme.barColorEpsilon,
        value: `±${params.epsilon.sigma}`
      },
      { 
        variable: 'A', 
        fullName: 'Absorbance',
        contribution: (contrib_A / total_variance) * 100, 
        color: theme.barColorA,
        value: `±${params.A.sigma}`
      },
      { 
        variable: 'l', 
        fullName: 'Path length',
        contribution: (contrib_l / total_variance) * 100, 
        color: theme.barColorL,
        value: `±${params.l.sigma}`
      }
    ].sort((a, b) => b.contribution - a.contribution);

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Contribution to Total Uncertainty');

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.variable))
      .range([0, height])
      .padding(0.3);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d + '%'))
      .selectAll('text')
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '14px');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', theme.axisLineColor);

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', theme.yAxisTextColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', theme.axisLineColor);

    // Bars
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar');

    // Background bars
    bars.append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.variable))
      .attr('width', width)
      .attr('height', yScale.bandwidth())
      .attr('fill', theme.bgBarColor)
      .attr('rx', 4);

    // Value bars with animation
    bars.append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.variable))
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .attr('opacity', 0.85)
      .transition()
      .duration(800)
      .delay((d, i) => i * 150)
      .attr('width', d => xScale(d.contribution));

    // Percentage labels - clean text without outline
    bars.append('text')
      .attr('x', d => Math.max(xScale(d.contribution) - 10, 40))
      .attr('y', d => yScale(d.variable) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', theme.barLabelColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.5)')
      .style('paint-order', 'stroke fill')
      .attr('stroke', 'none')
      .attr('opacity', 0)
      .text(d => d.contribution.toFixed(1) + '%')
      .transition()
      .duration(400)
      .delay((d, i) => i * 150 + 600)
      .attr('opacity', 1);

    // Full name labels on right
    bars.append('text')
      .attr('x', width + 10)
      .attr('y', d => yScale(d.variable) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', theme.fullNameColor)
      .attr('font-size', '13px')
      .text(d => d.fullName);

    // Result box
    const resultBox = svg.append('g')
      .attr('transform', `translate(0, ${height + 40})`);

    resultBox.append('rect')
      .attr('x', 0)
      .attr('y', -8)
      .attr('width', width)
      .attr('height', 32)
      .attr('fill', theme.resultBoxBg)
      .attr('rx', 5)
      .attr('opacity', 0)
      .transition()
      .delay(1200)
      .duration(400)
      .attr('opacity', 1);

    resultBox.append('text')
      .attr('x', width / 2)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.resultTextColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(`Result: c = ${(c * 1e6).toFixed(2)} ± ${(sigma_c * 1e6).toFixed(2)} µmol/L`)
      .transition()
      .delay(1200)
      .duration(400)
      .attr('opacity', 1);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpectroscopyErrorChart);
  } else {
    initSpectroscopyErrorChart();
  }

  // Redraw on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'spectroscopy-example') {
        setTimeout(initSpectroscopyErrorChart, 200);
      }
    });
  }

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('spectroscopy-error-container');
      if (container && container.offsetParent !== null) {
        initSpectroscopyErrorChart();
      }
    }, 250);
  });
})();
