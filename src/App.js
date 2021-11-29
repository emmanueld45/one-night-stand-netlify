import "./App.css";
import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {supabase} from "./supabaseClient";
import Discover from "./components/discover";
import Search from "./components/search";
import Chats from "./components/chats";
import Messages from "./components/messages";
import Signup from "./components/signup";
import Login from "./components/login";
import Test from "./components/test";
import {GlobalProvider} from "./components/global-context";
import ProfileHome from "./components/profile/home";
import FixedNotification from "./components/fixed-notification";
import user1 from "./images/users/4.jpg";
import VideoChat from "./components/videoChat/video-chat";
import VideoChat1 from "./components/videoChat/video-chat1";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import io from "socket.io-client";

const socket = io.connect("http://localhost:3080");

function App() {
  const [session, setSession] = useState(
    JSON.parse(localStorage.getItem("ont_session"))
  );

  // const [incomingVideoCallData, setIncomingVideoCallData] = useState();
  var incomingVideoCallData = {};

  const VideoCallNotification = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 10000,
    timerProgressBar: true,
    didOpen: toast => {
      // toast.addEventListener("mouseenter", Swal.stopTimer);
      // toast.addEventListener("mouseleave", Swal.resumeTimer);
      toast.addEventListener("click", handleIncomingVideoCall);
    },
  });
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      localStorage.setItem("ont_session", JSON.stringify(session));
    });
    // logout();
  }, []);

  async function logout() {
    let {error} = await supabase.auth.signOut();
  }
  async function getProfile(user_id) {
    let {data: profile, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id);
    console.log(profile[0]);
    setUserProfile(profile[0]);
    return profile[0];
  }

  const [userProfile, setUserProfile] = useState({});
  const [newLogin, setNewLogin] = useState(false);
  socket.on("New login", function (data) {
    setNewLogin(true);
    setTimeout(function () {
      setNewLogin(false);
    }, 20000);
    getProfile(data.user_id);
  });

  socket.on("Incoming video call", function (data) {
    if (data.receiver_id === session.user.id) {
      console.log("sender_id: " + data.sender_id);
      console.log("receiver_id: " + data.receiver_id);
      console.log("My id: " + session.user.id);
      console.log("Sender socket id: "+data.sender_socket_id)
      incomingVideoCallData = data;
      VideoCallNotification.fire({
        icon: "success",
        title: "Incoming video call...",
      });

      // alert("You have an icoming call...");
    }
  });

  function handleIncomingVideoCall() {
    // console.log("d: " + incomingVideoCallData);
    // if (incomingVideoCallData) {
    //   alert(incomingVideoCallData.sender_id);
    // }

    window.location.href = `/video-chat/${incomingVideoCallData.sender_id}/receiver`;
  }
  return (
    <Router>
      <GlobalProvider>
        <div className="App">
          {newLogin ? (
            <FixedNotification
              sustain={20000}
              image={user1}
              title={`${
                !userProfile.firstname ? "... " : userProfile.firstname
              } is Online!`}
              description={`'Tap' to request a one night stand now!`}
              onClick={() => (window.location.href = "/profile/")}
            />
          ) : (
            // alert("New login")
            ""
          )}

          <Routes>
            <Route path="/" exact element={<Signup />}></Route>
            <Route
              path="/login"
              exact
              element={<Login socket={socket} />}
            ></Route>
            <Route
              path="/discover"
              exact
              element={<Discover session={session} />}
            ></Route>
            <Route path="/search" exact element={<Search />}></Route>
            <Route
              path="/chats"
              exact
              element={<Chats session={session} />}
            ></Route>
            <Route path="/test" exact element={<Test />}></Route>

            <Route
              path="/messages/:id"
              element={<Messages session={session} socket={socket} />}
            ></Route>

            <Route
              path="/profile/"
              element={<ProfileHome session={session} />}
            ></Route>
            <Route
              path="/video-chat/:id/:type"
              element={<VideoChat socket={socket} session={session} />}
            ></Route>
             <Route
              path="/video-chat1"
              exact
              element={<VideoChat1 socket={socket} />}
            ></Route>
          </Routes>
        </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
