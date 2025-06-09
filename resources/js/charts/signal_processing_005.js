/* ----------------------------*/
/* SIGNAL PROCESSING CHART 005 */
/* ----------------------------*/
(function () {
    let divID = "chart_smoothing1";
    let sectionID = "kernels-for-smoothing";
    let myFig = null;
    let axesAlready = false;
    const n = 100;
    let kernel_halfWidth = 1; // Kernel-Halbbreite
    let kernel_fullWidth = 2 * kernel_halfWidth + 1; // Kernel-Gesamtbreite
    // Kernel erstellen (boxcar)
    const kernel = Array(kernel_fullWidth).fill(1 / kernel_fullWidth);
    const xData = mathUtils.linspace(0, 5, n);
    let yData_1 = mathUtils.addGaussianPeak(xData, 2.5, 1.0, 0.25);
    // add some noise
    let noise_1 = Array.from({ length: n }, () => (Math.random() - 0.5) * 0.2);
    yData_1 = yData_1.map((y, i) => y + noise_1[i]);
    // Faltung des Signals mit dem Kernel
    const yData_1_smoothed = mathUtils.convolution(yData_1, kernel);
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_1_smoothed = mathUtils.createXYData(xData, yData_1_smoothed);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 } },
        { data: xyData_1_smoothed, options: { key: "signal1_smoothed", curve: d3.curveNatural, lineColor: "#F00", pointColor: "none", lineWidth: 2.5 } }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 400, 0, 5, -0.5, 1.5
        );
        Reveal.layout();
        // Event-Listener für den Kernel-Halbbreiten-Slider (id=spanSlider) with (id=spanValue)
        const spanSlider = document.getElementById("spanSlider");
        const spanValue = document.getElementById("spanValue");
        // create line generator for smoothed signal
        const smoothedLineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveNatural);
        spanSlider.addEventListener("input", () => {
            kernel_halfWidth = parseInt(spanSlider.value, 10);
            kernel_fullWidth = 2 * kernel_halfWidth + 1;
            // Kernel neu erstellen
            const newKernel = Array(kernel_fullWidth).fill(1 / kernel_fullWidth);
            // Faltung des Signals mit dem neuen Kernel
            const yData_1_smoothed_new = mathUtils.convolution(yData_1, newKernel);
            const xyData_1_smoothed_new = mathUtils.createXYData(xData, yData_1_smoothed_new);  
            // Update der Daten im Chart
            lines.signal1_smoothed
                .datum(xyData_1_smoothed_new)
                .attr("d", smoothedLineGen);
            // Update des Textes im Slider
            spanValue.textContent = ` ${kernel_halfWidth}`;
        });
    });
})();
