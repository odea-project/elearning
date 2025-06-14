from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Keywords extracted from the presentation
text = """
Data Processing Techniques Objectives Analyte Matrix System Extract Signal 
Data Preprocessing Comparable Scaling Normalization Standardization Harmonization 
Convolution Kernel Smoothing Boxcar Gaussian Savitzky-Golay Derivative 
Fourier Transformation Axial Frequency Radial Interference Filtering 
Discrete Wavelet Transformation DWT Wavelet Approximation Details 
Multi Resolution Analysis Image Compression Transient Detection
"""

# Generate and display the word cloud
wc = WordCloud(width=800, height=400, background_color='white').generate(text)
plt.figure(figsize=(12, 6))
plt.imshow(wc, interpolation='bilinear')
plt.axis('off')
plt.show()
