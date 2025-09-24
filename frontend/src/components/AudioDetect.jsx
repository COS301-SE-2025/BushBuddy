import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const AudioDetect = ({ modelPath = '/audio-model/model.json' }) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js backend:', tf.getBackend());

        const loadedModel = await tf.loadLayersModel(modelPath);
        setModel(loadedModel);

        console.log('Model loaded successfully');
        console.log('Inputs:', loadedModel.inputs);
        console.log('Outputs:', loadedModel.outputs);
      } catch (err) {
        console.error('Model load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [modelPath]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">🦁 Wildlife Audio Classifier</h1>

      {loading && <p>Loading model...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {model && <p className="text-green-600">✅ Model ready</p>}
    </div>
  );
};

export default AudioDetect;
