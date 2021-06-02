import React, { useMemo } from "react";
import "./avatar.css";

import defaultPersonPng from "../../assets/img/defaultPerson.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";

interface AvatarProps {
  avatar: any;
  name: string;
  type: string;
  index: number;
}
const BgColorArray = [
  "rgb(48,191,191)",
  "rgb(0,170,255)",
  "rgb(143,126,230)",
  "rgb(179,152,152)",
  "rgb(242,237,166)",
];
const Avatar: React.FC<AvatarProps> = (props) => {
  const { name, avatar, type, index } = props;
  const bgColor = useMemo(() => {
    return BgColorArray[index % 5];
  }, [index]);
  return (
    <React.Fragment>
      {avatar ? (
        <img
          alt={name}
          src={
            avatar.indexOf("imageMogr2") !== -1 && avatar.indexOf(".svg") !== -1
              ? avatar + "?imageMogr2/auto-orient/thumbnail/80x"
              : avatar
          }
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src =
              type === "person" ? defaultPersonPng : defaultGroupPng;
          }}
          className="avatar-img"
        />
      ) : (
        <div
          className="avatar-img"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {name ? name.substring(0, 1) : ""}
        </div>
      )}
    </React.Fragment>
  );
};
Avatar.defaultProps = {};
export default Avatar;
