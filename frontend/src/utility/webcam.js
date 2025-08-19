export class webcam {
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
            });
        } else alert("Can't open camera");
    };
}