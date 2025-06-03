function createPixelLinePlot({
  selector,     // z. B. "#pixel-chart"
  data,         // Array von { x: <Zahl>, y: <Zahl> }
  width = 800,
  height = 400,
  margin = { top: 50, right: 50, bottom: 50, left: 50 }
}) {
  // 1) Alten SVG-Container löschen, falls vorhanden
  d3.select(selector).selectAll("svg").remove();

  // 2) Inneren Bereich berechnen
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  // 3) SVG-Container anlegen
  const svg = d3.select(selector)
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("image-rendering", "pixelated")
      .style("shape-rendering", "crispEdges")
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 4) Skalen definieren (x linear, y linear)
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .nice()
    .range([innerHeight, 0]);

  // 5) Achsen zeichnen (fallen dadurch nicht blockig aus, 
  //    aber wir lassen shape-rendering: crispEdges für die Achsen-Linien)
  const xAxis = d3.axisBottom(xScale).ticks(5).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);

  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  // 6) Statt d3.line() verwenden wir einen d3.path() und bauen 
  //    bei jedem Datenpunkt-Paar erst eine horizontale, dann eine vertikale Kante.
  const path = d3.path();

  // 6a) Erstes Datenpaar: Start-Koordinate
  const x0 = Math.round(xScale(data[0].x));
  const y0 = Math.round(yScale(data[0].y));
  path.moveTo(x0, y0);

  // 6b) Für jedes folgende Datenpaar: 
  //     → horizontal vom (x_(i-1), y_(i-1)) nach (x_i, y_(i-1))
  //     → dann vertikal nach (x_i, y_i)
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    const px = Math.round(xScale(prev.x));
    const py = Math.round(yScale(prev.y));
    const cx = Math.round(xScale(curr.x));
    const cy = Math.round(yScale(curr.y));

    // horizontal zum nächsten X auf gleicher Y-Höhe
    path.lineTo(cx, py);
    // dann vertikal zum neuen Y
    path.lineTo(cx, cy);
  }

  // 7) Pfad als single <path> im SVG ablegen
  svg.append("path")
    .attr("class", "line")
    .attr("d", path.toString());

  // 8) Die Datenpunkte als kleine Pixel-Quadrate (6×6) zeichnen
  svg.selectAll(".point")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "point")
      .attr("x", d => Math.round(xScale(d.x)) - 3)
      .attr("y", d => Math.round(yScale(d.y)) - 3)
      .attr("width", 6)
      .attr("height", 6);
}




Reveal.on('slidechanged', event => {
  // event.currentSlide ist die <section> heute aktiv
  const current = event.currentSlide;
  if (current.id === 'pixel-chart-slide') {
    // Beispiel-Daten (ihr könnt auch dynamisch generieren oder extern laden)
    const sampleData = [
      { x: 0, y:  5 },
      { x: 1, y: 10 },
      { x: 2, y:  8 },
      { x: 3, y: 15 },
      { x: 4, y: 12 },
      { x: 5, y: 20 }
    ];

    // Chart erzeugen
    createPixelLinePlot({
      selector: "#pixel-chart",
      data: sampleData,
      width: 800,
      height: 400,
      margin: { top:50, right:50, bottom:50, left:50 }
    });
  }
});
