---
title: "Statistik & Datenauswertung: Grundlagen fürs Analytik-Praktikum"
author: "Gerrit Renner"
keywords: ["Mittelwert", "Standardabweichung", "Konfidenzintervall", "Regression", "Kalibration", "LOD", "LOQ", "Standardaddition", "Fehlerfortpflanzung", "Kinetik"]
requirements: ["Mean Values", "Variance", "Distributions", "Hypothesis Testing"]
description: "Logisch aufgebautes Grundlagenkapitel, um alle Praktikumsversuche statistisch und auswertungsseitig sicher bearbeiten zu können."
---
<!-- End of metadata -->

<!-- .slide:id="ap-intro" -->
## Wozu dieses Kapitel?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Liefert alle Basisbausteine für Auswertung vor den Versuchen
-! Unabhängig von einzelnen Experimenten, aber auf HPLC/GC/ICP-OES/LC-MS anwendbar
-! Fokus auf: Mittelwerte, Streuung, Regression, Kalibration, Grenzen, Fehlerfortpflanzung
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="background:#0d2236; color:#dff3ff; padding:12px; border-radius:10px; border:1px solid #1f6ea8;">
<b>Leitfrage:</b> Ist mein beobachteter Effekt grösser als mein Fehler und statistisch abgesichert?<br>
Wenn ja: wie präzise? Wenn nein: welche Grenze oder Methode begrenzt mich?
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-signal-builder" -->
## Messsignal: Bausteine interaktiv
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Basislinie: Detektor-Offset/Drift (Schalter)
-! Analytsignal: gesuchter Peak (immer an, Referenz)
-! Matrix-Interferenz: überlagerter Peak aus Probe (Schalter)
-! Rauschen: zufällige Schwankung des Detektors (Schalter)
-! Solide Linie = Gesamtsignal; gestrichelte Linie = reines Analytsignal
-: Kippschalter links, großes Diagramm rechts für direkte Wirkung
<div id="ap-signal-controls" style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; max-width: 230px;">
  <button data-id="baseline" data-active="true" style="padding: 8px 10px; border-radius: 12px; border: 1px solid #1f6ea8; background:#123556; color:#dfefff; text-align:left; cursor:pointer;">⏻ Basislinie: an</button>
  <button data-id="matrix" data-active="true" style="padding: 8px 10px; border-radius: 12px; border: 1px solid #1f6ea8; background:#123556; color:#dfefff; text-align:left; cursor:pointer;">⏻ Matrix-Interferenz: an</button>
  <button data-id="noise" data-active="true" style="padding: 8px 10px; border-radius: 12px; border: 1px solid #1f6ea8; background:#123556; color:#dfefff; text-align:left; cursor:pointer;">⏻ Rauschen: an</button>
</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-signal-panel" style="width: 600px; height: 420px; margin: 0 auto;"></div>

<script>
(function() {
  const ensureD3 = async () => {
    if (window.d3) return window.d3;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.d3;
  };

  const init = async () => {
    const d3 = await ensureD3();
    const container = d3.select('#ap-signal-panel');
    if (container.empty()) return;
    const width = 600, height = 400, margin = {top: 20, right: 20, bottom: 40, left: 55};
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#0d2236')
      .style('border-radius', '10px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.35)');

    const x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([-0.2, 1.4]).range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3.axisLeft(y).ticks(6);
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text').attr('fill', '#cfe8ff');
    svg.selectAll('g.tick line').attr('stroke', '#2f4b66');
    svg.selectAll('path.domain').attr('stroke', '#3d678a');
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll('text').attr('fill', '#cfe8ff');

    const label = (txt, xPos, yPos, rotate=false) => {
      const t = svg.append('text')
        .attr('x', xPos)
        .attr('y', yPos)
        .attr('fill', '#cfe8ff')
        .attr('text-anchor', 'middle')
        .text(txt);
      if (rotate) t.attr('transform', `rotate(-90 ${xPos} ${yPos})`);
    };
    label('Zeit / Retentionsvolumen (a.u.)', width/2, height - 8);
    label('Signal (AU)', 16, height/2, true);

    const lineTotal = svg.append('path').attr('stroke', '#8fe1ff').attr('stroke-width', 3).attr('fill', 'none');
    const lineAnalyte = svg.append('path').attr('stroke', '#ffd76f').attr('stroke-width', 2).attr('fill', 'none').attr('stroke-dasharray', '6,4');

    const toggles = [
      {id:'baseline', label:'Basislinie', active:true},
      {id:'matrix', label:'Matrix-Interferenz', active:true},
      {id:'noise', label:'Rauschen', active:true}
    ];

    const controls = d3.select('#ap-signal-controls');
    controls.selectAll('button').each(function() {
      const btn = d3.select(this);
      const id = btn.attr('data-id');
      const t = toggles.find(x => x.id === id);
      if (!t) return;
      btn.on('click', function() {
        t.active = !t.active;
        btn.attr('data-active', t.active ? 'true' : 'false');
        btn.text(`⏻ ${t.label}: ${t.active ? 'an' : 'aus'}`);
        this.style.background = t.active ? '#123556' : '#17293b';
        update();
      });
    });

    const n = 200;
    const xs = d3.range(n).map(i => i/(n-1));

    const gaussian = (x0, sigma, amp) => xs.map(xv => amp * Math.exp(-0.5 * Math.pow((xv - x0)/sigma, 2)));
    const analyte = gaussian(0.45, 0.05, 1.0);
    const interference = gaussian(0.72, 0.06, 0.35);
    const baseline = xs.map(xv => 0.12 + 0.05*Math.sin(6*xv));

    const update = () => {
      const noise = xs.map(()=> d3.randomNormal(0, 0.02)());
      const total = xs.map((xv, i) => {
        let s = 0;
        if (toggles.find(t=>t.id==='baseline').active) s += baseline[i];
        s += analyte[i]; // analyte always on
        if (toggles.find(t=>t.id==='matrix').active) s += interference[i];
        if (toggles.find(t=>t.id==='noise').active) s += noise[i];
        return s;
      });

      const lineGen = d3.line()
        .x((d,i)=> x(xs[i]))
        .y(d=> y(d))
        .curve(d3.curveMonotoneX);

      lineTotal.attr('d', lineGen(total));
      lineAnalyte.attr('d', lineGen(analyte));
    };

    update();
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-means" -->
## Mittelwerte: wann welcher?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Arithmetisches Mittel**  
-! Standardfall (Konzentrationen, Peakflächen, Signale)
-! \(\bar{x} = \frac{1}{n}\sum x_i\)

**Median**  
-! Robust gegen Ausreisser  
-! Nutzen, wenn Ausreisser sichtbar sind

**Geometrisches Mittel**  
-! Multiplikative Prozesse (Verdünnung, Wachstum, pH)
-! \((\prod x_i)^{1/n}\)

**Harmonisches Mittel**  
-! Ratenprozesse; selten relevant, der Vollständigkeit halber
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="background:#10283f; color:#e8f4ff; padding:12px; border-radius:8px;">
<b>Praxiswahl:</b><br>
• Keine klaren Ausreisser → arithmetisch<br>
• Offene Ausreisser/Verdacht → Median checken<br>
• pH/Verhältnisse → geometrisch prüfen<br>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-means-example" -->
## Beispiel: Ausreisser vs. Median
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Messreihe (mg/L): 10.1, 10.0, 9.9, 10.2, 10.1, 14.5  
-! Arithmetisch: 10.8 → hochgezogen  
-! Median: 10.1 → robust  
-: Entscheidung: Ausreisser prüfen/entfernen? Median berichtbar als Robust-Check
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-means-d3"></div>

<script>
(function() {
  const init = () => {
    const data = [10.1, 10.0, 9.9, 10.2, 10.1, 14.5];
    const sorted = [...data].sort((a,b)=>a-b);
    const median = (sorted[2] + sorted[3]) / 2;
    const mean = data.reduce((a,b)=>a+b,0)/data.length;
    const outlier = 14.5;
    const container = document.getElementById('ap-means-d3');
    if (!container) return;
    const width = container.clientWidth || 500;
    const height = 230;
    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = '#0d2236';
    svg.style.borderRadius = '8px';
    container.innerHTML = '';
    container.appendChild(svg);
    const xScale = (d,i)=> margin.left + i*(width - margin.left - margin.right)/(data.length-1);
    const yMin = 9.5, yMax = 15;
    const yScale = (d)=> height - margin.bottom - (d - yMin)/(yMax - yMin)*(height - margin.top - margin.bottom);
    data.forEach((d,i)=>{
      const circle = document.createElementNS(svg.namespaceURI,'circle');
      circle.setAttribute('cx', xScale(d,i));
      circle.setAttribute('cy', yScale(d));
      circle.setAttribute('r', 8);
      circle.setAttribute('fill', d===outlier ? '#ff8f70' : '#8fe1ff');
      circle.setAttribute('stroke', '#1a4d7a');
      circle.setAttribute('stroke-width','1.5');
      svg.appendChild(circle);
    });
    const line = (val,color,labelY) => {
      const l = document.createElementNS(svg.namespaceURI,'line');
      l.setAttribute('x1', margin.left);
      l.setAttribute('x2', width - margin.right);
      l.setAttribute('y1', yScale(val));
      l.setAttribute('y2', yScale(val));
      l.setAttribute('stroke', color);
      l.setAttribute('stroke-width', '2');
      l.setAttribute('stroke-dasharray', '6,4');
      svg.appendChild(l);
      const t = document.createElementNS(svg.namespaceURI,'text');
      t.setAttribute('x', width - margin.right - 6);
      t.setAttribute('y', yScale(val) - labelY);
      t.setAttribute('fill', color);
      t.setAttribute('text-anchor','end');
      t.setAttribute('font-size','12');
      svg.appendChild(t);
      return t;
    };
    const tMean = line(mean,'#8fe1ff',6);
    tMean.textContent = `Mean ${mean.toFixed(2)}`;
    const tMed = line(median,'#ffd76f',-6);
    tMed.textContent = `Median ${median.toFixed(2)}`;
    const xLabel = document.createElementNS(svg.namespaceURI,'text');
    xLabel.setAttribute('x', width/2);
    xLabel.setAttribute('y', height-10);
    xLabel.setAttribute('fill','#cfe8ff');
    xLabel.setAttribute('text-anchor','middle');
    xLabel.textContent = 'Messindex';
    svg.appendChild(xLabel);
    const yLabel = document.createElementNS(svg.namespaceURI,'text');
    yLabel.setAttribute('x', 12);
    yLabel.setAttribute('y', height/2);
    yLabel.setAttribute('fill','#cfe8ff');
    yLabel.setAttribute('text-anchor','middle');
    yLabel.setAttribute('font-size','12');
    yLabel.setAttribute('transform', `rotate(-90 12 ${height/2})`);
    yLabel.textContent = 'mg/L';
    svg.appendChild(yLabel);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-spread" -->
## Streuung & Unsicherheit
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Standardabweichung (SD)**  
-! Streuung der Einzelmesswerte

**Standardfehler (SE)**  
-! Unsicherheit des Mittelwerts  
-! \(SE = SD/\sqrt{n}\)

**Konfidenzintervall 95 %**  
-! \(\bar{x} \pm t_{n-1;0.975} \cdot SE\)  
-! Für Stichproben; bei Parametern (Steigung m, Achsenabschnitt b) gleiches Prinzip
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-basic-stats"></div>

<script>
(function() {
  const init = async () => {
    const code = `values <- c(9.8, 10.1, 9.9, 10.3, 10.0, 10.2)
n <- length(values)
mu <- mean(values)
sd_val <- sd(values)
se <- sd_val / sqrt(n)
tval <- qt(0.975, df = n - 1)
ci <- mu + c(-1, 1) * tval * se
data.frame(
  n = n,
  mean = round(mu, 3),
  sd = round(sd_val, 3),
  se = round(se, 3),
  ci95_lower = round(ci[1], 3),
  ci95_upper = round(ci[2], 3)
)`;

    const fallback = () => `[Simulated]
n mean sd se ci95_lower ci95_upper
6 10.050 0.187 0.076 9.871 10.229`;

    const helper = await window.ensureWebRHelper();
    await helper.quickSetup('ap-basic-stats', code, 'ap-spread', fallback);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-regression" -->
## Lineare Regression (Kalibration basis)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Modell: \(y = m \cdot c + b\) (Signal vs. Konzentration)
-! Berichte immer: m, b, Standardfehler von m & b, R²
-! Residuen müssen zufällig um 0 streuen
-! Fächerform → Varianz ändert sich (ggf. Transformation)
-! Kurvenform → Modell passt nicht oder Bereich zu gross
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-calibration"></div>

<script>
(function() {
  const init = async () => {
    const code = `std <- data.frame(
  c_mgL = c(0, 0.5, 1, 2, 4, 6),
  signal = c(0.02, 0.50, 1.02, 1.96, 3.95, 5.92)
)
fit <- lm(signal ~ c_mgL, data = std)
blank_sd <- 0.05
slope <- coef(fit)["c_mgL"]
intercept <- coef(fit)["(Intercept)"]
r2 <- summary(fit)$r.squared
lod <- 3 * blank_sd / slope
loq <- 10 * blank_sd / slope
data.frame(
  slope = round(slope, 3),
  intercept = round(intercept, 3),
  r2 = round(r2, 4),
  lod_mgL = round(lod, 3),
  loq_mgL = round(loq, 3)
)`;

    const fallback = () => `[Simulated]
slope intercept r2 lod_mgL loq_mgL
0.984 0.018 0.9992 0.152 0.507`;

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'ap-calibration',
      code,
      slideId: 'ap-regression',
      fallback,
      runLabel: 'Regression berechnen',
      minHeight: '140px'
    });
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-regression-plot" -->
## Visuelle Kalibration (HPLC-UV Beispiel)
<!-- layout={rows: 1, columns: 1} -->
<div id="ap-calib-d3"></div>

<script>
(function() {
  const init = () => {
    const points = [
      {c:0, y:0.02}, {c:0.5, y:0.50}, {c:1, y:1.02},
      {c:2, y:1.96}, {c:4, y:3.95}, {c:6, y:5.92}
    ];
    const slope = 0.984, intercept = 0.018;
    const container = document.getElementById('ap-calib-d3');
    if (!container) return;
    const width = container.clientWidth || 760;
    const height = 320;
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = '#0d2236';
    svg.style.borderRadius = '10px';
    container.innerHTML = '';
    container.appendChild(svg);
    const xMax = 6.2, yMax = 6.3;
    const xScale = (v)=> margin.left + v/xMax * (width - margin.left - margin.right);
    const yScale = (v)=> height - margin.bottom - v/yMax * (height - margin.top - margin.bottom);
    // axes
    const axisColor = '#3d678a';
    const xAxis = document.createElementNS(svg.namespaceURI,'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('x2', width - margin.right);
    xAxis.setAttribute('y1', height - margin.bottom);
    xAxis.setAttribute('y2', height - margin.bottom);
    xAxis.setAttribute('stroke', axisColor);
    xAxis.setAttribute('stroke-width','2');
    svg.appendChild(xAxis);
    const yAxis = document.createElementNS(svg.namespaceURI,'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('y2', height - margin.bottom);
    yAxis.setAttribute('stroke', axisColor);
    yAxis.setAttribute('stroke-width','2');
    svg.appendChild(yAxis);
    // fit line
    const line = document.createElementNS(svg.namespaceURI,'line');
    line.setAttribute('x1', xScale(0));
    line.setAttribute('y1', yScale(intercept));
    line.setAttribute('x2', xScale(xMax));
    line.setAttribute('y2', yScale(slope * xMax + intercept));
    line.setAttribute('stroke', '#8fe1ff');
    line.setAttribute('stroke-width','3');
    svg.appendChild(line);
    // LOD/LOQ bands
    const lod = 0.152, loq = 0.507;
    const band = (val, color, label) => {
      const yVal = slope * val + intercept;
      const g = document.createElementNS(svg.namespaceURI,'g');
      const l = document.createElementNS(svg.namespaceURI,'line');
      l.setAttribute('x1', xScale(val));
      l.setAttribute('x2', xScale(val));
      l.setAttribute('y1', yScale(0));
      l.setAttribute('y2', yScale(yVal));
      l.setAttribute('stroke', color);
      l.setAttribute('stroke-width','2');
      l.setAttribute('stroke-dasharray','4,3');
      g.appendChild(l);
      const t = document.createElementNS(svg.namespaceURI,'text');
      t.setAttribute('x', xScale(val) + 4);
      t.setAttribute('y', yScale(yVal) - 6);
      t.setAttribute('fill', color);
      t.setAttribute('font-size','12');
      t.textContent = `${label} ${val.toFixed(3)} mg/L`;
      g.appendChild(t);
      svg.appendChild(g);
    };
    band(lod,'#ffd76f','LOD');
    band(loq,'#ff9b68','LOQ');
    // points
    points.forEach(p=>{
      const c = document.createElementNS(svg.namespaceURI,'circle');
      c.setAttribute('cx', xScale(p.c));
      c.setAttribute('cy', yScale(p.y));
      c.setAttribute('r', 7);
      c.setAttribute('fill','#8fe1ff');
      c.setAttribute('stroke','#1a4d7a');
      c.setAttribute('stroke-width','1.5');
      svg.appendChild(c);
    });
    // labels
    const xl = document.createElementNS(svg.namespaceURI,'text');
    xl.setAttribute('x', width/2);
    xl.setAttribute('y', height - 12);
    xl.setAttribute('fill','#cfe8ff');
    xl.setAttribute('text-anchor','middle');
    xl.textContent = 'Konzentration [mg/L]';
    svg.appendChild(xl);
    const yl = document.createElementNS(svg.namespaceURI,'text');
    yl.setAttribute('x', 18);
    yl.setAttribute('y', height/2);
    yl.setAttribute('fill','#cfe8ff');
    yl.setAttribute('text-anchor','middle');
    yl.setAttribute('transform', `rotate(-90 18 ${height/2})`);
    yl.textContent = 'Signal [AU]';
    svg.appendChild(yl);
    const info = document.createElementNS(svg.namespaceURI,'text');
    info.setAttribute('x', width - margin.right - 6);
    info.setAttribute('y', margin.top + 14);
    info.setAttribute('fill','#9ad0ff');
    info.setAttribute('text-anchor','end');
    info.setAttribute('font-size','12');
    info.textContent = `m=${slope.toFixed(3)}, b=${intercept.toFixed(3)}, R²≈1.000`;
    svg.appendChild(info);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /layout -->

---

<!-- .slide:id="ap-residuals" -->
## Residuenanalyse: Linearität prüfen
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! R² allein reicht nicht
-! Residuen ohne Trend? → Modell ok
-! U-Form → Bereich zu gross oder nicht linear
-! Fächerform → Varianz nicht konstant, ggf. Transformation/Gewichtung
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-residual-plot"></div>

<script>
(function() {
  const data = [
    {c: 0, resid: 0.03},
    {c: 0.5, resid: -0.01},
    {c: 1, resid: 0.00},
    {c: 2, resid: -0.04},
    {c: 4, resid: 0.05},
    {c: 6, resid: -0.03}
  ];
  const init = () => {
    const container = document.getElementById('ap-residual-plot');
    if (!container) return;
    const width = container.clientWidth || 480;
    const height = 240;
    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = '#0d2236';
    svg.style.borderRadius = '8px';
    svg.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    container.innerHTML = '';
    container.appendChild(svg);
    const xScale = (c) => margin.left + (c / 6) * (width - margin.left - margin.right);
    const yScale = (r) => height - margin.bottom - ((r + 0.08) / 0.16) * (height - margin.top - margin.bottom);
    const axis = document.createElementNS(svg.namespaceURI, 'line');
    axis.setAttribute('x1', margin.left);
    axis.setAttribute('x2', width - margin.right);
    axis.setAttribute('y1', yScale(0));
    axis.setAttribute('y2', yScale(0));
    axis.setAttribute('stroke', '#3d678a');
    axis.setAttribute('stroke-width', '2');
    svg.appendChild(axis);
    data.forEach(d => {
      const circle = document.createElementNS(svg.namespaceURI, 'circle');
      circle.setAttribute('cx', xScale(d.c));
      circle.setAttribute('cy', yScale(d.resid));
      circle.setAttribute('r', 6);
      circle.setAttribute('fill', '#8fe1ff');
      circle.setAttribute('stroke', '#1a4d7a');
      circle.setAttribute('stroke-width', '1.5');
      svg.appendChild(circle);
    });
    const label = document.createElementNS(svg.namespaceURI, 'text');
    label.setAttribute('x', width / 2);
    label.setAttribute('y', height - 10);
    label.setAttribute('fill', '#cfe8ff');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '12');
    label.textContent = 'Konzentration [mg/L]';
    svg.appendChild(label);
    const yLabel = document.createElementNS(svg.namespaceURI, 'text');
    yLabel.setAttribute('x', 16);
    yLabel.setAttribute('y', height / 2);
    yLabel.setAttribute('fill', '#cfe8ff');
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '12');
    yLabel.setAttribute('transform', `rotate(-90 16 ${height / 2})`);
    yLabel.textContent = 'Residuals [AU]';
    svg.appendChild(yLabel);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-calib-types" -->
## Kalibrationstechniken: wann welche?
<!-- layout={rows: 1, columns: 3} -->
<!-- position={row: 1, column: 1} -->
**Externe Kalibration**  
-! Standards messen, Gerade fitten, Probe einsetzen  
-! Schnell, wenig Aufwand  
-: Matrixeffekte möglich  
-: Typisch: HPLC, GC-MS, Fluoreszenz, einfache ICP-OES Matrizen
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Interne Kalibration**  
-! \(\frac{Signal_{Analyts}}{Signal_{IS}} = m \cdot c + b\)  
-! Korrigiert Injektionsvolumen/Drift  
-: Typisch: GC-MS, LC-MS
<!-- /position -->
<!-- position={row: 1, column: 3} -->
**Standardaddition**  
-! Probe aliquotieren, gestuft spike’n, auf Signal=0 extrapolieren  
-! Kompensiert Matrixeffekte, aber aufwändig  
-: Typisch: ICP-OES, schwierige Matrizen (Lebensmittel, Umwelt)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-lod-loq" -->
## LOD, LOQ, Erfassungsgrenze
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Formeln (linearer Fit)**  
-! Erfassung: \( \sigma_{blank}/m \)  
-! LOD: \( 3 \cdot \sigma_{blank}/m \)  
-! LOQ: \( 10 \cdot \sigma_{blank}/m \)  
-! \(\sigma_{blank}\) aus ≥10 Blindmessungen

**Bedeutung**  
-! Erfassung: Signal erahnbar  
-! LOD: von 0 unterscheidbar  
-! LOQ: präzise quantifizierbar
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="background:#0b2d40; color:#dff3ff; padding:12px; border-radius:10px; border:1px solid #1f6ea8;">
<b>Reporting:</b><br>
• Unterhalb LOQ: „Nachweisbar, aber nicht quantifizierbar“<br>
• Unterhalb LOD: „Nicht nachweisbar“<br>
• Immer Einheit angeben und Methode nennen (Blank-SD, m)
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-lod-visual" -->
## LOD/LOQ visuell verstehen
<!-- layout={rows: 1, columns: 1} -->
<div id="ap-lod-d3"></div>

<script>
(function() {
  const init = () => {
    const container = document.getElementById('ap-lod-d3');
    if (!container) return;
    const width = container.clientWidth || 640;
    const height = 240;
    const margin = {top: 20, right: 20, bottom: 45, left: 55};
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = '#0d2236';
    svg.style.borderRadius = '10px';
    container.innerHTML = '';
    container.appendChild(svg);
    const lod = 0.15, loq = 0.51;
    const xMax = 1.2, yMax = 0.18;
    const xScale = (v)=> margin.left + v/xMax*(width - margin.left - margin.right);
    const yScale = (v)=> height - margin.bottom - v/yMax*(height - margin.top - margin.bottom);
    // noise band
    const band = document.createElementNS(svg.namespaceURI,'rect');
    band.setAttribute('x', margin.left);
    band.setAttribute('y', yScale(0.05*3)); // 3 sigma
    band.setAttribute('width', width - margin.left - margin.right);
    band.setAttribute('height', yScale(0) - yScale(0.05*3));
    band.setAttribute('fill', 'rgba(255,215,111,0.15)');
    band.setAttribute('stroke','rgba(255,215,111,0.35)');
    svg.appendChild(band);
    // LOQ band
    const band2 = document.createElementNS(svg.namespaceURI,'rect');
    band2.setAttribute('x', margin.left);
    band2.setAttribute('y', yScale(0.05*10)); // 10 sigma
    band2.setAttribute('width', width - margin.left - margin.right);
    band2.setAttribute('height', yScale(0.05*3) - yScale(0.05*10));
    band2.setAttribute('fill', 'rgba(255,155,104,0.15)');
    band2.setAttribute('stroke','rgba(255,155,104,0.35)');
    svg.appendChild(band2);
    // markers
    const mark = (x,label,color,yVal) => {
      const l = document.createElementNS(svg.namespaceURI,'line');
      l.setAttribute('x1', xScale(x));
      l.setAttribute('x2', xScale(x));
      l.setAttribute('y1', yScale(0));
      l.setAttribute('y2', yScale(yVal));
      l.setAttribute('stroke', color);
      l.setAttribute('stroke-width','2');
      l.setAttribute('stroke-dasharray','4,3');
      svg.appendChild(l);
      const t = document.createElementNS(svg.namespaceURI,'text');
      t.setAttribute('x', xScale(x) + 4);
      t.setAttribute('y', yScale(yVal) - 6);
      t.setAttribute('fill', color);
      t.setAttribute('font-size','12');
      t.textContent = label;
      svg.appendChild(t);
    };
    mark(lod,'LOD', '#ffd76f', 0.05*3);
    mark(loq,'LOQ', '#ff9b68', 0.05*10);
    // sample points
    const samples = [0.05, 0.16, 0.32, 0.55, 0.8].map(v=>({
      x: v,
      y: 0.018 + 0.14*v + (Math.random()*0.01)
    }));
    samples.forEach(s=>{
      const c = document.createElementNS(svg.namespaceURI,'circle');
      c.setAttribute('cx', xScale(s.x));
      c.setAttribute('cy', yScale(s.y));
      c.setAttribute('r', 7);
      c.setAttribute('fill', s.x < lod ? '#6c7a8a' : (s.x < loq ? '#ffd76f' : '#8fe1ff'));
      c.setAttribute('stroke', '#1a4d7a');
      c.setAttribute('stroke-width','1.5');
      svg.appendChild(c);
    });
    const xLab = document.createElementNS(svg.namespaceURI,'text');
    xLab.setAttribute('x', width/2);
    xLab.setAttribute('y', height-12);
    xLab.setAttribute('fill','#cfe8ff');
    xLab.setAttribute('text-anchor','middle');
    xLab.textContent = 'Konzentration [mg/L]';
    svg.appendChild(xLab);
    const yLab = document.createElementNS(svg.namespaceURI,'text');
    yLab.setAttribute('x', 16);
    yLab.setAttribute('y', height/2);
    yLab.setAttribute('fill','#cfe8ff');
    yLab.setAttribute('text-anchor','middle');
    yLab.setAttribute('transform', `rotate(-90 16 ${height/2})`);
    yLab.textContent = 'Signal [AU]';
    svg.appendChild(yLab);
    const note = document.createElementNS(svg.namespaceURI,'text');
    note.setAttribute('x', margin.left + 6);
    note.setAttribute('y', margin.top + 14);
    note.setAttribute('fill','#9ad0ff');
    note.setAttribute('font-size','12');
    note.textContent = 'Gelb = knapp über LOD; Orange = quantifizierbar (LOQ+); Blau = sicherer Bereich';
    svg.appendChild(note);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>

---

<!-- .slide:id="ap-error-prop" -->
## Fehlerfortpflanzung (kurz)
-! Allgemein: \(\sigma_f = \sqrt{\sum (\partial f/\partial x_i \cdot \sigma_{x_i})^2}\)
-! Produkte/Quotienten: relative Abweichungen addieren in Quadraten
-! Logarithmen: \(\sigma_{\ln x} = \sigma_x / x\)
-: Anwenden bei Konzentrationsberechnung (Kalibriergerade), internen Standards, Kinetik (ln(c))

---

<!-- .slide:id="ap-chrom-spec" -->
## Chromatographie & Spektren: Kennzahlen
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Chromatographie**  
-! Retentionszeit t_R, Totzeit t_0, adjustierte Zeit t_R'  
-! Retentionsfaktor k, Selektivität α  
-! Auflösung R_s, Peakbreite, Theorieplatten N  
-: Dokumentieren für Peaktrennung, Methode vergleichen
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Spektren**  
-! Lambert-Beer: A = ε · l · c (Linearität im niedrigen Bereich)  
-! Fluoreszenz: linear nur im niedrigen Bereich; Selbstabsorption beachten  
-! MS: Intensitätsverhältnisse, interne Standards gegen Drift
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-kinetics" -->
## Kinetik (Pseudo-1. Ordnung)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Modell: \(\ln c = -k t + \ln c_0\)
-! Steigung = -k, KI aus Regression
-! Halbwertszeit \(t_{1/2} = \ln(2)/k\)
-! Residuen prüfen; bei Krümmung anderes Modell/Zeitfenster
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ap-kinetics"></div>

<script>
(function() {
  const init = async () => {
    const code = `kin <- data.frame(
  time_min = c(0, 2, 5, 10, 15, 20),
  conc_mgL = c(12.0, 9.1, 6.4, 3.3, 2.1, 1.3)
)
fit <- lm(log(conc_mgL) ~ time_min, data = kin)
k <- -coef(fit)["time_min"]
ci_k <- confint(fit, "time_min", level = 0.95)
t_half <- log(2) / k
r2 <- summary(fit)$r.squared
data.frame(
  k_per_min = round(k, 3),
  k_ci95_lower = round(-ci_k[2], 3),
  k_ci95_upper = round(-ci_k[1], 3),
  t_half_min = round(t_half, 2),
  r2 = round(r2, 4)
)`;

    const fallback = () => `[Simulated]
k_per_min k_ci95_lower k_ci95_upper t_half_min r2
0.099 0.092 0.107 7.00 0.9942`;

    const helper = await window.ensureWebRHelper();
    await helper.quickSetup('ap-kinetics', code, 'ap-kinetics', fallback);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ap-checklist" -->
## Checkliste für Protokolle
-! Rohdaten tabellarisch mit Einheiten; n nennen
-! Mittelwert, SD, SE, 95 %-KI aus Replikaten angeben
-! Kalibration: m, b, Standardfehler, R², Residuenplot; LOD/LOQ mit Formel
-! Probenwert mit Unsicherheit/KI; Einordnung zu LOQ/LOD
-! Methode wählen/begründen (extern, intern, Standardaddition) und Matrixeffekte diskutieren
-! Chrom/Spec: k, R_s, Peakform bzw. Linearität des Spektrums dokumentieren
-! Kinetik: k, t_1/2, R², Residuen; Modellannahmen benennen
