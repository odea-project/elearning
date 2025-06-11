/* ----------------------------*/
/* SIGNAL PROCESSING CHART 011 */
/* ----------------------------*/
(function () {
    let divID = "chart_radial";
    let sectionID = "denoising-fourier-transformation-3";
    let myFig = null;
    let axesAlready = false;
    const n = 100;
    // Winkel von 0 bis 2π
    const t = mathUtils.linspace(0, 2 * Math.PI, n);
    // x=cos(t), y=sin(t)
    const xyData = t.map(angle => ({
        x: Math.cos(angle),
        y: Math.sin(angle)
    }));
    const dataSets = [
        {
            data: xyData,
            options: {
                key: "circle",
                curve: d3.curveLinearClosed,  // geschlossener Kreis
                lineColor: "#0FF",
                pointColor: "none",
                lineWidth: 1.5
            }
        }
    ];
    // Listener an den Slidewechsel anfügen
    Reveal.addEventListener('slidechanged', event => {
        if (event.currentSlide.id !== sectionID) return;

        // 1) Kreis & Achsen zeichnen
        const { fig, lines } = plotUtils.drawPixelChart(
            divID, dataSets,
            300, 300,
            -1, 1,
            -1, 1,
            true,
            true
        );
        Reveal.layout();

        // 2) Bestimme die Gruppe, in der Dein Kreis-Path liegt:
        //    lines.circle ist die d3-Selection des Kreis-Pfads
        //    Wir nehmen den Parent <g> dieses Pfads:
        const plotGroup = d3.select(lines.circle.node().parentNode);

        // 3) Punkt-Setup
        const pointsData = [
            { omega: 0.001, color: "red",    radius: 10 },
            { omega: 0.002, color: "yellow", radius: 10 }
        ];
        const points = plotGroup
            .selectAll(".rotPoint")
            .data(pointsData)
            .enter()
            .append("circle")
            .attr("class", "rotPoint")
            .attr("r", d => d.radius)
            .attr("fill", d => d.color);

        // 4) Animation
        d3.timer(elapsed => {
            points
            .attr("cx", d => fig.xScale(Math.cos(d.omega * elapsed * -1)))
            .attr("cy", d => fig.yScale(Math.sin(d.omega * elapsed * -1)));
        });
        });
})();

(function () {
  const divID     = "chart_interference2";
  const sectionID = "denoising-fourier-transformation-3";
  const n         = 100;
  const t         = mathUtils.linspace(0, 2 * Math.PI, n);

  const R = 1;     // Basis-Radius
  const A = 0.15;  // Modulations-Amplitude (kleiner, damit die Wellen dezent bleiben)
  const k = 6;     // Anzahl der Cos-Wellen um den Kreis

  // 1) Erzeuge statischen Einheitkreis (zur Orientierung)
  const xyCircle = t.map(angle => ({
    x: R * Math.cos(angle),
    y: R * Math.sin(angle)
  }));

  // 2) Erzeuge „wrapped“-Daten: radius = R + A*cos(k*angle)
  const xyWrapped = t.map(angle => {
    const r = R + A * Math.cos(k * angle);
    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle)
    };
  });

  const dataSets = [
    {
      data: xyCircle,
      options: {
        key: "circle",
        curve: d3.curveLinearClosed,
        lineColor: "#888",
        pointColor: "none",
        lineWidth: 1,
      }
    },
    {
      data: xyWrapped,
      options: {
        key: "wrapped",
        curve: d3.curveLinearClosed,
        lineColor: "#F00",
        pointColor: "none",
        lineWidth: 2
      }
    }
  ];

  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id !== sectionID) return;

    // 3) Zeichne beides
    const { fig, lines } = plotUtils.drawPixelChart(
      divID, dataSets,
      300, 300,
      -1, 1,
      -1, 1,
      true,   // x-Achse
      true    // y-Achse
    );
    Reveal.layout();

    // 4) Optional: langsame Rotation, um die Welle „wandern“ zu lassen
    const cx = fig.xScale(0);
    const cy = fig.yScale(0);
    const omega = 0.0005; // rad/ms, sehr langsam
    d3.timer(elapsed => {
      const deg = (omega * elapsed) * 180 / Math.PI;
      lines.wrapped
        .attr("transform", `rotate(${deg},${cx},${cy})`);
    });
  });
})();







