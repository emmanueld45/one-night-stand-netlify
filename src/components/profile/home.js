import React, {useState, useContext, useEffect, useRef} from "react";
import {supabase} from "../../supabaseClient";
import user1 from "../../images/user.png";
import user2 from "../../images/users/4.jpg";
import {globalContext} from "../global-context";
import Header from "../header";
import MobileNav from "../mobile-nav";
import {MobileHeader} from "../header.js";
import "./profile.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import {uploadImage} from "../handlers/imagesHandler";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ProfileHome({session}) {
  const globalState = useContext(globalContext);
  // console.log("profile: " +  profile.firstname);
  if (! session) {
    console.log("no session");
     globalState.state.navigate("/login");
  } else {
    console.log("session user id: " +  session.user.id);
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: toast => {
      // toast.addEventListener("mouseenter", Swal.stopTimer);
      // toast.addEventListener("mouseleave", Swal.resumeTimer);
      // toast.addEventListener("click", function () {
      //    navigate("/profile");
      // });
    },
  });

  // const [userId, setUserId] = useState(session.user.id);
  // console.log("userId: " + userId);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getProfile(session.user.id);
  }, []);
  async function getProfile(user_id) {
    let {data: profile, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id);
    setProfile(profile[0]);
  }

  const image1MainInputRef = useRef(null);
  const image1InputRef = useRef(null);
  const image2InputRef = useRef(null);
  const image3InputRef = useRef(null);
  const image4InputRef = useRef(null);
  const image5InputRef = useRef(null);

  const image1MainDisplayRef = useRef(null);
  const image1DisplayRef = useRef(null);
  const image2DisplayRef = useRef(null);
  const image3DisplayRef = useRef(null);
  const image4DisplayRef = useRef(null);
  const image5DisplayRef = useRef(null);

  const [imageUploading, setImageUploading] = useState(false);

  async function handleImageUpload(e, ref, image_number) {
    Toast.fire({
      icon: "info",
      title: "Uploading...",
    });
    Swal.stopTimer();
    var [uploading, fileUrl, error] = await uploadImage(e);
    setImageUploading(uploading);
    if (error) {
      Toast.fire({
        icon: "error",
        title: "Upload error",
      });
    } else {
      ref.current.src = process.env.REACT_APP_IMAGES_STORAGE_BUCKET + fileUrl;
      var image_object = {};
      if (image_number === 1) {
        image_object = {image1: fileUrl};
      } else if (image_number === 2) {
        image_object = {image2: fileUrl};
      } else if (image_number === 3) {
        image_object = {image3: fileUrl};
      } else if (image_number === 4) {
        image_object = {image4: fileUrl};
      } else if (image_number === 5) {
        image_object = {image5: fileUrl};
      } else if (image_number === "main") {
        image_object = {image1: fileUrl};
      }
      const {data, error} = await supabase
        .from("profiles")
        .update(image_object)
        .eq("user_id",  session.user.id);
      if (error) {
        alert(error.message);
      } else {
        Swal.resumeTimer();
      }
    }
  }
  return (
    <>
      <Header />
      <MobileHeader />
      <div className="ProfileHome">
        <div className="profile-container">
          <SettingsOutlinedIcon className="settings-icon" />
          <div className="left">
            <div className="image-container">
              <img
                src={
                   profile.image1
                    ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                       profile.image1
                    : user1
                }
                ref={image1MainDisplayRef}
                onClick={e => {
                  image1MainInputRef.current.click();
                }}
                alt=""
                className="image"
              />
              <EditIcon className="edit-icon" />
            </div>
          </div>
          <div className="right">
            <div className="name">
              <CheckCircleIcon className="check-icon" />
              {`${
                 profile.firstname
                  ?  profile.firstname
                  : "..."
              } ${
                 profile.lastname
                  ?  profile.lastname
                  : "..."
              }`}
            </div>
            <div className="location">
              22 years old .{" "}
              { profile.country
                ?  profile.country
                : "..."}
            </div>
            <div className="balance">Balance: N23,000.00</div>

            <div className="notification-container">
              <div className="box">
                <div className="row1">
                  <button className="icon-button">
                    <NotificationsRoundedIcon className="" />
                  </button>
                </div>
                <div className="row2">
                  <div className="title">Enable Notifications</div>
                  <div className="description">
                    Turn on notifications to receive requests for
                    One-Night-State
                  </div>
                </div>
              </div>
            </div>

            <div className="images-container">
              <div className="box">
                <img
                  src={
                     profile.image1
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                         profile.image1
                      : user1
                  }
                  alt=""
                  className="image"
                  ref={image1DisplayRef}
                  onClick={e => {
                    image1InputRef.current.click();
                  }}
                />
                {/* <EditIcon className="edit-icon" /> */}
              </div>
              <div className="box">
                <img
                  src={
                     profile.image2
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                         profile.image2
                      : user1
                  }
                  alt=""
                  className="image"
                  ref={image2DisplayRef}
                  onClick={e => {
                    image2InputRef.current.click();
                  }}
                />
              </div>
              <div className="box">
                <img
                  src={
                     profile.image3
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                         profile.image3
                      : user1
                  }
                  alt=""
                  className="image"
                  ref={image3DisplayRef}
                  onClick={e => {
                    image3InputRef.current.click();
                  }}
                />
              </div>
              <div className="box">
                <img
                  src={
                     profile.image4
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                         profile.image4
                      : user1
                  }
                  alt=""
                  className="image"
                  ref={image4DisplayRef}
                  onClick={e => {
                    image4InputRef.current.click();
                  }}
                />
              </div>
              <div className="box">
                <img
                  src={
                     profile.image5
                      ? process.env.REACT_APP_IMAGES_STORAGE_BUCKET +
                         profile.image5
                      : user1
                  }
                  alt=""
                  className="image"
                  ref={image5DisplayRef}
                  onClick={e => {
                    image5InputRef.current.click();
                  }}
                />
              </div>
            </div>
            <input
              type="file"
              ref={image1MainInputRef}
              onChange={e => handleImageUpload(e, image1MainDisplayRef, "main")}
              style={{display: "none"}}
            />
            <input
              type="file"
              ref={image1InputRef}
              onChange={e => handleImageUpload(e, image1DisplayRef, 1)}
              style={{display: "none"}}
            />
            <input
              type="file"
              ref={image2InputRef}
              onChange={e => handleImageUpload(e, image2DisplayRef, 2)}
              style={{display: "none"}}
            />
            <input
              type="file"
              ref={image3InputRef}
              onChange={e => handleImageUpload(e, image3DisplayRef, 3)}
              style={{display: "none"}}
            />
            <input
              type="file"
              ref={image4InputRef}
              onChange={e => handleImageUpload(e, image4DisplayRef, 4)}
              style={{display: "none"}}
            />
            <input
              type="file"
              ref={image5InputRef}
              onChange={e => handleImageUpload(e, image5DisplayRef, 5)}
              style={{display: "none"}}
            />
          </div>
        </div>
      </div>
      <MobileNav />
    </>
  );
}

export default ProfileHome;
