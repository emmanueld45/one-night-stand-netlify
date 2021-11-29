import React, {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient";
import user1 from "../images/users/9.jpg";
import defaultUser from "../images/user.png";
import {Link} from "react-router-dom";
import Header from "./header.js";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
// import TableRowsIcon from "@mui/icons-material/TableRows";
import ListIcon from "@mui/icons-material/List";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MoodIcon from "@mui/icons-material/Mood";
import {
  addChat,
  addTextMessage,
  addSmileyMessage,
  getMessages,
  markMessageAsRead,
} from "./handlers/messagesHandler";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function Smiley({smiley, sendSmiley}) {
  const [showLoader, setShowLoader] = useState(false);
  if (showLoader) {
    return (
      <CircularProgress style={{color: "#d39893", margin: "10px"}} size={50} />
    );
  } else {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/smilies/${smiley}`}
        alt=""
        style={{
          width: "50px",
          height: "50px",
          margin: "10px",
          cursor: "pointer",
        }}
        className="smiley"
        onClick={() => {
          setShowLoader(true);
          sendSmiley(smiley);
        }}
      />
    );
  }
}
function MessageLeft({message, session, receiverProfile}) {
  useEffect(() => {
    markAsRead();
  }, []);

  async function markAsRead() {
    if (message.read === "no") {
      const [data, error] = await markMessageAsRead(message.id);
    }
  }
  return (
    <div className="message-left">
      <div className="box">
        <div className="row1">
          <img
            src={
              receiverProfile
                ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                  receiverProfile.image1
                : defaultUser
            }
            alt=""
            className="user-image"
          />
        </div>
        <div className="row2">
          {message.message_type === "text" ? (
            <div className="text">{message.content}</div>
          ) : (
            ""
          )}
          {message.message_type === "smiley" ? (
            <>
              <div className="image-container">
                <img
                  src={`${process.env.PUBLIC_URL}/smilies/${message.content}`}
                  alt=""
                  style={{width: "50px", height: "50px"}}
                />
              </div>
            </>
          ) : (
            ""
          )}
          <div className="time">{message.short_time}</div>
        </div>
      </div>
    </div>
  );
}

function MessageRight({message}) {
  return (
    <div className="message-right">
      <div className="box">
        {message.message_type === "text" ? (
          <div className="text">{message.content}</div>
        ) : (
          ""
        )}
        {message.message_type === "smiley" ? (
          <>
            <div className="image-container">
              <img
                src={`${process.env.PUBLIC_URL}/smilies/${message.content}`}
                alt=""
                style={{width: "50px", height: "50px"}}
              />
            </div>
          </>
        ) : (
          ""
        )}
        <div className="time">{message.short_time}</div>
      </div>
    </div>
  );
}
function Messages({match, session, socket}) {
  const [receiverProfile, setReceiverProfile] = useState();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [haveText, setHaveText] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toggleSmileyDrawer, setToggleSmileyDrawer] = useState(false);
  const [smilies, setSmilies] = useState([
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "1.png",
    "2.png",
  ]);

  const params = useParams();
  const receiver_id = params.id;
  const messagesBottom = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    getMsg("all");
    getReceiverProfile();
    console.log("receiver_id: " + receiver_id);
  }, []);

  async function getReceiverProfile() {
    const {data, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", receiver_id);
    setReceiverProfile(data[0]);
  }
  socket.on("New message", function (data) {
    if (
      data.receiver_id === session.user.id &&
      data.sender_id === receiver_id
    ) {
      getMsg("new");
    }
  });

  socket.on("Is typing", function (data) {
    if (
      data.receiver_id === session.user.id &&
      data.sender_id === receiver_id
    ) {
      setIsTyping(true);
    }
  });

  socket.on("Have stopped typing", function (data) {
    if (
      data.receiver_id === session.user.id &&
      data.sender_id === receiver_id
    ) {
      setIsTyping(false);
    }
  });

  async function getMsg(type) {
    const [res, err] = await getMessages(session.user.id, receiver_id);
    if (err) {
      alert(err.message);
    } else if (res) {
      setMessages(res);
      setPageIsLoading(false);
      if (type === "all") {
        messagesBottom.current.scrollIntoView({behavior: "smooth"});
      }
    }
  }

  async function sendText() {
    setIsSending(true);
    const [res, err] = await addChat(session.user.id, receiver_id);
    if (err) {
      alert(err.message);
    } else if (res) {
      const [res, err] = await addTextMessage(
        session.user.id,
        receiver_id,
        messageText
      );
      if (err) {
        alert(err.message);
      } else if (res) {
        // alert("Message sent!");
        setMessageText("");
        setIsSending(false);
        setHaveText(false);
        getMsg("all");
        socket.emit("New message", {
          sender_id: session.user.id,
          receiver_id: receiver_id,
        });
      }
    }
  }

  async function sendSmiley(smiley) {
    setIsSending(true);
    const [res, err] = await addChat(session.user.id, receiver_id);
    if (err) {
      alert(err.message);
    } else if (res) {
      const [res, err] = await addSmileyMessage(
        session.user.id,
        receiver_id,
        smiley
      );
      if (err) {
        alert(err.message);
      } else if (res) {
        // alert("Message sent!");
        setToggleSmileyDrawer(!toggleSmileyDrawer);
        setIsSending(false);
        getMsg("all");
        socket.emit("New message", {
          sender_id: session.user.id,
          receiver_id: receiver_id,
        });
      }
    }
  }

  return (
    <>
      <Header />
      <div className="Messages">
        <div className="content">
          <div className="header">
            <div className="row1">
              <ChevronLeftRoundedIcon
                className="back-icon"
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="row2">
              <div className="image-container">
                <img
                  src={
                    receiverProfile
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                        receiverProfile.image1
                      : defaultUser
                  }
                  alt=""
                  className="user-image"
                />
              </div>
              <span className="name">
                {receiverProfile ? receiverProfile.firstname : "..."}
              </span>
            </div>
            <div className="row3">
              <VideocamIcon
                className="menu-btn"
                onClick={() =>
                  (window.location.href = `/video-chat/${receiver_id}/sender`)
                }
              />

              {/* <ListIcon className="menu-btn" /> */}
            </div>
          </div>
          <div className="message-body">
            {!pageIsLoading ? (
              messages.map((message, index) => {
                if (message.sender_id === session.user.id) {
                  return (
                    <MessageRight
                      key={index}
                      message={message}
                      session={session}
                    />
                  );
                } else {
                  return (
                    <MessageLeft
                      key={index}
                      message={message}
                      session={session}
                      receiverProfile={receiverProfile}
                    />
                  );
                }
              })
            ) : (
              <>
                {" "}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Loader
                    type="ThreeDots"
                    color="slategray"
                    height={50}
                    width={50}
                  />
                </div>
              </>
            )}
            {isTyping ? (
              <>
                <div className="message-left">
                  <div className="box">
                    <div className="row1">
                      <img src={user1} alt="" className="user-image" />
                    </div>
                    <div className="row2">
                      <div className="text">...</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {/* <MessageLeft />
            <MessageRight /> */}

            <div ref={messagesBottom}></div>
          </div>
          <div className="bottom">
            <input
              type="text"
              placeholder="Type your message.."
              value={messageText}
              className="field"
              disabled={isSending}
              onChange={e => {
                if (e.target.value !== "") {
                  socket.emit("Is typing", {
                    sender_id: session.user.id,
                    receiver_id: receiver_id,
                  });
                  setHaveText(true);
                } else {
                  socket.emit("Have stopped typing", {
                    sender_id: session.user.id,
                    receiver_id: receiver_id,
                  });
                  setHaveText(false);
                }
                setMessageText(e.target.value);
              }}
            />
            <button
              className="smiley-btn"
              onClick={() => setToggleSmileyDrawer(!toggleSmileyDrawer)}
            >
              <MoodIcon className="icon" />
            </button>
            <button
              className="send-btn"
              disabled={isSending}
              onClick={() => {
                if (!haveText) {
                  // alert("Please add a text");
                } else {
                  sendText();
                }
              }}
            >
              {isSending ? (
                <CircularProgress
                  className="circular-progress-icon"
                  size={25}
                />
              ) : (
                <SendRoundedIcon
                  className={`icon ${haveText ? "active" : ""}`}
                />
              )}
            </button>
          </div>
        </div>
        <Drawer
          anchor={"bottom"}
          open={toggleSmileyDrawer}
          onClose={() => {
            setToggleSmileyDrawer(!toggleSmileyDrawer);
          }}
        >
          <div
            className="smilies-container"
            style={{
              width: "95%",
              margin: "auto",
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "center",
              padding: "20px 0px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {smilies.map((smiley, index) => {
              return (
                <Smiley
                  key={index}
                  smiley={smiley}
                  sendSmiley={sendSmiley}
                  isSending={isSending}
                />
              );
            })}
            {}
          </div>
        </Drawer>
      </div>
    </>
  );
}

export default Messages;
