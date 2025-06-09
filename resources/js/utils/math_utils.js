(function (global) {
    global.mathUtils = {
        linspace: function (start, stop, num = 50) {
            // Erzeugt ein Array mit 'num' gleichmäßig verteilten Werten zwischen 'start' und 'stop'
            const step = (stop - start) / (num - 1);
            return Array.from({ length: num }, (_, i) => start + i * step);
        },
        mean: function (arr) {
            // Berechnet den Durchschnittswert eines Arrays
            if (arr.length === 0) return 0;
            const sum = arr.reduce((acc, val) => acc + val, 0);
            return sum / arr.length;
        },
        median: function (arr) {
            // Berechnet den Median eines Arrays
            if (arr.length === 0) return 0;
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        },
        stdDev: function (arr) {
            // Berechnet die Standardabweichung eines Arrays
            if (arr.length === 0) return 0;
            const mean = this.mean(arr);
            const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
            return Math.sqrt(variance);
        },
        sum: function (arr) {
            // Berechnet die Summe der Werte in einem Array
            return arr.reduce((acc, val) => acc + val, 0);
        },
        normalize: function (arr) {
            // Normalisiert ein Array auf den Bereich [0, 1]
            if (arr.length === 0) return [];
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map(val => (val - min) / (max - min));
        },
        zScore: function (arr) {
            // Berechnet den Z-Score eines Arrays
            if (arr.length === 0) return [];
            const mean = this.mean(arr);
            const stdDev = this.stdDev(arr);
            return arr.map(val => (val - mean) / stdDev);
        },
        addGaussianNoise: function (arr, mean = 0, stdDev = 1) {
            // Fügt einem Array Gaußschen Rauschen hinzu
            return arr.map(val => val + (mean + stdDev * this.randomGaussian()));
        },
        addGaussianPeak: function (arr, peakPosition, peakHeight, peakWidth) {
            // Fügt einem Array einen Gaußschen Peak hinzu
            return arr.map((val, index) => {
                const distance = val - peakPosition;
                return peakHeight * Math.exp(-0.5 * Math.pow(distance / peakWidth, 2));
            });
        },
        createXYData: function (xValues, yValues) {
            // Kombiniert zwei Arrays in ein Array von Objekten {x: <xValue>, y: <yValue>}
            if (xValues.length !== yValues.length) {
                throw new Error("xValues and yValues must have the same length");
            }
            return xValues.map((x, i) => ({ x: x, y: yValues[i] }));
        },
        calcCumulativeSum: function (arr) {
            // Berechnet die kumulative Summe eines Arrays
            return arr.reduce((acc, val, i) => {
                acc.push((acc[i - 1] || 0) + val);
                return acc;
            }, []);
        },
        convolution: function(signal, kernel) {
            const kLen = kernel.length;
            const half = Math.floor(kLen / 2);
            return signal.map((_, i) => {
                let sum = 0;
                for (let j = 0; j < kLen; j++) {
                    const idx = i + j - half;
                    if (idx >= 0 && idx < signal.length) {
                        // Flip den Kernel: kernel[kLen-1-j]
                        sum += signal[idx] * kernel[kLen - 1 - j];
                    }
                }
                return sum;
            });
        },
    };
})(window);