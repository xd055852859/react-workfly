export const actionTypes = {
  FAILED: 'FAILED',
  SWITCH_APPS: 'SWITCH_APPS',
  SWITCH_NOTIFICATION: 'SWITCH_NOTIFICATION',
  SWITCH_SEARCH: 'SWITCH_SEARCH',
  SET_MESSAGE: 'SET_MESSAGE',
  SET_HEADERINDEX: 'SET_HEADERINDEX',
  SET_MOVESTATE: 'SET_MOVESTATE',
  LOADING: 'LOADING',
  SET_SHOW_CHATSTATE: 'SET_SHOW_CHATSTATE',
  SET_CHATSTATE: 'SET_CHATSTATE',
  SET_UNCHATREADNUM: 'SET_UNCHATREADNUM',
  SET_UNMESSAGEREADNUM: 'SET_UNMESSAGEREADNUM',
  SET_SOCKETOBJ: 'SET_SOCKETOBJ',
  CHANGE_TIMESET_VISIBLE: 'CHANGE_TIMESET_VISIBLE',
  CHANGE_TASKMEMBER_VISIBLE: 'CHANGE_TASKMEMBER_VISIBLE',
  SET_FILEINFO: 'SET_FILEINFO',
  SET_FILEKEY:'SET_FILEKEY'
};

export function Failed(error: any) {
  console.log('---error---', error);
  return {
    type: actionTypes.FAILED,
    error,
  };
}

export function switchApps(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_APPS,
    visible: visible,
  };
}

export function switchNotification(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_NOTIFICATION,
    visible: visible,
  };
}

export function switchSearch(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_SEARCH,
    visible: visible,
  };
}

export function setMessage(
  visible: boolean,
  text: string,
  messageType: 'success' | 'info' | 'warning' | 'error' | undefined
) {
  return { type: actionTypes.SET_MESSAGE, visible, text, messageType };
}
export function setCommonHeaderIndex(headerIndex: number) {
  localStorage.setItem('headerIndex', headerIndex + '');
  return {
    type: actionTypes.SET_HEADERINDEX,
    headerIndex,
  };
}
export function setMoveState(moveState: string) {
  return {
    type: actionTypes.SET_MOVESTATE,
    moveState: moveState,
  };
}
export function Loading(loading: boolean) {
  return {
    type: actionTypes.LOADING,
    loading,
  };
}
export function setChatState(chatState: boolean) {
  return {
    type: actionTypes.SET_CHATSTATE,
    chatState,
  };
}
export function setShowChatState(showChatState: boolean) {
  return {
    type: actionTypes.SET_SHOW_CHATSTATE,
    showChatState,
  };
}

export function setUnChatNum(unChatNum: number) {
  return {
    type: actionTypes.SET_UNCHATREADNUM,
    unChatNum,
  };
}
export function setUnMessageNum(unMessageNum: number) {
  return {
    type: actionTypes.SET_UNMESSAGEREADNUM,
    unMessageNum,
  };
}
export function setSocketObj(socketObj: any) {
  return {
    type: actionTypes.SET_SOCKETOBJ,
    socketObj,
  };
}
export function changeTimeSetVisible(
  timeSetVisible: boolean,
  timeSetX?: number,
  timeSetY?: number
) {
  return {
    type: actionTypes.CHANGE_TIMESET_VISIBLE,
    timeSetVisible,
    timeSetX,
    timeSetY,
  };
}
export function changeTaskMemberVisible(
  taskMemberVisible: boolean,
  taskMemberX?: number,
  taskMemberY?: number
) {
  return {
    type: actionTypes.CHANGE_TASKMEMBER_VISIBLE,
    taskMemberVisible,
    taskMemberX,
    taskMemberY,
  };
}
export function setFileInfo(fileInfo: any, fileVisible: boolean) {
  return {
    type: actionTypes.SET_FILEINFO,
    fileInfo,
    fileVisible,
  };
}
export function setFileKey(fileKey: string) {
  return {
    type: actionTypes.SET_FILEKEY,
    fileKey
  };
}
