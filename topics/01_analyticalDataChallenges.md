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

Due to the increased complexity of modern analytical instruments (and experiments), the term 'analytical data' has evolved to encompass more than just raw numerical data.

```mermaid
  graph TD1
    A[Analytical Data] --> B[Raw Data]
    A --> C[Instrument Metadata]
    A --> D[Processed Data]
    A --> E[Calibration Data]
    A --> F[Data Quality Metrics]
    A --> G[Data Provenance (Audit Trail)]
    A --> H[Other Metadata (e.g. Sample Information, Experimental Conditions)]
```

---

# Analytical data across various fields

How analytical data is used in various fields (e.g., environmental monitoring, food safety, pharmaceuticals) and implications for data management and structure.

```mermaid
  graph TD3
    A[Analytical Data Use Cases] --> B[Environmental Monitoring]
    A --> C[Food Safety]
    A --> D[Pharmaceuticals]
    A --> E[Clinical Research]
    A --> F[Industrial Applications]
    A --> G[Academic Research]
    A --> H[Regulatory Compliance]
```

---

# Analytical Data management (1st challenge)

The management of analytical data involves not only the storage and processing of raw data but also the handling of metadata, calibration data, and data quality metrics. This complexity necessitates specialized tools and workflows to ensure data integrity, reproducibility, and compliance with standards.

```mermaid
  graph TD2
    A[Analytical Data Management] --> B[Data Storage]
    A --> C[Data Processing]
    A --> D[Metadata Management]
    A --> E[Calibration Management]
    A --> F[Data Quality Assurance]
    A --> G[Data Visualization]
    A --> H[Data Provenance Tracking]
```

---

# Structure diversity and complexity (2nd challenge)

How diverse the structure of analytical data can be (e.g., multivariate time series from sensors, spectral data and chromatographic profiles).
Highlight challenges arising from complexity and volume of analytical data, including the need for specialized tools and expertise.
Challenges in data management, including data storage, processing, and visualization.
pH can be easily noted from the screen but mass spectrometry data requires specialized software to interpret complex spectra.
The high complexity and size requires compression and efficient storage solutions, as well as advanced data processing techniques to extract meaningful insights.
Show book and size comparison as well as notion of data compression and encoding frameworks.

---

# Data formats and interoperability

Need for interoperability in data formats. Encoding strategies from vendors as well as the reasons why and how to go around it.

---

# Data standardization (3rd challenge)

Open data standards opportunities/advantages for tackling lack of data interoperability and how to ensure FAIRness during data handling. Making the work reproducible by working with metadata and standardization of data processing workflows, with benefit of automation and consequently, saving time.

---

# FAIR principles

The FAIR principles (Findable, Accessible, Interoperable, Reusable) are essential for ensuring that analytical data is managed effectively. They promote the use of standardized formats, metadata, and documentation to enhance data sharing and collaboration across disciplines.

---