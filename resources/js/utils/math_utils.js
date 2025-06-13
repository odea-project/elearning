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
        },
        // distance functions
        euclideanDistance: function (a, b) {
            return Math.sqrt(a.reduce((acc, val, i) => acc + (val - b[i]) ** 2, 0));
        },

        manhattanDistance: function (a, b) {
            return a.reduce((acc, val, i) => acc + Math.abs(val - b[i]), 0);
        },

        pearsonCorrelation: function (a, b) {
            const meanA = a.reduce((acc, val) => acc + val, 0) / a.length;
            const meanB = b.reduce((acc, val) => acc + val, 0) / b.length;

            const num = a.reduce((acc, val, i) => acc + (val - meanA) * (b[i] - meanB), 0);
            const denA = Math.sqrt(a.reduce((acc, val) => acc + (val - meanA) ** 2, 0));
            const denB = Math.sqrt(b.reduce((acc, val) => acc + (val - meanB) ** 2, 0));

            return 1 - num / (denA * denB);
        },

        spearmanDistance: function (a, b) {
            const n = a.length;
            const rankA = a.map(val => a.filter(aVal => aVal < val).length + 1);
            const rankB = b.map(val => b.filter(bVal => bVal < val).length + 1);

            return 1 - 6 * a.reduce((acc, val, i) => acc + (rankA[i] - rankB[i]) ** 2, 0) / (n * (n ** 2 - 1));
        },

        cosineDistance: function (a, b) {
            const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
            const magA = Math.sqrt(a.reduce((acc, val) => acc + val ** 2, 0));
            const magB = Math.sqrt(b.reduce((acc, val) => acc + val ** 2, 0));

            return 1 - dotProduct / (magA * magB);
        },
        // create distance matrix
        createDistanceMatrix: function(data, distanceFunction) {
            const matrix = Array(data.length).fill(null).map(() => Array(data.length).fill(0));

            for (let i = 0; i < data.length; i++) {
                for (let j = i + 1; j < data.length; j++) {
                    const dist = distanceFunction(data[i], data[j]);
                    matrix[i][j] = dist;
                    matrix[j][i] = dist;
                }
            }

            return matrix;
        },
        // Generate linkage matrix for dendrogram based on distance matrix
        hierarchicalClustering: function (data, distanceFunction) {
            const matrix = createDistanceMatrix(data, distanceFunction);
            const clusters = data.map((_, i) => [i]);  // Start with each point as a separate cluster
            const linkageMatrix = [];

            while (clusters.length > 1) {
                let minDistance = Infinity;
                let mergeIndexA = -1;
                let mergeIndexB = -1;

                // Find the two closest clusters
                for (let i = 0; i < clusters.length; i++) {
                    for (let j = i + 1; j < clusters.length; j++) {
                        const dist = calculateClusterDistance(clusters[i], clusters[j], matrix);
                        if (dist < minDistance) {
                            minDistance = dist;
                            mergeIndexA = i;
                            mergeIndexB = j;
                        }
                    }
                }

                // Merge the two closest clusters
                const mergedCluster = clusters[mergeIndexA].concat(clusters[mergeIndexB]);
                clusters.splice(mergeIndexB, 1);  // Remove the second cluster
                clusters[mergeIndexA] = mergedCluster;  // Update the first cluster

                // Record the merge in the linkage matrix (structure: [index1, index2, distance, cluster size])
                linkageMatrix.push([mergeIndexA, mergeIndexB, minDistance, mergedCluster.length]);
            }

            return linkageMatrix;
        },

        // Calculate distance between two clusters
        calculateClusterDistance: function (clusterA, clusterB, matrix) {
            let minDistance = Infinity;
            for (let i of clusterA) {
                for (let j of clusterB) {
                    minDistance = Math.min(minDistance, matrix[i][j]);
                }
            }
            return minDistance;
        },

        dendrogram: function (data, options = {}) {
            const {
                width: width = 420,
                height: height = 320,
                hideLabels: hideLabels = false,
                paddingBottom: paddingBottom = hideLabels ? 20 : 200,
                innerHeight = height - paddingBottom,
                innerWidth = width - 10,
                paddingLeft = 30,
                h: cutHeight = undefined,
                yLabel: yLabel = "↑ Height",
                colors: colors = d3.schemeTableau10,
                fontFamily: fontFamily = "Inter, sans-serif",
                linkColor: linkColor = "white",
                fontSize: fontSize = 10,
                strokeWidth: strokeWidth = 3
            } = options;

            const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, innerHeight])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            var clusterLayout = d3.cluster().size([width - paddingLeft * 2, innerHeight]);

            const root = d3.hierarchy(data);
            const maxHeight = root.data.height;

            const yScaleLinear = d3
                .scaleLinear()
                .domain([0, maxHeight])
                .range([hideLabels ? innerHeight - 35 : innerHeight, 0]);

            const yAxisLinear = d3.axisLeft(yScaleLinear).tickSize(5);

            function transformY(data) {
                const height = hideLabels ? innerHeight - 15 : innerHeight;
                return height - (data.data.height / maxHeight) * height;
            }

            // traverse through first order children and assign colors
            if (cutHeight) {
                let curIndex = -1;
                root.each((child) => {
                    if (
                        child.data.height <= cutHeight &&
                        child.data.height > 0 &&
                        child.parent &&
                        !child.parent.color
                    ) {
                        curIndex++;
                        child.color = colors[curIndex];
                    } else if (child.parent && child.parent.color) {
                        child.color = child.parent.color;
                    }
                });
            }

            clusterLayout(root);

            // y-axis
            svg
                .append("g")
                .attr("transform", `translate(0, ${hideLabels ? 20 : 0})`)
                .append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${paddingLeft},${hideLabels ? 20 : 0})`)
                .call(yAxisLinear)
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                        .append("text")
                        .attr("x", -paddingLeft)
                        .attr("y", -20)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "start")
                        .style("font-family", fontFamily)
                        .text(yLabel)
                )
                .selectAll(".tick")
                .classed("baseline", (d) => d == 0)
                .style("font-size", `${fontSize}px`)
                .style("font-family", fontFamily);

            // Links
            // Links with configurable color and stroke width
            root.links().forEach((link) => {
                svg
                    .append("path")
                    .attr("class", "link")
                    .attr("stroke", link.source.color || options.linkColor || "#FFFFFF") // Default to white if no color specified
                    .attr("stroke-width", options.strokeWidth || 3.5) // Default to 1.5 if not specified
                    .attr("fill", "none")
                    .attr("transform", `translate(${paddingLeft}, ${options.hideLabels ? 20 : 0})`)
                    .attr("d", elbow(link));
            });


            // Nodes
            // Sample labels at the x-axis for each leaf node, rotated 90 degrees
            root.descendants().forEach((desc) => {
                if (desc.data.isLeaf && !options.hideLabels) {
                    svg.append("text")
                        .attr("x", desc.x + paddingLeft) // Horizontal position based on dendrogram layout
                        .attr("y", innerHeight + 15) // Position below the dendrogram
                        .attr("text-anchor", "end")
                        .attr("font-size", `${fontSize}px`)
                        .attr("font-family", fontFamily)
                        .attr("transform", `rotate(-90, ${desc.x + paddingLeft}, ${innerHeight + 15})`) // Rotate text
                        .text(desc.data.name || desc.data.index); // Use name or index as label
                }
            });


            // Custom path generator
            function elbow(d) {
                return (
                    "M" +
                    d.source.x +
                    "," +
                    transformY(d.source) +
                    "H" +
                    d.target.x +
                    "V" +
                    transformY(d.target)
                );
            }

            return svg.node();
        },
         // Agglomerative clustering function (from previous example)
        agglomerativeClustering: function (distances, labels) {
            let clusters = labels.map((label, i) => ({
            name: `Sample ${label}`,
            height: 0,
            isLeaf: true,
            index: i
            }));
        
            const n = clusters.length;
            let currentClusterIndex = n;
        
            function calculateAverageDistance(cluster1, cluster2) {
            let totalDistance = 0;
            let count = 0;
            cluster1.indices.forEach(i => {
                cluster2.indices.forEach(j => {
                totalDistance += distances[i][j];
                count += 1;
                });
            });
            return totalDistance / count;
            }
        
            clusters.forEach(cluster => {
            cluster.indices = [cluster.index];
            });
        
            while (clusters.length > 1) {
            let minDistance = Infinity;
            let mergeIndices = [0, 1];
        
            for (let i = 0; i < clusters.length - 1; i++) {
                for (let j = i + 1; j < clusters.length; j++) {
                const distance = calculateAverageDistance(clusters[i], clusters[j]);
                if (distance < minDistance) {
                    minDistance = distance;
                    mergeIndices = [i, j];
                }
                }
            }
        
            const [index1, index2] = mergeIndices;
            const newCluster = {
                name: `Cluster ${currentClusterIndex++}`,
                height: minDistance,
                children: [clusters[index1], clusters[index2]],
                indices: [...clusters[index1].indices, ...clusters[index2].indices]
            };
        
            clusters.splice(index2, 1);
            clusters.splice(index1, 1);
            clusters.push(newCluster);
            }
        
            return clusters[0];
        }
    };
})(window);