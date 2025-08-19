export class Webcam {
    open = (videoRef) => {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "environment",
                },
            })
            .then((stream) => {
                videoRef.srcObject = stream;
                console.log("Stream input received : ", videoRef.srcObject);
            });
        } else alert("Can't open camera");
    };

    close = (videoRef) => {
        if(videoRef.srcObject) {
            videoRef.srcObject.getTracks().forEach((track) => {
                track.stop();                
            });
            videoRef.srcObject = null;
        } else alert("Please open webcam first");
    };
}