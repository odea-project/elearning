(function() {
  const mdPlugin = Reveal.getPlugin('markdown');
  const marked   = mdPlugin.marked;

  const customBlock = {
    name:  'customBlock',
    level: 'block',

    start(src) {
      return src.match(/^::\w+\([^)]*\)\{/)?.index;
    },

    tokenizer(src) {
      const cap = /^::(\w+)\(([^)]*)\)\{/.exec(src);
      if (!cap) return;

      const tag       = cap[1];
      const className = cap[2];
      let   idx       = cap[0].length;
      let   depth     = 1;

      while (idx < src.length && depth > 0) {
        if      (src[idx] === '{') depth++;
        else if (src[idx] === '}') depth--;
        idx++;
      }

      const raw  = src.slice(0, idx);
      const body = src.slice(cap[0].length, idx - 1).trim();

      return {
        type:  'customBlock',
        raw,
        tag,
        class: className,
        text:  body
      };
    },

    renderer(token) {
      let innerHtml;
      if (token.tag === 'p') {
        innerHtml = marked.parseInline(token.text);
      } else {
        innerHtml = marked.parse(token.text);
      }
      return `<${token.tag} class="${token.class}">${innerHtml}</${token.tag}>`;
    }
  };

  marked.use({ extensions: [ customBlock ] });
})();


// ====== 1) Click-Handler für dynamische Slides mit erweiterten Attributen ======
document.querySelectorAll('.topic-link').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const mdUrl = a.dataset.md;

    // (1) alte Slides entfernen
    const allSlides = document.querySelector('.reveal .slides');
    allSlides.querySelectorAll('section.dynamic').forEach(s => s.remove());

    // (2) Markdown laden
    let markdownText;
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      markdownText = await res.text();
    } catch (err) {
      const errSec = document.createElement('section');
      errSec.classList.add('dynamic');
      errSec.innerHTML = `<p style="color:red;">
        Fehler beim Laden von <code>${mdUrl}</code>: ${err.message}
      </p>`;
      allSlides.insertBefore(errSec, allSlides.children[2] || null);
      Reveal.layout();
      return Reveal.slide(2);
    }

    // (3) Markdown trennen an --- mit optionalen Attributen in (key="value" ...)
    const parts = markdownText.split(
      /^[ \t]*---(?:[ \t]*\(\s*([^)]+)\s*\))?[ \t]*$/m
    );

    // (4) Slides parsen und <section> mit Attributen erzeugen
    const newSecs = [];
    for (let i = 0; i < parts.length; i += 2) {
      const mdPart    = parts[i].trim();
      const attrText  = parts[i+1];
      if (!mdPart) continue;

      const html = Reveal.getPlugin('markdown').marked(mdPart);
      const section = document.createElement('section');
      section.classList.add('dynamic');

      if (attrText) {
        attrText.trim().split(/\s+/).forEach(pair => {
          const [key, valRaw] = pair.split('=');
          const value = valRaw?.replace(/^"(.+)"$/, '$1');
          if (key && value !== undefined) {
            section.setAttribute(key, value);
          }
        });
      }

      section.innerHTML = html;
      newSecs.push(section);
    }

    // (5) Einfügen der neuen Slides
    newSecs.forEach((sec, idx) => {
      const before = allSlides.children[2 + idx];
      before ? allSlides.insertBefore(sec, before)
             : allSlides.appendChild(sec);
    });
    Reveal.layout();

    // (6) Mermaid initialisieren
    const mer = Reveal.getPlugin('mermaid');
    if (mer?.init) mer.init(Reveal);

    // (7) Skripte neu laden
    newSecs.forEach(sec =>
      sec.querySelectorAll('script').forEach(old => {
        const ns = document.createElement('script');
        old.src ? ns.src = old.src : ns.textContent = old.innerHTML;
        document.body.appendChild(ns);
      })
    );

    // (8) KaTeX-Math nachrendern
    renderMathInDynamicSlides(newSecs);

    // (9) Erste neue Folie anzeigen
    Reveal.slide(2);
  });
});


// ====== 2) Math-Rendering für dynamische Slides ======
function renderMathInDynamicSlides(sections) {
  const katexPlugin = Reveal.getPlugin('katex');
  if (katexPlugin && typeof katexPlugin.renderSlides === 'function') {
    console.log('[DEBUG] KaTeX-Plugin.renderSlides() aufrufen');
    katexPlugin.renderSlides();
    return;
  }
  if (katexPlugin && typeof katexPlugin.renderSlide === 'function') {
    console.log('[DEBUG] KaTeX-Plugin.renderSlide() aufrufen');
    sections.forEach(slide => katexPlugin.renderSlide(slide));
    return;
  }
  if (window.renderMathInElement) {
    console.log('[DEBUG] Fallback: renderMathInElement() aufrufen');
    sections.forEach(slide => {
      renderMathInElement(slide, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    });
  } else {
    console.warn('[WARN] Keine Funktion gefunden, um Math zu rendern');
  }
}

// ---------------
// 10) Code-Overlay-Logik (Lösung B – dynamisch einfügen)
// ---------------
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('code-overlay')) {
    const overlayHTML = `
      <div id="code-overlay" class="overlay hidden">
        <div class="overlay-content">
          <button id="close-overlay"><i class="fa-solid fa-rectangle-xmark"></i></button>
          <button id="copy-overlay"><i class="fa-solid fa-copy"></i></button>
          <pre><code id="overlay-code" class="language-python"></code></pre>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    // 🛠 Direkt nach dem Einfügen:
    document.getElementById('close-overlay').addEventListener('click', () => {
      document.getElementById('code-overlay').classList.add('hidden');
    });

    // 📋 Kopieren-Button
    document.getElementById('copy-overlay').addEventListener('click', () => {
      const code = document.getElementById('overlay-code').textContent;
      navigator.clipboard.writeText(code)
        .then(() => alert('Code in Zwischenablage kopiert!'))
        .catch(err => alert('Fehler beim Kopieren: ' + err));
    });
  }
});



document.addEventListener('click', function(event) {
  if (event.target.matches('.py-code-button')) {
    const overlay = document.getElementById('code-overlay');
    const codeEl  = document.getElementById('overlay-code');

    const codeKey = event.target.dataset.code || 'default';
    const codeExamples = {
      normalize: `
# min_max normalization

import numpy as np

def normalize(data):
  min_val = np.min(data)
  max_val = np.max(data)
  return (data - min_val) / (max_val - min_val)


print("Normalized data:", normalize(np.array([1, 2, 3, 4, 5])))
      `.trim(),
      standardize: `
# z-score standardization

import numpy as np

def standardize(data):
  mean = np.mean(data)
  std_dev = np.std(data)
  return (data - mean) / std_dev


print("Standardized data:", standardize(np.array([1, 2, 3, 4, 5])))
      `.trim(),
      moving_average: `
# moving average using convolution

import numpy as np

def moving_average(data, window_size=3):
  weights = np.ones(window_size) / window_size
  return np.convolve(data, weights, mode='same')

data = np.array([1, 2, 3, 4, 5, 6])
print("Smoothed:", moving_average(data))
`.trim(),
gaussian_smoothing: `
# Smoothing with a Gaussian kernel using convolution

import numpy as np

def gaussian_kernel(size=5, sigma=1.0):
  """Generate a normalized 1D Gaussian kernel"""
  x = np.linspace(-size // 2, size // 2, size)
  kernel = np.exp(-0.5 * (x / sigma)**2)
  return kernel / kernel.sum()

def smooth_gaussian(data, kernel_size=5, sigma=1.0):
  kernel = gaussian_kernel(kernel_size, sigma)
  return np.convolve(data, kernel, mode='same')

data = np.array([1, 2, 3, 4, 5, 6])
print("Smoothed (Gaussian):", smooth_gaussian(data))
`.trim(),
savgol: `
# Smoothing with Savitzky-Golay filter

import numpy as np
from scipy.signal import savgol_filter

data = np.array([1, 2, 3, 2, 5, 6, 7, 8, 7, 6])

# Apply Savitzky-Golay smoothing
# window_length must be odd and >= polyorder + 2
smoothed = savgol_filter(data, window_length=5, polyorder=2)

print("Smoothed (Savitzky-Golay):", smoothed)
`.trim(),
sg_deriv: `
# Derivative using Savitzky-Golay filter

import numpy as np
from scipy.signal import savgol_filter

x = np.linspace(0, 10, 11)
y = np.sin(x)

# First derivative using Savitzky-Golay
# delta is the spacing between x values
dy_dx = savgol_filter(y, window_length=5, polyorder=3, deriv=1, delta=x[1] - x[0])

print("dy/dx (Savitzky-Golay):", dy_dx)
`.trim(),
fft_denoise: `
# Denoising using FFT by removing high-frequency components

import numpy as np
from numpy.fft import rfft, irfft, rfftfreq

x = np.linspace(0, 2 * np.pi, 100)
signal = np.sin(x) + 0.3 * np.random.randn(100)

# Perform FFT
freqs = rfftfreq(len(signal), d=(x[1] - x[0]))
fft_vals = rfft(signal)

# Low-pass filter: zero out frequencies above cutoff
cutoff = 2.0  # frequency threshold
fft_vals[freqs > cutoff] = 0

# Inverse FFT to reconstruct the signal
smoothed = irfft(fft_vals)

print("Denoised signal (FFT):", smoothed)
`.trim(),
dwt_denoise: `
# Denoising using Discrete Wavelet Transform (DWT)

import numpy as np
import pywt

x = np.linspace(0, 1, 200)
signal = np.exp(-100 * (x - 0.5)**2) + 0.1 * np.random.randn(200)

# Perform wavelet decomposition
wavelet = 'db4'
coeffs = pywt.wavedec(signal, wavelet, level=3)

# Soft thresholding of detail coefficients
threshold = np.median(np.abs(coeffs[-1])) / 0.6745 * np.sqrt(2 * np.log(len(signal)))
coeffs_thresh = [coeffs[0]] + [pywt.threshold(c, threshold, mode='soft') for c in coeffs[1:]]

# Reconstruct the signal
smoothed = pywt.waverec(coeffs_thresh, wavelet)

print("Denoised signal (DWT):", smoothed)
`.trim(),
minkowski: `
# Minkowski distance between two vectors

import numpy as np
from scipy.spatial.distance import minkowski

a = np.array([1, 2, 3])
b = np.array([4, 6, 8])

# Manhattan distance (p=1)
d1 = minkowski(a, b, p=1)

# Euclidean distance (p=2)
d2 = minkowski(a, b, p=2)

# Minkowski distance with p=3
d3 = minkowski(a, b, p=3)

print("Manhattan (p=1):", d1)
print("Euclidean (p=2):", d2)
print("Minkowski (p=3):", d3)
`.trim(),
pearson: `
# Pearson correlation-based distance between two vectors

import numpy as np
from scipy.stats import pearsonr

a = np.array([1, 2, 3, 4, 5])
b = np.array([2, 4, 6, 8, 10])

# Pearson correlation
r, _ = pearsonr(a, b)

# Convert to distance (1 - r)
distance = 1 - r

print("Pearson correlation coefficient:", r)
print("Correlation-based distance:", distance)
`.trim(),
spearman: `
# Spearman rank correlation-based distance between two vectors

import numpy as np
from scipy.stats import spearmanr

a = np.array([10, 20, 30, 40, 50])
b = np.array([1, 3, 2, 4, 5])

# Compute Spearman rank correlation
rho, _ = spearmanr(a, b)

# Convert to distance (1 - rho)
distance = 1 - rho

print("Spearman rank correlation:", rho)
print("Correlation-based distance:", distance)
`.trim(),
cosine: `
# Cosine distance between two vectors

import numpy as np
from scipy.spatial.distance import cosine

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Compute cosine distance
distance = cosine(a, b)

print("Cosine distance:", distance)
`.trim(),
distance_matrix: `
# Compute pairwise Euclidean distance matrix

import numpy as np
from scipy.spatial.distance import pdist, squareform

X = np.array([
    [1, 2, 3],
    [2, 3, 4],
    [4, 6, 8],
    [0, 1, 0]
])

# Pairwise Euclidean distances
dist_matrix = squareform(pdist(X, metric='euclidean'))

print("Euclidean distance matrix:")
print(dist_matrix)
`.trim(),
hca_dendrogram: `
# Hierarchical Clustering Dendrogram from a Data Matrix

import numpy as np
from scipy.cluster.hierarchy import linkage, dendrogram
import matplotlib.pyplot as plt

X = np.array([
    [1, 2, 3],
    [2, 3, 4],
    [4, 6, 8],
    [0, 1, 0],
    [3, 5, 7]
])

# Compute linkage matrix
Z = linkage(X, method='ward')

# Plot dendrogram
import matplotlib.pyplot as plt
plt.figure(figsize=(8, 4))
dendrogram(Z, labels=["A", "B", "C", "D", "E"])
plt.title("Hierarchical Clustering Dendrogram")
plt.xlabel("Sample")
plt.ylabel("Distance")
plt.tight_layout()
plt.show()
`.trim(),
kmeans_f_classif: `
# KMeans + ANOVA F-value using sklearn's f_classif

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import f_classif
import numpy as np

X = np.array([
    [1, 2, 3],
    [1.2, 2.1, 2.9],
    [4, 6, 8],
    [4.1, 5.8, 7.8],
    [4.1, 5.9, 8.2],
    [10, 10, 10]
])

# Standardize data
X_scaled = StandardScaler().fit_transform(X)

# Try different cluster numbers
for k in range(2, 5):
    kmeans = KMeans(n_clusters=k, random_state=0).fit(X_scaled)
    labels = kmeans.labels_

    # One-way ANOVA F-values for each feature
    f_vals, _ = f_classif(X_scaled, labels)
    print(f"K = {k}, mean F-value = {np.mean(f_vals):.2f}")
`.trim(),
covariance_matrix: `
# Compute covariance matrix from a data matrix

import numpy as np

X = np.array([
    [1, 2, 3],
    [2, 4, 6],
    [3, 6, 9],
    [4, 8, 12],
    [5, 10, 15]
])

# rowvar=False → variables are columns
cov_matrix = np.cov(X, rowvar=False)

print("Covariance matrix:")
print(cov_matrix)
`.trim(),
cov_eigen: `
# Covariance matrix and eigen decomposition (PCA step)

import numpy as np

X = np.array([
    [2.5, 2.4],
    [0.5, 0.7],
    [2.2, 2.9],
    [1.9, 2.2],
    [3.1, 3.0],
    [2.3, 2.7],
    [2.0, 1.6],
    [1.0, 1.1],
    [1.5, 1.6],
    [1.1, 0.9]
])

# Center the data
X_centered = X - np.mean(X, axis=0)

# Covariance matrix
cov_matrix = np.cov(X_centered, rowvar=False)

# Eigen decomposition
eig_vals, eig_vecs = np.linalg.eigh(cov_matrix)

# Sort descending
idx = np.argsort(eig_vals)[::-1]
eig_vals = eig_vals[idx]
eig_vecs = eig_vecs[:, idx]

print("Covariance matrix:\\n", cov_matrix)
print("\\nEigenvalues:\\n", eig_vals)
print("\\nEigenvectors:\\n", eig_vecs)
`.trim(),
pca_iris: `
# PCA on the Iris dataset with a 2D scores plot

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA

# Load Iris dataset
data = load_iris()
X = data.data
y = data.target
target_names = data.target_names

# PCA with 2 components
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Plot PCA scores
plt.figure(figsize=(8, 5))
for target, name in zip([0, 1, 2], target_names):
    plt.scatter(X_pca[y == target, 0], X_pca[y == target, 1], label=name, alpha=0.7)

plt.xlabel("PC1 (%.1f%% var)" % (pca.explained_variance_ratio_[0] * 100))
plt.ylabel("PC2 (%.1f%% var)" % (pca.explained_variance_ratio_[1] * 100))
plt.title("PCA of Iris Dataset")
plt.legend()
plt.tight_layout()
plt.show()
`.trim(),
pca_biplot_iris: `
# PCA Biplot: scores + loadings (Iris dataset)

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

data = load_iris()
X = StandardScaler().fit_transform(data.data)
y = data.target
feature_names = data.feature_names
target_names = data.target_names

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
loadings = pca.components_.T

plt.figure(figsize=(8, 6))
for target, name in zip([0, 1, 2], target_names):
    plt.scatter(X_pca[y == target, 0], X_pca[y == target, 1], label=name, alpha=0.6)

for i, feature in enumerate(feature_names):
    plt.arrow(0, 0, loadings[i, 0]*2, loadings[i, 1]*2, color='black', head_width=0.1, alpha=0.8)
    plt.text(loadings[i, 0]*2.2, loadings[i, 1]*2.2, feature, color='black')

plt.xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
plt.ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
plt.title("PCA Biplot (Iris Dataset)")
plt.axhline(0, color='gray', lw=0.5)
plt.axvline(0, color='gray', lw=0.5)
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
`.trim(),
rf_classification_wine: `
# Random Forest Classification: Wine Dataset

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

# Load and split data
data = load_wine()
X = data.data
y = data.target
feature_names = data.feature_names
target_names = data.target_names

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# Train classifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# Evaluation
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=target_names))

# Feature importance plot
importances = clf.feature_importances_
indices = np.argsort(importances)[::-1]

plt.figure(figsize=(10, 6))
plt.title("Feature Importances (Wine Dataset)")
plt.bar(range(len(feature_names)), importances[indices])
plt.xticks(range(len(feature_names)), [feature_names[i] for i in indices], rotation=90)
plt.ylabel("Importance")
plt.tight_layout()
plt.show()
`.trim(),
      default: `print("no example available.")`
    }

    const exampleCode = codeExamples[codeKey] || codeExamples.default;

    codeEl.textContent = exampleCode;
    if (window.Prism) Prism.highlightElement(codeEl);
    overlay.classList.remove('hidden');
  }
});
