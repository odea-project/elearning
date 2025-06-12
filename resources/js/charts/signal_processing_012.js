/* ----------------------------*/
/* SIGNAL PROCESSING CHART 012 */
/* ----------------------------*/
(function () {
    let divID = "chart_fft1";
    let sectionID = "systematic-frequency-analysis";
    let myFig = null;
    let axesAlready = false;
    const n = 128;
    let frequency1 = 5;
    let frequency2 = 12;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    let yData_1 = xData.map(x => Math.cos(frequency1 * x) );
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    // Alle Datensätze in einem Array
    const dataSets = [
        { data: xyData_1, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 200, 0, 2*Math.PI, -3, 3
        );
        Reveal.layout();
    });
})();

(function () {
    let divID = "chart_fft2";
    let sectionID = "systematic-frequency-analysis";
    let myFig = null;
    let axesAlready = false;
    const n = 128;
    let frequency1 = 5;
    let frequency2 = 12;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    let yData_1 = xData.map(x => Math.cos(frequency1 * x) );
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
    yData_1_complex = yData_1.map(y => [y, 0]);
    yData_1_fft = mathUtils.fft(yData_1_complex);
    const magnitude = yData_1_fft.map(([re, im]) => Math.sqrt(re**2 + im**2));
    const halfMag = magnitude.slice(0, magnitude.length / 2);

    const freqAxis = Array(halfMag.length).fill().map((_, i) => i); // relative Frequenz
    const fftXY = mathUtils.createXYData(freqAxis, halfMag);

    const dataSets = [
        { data: fftXY, options: { key: "FFT", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5 } }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 200, 0, halfMag.length, -10, d3.max(halfMag)
        );
        Reveal.layout();
    });
})();
