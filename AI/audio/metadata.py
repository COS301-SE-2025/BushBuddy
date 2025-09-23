import h5py

with h5py.File('best_model.h5', 'r') as f:
    if 'class_names' in f.attrs:
        labels = f.attrs['class_names']
    elif 'labels' in f.attrs:
        labels = f.attrs['labels']
    
    print("Model attributes:", list(f.attrs.keys()))