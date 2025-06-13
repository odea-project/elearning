## Proprietary Software <span class="post-it-strip"> vs </span> Open-Source Software

<div style="display: flex; gap: 50px; justify-content: center; align-items: center;">
  <!-- Left side: Vendor -->
  <div style="width: 450px; min-height: 250px; position: relative;">
    <figure class="fragment fade-out" style="margin:0;">
      <img src="resources/figures/02_toolsAndProgramming/vendor.jpg" alt="Proprietary Software" style="height: 250px;">
      <figcaption style="font-size:0.7em; text-align:center; margin-top:4px;">
        Source: <a href="https://pixabay.com/" target="_blank">pixabay.com</a>
      </figcaption>
    </figure>
    <div class="fragment fade-in" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: flex-start; justify-content: center;">
      <ul>
        <li><strong>Vendor Pros:</strong>
          <ul style="font-size: 0.75em;">
            <li>Professional technical support and regular updates</li>
            <li>Optimized for specific instruments and workflows</li>
            <li>User-friendly interfaces and documentation</li>
            <li>Reliable performance and validation</li>
          </ul>
        </li>
        <br>
        <li class="fragment fade-in"><strong>Vendor Cons:</strong>
          <ul style="font-size: 0.75em;">
            <li>High licensing and maintenance costs</li>
            <li>Limited flexibility and customization</li>
            <li>Vendor lock-in and proprietary data formats</li>
            <li>Less community involvement and slower innovation</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <!-- Right side: Open Source -->
  <div style="width: 450px; min-height: 250px; position: relative;">
    <figure class="fragment fade-out" style="margin:0;">
      <img src="resources/figures/02_toolsAndProgramming/opensource.jpg" alt="Open-Source Software" style="height: 250px;">
      <figcaption style="font-size:0.7em; text-align:center; margin-top:4px;">
        Source: <a href="https://pixabay.com/" target="_blank">pixabay.com</a>
      </figcaption>
    </figure>
    <div class="fragment fade-in" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: flex-start; justify-content: center;">
      <ul>
        <li><strong>Open-Source Pros:</strong>
          <ul style="font-size: 0.75em;">
            <li>Free to use</li>
            <li>Highly flexible and customizable</li>
            <li>Active community support and rapid innovation</li>
            <li>Promotes open standards and interoperability</li>
          </ul>
        </li>
        <br>
        <li class="fragment fade-in"><strong>Open-Source Cons:</strong>
          <ul style="font-size: 0.75em;">
            <li>May lack official technical support</li>
            <li>Steeper learning curve for some tools</li>
            <li>Variable documentation and user experience</li>
            <li>Potential compatibility issues with vendor hardware</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</div>

<span class="fragment fade-in" style="display:block; text-align:center; font-size:1em; margin-top:24px;">
  <em>The focus will be on open-source software!</em>
</span>

---

## Analytical Data <span class="post-it-strip">Management</span>

<br>
<div style="display: flex; gap: 40px; justify-content: center; align-items: flex-start;">
  <div style="flex: 1; min-width: 250px;font-size: 0.8em;">
    <br>
    <strong style="text-align: center;">Electronic Lab Notebook (ELN)</strong>
    <br>
    <br>
    <ul>
      <li><em>Purpose:</em> Primarily used for documenting experiments, protocols, and results in a structured format.</li>
      <li><em>Features:</em>
        <ul style="font-size: 0.8em;">
          <li>Text-based documentation</li>
          <li>Integration with data sources</li>
          <li>Searchable records</li>
          <li>Collaboration features</li>
        </ul>
      </li>
      <li><em>Use Cases:</em> Ideal for research labs, academic institutions, and environments where detailed documentation is crucial.</li>
    </ul>
  </div>
  <div class="fragment" style="flex: 1; min-width: 250px;font-size: 0.8em;">
    <br>
    <strong style="text-align: center;">Laboratory Information Management System (LIMS)</strong>
    <br>
    <br>
    <ul>
      <li><em>Purpose:</em> Designed to manage samples, associated data, and laboratory workflows.</li>
      <li><em>Features:</em>
        <ul style="font-size: 0.8em;">
          <li>Sample tracking</li>
          <li>Data management and analysis</li>
          <li>Workflow automation</li>
          <li>Regulatory compliance support</li>
        </ul>
      </li>
      <li><em>Use Cases:</em> Suitable for clinical laboratories, quality control labs, and environments requiring strict regulatory compliance.</li>
    </ul>
  </div>
</div>
<br>
<br>
<br>

---

## Open-Source <span class="post-it-strip">ELN</span> Solutions

<div style="display: flex; gap: 32px; justify-content: center; align-items: stretch;">
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <br>
    <div style="height: 80px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/chemotion_logo.png" alt="Chemotion Logo" style="max-height: 60px;">
    </div>
    <a href="https://helmholtz.software/software/chemotion-eln"><strong>Chemotion ELN</strong></a>
    <div style="font-size: 0.95em; margin-top: 8px;">
      A free ELN designed for chemists but with a wider potential via the <a href="https://chemotion.net/docs/labimotion">LabIMotion</a> extensions.
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <br>
    <div style="height: 80px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/rspace_logo.svg" alt="RSpace Logo" style="max-height: 60px;">
    </div>
    <a href="https://www.researchspace.com/"><strong>RSpace</strong></a>
    <div style="font-size: 0.95em; margin-top: 8px;">
      A feature-rich ELN platform with integrations and flexible deployment.<br><a href="https://github.com/rspace-os">RSpace on GitHub</a>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <br>
    <div style="height: 80px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/elabftw-logo.png" alt="elabFTW Logo" style="max-height: 60px;">
    </div>
    <a href="https://www.elabftw.net/"><strong>elabFTW</strong></a>
    <div style="font-size: 0.95em; margin-top: 8px;">
      A free ELN, designed by researchers, for researchers, with usability in mind.<br><a href="https://github.com/elabftw/elabftw">elabFTW on GitHub</a>
    </div>
  </div>
</div>
<br>
<br>
<br>
<p style="font-size: 0.7em;"> Further reading: <a href="https://www.cdi.fau.de/en/services/electronic-lab-notebooks/kriterien/">Criteria for Selecting an ELN</a> and <a href="https://eln-finder.ulb.tu-darmstadt.de/home">ELN Finder</a></p>

---

## A non-scientific <span class="post-it-strip">ELN</span> alternative

<br>
<div style="display: flex; gap: 32px; justify-content: center; align-items: stretch;">
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <div style="height: 80px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/obsidian_logo.png" alt="Obsidian Logo" style="max-height: 60px;">
    </div>
    <a href="https://obsidian.md/"><strong>Obsidian</strong></a>
    <div style="font-size: 0.95em; margin-top: 8px;">
      A powerful knowledge base on local Markdown files, ideal for personal research notes but with wider potential via the community <a href="https://obsidian.md/plugins">plugins</a>.
    </div>
  </div>
</div>
<br>
<br>
<br>
<br>

---

## Analytical Data <span class="post-it-strip">processing</span> Software

<div style="display: flex; gap: 60px; justify-content: center; align-items: flex-start;">
  <div style="flex: 1; min-width: 350px; max-width: 400px;">
    <br>
    <h3 style="text-align:center;">Dedicated</h3>
    <ul style="font-size: 0.7em;">
      <li>Designed for specific analytical instruments or workflows (e.g., <a href="https://mzio.io/mzmine-news/">mzmine</a>, <a href="https://openms.de/">OpenMS</a>, <a href="https://github.com/sirius-ms/sirius">SIRIUS</a>).</li>
      <li>Optimized for performance and accuracy in targeted tasks.</li>
      <li>Includes domain-specific features and user interfaces.</li>
      <li>Typically easier to use for intended applications, with less setup required.</li>
      <li>Less flexible—limited to supported data types and workflows.</li>
      <li>Some may be less scalable or adaptable to new tasks outside its scope.</li>
    </ul>
  </div>
  <div class="fragment" style="flex: 1; min-width: 350px; max-width: 400px">
    <br>
    <h3 style="text-align:center;">Generic</h3>
      <ul style="font-size: 0.7em;">
      <li>Broadly applicable tools (e.g., <a href="https://www.knime.com/">KNIME</a>, <a href="https://www.python.org/">Python</a>, <a href="https://cran.r-project.org/">R</a>).</li>
      <li>Flexible and customizable for various data types and workflows.</li>
      <li>Often easier to integrate with other tools and data sources.</li>
      <li>May require more setup and technical expertise.</li>
      <li>Not optimized for specific analytical tasks—may lack domain-specific features.</li>
      <li>Scalable for diverse applications but may have performance limitations for large datasets.</li>
    </ul>
  </div>
</div>
<br>
<br>

---

## Analytical Data <span class="post-it-strip">processing</span> Software

<div style="display: flex; gap: 32px; justify-content: center; align-items: flex-start;">
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>Code</h3>
    <div style="height: 100px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/code.png" alt="Code Solutions" style="height: 80px;">
    </div>
    <div style="font-size: 0.7em;">
      These involve writing scripts or programs to process analytical data. They offer high flexibility and performance but require programming skills.<br>
      <br>
      <strong>Examples:</strong> <a href="https://www.python.org/">Python</a>, <a href="https://cran.r-project.org/">R</a>, <a href="https://julialang.org/">Julia</a>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>no-code</h3>
    <div style="height: 100px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/no_code.png" alt="No-code Solutions" style="height: 80px;">
    </div>
    <div style="font-size: 0.7em;">
      User-friendly platforms that allow users to process data without writing code. They often provide drag-and-drop or fixed interfaces and pre-built functions.<br>
      <br>
      <strong>Examples:</strong> <a href="https://mzio.io/mzmine-news/">mzmine</a>, <a href="https://usegalaxy.eu/">Galaxy (Europe)</a>, 
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>hybrid</h3>
    <div style="height: 100px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/hybrid.png" alt="Hybrid Solutions" style="height: 80px;">
    </div>
    <div style="font-size: 0.7em;">
      Combine both coding and no-code approaches, allowing users to write custom scripts while also providing a graphical user interface.<br>
      <br>
      <strong>Examples:</strong> <a href="https://www.knime.com/">KNIME</a>, <a href="https://orangedatamining.com/">Orange Data Mining</a>, <a href="https://github.com/odea-project/StreamFind">StreamFind</a>
    </div>
  </div>
</div>
<br>
<br>

---

## Analytical Data <span class="post-it-strip">processing</span> with <a href="https://www.knime.com/">KNIME</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://www.knime.com/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="KNIME Website"></iframe>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">processing</span> with <a href="https://usegalaxy.eu/">Galaxy</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://usegalaxy.eu/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="Galaxy Europe"></iframe>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">processing</span> with Programming Languages

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 350px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <strong>The most flexible and powerful way to process analytical data</strong><br>
    <strong class=fragment><br>but also the most complex</strong><br>
  </div>
  <div class=fragment style="text-align: center; margin-bottom: 24px;">
    <strong>if not for the convenience of libraries and frameworks.</strong>
    <div style="height: 220px;">
    <img src="resources/figures/02_toolsAndProgramming/programming_languages_frameworks.png" alt="Programming Languages Figure">
    </div>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">processing</span> with <a href="https://odea-project.github.io/StreamFind/">StreamFind</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://odea-project.github.io/StreamFind/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="StreamFind"></iframe>
  </div>
</div>

---

## Learning <span class="post-it-strip">Programming Languages</span>

<br>
<div style="display: flex; gap: 32px; justify-content: center; align-items: flex-start;">
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <strong><a href="https://www.w3schools.com/">W3Schools</a></strong>
    <div style="font-size: 0.7em;">
      <br>
      A beginner-friendly platform offering interactive tutorials and references for programming languages, web development and frameworks (e.g. NumPy, Pandas, Matplotlib and SciPy).
      <br>
      <br>
      Great for quick learning and hands-on practice.
      <br>
      <br>
      <em>Free (certificates available for a fee)</em>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <strong><a href="https://www.codecademy.com/" target="_blank">Codecademy</a></strong>
    <div style="font-size: 0.8em;">
      <br>
      An interactive learning platform with guided career paths and courses in programming languages.
      <br>
      <br>
      Suitable for structured courses and guided projects.
      <br>
      <br>
      <em>Free and paid courses available</em>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <strong><a href="https://www.coursera.org/" target="_blank">Coursera</a></strong>
    <div style="font-size: 0.8em;">
      <br>
      Offers online courses from top universities and organizations, covering programming and computer science topics in depth.
      <br>
      <br>
      Includes video lectures, assignments, and certificates.
      <br>
      <br>
      <em>Free and paid courses available</em>
    </div>
  </div>
</div>

---

## Learning <span class="post-it-strip">Programming Languages</span>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="text-align: center; max-width: 900px;">
    Yet, learning programming languages is not just about the language itself!
    <br><br>
    <strong>Keep motivated</strong> by focusing your learning on <strong>applied projects</strong>.
    <br><br>
  </div>
</div>

---

##  Analytical Data <span class="post-it-strip">Reporting</span>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="text-align: center; max-width: 900px;">
    <strong>Reporting analytical data is a crucial step in the data analysis process.</strong>
    <ul style="text-align: left; margin: 24px auto 0 auto; display: inline-block;">
      <li>Support for dynamic content (e.g., tables and charts)</li>
      <li>Flexible layout and design options</li>
      <li>Integration with various data structures (i.e., interoperability)</li>
      <li>Support for multiple output formats (e.g., PDF and HTML)</li>
    </ul>
  </div>
</div>

---

##  Analytical Data <span class="post-it-strip">Reporting</span>

<br>
<div style="display: flex; gap: 32px; justify-content: center; align-items: flex-start;">
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <div style="height: 70px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/Jupyter_logo.webp" alt="Jupyter Logo" style="height: 60px;">
    </div>
    <strong><a href="https://jupyter.org/" target="_blank">Jupyter Notebooks</a></strong>
    <div style="font-size: 0.8em; margin-top: 8px;">
      An open-source web application for creating and sharing documents that contain live code, equations, visualizations, and narrative text.<br><br>
      Widely used for data analysis, teaching, and reproducible research.<br><br>
      <em>Free and open-source</em>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <div style="height: 70px; margin-bottom: 12px;">
      <img src="resources/figures\02_toolsAndProgramming/quarto-dark-bg.jpeg" alt="Quarto Logo" style="height: 60px;">
    </div>
    <strong><a href="https://quarto.org/" target="_blank">Quarto Documents</a></strong>
    <div style="font-size: 0.8em; margin-top: 8px;">
      A scientific and technical publishing system from Posit for creating dynamic documents, presentations, and websites with code, text, and visualizations.<br><br>
      Supports R, Python, Julia, and Observable JS.<br><br>
      <em>Free and open-source</em>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 320px; text-align: center;">
    <div style="height: 70px; margin-bottom: 12px;">
      <img src="resources/figures/02_toolsAndProgramming/reveal-black-text-sticker.png" alt="Reveal.js Logo" style="max-height: 60px;">
    </div>
    <strong><a href="https://revealjs.com/" target="_blank">Reveal.js</a></strong>
    <div style="font-size: 0.8em; margin-top: 8px;">
      A framework for creating interactive HTML presentations using Markdown or HTML.<br><br>
      Ideal for sharing code, results, and explanations in a visually engaging way.<br><br>
      <em>Free and open-source</em>
    </div>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">Reporting</span> with <a href="https://quarto.org/docs/get-started/" target="_blank">Quarto Documents</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://quarto.org/docs/get-started/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="Quarto Get Started"></iframe>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">visualisation</span> with <a href="https://quarto.org/docs/interactive/" target="_blank">Quarto Documents</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://quarto.org/docs/interactive/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="Quarto Interactive Docs"></iframe>
  </div>
</div>

---

## Analytical Data <span class="post-it-strip">visualisation</span> with <a href="https://plotly.com/graphing-libraries/" target="_blank">Plotly</a>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://plotly.com/graphing-libraries/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="Plotly Graphing Libraries"></iframe>
  </div>
</div>

---

## Concluding Remarks and <span class="post-it-strip">Recommendations</span>

<br>
<div>
  <ul>
    <li><strong>Best for getting started quickly</strong>
      <ul>
        <li>Dedicated software for specific tasks (e.g., <a href="https://mzio.io/mzmine-news/">mzmine</a>)</li>
        <li>Hybrid platforms for interactive and flexible data processing (e.g., <a href="https://www.knime.com/">KNIME</a>)</li>
      </ul>
    </li>
    <br>
    <br>
    <li><strong>Best for building a reproducible research pipeline</strong>
      <ul>
        <li>Code-based solutions for data processing (e.g., <a href="https://www.python.org/">Python</a>, <a href="https://cran.r-project.org/">R</a>)</li>
        <li>Libraries and Frameworks for boosting capabilities and productivity (e.g., <a href="https://github.com/odea-project/StreamFind">StreamFind</a>)</li>
        <li>Tools for flexible and interactive reporting and visualisation (e.g., <a href="https://quarto.org/">Quarto Documents</a>)</li>
      </ul>
    </li>
  </ul>
</div>
<br>
<br>

---
