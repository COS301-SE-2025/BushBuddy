import h5py
import numpy as np

with h5py.File('best_model.h5', 'r') as f:
    if 'class_names' in f.attrs:
        labels = f.attrs['class_names']
    elif 'labels' in f.attrs:
        labels = f.attrs['labels']
    
    print("Model attributes:", list(f.attrs.keys()))

# Get the labels from data file
npz_file = np.load("dataset_mfcc.npz")

print(npz_file.files)

labels = npz_file["labels"] 

print(labels.shape)
print(labels) 
