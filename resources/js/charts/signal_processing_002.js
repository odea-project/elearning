/* ----------------------------*/
/* SIGNAL PROCESSING CHART 001 */
/* ----------------------------*/
(function () {
  let divID = "chart-data-processing-007";
  let sectionID = "test-floor";
  let myFig = null;
  let axesAlready = false;
  const n = 100;
  const xData = mathUtils.linspace(0, 5, n);
  const yData_analyte = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
  const yData_interference = mathUtils.addGaussianPeak(xData, 3.0, 0.5, 0.5);
  const yData_suppression = mathUtils.addGaussianPeak(xData, 2.5, -0.5, 0.75);
  const yData_drift = mathUtils.addGaussianPeak(xData, 7, 6, 2);
  let yData_noise = Array.from({length: n}, () => (Math.random()- 0.5) * 0.1);
  yData_noise = mathUtils.calcCumulativeSum(yData_noise);
  const xyData_analyte = mathUtils.createXYData(xData, yData_analyte);
  const xyData_interference = mathUtils.createXYData(xData, yData_interference);
  const xyData_suppression = mathUtils.createXYData(xData, yData_suppression);
  const xyData_drift = mathUtils.createXYData(xData, yData_drift);
  const xyData_noise = mathUtils.createXYData(xData, yData_noise);
  let yData_total = yData_analyte;
  let xyData_total = mathUtils.createXYData(xData, yData_total);
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: xyData_analyte, options: { key: "analyteSignal", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5") } } },
    { data: xyData_interference, options: { key: "interferenceSignal", curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5"), "visibility": "hidden" } } },
    { data: xyData_suppression, options: { key: "suppressionSignal", curve: d3.curveNatural, lineColor: "#F00", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5"), "visibility": "hidden" } } },
    { data: xyData_drift, options: { key: "driftSignal", curve: d3.curveNatural, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5"), "visibility": "hidden" } } },
    { data: xyData_noise, options: { key: "noiseSignal", curve: d3.curveNatural, lineColor: "#FF0", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5"), "visibility": "hidden" } } },
    // Total signal, initially only analyte signal
    { data: xyData_total, options: { key: "totalSignal", curve: d3.curveNatural, lineColor: "#FFF", pointColor: "none" } }
  ];
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
  if (event.currentSlide.id !== sectionID) return;
  
  const { fig, lines } = plotUtils.drawPixelChart(
    divID, dataSets, 500, 400, 0, 5, -1, 5
  );
  Reveal.layout();

  const toggleInterference = document.getElementById("toggle-interference");
  const toggleSuppression  = document.getElementById("toggle-suppression");
  const toggleDrift        = document.getElementById("toggle-drift");
  const toggleNoise        = document.getElementById("toggle-noise");

  // Reset aller Toggles
  [ toggleInterference, toggleSuppression, toggleDrift, toggleNoise ]
    .forEach(t => t.checked = false);

  // Generator für die Total-Linie
  const totalLineGen = d3.line()
    .x(d => fig.xScale(d.x))
    .y(d => fig.yScale(d.y))
    .curve(d3.curveNatural);

  // Timer-Handle
  let noiseTimer = null;

  // Gemeinsame Update-Funktion
  function updateTotalSignal() {
    const newData = calculateTotalSignal();
    lines.totalSignal
      .datum(newData)
      .attr("d", totalLineGen);
  }

  // Event-Handler für die nicht-Noise-Toggles
  [ ["interference", toggleInterference],
    ["suppression",  toggleSuppression],
    ["drift",        toggleDrift] ]
    .forEach(([key, toggle]) => {
      toggle.addEventListener("change", () => {
        lines[ key + "Signal" ]
          .style("visibility", toggle.checked ? "visible" : "hidden");
        updateTotalSignal();
      });
    });

  // Speziell für Noise: starten/stoppen eines Intervalls
  toggleNoise.addEventListener("change", () => {
    if (toggleNoise.checked) {
      // alle x-Werte konstant, nur das Rauschen neu bei jedem Tick
      noiseTimer = d3.interval(() => {
        updateTotalSignal();
      }, 150 /* ms zwischen Updates */);
    } else {
      if (noiseTimer) noiseTimer.stop();
      updateTotalSignal(); // einmalig ohne Noise neu zeichnen
    }
  });
});

  function calculateTotalSignal() {
  const interferenceVisible = document.getElementById("toggle-interference").checked;
  const suppressionVisible  = document.getElementById("toggle-suppression").checked;
  const driftVisible        = document.getElementById("toggle-drift").checked;
  const noiseVisible        = document.getElementById("toggle-noise").checked;

  // Starte mit dem reinen Analyte
  let y = yData_analyte.slice();

  if (interferenceVisible) {
    y = y.map((v,i) => v + yData_interference[i]);
  }
  if (suppressionVisible) {
    y = y.map((v,i) => v + yData_suppression[i]);
  }
  if (driftVisible) {
    y = y.map((v,i) => v + yData_drift[i]);
  }
  if (noiseVisible) {
    // frisches Zufallsrauschen → kumulierte Summe
    const rawNoise = Array.from({length: n},
      () => (Math.random() - 0.5) * 0.1
    );
    const cumNoise = mathUtils.calcCumulativeSum(rawNoise);
    y = y.map((v,i) => v + cumNoise[i]);
  }

  return mathUtils.createXYData(xData, y);
}

})();