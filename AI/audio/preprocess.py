# preprocess.py
import os
import librosa
import numpy as np
from tqdm import tqdm

DATA_DIR = "data"
OUT_FILE = "dataset_mfcc.npz"

sr = 22050           
duration = 2.0       
samples = int(sr * duration)
n_mfcc = 40
n_fft = 1024
hop_length = 512  

def file_to_mfcc(path):
    y, _ = librosa.load(path, sr=sr, mono=True)
    if len(y) < samples:
        y = np.pad(y, (0, samples - len(y)))
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc,
                                    n_fft=n_fft, hop_length=hop_length)
        return mfcc.astype(np.float32)
    out = []
    idx = 0
    while idx + samples <= len(y):
        segment = y[idx:idx+samples]
        mfcc = librosa.feature.mfcc(y=segment, sr=sr, n_mfcc=n_mfcc,
                                    n_fft=n_fft, hop_length=hop_length)
        out.append(mfcc.astype(np.float32))
        idx += samples 
    return out 

X = []
y = []
classes = sorted(os.listdir(DATA_DIR))
label_map = {c:i for i,c in enumerate(classes)}

for c in classes:
    cdir = os.path.join(DATA_DIR, c)
    for fname in tqdm(os.listdir(cdir), desc=c):
        path = os.path.join(cdir, fname)
        mf = file_to_mfcc(path)
        if mf is None:
            continue
        if isinstance(mf, list):
            for m in mf:
                X.append(m)
                y.append(label_map[c])
        else:
            X.append(mf)
            y.append(label_map[c])

X = np.array([x for x in X])
y = np.array(y)

X = X[..., np.newaxis]

np.savez_compressed(OUT_FILE, X=X, y=y, labels=np.array(classes))
print("Saved", OUT_FILE, "X shape", X.shape, "y shape", y.shape)
