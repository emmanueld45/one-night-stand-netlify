import React, {useState, useEffect} from "react";
import Header, {MobileHeader} from "./header";
import {supabase} from "../supabaseClient";
import MobileNav from "./mobile-nav";
import defaultUser from "../images/user.png";
import user1 from "../images/users/1.jpg";
import {Link} from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {getDetails} from "./handlers/usersHandler";
import {
  getChats,
  getNumUnreadMessages,
  getLatestMessage,
} from "./handlers/messagesHandler";
import Skeleton from "@mui/material/Skeleton";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function MatchBox() {
  return (
    <div className="box">
      <Link to="/messages" className="link">
        <div className="image-container">
          <img src={user1} alt="" className="user-image" />
          <div className="background-overlay"></div>
        </div>
      </Link>
    </div>
  );
}

function ChatBox({user_id, session, searched}) {
  const [details, setDetails] = useState();
  const [numUnreadMessages, setNumUnreadMessages] = useState(0);
  const [latestMessage, setLatestMessage] = useState();
  const [latestMessageTime, setLatestMessageTime] = useState();

  useEffect(() => {
    getDetailss();
    getNumUnreadMessagess();
    getLatestMessagee();
  }, []);

  async function getDetailss() {
    const [res, err] = await getDetails(user_id);
    if (res) {
      setDetails(res);
    }
  }

  async function getNumUnreadMessagess() {
    const [res, err] = await getNumUnreadMessages(session.user.id, user_id);
    setNumUnreadMessages(res);
  }

  async function getLatestMessagee() {
    const [data, error] = await getLatestMessage(session.user.id, user_id);
    // throw data;
    if (data.message_type === "text") {
      setLatestMessage(data.content);
    } else if (data.message_type === "smiley") {
      setLatestMessage("**sent smiley");
    }
    setLatestMessageTime(data.short_time);
  }
  return (
    <Link
      to={`/messages/${details ? details.user_id : ""}`}
      className={`box link ${searched ? "searched" : ""}`}
    >
      <div className="row1">
        <div className="image-container">
          <img
            src={
              details
                ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET + details.image1
                : defaultUser
            }
            alt=""
            className="user-image"
          />
        </div>
      </div>
      <div className="row2">
        <div className="name">{details ? details.firstname : "..."}</div>
        <div className="message">{latestMessage ? latestMessage : "..."}</div>
        <span className="time">
          {latestMessageTime ? latestMessageTime : "..."}
        </span>
        {numUnreadMessages > 0 ? (
          <button className="messages-count">{numUnreadMessages}</button>
        ) : (
          ""
        )}
        {/* <button className="messages-count">{numUnreadMessages}</button> */}
      </div>
    </Link>
  );
}
function Chats({session}) {
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [chats, setChats] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [searchedChats, setSearchedChats] = useState([]);
  useEffect(() => {
    getChatss();
  }, []);

  async function getChatss() {
    const [res, err] = await getChats(session.user.id);

    if (err) {
      alert(err.message);
    } else if (res) {
      setChats(res);
    }
  }

  async function searchChats(query) {
    if (query === "") {
      setSearchedChats([]);
      return;
    }
    let usersNotMe = [];
    let searched = [];

    chats.map(chat => {
      if (chat.sender_id !== session.user.id) {
        usersNotMe.push(chat.sender_id);
      }
      if (chat.receiver_id !== session.user.id) {
        usersNotMe.push(chat.receiver_id);
      }
    });
    let {data: profiles, error} = await supabase
      .from("profiles")
      .select("*")
      .ilike("firstname", `%${query}%`);

    profiles.map(profile => {
      if (usersNotMe.includes(profile.user_id)) {
        searched.push(profile);
      }
    });

    setSearchedChats(searched);
  }

  function handleSearchInput(e) {
    setSearchInput(e.target.value);
    searchChats(e.target.value);
  }
  return (
    <>
      <Header />
      <MobileHeader />
      <div className="Chats">
        {searchedChats.length > 0
          ? console.log("searched chats: " + searchedChats[0].firstname)
          : ""}
        <div className="matches-container">
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
          <MatchBox />
        </div>

        <div className="chats-container">
          <div className="search-container">
            <button className="search-btn">
              <SearchRoundedIcon className="icon" />
            </button>
            <input
              type="text"
              className="search-field"
              value={searchInput}
              placeholder="Search"
              onChange={e => {
                handleSearchInput(e);
              }}
            />
          </div>
          {searchedChats.length > 0
            ? searchedChats.map((chat, index) => {
                return (
                  <ChatBox
                    key={index}
                    session={session}
                    user_id={chat.user_id}
                    searched={true}
                  />
                );
              })
            : ""}
          {chats ? (
            chats.map((chat, index) => {
              var user_id = "";
              if (chat.sender_id === session.user.id) {
                user_id = chat.receiver_id;
              } else if (chat.receiver_id === session.user.id) {
                user_id = chat.sender_id;
              }
              return (
                <ChatBox key={index} session={session} user_id={user_id} />
              );
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
        </div>
      </div>
      <MobileNav />
    </>
  );
}

export default Chats;
