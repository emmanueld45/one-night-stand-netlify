import React, {useState, useEffect} from "react";
import {supabase} from "../../supabaseClient";

export function DownloadImage(path) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    download();
  }, []);

  async function download() {
    var {data, error} = await supabase.storage
      .from("public/images")
      .download(path);

    if (error) {
      // console.log("error: " + error.message);
      setError(error);
    } else {
      // console.log("data: " + data);
      const url = URL.createObjectURL(data);
      setUrl(url);
    }
  }

  return [url, error];
}

export async function uploadImage(event) {
  var uploading = false;
  var fileUrl = null;
  var error = null;

  try {
    uploading = true;
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    let {error: uploadError} = await supabase.storage
      .from("images")
      .upload(filePath, file);
    if (uploadError) {
      throw uploadError;
    }

    fileUrl = filePath;
  } catch (err) {
    error = err;
    alert(error.message);
  } finally {
    uploading = false;
  }

  // console.log(fileUrl, uploading, error);

  return [uploading, fileUrl, error];
}
