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
        pointColor = "#ff0",
        style = {}
      } = options;

      // 2) Line-Generator, unter Verwendung der bereits in fig gespeicherten Skalen
      const lineGenerator = d3.line()
        .x(d => fig.xScale(d.x))
        .y(d => fig.yScale(d.y))
        .curve(curve);

      // 3) Neuen <path> für die Linie einfügen
      const path = fig.svg.append("path")
        .datum(data)
        .attr("class", "line " + options.key + "-line")          // optional: wenn du Linien später gezielt ansprechen willst
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .style("stroke", lineColor)     // Inline-Style hat Vorrang
        .style("stroke-width", lineWidth)
        .style("shape-rendering", "crispEdges");

      // 4) style-Objekt anwenden (z. B. stroke-dasharray, andere CSS-Props)
      Object.entries(style).forEach(([key, value]) => {
        // key könnte z. B. "strokeDasharray" sein – D3 übersetzt es intern auf "stroke-dasharray"
        path.style(key, value);
      });

      // 5) Punkte (Quadrate) an jedem Datenpunkt hinzufügen
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
      return path; // Rückgabe des <path>-Elements, falls du es später noch brauchst
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
    drawPixelChart: function (
      divID, dataSets,
      width = 800, height = 400,
      xmin = null, xmax = null,            // Standard auf null ändern
      ymin = null, ymax = null,            // statt 0/1
      hideXAxis = false, hideYAxis = false // optional, um Achsen zu verstecken
    ) {
      // Cache initialisieren
      plotUtils._cache = plotUtils._cache || {};

      // 1) Figure anlegen falls nötig
      if (!plotUtils._cache[divID]) {
        const fig = plotUtils.createFigure(divID, width, height, {
          top: 50, right: 50, bottom: 50, left: 50
        });
        plotUtils._cache[divID] = {
          fig, axesAlready: false, lines: {}, lineGenerators: {}
        };
      }
      const cacheItem = plotUtils._cache[divID];
      const fig = cacheItem.fig;

      // 2) Achsen nur einmal zeichnen
      if (!cacheItem.axesAlready) {
        // a) alle x- und y-Werte sammeln
        const allX = dataSets.flatMap(set => set.data.map(d => d.x));
        const allY = dataSets.flatMap(set => set.data.map(d => d.y));

        // b) x-Domain: wenn xmin/xmax gesetzt, sonst auto
        const xDomain = (xmin !== null && xmax !== null)
          ? [xmin, xmax]
          : d3.extent(allX);

        // c) y-Domain: wenn ymin/ymax gesetzt, sonst auto (inkl. 0 als Untergrenze)
        const dataYmin = Math.min(0, d3.min(allY));
        const dataYmax = d3.max(allY);
        const yDomain = (ymin !== null && ymax !== null)
          ? [ymin, ymax]
          : [dataYmin, dataYmax];

        // d) Achsen erzeugen
        plotUtils.addAxes(fig, xDomain, yDomain, 5, 5);
        // e) Achsen verstecken, falls gewünscht
        if (hideXAxis) {
          fig.xAxisGroup.style("display", "none");
        }
        if (hideYAxis) {
          fig.yAxisGroup.style("display", "none");
        }
        cacheItem.axesAlready = true;
      }

      // 3) Alte Linien/Punkte löschen
      fig.svg.selectAll(".line, .point").remove();
      cacheItem.lines = {};
      cacheItem.lineGenerators = {};

      // 4) Linien und Generatoren anlegen (wie zuvor)
      dataSets.forEach(set => {
        const key = set.options.key;

        // 4a) Line-Generator
        const lg = d3.line()
          .x(d => fig.xScale(d.x))
          .y(d => fig.yScale(d.y))
          .curve(set.options.curve || d3.curveLinear);

        // 4b) Pfad zeichnen
        const pathSel = fig.svg.append("path")
          .datum(set.data)
          .attr("class", `line ${key}-line`)
          .attr("d", lg)
          .attr("fill", "none")
          .style("stroke", set.options.lineColor || "#f0f")
          .style("stroke-width", set.options.lineWidth || 3)
          .style("shape-rendering", "crispEdges");

        // 4c) style-Overrides
        if (set.options.style) {
          Object.entries(set.options.style)
            .forEach(([k, v]) => pathSel.style(k, v));
        }

        // 4d) Punkte
        fig.svg.selectAll(null)
          .data(set.data)
          .enter()
          .append("rect")
          .attr("class", "point")
          .attr("x", d => Math.round(fig.xScale(d.x)) - (set.options.pointSize || 6) / 2)
          .attr("y", d => Math.round(fig.yScale(d.y)) - (set.options.pointSize || 6) / 2)
          .attr("width", set.options.pointSize || 6)
          .attr("height", set.options.pointSize || 6)
          .attr("fill", set.options.pointColor || "#ff0")
          .attr("stroke", set.options.pointColor || "#ff0");

        // 4e) im Cache ablegen
        cacheItem.lines[key] = pathSel;
        cacheItem.lineGenerators[key] = lg;
      });

      // 5) zurückgeben
      return {
        fig: cacheItem.fig,
        lines: cacheItem.lines,
        lineGenerators: cacheItem.lineGenerators
      };
    }


  };
})(window);
