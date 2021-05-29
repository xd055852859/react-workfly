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
  setCommonHeaderIndex,
} from "../redux/actions/commonActions";
import { setGroupKey } from "../redux/actions/groupActions";
import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../redux/actions/taskActions";

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
    }
  | undefined
>(undefined);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  const paramsToken =
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
  if (
    paramsHeaderIndex &&
    paramsHeaderIndex !== "2" &&
    paramsHeaderIndex !== "5"
  ) {
    dispatch(setCommonHeaderIndex(parseInt(paramsHeaderIndex)));
  } else if (paramsgroupKey) {
    dispatch(setCommonHeaderIndex(3));
  } else {
    dispatch(setCommonHeaderIndex(1));
  }

  const paramsShareKey =
    getSearchParamValue(window.location.search, "shareKey") ||
    localStorage.getItem("shareKey");
  if (paramsShareKey) {
    dispatch(setChooseKey(paramsShareKey));
    dispatch(changeTaskInfoVisible(true));
    localStorage.removeItem("shareKey");
  }

  const paramsFileKey =
    getSearchParamValue(window.location.search, "fileKey") ||
    localStorage.getItem("fileKey");
  if (paramsFileKey) {
    dispatch(setFileKey(paramsFileKey));
  }

  const paramsShowType =
    getSearchParamValue(window.location.search, "showType") ||
    localStorage.getItem("showType");

  const paramsCreateType =
    getSearchParamValue(window.location.search, "createType") ||
    localStorage.getItem("createType");
  if (
    !paramsCreateType &&
    getSearchParamValue(window.location.search, "token") &&
    !paramsFileKey &&
    !paramsShowType
  ) {
    dispatch(changeMusic(6));
  }

  const paramsUserKey = localStorage.getItem("userKey");
  if (paramsUserKey) {
    dispatch(setUserKey(paramsUserKey));
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
  } else if (clientWidth <= 768) {
    deviceState = "xs";
    deviceWidth = document.documentElement.clientWidth - 250;
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
