import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import savgol_filter

## Reading a CSV file
df = pd.read_csv('resources/data/01_analyticalDataChallenges/SEC_CERS_Dataset.csv')

## Overview of the DataStructure
print(df.groupby('analysis').nunique())

df_analysis = df.groupby('analysis')
for i in df_analysis.groups:
    tic = df_analysis.get_group(i).groupby('rt')
    tic_sum = tic.apply(lambda x: x['intensity'].sum())
    index_of_max_tic = tic_sum.idxmax()
    spectrum_at_max_tic = tic.get_group(index_of_max_tic)

    ## get the indices of the tic_sum lowest 10%
    lowest_10_percent = tic_sum[tic_sum <= tic_sum.quantile(0.1)].index
    ## average the spectra at these indices
    average_spectrum_of_lowest_10_percent = [tic.get_group(u)['intensity'].values.flatten() for u in lowest_10_percent]
    average_spectrum_of_lowest_10_percent = np.vstack(average_spectrum_of_lowest_10_percent).mean(axis=0)

    sgol_derivative = savgol_filter(spectrum_at_max_tic['intensity'] - average_spectrum_of_lowest_10_percent, 19, 3, deriv=1)

    sgol_derivative[0:150] = 0


    plt.subplot(411)
    plt.plot(tic_sum.index, tic_sum.values)

    plt.subplot(412)
    plt.plot(spectrum_at_max_tic['shift'], spectrum_at_max_tic['intensity'])
    plt.plot(spectrum_at_max_tic['shift'], average_spectrum_of_lowest_10_percent)

    plt.subplot(413)
    plt.plot(spectrum_at_max_tic['shift'], spectrum_at_max_tic['intensity'] - average_spectrum_of_lowest_10_percent)

    plt.subplot(414)
    plt.plot(spectrum_at_max_tic['shift'], sgol_derivative)
    plt.show()
    exit()
