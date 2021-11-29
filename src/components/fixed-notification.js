import React, {useState} from "react";
import user1 from "../images/users/4.jpg";

function FixedNotification({
  style,
  onClick,
  sustain,
  image,
  title,
  description,
}) {
  const [slide, setSlide] = useState("slide-in");
  const [time, setTime] = useState(sustain);

  if (time === undefined) {
    setTimeout(function () {
      setSlide("slide-out");
    }, 10000);
  } else {
    setTimeout(function () {
      setSlide("slide-out");
    }, time);
  }
  return (
    <div
      onClick={onClick}
      className={`fixed-notification ${slide}`}
      style={style}
    >
      <div className="row1">
        <div className="image-container">
          <img src={image} className="image" alt="" />
        </div>
      </div>
      <div className="row2">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
}

export default FixedNotification;
