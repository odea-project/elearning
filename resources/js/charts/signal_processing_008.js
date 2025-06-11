/* ----------------------------*/
/* SIGNAL PROCESSING CHART 005 */
/* ----------------------------*/
(function () {
    let divID = "chart_smoothing_tradeoff";
    let sectionID = "trade-off-in-smoothing";
    let myFig = null;
    let axesAlready = false;
    const n = 500;
    let kernel_halfWidth = 1; // Kernel-Halbbreite
    let kernel_fullWidth = 2 * kernel_halfWidth + 1; // Kernel-Gesamtbreite
    // Kernel erstellen (boxcar)
    const kernel = Array(kernel_fullWidth).fill(1 / kernel_fullWidth);
    const kernel2 = Array(kernel_fullWidth).fill(1 / 50);
    const xData = mathUtils.linspace(0, 5, n);
    let yData_1 = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
    // add some noise
    let noise_1 = Array.from({ length: n }, () => (Math.random() - 0.5) * 0.5);
    yData_1 = yData_1.map((y, i) => y + noise_1[i]);
    // Faltung des Signals mit dem Kernel
    const yData_1_smoothed = mathUtils.convolution(yData_1, kernel);
    const yData_1_smoothed2 = mathUtils.convolution(yData_1, kernel2);
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_1_smoothed = mathUtils.createXYData(xData, yData_1_smoothed);
    const xyData_1_smoothed2 = mathUtils.createXYData(xData, yData_1_smoothed2);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 } },
        { data: xyData_1_smoothed, options: { key: "signal1_smoothed", curve: d3.curveNatural, lineColor: "rgba(255, 0, 0, 0.7)", pointColor: "none", lineWidth: 4.5 } },
        { data: xyData_1_smoothed2, options: { key: "signal1_smoothed2", curve: d3.curveNatural, lineColor: "rgba(0, 0, 255, 0.7)", pointColor: "none", lineWidth: 4.5 } }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 400, 0, 5, -0.5, 1.5
        );
        Reveal.layout();
    });
})();
