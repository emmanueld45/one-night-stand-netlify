import React from "react";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import user1 from "../images/users/9.jpg";
// import user2 from "../images/users/2.jpg";
// import user3 from "../images/users/3.jpg";
// import user4 from "../images/users/4.jpg";
// import user5 from "../images/users/5.jpg";

function Card() {
  return (
    <div className="user-card">
      <img src={user1} className="user-image" alt="" />
      <div className="background-overlay">
        <div className="bottom">
          <div className="row1">
            <div className="name">
              Samanta <button className="online-status online"></button>
            </div>
          </div>
          <div className="row2">
            <button className="icon-btn chat">
              <ForumOutlinedIcon className="icon" />
            </button>
            <button className="icon-btn">
              <FavoriteRoundedIcon className="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function UsersCard() {
  return (
    <>
      <div className="users-card-container">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}

export default UsersCard;
