/* ----------------------------*/
/* SIGNAL PROCESSING CHART 013 */
/* ----------------------------*/
(function () {
    let divID_haar = "chart_haar_wavelet";
    let divID_rBio39 = "chart_rbio3_9_wavelet";
    let sectionID = "haar-wavelet";
    let myFig = null;
    let axesAlready = false;
    // haar wavelet kernel
    const h_kernel_line_x = [-.5, 1.5]
    const h_kernel_points_x = [0, 1]
    const h_kernel_line_y = [1/Math.sqrt(2), 1/Math.sqrt(2)]
    const h_kernel_points_y = [1/Math.sqrt(2), 1/Math.sqrt(2)]

    let g_kernel_line_x = [-.5, 0.5, 0.5, 1.5]
    let g_kernel_points_x = [0, 1]
    g_kernel_line_x = g_kernel_line_x.map(x => x + 2.5); // Verschiebung um 2.5 Einheiten nach rechts
    g_kernel_points_x = g_kernel_points_x.map(x => x + 2.5); // Verschiebung um 2.5 Einheiten nach rechts
    const g_kernel_line_y = [1/Math.sqrt(2), 1/Math.sqrt(2), -1/Math.sqrt(2), -1/Math.sqrt(2)]
    const g_kernel_points_y = [1/Math.sqrt(2), -1/Math.sqrt(2)]
    const h_kernel_line_xy = mathUtils.createXYData(h_kernel_line_x, h_kernel_line_y);
    const g_kernel_line_xy = mathUtils.createXYData(g_kernel_line_x, g_kernel_line_y);
    const h_kernel_points_xy = mathUtils.createXYData(h_kernel_points_x, h_kernel_points_y);
    const g_kernel_points_xy = mathUtils.createXYData(g_kernel_points_x, g_kernel_points_y);

    const dataSets_haar = [
        { data: h_kernel_line_xy, options: { key: "signal1", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
        { data: g_kernel_line_xy, options: { key: "signal2", curve: d3.curveLinear, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5 } },
        { data: h_kernel_points_xy, options: { key: "signal1_points", lineColor: "none", pointColor: "#0FF", pointSize: 10 } },
        { data: g_kernel_points_xy, options: { key: "signal2_points", lineColor: "none", pointColor: "#F0F", pointSize: 10 } }
    ];
    // rBio3.9 wavelet kernel
    const rBio39_h_kernel_x = mathUtils.linspace(0, 19, 20);
    const rBio39_h_kernel_y = [0,0,0,0,0,0,0,0,0.1767766953,0.5303300859,0.5303300859,0.1767766953,0,0,0,0,0,0,0,0]
    const rBio39_h_kernel_xy = mathUtils.createXYData(rBio39_h_kernel_x, rBio39_h_kernel_y);
    const rBio39_g_kernel_x = mathUtils.linspace(20, 39, 20);
    const rBio39_g_kernel_y = [0.0006797444,0.0020392331,-0.0050603192,-0.0206189126,0.0141127879,0.0991347825,-0.0123001363,-0.3201919684,-0.0020500227,0.9421257007,-0.9421257007,0.0020500227,0.3201919684,0.0123001363,-0.0991347825,-0.0141127879,0.0206189126,0.0050603192,-0.0020392331,-0.0006797444]
    const rBio39_g_kernel_xy = mathUtils.createXYData(rBio39_g_kernel_x, rBio39_g_kernel_y);
    const dataSets_rBio39 = [
        { data: rBio39_h_kernel_xy, options: { key: "signal1", curve: d3.curveNatural, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
        { data: rBio39_g_kernel_xy, options: { key: "signal2", curve: d3.curveNatural, lineColor: "#F0F", pointColor: "none", lineWidth: 1.5 } }
    ];

    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divID_haar, dataSets_haar, 400, 200, -.5, 4, -1, 1, true, true
        );
        const { fig2, lines2 } = plotUtils.drawPixelChart(
            divID_rBio39, dataSets_rBio39, 400, 200, 0, 39, -1, 1, true, true
        );
        Reveal.layout();
    });
})();

(function () {
    let divIDa = "chart_dwt_example1";
    let divIDb = "chart_dwt_example2";
    let divIDc = "chart_dwt_example3";
    let sectionID = "dwt-example";
    // Initialisierung der Variablen
    let myFig = null;
    let axesAlready = false;
    // haar wavelet kernel
    const h_kernel = [1/Math.sqrt(2), 1/Math.sqrt(2)];
    const g_kernel = [1/Math.sqrt(2), -1/Math.sqrt(2)];

    // create some example data
    const n = 256;
    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);
    // zusammengesetztes Signal cumulativ sum of random numbers
    let yData_1 = Array.from({ length: n }, () => Math.random() - 0.5);
    yData_1 = mathUtils.calcCumulativeSum(yData_1);
    // add peak to yData_1
    const yData_2 = mathUtils.addGaussianPeak(xData,3, 20, 0.03);
    yData_1 = yData_1.map((y, i) => y + yData_2[i]); // add peak to random walk

    // perfom DWT one time
    let A1 = mathUtils.convolution(yData_1, h_kernel);
    let D1 = mathUtils.convolution(yData_1, g_kernel);
    // Downsample the results
    A1 = A1.filter((_, i) => i % 2 === 0);
    D1 = D1.filter((_, i) => i % 2 === 0);
    const xDataA1 = xData.filter((_, i) => i % 2 === 0);
    // create xyData for the original signal
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_A1 = mathUtils.createXYData(xDataA1, A1);
    const xyData_D1 = mathUtils.createXYData(xDataA1, D1);

    const dataSets1 = [
        { data: xyData_1, options: { key: "original_signal", curve: d3.curveLinear, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets2 = [
        { data: xyData_A1, options: { key: "approximation", curve: d3.curveLinear, lineColor: "#F00", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets3 = [
        { data: xyData_D1, options: { key: "detail", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];

    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divIDa, dataSets1, 800, 200, 0, 2 * Math.PI, Math.min(...yData_1), Math.max(...yData_1)
        );
        const { fig2, lines2 } = plotUtils.drawPixelChart(
            divIDb, dataSets2, 400, 200, 0, 2 * Math.PI, Math.min(...A1), Math.max(...A1)
        );
        const { fig3, lines3 } = plotUtils.drawPixelChart(
            divIDc, dataSets3, 400, 200, 0, 2 * Math.PI, Math.min(...D1), Math.max(...D1)
        );
        Reveal.layout();
    });
})();

(function () {
    let divIDa = "chart_dwt_multi_resolution_analysis";
    let divIDb = "chart_dwt_multi_resolution_analysis_details1";
    let divIDc = "chart_dwt_multi_resolution_analysis_details2";
    let divIDd = "chart_dwt_multi_resolution_analysis_details3";
    let divIDe = "chart_dwt_multi_resolution_analysis_details4";
    let sectionID = "dwt-multi-resolution-analysis";
    // Initialisierung der Variablen
    let myFig = null;
    let axesAlready = false;
    // haar wavelet kernel
    const h_kernel = [1/Math.sqrt(2), 1/Math.sqrt(2)];
    const g_kernel = [1/Math.sqrt(2), -1/Math.sqrt(2)];

    // create some example data
    const n = 256;
    // x-Achse
    const xData = mathUtils.linspace(0, 2 * Math.PI, n);
    // zusammengesetztes Signal cumulativ sum of random numbers
    let yData_1 = Array.from({ length: n }, () => Math.random() - 0.5);
    yData_1 = mathUtils.calcCumulativeSum(yData_1);
    // add peak to yData_1
    const yData_2 = mathUtils.addGaussianPeak(xData,3, 20, 0.03);
    yData_1 = yData_1.map((y, i) => y + yData_2[i]); // add peak to random walk

    // perform DWT one time
    let A1 = mathUtils.convolution(yData_1, h_kernel);
    let D1 = mathUtils.convolution(yData_1, g_kernel);
    // Downsample the results
    A1 = A1.filter((_, i) => i % 2 === 0);
    D1 = D1.filter((_, i) => i % 2 === 0);
    const xDataA1 = xData.filter((_, i) => i % 2 === 0);
    // create xyData for the original signal
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    const xyData_A1 = mathUtils.createXYData(xDataA1, A1);
    const xyData_D1 = mathUtils.createXYData(xDataA1, D1);

    // perform DWT 1 times more
    let A2 = mathUtils.convolution(A1, h_kernel);
    let D2 = mathUtils.convolution(A1, g_kernel);
    // Downsample the results
    A2 = A2.filter((_, i) => i % 2 === 0);
    D2 = D2.filter((_, i) => i % 2 === 0);
    const xDataA2 = xDataA1.filter((_, i) => i % 2 === 0);
    // create xyData for the second level
    const xyData_A2 = mathUtils.createXYData(xDataA2, A2);
    const xyData_D2 = mathUtils.createXYData(xDataA2, D2);
    // perform DWT 2 times more
    let A3 = mathUtils.convolution(A2, h_kernel);
    let D3 = mathUtils.convolution(A2, g_kernel);
    // Downsample the results
    A3 = A3.filter((_, i) => i % 2 === 0);
    D3 = D3.filter((_, i) => i % 2 === 0);  
    const xDataA3 = xDataA2.filter((_, i) => i % 2 === 0);
    // create xyData for the third level
    const xyData_A3 = mathUtils.createXYData(xDataA3, A3);
    const xyData_D3 = mathUtils.createXYData(xDataA3, D3);
    // perform DWT 3 times more
    let A4 = mathUtils.convolution(A3, h_kernel);
    let D4 = mathUtils.convolution(A3, g_kernel);
    // Downsample the results
    A4 = A4.filter((_, i) => i % 2 === 0);
    D4 = D4.filter((_, i) => i % 2 === 0);
    const xDataA4 = xDataA3.filter((_, i) => i % 2 === 0);
    // create xyData for the fourth level
    const xyData_A4 = mathUtils.createXYData(xDataA4, A4);
    const xyData_D4 = mathUtils.createXYData(xDataA4, D4);

    const dataSets1 = [
        { data: xyData_1, options: { key: "original_signal", curve: d3.curveLinear, lineColor: "#FFF", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets2 = [
        { data: xyData_D1, options: { key: "detail1", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets3 = [
        { data: xyData_D2, options: { key: "detail2", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets4 = [
        { data: xyData_D3, options: { key: "detail3", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];

    const dataSets5 = [
        { data: xyData_D4, options: { key: "detail4", curve: d3.curveLinear, lineColor: "#0FF", pointColor: "none", lineWidth: 1.5 } },
    ];


    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, lines } = plotUtils.drawPixelChart(
            divIDa, dataSets1, 400, 400, 0, 2 * Math.PI, Math.min(...yData_1), Math.max(...yData_1)
        );
        const { fig2, lines2 } = plotUtils.drawPixelChart(
            divIDb, dataSets2, 400, 150, 0, 2 * Math.PI, Math.min(...D1), Math.max(...D1), true, false
        );
        const { fig3, lines3 } = plotUtils.drawPixelChart(
            divIDc, dataSets3, 400, 150, 0, 2 * Math.PI, Math.min(...D2), Math.max(...D2), true, false
        );
        const { fig4, lines4 } = plotUtils.drawPixelChart(
            divIDd, dataSets4, 400, 150, 0, 2 * Math.PI, Math.min(...D3), Math.max(...D3), true, false
        );
        const { fig5, lines5 } = plotUtils.drawPixelChart(
            divIDe, dataSets5, 400, 150, 0, 2 * Math.PI, Math.min(...D4), Math.max(...D4), false, false
        );
        Reveal.layout();
    });
})();

(function () {
    // div-IDs
    let divIDa = "chart_dwt_multi_resolution_analysis-2";
    let divIDb = "chart_dwt_multi_resolution_analysis_details5";
    let divIDc = "chart_dwt_multi_resolution_analysis_details6";
    let divIDd = "chart_dwt_multi_resolution_analysis_details7";
    let divIDe = "chart_dwt_multi_resolution_analysis_details8";
    // Section-ID
    let sectionID2 = "dwt-multi-resolution-analysis-2";

    // Harte Schwelle
    function hardThreshold(data, tau) {
      return data.map(v => Math.abs(v) > tau ? v : 0);
    }

    // Direkte Haar-Forward-DWT: aus x erzeugt A und D
    function forwardHaar(x) {
      const N2 = Math.floor(x.length/2);
      const A = new Array(N2), D = new Array(N2);
      const s = 1/Math.SQRT2;
      for (let k = 0; k < N2; k++) {
        const x0 = x[2*k], x1 = x[2*k + 1];
        A[k] = (x0 + x1) * s;
        D[k] = (x0 - x1) * s;
      }
      return { A, D };
    }

    // Direkte Haar-Rekonstruktion
    function reconstructHaar(A, D) {
      const N = A.length;
      const x = new Array(2 * N);
      const s = 1/Math.SQRT2;
      for (let k = 0; k < N; k++) {
        x[2*k    ] = (A[k] + D[k]) * s;
        x[2*k + 1] = (A[k] - D[k]) * s;
      }
      return x;
    }

    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id !== sectionID2) return;

      // --- 1) Daten erzeugen ---
      const n = 256;
      const xData = mathUtils.linspace(0, 2 * Math.PI, n);
      let y = Array.from({ length: n }, () => Math.random() - 0.5);
      y = mathUtils.calcCumulativeSum(y);
      const peak = mathUtils.addGaussianPeak(xData, 3, 20, 0.03);
      y = y.map((v, i) => v + peak[i] + 5);

      // --- 2) Forward-DWT 4-Level ---
      const lvl1 = forwardHaar(y);
      const lvl2 = forwardHaar(lvl1.A);
      const lvl3 = forwardHaar(lvl2.A);
      const lvl4 = forwardHaar(lvl3.A);

      const A1 = lvl1.A, D1 = lvl1.D, xA1 = xData.filter((_,i)=>i%2===0);
      const A2 = lvl2.A, D2 = lvl2.D, xA2 = xA1.filter((_,i)=>i%2===0);
      const A3 = lvl3.A, D3 = lvl3.D, xA3 = xA2.filter((_,i)=>i%2===0);
      const A4 = lvl4.A, D4 = lvl4.D, xA4 = xA3.filter((_,i)=>i%2===0);

      // --- 3) Threshold & gefilterte Details ---
      const taus = [D1, D2, D3, D4].map(D => 0.2 * Math.max(...D.map(Math.abs)));
      const D1_f = hardThreshold(D1, taus[0]);
      const D2_f = hardThreshold(D2, taus[1]);
      const D3_f = hardThreshold(D3, taus[2]);
      const D4_f = hardThreshold(D4, taus[3]);

      // --- 4) Inverse DWT mit reconstructHaar ---
      let A3_hat = reconstructHaar(A4, D4_f);
      let A2_hat = reconstructHaar(A3_hat, D3_f);
      let A1_hat = reconstructHaar(A2_hat, D2_f);
      let yDenoised = reconstructHaar(A1_hat, D1_f);

      // Optional GLättungs-Länge an yDenoised anpassen, falls n ungerade:
      yDenoised = yDenoised.slice(0, y.length);

      // --- 5) Plot: Original + Denoised ---
      plotUtils.drawPixelChart(
        divIDa,
        [
          { data: mathUtils.createXYData(xData, y),
            options: { key:"orig",     curve:d3.curveLinear, lineColor:"#FFF", pointColor:"none", lineWidth:1.5 } },
          { data: mathUtils.createXYData(xData, yDenoised),
            options: { key:"denoised", curve:d3.curveLinear, lineColor:"#F00", pointColor:"none", lineWidth:2.5 } },
        ],
        400, 400, 0, 2*Math.PI, Math.min(...y), Math.max(...y)
      );

      // --- 6) Detail-Plots: Original D vs. gefiltert D ---
      [
        { D:D1, Df:D1_f, x:xA1, div:divIDb },
        { D:D2, Df:D2_f, x:xA2, div:divIDc },
        { D:D3, Df:D3_f, x:xA3, div:divIDd },
        { D:D4, Df:D4_f, x:xA4, div:divIDe },
      ].forEach((lvl, idx) => {
        plotUtils.drawPixelChart(
          lvl.div,
          [
            { data: mathUtils.createXYData(lvl.x, lvl.D),
              options:{ key:`D${idx+1}`,      curve:d3.curveLinear, lineColor:"#0FF", pointColor:"none", lineWidth:1.5 } },
            { data: mathUtils.createXYData(lvl.x, lvl.Df),
              options:{ key:`D${idx+1}_filt`, curve:d3.curveLinear, lineColor:"#F00", pointColor:"none", lineWidth:1.5 } },
          ],
          400, 150, 0, 2*Math.PI,
          Math.min(...lvl.D), Math.max(...lvl.D)
        );
      });

      Reveal.layout();
    });
})();

