# Origin of Analytical Data

The [*Ishango bone*](https://en.wikipedia.org/wiki/Ishango_bone) is considered the oldest known mathematical artifact.

<figure>
  <img src="resources\figures\01_analyticalDataChallenges\Ishango_bone.jpg" data-preview-image alt="Ishango bone" height="260" style="display:inline-block; vertical-align:center; margin-right:10px;"/>
  <img src="resources\figures\01_analyticalDataChallenges\Ishango_bone_2.jpeg" data-preview-image alt="Another figure" height="260" style="display:inline-block; vertical-align:center;"/>
  <figcaption style="font-size: 0.8em;"><em>The Ishango bone was discovered in the Democratic Republic of Congo, dating back to the Upper Paleolithic period, and is believed to be over 20,000 years old.</em></figcaption>
  <p style="font-size: 0.6em;"><a href="https://en.wikipedia.org/wiki/Ishango_bone">Source: Wikipedia</a></p>
</figure>

---

# Origin of Data Processing Tools

The [*Abacus*](https://en.wikipedia.org/wiki/Abacus) is one of the oldest known calculating tools, pre-dating modern computing by thousands of years. The Abacus is used for arithmetic processes by representing values in a binary-like manner.

<figure>
  <img src="resources/figures/01_analyticalDataChallenges/Abacus.png" data-preview-image alt="Abacus" height="200" style="display:inline-block; vertical-align:center; margin-right:10px;"/>
  <img src="resources/figures/01_analyticalDataChallenges/Abacus_2.jpg" data-preview-image alt="Another figure" height="200" style="display:inline-block; vertical-align:center;"/>
  <figcaption style="font-size: 0.8em;"><em>The Abacus, used for centuries in various cultures approximately since 2400 BC, represents an early form of data processing and calculation.</em></figcaption>
  <p style="font-size: 0.6em;"><a href="https://en.wikipedia.org/wiki/Abacus">Source: Wikipedia</a></p>
</figure>

---

# Evolution of Analytical Data Processing

The era of [*analog-to-digital converters (ADCs)*](https://dewesoft.com/blog/history-of-analog-to-digital-converters) revolutionized data acquisition, enabling the conversion of continuous signals into discrete digital data. This transition marked a significant advancement in analytical data processing.

<div style="display: flex; align-items: flex-start;">
  <div style="text-align: center;">
    <figure>
      <img src="resources/figures/01_analyticalDataChallenges/IBM_7700_System_Photo.png" data-preview-image alt="IBM 7700" height="180" style="display:inline-block; vertical-align:center; margin-right:10px;"/>
      <figcaption style="font-size: 0.6em;"><em>The IBM 7700 Data Acquisition System, introduced in the 1960s, was one of the first systems to utilize analog-to-digital conversion for data acquisition.</em></figcaption>
      <p style="font-size: 0.6em;"><a href="https://en.wikipedia.org/wiki/IBM_7700_Data_Acquisition_System">Source: Wikipedia</a></p>
    </figure>
  </div>

  <div style="width: 20px;"></div>

  <div style="text-align: center;">
    <figure>
      <img src="resources/figures/01_analyticalDataChallenges/Hewlett-Packard GC-MS 5992.png" data-preview-image alt="HP GC-MS 5992" height="180" style="display:inline-block; vertical-align:center; margin-right:10px;"/>
      <figcaption style="font-size: 0.6em;"><em>The Hewlett-Packard GC-MS 5992, introduced in the 1970s, was a pioneering instrument that combined gas chromatography with mass spectrometry, utilizing ADC technology for enhanced analytical capabilities.
      </em></figcaption>
      <p style="font-size: 0.6em;"><a href="https://www.asms.org/docs/history-posters/hp5992.pdf?sfvrsn=2">Source: asms.org</a></p>
    </figure>
  </div>

  <div style="width: 20px;"></div>

  <div style="text-align: center;">
    <figure>
      <img src="resources/figures/01_analyticalDataChallenges/Agilent IM-QTOF.webp" data-preview-image alt="Agilent IM-QTOF" height="180" style="display:inline-block; vertical-align:center; margin-right:10px;"/>
      <figcaption style="font-size: 0.6em;"><em>The Agilent 6560 Ion Mobility Q-TOF LC/MS, introduced in the 2010s, represents a modern advancement in analytical data acquisition, integrating ion mobility spectrometry with quadrupole time-of-flight mass spectrometry for enhanced separation and identification of complex mixtures.
      </em></figcaption>
      <p style="font-size: 0.6em;"><a href="https://www.agilent.com/en/product/liquid-chromatography-mass-spectrometry-lc-ms/lc-ms-instruments/quadrupole-time-of-flight-lc-ms/6560-ion-mobility-lc-q-tof">Source: agilent.com</a></p>
    </figure>
  </div>
</div>

---

# Analytical Data (not just Data)

Due to the increased complexity of modern analytical instruments, the term 'analytical data' has evolved to encompass more than just raw numerical data.

```mermaid
  %%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#f0f0f0'}}}%%
  %%{flowchart: {curve: 'linear'}}%%
  graph TD1
    A[Analytical Data] -->|Includes| B[Raw Data]
    A -->|Includes| G[Instrument Metadata]
    A -->|Includes| C[Processed Data]
    A -->|Includes| E[Calibration Data]
    A -->|Includes| H[Data Quality Metrics]
    A -->|Includes| I[Data Provenance (Audit Trail)]
    A -->|Includes| D[Other Metadata (e.g. Sample Information, Experimental Conditions)]
    A -->|Includes| F[Data Visualizations]
```
---

# Analytical Data in the Laboratory

Modern analytical laboratories are equipped with advanced instruments that generate vast amounts of data, including chromatograms, spectra, and complex multivariate datasets. These instruments require sophisticated data processing and management systems to handle the complexity and volume of data generated.

---

# Structure diversity of analytical data

How diverse the structure of analytical data can be (e.g., multivariate time series from sensors, spectral data and chromatographic profiles).

---

# How do we use analytical data

How analytical data is used in various fields (e.g., environmental monitoring, food safety, pharmaceuticals) and implications for data management.

---

# Complexity levels in analytical data

Highlight challenges arising from complexity and volume of analytical data, including the need for specialized tools and expertise.
Challenges in data management, including data storage, processing, and visualization.

---

# Data standardization

Open data standards opportunities/advantages for tackling lack of data interoperability and how to ensure FAIRness during data handling. Making the work reproducible by working with metadata and standardization of data processing workflows, with benefit of automation and consequently, saving time.

---

# Data formats and interoperability

Need for interoperability in data formats. Encoding strategies from vendors as well as the reasons why and how to go around it.

---
