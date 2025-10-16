(function (global) {
    /**
     * Collection of small convenience helpers that keep the chart creation code
     * in the slide Markdown compact and consistent.
     */
    global.d3Utils = {

    /**
     * Creates a fresh SVG container with the xkcd wiggle filter attached.
     * @param {string} containerId - DOM id of the container element.
     * @param {number} width - Chart width.
     * @param {number} height - Chart height.
     * @param {{top:number,right:number,bottom:number,left:number}} margin - Margin object for the chart.
     * @returns {d3.Selection} The translated group that acts as drawing root.
     */
    createSVG: function(containerId, width, height, margin) {
    d3.select(`#${containerId}`).selectAll("*").remove(); // Clear existing content

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add wiggle filter for xkcd style
    svg.append("defs").append("filter")
        .attr("id", "wiggle-filter")
        .html(`
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        `);

    return svg;
},

    /**
     * Creates x/y scales for an XY dataset with optional domain overrides.
     * @param {Array<Object>} data - Source data.
     * @param {number} width - Inner chart width.
     * @param {number} height - Inner chart height.
     * @param {string} xKey - Property containing the x-value.
     * @param {string} yKey - Property containing the y-value.
     * @param {?number} xMin - Optional lower bound for x.
     * @param {?number} xMax - Optional upper bound for x.
     * @param {?number} yMin - Optional lower bound for y.
     * @param {?number} yMax - Optional upper bound for y.
     * @returns {{x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>}}
     */
    createXYScales: function(data, width, height, xKey, yKey, xMin = null, xMax = null, yMin = null, yMax = null) {
    const x = d3.scaleLinear()
        .domain(xMin !== null && xMax !== null ? [xMin, xMax] : d3.extent(data, d => d[xKey]))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(yMin !== null && yMax !== null ? [yMin, yMax] : [0, d3.max(data, d => d[yKey])])
        .nice()
        .range([height, 0]);

    return { x, y };
},


    /**
     * Builds the grouped bar chart scales.
     * @param {Array<Object>} data - Chart data.
     * @param {Array<string>} metals - Keys used for the inner scale.
     * @param {number} width - Inner width.
     * @param {number} height - Inner height.
     * @param {?number} yMin - Optional min y.
     * @param {?number} yMax - Optional max y.
     * @returns {{x0: d3.ScaleBand<string>, x1: d3.ScaleBand<string>, y: d3.ScaleLinear<number, number>}}
     */
    createScales: function(data, metals, width, height, yMin = null, yMax = null) {
    const x0 = d3.scaleBand()
        .domain(data.map(d => d.sample))
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(metals)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain(yMin !== null && yMax !== null ? [yMin, yMax] : [0, d3.max(data, d => Math.max(...metals.map(metal => d[metal])))])
        .nice()
        .range([height, 0]);

    return { x0, x1, y };
},

    /**
     * Renders axes with the xkcd look.
     * @param {d3.Selection} svg - Root group returned by createSVG.
     * @param {d3.ScaleBand|d3.ScaleLinear} xScale - X axis scale.
     * @param {d3.ScaleLinear<number, number>} yScale - Y axis scale.
     * @param {number} width - Inner width.
     * @param {number} height - Inner height.
     * @param {{top:number,right:number,bottom:number,left:number}} margin - Margins.
     * @param {string} xLabel - Caption for x axis.
     * @param {string} yLabel - Caption for y axis.
     */
    addAxes: function (svg, xScale, yScale, width, height, margin, xLabel, yLabel) {
    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .attr("class", "axis xkcd-line")
        .attr("font-family", "Humor Sans")
        .attr("font-size", "large")
        .append("text")
        .attr("y", margin.bottom - 10)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(xLabel);

    // Y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .attr("class", "axis xkcd-line")
        .attr("font-family", "Humor Sans")
        .attr("font-size", "large")
        .append("text")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .text(yLabel);
},

    /**
     * Adds a simple categorical legend.
     * @param {d3.Selection} svg - Root group.
     * @param {Array<string>} metals - Keys to render.
     * @param {d3.ScaleOrdinal<string, string>} colorScale - Shared color scale.
     * @param {number} width - Inner width.
     */
    addLegend: function (svg, metals, colorScale, width) {
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 10}, 0)`)
        .selectAll("g")
        .data(metals)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));

    legend.append("text")
        .attr("font-family", "Humor Sans")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d);
},

    /**
     * Draws horizontal and vertical helper grid lines.
     * @param {d3.Selection} svg - Root group.
     * @param {d3.ScaleBand|d3.ScaleLinear} xScale - X scale.
     * @param {d3.ScaleLinear<number, number>} yScale - Y scale.
     * @param {number} width - Inner width.
     * @param {number} height - Inner height.
     */
    addGrid: function (svg, xScale, yScale, width, height) {
    // Add horizontal grid lines with xkcd style
    svg.append("g")
        .attr("class", "grid-line")
        .style("filter", "url(#wiggle-filter)") // Apply xkcd wiggle filter
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat("")
        );

    // Add vertical grid lines with xkcd style
    svg.append("g")
        .attr("class", "grid-line")
        .style("filter", "url(#wiggle-filter)") // Apply xkcd wiggle filter
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat("")
        );
},


    /**
     * High-level grouped bar chart helper with the project’s default styling.
     * @param {string} containerId - Target container id.
     * @param {Array<Object>} data - Dataset to render.
     * @param {string} xLabel - X axis label.
     * @param {string} yLabel - Y axis label.
     * @param {?number} yMin - Optional y lower bound.
     * @param {?number} yMax - Optional y upper bound.
     */
    createGroupedBarChart:function (containerId, data, xLabel, yLabel, yMin = null, yMax = null) {
    // Chart dimensions
    const width = 300;
    const height = 300;
    const margin = { top: 20, right: 50, bottom: 50, left: 70 };

    // Create SVG container with wiggle filter
    const svg = this.createSVG(containerId, width, height, margin);

    // Extract metal keys dynamically
    const metals = Object.keys(data[0]).filter(key => key !== 'sample');

    // Create scales
    const { x0, x1, y } = this.createScales(data, metals, width, height, yMin, yMax);

    // Color scale for metals
    const color = d3.scaleOrdinal()
        .domain(metals)
        .range(["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"]);

    // Add axes with xkcd styling
    this.addAxes(svg, x0, y, width, height, margin, xLabel, yLabel);

    // Add bars for each metal within each sample
    svg.selectAll("g.layer")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x0(d.sample)},0)`)
        .selectAll("rect")
        .data(d => metals.map(metal => ({ key: metal, value: d[metal] })))
        .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key))
        .attr("class", "bar") // Adds xkcd-style stroke to bars
        .style("filter", "url(#wiggle-filter)"); // Apply wiggle filter

    // Add legend with xkcd styling
    this.addLegend(svg, metals, color, width);
},

    /**
     * Draws an XY chart and optionally returns the scales for additional series.
     * @param {string} containerId - Target container id.
     * @param {Array<Object>} data - Series data.
     * @param {string} xKey - Property name for x values.
     * @param {string} yKey - Property name for y values.
     * @param {string} xLabel - X axis caption.
     * @param {string} yLabel - Y axis caption.
     * @param {boolean} showLines - Whether to draw the connecting line.
     * @param {boolean} showMarkers - Whether to draw circular markers.
     * @param {boolean} showGrid - Whether to draw grid lines.
     * @param {?number} xMin - Optional x min.
     * @param {?number} xMax - Optional x max.
     * @param {?number} yMin - Optional y min.
     * @param {?number} yMax - Optional y max.
     * @param {number} w - Chart width.
     * @param {number} h - Chart height.
     * @param {boolean} hideAxes - Skip axis rendering.
     * @returns {{xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>}}
     */
    createXYLineChart: function(containerId, data, xKey, yKey, xLabel, yLabel, showLines = true, showMarkers = false, showGrid = false, xMin = null, xMax = null, yMin = null, yMax = null, w = 300, h = 400, hideAxes = false) {
    // Chart dimensions
    const width = w;
    const height = h;
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };

    // Create SVG container with wiggle filter
    const svg = this.createSVG(containerId, width, height, margin);

    // Create scales
    const { x, y } = this.createXYScales(data, width, height, xKey, yKey, xMin, xMax, yMin, yMax);

    // Add axes with xkcd styling
    if (!hideAxes) {
        this.addAxes(svg, x, y, width, height, margin, xLabel, yLabel);
    }

    // Optionally add grid
    if (showGrid) {
        this.addGrid(svg, x, y, width, height);
    }

    // Define line generator
    const line = d3.line()
        .x(d => x(d[xKey]))
        .y(d => y(d[yKey]))
        .curve(d3.curveCatmullRom.alpha(0.5)); // Smooth line with curve

    // Draw line with xkcd styling
    if (showLines) {
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 4)
            .attr("class", "xkcd-line")
            .style("filter", "url(#wiggle-filter)") // Apply wiggle filter
            .attr("d", line);
    }

    // Optionally add markers
    if (showMarkers) {
        svg.selectAll(".marker")
            .data(data)
            .join("circle")
            .attr("class", "marker xkcd-line")
            .attr("cx", d => x(d[xKey]))
            .attr("cy", d => y(d[yKey]))
            .attr("r", 7)
            .attr("fill", "#ef476f")
            .style("filter", "url(#wiggle-filter)"); // Apply wiggle filter
    }

    return { xScale: x, yScale: y };
},

    /**
     * Adds another series to an existing XY chart created via createXYLineChart.
     * @param {string} containerId - Target container id.
     * @param {Array<Object>} data - Series data.
     * @param {d3.ScaleLinear<number, number>} xScale - Shared x scale.
     * @param {d3.ScaleLinear<number, number>} yScale - Shared y scale.
     * @param {string} xKey - Property name for x.
     * @param {string} yKey - Property name for y.
     * @param {string} [lineColor="steelblue"] - Stroke color.
     * @param {string} [markerColor="#ef476f"] - Marker fill color.
     * @param {boolean} [showLine=true] - Whether to draw the line.
     * @param {boolean} [showMarkers=true] - Whether to draw markers.
     * @param {number} [lineWidth=4] - Line width in px.
     * @param {"curve"|"dashed"} [lineStyle="curve"] - Visual cue for differentiation.
     */
    addPlotSeries: function(containerId, data, xScale, yScale, xKey, yKey, lineColor = "steelblue", markerColor = "#ef476f", showLine = true, showMarkers = true, lineWidth=4, lineStyle = "curve") {
    const svg = d3.select(`#${containerId} svg g`); // Wählt das bestehende `g`-Element aus

    const line = d3.line()
        .x(d => xScale(d[xKey]))
        .y(d => yScale(d[yKey]))
        .curve(d3.curveCatmullRom.alpha(0.5));

    // Linie hinzufügen, falls aktiviert
    if (showLine) {
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", lineWidth)
            .style("filter", "url(#wiggle-filter)")
            .attr("d", line)
            .style("stroke-dasharray", lineStyle === "curve" ? "0" : "5,5")
            .raise(); // Bringt das neue Element ganz nach oben
    }

    // Marker hinzufügen, falls aktiviert
    if (showMarkers) {
        svg.selectAll(null) // Leere Auswahl, um neue Elemente hinzuzufügen
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[xKey]))
            .attr("cy", d => yScale(d[yKey]))
            .attr("r", 7)
            .attr("fill", markerColor)
            .style("filter", "url(#wiggle-filter)")
            .raise(); // Bringt die neuen Punkte ganz nach oben
    }
},
    };
})(window);
  






















