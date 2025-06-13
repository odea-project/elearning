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

        const yMin = Math.min(...yData_1);
        const yMax = Math.max(...yData_1);
        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets, 800, 400, 0, 2 * Math.PI, yMin, yMax
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
            divID, dataSets, 800, 350, 0, 2 * Math.PI, -6, 30
        );
        Reveal.layout();
    });
})();

(function () {
    const divTimeID = "chart_fft7";
    const divFreqID = "chart_fft8";
    const sectionID = "frequency-filtering-4";
    const n = 256;

    // x-Achse Zeit von 0…2π
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);
    // Frequenz-Achse Bins 0…N/2-1
    const freqAxis = Array(n / 2).fill().map((_, i) => i);

    // Initiale Peak-Breite
    let peakWidth = 0.5;
    // Basis-Signal (mit variablem Peak)
    let yDataBase = mathUtils.addGaussianPeak(xData, 3, 20, peakWidth);

    // Anzahl der FFT-Bins
    const N = n;

    // Filter-Funktion
    function applyFilter(cutoff, Y_fft) {
        return Y_fft.map(([re, im], i) =>
            (i > cutoff && i < N - cutoff) ? [0, 0] : [re, im]
        );
    }

    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        // Default-Cutoff
        const defaultCutoff = 128;

        // --- Initiale Berechnungen ---
        // FFT auf Basis-Signal
        const Y_base = mathUtils.fft(yDataBase.map(v => [v, 0]));
        // Gefiltertes IFFT
        const yFiltInit = mathUtils.ifft(
            applyFilter(defaultCutoff, Y_base)
        ).map(([re]) => re);

        // Spektren (Magnitude, halbes Spektrum)
        const magOrigInit = Y_base.map(([re, im]) => Math.hypot(re, im)).slice(0, N/2);
        const Yf_init    = applyFilter(defaultCutoff, Y_base);
        const magFiltInit = Yf_init.map(([re, im]) => Math.hypot(re, im)).slice(0, N/2);

        // --- 1) Zeit-Domain Plot (chart_fft7) ---
        const dataSetsTime = [
            {
                data: mathUtils.createXYData(xData, yDataBase),
                options: { key: "Original Signal", curve: d3.curveNatural, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 }
            },
            {
                data: mathUtils.createXYData(xData, yFiltInit),
                options: { key: "Filtered Signal", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 2.5 }
            }
        ];
        const allYTime = yDataBase.concat(yFiltInit);
        const { fig: figTime, lines: linesTime } = plotUtils.drawPixelChart(
            divTimeID, dataSetsTime,
            400, 200,
            0, 2 * Math.PI,
            Math.min(...allYTime), Math.max(...allYTime)
        );

        // --- 2) Frequenz-Domain Plot (chart_fft8) ---
        const dataSetsFreq = [
            {
                data: mathUtils.createXYData(freqAxis, magOrigInit),
                options: { key: "Original Spectrum",   curve: d3.curveLinear, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 }
            },
            {
                data: mathUtils.createXYData(freqAxis, magFiltInit),
                options: { key: "Filtered Spectrum",   curve: d3.curveLinear, lineColor: "#F0F", pointColor: "none", lineWidth: 2.5 }
            }
        ];
        const maxMag = Math.max(d3.max(magOrigInit), d3.max(magFiltInit));
        const { fig: figFreq, lines: linesFreq } = plotUtils.drawPixelChart(
            divFreqID, dataSetsFreq,
            400, 200,
            0, (freqAxis.length - 1)/2,
            0, maxMag
        );

        Reveal.layout();

        // DOM: Slider + Labels
        const sliderCut  = document.getElementById("frequencyFilterSlider3");
        const labelCut   = document.getElementById("frequencyFilterValue3");
        const sliderPeak = document.getElementById("peakWidthSlider");
        const labelPeak  = document.getElementById("peakWidthValue");

        // Line-Generatoren (jeweils für die beiden Plots)
        const lineTimeGen = d3.line()
            .x(d => figTime.xScale(d.x))
            .y(d => figTime.yScale(d.y))
            .curve(d3.curveNatural);

        const lineFreqGen = d3.line()
            .x(d => figFreq.xScale(d.x))
            .y(d => figFreq.yScale(d.y))
            .curve(d3.curveLinear);

        // Gemeinsame Update-Funktion
        function updatePlot() {
            // --- 1) Original-Zeit mit neuem Peak ---
            peakWidth = +sliderPeak.value;
            labelPeak.textContent = peakWidth.toFixed(2);
            yDataBase = mathUtils.addGaussianPeak(xData, 3, 20, peakWidth);
            linesTime["Original Signal"]
                .datum(mathUtils.createXYData(xData, yDataBase))
                .attr("d", lineTimeGen);

            // --- 2) Gefiltertes Zeit-Signal via FFT/Filter/IFFT ---
            const cutoff = +sliderCut.value;
            labelCut.textContent = cutoff.toFixed(0);
            const Y_new = mathUtils.fft(yDataBase.map(v => [v, 0]));
            const Yf_new = applyFilter(cutoff, Y_new);
            const yFilt = mathUtils.ifft(Yf_new).map(([re]) => re);
            linesTime["Filtered Signal"]
                .datum(mathUtils.createXYData(xData, yFilt))
                .attr("d", lineTimeGen);

            // --- 3) Frequenzspektrum neu berechnen und plotten ---
            const magOrig = Y_new.map(([re, im]) => Math.hypot(re, im)).slice(0, N/2);
            const magFilt = Yf_new.map(([re, im]) => Math.hypot(re, im)).slice(0, N/2);

            linesFreq["Original Spectrum"]
                .datum(mathUtils.createXYData(freqAxis, magOrig))
                .attr("d", lineFreqGen);

            linesFreq["Filtered Spectrum"]
                .datum(mathUtils.createXYData(freqAxis, magFilt))
                .attr("d", lineFreqGen);
        }

        // Slider-Listener
        sliderCut .addEventListener("input", updatePlot);
        sliderPeak.addEventListener("input", updatePlot);

        // Initiales Update
        updatePlot();
    });
})();

(function () {
    let divID = "chart_fft9";
    let sectionID = "frequency-filtering-5";
    let myFig = null;
    let axesAlready = false;

    const n = 256;
    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);

    // zusammengesetztes Signal cumulativ sum of random numbers
    let yData_1 = Array.from({ length: n }, () => Math.random() - 0.5);
    yData_1 = mathUtils.calcCumulativeSum(yData_1);
    // add peak to yData_1
    const yData_2 = mathUtils.addGaussianPeak(xData,3, 20, 0.1);
    yData_1 = yData_1.map((y, i) => y + yData_2[i]); // add peak to random walk
    yData_1 = yData_1.map((y, i) => y + Math.random() * 5); // add noise

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
    let cutoffFrequency = 20;

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
            divID, dataSets, 800, 350, 0, 2 * Math.PI, -6, 30
        );
        Reveal.layout();
    });
})();