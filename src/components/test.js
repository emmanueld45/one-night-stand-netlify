import React, {useState, useEffect} from "react";
import {Gestures} from "react-gesture-handler";
import {Popup} from "quick-n-dirty-react";
import {DownloadImage, uploadImage} from "./hooks/useImage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {supabase} from "../supabaseClient";

// const MySwal = withReactContent(Swal);

// const Toast = MySwal.mixin({
//   toast: true,
//   position: "top-end",
//   showConfirmButton: false,
//   timer: 10000,
//   timerProgressBar: true,
//   didOpen: toast => {
//     toast.addEventListener("mouseenter", Swal.stopTimer);
//     toast.addEventListener("mouseleave", Swal.resumeTimer);
//   },
// });

// Toast.fire({
//   icon: "success",
//   title: "Signed in successfully",
// });

// MySwal.fire({
//   title: <p>Hello World</p>,
//   footer: "Copyright 2018",
//   didOpen: () => {
//     // `MySwal` is a subclass of `Swal`
//     //   with all the same instance & static methods
//     MySwal.clickConfirm();
//   },
// }).then(() => {
//   return MySwal.fire(<p>Shorthand works too</p>);
// });

function Test() {
  const [uploadedImage, setUploadedImage] = useState(
    process.env.REACT_APP_IMAGES_STORAGE_BUCKET + "afra1.PNG"
  );

  const [imageUploading, setImageUploading] = useState(false);
  const [url, error] = DownloadImage("afra1.PNG");

  async function handleUpload(e) {
    setImageUploading(true);
    var [uploading, fileUrl, error] = await uploadImage(e);
    setImageUploading(uploading);
    setUploadedImage(process.env.REACT_APP_IMAGES_STORAGE_BUCKET + fileUrl);
    console.log("uploading: " + uploading);
    console.log("fileUrl: " + fileUrl);
    console.log("error: " + error);
  }

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .then(res => console.log("data: " + res.data));
  }, []);

  const MyComponent = () => {
    const [eventType, setEventType] = useState("");

    const handleGesture = event => setEventType(event.type);

    return (
      <Gestures
        recognizers={{
          // Pan: {
          //   events: {
          //     panleft: handleGesture,
          //     panright: handleGesture,
          //     panup: handleGesture,
          //     pandown: handleGesture,
          //   },
          // },
          Swipe: {
            events: {
              swipeleft: handleGesture,
              swiperight: handleGesture,
            },
          },
        }}
      >
        <div
          style={{width: "200px", height: "200px", backgroundColor: "green"}}
        >
          <h1>Gesture Section {eventType && ` - This is ${eventType}`}</h1>
        </div>
      </Gestures>
    );
  };

  return (
    <div>
      <h3>Test Page</h3>
      <img
        src={uploadedImage == null ? url : uploadedImage}
        alt=""
        style={{width: "100px", height: "100px"}}
      />
      <input
        type="file"
        onChange={e => {
          handleUpload(e);
        }}
      />
      <button>{!imageUploading ? "Upload" : "Uploading"}</button>
      {/* <MyComponent /> */}
    </div>
  );
}

export default Test;
