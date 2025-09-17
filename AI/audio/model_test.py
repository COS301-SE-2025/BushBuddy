import tensorflow as tf
import librosa
import numpy as np

# --- CONFIG ---
MODEL_PATH = "best_model.h5"
LABELS = ['baboon', 'black wildebeest', 'buffalo', 'cheetah', 'elephant', 'hippo', 'impala', 'lion', 'meerkat', 'rhino']  # same order as training
N_MFCC = 40
EXPECTED_FRAMES = 87 
SR = 22050 

model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded")

audio_file = "data/meerkat/mee_6.wav" 
y, sr = librosa.load(audio_file, sr=SR)

mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC, hop_length=512)

if mfcc.shape[1] < EXPECTED_FRAMES:
    pad_width = EXPECTED_FRAMES - mfcc.shape[1]
    mfcc = np.pad(mfcc, ((0,0),(0,pad_width)), mode='constant')
else:
    mfcc = mfcc[:, :EXPECTED_FRAMES]

input_tensor = mfcc[np.newaxis, :, :, np.newaxis].astype(np.float32)

# run the prediction
pred = model.predict(input_tensor)[0]
pred_labels = {LABELS[i]: float(pred[i]) for i in range(len(LABELS))}

print("Predicted probabilities:")
for label, score in pred_labels.items():
    print(f"{label}: {score:.3f}")

top_index = np.argmax(pred)
print(f"\nMost likely: {LABELS[top_index]} ({pred[top_index]*100:.1f}%)")
