/* -------------------------------------*/
/* HARMONIC MEAN FLOW VISUALIZATION    */
/* -------------------------------------*/
(function () {
  // Wait for dependencies to be available
  function initChart() {
    // Check if required dependencies are loaded
    if (typeof d3 === 'undefined' || 
        typeof Reveal === 'undefined') {
      setTimeout(initChart, 100);
      return;
    }
    
    let divID = "chart-harmonic-flow";
    let sectionID = "harmonic-mean-problem";
    
    // Listen for slide changes
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id !== sectionID) return;
      
      // Clear any existing SVG
      d3.select(`#${divID}`).selectAll("*").remove();
      
      const width = 800;
      const height = 400;
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      // Create SVG
      const svg = d3.select(`#${divID}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      // Define sections
      const section1Length = innerWidth / 2;
      const section2Length = innerWidth / 2;
      
      // Draw river sections
      g.append("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 40)
        .attr("width", section1Length)
        .attr("height", 80)
        .attr("fill", "#4a90e2")
        .attr("opacity", 0.3)
        .attr("stroke", "#2a5a92")
        .attr("stroke-width", 2);
      
      g.append("rect")
        .attr("x", section1Length)
        .attr("y", innerHeight / 2 - 40)
        .attr("width", section2Length)
        .attr("height", 80)
        .attr("fill", "#e24a4a")
        .attr("opacity", 0.3)
        .attr("stroke", "#922a2a")
        .attr("stroke-width", 2);
      
      // Section labels
      g.append("text")
        .attr("x", section1Length / 2)
        .attr("y", innerHeight / 2 - 50)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Section 1: 10 m/s");
      
      g.append("text")
        .attr("x", section1Length + section2Length / 2)
        .attr("y", innerHeight / 2 - 50)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Section 2: 2 m/s");
      
      // Distance labels
      g.append("text")
        .attr("x", section1Length / 2)
        .attr("y", innerHeight / 2 + 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#9efcff")
        .attr("font-size", "14px")
        .text("Distance: 100m");
      
      g.append("text")
        .attr("x", section1Length + section2Length / 2)
        .attr("y", innerHeight / 2 + 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#9efcff")
        .attr("font-size", "14px")
        .text("Distance: 100m");
      
      // Create pollutant particle
      const particle = g.append("circle")
        .attr("cx", 0)
        .attr("cy", innerHeight / 2)
        .attr("r", 8)
        .attr("fill", "#ffff00")
        .attr("stroke", "#ff8800")
        .attr("stroke-width", 2);
      
      // Animation parameters
      const velocity1 = 10; // m/s
      const velocity2 = 2;  // m/s
      const distance = 100; // m per section
      
      const time1 = distance / velocity1; // 10 seconds
      const time2 = distance / velocity2; // 50 seconds
      const totalTime = time1 + time2;    // 60 seconds
      
      // Scale time for animation (1 real second = 1 animation second)
      const animationScale = 1000; // milliseconds per second
      
      // Timer display
      const timerText = g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#9efcff")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text("Time: 0.0s");
      
      // Position display
      const positionText = g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight - 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#9efcff")
        .attr("font-size", "16px")
        .text("Position: 0m");
      
      // Theoretical position lines (initially hidden)
      const arithmeticLine = g.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", innerHeight / 2 - 50)
        .attr("y2", innerHeight / 2 + 50)
        .attr("stroke", "#00ff00")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0);
      
      const arithmeticLabel = g.append("text")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#00ff00")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("opacity", 0)
        .text("Arithmetic (6 m/s)");
      
      const geometricLine = g.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", innerHeight / 2 - 50)
        .attr("y2", innerHeight / 2 + 50)
        .attr("stroke", "#ff00ff")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0);
      
      const geometricLabel = g.append("text")
        .attr("x", 0)
        .attr("y", innerHeight / 2 + 70)
        .attr("text-anchor", "middle")
        .attr("fill", "#ff00ff")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("opacity", 0)
        .text("Geometric (4.47 m/s)");
      
      // Toggle states
      let showArithmetic = false;
      let showGeometric = false;
      let isAnimating = false;
      let animationFrameId = null;
      
      // Toggle buttons
      const toggleArithmetic = document.getElementById("toggle-arithmetic-mean");
      const toggleGeometric = document.getElementById("toggle-geometric-mean");
      const startButton = document.getElementById("start-harmonic-animation");
      
      if (toggleArithmetic) {
        toggleArithmetic.checked = false;
        toggleArithmetic.addEventListener("change", () => {
          showArithmetic = toggleArithmetic.checked;
          arithmeticLine.attr("opacity", showArithmetic ? 0.8 : 0);
          arithmeticLabel.attr("opacity", showArithmetic ? 1 : 0);
        });
      }
      
      if (toggleGeometric) {
        toggleGeometric.checked = false;
        toggleGeometric.addEventListener("change", () => {
          showGeometric = toggleGeometric.checked;
          geometricLine.attr("opacity", showGeometric ? 0.8 : 0);
          geometricLabel.attr("opacity", showGeometric ? 1 : 0);
        });
      }
      
      // Animation function
      function animateParticle() {
        // Reset to start
        particle.attr("cx", 0);
        timerText.text("Time: 0.0s");
        positionText.text("Position: 0m");
        arithmeticLine.attr("x1", 0).attr("x2", 0);
        arithmeticLabel.attr("x", 0);
        geometricLine.attr("x1", 0).attr("x2", 0);
        geometricLabel.attr("x", 0);
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        isAnimating = true;
        if (startButton) {
          startButton.textContent = "⟳ Restart Animation";
        }
        
        const startTime = Date.now();
        
        function update() {
          const elapsed = (Date.now() - startTime) / animationScale;
          
          let currentX, currentDistance, currentTime;
          
          if (elapsed < time1) {
            // In section 1
            currentTime = elapsed;
            currentDistance = velocity1 * elapsed;
            currentX = (currentDistance / distance) * section1Length;
          } else if (elapsed < totalTime) {
            // In section 2
            const elapsedInSection2 = elapsed - time1;
            currentTime = elapsed;
            currentDistance = 100 + velocity2 * elapsedInSection2;
            currentX = section1Length + (velocity2 * elapsedInSection2 / distance) * section2Length;
          } else {
            // Animation complete
            currentTime = totalTime;
            currentDistance = 200;
            currentX = innerWidth;
            
            // Restart after a pause
            setTimeout(() => {
              particle.attr("cx", 0);
              animateParticle();
            }, 2000);
            
            timerText.text(`Time: ${totalTime.toFixed(1)}s (Total)`);
            positionText.text(`Position: 200m (End)`);
            return;
          }
          
          particle.attr("cx", currentX);
          timerText.text(`Time: ${currentTime.toFixed(1)}s`);
          positionText.text(`Position: ${currentDistance.toFixed(0)}m`);
          
          // Update theoretical positions
          if (showArithmetic) {
            const arithmeticDist = 6 * currentTime; // 6 m/s (arithmetic mean)
            const arithmeticX = Math.min(arithmeticDist / 200, 1) * innerWidth;
            arithmeticLine.attr("x1", arithmeticX).attr("x2", arithmeticX);
            arithmeticLabel.attr("x", arithmeticX);
          }
          
          if (showGeometric) {
            const geometricDist = 4.47 * currentTime; // 4.47 m/s (geometric mean)
            const geometricX = Math.min(geometricDist / 200, 1) * innerWidth;
            geometricLine.attr("x1", geometricX).attr("x2", geometricX);
            geometricLabel.attr("x", geometricX);
          }
          
          animationFrameId = requestAnimationFrame(update);
        }
        
        update();
      }
      
      // Start button handler
      if (startButton) {
        startButton.addEventListener("click", () => {
          animateParticle();
        });
      }
      
      Reveal.layout();
    });
  }
  
  // Start initialization
  initChart();
})();
