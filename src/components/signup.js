import React, {useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient";

import backgroundImage from "../images/screenshot/1.PNG";
import {globalContext} from "./global-context";

function Signup({session}) {
  const globalState = useContext(globalContext);
  // if (session) {
  //   globalState.state.navigate("/discover");
  // }
  var user = {
    gender: "",
    looking_for: "",
    country: "",
    region: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    age: "",
  };
  const [userState, setUserState] = useState(user);
  const [screen, setScreen] = useState("SelectGender");

  // const globalState = useContext(globalContext);
  async function signupUser(password) {
    let {data: profiles, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("email", userState.email);

    if (error) {
      alert("An error ocurred");
    } else {
      if (profiles.length === 0) {
        let {user, error} = await supabase.auth.signUp({
          email: userState.email,
          password: password,
        });

        if (error) {
          if (error.message === "Password should be at least 6 characters") {
            alert("Password should be at least 6 characters");
          } else {
            alert("An error ocurred, pls try again!");
          }
        } else {
          let {data, error} = await supabase.from("profiles").insert([
            {
              firstname: userState.firstname,
              lastname: userState.lastname,
              email: userState.email,
              gender: userState.gender,
              looking_for: userState.looking_for,
              country: userState.country,
              region: userState.region,
              status: "active",
              user_id: user.id,
              is_available: "no",
              updated_at: new Date(),
              image1: "",
              image2: "",
              image3: "",
              image4: "",
              image5: "",
              age: userState.age,
              balance: 0,
            },
          ]);

          if (error) {
            alert("An error ocuured, pls try again");
          } else if (data) {
            alert("Signup successful");
            globalState.state.navigate("/discover");
          }
          // if (error) throw error;
        }
      } else {
        alert("user already exists");
        setScreen("SelectEmail");
      }
    }
  }

  useEffect(() => {});

  function SelectGender() {
    return (
      <div className="action-container show">
        <div className="action-title">Can we know your gender?</div>
        <button
          className="action-btn filled"
          onClick={() => {
            setUserState(s => {
              return {...s, gender: "man", prefix: "him"};
            });

            setScreen("SelectLookingFor");
          }}
        >
          I am a man
        </button>
        <button
          className="action-btn filled"
          onClick={() => {
            setUserState(s => {
              return {...s, gender: "woman", prefix: "her"};
            });
            setScreen("SelectLookingFor");
          }}
        >
          I am a woman
        </button>

        <div className="action-footer">
          Please answer few questions to help create an account for you
        </div>
      </div>
    );
  }

  function SelectLookingFor() {
    return (
      <div className="action-container show">
        <div className="action-title">I am:</div>

        <button
          className="action-btn outlined"
          onClick={() => {
            setUserState(s => {
              return {...s, looking_for: "man"};
            });

            setScreen("SelectAge");
          }}
        >
          Looking for a man
        </button>
        <button
          className="action-btn outlined"
          onClick={() => {
            setUserState(s => {
              return {...s, looking_for: "woman"};
            });
            setScreen("SelectAge");
          }}
        >
          Looking for a woman
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectGender")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectAge() {
    const [state, setState] = useState(18);
    const [error, setError] = useState("");
    return (
      <div className="action-container show">
        <div className="action-title">How old are you:</div>
        <div className="action-error">{error}</div>

        <select
          value={state}
          className="action-field"
          onChange={e => setState(e.target.value)}
          style={{width: "100%"}}
        >
          <option>18</option>
          <option>19</option>
        </select>

        <button
          className="action-btn filled"
          onClick={() => {
            if (state === "") {
              setError("Age cannot be empty!");
            } else {
              setUserState(s => {
                return {...s, age: state};
              });
              setScreen("SelectCountry");
            }
          }}
        >
          Next
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectLookingFor")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectCountry() {
    const [state, setState] = useState("Nigeria");
    const [error, setError] = useState("");
    return (
      <div className="action-container show">
        <div className="action-title">Select Country:</div>
        <div className="action-error">{error}</div>

        <select
          value={state}
          className="action-field"
          onChange={e => setState(e.target.value)}
          style={{width: "100%"}}
        >
          <option>Nigeria</option>
          <option>Ghana</option>
        </select>

        <button
          className="action-btn filled"
          onClick={() => {
            if (state === "") {
              setError("Country cannot be empty!");
            } else {
              setUserState(s => {
                return {...s, country: state};
              });
              setScreen("SelectRegion");
            }
          }}
        >
          Next
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectAge")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectRegion() {
    const [state, setState] = useState("");
    const [error, setError] = useState("");
    return (
      <div className="action-container show">
        <div className="action-title">Enter Region/state</div>
        <div className="action-error">{error}</div>

        <input
          type="text"
          className="action-field"
          placeholder="type here.."
          value={state}
          onChange={e => setState(e.target.value)}
        />

        <button
          className="action-btn filled"
          onClick={() => {
            if (state === "") {
              setError("region/state cannot be empty!");
            } else {
              setUserState(s => {
                return {...s, region: state};
              });
              setScreen("SelectFirstAndLastName");
            }
          }}
        >
          Next
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectCountry")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectFirstAndLastName() {
    const [state, setState] = useState({firstname: "", lastname: ""});
    const [error, setError] = useState("");
    return (
      <div className="action-container show">
        <div className="action-title">Your names?</div>
        <div className="action-error">{error}</div>
        <input
          type="text"
          className="action-field"
          placeholder="Enter firstname"
          value={state.firstname}
          onChange={e =>
            setState(s => {
              return {...s, firstname: e.target.value};
            })
          }
        />
        <input
          type="text"
          className="action-field"
          placeholder="Enter lastname"
          value={state.lastname}
          onChange={e =>
            setState(s => {
              return {...s, lastname: e.target.value};
            })
          }
        />
        <button
          className="action-btn filled"
          onClick={() => {
            if (state.firstname === "") {
              setError("firstname cannot be empty!");
            } else if (state.lastname === "") {
              setError("lastname cannot be empty!");
            } else {
              console.log(state);
              setUserState(s => {
                return {
                  ...s,
                  firstname: state.firstname,
                  lastname: state.lastname,
                };
              });
              // alert("next");
              setScreen("SelectEmail");
            }
          }}
        >
          Next
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectRegion")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectEmail() {
    const [state, setState] = useState("");
    const [error, setError] = useState("");
    return (
      <div className="action-container show">
        <div className="action-title">Tell us your email:</div>
        <div className="action-error">{error}</div>
        <input
          type="text"
          className="action-field"
          placeholder="Enter email"
          value={state.value}
          onChange={e => setState(e.target.value)}
        />

        <button
          className="action-btn filled"
          onClick={async () => {
            if (state === "") {
              setError("email cannot be empty!");
            } else {
              setUserState(s => {
                return {...s, email: state};
              });
              setScreen("SelectPassword");
            }
          }}
        >
          Next
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectFirstAndLastName")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  function SelectPassword() {
    const [state, setState] = useState("");
    const [error, setError] = useState("");
    const [finishBtn, setFinishBtn] = useState("Finish");
    return (
      <div className="action-container show">
        <div className="action-title">Select a password:</div>
        <div className="action-error">{error}</div>

        <input
          type="text"
          className="action-field"
          placeholder="Enter password"
          value={state}
          onChange={e => setState(e.target.value)}
        />

        <button
          className="action-btn filled"
          onClick={async () => {
            if (state === "") {
              setError("password cannot be empty!");
            } else {
              setUserState(s => {
                return {...s, password: state};
              });
              alert("Signing you up.....");
              setFinishBtn("Signing you up...");
              // navigate("/discover");
              signupUser(state);
            }
          }}
        >
          {finishBtn}
        </button>
        <div className="action-back-container">
          <button
            className="action-back-btn"
            onClick={() => setScreen("SelectEmail")}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="Authpage">
        {/* {process.env.REACT_APP_SUPABASE_URL} */}
        {/* {userState.prefix}
        {userState.firstname}
        {userState.lastname}
        {userState.looking_for}
        {userState.location}
        {userState.email}
        {userState.gender}
        {userState.password} */}
        <div className="left">
          {console.log(userState)}
          {screen === "SelectGender" ? <SelectGender /> : ""}
          {screen === "SelectLookingFor" ? <SelectLookingFor /> : ""}
          {screen === "SelectAge" ? <SelectAge /> : ""}
          {screen === "SelectCountry" ? <SelectCountry /> : ""}
          {screen === "SelectRegion" ? <SelectRegion /> : ""}
          {screen === "SelectFirstAndLastName" ? (
            <SelectFirstAndLastName />
          ) : (
            ""
          )}
          {screen === "SelectEmail" ? <SelectEmail /> : ""}
          {screen === "SelectPassword" ? <SelectPassword /> : ""}
        </div>
        <div className="right">
          <img src={backgroundImage} alt="" className="background-image" />
        </div>
      </div>
    </>
  );
}

export default Signup;
