import React, {useState, useEffect, useRef} from "react";
import Peer from "simple-peer";
import "./video-chat.css";
function VideoChat1({socket}) {
  const [userId, setUserId] = useState("");
  const [me, setMe] = useState("");
  const [name, setName] = useState("Emmy");
  const [receiverId, setReceiverId] = useState("");
  const [stream, setStream] = useState();
  const [theirStream, setTheirStream] = useState();
  const [haveIncomingCall, setHaveIncomingCall] = useState(false);
  const [haveAnsweredCall, setHaveAnsweredCall] = useState(false);
  const [call, setCall] = useState();

  const myVideo = useRef();
  const theirVideo = useRef();
  const connectionRef = useRef();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({video: true, audio: true})
      .then(stream => {
        // console.log("stream: " + stream);
        setStream(stream);
        myVideo.current.srcObject = stream;
        myVideo.current.muted = true;
        myVideo.current.play();
      });

    socket.on("me", function (data) {
      setMe(data);
      setReceiverId(data);
    });

    socket.on("calluser", function ({from, name: callerName, signal}) {
      setCall({isReceivedCall: true, from, name: callerName, signal});
      setHaveIncomingCall(true);
      // console.log("you have an incomiing call");
    });
  }, []);

  function callUser(id) {
    const peer = new Peer({initiator: true, trickle: false, stream});
    // console.log("calling user from callUser: " + id);
    peer.on("signal", data => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", currentStream => {
      theirVideo.current.srcObject = currentStream;
      setTimeout(() => {
        theirVideo.current.play();
      }, 2000);
      console.log("called stream: " + currentStream);
    });

    socket.on("callaccepted", signal => {
      setHaveAnsweredCall(true);
      peer.signal(signal);
      // console.log("called signal");
    });

    connectionRef.current = peer;
  }

  function answerCall() {
    setHaveAnsweredCall(true);

    const peer = new Peer({initiator: false, trickle: false, stream});

    peer.on("signal", data => {
      socket.emit("answercall", {signal: data, to: call.from});
      // console.log("Answered Signal");
    });

    peer.on("stream", currentStream => {
      theirVideo.current.srcObject = currentStream;
      setTimeout(() => {
        theirVideo.current.play();
      }, 2000);
      // console.log("Answered stream : " + currentStream);
      // console.log("call signal: " + call.signal);
      // theirVideo.current.play();
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  }

  return (
    <>
      <div>
        <h3>Video Chat</h3>

        <video
          ref={myVideo}
          style={{width: "300px", height: "300px", backgroundColor: "grey"}}
        ></video>
        <br />
        <br />
        {me}

        <button onClick={() => myVideo.current.play()}>PLAY</button>
        <button onClick={() => myVideo.current.pause()}>PAUSE</button>

        <button onClick={() => theirVideo.current.play()}>PLAY THEIRS</button>
        <input
          type="text"
          style={{
            width: "200px",
            padding: "10px",
            backgroundColor: "lightgrey",
          }}
          value={receiverId}
          placeholder="ReceiverId"
          onChange={e => setReceiverId(e.target.value)}
        />
        <button
          onClick={() => {
            if (receiverId === "") {
              alert("Please add a receiverId to call");
            } else {
              alert("Calling..");
              callUser(receiverId);
            }
          }}
        >
          CALL
        </button>
        {haveIncomingCall ? (
          <>
            <div>
              {" "}
              have an incoming call....{" "}
              <button onClick={() => answerCall()}>Answer?</button>
            </div>
          </>
        ) : (
          ""
        )}
        {haveAnsweredCall ? "Call answered" : ""}
      </div>
      <video
        ref={theirVideo}
        style={{width: "300px", height: "300px", backgroundColor: "green"}}
      ></video>
    </>
  );
}

export default VideoChat1;
