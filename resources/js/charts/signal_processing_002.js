/* ----------------------------*/
/* SIGNAL PROCESSING CHART 001 */
/* ----------------------------*/
(function () {
  let divID = "chart-data-processing-007";
  let sectionID = "test-floor";
  let myFig = null;
  let axesAlready = false;
  const xData = mathUtils.linspace(0, 5, 100);
  const yData_analyte = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
  const yData_interference = mathUtils.addGaussianPeak(xData, 3.0, 0.5, 0.5);
  const xyData_analyte = mathUtils.createXYData(xData, yData_analyte);
  const xyData_interference = mathUtils.createXYData(xData, yData_interference);
  const yData_total = yData_analyte;
  const xyData_total = mathUtils.createXYData(xData, yData_total);
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: xyData_analyte, options: { key: "analyteSignal", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5") } } },
    { data: xyData_interference, options: { key: "interferenceSignal", curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: { "stroke-dasharray": ("5,5"), "visibility": "hidden" } } },
    { data: xyData_total, options: { key: "totalSignal", curve: d3.curveNatural, lineColor: "#00F", pointColor: "none" } }
  ];
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id === sectionID) {
      const { fig, lines } = plotUtils.drawPixelChart(divID, dataSets, 500, 400);
      Reveal.layout();
      const toggleInterference = document.getElementById("toggle-interference");
      toggleInterference.checked = false;
      toggleInterference.addEventListener("change", function () {
        if (this.checked) {
          lines.interferenceSignal.style("visibility", "visible");
        } else {
          lines.interferenceSignal.style("visibility", "hidden");
        }
      });
    }
  });
})();