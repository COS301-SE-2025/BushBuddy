import React from 'react';
import './AudioDetect.css';

const AudioDetect = () => {

    const DetectAudio = async => {
        alert("listening for animals");
    }

    return (
        <div className='audio-detect-page'>
            <h1>This is the audio page</h1>
            <button onClick={DetectAudio}>Test audio</button>
        </div>
    );
};

export default AudioDetect;