import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import {Gestures} from "react-gesture-handler";
import Swipe from "react-easy-swipe";

import axios from "axios";
import {globalContext} from "./global-context";
import {useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient";
import Header from "./header";
import user1 from "../images/users/9.jpg";
import user2 from "../images/users/2.jpg";
import user3 from "../images/users/3.jpg";
import user4 from "../images/users/4.jpg";
import user5 from "../images/users/5.jpg";
import timesIcon from "../images/icons/times2.png";
import heartIcon from "../images/icons/heart1.png";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import FavouriteBorderRoundedIcon from '@mui/icons-material/FavouriteBorderRounded';
// import FavouriteRoundedIcon from '@mui/icons-material/FavouriteRounded';
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"; // messages
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined"; // request
import BabyChangingStationOutlinedIcon from "@mui/icons-material/BabyChangingStationOutlined";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

import MobileNav from "./mobile-nav";
import {MobileHeader} from "./header.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

// const users = [
//   {
//     id: 1,
//     image: user1,
//     name: "John Doe",
//   },
//   {
//     id: 2,
//     image: user2,
//     name: "Samantha",
//   },
//   {
//     id: 3,
//     image: user3,
//     name: "Mary",
//   },
//   {
//     id: 4,
//     image: user4,
//     name: "Sarah",
//   },
//   {
//     id: 5,
//     image: user5,
//     name: "Abyy",
//   },
// ];
function ProfileBox({
  user,
  users,
  userCount,
  setUserCount,
  profileDetailsRef,
  profileContainerRef,
}) {
  const [userState, setUserState] = useState(user);
  const [rotationDirection, setRotationDirection] = useState("");
  const [style, setStyle] = useState({});
  const [rotationDeg, setRotationDeg] = useState(0);
  const [left, setLeft] = useState(0);
  const [display, setDisplay] = useState("block");
  const [isSwiping, setIsSwiping] = useState(false);
  const [position, setPosition] = useState(0);
  function like(id) {
    if (userCount <= users.length - 1) {
      setUserCount(state => state + 1);
      // console.log("count in like: " + userCount);

      setRotationDirection("rotate-right");
      // setInterval(function () {
      //   setLeft(left + 1);
      // }, 100);
      setTimeout(function () {
        setDisplay("none");
      }, 900);
    } else {
      alert("no more users");
      setRotationDeg(0);
      setLeft(0);
      setPosition(0);
    }
  }
  function dislike(id) {
    if (userCount <= users.length - 1) {
      setUserCount(state => state + 1);
      setRotationDirection("rotate-left");

      setTimeout(function () {
        setDisplay("none");
      }, 900);
    } else {
      alert("no more users");
      setRotationDeg(0);
      setLeft(0);
      setPosition(0);
    }
  }

  function onSwipeStart(event) {
    // console.log("Start swiping...");
  }

  function onSwipeMove(position, event) {
    setPosition(position.x);
    if (position.x <= 3 && position.x >= -3) {
      setIsSwiping(false);
      // console.log("Not moving...");
    } else {
      setIsSwiping(true);
      setLeft(position.x + 10);
      if (position.x >= 12) {
        setRotationDeg(12);
      } else if (position.x <= -12) {
        setRotationDeg(-12);
      } else {
        setRotationDeg(position.x);
      }
    }
    // console.log(`Moved ${position.x} pixels horizontally`);
    // console.log(`Moved ${position.y} pixels vertically`);
  }

  function onSwipeEnd(event) {
    // console.log("End swiping...");

    if (isSwiping) {
      if (position >= 70) {
        like(userState.id);
      } else if (position <= -70) {
        dislike(userState.id);
      } else {
        setRotationDeg(0);
        setLeft(0);
        setPosition(0);
      }
    }
  }
  return (
    // <Gestures
    //   recognizers={{
    //     Swipe: {
    //       events: {
    //         swipeleft: handleGesture,
    //         swiperight: handleGesture,
    //         swipedown: handleGesture,
    //         swipeup: handleGesture,
    //       },
    //       velocity: 0.1,
    //     },
    //   }}
    // >
    <Swipe
      onSwipeStart={onSwipeStart}
      onSwipeMove={onSwipeMove}
      onSwipeEnd={onSwipeEnd}
    >
      <div
        className={`profile-box ${rotationDirection}`}
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          left: `${left}px`,
          transition: `0.2s ease`,
          display: `${display}`,
        }}
      >
        <img
          src={process.env.REACT_APP_IMAGES_STORAGE_BUCKET + userState.image1}
          className="user-image"
          alt=""
        />
        <div className="background-overlay">
          <div className="photo-count">
            <PhotoCameraRoundedIcon className="icon" />
            <span className="count">1/3</span>
          </div>
          <div className="open-details-btn"></div>
          <div className="bottom">
            <div className="box">
              <button
                className="icon-btn"
                onClick={() => dislike(userState.user_id)}
              >
                {/* <img src={timesIcon} className="icon" alt="" /> */}
                <CloseRoundedIcon className="icon" style={{color: "black"}} />
              </button>
            </div>
            <div className="box">
              <span className="name">
                {userState.firstname}, {userState.age}{" "}
                <button className="online-status online"></button>
                <span className="sub">{userState.country}</span>
              </span>
            </div>
            <div className="box">
              <button
                className="icon-btn"
                onClick={() => like(userState.user_id)}
                style={{backgroundColor: "#d39893"}}
              >
                {/* <img src={heartIcon} className="icon" alt="" /> */}
                <FavoriteRoundedIcon className="icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Swipe>
    // </Gestures>
  );
}
function Discover({session}) {
  const globalState = useContext(globalContext);
  const profileDetailsRef = useRef(null);
  const profileContainerRef = useRef(null);
  const [users, setUsers] = useState([]);

  const [userCount, setUserCount] = useState(1);
  // const current = ;
  // console.log(current);

  useEffect(() => {
    if (!session) {
      console.log("No session");
      globalState.state.navigate("/login");
    } else {
      // console.log("session user id: " + session.user.id);
    }
    getUsers();
    // updateCurrentUser();
  }, []);

  async function getUsers() {
    const {data: profiles, error} = await supabase
      .from("profiles")
      .select("*")
      .not("user_id", "eq", session.user.id);

    console.log(profiles);
    setUsers(profiles);
  }

  return (
    <>
      <Header />
      <MobileHeader />
      <div className="Discover">
        {/* <img src={user1} alt="" /> */}
        <div className="profile-container" ref={profileContainerRef}>
          <div className="left">
            {users
              ? users.map((user, index) => {
                  return (
                    <ProfileBox
                      key={user.user_id}
                      user={user}
                      users={users}
                      userCount={userCount}
                      setUserCount={setUserCount}
                      profileDetailsRef={profileDetailsRef}
                      profileContainerRef={profileContainerRef}
                    />
                  );
                })
              : "Loading..."}
          </div>
          <div className="right">
            <div className="container" ref={profileDetailsRef}>
              <div className="name">
                {users.length > 0
                  ? users[users.length - userCount].firstname
                  : "..."}
                ,{" "}
                {users.length > 0 ? users[users.length - userCount].age : "..."}
              </div>

              <div className="mood">
                {"userCount: " + userCount + " "}
                {"users Length: " + users.length}
                <br />
                I'm up for fun, I'm up for fun, I'm up for fun, I'm up for fun,
                I'm up for fun, I'm up for fun, I'm up for fun,
              </div>
              <div className="centered-div">
                <button className="send-message-btn">
                  <Link
                    to={`/messages/${
                      users.length > 0
                        ? users[users.length - userCount].user_id
                        : ""
                    }`}
                    className="link"
                  >
                    Send Message <ForumOutlinedIcon className="icon" />
                  </Link>
                </button>
              </div>
              <div className="centered-div">
                <button className="request-btn">
                  Request One-Night-Stand{" "}
                  <RecordVoiceOverOutlinedIcon className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </>
  );
}
export default Discover;
