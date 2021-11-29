import React from "react";
import {Link} from "react-router-dom";
import cardsIcon from "../images/icons/cards1.png";
import messagesIcon from "../images/icons/comment2.png";
import searchIcon from "../images/icons/search1.png";
import activitiesIcon from "../images/icons/notification2.png";
import profileIcon from "../images/icons/user1.png";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import AppsIcon from "@mui/icons-material/Apps";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function MobileNav() {
  return (
    <div className="Mobile-nav">
      <div className="box active">
        <Link to="/discover" className="link">
          {/* <img src={cardsIcon} className="icon" alt="" /> */}
          <AppsIcon className="icon active" />
        </Link>
      </div>
      <div className="box">
        <Link to="/chats" className="link">
          {/* <img src={messagesIcon} className="icon" alt="" /> */}
          <ChatBubbleOutlineIcon className="icon" />
        </Link>
      </div>
      <div className="box">
        <Link to="/search" className="link">
          {/* <img src={searchIcon} cliconassName="icon" alt="" /> */}
          <SearchRoundedIcon className="icon search" />
        </Link>
      </div>
      <div className="box">
        <Link to="/profile/" className="link">
          {/* <img src={profileIcon} className="icon" alt="" /> */}
          <PersonOutlineIcon className="icon profile" />
        </Link>
      </div>
    </div>
  );
}
export default MobileNav;
