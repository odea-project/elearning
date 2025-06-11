/* ----------------------------*/
/* SIGNAL PROCESSING CHART 009 */
/* ----------------------------*/
(function () {
    let divID = "chart_sg_derivative";
    let sectionID = "savitzky-golay-1st-derivative";
    let myFig = null;
    let axesAlready = false;
    const n = 500;
    let kernel_halfWidth = 20; // Kernel-Halbbreite
    let polynomialOrder = 3; // Ordnung des Polynoms
    // Kernel erstellen 
    let kernel = mathUtils.savitzkyGolayKernel1derivative(kernel_halfWidth, polynomialOrder);
    // Erstellen der x-Daten
    const xData = mathUtils.linspace(0, 5, n);
    let yData_1 = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
    // add some noise
    let noise_1 = Array.from({ length: n }, () => (Math.random() - 0.5) * 0.2);
    yData_1 = yData_1.map((y, i) => y + noise_1[i]);
    // add some drift
    yData_1 = yData_1.map((y, i) => y + 1 * (i / n));
    // Faltung des Signals mit dem Kernel
    const scalingFactor = 10;
    const yData_1_smoothed = mathUtils.convolution(yData_1, kernel)
        .map(y => y * scalingFactor);
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_1_smoothed = mathUtils.createXYData(xData, yData_1_smoothed);
    const yData_1_derivative = mathUtils.derivative(yData_1);
    const xyData_1_derivative = mathUtils.createXYData(xData, yData_1_derivative);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 } },
        { data: xyData_1_derivative, options: { key: "signal1_derivative", curve: d3.curveNatural, lineColor: "rgba(0, 0, 255, 0.5)", pointColor: "none", lineWidth: 2.5 } },
        { data: xyData_1_smoothed, options: { key: "signal1_smoothed", curve: d3.curveNatural, lineColor: "#F00", pointColor: "none", lineWidth: 2.5 } },
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
