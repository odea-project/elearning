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
1 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]  
2 this is the second line  
3 this is the third line  
4 this is the fourth line  
5 this is the fifth line  
6 this is the sixth line  
7 this is the seventh line  
8 this is the eighth line  
9 this is the ninth line  
10 this is the tenth line  
11 this is the eleventh line  
12 this is the twelfth line  
13 this is the thirteenth line  
14 this is the fourteenth line  
15 this is the fifteenth line  
16 this is the sixteenth line: here the end of the slide still fits in. (16:9)
---
# Demo 4
1 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]  
2 this is the second line  
3 this is the third line  
4 this is the fourth line  
5 this is the fifth line  
6 this is the sixth line  
7 this is the seventh line  
8 this is the eighth line  
9 this is the ninth line  
10 this is the tenth line  
11 this is the eleventh line  
12 this is the twelfth line  
13 this is the thirteenth line  
14 this is the fourteenth line  
15 this is the fifteenth line  
16 this is the sixteenth line: here the end of the slide not fits in.    
17 this is the seventeenth line: but still is visible on screen. (16:9)
---
# Demo 5
1 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]  
2 this is the second line  
3 this is the third line  
4 this is the fourth line  
5 this is the fifth line  
6 this is the sixth line  
7 this is the seventh line  
8 this is the eighth line  
9 this is the ninth line  
10 this is the tenth line  
11 this is the eleventh line  
12 this is the twelfth line  
13 this is the thirteenth line  
14 this is the fourteenth line  
15 this is the fifteenth line  
16 this is the sixteenth line: here the end of the slide not fits in. (16:9)      
17 this is the seventeenth line: but still is visible on screen.  
18 <- this is the last line of this slide, which is not visible on screen.
---
# Demo 6
This is a table:
| Header 1 | Header 2 |
| -------- | -------- |
| Row 1    | Data 1   |
| Row 2    | Data 2   |

---
# Demo 7
This is an equation:
$$
erf(x) = \frac{2}{\sqrt{\pi}} \int_0^x e^{-t^2} dt
$$

---
# Demo 8
This is a code block:
```python
def hello_world():
  print("Hello, World!")

if __name__ == "__main__":
  hello_world()
```

---
# Demo 9
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
# Demo 10
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

# Demo 11

<div class="mermaid">
flowchart TD
  A[Start] --> B{Is it?};
  B -- Yes --> C[OK];
  C --> D[Rethink];
  D --> B;
  B -- No ----> E[End];
</div>
--- (id="mermaid-slide")