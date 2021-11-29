import React, {useState, useEffect, useRef} from "react";

function VideoChat() {
  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({video: true, audio: true})
    //   .then(stream => {
    //     setMyStream(stream);
    //     myVideo.current.srcObject = stream;
    //   });
  }, []);
  return (
    <>
      <div>
        <h3>Video Chat</h3>
      </div>
    </>
  );
}

export default VideoChat();
