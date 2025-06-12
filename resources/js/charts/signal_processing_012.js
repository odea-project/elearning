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
    let frequency2 = 5;
    let frequency3 = 100;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    let yData_1 = xData.map(x => Math.cos(frequency1 * x) );
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency3 * xData[i]) ); // Interferenz hinzufügen
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
    let frequency2 = 5;
    let frequency3 = 100;
    const xData = mathUtils.linspace(0, 2*Math.PI, n);
    let yData_1 = xData.map(x => Math.cos(frequency1 * x) );
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]) ); // Interferenz hinzufügen
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency3 * xData[i]) ); // Interferenz hinzufügen
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

(function () {
    let divID = "chart_fft3";
    let sectionID = "frequency-filtering-1";
    let myFig = null;
    let axesAlready = false;

    const n = 256;
    // Beispiel-Sinuskomponenten
    const frequency1 = 5;
    const frequency2 = 5;
    const frequency3 = 100;

    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);

    // zusammengesetztes Signal
    let yData_1 = xData.map(x => Math.cos(frequency1 * x));
    yData_1 = yData_1.map((y, i) => y + Math.cos(frequency2 * xData[i]));
    yData_1 = yData_1.map((y, i) => y + 3 * Math.cos(frequency3 * xData[i]));

    // FFT vorbereiten (Complex-Array)
    const yData_1_complex = yData_1.map(y => [y, 0]);
    const yData_1_fft = mathUtils.fft(yData_1_complex);
    const N = yData_1_fft.length; // == n

    // Magnitude für Plot (nur bis N/2)
    const magnitude = yData_1_fft.map(([re, im]) => Math.hypot(re, im));
    const halfMag = magnitude.slice(0, N / 2);
    const freqAxis = Array(halfMag.length).fill().map((_, i) => i);
    const fftXY = mathUtils.createXYData(freqAxis, halfMag);

    // Initialer Cutoff (Index)
    let cutoffFrequency = 128;

    // Funktion für Filter und IFFT
    function applyFilter(cutoff) {
        // FFT spiegelnd filtern: Bins i ∈ (cutoff, N-cutoff) → 0
        const filteredFFT = yData_1_fft.map(([re, im], i) => {
            if (i > cutoff && i < N - cutoff) {
                return [0, 0];
            } else {
                return [re, im];
            }
        });

        // zurücktransformieren
        let yData_ifft = mathUtils.ifft(filteredFFT);

        // falls mathUtils.ifft nicht normiert, hier noch durch N teilen:
        // yData_ifft = yData_ifft.map(([re, im]) => [re / N, im / N]);

        // nur Realteil
        return yData_ifft.map(([re, im]) => re);
    }

    // Initiales gefiltertes Signal
    const yData_ifft_init = applyFilter(cutoffFrequency);
    const xyData_ifft = mathUtils.createXYData(xData, yData_ifft_init);

    // Datensätze fürs Plotten
    const dataSets = [
        {
            data: mathUtils.createXYData(xData, yData_1),
            options: {
                key: "Original Signal",
                curve: d3.curveNatural,
                lineColor: "#FFF",
                pointColor: "none",
                lineWidth: 1.5
            }
        },
        {
            data: xyData_ifft,
            options: {
                key: "Filtered Signal",
                curve: d3.curveNatural,
                lineColor: "#F0F",
                pointColor: "none",
                lineWidth: 2.5
            }
        }
    ];

    // Listener für Slidewechsel
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 400, 200, 0, 2 * Math.PI, -6, 6
        );
        Reveal.layout();

        const spanSlider = document.getElementById("frequencyFilterSlider");
        const spanValue = document.getElementById("frequencyFilterValue");

        // D3-Generator für den gefilterten Plot
        const filteredLineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveNatural);

        // Slider-Event
        spanSlider.addEventListener("input", () => {
            cutoffFrequency = parseFloat(spanSlider.value);
            spanValue.textContent = cutoffFrequency.toFixed(0);

            const newY = applyFilter(cutoffFrequency);
            const newXY = mathUtils.createXYData(xData, newY);

            lines["Filtered Signal"]
                .datum(newXY)
                .attr("d", filteredLineGen);
        });
    });
})();

(function () {
    const divID = "chart_fft4";
    const sectionID = "frequency-filtering-1";

    const n = 256;
    const frequency1 = 5;
    const frequency2 = 5;
    const frequency3 = 100;

    // x-Achse für Zeit (0…2π) und für Frequenz (Bins 0…N/2-1)
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);
    const freqAxis = Array(n / 2).fill().map((_, i) => i);

    // zusammengesetztes Signal
    let y = xData.map(x => Math.cos(frequency1 * x));
    y = y.map((v, i) => v + Math.cos(frequency2 * xData[i]));
    y = y.map((v, i) => v + 3 * Math.cos(frequency3 * xData[i]));

    // FFT des Originals
    const yComplex = y.map(v => [v, 0]);
    const Y = mathUtils.fft(yComplex);
    const N = Y.length; // == n

    // Start-Magnitude (halbes Spektrum)
    const magOrig = Y.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

    // Filterfunktion (gibt gefiltertes FFT-Array zurück)
    function applyFilter(cutoff) {
        return Y.map(([re, im], i) => {
            // alle Bins zwischen cutoff und N-cutoff auf null
            return (i > cutoff && i < N - cutoff) ? [0, 0] : [re, im];
        });
    }

    // Default Cutoff
    let cutoff = 128;

    // Gefiltertes Spektrum initial
    let Yf = applyFilter(cutoff);
    let magFilt = Yf.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

    // Datensätze für das Plot
    const dataSets = [
        {
            data: mathUtils.createXYData(freqAxis, magOrig),
            options: {
                key: "Original Spectrum",
                curve: d3.curveLinear,
                lineColor: "#FFF",
                pointColor: "none",
                lineWidth: 1.5
            }
        },
        {
            data: mathUtils.createXYData(freqAxis, magFilt),
            options: {
                key: "Filtered Spectrum",
                curve: d3.curveLinear,
                lineColor: "#F0F",
                pointColor: "none",
                lineWidth: 1.5
            }
        }
    ];

    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        // y-Achse auf max aus beiden Spektren skalieren
        const yMax = d3.max(magOrig.concat(magFilt));

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets,
            400, 200,          // Breite, Höhe
            0, freqAxis.length - 1,  // x-Achse: Frequenzbins
            0, yMax           // y-Achse: Magnitude
        );
        Reveal.layout();

        const slider = document.getElementById("frequencyFilterSlider");
        const label = document.getElementById("frequencyFilterValue");

        // Line-Generator für Spektren
        const lineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveLinear);

        // Slider-Event: nur gefiltertes Spektrum updaten
        slider.addEventListener("input", () => {
            cutoff = +slider.value;
            label.textContent = cutoff.toFixed(0);

            // Neues gefiltertes FFT → Magnitude → halbes Spektrum
            Yf = applyFilter(cutoff);
            magFilt = Yf.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

            // Update der Linie
            const newData = mathUtils.createXYData(freqAxis, magFilt);
            lines["Filtered Spectrum"]
                .datum(newData)
                .attr("d", lineGen);
        });
    });
})();

(function () {
    let divID = "chart_fft5";
    let sectionID = "frequency-filtering-2";
    let myFig = null;
    let axesAlready = false;

    const n = 256;
    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);

    // zusammengesetztes Signal cumulativ sum of random numbers
    let yData_1 = Array.from({ length: n }, () => Math.random() - 0.5);
    yData_1 = mathUtils.calcCumulativeSum(yData_1);

    // FFT vorbereiten (Complex-Array)
    const yData_1_complex = yData_1.map(y => [y, 0]);
    const yData_1_fft = mathUtils.fft(yData_1_complex);
    const N = yData_1_fft.length; // == n

    // Magnitude für Plot (nur bis N/2)
    const magnitude = yData_1_fft.map(([re, im]) => Math.hypot(re, im));
    const halfMag = magnitude.slice(0, N / 2);
    const freqAxis = Array(halfMag.length).fill().map((_, i) => i);
    const fftXY = mathUtils.createXYData(freqAxis, halfMag);

    // Initialer Cutoff (Index)
    let cutoffFrequency = 10;

    // Funktion für Filter und IFFT
    function applyFilter(cutoff) {
        // FFT spiegelnd filtern: Bins i ∈ (cutoff, N-cutoff) → 0
        const filteredFFT = yData_1_fft.map(([re, im], i) => {
            if (i > cutoff && i < N - cutoff) {
                return [0, 0];
            } else {
                return [re, im];
            }
        });

        // zurücktransformieren
        let yData_ifft = mathUtils.ifft(filteredFFT);

        // falls mathUtils.ifft nicht normiert, hier noch durch N teilen:
        // yData_ifft = yData_ifft.map(([re, im]) => [re / N, im / N]);

        // nur Realteil
        return yData_ifft.map(([re, im]) => re);
    }

    // Initiales gefiltertes Signal
    const yData_ifft_init = applyFilter(cutoffFrequency);
    const xyData_ifft = mathUtils.createXYData(xData, yData_ifft_init);

    // Datensätze fürs Plotten
    const dataSets = [
        {
            data: mathUtils.createXYData(xData, yData_1),
            options: {
                key: "Original Signal",
                curve: d3.curveNatural,
                lineColor: "#FFF",
                pointColor: "none",
                lineWidth: 1.5
            }
        },
        {
            data: xyData_ifft,
            options: {
                key: "Filtered Signal",
                curve: d3.curveNatural,
                lineColor: "#F0F",
                pointColor: "none",
                lineWidth: 2.5
            }
        }
    ];

    // Listener für Slidewechsel
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 800, 400, 0, 2 * Math.PI, -6, 6
        );
        Reveal.layout();
    });
})();

(function () {
    let divID = "chart_fft6";
    let sectionID = "frequency-filtering-3";
    let myFig = null;
    let axesAlready = false;

    const n = 256;
    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);

    // zusammengesetztes Signal cumulativ sum of random numbers
    let yData_1 = Array.from({ length: n }, () => Math.random() - 0.5);
    yData_1 = mathUtils.calcCumulativeSum(yData_1);
    // add peak to yData_1
    const yData_2 = mathUtils.addGaussianPeak(xData,3, 20, 0.03);
    yData_1 = yData_1.map((y, i) => y + yData_2[i]); // add peak to random walk

    // FFT vorbereiten (Complex-Array)
    const yData_1_complex = yData_1.map(y => [y, 0]);
    const yData_1_fft = mathUtils.fft(yData_1_complex);
    const N = yData_1_fft.length; // == n

    // Magnitude für Plot (nur bis N/2)
    const magnitude = yData_1_fft.map(([re, im]) => Math.hypot(re, im));
    const halfMag = magnitude.slice(0, N / 2);
    const freqAxis = Array(halfMag.length).fill().map((_, i) => i);
    const fftXY = mathUtils.createXYData(freqAxis, halfMag);

    // Initialer Cutoff (Index)
    let cutoffFrequency = 10;

    // Funktion für Filter und IFFT
    function applyFilter(cutoff) {
        // FFT spiegelnd filtern: Bins i ∈ (cutoff, N-cutoff) → 0
        const filteredFFT = yData_1_fft.map(([re, im], i) => {
            if (i > cutoff && i < N - cutoff) {
                return [0, 0];
            } else {
                return [re, im];
            }
        });

        // zurücktransformieren
        let yData_ifft = mathUtils.ifft(filteredFFT);

        // falls mathUtils.ifft nicht normiert, hier noch durch N teilen:
        // yData_ifft = yData_ifft.map(([re, im]) => [re / N, im / N]);

        // nur Realteil
        return yData_ifft.map(([re, im]) => re);
    }

    // Initiales gefiltertes Signal
    const yData_ifft_init = applyFilter(cutoffFrequency);
    const xyData_ifft = mathUtils.createXYData(xData, yData_ifft_init);

    // Datensätze fürs Plotten
    const dataSets = [
        {
            data: mathUtils.createXYData(xData, yData_1),
            options: {
                key: "Original Signal",
                curve: d3.curveNatural,
                lineColor: "#FFF",
                pointColor: "none",
                lineWidth: 1.5
            }
        },
        {
            data: xyData_ifft,
            options: {
                key: "Filtered Signal",
                curve: d3.curveNatural,
                lineColor: "#F0F",
                pointColor: "none",
                lineWidth: 2.5
            }
        }
    ];

    // Listener für Slidewechsel
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 800, 300, 0, 2 * Math.PI, -6, 30
        );
        Reveal.layout();
    });
})();

(function () {
    const divID = "chart_fft7";
    const sectionID = "frequency-filtering-4";
    const n = 256;

    // x-Achse (Zeit von 0…2π)
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);

    // Initiale Peak-Breite
    let peakWidth = 0.5;
    // Basis-Signal (mit variablem Peak)
    let yDataBase = mathUtils.addGaussianPeak(xData, 3, 20, peakWidth);

    // Einmalige FFT auf dem Basis-Signal
    const Y_base = mathUtils.fft(yDataBase.map(y => [y, 0]));
    const N = Y_base.length;

    // Filter-Funktion: filtern zwischen cutoff und N-cutoff
    function applyFilter(cutoff, Y_fft) {
        return Y_fft.map(([re, im], i) =>
            (i > cutoff && i < N - cutoff) ? [0, 0] : [re, im]
        );
    }

    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        // Default-Cutoff
        const defaultCutoff = 128;

        // Ersten Filter-Call und IFFT durchführen
        const yFiltInit = mathUtils.ifft(
            applyFilter(defaultCutoff, Y_base)
        ).map(([re]) => re);

        // DataSets initial
        const dataSets = [
            {
                data: mathUtils.createXYData(xData, yDataBase),
                options: {
                    key: "Original Signal",
                    curve: d3.curveNatural,
                    lineColor: "#FFF",
                    pointColor: "none",
                    lineWidth: 1.5
                }
            },
            {
                data: mathUtils.createXYData(xData, yFiltInit),
                options: {
                    key: "Filtered Signal",
                    curve: d3.curveNatural,
                    lineColor: "#F0F",
                    pointColor: "none",
                    lineWidth: 2.5
                }
            }
        ];

        // Chart zeichnen – y auf Min/Max von Original+Gefiltert skalieren
        const allY = yDataBase.concat(yFiltInit);
        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets,
            400, 200,             // Breite, Höhe
            0, 2 * Math.PI,       // x von 0…2π
            Math.min(...allY),    // y-Min
            Math.max(...allY)     // y-Max
        );
        Reveal.layout();

        // Slider-DOM-Elemente
        const sliderCut = document.getElementById("frequencyFilterSlider3");
        const labelCut  = document.getElementById("frequencyFilterValue3");
        const sliderPeak= document.getElementById("peakWidthSlider");
        const labelPeak = document.getElementById("peakWidthValue");

        // Line-Generator
        const lineGen = d3.line()
            .x(d => fig.xScale(d.x))
            .y(d => fig.yScale(d.y))
            .curve(d3.curveNatural);

        // Gemeinsame Update-Funktion
        function updatePlot() {
            // --- Original mit neuem Peak ---
            peakWidth = +sliderPeak.value;
            labelPeak.textContent = peakWidth.toFixed(2);

            yDataBase = mathUtils.addGaussianPeak(xData, 3, 20, peakWidth);

            lines["Original Signal"]
                .datum(mathUtils.createXYData(xData, yDataBase))
                .attr("d", lineGen);
            // --- Filter-Signal ---
            // TODO HIER MUSS DIE FFT FILTER IFFT durchgeführt werden
            const cutoff = +sliderCut.value;
            labelCut.textContent = cutoff.toFixed(0);

            const yFilt = mathUtils.ifft(
                applyFilter(cutoff, Y_base)
            ).map(([re]) => re);

            lines["Filtered Signal"]
                .datum(mathUtils.createXYData(xData, yFilt))
                .attr("d", lineGen);
        }

        // beide Slider auf ein und die gleiche Update-Funktion legen
        sliderCut.addEventListener("input",  updatePlot);
        sliderPeak.addEventListener("input", updatePlot);

        // Initial einmal aufrufen, damit Label & Plot synchron sind
        updatePlot();
    });
})();


// (function () {
//     const divID = "chart_fft8";
//     const sectionID = "frequency-filtering-4";

//     const n = 256;
//     const frequency1 = 5;
//     const frequency2 = 5;
//     const frequency3 = 100;

//     // x-Achse für Zeit (0…2π) und für Frequenz (Bins 0…N/2-1)
//     const xData = mathUtils.linspace(0, 2 * Math.PI, n);
//     const freqAxis = Array(n / 2).fill().map((_, i) => i);

//     // zusammengesetztes Signal
//     let y = mathUtils.addGaussianPeak(xData, 3, 20, 0.5);

//     // FFT des Originals
//     const yComplex = y.map(v => [v, 0]);
//     const Y = mathUtils.fft(yComplex);
//     const N = Y.length; // == n

//     // Start-Magnitude (halbes Spektrum)
//     const magOrig = Y.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

//     // Filterfunktion (gibt gefiltertes FFT-Array zurück)
//     function applyFilter(cutoff) {
//         return Y.map(([re, im], i) => {
//             // alle Bins zwischen cutoff und N-cutoff auf null
//             return (i > cutoff && i < N - cutoff) ? [0, 0] : [re, im];
//         });
//     }

//     // Default Cutoff
//     let cutoff = 128;

//     // Gefiltertes Spektrum initial
//     let Yf = applyFilter(cutoff);
//     let magFilt = Yf.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

//     // Datensätze für das Plot
//     const dataSets = [
//         {
//             data: mathUtils.createXYData(freqAxis, magOrig),
//             options: {
//                 key: "Original Spectrum",
//                 curve: d3.curveLinear,
//                 lineColor: "#FFF",
//                 pointColor: "none",
//                 lineWidth: 1.5
//             }
//         },
//         {
//             data: mathUtils.createXYData(freqAxis, magFilt),
//             options: {
//                 key: "Filtered Spectrum",
//                 curve: d3.curveLinear,
//                 lineColor: "#F0F",
//                 pointColor: "none",
//                 lineWidth: 1.5
//             }
//         }
//     ];

//     Reveal.addEventListener('slidechanged', event => {
//         if (event.currentSlide.id !== sectionID) return;

//         // y-Achse auf max aus beiden Spektren skalieren
//         const yMax = d3.max(magOrig.concat(magFilt));

//         const { fig, lines } = plotUtils.drawPixelChart(
//             divID, dataSets,
//             400, 200,          // Breite, Höhe
//             0, freqAxis.length - 1,  // x-Achse: Frequenzbins
//             0, yMax           // y-Achse: Magnitude
//         );
//         Reveal.layout();

//         const slider = document.getElementById("frequencyFilterSlider3");
//         const label = document.getElementById("frequencyFilterValue3");
//         const slider2 = document.getElementById("peakWidthSlider");
//         const label2 = document.getElementById("peakWidthValue");

//         // Line-Generator für Spektren
//         const lineGen = d3.line()
//             .x(d => fig.xScale(d.x))
//             .y(d => fig.yScale(d.y))
//             .curve(d3.curveLinear);

//         // Slider-Event: nur gefiltertes Spektrum updaten
//         slider.addEventListener("input", () => {
//             cutoff = +slider.value;
//             label.textContent = cutoff.toFixed(0);

//             // Neues gefiltertes FFT → Magnitude → halbes Spektrum
//             Yf = applyFilter(cutoff);
//             magFilt = Yf.map(([re, im]) => Math.hypot(re, im)).slice(0, N / 2);

//             // Update der Linie
//             const newData = mathUtils.createXYData(freqAxis, magFilt);
//             lines["Filtered Spectrum"]
//                 .datum(newData)
//                 .attr("d", lineGen);
//         });
//         // Slider-Event für Peak-Breite
//         slider2.addEventListener("input", () => {
//             const peakWidth = parseFloat(slider2.value);
//             label2.textContent = peakWidth.toFixed(2);

//             // Neuen Peak generieren
//             const newPeak = mathUtils.addGaussianPeak(xData, 3, 20, peakWidth);
//             const newY = y.map((v, i) => v + newPeak[i]);
//             const newXY = mathUtils.createXYData(xData, newY);

//             lines["Original Signal"]
//                 .datum(newXY)
//                 .attr("d", lineGen);
//         });
//     });
// })();