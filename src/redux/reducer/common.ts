import { actionTypes as commonActionTypes } from '../actions/commonActions';
interface Message {
  visible: boolean;
  text: string;
  messageType: 'success' | 'info' | 'warning' | 'error' | undefined;
}

export interface Common {
  loading: boolean;
  showApps: boolean;
  showNotification: boolean;
  showSearch: boolean;
  message: Message;
  headerIndex: any;
  moveState: string;
  chatState: boolean;
  showChatState: boolean;
  unChatNum: number | string;
  unMessageNum: number;
  socketObj: any;
  timeSetVisible: boolean;
  timeSetX: number;
  timeSetY: number;
  taskMemberVisible: boolean;
  taskMemberX: number;
  taskMemberY: number;
  fileInfo: any;
  fileKey: string;
  fileVisible: boolean;
}

const defaultState: Common = {
  loading: false,
  showApps: false,
  showNotification: false,
  showSearch: false,
  message: {
    visible: false,
    text: '',
    messageType: undefined,
  },
  // headerIndex: 3,
  headerIndex: null,
  moveState: '',
  chatState: false,
  showChatState: false,
  unChatNum: 0,
  unMessageNum: 0,
  socketObj: null,
  timeSetVisible: false,
  timeSetX: 0,
  timeSetY: 0,
  taskMemberVisible: false,
  taskMemberX: 0,
  taskMemberY: 0,
  fileInfo: null,
  fileKey: '',
  fileVisible: false,
};

export const common = (state = defaultState, action: any) => {
  switch (action.type) {
    case commonActionTypes.FAILED:
      if (action.error.statusCode === '701') {
        const redirect = `${window.location.protocol}//${window.location.host}`;
        // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
        localStorage.clear();
        window.location.href = `${redirect}/`;
      }
      return {
        ...state,
        loading: false,
        message: {
          visible: true,
          text: action.error.msg,
          severity: 'error',
        },
      };
    case commonActionTypes.SWITCH_APPS:
      return {
        ...state,
        showApps:
          action.visible !== undefined ? action.visible : !state.showApps,
      };
    case commonActionTypes.SWITCH_NOTIFICATION:
      return {
        ...state,
        showNotification:
          action.visible !== undefined
            ? action.visible
            : !state.showNotification,
      };
    case commonActionTypes.SWITCH_SEARCH:
      return {
        ...state,
        showSearch:
          action.visible !== undefined ? action.visible : !state.showSearch,
      };
    case commonActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: {
          visible: action.visible,
          text: action.text,
          messageType: action.messageType
            ? action.messageType
            : state.message.messageType,
        },
      };
    case commonActionTypes.SET_HEADERINDEX:
      return {
        ...state,
        headerIndex: action.headerIndex,
      };
    case commonActionTypes.SET_MOVESTATE:
      return {
        ...state,
        moveState: action.moveState,
      };
    case commonActionTypes.LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case commonActionTypes.SET_CHATSTATE:
      return {
        ...state,
        chatState: action.chatState,
      };
    case commonActionTypes.SET_SHOW_CHATSTATE:
      return {
        ...state,
        showChatState: action.showChatState,
      };
    case commonActionTypes.SET_UNCHATREADNUM:
      return {
        ...state,
        unChatNum: action.unChatNum,
      };
    case commonActionTypes.SET_UNMESSAGEREADNUM:
      return {
        ...state,
        unMessageNum: action.unMessageNum,
      };
    case commonActionTypes.SET_SOCKETOBJ:
      return {
        ...state,
        socketObj: action.socketObj,
      };
    case commonActionTypes.CHANGE_TIMESET_VISIBLE:
      return {
        ...state,
        timeSetVisible: action.timeSetVisible,
        timeSetX: action.timeSetX,
        timeSetY: action.timeSetY,
      };
    case commonActionTypes.CHANGE_TASKMEMBER_VISIBLE:
      return {
        ...state,
        taskMemberVisible: action.taskMemberVisible,
        taskMemberX: action.taskMemberX,
        taskMemberY: action.taskMemberY,
      };
    case commonActionTypes.SET_FILEINFO:
      return {
        ...state,
        fileInfo: action.fileInfo,
        fileVisible: action.fileVisible,
      };
    case commonActionTypes.SET_FILEKEY:
      return {
        ...state,
        fileKey: action.fileKey,
      };

    default:
      return state;
  }
};
