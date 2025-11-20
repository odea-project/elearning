
# ✅ **Gesamtliste aller statistisch & auswertungsrelevanten Inhalte im Praktikum**

Die Liste basiert vollständig auf den Inhalten des PDF-Dokuments und verweist jeweils auf relevante Stellen (Datei-Zitate aus deiner Datei).

---

# **1. Allgemeine statistische Pflichten in allen Protokollen**

In fast allen Versuchen wird verlangt:

* **Kalibrierung** mit vollständiger statistischer Auswertung
  (Geradengleichung, Fehlerrechnung, Bestimmungs-/Nachweisgrenze) 
* **Angabe von Mittelwerten & Standardabweichung**
* **Regression mit Fehlern von m & b** (Standardfehler)
* **Konfidenzintervalle (meist 95 %)** 
* **Signifikante Stellen beachten**
* **Residuenanalyse** zur Prüfung der Modellannahmen (z. B. Linearität) 
* **Gütekennzahlen**: R², Residuenverteilung, Plausibilität der Regression

---

# **2. Kalibrierung & quantitative Auswertung**

### **Kommt in fast jedem Versuch vor:**

### ► **Lineare Regression**

* Bestimmung von **m**, **b**, **σ(m)**, **σ(b)** via linearer Regression
* Anwendung auf:

  * HPLC-UV
  * GC-MS (Citronensäure)
  * Fluoreszenzspektroskopie (Chinin)
  * ICP-OES (Kupfer)
  * Kinetik-Versuch (Pseudo-1. Ordnung)

### ► **Kalibrationstypen**

* **Externe Standardkalibration** (Standardreihe 5–10 Konzentrationen) 
* **Standardadditionsverfahren** 
* **Vergleich beider Methoden** (Unterschiede, Matrixeffekte) 

### ► **Analytische Kenngrößen**

Explizit gefordert:

* **LOD (Nachweisgrenze)**
* **LOQ (Bestimmungsgrenze)**
* **Erfassungsgrenze**
* **Blindwertkorrektur**
* **Matrixeffekte**
* **Recovery / Wiederfindung**

(LOD/LOQ mehrfach explizit genannt, z. B. im TOC-Protokoll.) 

---

# **3. Fehlerrechnung**

In allen Versuchen verlangt:

* **Angabe von Fehlern** für alle quantitativen Ergebnisse
* **Propagation von Fehlern** (insbesondere bei Konzentrationsbestimmungen)
* **Standardabweichung** von Messreplikaten
* **Standardfehler** von Regressionsparametern
* **Konfidenzintervalle** (95 %) für Steigung/Abfallparameter (z. B. Kinetik) 
* **Statistische Bewertung der Kalibration**

---

# **4. Spezifische Statistik & Auswertung pro Versuch**

---

## **4.1 HPLC-UV (Lebensmittelzusatzstoffe)**

**Analytisch-statistische Parameter:**

* **Retention time tᵣ**, dead time t₀, adjusted retention time t'ᵣ
* **Retention factor k**
* **Selectivity α**
* **Resolution Rₛ**
* **Peakbreite (half-height width)**
* **Theoretical plates N**
* **Van-Deemter-Gleichung** (Peak Broadening)

> Alle explizit als Learning Outcomes oder Pflicht zur Berechnung genannt. 

**Datenauswertung:**

* grafische Darstellung von Chromatogrammen
* tabellarische Erfassung aller Berechnungswerte 
* Begründung der optimalen mobilen Phase **mit Rₛ, k, α**
* Beurteilung von Peakformen, Symmetrie, Auflösung

---

## **4.2 GC-MS**

### **Alkan-Reihe & Temperaturprogramme**

* Vergleich von Chromatogrammen (isotherm vs Gradienten)
* Peakform
* Auflösung
* Einflussfaktoren quantifizieren

### **Citronensäure-Bestimmung**

* **Externe Kalibrierung + interner Standard**
* Bestimmung von m, b, σ(m), σ(b)
* Konzentrationsbestimmung mit Fehler
* Vergleich mit Literaturwerten

---

## **4.3 TOC-Bestimmung**

Statistisch relevant:

* **Kalibrierung (externe Standardreihe)**, inkl. Konzentrationsberechnung
* Vergleich **Direktmethode vs Differenzmethode** (statistische Abweichungen)
* **Bewertung der Messergebnisse** inkl. Fehleranalyse
* Einordnung in typische TOC-Werte (qualitativ + quantitativ begründet)

---

## **4.4 Kinetik: Pseudo-1. Ordnung (LC-MS)**

Auswertungsschritte:

1. **Zeit–Konzentrations-Diagramm** mit y-Fehlerbalken (Standardabweichung) 
2. **Logarithmische Umformung:**
   ln(c) vs. t
3. **Lineare Regression**:

   * Steigung b = –k
   * **σₖ**, **R²**, **Konfidenzintervalle**
4. Prüfung der Modellannahme: Residuenanalyse

---

## **4.5 ICP-OES**

### **Kalibration:**

* Externe Standardkalibration
* Standardaddition
* Vergleich beider Methoden (Matrixeffekte)
* Berechnung der anzusetzenden Volumina (Fehlerquellen)

### **Analytische Parameter:**

* Konzentrationsbestimmung mit Fehler
* Nachweis-/Bestimmungsgrenzen
* Blindwert
* Einfluss von Störionen

---

## **4.6 Fluoreszenzspektroskopie (Chinin)**

Statistische Inhalte:

* **Lineare Kalibration** zur Bestimmung des Chiningehalts
* Berechnung der Fehler
* Vergleich mit Literaturwerten
* **Löschkonstanten** bestimmen (Stern-Volmer-Plot → lineare Regression)

---

# **5. Datenvisualisierung**

In mehreren Versuchen explizit gefordert:

* Chromatogramme grafisch darstellen (HPLC, GC-MS)
* Konzentrations-Zeit-Plots
* Massenspektren vergleichen
* Tabellen zur Berechnung beifügen
* Residuenplots (teilweise explizit erwähnt)

---

# **6. Allgemeine fachübergreifende Statistik-Themen im Dokument**

Über das ganze Dokument verteilt tauchen diese Inhalte auf:

### ► **Grundlagen**

* Lambert–Beer-Gesetz (inkl. Formel) 
* Lineare Regression und Fehlerrechnung
* Mittelwerte, Standardabweichung
* Umgang mit Replikaten
* Residuenanalyse
* Konfidenzintervalle
* Signifikante Stellen

### ► **Analytische Genauigkeit & Präzision**

* Einfluss von Pipettiergenauigkeit (ICP-OES)
* Matrixeffekte
* Überladung/Peakverzerrung (GC/HPLC)
* Probenvorbereitung als Fehlerquelle

---

# **7. Liste als kompakte Bullet-Version (zum direkten Verwenden in den Unterlagen)**

### **Grundstatistik**

* Mittelwert, Standardabweichung
* Fehlerfortpflanzung
* Standardfehler
* Konfidenzintervalle (95 %)
* Residuenanalyse
* Signifikante Stellen

### **Kalibration**

* Externe Standardkalibration
* Standardaddition
* Geradengleichung + Fehler von m & b
* R², Residuen
* LOD / LOQ / Erfassungsgrenze
* Blindwert

### **Chromatographie (HPLC & GC)**

* Retentionszeit, t₀, tᵣ, t'ᵣ
* Retentionsfaktor k
* Selektivität α
* Auflösung Rₛ
* Peakbreite, Theorieplatten N
* Van-Deemter-Gleichung
* Peakform & Peakasymmetrie

### **Quantifizierung & Fehlerrechnung**

* Konzentrationsbestimmung inklusive Unsicherheit
* Vergleich verschiedener Methoden
* Matrixeffekte berücksichtigen

### **Kinetik**

* ln(c) vs. t → Regression
* Bestimmung der Geschwindigkeitskonstante k
* Konfidenzintervalle & R²

### **Spektren**

* UV/Vis: Lambert-Beer
* Fluoreszenz: Stern–Volmer-Diagramm (lineare Regression)
* Massenspektren: Vergleich & Interpretation


