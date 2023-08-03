export const actionTypes = {
  GET_USERINFO: "GET_USERINFO",
  GET_USERINFO_SUCCESS: "GET_USERINFO_SUCCESS",
  GET_MAIN_GROUP_KEY: "GET_MAIN_GROUP_KEY",
  GET_MAIN_GROUP_KEY_SUCCESS: "GET_MAIN_GROUP_KEY_SUCCESS",
  SET_USER_KEY: "SET_USER_KEY",
  SET_TARGET_USER_KEY: "SET_TARGET_USER_KEY",
  GET_TARGET_USERINFO: "GET_TARGET_USERINFO",
  GET_TARGET_USERINFO_SUCCESS: "GET_TARGET_USERINFO_SUCCESS",
  GET_THEME: "GET_THEME",
  GET_THEME_SUCCESS: "GET_THEME_SUCCESS",
  GET_THEME_BG: "GET_THEME_BG",
  GET_THEME_BG_SUCCESS: "GET_THEME_BG_SUCCESS",
  SET_THEME_BG_PAGE: "SET_THEME_BG_PAGE",
  SET_THEME: "SET_THEME",
  SET_THEME_LOCAL: "SET_THEME_LOCAL",
  SET_THEME_SUCCESS: "SET_THEME_SUCCESS",
  SET_UPLOAD_TOKEN: "SET_UPLOAD_TOKEN",
  GET_UPLOAD_TOKEN: "GET_UPLOAD_TOKEN",
  GET_UPLOAD_TOKEN_SUCCESS: "GET_UPLOAD_TOKEN_SUCCESS",
  CHANGE_MUSIC_NUMBER: "CHANGE_MUSIC_NUMBER",
  CHANGE_MOVE: "CHANGE_MOVE",
  CHANGE_VITALITYNUM: "CHANGE_VITALITYNUM",
  CLEAR_AUTH: "CLEAR_AUTH",
  SET_CLICK_TYPE: "SET_CLICK_TYPE",
  CHANGE_MAINENTERPRISE_GROUP: "CHANGE_MAINENTERPRISE_GROUP",
  CHANGE_ENTERPRISE_GROUP_STATE: "CHANGE_ENTERPRISE_GROUP_STATE",
  CHANGE_TASK_STATE: "CHANGE_TASK_STATE",
  SET_OKR_MEMBER_KEY:"SET_OKR_MEMBER_KEY"
};

export function getUserInfo(token: string | null, saveState?: boolean) {
  return {
    type: actionTypes.GET_USERINFO,
    token: token,
    saveState: saveState,
  };
}

export function getUserInfoSuccess(data: any) {
  return {
    type: actionTypes.GET_USERINFO_SUCCESS,
    data,
  };
}
export function getMainGroupKey() {
  return {
    type: actionTypes.GET_MAIN_GROUP_KEY,
  };
}

export function getMainGroupKeySuccess(data: any) {
  return {
    type: actionTypes.GET_MAIN_GROUP_KEY_SUCCESS,
    data,
  };
}

export function setUserKey(userKey: string) {
  return {
    type: actionTypes.SET_USER_KEY,
    userKey: userKey,
  };
}
export function setTargetUserKey(targetUserKey: string) {
  return {
    type: actionTypes.SET_TARGET_USER_KEY,
    targetUserKey: targetUserKey,
  };
}
// export function userKeyToGroupKey(targetUserKey: string) {
//   return {
//     type: actionTypes.SET_TARGET_USER_KEY,
//     targetUserKey: targetUserKey,
//   };
// }

export function getTargetUserInfo(targetUserKey: string) {
  return {
    type: actionTypes.GET_TARGET_USERINFO,
    targetUserKey: targetUserKey,
  };
}

export function getTargetUserInfoSuccess(data: any) {
  return {
    type: actionTypes.GET_TARGET_USERINFO_SUCCESS,
    data,
  };
}
export function getTheme() {
  return {
    type: actionTypes.GET_THEME,
  };
}

export function getThemeSuccess(data: any) {
  return {
    type: actionTypes.GET_THEME_SUCCESS,
    data,
  };
}
export function getThemeBg(page: number) {
  return {
    type: actionTypes.GET_THEME_BG,
    page: page,
  };
}

export function getThemeBgSuccess(data: any) {
  return {
    type: actionTypes.GET_THEME_BG_SUCCESS,
    data,
  };
}
export function setTheme(configInfo: any) {
  return {
    type: actionTypes.SET_THEME,
    configInfo: configInfo,
  };
}
export function setThemeLocal(theme: any) {
  return {
    type: actionTypes.SET_THEME_LOCAL,
    theme: theme,
  };
}

export function setThemeSuccess(data: any, action: any) {
  return {
    type: actionTypes.SET_THEME_SUCCESS,
    data,
    action,
  };
}
export function setUploadToken(uploadToken: any) {
  return {
    type: actionTypes.SET_UPLOAD_TOKEN,
    uploadToken: uploadToken,
  };
}
export function getUploadToken() {
  return {
    type: actionTypes.GET_UPLOAD_TOKEN,
  };
}

export function getUploadTokenSuccess(data: any) {
  return {
    type: actionTypes.GET_UPLOAD_TOKEN_SUCCESS,
    data,
  };
}
export function changeMusic(musicNum: number) {
  return {
    type: actionTypes.CHANGE_MUSIC_NUMBER,
    musicNum,
  };
}

export function changeMove(finishPos: any) {
  return {
    type: actionTypes.CHANGE_MOVE,
    finishPos,
  };
}
export function changeVitalityNum(vitalityNum: any) {
  return {
    type: actionTypes.CHANGE_VITALITYNUM,
    vitalityNum,
  };
}

export function clearAuth() {
  return { type: actionTypes.CLEAR_AUTH };
}
export function setClickType(clickType: string) {
  return { type: actionTypes.SET_CLICK_TYPE, clickType };
}
export function changeMainenterpriseGroup(
  mainEnterpriseGroupKey?: string,
  mainEnterpriseGroupLogo?: string,
  mainEnterpriseGroupName?: string,
  mainEnterpriseRight?: Number
) {
  return {
    type: actionTypes.CHANGE_MAINENTERPRISE_GROUP,
    mainEnterpriseGroupKey,
    mainEnterpriseGroupLogo,
    mainEnterpriseGroupName,
    mainEnterpriseRight,
  };
}
export function changeEnterpriseGroupState(enterpriseGroupState: boolean) {
  return {
    type: actionTypes.CHANGE_ENTERPRISE_GROUP_STATE,
    enterpriseGroupState,
  };
}
export function changeTaskState(taskState: any) {
  return {
    type: actionTypes.CHANGE_TASK_STATE,
    taskState,
  };
}
export function setOkrMemberKey(okrMemberKey: string) {
  return {
    type: actionTypes.SET_OKR_MEMBER_KEY,
    okrMemberKey,
  };
}

