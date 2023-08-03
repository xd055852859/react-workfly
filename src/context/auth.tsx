import React, { ReactNode } from "react";
import { getSearchParamValue } from "../services/util";
import { useDispatch } from "react-redux";
import {
  getUserInfo,
  changeMusic,
  setUserKey,
} from "../redux/actions/authActions";
import {
  setFileKey,
  setInviteKey,
  setCommonHeaderIndex,
} from "../redux/actions/commonActions";
import { setGroupKey } from "../redux/actions/groupActions";
import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../redux/actions/taskActions";
import moment from "moment";
declare var window: Window 
const AuthContext = React.createContext<
  | {
      paramsToken: string | null;
      paramsgroupKey: string | null;
      paramsShareKey: string | null;
      paramsFileKey: string | null;
      paramsShowType: string | null;
      paramsCreateType: string | null;
      deviceState: string;
      deviceWidth: number;
      todayState: boolean;
      clockState: boolean;
      deviceType: string | null;
    }
  | undefined
>(undefined);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  let paramsToken: any =
    getSearchParamValue(window.location.search, "token") ||
    localStorage.getItem("token");
  if (paramsToken) {
    dispatch(getUserInfo(paramsToken));
  }

  const paramsgroupKey =
    getSearchParamValue(window.location.search, "groupKey") ||
    localStorage.getItem("groupKey");
  if (paramsgroupKey) {
    dispatch(setGroupKey(paramsgroupKey));
  }

  const paramsHeaderIndex = localStorage.getItem("headerIndex");
  if (getSearchParamValue(window.location.search, "groupKey")) {
    dispatch(setCommonHeaderIndex(3));
  } else if (
    paramsHeaderIndex &&
    paramsHeaderIndex !== "2" &&
    paramsHeaderIndex !== "5" &&
    paramsHeaderIndex !== "20"
  ) {
    dispatch(setCommonHeaderIndex(parseInt(paramsHeaderIndex)));
  } else {
    dispatch(setCommonHeaderIndex(1));
  }

  const paramsFileKey =
    getSearchParamValue(window.location.search, "fileKey") ||
    localStorage.getItem("fileKey");
  if (paramsFileKey) {
    dispatch(setFileKey(paramsFileKey));
    localStorage.setItem("fileKey", paramsFileKey);
  }

  const paramsShareKey =
    getSearchParamValue(window.location.search, "shareKey") ||
    localStorage.getItem("shareKey");
  if (paramsShareKey) {
    dispatch(setChooseKey(paramsShareKey));
    dispatch(changeTaskInfoVisible(true));
    // localStorage.removeItem("shareKey");
  }

  const paramsShowType =
    getSearchParamValue(window.location.search, "showType") ||
    localStorage.getItem("showType");

  const paramsCreateType =
    getSearchParamValue(window.location.search, "createType") ||
    localStorage.getItem("createType");

  const paramInviteKey =
    getSearchParamValue(window.location.search, "inviteKey") ||
    localStorage.getItem("inviteKey");
  if (paramInviteKey) {
    dispatch(setInviteKey(paramInviteKey));
    localStorage.setItem("inviteKey", paramInviteKey);
  }
  const paramsUserKey = localStorage.getItem("userKey");
  if (paramsUserKey) {
    dispatch(setUserKey(paramsUserKey));
  }
  const deviceType = getSearchParamValue(window.location.search, "deviceType");
  if (
    !paramsCreateType &&
    getSearchParamValue(window.location.search, "token") &&
    !paramsFileKey &&
    !paramsShowType &&
    deviceType !== "tool"
  ) {
    dispatch(changeMusic(6));
  }
  const clientWidth = document.documentElement.clientWidth;
  let deviceState = "";
  let deviceWidth = 0;
  if (clientWidth >= 1600) {
    deviceState = "xxl";
    deviceWidth = (document.documentElement.clientWidth - 350) * 0.25;
  } else if (clientWidth >= 1200) {
    deviceState = "xl";
    deviceWidth = (document.documentElement.clientWidth - 350) * 0.33;
  } else if (clientWidth >= 992) {
    deviceState = "lg";
    deviceWidth = (document.documentElement.clientWidth - 300) * 0.5;
  } else if (clientWidth > 768) {
    deviceState = "sm";
    deviceWidth = (document.documentElement.clientWidth - 300) * 0.5;
  } else if (clientWidth > 500) {
    deviceState = "xs";
    deviceWidth = document.documentElement.clientWidth - 250;
  } else if (clientWidth <= 500) {
    deviceState = "xxs";
    deviceWidth = document.documentElement.clientWidth - 250;
  }
  let todayTime: any = localStorage.getItem("todayTime");
  let todayState = true;
  let clockState = true;
  if (+todayTime === moment().startOf("days").valueOf()) {
    todayState = false;
    if (localStorage.getItem("clockState") === "false") {
      clockState = false;
    }
  } else {
    localStorage.setItem("todayTime", moment().startOf("days").valueOf() + "");
    localStorage.setItem("clockState", "true");
    todayState = true;
    clockState = true;
  }
  //   deviceState === "xl"
  //     ? (document.documentElement.clientWidth - 350) *
  //       0.25
  //     : deviceState === "xs"
  //     ? document.documentElement.clientWidth - 250
  //     : (document.documentElement.clientWidth - 300) *
  //       0.5,
  return (
    <AuthContext.Provider
      children={children}
      value={{
        paramsToken,
        paramsgroupKey,
        paramsShareKey,
        paramsFileKey,
        paramsShowType,
        paramsCreateType,
        deviceState,
        deviceWidth,
        todayState,
        clockState,
        deviceType,
      }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
