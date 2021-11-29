import React, {useState, createContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient";

export const globalContext = createContext();

export const GlobalProvider = props => {
  // const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {}, []);
  // async function getProfile(user_id) {
  //   let {data: prof, error} = await supabase
  //     .from("profiles")
  //     .select("*")
  //     .eq("user_id", user_id);

  //   throw profile[0];
  //   console.log(profile[0].firstname);
  // }

  const Globalstate = {
    navigate,
  };
  const [state, setState] = useState(Globalstate);

  return (
    <globalContext.Provider value={{state, setState}}>
      {props.children}
    </globalContext.Provider>
  );
};
