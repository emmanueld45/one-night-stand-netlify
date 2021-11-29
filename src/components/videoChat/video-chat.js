import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Peer from "simple-peer";
import "./video-chat.css";
import user1 from "../../images/users/1.jpg";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

function VideoChat({socket, session}) {
  const [userId, setUserId] = useState("");
  const [me, setMe] = useState("");
  const [name, setName] = useState("Emmy");
  const [receiverId, setReceiverId] = useState("");
  const [stream, setStream] = useState();
  const [theirStream, setTheirStream] = useState();
  const [haveIncomingCall, setHaveIncomingCall] = useState(false);
  const [haveAnsweredCall, setHaveAnsweredCall] = useState(false);
  const [call, setCall] = useState();

  const [mute, setMute] = useState(false);
  const [allowVideo, setAllowVideo] = useState(true);

  const myVideo = useRef();
  const theirVideo = useRef();
  const connectionRef = useRef();

  const params = useParams();
  const receiver_id = params.id;
  const connection_type = params.type;
  var receiver_socket_id = "";
  var is_calling = true;
  var mee = "";
  console.log("connection type: " + connection_type);

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
      mee = data;
      alert("Your socket id: " + data);
      // let rcvId = prompt("Enter receiver Id");
      // setReceiverId(rcvId);
      // alert("receiverId: " + rcvId);
    });

    socket.on("calluser", function ({from, name: callerName, signal}) {
      setCall({isReceivedCall: true, from, name: callerName, signal});
      setHaveIncomingCall(true);
      console.log("Call from in callUser socket: "+from);
    });

    socket.on("Incoming video call acknowleged", function (data) {
      if (
        data.sender_id === session.user.id &&
        data.receiver_id === receiver_id
      ) {
        // receiver_socket_id = data.receiver_socket_id;
        console.log("Receiver socket id is set");
        console.log("Receiver socket id: "+data.receiver_socket_id)
        if (is_calling) {
          callUser(data.receiver_socket_id);
          console.log("Calling now...");
          is_calling = false;
        }
       
      }
      // console.log("you have an incomiing call");
    });
    if (connection_type === "sender") {
      setTimeout(() => {
        socket.emit("Incoming video call", {
          sender_id: session.user.id,
          receiver_id,
          sender_socket_id: mee,
        });
        console.log("Me/sender socket id: " + mee);
      }, 2000);
      // console.log("sender to receiver: " + receiver_id);
    } else if (connection_type === "receiver") {
      setTimeout(() => {
        socket.emit("Incoming video call acknowleged", {
          sender_id: receiver_id,
          receiver_id: session.user.id,
          receiver_socket_id: mee,
        });
        console.log("Me/receiver socket id: " + mee);
      }, 2000);
    }
  }, []);

  function callUser(id) {
    const peer = new Peer({initiator: true, trickle: false, stream});
    // console.log("calling user from callUser: " + id);
    peer.on("signal", data => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: mee,
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
      console.log("Call.from in answerCall: " + call.from);
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
      <div className="video-chat">
        {connection_type === "sender" && !haveAnsweredCall ? (
          <div className="calling-overlay">
            <div className="name">Anna Williams</div>
            <div className="calling">Calling..</div>

            <div className="image-container">
              <div className="box">
                <img src={user1} alt="" className="image" />
              </div>
            </div>

            <div className="call-btn-container">
              <button className="end-call-btn">
                <CallEndIcon />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {connection_type === "receiver" && !haveAnsweredCall ? (
          <div className="calling-overlay">
            <div className="name">Anna Williams</div>
            <div className="calling">Is Calling you...</div>

            <div className="image-container">
              <div className="box">
                <img src={user1} alt="" className="image" />
              </div>
            </div>

            <div className="call-btn-container">
              {haveIncomingCall ? (
                <button
                  className="answer-call-btn"
                  onClick={() => {
                    answerCall();
                  }}
                >
                  <CallIcon />
                </button>
              ) : (
                <button
                  className="answer-call-btn"
              
                >
                  Processing...
                </button>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="streaming-container">
          <video ref={myVideo} className="my-video"></video>
          <video ref={theirVideo} className="their-video"></video>
          <div className="action-btns-container">
            <button className="action-btn" onClick={() => setMute(!mute)}>
              {mute ? <MicOffIcon /> : <MicNoneIcon />}
            </button>
            <button
              className="action-btn end-btn"
              onClick={() => callUser(receiverId)}
            >
              <CallEndIcon />
            </button>
            <button
              className="action-btn"
              onClick={() => {
                setAllowVideo(!allowVideo);
                answerCall();
              }}
            >
              {allowVideo ? <VideocamIcon /> : <VideocamOffIcon />}
            </button>
          </div>
        </div>
      
        {/* <video
        ref={theirVideo}
        style={{width: "300px", height: "300px", backgroundColor: "green"}}
      ></video> */}
      </div>
    </>
  );
}

export default VideoChat;
