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

(function () {
  const divID       = "chart_matching";
  const sectionID   = "denoising-fourier-transformation-4";
  const numPoints   = 300;
  const t           = mathUtils.linspace(0, 1, numPoints); 
  // t in [0,1] für lineares Signal; Winkel später = 2π·f·t
  const baseRadius  = 100;  // Pixel
  const axialAmp    = 20;   // Stärke der radialen Modulation (in Pixel)
  const slider      = document.getElementById("frequencySlider");
  const displayFreq = document.getElementById("frequencyValue");
  const displayDist = document.getElementById("distanceValue");

  let svg, path, centroidPoint, centroidLine;

  function init() {
    // SVG aufsetzen (einmalig)
    d3.select(`#${divID}`).selectAll("*").remove();
    svg = d3.select(`#${divID}`)
      .append("svg")
        .attr("width", 2*baseRadius + 50)
        .attr("height", 2*baseRadius + 50)
      .append("g")
        .attr("transform", `translate(${baseRadius+25},${baseRadius+25})`);

    // Pfad und Schwerpunkt-Elemente
    path = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    centroidLine = svg.append("line")
      .attr("stroke", "blue")
      .attr("stroke-width", 1);

    centroidPoint = svg.append("circle")
      .attr("r", 5)
      .attr("fill", "blue");

    // Slider-Initialisierung
    slider.min = 1;
    slider.max = 10;
    slider.step = 0.1;
    slider.value = 1;
    displayFreq.textContent = slider.value;
  }

  function update() {
  const f = +slider.value;
  displayFreq.textContent = f.toFixed(1);

  // 1) Punkte berechnen
  const points = t.map((u) => {
    const cosVal = Math.cos(2 * Math.PI * u * 4.2);
    const r      = baseRadius + cosVal * axialAmp;
    const theta  = 2 * Math.PI * f * u;
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      w: Math.abs(cosVal)
    };
  });

  // 2) Offenen Pfad-Generator verwenden
  const lineGen = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCardinal);

  // 3) Pfad updaten
  path.datum(points)
      .attr("d", lineGen);

  // 4) Schwerpunkt (centroid) berechnen
  const centroid = points.reduce((acc, p) => {
    acc.x += p.x * p.w;
    acc.y += p.y * p.w;
    acc.w += p.w;
    return acc;
  }, { x: 0, y: 0, w: 0 });

  // erst nach dem Summieren normalisieren
  centroid.x /= centroid.w;
  centroid.y /= centroid.w;

  // 5) Schwerpunkt-Visualisierung
  centroidPoint
    .attr("cx", centroid.x)
    .attr("cy", centroid.y);
  centroidLine
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", centroid.x).attr("y2", centroid.y);

  // 6) Abstand zum Ursprung anzeigen
  const dist = Math.hypot(centroid.x, centroid.y);
  displayDist.textContent = dist.toFixed(1);
}

  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id !== sectionID) return;
    init();
    update();
    // jedes Mal neu zeichnen, wenn der Slider bewegt wird
    slider.oninput = update;
  });
})();








