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
| Header 1 | Header 2  |
|----------|-----------|
| Row 1    | Data 1    |
| Row 2    | Data 2    |

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
  <script>
    // Hinweis: Diese Funktion(en) müssen schon vorher global verfügbar sein:
    //   createFigure(), addAxes(), addLine()
    // und d3.js natürlich geladen.

    // Wir lassen den Plot erst "live" zeichnen, wenn die Folie wirklich aktiv wird:
    let myFig = null;
    let axesAlready = false;

    Reveal.on('slidechanged', event => {
      if (event.currentSlide.id === 'pixel-chart-slide') {
        if (!myFig) {
          myFig = createFigure("pixel-chart", 800, 400, { top:50, right:50, bottom:50, left:50 });
        }
        if (!axesAlready) {
          const sampleData1 = [
            { x: 0, y:  5 },
            { x: 1, y: 10 },
            { x: 2, y:  8 },
            { x: 3, y: 15 },
            { x: 4, y: 12 },
            { x: 5, y: 20 }
          ];
          const sampleData2 = [
            { x: 0, y: 15 },
            { x: 1, y: 12 },
            { x: 2, y: 18 },
            { x: 3, y: 10 },
            { x: 4, y: 17 },
            { x: 5, y: 22 }
          ];

          const allX = sampleData1.map(d => d.x).concat(sampleData2.map(d => d.x));
          const allY = sampleData1.map(d => d.y).concat(sampleData2.map(d => d.y));
          addAxes(myFig, d3.extent(allX), [0, d3.max(allY)], 5, 5);

          addLine(myFig, sampleData1, {
            curve: d3.curveNatural,
            lineColor: "#A0A",
            lineWidth: 3,
            pointSize: 6,
            pointColor: "#F0F"
          });
          addLine(myFig, sampleData2, {
            curve: d3.curveNatural,
            lineColor: "#0A0",
            lineWidth: 3,
            pointSize: 6,
            pointColor: "#0F0"
          });

          axesAlready = true;
        }
      }
    });
  </script>
  --- (id="pixel-chart-slide")