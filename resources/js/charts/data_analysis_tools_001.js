/* ----------------------------*/
/* DATA ANALYSIS TOOLS 001     */
/* ----------------------------*/
(function () {
    let divID = "chart_bar01";
    let sectionID = "initial-thoughts";
    let myFig = null;
    let axesAlready = false;
    
    const xData = [1, 2, 3, 4, 5];
    const yData_1 = [2.3, 2.7, 1.9, 2.1, 2.5];
    const xyData_1 = mathUtils.createXYData(xData, yData_1);
    // Alle Datensätze in einem Array
    const dataSets = [
      {
        data: xyData_1,
        options: {
          key: "myBars",              // eindeutiger Schlüssel (falls du ihn später referenzieren willst)
          barColor: "#0FF",           // Füllfarbe der Bars
          barStroke: "#0DD",          // Rahmenfarbe der Bars (optional)
          barWidth: 30,             // falls du die Breite individuell setzen willst
        }
      }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, bars } = plotUtils.drawPixelBarChart(
            divID, dataSets, 500, 400, 0, 6, 0, 3
        );
        Reveal.layout();
    });
})();

(function () {
    let divID = "chart_bar02";
    let sectionID = "initial-thoughts-2";
    let myFig = null;
    let axesAlready = false;
    /* <tr><td>1</td><td>2.3</td><td>1.2</td><td>0.5</td><td>0.2</td></tr>
        <tr><td>2</td><td>2.7</td><td>1.1</td><td>0.4</td><td>0.3</td></tr>
        <tr><td>3</td><td>1.9</td><td>1.3</td><td>0.6</td><td>0.1</td></tr>
        <tr><td>4</td><td>2.1</td><td>1.0</td><td>0.3</td><td>0.4</td></tr>
        <tr><td>5</td><td>2.5</td><td>1.4</td><td>0.7</td><td>0.5</td></tr>*/
    const xData = [1, 2, 3, 4, 5];
    const yData_1 = [2.3, 2.7, 1.9, 2.1, 2.5];
    const yData_2 = [1.2, 1.1, 1.3, 1.0, 1.4];
    const yData_3 = [0.5, 0.4, 0.6, 0.3, 0.7];
    const yData_4 = [0.2, 0.3, 0.1, 0.4, 0.5];
    const xyData_1 = mathUtils.createXYData(xData.map(x => x - 0.3), yData_1);
    const xyData_2 = mathUtils.createXYData(xData.map(x => x - 0.1), yData_2);
    const xyData_3 = mathUtils.createXYData(xData.map(x => x + 0.1), yData_3);
    const xyData_4 = mathUtils.createXYData(xData.map(x => x + 0.3), yData_4);
    // Alle Datensätze in einem Array
    const dataSets = [
      {
        data: xyData_1,
        options: {
          key: "myBars",              // eindeutiger Schlüssel (falls du ihn später referenzieren willst)
          barColor: "#0FF",           // Füllfarbe der Bars
          barStroke: "#0DD",          // Rahmenfarbe der Bars (optional)
          barWidth: 8,             // falls du die Breite individuell setzen willst
        }
      },
      {
        data: xyData_2,
        options: {
          key: "myBars2",
          barColor: "#F00",
          barStroke: "#D00",
          barWidth: 8,
        }
      },
      {
        data: xyData_3,
        options: {
          key: "myBars3",
          barColor: "#FF0",
          barStroke: "#DD0",
          barWidth: 8,
        }
      },
      {
        data: xyData_4,
        options: {
          key: "myBars4",
          barColor: "#F0F",
          barStroke: "#D0D",
          barWidth: 8,
        }
      }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        const { fig, bars } = plotUtils.drawPixelBarChart(
            divID, dataSets, 500, 400, 0, 6, 0, 3
        );
        Reveal.layout();
    });
})();