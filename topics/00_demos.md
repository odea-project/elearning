# Demo 1
Slide 1 **bold** text or *italic* text

---
# Demo 2
1. Numbered list item 1
2. Numbered list item 2

Das ist eine Bullet-Liste:
- Bullet 1
- Bullet 2

---
# Demo 3
This is a table:
| Header 1 | Header 2 |
| -------- | -------- |
| Row 1    | Data 1   |
| Row 2    | Data 2   |

---
# Demo 4
This is an equation:
$$
erf(x) = \frac{2}{\sqrt{\pi}} \int_0^x e^{-t^2} dt
$$

---
# Demo 5
This is a code block:
```python
def hello_world():
  print("Hello, World!")

if __name__ == "__main__":
  hello_world()
```

---
# Demo 6
Here we use HTML to create a two column layout:
<div>
  <div class="leftBox">
    <p class="mainBullet">This is a left box</p>
    <p class="subBullet">with some text</p>
    </div>	
  <div class="spacer"></div>
  <div class="rightBox">
    and some data:
    <pre style="font-size: large;">
<code>x: [1, 2, 3, 4, 5]
y: [10, 20, 30, 40, 50]</code>
		</pre>
	</div>
</div>

--- 
<h1>Demo 7</h1>
<div id="pixel-chart"></div>
  <script>// NO BLANK LINES ALLOWED IN SCRIPT TAGS!!!
(function() {
  let divID = "pixel-chart";
  let sectionID = divID + "-slide";
  let myFig = null;
  let axesAlready = false;
  // Beispiel: 5 Datensätze (als statisch oder asynchron geladen)
  const sampleData1 = [
    { x: 0, y:  5 },
    { x: 1, y: 10 },
    { x: 2, y:  8 },
    { x: 3, y: 15 },
    { x: 4, y: 12 },
    { x: 5, y: 20 }
  ]; 
  // Angenommen, sampleData2 könnte aus CSV kommen – hier simuliert
  const sampleData2 = [
    { x: 0, y: 15 },
    { x: 1, y: 12 },
    { x: 2, y: 18 },
    { x: 3, y: 10 },
    { x: 4, y: 17 },
    { x: 5, y: 22 }
  ]; 
  // Beispielhafte weitere Datenspuren
  const sampleData3 = sampleData1.map(d => ({ x: d.x, y: d.y * 0.8 }));
  const sampleData4 = sampleData2.map(d => ({ x: d.x, y: d.y * 1.2 }));
  const sampleData5 = sampleData1.map(d => ({ x: d.x, y: d.y + 5 }));
  // Alle Datensätze in einem Array
  const dataSets = [
    { data: sampleData1, options: { curve: d3.curveNatural, lineColor: "#A0A", pointColor: "#F0F" } },
    { data: sampleData2, options: { curve: d3.curveNatural, lineColor: "#0A0", pointColor: "#0F0" } },
    { data: sampleData3, options: { curve: d3.curveBasis,   lineColor: "#00F", pointColor: "#F00" } },
    { data: sampleData4, options: { curve: d3.curveStep,    lineColor: "#F00", pointColor: "#00F" } },
    { data: sampleData5, options: { curve: d3.curveCardinal, lineColor: "#FF0", pointColor: "#0FF" } }
  ]; 
  // Listener an den Slidewechsel anfügen
  Reveal.addEventListener('slidechanged', event => {
    if (event.currentSlide.id === sectionID) {
      plotUtils.drawPixelChart(divID, dataSets);
      Reveal.layout();
    }
  });
  // Falls die dynamische Folie schon aktuell ist, Diagramm sofort zeichnen
  if (Reveal.getCurrentSlide() && Reveal.getCurrentSlide().id === sectionID) {
    plotUtils.drawPixelChart(divID, dataSets);
    Reveal.layout();
  }
})();
</script>
--- (id="pixel-chart-slide")