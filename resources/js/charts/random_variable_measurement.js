/* -------------------------------------*/
/* RANDOM VARIABLE MEASUREMENT CHART   */
/* -------------------------------------*/
(function () {
  // Wait for dependencies to be available
  function initChart() {
    // Check if required dependencies are loaded
    if (typeof d3 === 'undefined' || 
        typeof mathUtils === 'undefined' || 
        typeof plotUtils === 'undefined' ||
        typeof Reveal === 'undefined') {
      setTimeout(initChart, 100);
      return;
    }
    
    let divID = "chart-measurement-signal";
    let sectionID = "measuring-sample";
    let myFig = null;
    
    const n = 100;
    const xData = mathUtils.linspace(0, 10, n);
    
    // Ideal constant signal (e.g., true Fe concentration = 5.0 mg/L)
    const idealValue = 5.0;
    const yData_ideal = Array(n).fill(idealValue);
    
    // Noise generator function
    function generateNoise() {
      return Array.from({length: n}, () => (Math.random() - 0.5) * 0.3);
    }
    
    let yData_noise = generateNoise();
    let yData_real = yData_ideal.map((v, i) => v + yData_noise[i]);
    
    const xyData_ideal = mathUtils.createXYData(xData, yData_ideal);
    let xyData_real = mathUtils.createXYData(xData, yData_real);
    
    // Data sets for plotting
    const dataSets = [
      { 
        data: xyData_ideal, 
        options: { 
          key: "idealSignal", 
          curve: d3.curveLinear, 
          lineColor: "#00ff00", 
          pointColor: "none", 
          lineWidth: 2,
          style: { "stroke-dasharray": "5,5" } 
        } 
      },
      { 
        data: xyData_real, 
        options: { 
          key: "realSignal", 
          curve: d3.curveNatural, 
          lineColor: "#ff6b6b", 
          pointColor: "none", 
          lineWidth: 2,
          style: { "visibility": "hidden" }
        } 
      }
    ];
    
    // Listen for slide changes
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id !== sectionID) return;
    
    const { fig, lines } = plotUtils.drawPixelChart(
      divID, dataSets, 600, 400, 0, 10, 3, 7
    );
    
    Reveal.layout();

    const toggleReal = document.getElementById("toggle-real-measurement");
    
    // Reset toggle
    if (toggleReal) {
      toggleReal.checked = false;
    }

    // Timer handle for continuous noise updates
    let noiseTimer = null;

    // Line generator for real signal
    const realLineGen = d3.line()
      .x(d => fig.xScale(d.x))
      .y(d => fig.yScale(d.y))
      .curve(d3.curveNatural);

    // Toggle event handler
    if (toggleReal) {
      toggleReal.addEventListener("change", () => {
        if (toggleReal.checked) {
          // Show real signal line
          lines.realSignal.style("visibility", "visible");
          
          // Start continuous noise updates
          noiseTimer = d3.interval(() => {
            // Generate new noise and update real signal
            yData_noise = generateNoise();
            yData_real = yData_ideal.map((v, i) => v + yData_noise[i]);
            xyData_real = mathUtils.createXYData(xData, yData_real);
            
            // Update the line
            lines.realSignal
              .datum(xyData_real)
              .attr("d", realLineGen);
          }, 150); // Update every 150ms
        } else {
          // Hide real signal
          lines.realSignal.style("visibility", "hidden");
          
          // Stop noise updates
          if (noiseTimer) {
            noiseTimer.stop();
            noiseTimer = null;
          }
        }
      });
    }
  });
  }
  
  // Start initialization
  initChart();
})();
