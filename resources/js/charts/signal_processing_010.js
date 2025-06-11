/* ----------------------------*/
/* SIGNAL PROCESSING CHART 010 */
/* ----------------------------*/
(function () {
    let divID = "chart_axial";
    let sectionID = "denoising-fourier-transformation";
    let myFig = null;
    let axesAlready = false;
    const n = 100;
    let frequency = 10;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    const yData_1 = xData.map(x => Math.cos(frequency * x) );
    // Faltung des Signals mit dem Kernel
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 200, 0, 2*Math.PI, -1, 1, true, false
        );
        Reveal.layout();
        // hide axes
        const spanSlider = document.getElementById("slider_axial");
        const spanValue = document.getElementById("value_axial");
        const smoothedLineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveNatural);
        spanSlider.addEventListener("input", () => {
            frequency = parseFloat(spanSlider.value);
            spanValue.textContent = frequency.toFixed(2);
            // Neues Signal berechnen
            const yData_1_new = xData.map(x => Math.cos(frequency * x) );
            const xyData_1_new = mathUtils.createXYData(xData, yData_1_new);
            // Update der Daten im Chart
            lines.signal1
                .datum(xyData_1_new)
                .attr("d", smoothedLineGen);
        });
    });
})();

(function () {
    let divID = "chart_interference";
    let sectionID = "denoising-fourier-transformation";
    let myFig = null;
    let axesAlready = false;
    const n = 100;
    let frequency1 = 5;
    let frequency2 = 10;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    let yData_1 = xData.map(x => Math.cos(frequency1 * x) );
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
    // Faltung des Signals mit dem Kernel
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 200, 0, 2*Math.PI, -1, 1, true, false
        );
        Reveal.layout();
        // hide axes
        const spanSlider = document.getElementById("slider_interference_1");
        const spanValue = document.getElementById("value_interference_1");
        const spanSlider2 = document.getElementById("slider_interference_2");
        const spanValue2 = document.getElementById("value_interference_2");
        const smoothedLineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveNatural);
        spanSlider.addEventListener("input", () => {
            frequency1 = parseFloat(spanSlider.value);
            spanValue.textContent = frequency1.toFixed(2);
            // Neues Signal berechnen
            let yData_1_new = xData.map(x => Math.cos(frequency1 * x) );
            yData_1_new = yData_1_new.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
            const xyData_1_new = mathUtils.createXYData(xData, yData_1_new);
            // Update der Daten im Chart
            lines.signal1
                .datum(xyData_1_new)
                .attr("d", smoothedLineGen);
        });
        spanSlider2.addEventListener("input", () => {
            frequency2 = parseFloat(spanSlider2.value);
            spanValue2.textContent = frequency2.toFixed(2);
            // Neues Signal berechnen
            let yData_1_new = xData.map(x => Math.cos(frequency1 * x) )
            yData_1_new = yData_1_new.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
            const xyData_1_new = mathUtils.createXYData(xData, yData_1_new);
            // Update der Daten im Chart
            lines.signal1
                .datum(xyData_1_new)
                .attr("d", smoothedLineGen);
        });
    });
})();
