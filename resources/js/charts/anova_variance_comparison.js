// anova_variance_comparison.js
// Interactive boxplots showing effect of between-group and within-group variance

(function() {
  let currentBetween = 'low';
  let currentWithin = 'low';
  
  // Data configurations for different variance scenarios
  const dataConfigs = {
    'low-low': {
      // Low between, low within - groups overlap, hard to distinguishs
      siteA: { mean: 7.0, spread: 0.5, color: '#ff6b35' },
      siteB: { mean: 7.2, spread: 0.5, color: '#00d4ff' },
      siteC: { mean: 7.1, spread: 0.5, color: '#00ff88' }
    },
    'low-high': {
      // Low between, high within - groups overlap significantly
      siteA: { mean: 7.0, spread: 3.2, color: '#ff6b35' },
      siteB: { mean: 7.2, spread: 3.2, color: '#00d4ff' },
      siteC: { mean: 7.1, spread: 3.2, color: '#00ff88' }
    },
    'high-low': {
      // High between, low within - clear separation between groups
      siteA: { mean: 6.0, spread: 0.5, color: '#ff6b35' },
      siteB: { mean: 7.5, spread: 0.5, color: '#00d4ff' },
      siteC: { mean: 9.0, spread: 0.5, color: '#00ff88' }
    },
    'high-high': {
      // High between, high within - groups separated but with overlap
      siteA: { mean: 6.0, spread: 10.0, color: '#ff6b35' },
      siteB: { mean: 7.5, spread: 10.0, color: '#00d4ff' },
      siteC: { mean: 9.0, spread: 10.0, color: '#00ff88' }
    }
  };

  function generateData(config) {
    const n = 20; // samples per group
    const data = {};
    
    ['siteA', 'siteB', 'siteC'].forEach(site => {
      const cfg = config[site];
      const values = [];
      
      for (let i = 0; i < n; i++) {
        // Generate normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        values.push(cfg.mean + z * cfg.spread);
      }
      
      values.sort((a, b) => a - b);
      
      data[site] = {
        values: values,
        color: cfg.color,
        q1: d3.quantile(values, 0.25),
        median: d3.quantile(values, 0.5),
        q3: d3.quantile(values, 0.75),
        min: d3.min(values),
        max: d3.max(values)
      };
    });
    
    return data;
  }

  function drawChart() {
    const container = document.getElementById('anova-variance-chart');
    if (!container) return;
    
    // Clear existing
    d3.select(container).selectAll('*').remove();
    
    // Dimensions
    const width = 600;
    const height = 450;
    const margin = { top: 60, right: 50, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'rgba(0, 0, 0, 0.0)')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Get current data configuration
    const configKey = `${currentBetween}-${currentWithin}`;
    const config = dataConfigs[configKey];
    const data = generateData(config);
    
    // Scales
    const sites = ['siteA', 'siteB', 'siteC'];
    const siteLabels = ['Site A', 'Site B', 'Site C'];
    
    const xScale = d3.scaleBand()
      .domain(sites)
      .range([0, innerWidth])
      .padding(0.3);
    
    const allValues = sites.flatMap(site => data[site].values);
    const yScale = d3.scaleLinear()
      .domain([d3.min(allValues) - 0.5, d3.max(allValues) + 0.5])
      .range([innerHeight, 0])
      .nice();
    
    // Axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => siteLabels[i]);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(8);
    
    svg.append('g')
      .attr('class', 'd3-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);
    
    svg.append('g')
      .attr('class', 'd3-axis')
      .call(yAxis);
    
    // Axis labels
    svg.append('text')
      .attr('class', 'd3-axis-label d3-axis-label--small')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 50)
      .style('text-anchor', 'middle')
      .text('Sites');
    
    svg.append('text')
      .attr('class', 'd3-axis-label d3-axis-label--small')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -55)
      .style('text-anchor', 'middle')
      .text('Dissolved Oxygen (mg/L)');
    
    // Title showing current state
    svg.append('text')
      .attr('class', 'd3-chart-title d3-chart-title--small')
      .attr('x', innerWidth / 2)
      .attr('y', -35)
      .style('text-anchor', 'middle')
      .text(`Between: ${currentBetween.toUpperCase()} | Within: ${currentWithin.toUpperCase()}`);
    
    // Calculate F-ratio for display
    const grandMean = d3.mean(allValues);
    const ssBetween = sites.reduce((sum, site) => {
      const siteMean = d3.mean(data[site].values);
      return sum + data[site].values.length * Math.pow(siteMean - grandMean, 2);
    }, 0);
    const ssWithin = sites.reduce((sum, site) => {
      const siteMean = d3.mean(data[site].values);
      return sum + data[site].values.reduce((s, v) => s + Math.pow(v - siteMean, 2), 0);
    }, 0);
    const msBetween = ssBetween / 2;
    const msWithin = ssWithin / (allValues.length - 3);
    const fRatio = msBetween / msWithin;
    
    svg.append('text')
      .attr('class', 'd3-chart-subtitle')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(`F-ratio ≈ ${fRatio.toFixed(2)}`);
    
    // Draw boxplots for each site
    sites.forEach(site => {
      const siteData = data[site];
      const x = xScale(site);
      const boxWidth = xScale.bandwidth();
      
      const iqr = siteData.q3 - siteData.q1;
      const whiskerMin = Math.max(siteData.min, siteData.q1 - 1.5 * iqr);
      const whiskerMax = Math.min(siteData.max, siteData.q3 + 1.5 * iqr);
      
      // Whiskers
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(whiskerMin))
        .attr('y2', yScale(siteData.q1))
        .attr('stroke', siteData.color)
        .attr('stroke-width', 2);
      
      svg.append('line')
        .attr('x1', x + boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(siteData.q3))
        .attr('y2', yScale(whiskerMax))
        .attr('stroke', siteData.color)
        .attr('stroke-width', 2);
      
      // Whisker caps
      [whiskerMin, whiskerMax].forEach(val => {
        svg.append('line')
          .attr('x1', x + boxWidth / 2 - 15)
          .attr('x2', x + boxWidth / 2 + 15)
          .attr('y1', yScale(val))
          .attr('y2', yScale(val))
          .attr('stroke', siteData.color)
          .attr('stroke-width', 2);
      });
      
      // Box (IQR)
      svg.append('rect')
        .attr('x', x + 5)
        .attr('y', yScale(siteData.q3))
        .attr('width', boxWidth - 10)
        .attr('height', yScale(siteData.q1) - yScale(siteData.q3))
        .attr('fill', siteData.color)
        .attr('fill-opacity', 0.3)
        .attr('stroke', siteData.color)
        .attr('stroke-width', 2);
      
      // Median line
      svg.append('line')
        .attr('x1', x + 5)
        .attr('x2', x + boxWidth - 5)
        .attr('y1', yScale(siteData.median))
        .attr('y2', yScale(siteData.median))
        .attr('stroke', siteData.color)
        .attr('stroke-width', 3);
      
      // Individual points
      siteData.values.forEach(val => {
        svg.append('circle')
          .attr('cx', x + boxWidth / 2 + (Math.random() - 0.5) * (boxWidth - 20))
          .attr('cy', yScale(val))
          .attr('r', 2.5)
          .attr('fill', siteData.color)
          .attr('opacity', 0.6);
      });
    });
    
    // Overall mean line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(grandMean))
      .attr('y2', yScale(grandMean))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.5);
  }

  function updateChart(between, within) {
    currentBetween = between;
    currentWithin = within;
    drawChart();
  }

  function initControls() {
    const container = document.getElementById('anova-variance-controls');
    if (!container) return;
    
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(0,100,200,0.2); padding: 15px; border-radius: 8px;">
          <div style="color: #00d4ff; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
            Between-Group Variance
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="between-low" class="variance-btn active" style="flex: 1; padding: 10px; background: #00d4ff; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
              LOW
            </button>
            <button id="between-high" class="variance-btn" style="flex: 1; padding: 10px; background: rgba(0,212,255,0.3); color: #00d4ff; border: 2px solid #00d4ff; border-radius: 4px; cursor: pointer; font-weight: bold;">
              HIGH
            </button>
          </div>
        </div>
        
        <div style="background: rgba(200,100,0,0.2); padding: 15px; border-radius: 8px;">
          <div style="color: #ff6b35; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
            Within-Group Variance
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="within-low" class="variance-btn active" style="flex: 1; padding: 10px; background: #ff6b35; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
              LOW
            </button>
            <button id="within-high" class="variance-btn" style="flex: 1; padding: 10px; background: rgba(255,107,53,0.3); color: #ff6b35; border: 2px solid #ff6b35; border-radius: 4px; cursor: pointer; font-weight: bold;">
              HIGH
            </button>
          </div>
        </div>
        
        <div style="background: rgba(0,255,136,0.2); padding: 12px; border-radius: 8px; border-left: 4px solid #00ff88;">
          <div style="color: #008f4cff; font-size: 14px; font-weight: bold; margin-bottom: 5px;">💡 Interpretation:</div>
          <div id="interpretation-text" style="color: #008f4cff; font-size: 20px;">
            Low between + Low within: Groups overlap, hard to distinguish
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('between-low').addEventListener('click', () => {
      setActiveButton('between', 'low');
      updateChart('low', currentWithin);
      updateInterpretation();
    });
    
    document.getElementById('between-high').addEventListener('click', () => {
      setActiveButton('between', 'high');
      updateChart('high', currentWithin);
      updateInterpretation();
    });
    
    document.getElementById('within-low').addEventListener('click', () => {
      setActiveButton('within', 'low');
      updateChart(currentBetween, 'low');
      updateInterpretation();
    });
    
    document.getElementById('within-high').addEventListener('click', () => {
      setActiveButton('within', 'high');
      updateChart(currentBetween, 'high');
      updateInterpretation();
    });
  }

  function setActiveButton(type, level) {
    const prefix = type === 'between' ? 'between' : 'within';
    const color = type === 'between' ? '#00d4ff' : '#ff6b35';
    
    ['low', 'high'].forEach(l => {
      const btn = document.getElementById(`${prefix}-${l}`);
      if (l === level) {
        btn.style.background = color;
        btn.style.color = '#000';
        btn.style.border = 'none';
      } else {
        btn.style.background = `rgba(${type === 'between' ? '0,212,255' : '255,107,53'},0.3)`;
        btn.style.color = color;
        btn.style.border = `2px solid ${color}`;
      }
    });
  }

  function updateInterpretation() {
    const interpretations = {
      'low-low': 'Groups overlap significantly - difficult to detect differences (F ≈ 1)',
      'low-high': 'High noise within groups - differences hard to detect despite some separation',
      'high-low': '✓ Clear separation! Groups well-distinguished with minimal overlap (F >> 1)',
      'high-high': 'Groups hardly separated due to large noise'
    };
    
    const key = `${currentBetween}-${currentWithin}`;
    const text = document.getElementById('interpretation-text');
    if (text) {
      text.textContent = interpretations[key];
    }
  }

  function init() {
    initControls();
    drawChart();
    updateInterpretation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Redraw on slide change
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'anova1-basic-idea') {
        setTimeout(init, 200);
      }
    });
  }
})();
