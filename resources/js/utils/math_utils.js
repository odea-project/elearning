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
        derivative: function (arr, dx = 1) {
            // Berechnet die Ableitung eines Arrays
            if (arr.length === 0) return [];
            return arr.map((val, i) => i === 0 ? 0 : (val - arr[i - 1]) / dx);
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
        transpose: function(A) {
            return A[0].map((_, i) => A.map(row => row[i]));
        },
        matMul: function(A, B) {
            const result = Array(A.length).fill().map(() => Array(B[0].length).fill(0));
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B[0].length; j++) {
                    for (let k = 0; k < B.length; k++) {
                        result[i][j] += A[i][k] * B[k][j];
                    }
                }
            }
            return result;
        },
        invertMatrix: function(M) {
            const n = M.length;
            // Augment mit Einheitsmatrix
            const A = M.map((row, i) => [...row, ...Array.from({length: n}, (_, j) => i === j ? 1 : 0)]);
            // Gauß-Jordan
            for (let i = 0; i < n; i++) {
                // Pivot
                let pivot = A[i][i];
                if (pivot === 0) {
                    // suche Zeile zum Tauschen
                    let swap = i + 1;
                    while (swap < n && A[swap][i] === 0) swap++;
                    if (swap === n) throw new Error("Matrix ist singulär");
                    [A[i], A[swap]] = [A[swap], A[i]];
                    pivot = A[i][i];
                }
                // Normieren
                for (let j = 0; j < 2*n; j++) A[i][j] /= pivot;
                // Eliminieren
                for (let k = 0; k < n; k++) {
                    if (k === i) continue;
                    const factor = A[k][i];
                    for (let j = 0; j < 2*n; j++) {
                        A[k][j] -= factor * A[i][j];
                    }
                }
            }
            // Extrahiere inverse
            return A.map(row => row.slice(n));
        },
        savitzkyGolayKernel: function(halfWindow, polyOrder) {
            const winSize = 2 * halfWindow + 1;
            if (polyOrder > 2 * halfWindow) {
                throw new Error("polyOrder muss ≤ 2*halfWindow sein");
            }
            // Designmatrix A: Zeilen i = -halfWindow ... +halfWindow, Spalten j = i^j
            const A = [];
            for (let i = -halfWindow; i <= halfWindow; i++) {
                const row = [];
                for (let j = 0; j <= polyOrder; j++) {
                    row.push(Math.pow(i, j));
                }
                A.push(row);
            }
            // pseudoinverse: (A^T A)^(-1) A^T
            const AT = this.transpose(A);
            const ATA = this.matMul(AT, A);
            const ATAinv = this.invertMatrix(ATA);
            const pseudoInv = this.matMul(ATAinv, AT);
            // Für Glättung (0. Ableitung) nehmen wir die erste Zeile von pseudoInv
            // (das entspricht e_0^T * (A^T A)^(-1) A^T)
            const kernel = pseudoInv[0];
            // optional: Normieren, so dass Summe der Koeffizienten = 1
            const sum = kernel.reduce((s, v) => s + v, 0);
            return kernel.map(v => v / sum);
        },
        savitzkyGolayKernel1derivative: function(halfWindow, polyOrder) {
            const winSize = 2 * halfWindow + 1;
            if (polyOrder > 2 * halfWindow) {
                throw new Error("polyOrder muss ≤ 2*halfWindow sein");
            }
            // Designmatrix A: Zeilen i = -halfWindow ... +halfWindow, Spalten j = i^j
            const A = [];
            for (let i = -halfWindow; i <= halfWindow; i++) {
                const row = [];
                for (let j = 0; j <= polyOrder; j++) {
                    row.push(Math.pow(i, j));
                }
                A.push(row);
            }
            // pseudoinverse: (A^T A)^(-1) A^T
            const AT = this.transpose(A);
            const ATA = this.matMul(AT, A);
            const ATAinv = this.invertMatrix(ATA);
            const pseudoInv = this.matMul(ATAinv, AT);
            // Für 1. Ableitung nehmen wir die zweite Zeile von pseudoInv
            // (das entspricht e_1^T * (A^T A)^(-1) A^T)
            const kernel = pseudoInv[1];
            // optional: Normieren, so dass Summe der Koeffizienten = 1
            return kernel;
        },
        fft: function(signal) {
            const N = signal.length;
            if (N <= 1) return signal;

            const even = this.fft(signal.filter((_, i) => i % 2 === 0));
            const odd  = this.fft(signal.filter((_, i) => i % 2 !== 0));

            const T = Array(N / 2).fill().map((_, k) => {
                const exp = -2 * Math.PI * k / N;
                return this.mathMultiplyComplex(odd[k], [Math.cos(exp), Math.sin(exp)]);
            });

            const result = [];
            for (let k = 0; k < N / 2; k++) {
                result[k] = this.mathAddComplex(even[k], T[k]);
                result[k + N / 2] = this.mathSubtractComplex(even[k], T[k]);
            }

            return result;
        },
        ifft: function(signal) {
            const N = signal.length;
            if (N <= 1) return signal;

            // Konjugieren der komplexen Zahlen
            const conjugated = signal.map(([re, im]) => [re, -im]);
            const transformed = this.fft(conjugated);
            // Konjugieren zurück und normalisieren
            return transformed.map(([re, im]) => [re / N, -im / N]);
        },
        mathAddComplex: function([a, b], [c, d]) {
            return [a + c, b + d];
        },
        mathSubtractComplex: function([a, b], [c, d]) {
            return [a - c, b - d];
        },
        mathMultiplyComplex: function ([a, b], [c, d]) {
            return [a * c - b * d, a * d + b * c];
        }
    };
})(window);