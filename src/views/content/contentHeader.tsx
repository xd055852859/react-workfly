import React from "react";
import Avatar from "../../components/common/avatar";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import "./contentHeader.css";

import { setCommonHeaderIndex } from "../../redux/actions/commonActions";
import {
  getTargetUserInfo,
  setClickType,
} from "../../redux/actions/authActions";
import { setWorkHeaderIndex } from "../../redux/actions/memberActions";
interface ContentHeaderProps {
  vitalityName: string;
  vitalityLogo: string;
  vitalityKey: string;
  slot: any;
}

const ContentHeader: React.FC<ContentHeaderProps> = (prop) => {
  const { vitalityName, vitalityLogo, vitalityKey, slot } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  return (
    <div
      className="contentHeader"
      // onClick={() => {
      //   if (vitalityKey !== user._key) {
      //     dispatch(getTargetUserInfo(vitalityKey));
      //     dispatch(setCommonHeaderIndex(2));
      //     dispatch(setClickType("out"));
      //   } else {
      //     dispatch(setCommonHeaderIndex(1));
      //   }
      //   dispatch(setWorkHeaderIndex(5));
      // }}
    >
      <Avatar
        avatar={vitalityLogo}
        name={vitalityName}
        type={"person"}
        index={0}
        size={35}
      />
      <span style={{ marginRight: "10px", marginLeft: "8px" }}>
        {vitalityName}
      </span>
      {slot}
    </div>
  );
};
export default ContentHeader;
