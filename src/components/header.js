import React from "react";
import {Link} from "react-router-dom";
import cardsIcon from "../images/icons/cards1.png";
import messagesIcon from "../images/icons/comment2.png";
import searchIcon from "../images/icons/search1.png";
import activitiesIcon from "../images/icons/notification2.png";
import profileIcon from "../images/icons/user1.png";

import AppsIcon from "@mui/icons-material/Apps";
// import MenuIcon from "@mui/icons-material/Menu";
import ListIcon from "@mui/icons-material/List";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
// import SendRoundedIcon from "@mui/icons-material/SendRounded";
// import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
// import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
// import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
// import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
// import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
// import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"; // messages
// import BabyChangingStationOutlinedIcon from '@mui/icons-material/BabyChangingStationOutlined';
// import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined'; // request
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import MoodIcon from '@mui/icons-material/Mood';
// import RssFeedIcon from "@mui/icons-material/RssFeed";
// import SignalWifi2BarIcon from "@mui/icons-material/SignalWifi2Bar";
// import TableRowsIcon from '@mui/icons-material/TableRows';
// import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function MobileHeader() {
  return (
    <div className="Mobile-header">
      <span className="logo-text">OneNightStand</span>
      <NotificationsNoneRoundedIcon className="activities-icon" />
      <ListIcon className="menu-icon" />
    </div>
  );
}
function Header() {
  return (
    <div className="Header">
      <span className="logo-text">OneNightStand</span>

      <nav>
        <ul>
          <li>
            <Link to="/discover" className="link">
              <div className="centered-div">
                {/* <img src={AppsIcon} alt="" className="icon" /> */}
                <AppsIcon className="icon" />
              </div>
              <div className="centered-div">
                <span className="text">Discover</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/chats" className="link">
              <div className="centered-div">
                <img src={messagesIcon} alt="" className="icon" />
              </div>
              <div className="centered-div">
                <span className="text">Messages</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/search" className="link">
              <div className="centered-div">
                <img src={searchIcon} alt="" className="icon" />
              </div>
              <div className="centered-div">
                <span className="text">Search</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/activities" className="link">
              <div className="centered-div">
                <img src={activitiesIcon} alt="" className="icon" />
              </div>
              <div className="centered-div">
                <span className="text">Activities</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/profile/" className="link">
              <div className="centered-div">
                <img src={profileIcon} alt="" className="icon" />
              </div>
              <div className="centered-div">
                <span className="text">My profile</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Header;
