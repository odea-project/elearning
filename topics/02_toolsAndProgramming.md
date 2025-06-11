## Proprietary Software <span class="post-it-strip"> vs </span> Open-Source Software

<div style="display: flex; gap: 50px; justify-content: center; align-items: center;">
  <div style="width: 450px;">
    <!-- <img src="PATH_TO_CODE_SOLUTION_IMAGE" alt="Proprietary Software" style="height: 400px;"> -->
    <!-- Suggest a figure that visually represents vendor (proprietary) software for analytical data processing, highlighting features such as professional technical support and regular updates, optimization for specific instruments and workflows, user-friendly interfaces and documentation, and reliable performance and validation. -->
  </div>
  <div style="width: 450px;">
    <!-- <img src="PATH_TO_CODE_SOLUTION_IMAGE" alt="Open-Source Software" style="height: 400px;"> -->
    <!-- Suggest a figure that visually represents open-source software for analytical data processing, highlighting features such as being free to use, highly flexible and customizable, active community support and rapid innovation, and promoting open standards and interoperability. -->
  </div>
</div>

---

## Proprietary Software <span class="post-it-strip"> vs </span> Open-Source Software

<br>
<br>
<div style="display: flex; gap: 50px; justify-content: center; align-items: center;">
  <div style="width: 450px;">
    <ul>
      <li><strong>Pros:</strong>
        <ul style="font-size: 0.75em;">
          <li>Professional technical support and regular updates</li>
          <li>Optimized for specific instruments and workflows</li>
          <li>User-friendly interfaces and documentation</li>
          <li>Reliable performance and validation</li>
        </ul>
      </li>
      <li><strong>Cons:</strong>
        <ul style="font-size: 0.75em;">
          <li>High licensing and maintenance costs</li>
          <li>Limited flexibility and customization</li>
          <li>Vendor lock-in and proprietary data formats</li>
          <li>Less community involvement and slower innovation</li>
        </ul>
      </li>
    </ul>
  </div>
  <div style="width: 450px;">
    <ul>
      <li><strong>Pros:</strong>
        <ul style="font-size: 0.75em;">
          <li>Free to use</li>
          <li>Highly flexible and customizable</li>
          <li>Active community support and rapid innovation</li>
          <li>Promotes open standards and interoperability</li>
        </ul>
      </li>
      <li><strong>Cons:</strong>
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
<br>
<br>

<span class="fragment" style="display:block; text-align:center; font-size:1em; margin-top:24px;">
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
<p>Further reading: <a href="https://www.cdi.fau.de/en/services/electronic-lab-notebooks/kriterien/">Criteria for Selecting an ELN</a></p>

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

<div style="display: flex; gap: 32px; justify-content: center; align-items: stretch;">
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>Code</h3>
    <div style="height: 60px; margin-bottom: 12px;">
      <!-- <img src="PATH_TO_CODE_SOLUTION_IMAGE" alt="Code Solutions" style="max-height: 60px;"> -->
      <!-- Abstract figure of purelly code based software. -->
    </div>
    <div style="font-size: 0.95em;">
      These involve writing scripts or programs to process analytical data. They offer high flexibility and performance but require programming skills.<br>
      <strong>Examples:</strong> <a href="https://www.python.org/">Python</a>, <a href="https://cran.r-project.org/">R</a>, <a href="https://julialang.org/">Julia</a>
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>no-code</h3>
    <div style="height: 60px; margin-bottom: 12px;">
      <!-- <img src="PATH_TO_NO_CODE_SOLUTION_IMAGE" alt="No-code Solutions" style="max-height: 60px;"> -->
      <!-- Abstract figure of software with a graphical user interface, so no-code usage. -->
    </div>
    <div style="font-size: 0.95em;">
      User-friendly platforms that allow users to process data without writing code. They often provide drag-and-drop or fixed interfaces and pre-built functions.<br>
      <strong>Examples:</strong> <a href="https://mzio.io/mzmine-news/">mzmine</a>, <a href="https://usegalaxy.eu/">Galaxy (Europe)</a>, 
    </div>
  </div>
  <div style="flex: 1; min-width: 220px; max-width: 340px; text-align: center;">
    <h3>hybrid</h3>
    <div style="height: 60px; margin-bottom: 12px;">
      <!-- <img src="PATH_TO_HYBRID_SOLUTION_IMAGE" alt="Hybrid Solutions" style="max-height: 60px;"> -->
      <!-- Abstract figure with software have a graphical user interface but also allows the use of costume scripts. -->
    </div>
    <div style="font-size: 0.95em;">
      Combine both coding and no-code approaches, allowing users to write custom scripts while also providing a graphical user interface.<br>
      <strong>Examples:</strong> <a href="https://www.knime.com/">KNIME</a>, <a href="https://orangedatamining.com/">Orange Data Mining</a>, <a href="https://github.com/odea-project/StreamFind">StreamFind</a>
    </div>
  </div>
</div>

---

## Analytical Data Processing with <span class="post-it-strip">KNIME</span>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://www.knime.com/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="KNIME Website"></iframe>
  </div>
</div>

---

## Analytical Data Processing with <span class="post-it-strip">Galaxy</span>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://usegalaxy.eu/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="Galaxy Europe"></iframe>
  </div>
</div>

---

## Analytical Data Processing with <span class="post-it-strip">Programming Languages</span>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 350px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <strong>The most flexible and powerful way to process analytical data</strong><br>
    <strong class=fragment>but also the most complex</strong><br>
  </div>
  <div class=fragment style="text-align: center; margin-bottom: 24px;">
    <strong>if not for the convenience of libraries and frameworks.</strong>
    <div style="height: 220px;">
    <img src="resources/figures/02_toolsAndProgramming/programming_languages_frameworks.png" alt="Programming Languages Figure">
    </div>
  </div>
</div>

---

## Analytical Data Processing with <span class="post-it-strip">StreamFind</span>

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="background: #fff; padding: 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <iframe src="https://odea-project.github.io/StreamFind/" width="900" height="480" style="border:1px solid #ccc; background:#fff;" title="StreamFind"></iframe>
  </div>

</div>

---

## Learning with <span class="post-it-strip">Programming Languages</span>



---

# Analytical Data Reporting Tools

List various tools that are commonly used for reporting analytical data. Discuss the features, strengths, and weaknesses of each tool, including factors such as visualization capabilities, ease of use, integration with data sources, and support for different output formats.

---

# Map of best tools for getting started quickly



---

# Map of best tools for building a reproducible research pipeline



---