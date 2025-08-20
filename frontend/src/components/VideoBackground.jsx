import React from "react";
import './VideoBackground.css'

const VideoBackground = () => {

    return (
        <div>
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="video-background"
            >
                <source src={require(`../assets/nature-background.mp4`)} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};


export default VideoBackground;