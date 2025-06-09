/* ----------------------------*/
/* SIGNAL PROCESSING CHART 004 */
/* ----------------------------*/
(function () {
    let divID = "chart-data-processing-004";
    let sectionID = "data-standardization";
    let myFig = null;
    let axesAlready = false;
    const n = 100;
    const xData = mathUtils.linspace(0, 5, n);
    let yData_1 = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
    let yData_2 = mathUtils.addGaussianPeak(xData, 2.5, 0.3, 0.25);
    // add some noise
    let noise_1 = Array.from({ length: n }, () => (Math.random() - 0.5) * 0.1);
    let noise_2 = Array.from({ length: n }, () => (Math.random() - 0.5) * 0.1);
    // add outlier to y_Data_1
    yData_1[78] = -0.7; // outlier
    yData_1 = yData_1.map((y, i) => y + noise_1[i]);
    yData_2 = yData_2.map((y, i) => y + noise_2[i]);
    // Normalisierung der Daten
    const yData_1_norm = mathUtils.normalize(yData_1);
    const yData_2_norm = mathUtils.normalize(yData_2);
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_2 = mathUtils.createXYData(xData, yData_2);
    const xyData_1_norm = mathUtils.createXYData(xData, yData_1_norm);
    const xyData_2_norm = mathUtils.createXYData(xData, yData_2_norm);
    // Standardisierung der Daten
    const yData_1_std = mathUtils.zScore(yData_1);
    const yData_2_std = mathUtils.zScore(yData_2);
    const xyData_1_std = mathUtils.createXYData(xData, yData_1_std);
    const xyData_2_std = mathUtils.createXYData(xData, yData_2_std);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5 } },
        { data: xyData_2, options: { key: "signal2", curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5 } },
        { data: xyData_1_norm, options: { key: "signal1_norm", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: { "visibility": "hidden" } } },
        { data: xyData_2_norm, options: { key: "signal2_norm", curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: { "visibility": "hidden" } } },
        { data: xyData_1_std, options: { key: "signal1_std", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5, style: { "visibility": "hidden" } } },
        { data: xyData_2_std, options: { key: "signal2_std", curve: d3.curveNatural, lineColor: "#0F0", pointColor: "none", lineWidth: 1.5, style: { "visibility": "hidden" } } }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 400, 0, 5, -2, 3.5
        );
        Reveal.layout();
        const toggleNormalization = document.getElementById("toggle-normalize-2");
        const toggleStandardization = document.getElementById("toggle-standardize");
        const toggleOriginal = document.getElementById("toggle-original");
        // Reset des Toggles
        toggleNormalization.checked = false;
        toggleStandardization.checked = false;
        toggleOriginal.checked = true;
        // Event-Listener für den Toggle Normalisierung
        toggleNormalization.addEventListener("change", () => {
            if (toggleNormalization.checked) {
                // set other toggles to false
                toggleStandardization.checked = false;
                toggleOriginal.checked = false;
                // Normalisierung aktivieren
                lines.signal1.style("visibility", "hidden");
                lines.signal2.style("visibility", "hidden");
                lines.signal1_norm.style("visibility", "visible");
                lines.signal2_norm.style("visibility", "visible");
                lines.signal1_std.style("visibility", "hidden");
                lines.signal2_std.style("visibility", "hidden");
            }
        });
        // Event-Listener für den Toggle Standardisierung
        toggleStandardization.addEventListener("change", () => {
            if (toggleStandardization.checked) {
                // set other toggles to false
                toggleNormalization.checked = false;
                toggleOriginal.checked = false;
                // Standardisierung aktivieren
                lines.signal1.style("visibility", "hidden");
                lines.signal2.style("visibility", "hidden");
                lines.signal1_norm.style("visibility", "hidden");
                lines.signal2_norm.style("visibility", "hidden");
                lines.signal1_std.style("visibility", "visible");
                lines.signal2_std.style("visibility", "visible");
            }
        });
        // Event-Listener für den Toggle Original
        toggleOriginal.addEventListener("change", () => {
            if (toggleOriginal.checked) {
                // set other toggles to false
                toggleNormalization.checked = false;
                toggleStandardization.checked = false;
                // Originaldaten anzeigen
                lines.signal1.style("visibility", "visible");
                lines.signal2.style("visibility", "visible");
                lines.signal1_norm.style("visibility", "hidden");
                lines.signal2_norm.style("visibility", "hidden");
                lines.signal1_std.style("visibility", "hidden");
                lines.signal2_std.style("visibility", "hidden");
            }
        });
    });
})();
