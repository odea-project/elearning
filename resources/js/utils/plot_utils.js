(function (global) {
  global.plotUtils = {
    /**
     * Erzeugt eine leere SVG‐Figure im DIV mit ID=divId.
     * Liefert ein Objekt zurück mit allen References, um später Plot(s) hinzuzufügen.
     */
    createFigure: function (divId, width = 800, height = 400, margin = { top: 50, right: 50, bottom: 50, left: 50 }) {
      // 1) Leeres SVG im Container anlegen (alte SVGs entfernen)
      d3.select(`#${divId}`).selectAll("svg").remove();

      // 2) Innenmaße berechnen
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // 3) SVG + <g> anlegen, mit Pixel-Rendering & dunklem Hintergrund
      const svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "rgba(0, 0, 0, 0.7)") // Dunkler Hintergrund
        // .style("image-rendering", "pixelated")        // Pixel-Look
        // .style("shape-rendering", "crispEdges")       // scharfe Kanten
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // 4) Leere Gruppen für Achsen vorbereiten
      const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`);
      const yAxisGroup = svg.append("g")
        .attr("class", "y-axis");

      // 5) Rückgabe eines Objekts, das du später an addLinePlot übergibst
      return {
        svg,
        xAxisGroup,
        yAxisGroup,
        width: innerWidth,
        height: innerHeight,
        margin
      };
    },

    /**
     * Zeichnet x- und y-Achsen in eine existierende Figure. 
     * 
     * @param {object} fig       – Das von createFigure zurückgegebene Objekt
     * @param {Array}  xDomain   – [xmin, xmax]; z. B. d3.extent(data, d=>d.x)
     * @param {Array}  yDomain   – [ymin, ymax]; z. B. [0, d3.max(data, d=>d.y)]
     * @param {number} xTicks    – Anzahl der xticks (default 5)
     * @param {number} yTicks    – Anzahl der yticks (default 5)
     */
    addAxes: function (fig, xDomain, yDomain, xTicks = 5, yTicks = 5) {
      // 1) Skalen definieren
      const xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([0, fig.width]);

      const yScale = d3.scaleLinear()
        .domain(yDomain).nice()
        .range([fig.height, 0]);

      // 2) Achsen-Generatoren
      const xAxis = d3.axisBottom(xScale)
        .ticks(xTicks)
        .tickSizeOuter(0);
      const yAxis = d3.axisLeft(yScale)
        .ticks(yTicks)
        .tickSizeOuter(0);

      // 3) Achsen einfügen
      fig.xAxisGroup.call(xAxis);
      fig.yAxisGroup.call(yAxis);

      // 4) Inline-Styling: Neon-Cyan für Linien & „Press Start 2P“ für Texte
      fig.xAxisGroup.selectAll("path, line")
        .style("stroke", "#0ff")
        .style("stroke-width", "2px")
        .style("shape-rendering", "crispEdges");
      fig.xAxisGroup.selectAll("text")
        .style("fill", "#0ff")
        .style("font-size", "14px")
        .style("font-family", "'Press Start 2P', monospace")
        .style("shape-rendering", "crispEdges");

      fig.yAxisGroup.selectAll("path, line")
        .style("stroke", "#0ff")
        .style("stroke-width", "2px")
        .style("shape-rendering", "crispEdges");
      fig.yAxisGroup.selectAll("text")
        .style("fill", "#0ff")
        .style("font-size", "14px")
        .style("font-family", "'Press Start 2P', monospace")
        .style("shape-rendering", "crispEdges");

      // 5) Skalen im Figure-Objekt speichern, damit sie später beim Plotten verfügbar sind
      fig.xScale = xScale;
      fig.yScale = yScale;
    },

    /**
     * Fügt der Figure genau eine neue Linie (und Punkte) hinzu, ohne bestehende zu löschen.
     * 
     * @param {object} fig         – Das Figure-Objekt aus createFigure & addAxes
     * @param {Array}  data        – Array von Punkten [{x:<Number>, y:<Number>}, …]
     * @param {object} options     – Folgende Properties (mit Default-Werten):
     *    {
     *      curve     – d3.curveNatural oder d3.curveLinear, etc. (default: d3.curveLinear)
     *      lineColor – Farbcode, z. B. "#f0f" (default)
     *      lineWidth – Zahl in Pixel, z. B. 3 (default)
     *      pointSize – Seitenlänge der Quadrate in Pixel, z. B. 6 (default)
     *      pointColor– Farbcode, z. B. "#ff0" (default)
     *    }
     */
    addLine: function (fig, data, options = {}) {
      // 1) Optionen mit Defaults zusammenführen
      const {
        curve = d3.curveLinear,
        lineColor = "#f0f",
        lineWidth = 3,
        pointSize = 6,
        pointColor = "#ff0"
      } = options;

      // 2) Line-Generator, unter Verwendung der bereits in fig gespeicherten Skalen
      const lineGenerator = d3.line()
        .x(d => fig.xScale(d.x))
        .y(d => fig.yScale(d.y))
        .curve(curve);

      // 3) Neuen <path> für die Linie einfügen
      fig.svg.append("path")
        .datum(data)
        .attr("class", "line")          // optional: wenn du Linien später gezielt ansprechen willst
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .style("stroke", lineColor)     // Inline-Style hat Vorrang
        .style("stroke-width", lineWidth)
        .style("shape-rendering", "crispEdges");

      // 4) Punkte (Quadrate) an jedem Datenpunkt hinzufügen
      fig.svg.selectAll(null)          // Selektor „null“ erzwingt, dass wir keine bestehenden rects abgreifen
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "point")
        .attr("x", d => Math.round(fig.xScale(d.x)) - pointSize / 2)
        .attr("y", d => Math.round(fig.yScale(d.y)) - pointSize / 2)
        .attr("width", pointSize)
        .attr("height", pointSize)
        .attr("fill", pointColor)
        .attr("stroke", pointColor)
        .attr("stroke-width", 1)
        .on("mouseover", function () {
          d3.select(this)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("stroke", pointColor)
            .attr("stroke-width", 1);
        });
    },

    readCSV: function (filePath) {
      return d3.csv(filePath, d => ({
        x: +d.x,
        y: +d.y
      }));
    },

    /**
     * Zeichnet oder aktualisiert den Pixel-Chart im DIV.
     * Wenn bereits eine Figure im DIV existiert, wird sie wiederverwendet; 
     * die Achsen werden nur einmalig gesetzt.
     */
    drawPixelChart: function(divID, dataSets) {
      // Wir nutzen ein Cache-Objekt, um Figuren pro DIV zu speichern.
      plotUtils._cache = plotUtils._cache || {};
      
      // Falls für diesen divID noch keine Figure existiert: Erstelle sie.
      if (!plotUtils._cache[divID]) {
        const fig = plotUtils.createFigure(divID, 800, 400, { top:50, right:50, bottom:50, left:50 });
        plotUtils._cache[divID] = { fig: fig, axesAlready: false };
      }
      
      const cacheItem = plotUtils._cache[divID];
      const fig = cacheItem.fig;
      
      // Wenn die Achsen noch nicht gesetzt wurden: Berechne & setze sie.
      if (!cacheItem.axesAlready) {
        const allX = dataSets.flatMap(set => set.data.map(d => d.x));
        const allY = dataSets.flatMap(set => set.data.map(d => d.y));
        plotUtils.addAxes(fig, d3.extent(allX), [0, d3.max(allY)], 5, 5);
        cacheItem.axesAlready = true;
      }
      
      // Entferne existierende Linien und Punkte, bevor du neu zeichnest.
      fig.svg.selectAll(".line, .point").remove();
      
      // Zeichne alle Datenspuren
      dataSets.forEach(set => {
        plotUtils.addLine(fig, set.data, set.options);
      });
      
      return fig;
    }
  };
})(window);
