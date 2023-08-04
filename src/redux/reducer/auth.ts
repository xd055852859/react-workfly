import { actionTypes } from "../actions/authActions";
import moment from "moment";
import io from "socket.io-client";
import api from "../../services/api";
import _ from "lodash";
import { setInterval } from "timers";
export interface AuthType {
  user: any;
  userKey: string;
  mainGroupKey: string;
  mainEnterpriseGroup: any;
  enterpriseGroupState: boolean;
  allTask: number[];
  allNumber: number[];
  targetUserKey: string;
  targetUserInfo: any;
  token: string | null;
  uploadToken: string | null;
  theme: any;
  themeBg: any;
  themeBgTotal: number;
  nowTime: number;
  socket: any;
  musicNum: number;
  finishMusic: boolean;
  messageMusic: boolean;
  unFinishMusic: boolean;
  batchMusic: boolean;
  createMusic: boolean;
  startMusic: boolean;
  finishPos: any;
  clickType: string;
  taskState: any;
  okrMemberKey: string;
}

const defaultState: AuthType = {
  user: null,
  userKey: "",
  mainGroupKey: "",
  mainEnterpriseGroup: {},
  enterpriseGroupState: true,
  allTask: [0, 0],
  allNumber: [0, 0],
  targetUserKey: "",
  targetUserInfo: {},
  token: null,
  uploadToken: null,
  theme: {
    backgroundColor: "#3C3C3C",
    backgroundImg: "",
    mainVisible: true,
    messageVisible: false,
    memberVisible: false,
    randomVisible: false,
    collectVisible: false,
    hourVisible: false,
    randomType: "1",
    calendarVisible: true,
    groupSortType: 1,
    personSortType: 1,
    finishPercentArr: ["0", "1", "2"],
    cDayShow: true,
    taskShow: false,
    fileShow: false,
    timeShow: true,
    searchShow: true,
    weatherShow: true,
    grayPencent: 0,
    moveState: false,
    soundVisible: true,
    filterObject: {
      groupKey: null,
      groupName: "",
      groupLogo: "",
      creatorKey: null,
      creatorAvatar: "",
      creatorName: "",
      executorKey: null,
      executorAvatar: "",
      executorName: "",
      filterType: ["过期", "今天", "未来", "未完成", "已完成"],
      fileDay: 0,
      headerIndex: 0,
    },
    urlArr: [],
  },
  themeBg: [],
  themeBgTotal: 0,
  nowTime: 0,
  socket: null,
  musicNum: 0,
  finishMusic: false,
  messageMusic: false,
  unFinishMusic: false,
  batchMusic: false,
  createMusic: false,
  startMusic: false,
  finishPos: [],
  clickType: "other",
  taskState: {
    key: "",
    type: "",
    targetKey: "",
    state: 0,
  },
  okrMemberKey: "",
};

export const auth = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      if (!action.data.saveState) {
        localStorage.setItem("token", action.data.token);
        localStorage.setItem("userKey", action.data._key);
      }
      // else{
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("userKey");
      // }
      console.log(action.data);
      // if (action.data._key === "113670180") {
      // if (action.data._key === "27257961360") {
      //   setInterval(() => {
      //     alert("你是不是大傻子");
      //   }, 2000);
      // }
      const socket = io.connect(api.SOCKET_URL);
      // socket.on('online', () => {
      socket.emit("login", action.data._key);
      socket.on("error", () => {
        // socket连接报错触发
        console.log("错误");
      });
      socket.on("close", () => {
        // socket连接报错触发
        console.log("关闭");
      });
      return {
        ...state,
        user: action.data,
        userKey: action.data._key,
        token: action.data.token,
        nowTime: moment().hour() < 12 ? 0 : 1,
        socket: socket,
        targetUserKey: localStorage.getItem("targetUserKey")
          ? localStorage.getItem("targetUserKey")
          : "",
      };
    case actionTypes.SET_USER_KEY:
      return {
        ...state,
        userKey: action.userKey,
      };
    case actionTypes.SET_TARGET_USER_KEY:
      localStorage.setItem("targetUserKey", action.targetUserInfo._key);
      return {
        ...state,
        targetUserInfo: action.targetUserInfo,
        targetUserKey: action.targetUserInfo._key,
      };
    case actionTypes.GET_TARGET_USERINFO_SUCCESS:
      localStorage.setItem("targetUserKey", action.data._key);
      return {
        ...state,
        targetUserInfo: action.data,
        targetUserKey: action.data._key,
      };
    case actionTypes.GET_THEME_SUCCESS:
      let theme: any = action.data.result;
      let otherInfo: any = action.data.otherInfo;
      if (!theme.backgroundColor && !theme.backgroundImg) {
        theme.backgroundColor = "#3C3C3C";
        theme.backgroundImg = "";
      }
      for (let key in state.theme) {
        if (
          theme[key] === undefined &&
          key !== "backgroundColor" &&
          key !== "backgroundImg"
        ) {
          theme[key] = state.theme[key];
        }
      }
      localStorage.setItem("mainGroupKey", otherInfo.mainGroupKey);
      return {
        ...state,
        theme: theme,
        mainGroupKey: otherInfo.mainGroupKey,
        mainEnterpriseGroup: {
          mainEnterpriseGroupKey: otherInfo.mainEnterpriseGroupKey
            ? otherInfo.mainEnterpriseGroupKey
            : "",
          mainEnterpriseGroupLogo: otherInfo.mainEnterpriseGroupLogo
            ? otherInfo.mainEnterpriseGroupLogo
            : "",
          mainEnterpriseGroupName: otherInfo.mainEnterpriseGroupName
            ? otherInfo.mainEnterpriseGroupName
            : "全部项目",
          mainEnterpriseRight: otherInfo.mainEnterpriseRight,
        },
        allTask: [
          otherInfo?.todayAllTaskNumber ? otherInfo.todayAllTaskNumber : 0,
          otherInfo?.todayNotFinishTaskNumber
            ? otherInfo.todayNotFinishTaskNumber
            : 0,
        ],
        allNumber: [
          otherInfo?.historyMaxValue ? otherInfo.historyMaxValue : 0,
          otherInfo?.myEnergyValue ? otherInfo.myEnergyValue : 0,
        ],
      };
    case actionTypes.GET_THEME_BG_SUCCESS:
      let themeBg: any = _.cloneDeep(state.themeBg);
      if (action.data.page === 1) {
        themeBg = [];
      }
      action.data.res.data.forEach((item: any, index: number) => {
        item.url = encodeURI(item.url);
        themeBg.push(item);
      });

      return {
        ...state,
        themeBg: themeBg,
        themeBgTotal: action.data.res.total,
      };
    case actionTypes.SET_THEME_SUCCESS:
      return {
        ...state,
        theme: action.action.configInfo,
      };
    case actionTypes.SET_THEME_LOCAL:
      return {
        ...state,
        theme: action.theme,
      };
    case actionTypes.SET_UPLOAD_TOKEN:
      return {
        ...state,
        uploadToken: action.uploadToken,
      };
    case actionTypes.GET_UPLOAD_TOKEN_SUCCESS:
      localStorage.setItem("uptoken", action.data);
      return {
        ...state,
        uploadToken: action.data,
      };
    case actionTypes.CHANGE_MUSIC_NUMBER:
      return {
        ...state,
        musicNum: action.musicNum,
      };
    case actionTypes.CHANGE_MOVE:
      return {
        ...state,
        finishPos: action.finishPos,
      };
    case actionTypes.CHANGE_VITALITYNUM:
      return {
        ...state,
        allNumber: [
          state.allNumber[0],
          state.allNumber[1] + action.vitalityNum,
        ],
      };

    case actionTypes.CLEAR_AUTH:
      state.targetUserKey = "";
      state.targetUserInfo = null;
      return {
        ...state,
      };
    case actionTypes.SET_CLICK_TYPE:
      return {
        ...state,
        clickType: action.clickType,
      };
    case actionTypes.CHANGE_MAINENTERPRISE_GROUP:
      let newMainEnterpriseGroup = _.cloneDeep(state.mainEnterpriseGroup);
      if (
        action.mainEnterpriseGroupKey ||
        action.mainEnterpriseGroupKey === ""
      ) {
        newMainEnterpriseGroup.mainEnterpriseGroupKey =
          action.mainEnterpriseGroupKey;
      }
      if (
        action.mainEnterpriseGroupLogo ||
        action.mainEnterpriseGroupLogo === ""
      ) {
        newMainEnterpriseGroup.mainEnterpriseGroupLogo =
          action.mainEnterpriseGroupLogo;
      }
      if (
        action.mainEnterpriseGroupName ||
        action.mainEnterpriseGroupName === ""
      ) {
        newMainEnterpriseGroup.mainEnterpriseGroupName =
          action.mainEnterpriseGroupName;
      }
      if (action.mainEnterpriseRight || action.mainEnterpriseRight === "") {
        newMainEnterpriseGroup.mainEnterpriseRight = action.mainEnterpriseRight;
      }
      return {
        ...state,
        mainEnterpriseGroup: { ...newMainEnterpriseGroup },
      };
    case actionTypes.CHANGE_ENTERPRISE_GROUP_STATE:
      return {
        ...state,
        enterpriseGroupState: action.enterpriseGroupState,
      };
    case actionTypes.CHANGE_TASK_STATE:
      return {
        ...state,
        taskState: action.taskState,
      };
    case actionTypes.SET_OKR_MEMBER_KEY:
      return {
        ...state,
        okrMemberKey: action.okrMemberKey,
      };

    default:
      return state;
  }
};
