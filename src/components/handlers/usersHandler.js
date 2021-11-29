import React from "react";
import {supabase} from "../../supabaseClient";

export async function getDetails(user_id) {
  var res;
  var err;
  const {data, error} = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    err = error;
  } else if (data) {
    res = data[0];
  }

  return [res, err];
}
