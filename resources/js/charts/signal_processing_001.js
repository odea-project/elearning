/* ----------------------------*/
/* SIGNAL PROCESSING CHART 001 */
/* ----------------------------*/
(function() {
  let divID = "chart-data-processing-001";
  let sectionID = "what-is-data-signal-processing";
  let myFig = null;
  let axesAlready = false;
  const xData = mathUtils.linspace(0, 5, 100);
  const yData_analyte = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
  const xyData_analyte = mathUtils.createXYData(xData, yData_analyte);
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: xyData_analyte, options: { curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none" } },
  ]; 
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id === sectionID) {
      plotUtils.drawPixelChart(divID, dataSets, 500, 400);
      Reveal.layout();
    }
  });
  // Falls die dynamische Folie schon aktuell ist, Diagramm sofort zeichnen
  if (Reveal.getCurrentSlide() && Reveal.getCurrentSlide().id === sectionID) {
    plotUtils.drawPixelChart(divID, dataSets, 500, 400);
    Reveal.layout();
  }
})();
/* ----------------------------*/
/* SIGNAL PROCESSING CHART 002 */
/* ----------------------------*/
(function() {
  let divID = "chart-data-processing-002";
  let sectionID = "what-is-data-signal-processing";
  let myFig = null;
  let axesAlready = false;
  const xData = mathUtils.linspace(0, 5, 100);
  const yData_analyte = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
  const yData_interference = mathUtils.addGaussianPeak(xData, 3.0, 0.5, 0.5);
  const xyData_analyte = mathUtils.createXYData(xData, yData_analyte);
  const xyData_interference = mathUtils.createXYData(xData, yData_interference);
  const yData_total = yData_analyte.map((val, i) => val + yData_interference[i]);
  const xyData_total = mathUtils.createXYData(xData, yData_total);
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: xyData_analyte, options: { curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: {"stroke-dasharray": ("5,5")} } },
    { data: xyData_interference, options: { curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: {"stroke-dasharray": ("5,5")} } },
    { data: xyData_total, options: { curve: d3.curveNatural, lineColor: "#00F", pointColor: "none" } }
  ]; 
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id === sectionID) {
      plotUtils.drawPixelChart(divID, dataSets, 500, 400);
      Reveal.layout();
    }
  });
  // Falls die dynamische Folie schon aktuell ist, Diagramm sofort zeichnen
  if (Reveal.getCurrentSlide() && Reveal.getCurrentSlide().id === sectionID) {
    plotUtils.drawPixelChart(divID, dataSets, 500, 400);
    Reveal.layout();
  }
})();
/* ----------------------------*/
/* SIGNAL PROCESSING CHART 003 */
/* ----------------------------*/
(function() {
  let divID = "chart-data-processing-003";
  let sectionID = "what-is-data-signal-processing";
  let myFig = null;
  let axesAlready = false;
  const xData = mathUtils.linspace(0, 5, 100);
  const yData_analyte = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
  const yData_interference = mathUtils.addGaussianPeak(xData, 3.0, 0.5, 0.5);
  const yData_suppression = mathUtils.addGaussianPeak(xData, 2.5, -0.5, 0.75);
  const xyData_analyte = mathUtils.createXYData(xData, yData_analyte);
  const xyData_interference = mathUtils.createXYData(xData, yData_interference);
  const xyData_suppression = mathUtils.createXYData(xData, yData_suppression);
  let yData_total = yData_analyte.map((val, i) => val + yData_interference[i]);
  yData_total = yData_total.map((val, i) => val + yData_suppression[i]);
  const xyData_total = mathUtils.createXYData(xData, yData_total);
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: xyData_analyte, options: { curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: {"stroke-dasharray": ("5,5")} } },
    { data: xyData_interference, options: { curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: {"stroke-dasharray": ("5,5")} } },
    { data: xyData_suppression, options: { curve: d3.curveNatural, lineColor: "#F00", pointColor: "none", lineWidth: 1.5, style: {"stroke-dasharray": ("5,5")} } },
    { data: xyData_total, options: { curve: d3.curveNatural, lineColor: "#00F", pointColor: "none" } }
  ]; 
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id === sectionID) {
      plotUtils.drawPixelChart(divID, dataSets, 500, 400);
      Reveal.layout();
    }
  });
  // Falls die dynamische Folie schon aktuell ist, Diagramm sofort zeichnen
  if (Reveal.getCurrentSlide() && Reveal.getCurrentSlide().id === sectionID) {
    plotUtils.drawPixelChart(divID, dataSets, 500, 400);
    Reveal.layout();
  }
})();