import React, {useState, useContext, useEffect} from "react";
import {supabase} from "../supabaseClient";
import backgroundImage from "../images/screenshot/1.PNG";
import {globalContext} from "./global-context";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FixedNotification from "./fixed-notification";
import user1 from "../images/users/4.jpg";

function Login({socket}) {
  const MySwal = withReactContent(Swal);

  const Toast = MySwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 10000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
      toast.addEventListener("click", function () {
        globalState.state.navigate("/profile");
      });
    },
  });

  var user = {
    email: "",
    password: "",
  };
  const [userState, setUserState] = useState(user);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const globalState = useContext(globalContext);
  async function loginUser() {
    setLoading(true);

    let {user, session, error} = await supabase.auth.signIn({
      email: userState.email,
      password: userState.password,
    });

    if (error) {
      if (error.messsage === "Invalid login credentials") {
        setError("Invalid login credentials");
      } else {
        setError("Connection error occurred. try again");
      }
      setLoading(false);
    } else if (user) {
      setError("Logging you in...");
      setLoading(false);
      globalState.setState(state => {
        return {...state, session: session};
      });
      socket.emit("New login", {user_id: user.id});

      localStorage.setItem("ont_session", JSON.stringify(session));
      globalState.state.navigate("/discover");
    }
  }

  useEffect(() => {
    // Toast.fire({
    //   icon: "error",
    //   title: "Invalid login credentials",
    // });
  });

  return (
    <>
      <div className="Authpage">
        {/* <FixedNotification
          sustain={20000}
          image={user1}
          title="Samanta is Online!"
          description="'Tap' to request a one night stand now!"
          onClick={() => alert("Requesting One Night Stand...")}
        /> */}
        <div className="left">
          <div className="action-container show">
            <div className="action-title">Login</div>
            <div className="action-error">{error}</div>
            <input
              type="text"
              className="action-field"
              placeholder="Enter email"
              value={userState.email}
              onChange={e =>
                setUserState(s => {
                  return {...s, email: e.target.value};
                })
              }
            />
            <input
              type="password"
              className="action-field"
              placeholder="Enter password"
              value={userState.password}
              onChange={e =>
                setUserState(s => {
                  return {...s, password: e.target.value};
                })
              }
            />
            <button
              className="action-btn filled"
              onClick={() => {
                if (userState.email === "") {
                  setError("email cannot be empty!");
                } else if (userState.password === "") {
                  setError("password cannot be empty!");
                } else {
                  loginUser();
                }
              }}
              disabled={loading}
            >
              {loading ? "Please wait.." : "Login"}
            </button>
          </div>
        </div>
        <div className="right">
          <img src={backgroundImage} alt="" className="background-image" />
        </div>
      </div>
    </>
  );
}

export default Login;
