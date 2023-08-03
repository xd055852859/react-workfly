import { message } from "antd";
import axios from "axios";
import moment from "moment";
import { getSearchParamValue } from "../services/util";
import qs from "qs";
declare var window: Window;
const AUTH_URL = "https://baokudata.qingtime.cn/sgbh";
const HOME_URL = "https://workingdata.qingtime.cn/sgbh";
// const AUTH_URL = 'http://192.168.0.101:8529/_db/working/my_sgbh';
// const HOME_URL = 'http://192.168.0.101:8529/_db/working/my_sgbh';
const ROCKET_CHAT_URL = "https://chat.qingtime.cn";
// const SOCKET_URL = 'http://192.168.0.101:9033';
const SOCKET_URL = "https://workingdata.qingtime.cn";
const PNG_URL = "https://timeosdata.qingtime.cn";
// const API_URL = "http://192.168.1.108:8529/_db/timeOS/myOs"; let token:
// string | null = localStorage.getItem('auth_token');

//用于根据当前请求的信息，生成请求 Key；
function generateReqKey(config) {
  const { method, url, params, data } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join("&");
}
//用于把当前请求信息添加到pendingRequest对象中；
const pendingRequest = new Map();
function addPendingRequest(config) {
  const requestKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel);
      }
    });
}
//检查是否存在重复请求，若存在则取消已发的请求。

function removePendingRequest(config) {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey);
    cancelToken(requestKey);
    pendingRequest.delete(requestKey);
  }
}

let auth_token: string | null =
  //@ts-ignore
  getSearchParamValue(window.location.search, "token") ||
  localStorage.getItem("token");

axios.interceptors.request.use(
  function (config) {
    removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
    addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config);
    // 从pendingRequest对象中移除请求
    console.log(response.data.statusCode);
    //@ts-ignore
    if (response.data.statusCode == 701) {
      // ElMessage.error("请登录");
      message.error("请登录");
      const redirect = `${window.location.protocol}//${window.location.host}`;
      // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
      localStorage.clear();
      window.open(`${redirect}/welcome`, "_self");
    } else if (response.data.status === 201) {
      console.log(response.data.msg);
      // message.error(response.data.msg);
    }
    return response;
  },
  (error) => {
    removePendingRequest(error.config || {}); // 从pendingRequest对象中移除请求
    if (axios.isCancel(error)) {
      console.log("已取消的重复请求：" + error.message);
    } else {
      // 添加异常处理
    }
    return Promise.reject(error);
  }
);

const request = {
  get: (url, params) => {
    // todo ping
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
          headers: { token: auth_token },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  post: (url, params, otherToken?: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: { token: otherToken ? otherToken : auth_token },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  patch: (url, params) => {
    return new Promise(async function (resolve, reject) {
      axios
        .patch(url, params, {
          headers: { token: auth_token },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  delete: (url, params) => {
    return new Promise(async function (resolve, reject) {
      axios
        .delete(url, {
          data: params,
          // paramsSerializer: params => {
          //   return qs.stringify(params, { indices: false })
          // }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
};
const common = {
  // getWeather(lo: number, la: number) {
  //   return request.get(HOME_URL + "/weather/weatherSingleNoToken", {
  //     lo: lo,
  //     la: la,
  //     detail: 0,
  //   });
  // },
  getWeather() {
    return request.get("https://api.vvhan.com/api/weather",{});
  },
  getVersion(type: number) {
    return request.get(AUTH_URL + "/version/dangGuiAndroidVersion", {
      type: type,
    });
  },
  todayEnergyValueRanking() {
    return request.post(HOME_URL + "/cardLog/todayEnergyValueRanking", {
      token: auth_token,
    });
  },
  getChartData(type: number, startTime: number, endTime: number) {
    return request.post(HOME_URL + "/cardLog/energyValueStatistics", {
      token: auth_token,
      type: type,
      startTime: startTime,
      endTime: endTime,
    });
  },
  createWorkingTreeNode(
    workingToken: string,
    nodeName: string,
    groupKey: string
  ) {
    return request.post(
      PNG_URL + "/node",
      {
        type: "doc",
        docType: "knowledgebase",
        name: nodeName,
        appKey: "2146371795",
        workflyOnlyKey: groupKey,
      },
      workingToken
    );
  },
};
const auth = {
  getUserInfo(token: string) {
    return request.get(AUTH_URL + "/account/userinfo", { token: token });
  },
  getMainGroupKey() {
    return request.patch(HOME_URL + "/group/createMainGroup", {
      token: auth_token,
    });
  },
  getTargetUserInfo(key: string) {
    return request.get(HOME_URL + "/account/targetUserInfo", {
      token: auth_token,
      key: key,
    });
  },
  dealCareFriendOrGroup(
    type: number,
    friendOrGroupKey: string,
    status: number
  ) {
    return request.post(HOME_URL + "/group/dealCareFriendOrGroup", {
      token: auth_token,
      type: type,
      friendOrGroupKey: friendOrGroupKey,
      status: status,
    });
  },
  dealGroupFold(groupKey: string, status: number) {
    return request.post(HOME_URL + "/group/dealGroupFold", {
      token: auth_token,
      groupKey: groupKey,
      status: status,
    });
  },
  getMessageList(
    curPage: number,
    perPage: number,
    filterType: number[],
    type: number,
    isReceipt?: number
  ) {
    return request.post(HOME_URL + "/card/getNoticeList", {
      token: auth_token,
      curPage: curPage,
      perPage: perPage,
      filterType: filterType,
      type: type,
      isReceipt: isReceipt,
    });
  },
  sendReceipt(noticeKey: string) {
    return request.post(HOME_URL + "/card/sendReceipt", {
      token: auth_token,
      noticeKey: noticeKey,
    });
  },
  batchSendReceipt() {
    return request.post(HOME_URL + "/card/batchSendReceipt", {
      token: auth_token,
    });
  },
  getWorkingConfigInfo() {
    return request.post(HOME_URL + "/account/getWorkingConfigInfo", {
      token: auth_token,
    });
  },
  setWorkingConfigInfo(configInfo: any) {
    return request.post(HOME_URL + "/account/setWorkingConfigInfo", {
      token: auth_token,
      configInfo: configInfo,
    });
  },
  getPrompt() {
    return request.post(HOME_URL + "/card/getPrompt", { token: auth_token });
  },
  getUptoken() {
    return request.get(AUTH_URL + "/upTokenQiniu/getQiNiuUpToken", {
      token: auth_token,
      type: 2,
      bucketType: 3,
    });
  },
  getNote(targetUKey: string | number, startTime: number) {
    return request.post(HOME_URL + "/card/getNote", {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      type: 2,
    });
  },
  setNote(params: any) {
    return request.post(HOME_URL + "/card/setNote", {
      token: auth_token,
      ...params,
    });
  },
  clockIn(params: any) {
    return request.post(HOME_URL + "/card/clockIn", {
      token: auth_token,
      ...params,
    });
  },
  monthEnergy(params: any) {
    return request.post(HOME_URL + "/card/monthEnergy", {
      token: auth_token,
      ...params,
    });
  },
  getGroupLog(
    groupKey: string,
    startTime: number,
    endTime: number,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/cardLog/getGroupLog", {
      token: auth_token,
      isFilter: 1,
      groupKey: groupKey,
      startTime: startTime,
      endTime: endTime,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getUserLog(
    startTime: number,
    endTime: number,
    curPage: number,
    perPage: number,
    targetUKey?: any
  ) {
    return request.post(HOME_URL + "/cardLog/getUserLog", {
      token: auth_token,
      isFilter: 1,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
      curPage: curPage,
      perPage: perPage,
    });
  },
  monthEnergyWeb(
    startTime: number,
    endTime: number,
    type: number,
    targetUGKey: string
  ) {
    return request.post(HOME_URL + "/card/monthEnergyWeb", {
      token: auth_token,
      startTime: startTime,
      endTime: endTime,
      type: type,
      targetUGKey: targetUGKey,
    });
  },
  getDiaryList(targetUKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + "/card/clockInList", {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getClockInCommentList(
    clockInKey: number | string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/card/getClockInCommentList", {
      token: auth_token,
      clockInKey: clockInKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  addClockInComment(clockInKey: string | number, content: string) {
    return request.post(HOME_URL + "/card/addClockInComment", {
      token: auth_token,
      clockInKey: clockInKey,
      content: content,
    });
  },
  deleteClockInComment(clockInCommentKey: number | string) {
    return request.post(HOME_URL + "/card/deleteClockInComment ", {
      token: auth_token,
      clockInCommentKey: clockInCommentKey,
    });
  },
  //修改权限
  setRole(groupKey: string, targetUKey: string, role: number | string) {
    return request.patch(HOME_URL + "/groupmember/setRole", {
      token: auth_token,
      groupKey: groupKey,
      targetUKey: targetUKey,
      role: role,
    });
  },
  updateAccount(param: any) {
    return request.patch(AUTH_URL + "/account", {
      token: auth_token,
      ...param,
    });
  },
  getWallPapers(page: number) {
    return request.get(PNG_URL + "/wallPaper", {
      style: "web",
      page: page,
      limit: 99,
    });
  },
  viewWallPapers(wallKey: string) {
    return request.patch(PNG_URL + "/wallPaper/view", { wallKey: wallKey });
  },
  chooseWallPapers(wallKey: string) {
    return request.patch(PNG_URL + "/wallPaper/choose", { wallKey: wallKey });
  },
  //切换timeosToken
  switchToken() {
    return request.get(AUTH_URL + "/account/switchToken", {
      token: auth_token,
      appHigh: 36,
    });
  },
  clearMessage() {
    return request.post(HOME_URL + "/card/deleteNoticeAll", {
      token: auth_token,
    });
  },
  getUrlIcon(linkUrl: string) {
    return request.get("https://nodeserver.qingtime.cn/urlIcon", {
      linkUrl: linkUrl,
    });
  },
  //获取日报列表
  //单人所有群统计数据
  getReportList(targetUKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + "/card/singleUserAllGroupStatistics", {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  //单个群所有人统计数据
  getGroupReportList(targetGKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + "/card/singleGroupAllUserStatistics", {
      token: auth_token,
      targetGKey: targetGKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  //单个群单人统计数据
  getMemberReportList(
    targetUKey: string,
    targetGKey: string,
    startTime: number,
    endTime: number
  ) {
    return request.post(HOME_URL + "/card/singleGroupSingleUserStatistics", {
      token: auth_token,
      targetUKey: targetUKey,
      targetGKey: targetGKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  //单人所有群数据
  getReportInfo(targetUKey: string, startTime: number) {
    return request.post(HOME_URL + "/card/singleUserList", {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
    });
  },
  //单群所有人数据
  getGroupReportInfo(targetGKey: string, startTime: number) {
    return request.post(HOME_URL + "/card/singleGroupList", {
      token: auth_token,
      targetGKey: targetGKey,
      startTime: startTime,
    });
  },
  //单个群单人数据
  getMemberReportInfo(
    targetUKey: string,
    targetGKey: string,
    startTime: number
  ) {
    return request.post(HOME_URL + "/card/singleUserSingleGroupList", {
      token: auth_token,
      targetUKey: targetUKey,
      targetGKey: targetGKey,
      startTime: startTime,
    });
  },
};
const task = {
  getGroupTask(
    type1: number,
    targetUKey: string | number,
    type2: number,
    finishPercentArray: number[],
    isPath?: number
  ) {
    return request.post(HOME_URL + "/card/allGroupTaskNew", {
      token: auth_token,
      type1: type1,
      targetUKey: targetUKey,
      type2: type2,
      finishPercentArray: finishPercentArray,
      isPath: isPath ? isPath : 1,
      typeArray: [2, 6],
    });
  },
  getTeamTask(
    finishPercentArray: number[],
    groupKey?: string,
    startTime?: number | null,
    endTime?: number | null
  ) {
    return request.post(HOME_URL + "/card/getTeamCareTask", {
      token: auth_token,
      groupKey: groupKey,
      finishPercentArray: finishPercentArray,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getProjectTask(finishPercentArray: number[]) {
    return request.post(HOME_URL + "/card/getProjectCareTask", {
      token: auth_token,
      finishPercentArray: finishPercentArray,
    });
  },
  getTaskListNew(
    typeBoard1: number,
    targetUGKey: string,
    finishPercentArray: string,
    fileDay?: number,
    endTime?: number,
    isAddTodayFinish?: number
  ) {
    return request.get(HOME_URL + "/card/listBoardTaskNew", {
      token: auth_token,
      typeBoard1: typeBoard1,
      targetUGKey: targetUGKey,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
      endTime: endTime,
      isAddTodayFinish: isAddTodayFinish,
      isContainTree: true,
    });
  },
  getTaskList(
    typeBoard1: number,
    targetUGKey: string,
    finishPercentArray: string,
    fileDay?: number,
    endTime?: number,
    isAddTodayFinish?: number
  ) {
    return request.get(HOME_URL + "/card/listBoardTask", {
      token: auth_token,
      typeBoard1: typeBoard1,
      targetUGKey: targetUGKey,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
      endTime: endTime,
      isAddTodayFinish: isAddTodayFinish,
      isContainTree: true,
    });
  },
  editTask(params: any) {
    return request.patch(HOME_URL + "/card", {
      token: auth_token,
      ...params,
      // key: params.key,
      // // children: params.children,
      // content: params.content,
      // countDownTime: params.countDownTime,
      // date: params.date,
      // day: params.day,
      // executorAvatar: params.executorAvatar,
      // executorKey: params.executorKey,
      // executorName: params.executorName,
      // finishPercent: params.finishPercent,
      // followUKeyArray: params.followUKeyArray,
      // groupKey: params.groupKey,
      // groupLogo: params.groupLogo,
      // groupName: params.groupName,
      // hour: params.hour,
      // importantStatus: params.importantStatus,
      // labelKey: params.labelKey,
      // labelName: params.labelName,
      // // parentCardKey: params.parentCardKey,
      // taskEndDate: params.taskEndDate,
      // taskStartDate: params.taskStartDate,
      // taskType: params.taskType,
      // title: params.title,
      // todayTaskTime: params.todayTaskTime,
      // type: params.type,
      // contract: params.contract,
    });
  },
  // groupKey: number | string,
  //   groupRole: number | string,
  //   labelKey: any,
  //   executorKey?: any,
  //   title?: string,
  //   parentCardKey?: string,
  //   cardIndex?: number,
  //   type?: number,
  //   taskType?: number,
  //   finishPercent?: number,
  //   taskEndDate?: number
  addTask(params: any) {
    return request.post(HOME_URL + "/card", {
      token: auth_token,
      type: params.type ? params.type : 2,
      title: params.title ? params.title : "",
      content: "",
      groupKey: params.groupKey,
      taskType: params.taskType
        ? params.taskType
        : params.taskType === 0
        ? 0
        : 1,
      executorKey: params.executorKey,
      followUKeyArray: [params.executorKey],
      finishPercent: params.finishPercent ? params.finishPercent : 0,
      hour: 0.1,
      day: 1,
      date: moment().date(),
      taskEndDate: params.taskEndDate
        ? params.taskEndDate
        : moment().hour() > 17
        ? moment().add(1, "days").endOf("day").valueOf()
        : moment().endOf("day").valueOf(),
      taskStartDate: moment().valueOf(),
      groupRole: params.groupRole,
      cardIndex: params.cardIndex ? params.cardIndex : 0,
      indexTree: params.indexTree ? params.indexTree : 0,
      labelKey: params.labelKey ? params.labelKey : null,
      parentCardKey: params.parentCardKey,
      extraData: params.extraData ? params.extraData : {},
    });
  },
  addNormalTask(params: any) {
    return request.post(HOME_URL + "/card", {
      token: auth_token,
      rootType: 0,
      finishPercent: 0,
      content: "",
      ...params,
    });
  },
  deleteTask(cardKey: number | string, groupKey: number | string) {
    return request.delete(HOME_URL + "/card", {
      token: auth_token,
      cardKey: cardKey,
      groupKey: groupKey,
    });
  },
  seniorDeleteTreeCard(cardKey: number | string, groupKey: number | string) {
    return request.post(HOME_URL + "/card/seniorDeleteTreeCard", {
      token: auth_token,
      cardKey: cardKey,
      groupKey: groupKey,
    });
  },

  getCardSearch(params: any) {
    return request.get(HOME_URL + "/card/searchCard", {
      token: auth_token,
      ...params,
    });
  },
  getCardLast(params: any) {
    return request.post(HOME_URL + "/card/getUpSertCardTime", {
      token: auth_token,
      ...params,
    });
  },
  addTaskLabel(
    groupKey: string,
    cardLabelName: number | string,
    executorKey: string
  ) {
    return request.post(HOME_URL + "/card/addCardLabel", {
      token: auth_token,
      groupKey: groupKey,
      cardLabelName: cardLabelName,
      executorKey: executorKey,
    });
  },
  changeTaskLabelName(labelKey: string, newLabelName: string) {
    return request.patch(HOME_URL + "/card/setLabelProperty", {
      token: auth_token,
      labelKey: labelKey,
      newLabelName: newLabelName,
    });
  },
  //批量归档
  batchTaskArray(cardKeyArray: string[]) {
    return request.patch(HOME_URL + "/card/fileCard", {
      token: auth_token,
      cardKeyArray: cardKeyArray,
    });
  },
  //批量导入任务
  batchCard(
    batchTitle: string,
    groupKey: string,
    labelKey: string,
    type?: number,
    taskType?: number,
    parentCardKey?: string
  ) {
    return request.post(HOME_URL + "/card/batchQuickCreateCard", {
      token: auth_token,
      type: type ? type : 2,
      batchTitle: batchTitle,
      groupKey: groupKey,
      labelKey: labelKey,
      date: moment().date(),
      cardIndex: 0,
      taskEndDate:
        moment().hour() > 17
          ? moment().add(1, "days").endOf("day").valueOf()
          : moment().endOf("day").valueOf(),
      day: 1,
      hour: 1,
      taskType: taskType === 0 ? taskType : 1,
      parentCardKey: parentCardKey ? parentCardKey : "",
    });
  },
  //批量导入树任务

  batchAddTreeCard(fatherCardKey: string, batchTitle: string) {
    return request.post(HOME_URL + "/card/batchAddTreeCard", {
      token: auth_token,
      fatherCardKey: fatherCardKey,
      batchTitle: batchTitle,
    });
  },
  changeTaskLabel(groupKey: string, cardKey: string, labelKey: string) {
    return request.patch(HOME_URL + "/card/setCardLabel", {
      token: auth_token,
      groupKey: groupKey,
      cardKey: cardKey,
      labelKey: labelKey,
      type: 3,
    });
  },
  deleteTaskLabel(groupKey: string, cardLabelKey: string) {
    return request.post(HOME_URL + "/card/deleteCardLabel", {
      token: auth_token,
      groupKey: groupKey,
      cardLabelKey: cardLabelKey,
    });
  },
  setLabelCardOrder(labelObject: object) {
    return request.post(HOME_URL + "/card/setLabelCardOrderNew", {
      token: auth_token,
      ...labelObject,
    });
  },
  getTaskHistory(
    cardKey: string,
    curPage: number,
    perPage: number,
    isEnergyValue?: number
  ) {
    return request.get(HOME_URL + "/cardLog/cardLogList", {
      token: auth_token,
      cardKey: cardKey,
      curPage: curPage,
      perPage: perPage,
      isEnergyValue: isEnergyValue,
    });
  },
  getTaskComment(cardKey: string, curPage: number, perPage: number) {
    return request.get(HOME_URL + "/commentCard/list", {
      token: auth_token,
      cardKey: cardKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  addComment(cardKey: string, content: string) {
    return request.post(HOME_URL + "/commentCard", {
      token: auth_token,
      cardKey: cardKey,
      action: 2,
      content: content,
    });
  },
  deleteComment(cardCommentKey: string) {
    return request.delete(HOME_URL + "/commentCard", {
      token: auth_token,
      cardCommentKey: cardCommentKey,
    });
  },
  allGridGroupTask(params: any) {
    return request.post(HOME_URL + "/card/allGroupTaskFS", {
      token: auth_token,
      ...params,
    });
  },
  getGroupDataTask(
    groupKey: string,
    finishPercentArray: any,
    startTime: number | null,
    endTime: number
  ) {
    return request.post(HOME_URL + "/card/getTeamCareTask", {
      token: auth_token,
      groupKey: groupKey,
      finishPercentArray: finishPercentArray,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getGroupDataTaskNew(
    groupKey: string,
    type: number,
    creatorKey?: string,
    executorKey?: string
  ) {
    return request.post(HOME_URL + "/card/getGroupCardList", {
      token: auth_token,
      groupKey: groupKey,
      type: type,
      creatorKey: creatorKey,
      executorKey: executorKey,
    });
  },
  getTaskInfo(cardKey: string) {
    let obj: any = { cardKey: cardKey };
    console.log("auth_token", auth_token);
    if (auth_token && auth_token !== "null") {
      obj.token = auth_token;
    }
    return request.get(HOME_URL + "/card/cardDetail", {
      ...obj,
    });
  },
  //获取日程任务
  getCalendarList(targetUKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + "/card/getScheduleCardList", {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  //获取任务
  getCalendarCardList(params: any) {
    return request.post(HOME_URL + "/card/getCalendarCardList", {
      token: auth_token,
      ...params,
    });
  },
  //获取日程详情
  getCalendarInfo(params: any) {
    return request.post(HOME_URL + "/card/getEventInfo", {
      token: auth_token,
      ...params,
    });
  },
  //日程关注者
  setEventFollowUser(params: any) {
    return request.post(HOME_URL + "/card/setEventFollowUser", {
      token: auth_token,
      ...params,
    });
  },
  getCalendarGroup(targetUKey: string) {
    return request.post(HOME_URL + "/group/getTogetherGroupInfo", {
      token: auth_token,
      targetUKey: targetUKey,
    });
  },
  //获取树任务
  getTaskTreeList(taskTreeRootCardKey: string, currCardKey: string) {
    return request.post(HOME_URL + "/card/getTaskTreeList", {
      token: auth_token,
      taskTreeRootCardKey: taskTreeRootCardKey,
      currCardKey: currCardKey,
    });
  },
  //修改树关系
  changeTreeTaskRelation(params: any) {
    return request.post(HOME_URL + "/card/batchSwitchFSTreeTaskRelation", {
      token: auth_token,
      ...params,
    });
  },
  getCardCreate(
    curPage: number,
    perPage: number,
    filterType: number,
    typeArray?: any
  ) {
    return request.post(HOME_URL + "/card/getLatelyTaskList", {
      token: auth_token,
      curPage: curPage,
      perPage: perPage,
      filterType: filterType,
      typeArray: typeArray ? typeArray : [2, 6],
    });
  },
  getScheduleList(parmas: any) {
    return request.post(HOME_URL + "/card/getScheduleList", {
      token: auth_token,
      ...parmas,
    });
  },
  createSchedule(params: any) {
    return request.post(HOME_URL + "/card/createSchedule", {
      token: auth_token,
      ...params,
      isWork: 2,
    });
  },
  editSchedule(params: any) {
    return request.post(HOME_URL + "/card/updateEventOrTaskNew", {
      token: auth_token,
      ...params,
    });
  },
  changeCircleSchedule(params: any) {
    return request.post(HOME_URL + "/card/changeCircleSchedule", {
      token: auth_token,
      ...params,
    });
  },
  //删除循环任务
  deleteEvent(eventKey: string) {
    return request.post(HOME_URL + "/card/deleteEvent", {
      token: auth_token,
      eventKey: eventKey,
    });
  },

  //批量创建
  togetherCreateCard(params: any) {
    return request.post(HOME_URL + "/card/togetherCreateCard", {
      token: auth_token,
      ...params,
      type: 2,
      rootType: 0,
      hour: 1,
      taskEndDate:
        moment().hour() > 17
          ? moment().add(1, "days").endOf("day").valueOf()
          : moment().endOf("day").valueOf(),
    });
  },
  //复制树任务
  copyTreeTask(
    sonTaskKey: string,
    newFatherTaskKey: string,
    taskTreeRootCardKey: string,
    childrenIndex?: number
  ) {
    return request.post(HOME_URL + "/card/copyFSTreeTask", {
      token: auth_token,
      sonTaskKey: sonTaskKey,
      newFatherTaskKey: newFatherTaskKey,
      taskTreeRootCardKey: taskTreeRootCardKey,
      childrenIndex: childrenIndex,
    });
  },
  editCardSimple(cardKey: string, patchData: any) {
    return request.post(HOME_URL + "/card/updateCardSimple", {
      token: auth_token,
      cardKey: cardKey,
      patchData: patchData,
    });
  },
  //最近访问的文件
  setVisitCardTime(cardKey: string) {
    return request.post(HOME_URL + "/card/setVisitCardTime", {
      token: auth_token,
      cardKey: cardKey,
    });
  },
  //访问文件列表
  getVisitCardTime(
    groupKey: string,
    enterpriseGroupKey: string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/card/getVisitCardTime", {
      token: auth_token,
      groupKey: groupKey,
      enterpriseGroupKey: enterpriseGroupKey,
      curPage: curPage,
      perPage: perPage,
      typeArray: [10, 11, 12, 13, 14, 15, 16],
    });
  },
  getCreateCardTime(groupKey: string, curPage: number, perPage: number) {
    return request.post(HOME_URL + "/card/getLasestCreateCard", {
      token: auth_token,
      groupKey: groupKey,
      curPage: curPage,
      perPage: perPage,
      typeArray: [10, 11, 12, 13, 14, 15, 16],
    });
  },
  getTreeCollectDocList(curPage: number, perPage: number) {
    return request.post(HOME_URL + "/card/getTreeCollectDocList", {
      token: auth_token,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getCollectDocList(curPage: number, perPage: number) {
    return request.post(HOME_URL + "/card/getCollectDocList", {
      token: auth_token,
      curPage: curPage,
      perPage: perPage,
    });
  },
  editAllTask(cardKeyArray: string[], patchData: any) {
    return request.patch(HOME_URL + "/card/batchUpdateCard", {
      token: auth_token,
      cardKeyArray: cardKeyArray,
      patchData: patchData,
    });
  },
  deleteAllTask(cardKeyArray: string[], groupKey: string) {
    return request.post(HOME_URL + "/card/batchDeleteTreeCard", {
      token: auth_token,
      cardKeyArray: cardKeyArray,
      groupKey: groupKey,
    });
  },
  followCard(cardKey: string, followKeyArray: string[]) {
    return request.post(HOME_URL + "/followCard", {
      token: auth_token,
      cardKey: cardKey,
      followKeyArray: followKeyArray,
    });
  },
  //复制任务
  cloneCard(
    oldCardKey: string,
    targetGroupKey: string,
    targetLabelKey: string
  ) {
    return request.post(HOME_URL + "/card/cloneCard", {
      token: auth_token,
      oldCardKey: oldCardKey,
      targetGroupKey: targetGroupKey,
      targetLabelKey: targetLabelKey,
    });
  },
  batchAddPicUrl(picData: any, urlArray: any) {
    return request.post(HOME_URL + "/card/batchAddPicUrl", {
      token: auth_token,
      picData: picData,
      urlArray: urlArray,
    });
  },
  judgeUploadSpaceSize(groupKey: string, size: number) {
    return request.post(HOME_URL + "/card/judgeUploadSpaceSize", {
      token: auth_token,
      groupKey: groupKey,
      size: size,
    });
  },
  upsertGroupCardVisitTime(
    groupKey: string,
    cardKey: string,
    groupInfo: any,
    cardInfo: any
  ) {
    return request.post(HOME_URL + "/card/upsertGroupCardVisitTime", {
      token: auth_token,
      groupKey: groupKey,
      cardKey: cardKey,
      groupInfo: groupInfo,
      cardInfo: cardInfo,
    });
  },
  getGroupCardVisitTimeList(groupKey?: string) {
    return request.post(HOME_URL + "/card/getGroupCardVisitTimeList", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  collectTask(cardKey: string, status: number) {
    return request.post(HOME_URL + "/card/collectDoc", {
      token: auth_token,
      cardKey: cardKey,
      status: status,
    });
  },
  exportTree(nodeKey: string, type: string) {
    return request.post(HOME_URL + "/card/exportTree", {
      token: auth_token,
      nodeKey: nodeKey,
      type: type,
    });
  },
};
const member = {
  getMember(groupId: string, sortType?: number, simple?: any) {
    return request.get(HOME_URL + "/groupmember", {
      token: auth_token,
      groupId: groupId,
      simple: simple,
      sortType: sortType,
    });
  },
  searchUserNew(searchCondition: string, curPage: number, perPage: number) {
    return request.post(HOME_URL + "/account/searchUserNew", {
      token: auth_token,
      searchCondition: searchCondition,
      curPage: curPage,
      perPage: perPage,
    });
  },
  searchGroupNew(searchCondition: string, curPage: number, perPage: number) {
    return request.post(HOME_URL + "/group/searchGroupNew", {
      token: auth_token,
      searchCondition: searchCondition,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getConfig(groupKey: string) {
    return request.post(HOME_URL + "/groupmember/getConfig", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  setConfig(groupMemberKey: string, config: any) {
    return request.post(HOME_URL + "/groupmember/setConfig", {
      token: auth_token,
      groupMemberKey: groupMemberKey,
      config: config,
    });
  },
  getPrivateChatRId(groupKey: string, targetUKey: string) {
    return request.post(HOME_URL + "/groupmember/getPrivateChatRId", {
      token: auth_token,
      groupKey: groupKey,
      targetUKey: targetUKey,
    });
  },
};
const group = {
  getGroup(
    listType: number,
    simple?: number | null,
    sortType?: number,
    groupKey?: string
  ) {
    return request.get(HOME_URL + "/group/groupList", {
      token: auth_token,
      listType: listType,
      simple: simple,
      sortType: sortType,
      groupKey: groupKey,
    });
  },
  getGroupInfo(key: string) {
    return request.get(HOME_URL + "/group", {
      token: auth_token,
      key: key,
    });
  },
  changeGroupInfo(key: string, patchData: any) {
    return request.patch(HOME_URL + "/group", {
      token: auth_token,
      key: key,
      patchData: patchData,
    });
  },
  addGroupMember(groupKey: string | null, targetUidList: any) {
    return request.post(HOME_URL + "/groupmember", {
      token: auth_token,
      groupKey: groupKey,
      targetUidList: targetUidList,
    });
  },
  addAllGroupMember(
    groupKey: string | null,
    newGroupMemberKeyArray: any,
    roleArray: any
  ) {
    return request.post(HOME_URL + "/groupmember/addAndDeleteGroupMember", {
      token: auth_token,
      groupKey: groupKey,
      newGroupMemberKeyArray: newGroupMemberKeyArray,
      roleArray: roleArray,
    });
  },
  deleteGroupMember(groupKey: string | null, targetUKeyList: any) {
    return request.delete(HOME_URL + "/groupmember/remove", {
      token: auth_token,
      groupKey: groupKey,
      targetUKeyList: targetUKeyList,
    });
  },
  outGroup(groupKey: string | null) {
    return request.delete(HOME_URL + "/groupmember", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  applyJoinGroup(groupKey: string | null) {
    return request.post(HOME_URL + "/group/applyJoinGroup", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  passwordJoinGroup(groupKey: string | null, password: string) {
    return request.post(HOME_URL + "/groupmember/passwordJoinGroup", {
      token: auth_token,
      groupKey: groupKey,
      password: password,
    });
  },
  addGroup(params: any) {
    return request.post(HOME_URL + "/group", {
      token: auth_token,
      ...params,
    });
  },
  dismissGroup(key: string) {
    return request.delete(HOME_URL + "/group", {
      token: auth_token,
      key: key,
    });
  },
  //设置默认执行者
  setLabelOrGroupExecutorKey(
    labelOrGroupKey: string | number,
    executorKey: any,
    type: number
  ) {
    return request.post(HOME_URL + "/card/setLabelOrGroupExecutorKey", {
      token: auth_token,
      labelOrGroupKey: labelOrGroupKey,
      executorKey: executorKey,
      type: type,
    });
  },
  //设置默认关注者
  setLabelOrGroupFollowUKeyArray(
    labelOrGroupKey: string | number,
    followUKeyArray: any,
    type: number
  ) {
    return request.post(HOME_URL + "/card/setLabelOrGroupFollowUKeyArray", {
      token: auth_token,
      labelOrGroupKey: labelOrGroupKey,
      followUKeyArray: followUKeyArray,
      type: type,
    });
  },
  //修改标签名
  setCardLabel(params: any) {
    return request.patch(HOME_URL + "/card/setLabelProperty", {
      token: auth_token,
      ...params,
    });
  },
  //获取项目标签
  getLabelInfo(groupKey: string) {
    return request.post(HOME_URL + "/group/getLabelInfo ", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  setLabelOrder(groupKey: string, labelOrder: any) {
    return request.post(HOME_URL + "/group/setLabelOrder ", {
      token: auth_token,
      groupKey: groupKey,
      labelOrder: labelOrder,
    });
  },
  getSonGroupList(fatherGroupKey: string) {
    return request.post(HOME_URL + "/group/getSonGroupListMultilayer", {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
    });
  },
  //设置子项目
  setSonGroup(fatherGroupKey: string, sonGroupKey: string) {
    return request.post(HOME_URL + "/group/setSonGroup", {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
      sonGroupKey: sonGroupKey,
    });
  },
  deleteFSGroup(fatherGroupKey: string, sonGroupKey: string) {
    return request.post(HOME_URL + "/group/deleteFSGroup", {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
      sonGroupKey: sonGroupKey,
    });
  },
  applyJoinGroupList(groupKey: string) {
    return request.post(HOME_URL + "/group/applyJoinGroupList", {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  //移除项目申请
  deleteApplyJoinGroup(applyJoinGroupKey: string) {
    return request.post(HOME_URL + "/group/deleteApplyJoinGroup", {
      token: auth_token,
      applyJoinGroupKey: applyJoinGroupKey,
    });
  },
  visitGroupOrFriend(type: number, targetUGKey: string) {
    return request.post(HOME_URL + "/group/visitGroupOrFriend", {
      token: auth_token,
      type: type,
      targetUGKey: targetUGKey,
    });
  },
  //获取创项目模板
  getTemplateTypeList() {
    return request.post(HOME_URL + "/group/getTemplateTypeList", {
      token: auth_token,
    });
  },

  getTemplateList(name: string, curPage: number) {
    return request.post(HOME_URL + "/group/getTemplateList", {
      token: auth_token,
      name: name,
      curPage: curPage,
      perPage: 9,
    });
  },
  getTemplateListAccordingType(curPage: number, type?: any) {
    return request.post(HOME_URL + "/group/getTemplateListAccordingType", {
      token: auth_token,
      type: type,
      curPage: curPage,
      perPage: 10,
    });
  },
  clickPersonNumber(templateKey: string) {
    return request.post(HOME_URL + "/group/clickPersonNumber", {
      token: auth_token,
      templateKey: templateKey,
    });
  },
  //添加模板
  addTemplate(patchData: any) {
    return request.post(HOME_URL + "/group/addTemplate", {
      token: auth_token,
      patchData: patchData,
    });
  },
  //审核消息处理
  changeAddMessage(
    targetUKey: string,
    groupKey: string,
    noticeKey: string,
    agreeOrReject: number,
    applyKey: string | number
  ) {
    return request.post(HOME_URL + "/group/agreeOrRejectApplyJoinGroup", {
      token: auth_token,
      targetUKey: targetUKey,
      groupKey: groupKey,
      noticeKey: noticeKey,
      agreeOrReject: agreeOrReject,
      applyKey: applyKey,
    });
  },
  cloneGroup(oldGroupKey: string, newGroupName: string) {
    return request.post(HOME_URL + "/group/cloneGroup_working", {
      token: auth_token,
      oldGroupKey: oldGroupKey,
      newGroupName: newGroupName,
    });
  },
  //企业项目列表
  getUserEnterpriseGroupList() {
    return request.post(HOME_URL + "/group/getUserEnterpriseGroupList", {
      token: auth_token,
    });
  },
  //更换项目管理
  groupOwnerChange(groupKey: string, targetUKey: string) {
    return request.patch(HOME_URL + "/group/groupOwnerChange", {
      token: auth_token,
      key: groupKey,
      targetUKey: targetUKey,
    });
  },
  setMainEnterpriseGroup(mainEnterpriseGroupKey: string) {
    return request.post(HOME_URL + "/group/setMainEnterpriseGroup ", {
      token: auth_token,
      mainEnterpriseGroupKey: mainEnterpriseGroupKey,
    });
  },
  getGroupProperty(groupKey: string, property: string) {
    return request.post(HOME_URL + "/group/getGroupProperty ", {
      token: auth_token,
      groupKey: groupKey,
      property: property,
    });
  },
  getCSGroupStatisticsInfo(customerServiceGroupKey: string) {
    return request.post(
      HOME_URL + "/customerService/getCSGroupStatisticsInfo ",
      {
        token: auth_token,
        customerServiceGroupKey: customerServiceGroupKey,
      }
    );
  },
  getCustomServiceList(
    customerServiceGroupKey: string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/customerService/getCustomServiceList ", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getCustomList(
    customerServiceGroupKey: string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/customerService/getCustomList", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  joinChatRoom(rocketChatGroupId: string) {
    return request.post(HOME_URL + "/customerService/joinChatRoom", {
      token: auth_token,
      rocketChatGroupId: rocketChatGroupId,
    });
  },
  getWorkOrderList(
    customerServiceGroupKey: string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + "/customerService/getWorkOrderList", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  setCustomService(
    customerServiceGroupKey: string,
    targetUKey: string,
    isCustomService: boolean
  ) {
    return request.post(HOME_URL + "/customerService/setCustomService ", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      targetUKey: targetUKey,
      isCustomService: isCustomService,
    });
  },
  getCustomInfo(customerServiceGroupKey: string, targetUKey: string) {
    return request.post(HOME_URL + "/customerService/getCustomInfo ", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      targetUKey: targetUKey,
    });
  },
  setCustomProperty(
    customerServiceGroupKey: string,
    targetUKey: string,
    patchData: any
  ) {
    return request.post(HOME_URL + "/customerService/setCustomProperty ", {
      token: auth_token,
      customerServiceGroupKey: customerServiceGroupKey,
      targetUKey: targetUKey,
      patchData: patchData,
    });
  },
};
const company = {
  addUser(groupKey: string, userInfoArray: any) {
    return request.post(AUTH_URL + "/account/batchAddWorkflyEnterpriseUser", {
      token: auth_token,
      groupKey: groupKey,
      userInfoArray: userInfoArray,
    });
  },
  addCompanyUser(enterpriseGroupKey: string, targetUidList: any) {
    return request.post(HOME_URL + "/groupmember/enterpriseImportRoster", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      targetUidList: targetUidList,
    });
  },
  getCompanyList(
    typeGroupOrOrg: number,
    enterpriseGroupOrOrganizationKey: string,
    curPage: number,
    perPage: number,
    searchCondition?: string,
    batchNumber?: string,
    currOrgKey?: any,
    isQuit?: number,
    sonGroupKey?: string
  ) {
    return request.post(
      HOME_URL + "/organization/getEnterpriseGroupOrOrganizationMemberList",
      {
        token: auth_token,
        typeGroupOrOrg: typeGroupOrOrg,
        enterpriseGroupOrOrganizationKey: enterpriseGroupOrOrganizationKey,
        curPage: curPage,
        perPage: perPage,
        searchCondition: searchCondition,
        batchNumber: batchNumber,
        currOrgKey: currOrgKey,
        isQuit: isQuit,
        sonGroupKey: sonGroupKey,
      }
    );
  },
  getCompanyGroupList(
    enterpriseGroupKey: string,
    curPage: number,
    perPage: number,
    isStatus: number,
    searchCondition?: string,
    currOrgKey?: any,
  ) {
    return request.post(HOME_URL + "/organization/getEnterpriseGroupList", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      curPage: curPage,
      perPage: perPage,
      searchCondition: searchCondition,
      isStatus: isStatus,
      currOrgKey: currOrgKey,
    });
  },
  getOrgGroupList(
    currOrgKey: string,
    curPage: number,
    perPage: number,
    searchCondition?: string,
    enterpriseGroupKey?: string
  ) {
    return request.post(HOME_URL + "/organization/getOrgGroupList", {
      token: auth_token,
      currOrgKey: currOrgKey,
      curPage: curPage,
      perPage: perPage,

      searchCondition: searchCondition,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  getCompanyMemberList(
    enterpriseGroupKey: string,
    targetUKey: string,
    role?: number
  ) {
    return request.post(HOME_URL + "/organization/getOrgMemberGroupRoleInfo", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      targetUKey: targetUKey,
      role: role ? role : 1,
    });
  },
  getOrganizationTree(params: any) {
    return request.post(HOME_URL + "/organization/getOrganizationTree", {
      token: auth_token,
      ...params,
    });
  },
  addSonOrganization(
    parentOrgKey: string,
    currOrgName: string,
    enterpriseGroupKey: string
  ) {
    return request.post(HOME_URL + "/organization/addSonOrganization", {
      token: auth_token,
      parentOrgKey: parentOrgKey,
      currOrgName: currOrgName,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  updateOrgOrStaffProperty(
    orgOrStaffType: number,
    orgOrStaffKey: string,
    patchData: any
  ) {
    return request.post(HOME_URL + "/organization/updateOrgOrStaffProperty", {
      token: auth_token,
      orgOrStaffType: orgOrStaffType,
      orgOrStaffKey: orgOrStaffKey,
      patchData: patchData,
    });
  },
  deleteOrgOrStaff(orgOrStarffKey: string) {
    return request.post(HOME_URL + "/organization/deleteOrgOrStaff", {
      token: auth_token,
      orgOrStarffKey: orgOrStarffKey,
    });
  },
  getLeaderGroupTree(enterpriseGroupKey: string) {
    return request.post(HOME_URL + "/organization/getLeaderGroupTree", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  searchStaff(enterpriseGroupKey: string, staffName: string) {
    return request.post(HOME_URL + "/organization/searchStaff", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      staffName: staffName,
    });
  },
  batchAddOrgStaff(
    currOrgKey: string,
    groupMemberKeyArray: any,
    enterpriseGroupKey: string
  ) {
    return request.post(HOME_URL + "/organization/batchAddOrgStaff", {
      token: auth_token,
      currOrgKey: currOrgKey,
      groupMemberKeyArray: groupMemberKeyArray,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  batchAddOrgGroup(
    currOrgKey: string,
    groupKeyArray: any,
    enterpriseGroupKey: string
  ) {
    return request.post(HOME_URL + "/organization/batchAddOrgGroup", {
      token: auth_token,
      currOrgKey: currOrgKey,
      groupKeyArray: groupKeyArray,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  deletePerson(targetUKey: string, enterpriseGroupKey: string) {
    return request.post(
      HOME_URL + "/organization/deleteFromEnterpriseGroupAndOrganization",
      {
        token: auth_token,
        targetUKey: targetUKey,
        enterpriseGroupKey: enterpriseGroupKey,
      }
    );
  },
  //修改项目成员属性
  updatePerson(params: any) {
    return request.post(HOME_URL + "/organization/updateRosterUserInfo", {
      token: auth_token,
      ...params,
    });
  },
  //树修改父子关系
  changeTreeCompanyRelation(params: any) {
    return request.post(HOME_URL + "/organization/switchFSOrg", {
      token: auth_token,
      ...params,
    });
  },
  //批次序号
  getBatchList(enterpriseGroupKey: string) {
    return request.post(
      HOME_URL + "/groupmember/getEnterpriseRosterBatchList",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
      }
    );
  },
  //删除批次
  deleteBatch(enterpriseGroupKey: string, batchNumber: string) {
    return request.post(HOME_URL + "/groupmember/batchDeleteEnterpriseRoster", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      batchNumber: batchNumber,
    });
  },
  //企业首页数据
  getEnterpriseGroupData(enterpriseGroupKey: string) {
    return request.post(
      HOME_URL + "/organization/getEnterpriseGroupHomePageNew",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
      }
    );
  },
  getEnterpriseGroupList(
    enterpriseGroupKey: string,
    isCare: number,
    curPage: number,
    perPage: number,
    sortType: number,
    sortOrder: number
  ) {
    return request.post(
      HOME_URL + "/organization/getEnterpriseGroupGroupRankingList",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
        isCare: isCare,
        curPage: curPage,
        perPage: perPage,
        sortType: sortType,
        sortOrder: sortOrder,
      }
    );
  },
  getEnterpriseMemberList(
    enterpriseGroupKey: string,
    isCare: number,
    curPage: number,
    perPage: number,
    sortType: number,
    sortOrder: number
  ) {
    return request.post(
      HOME_URL + "/organization/getEnterpriseGroupUserRankingList",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
        isCare: isCare,
        curPage: curPage,
        perPage: perPage,
        sortType: sortType,
        sortOrder: sortOrder,
      }
    );
  },
  getEnterpriseGroupEnergyValueList(
    enterpriseGroupKey: string,
    startTime: number,
    endTime: number,
    curPage: number,
    perPage: number,
    groupKey?: string,
    targetUKey?: string
  ) {
    return request.post(
      HOME_URL + "/cardLog/getEnterpriseGroupEnergyValueList ",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
        curPage: curPage,
        perPage: perPage,
        startTime: startTime,
        endTime: endTime,
        groupKey: groupKey,
        targetUKey: targetUKey,
      }
    );
  },
  clearVitality(enterpriseGroupKey: string) {
    return request.post(
      HOME_URL + "/organization/clearEnterpriseGroupMemberNegativeEnergyValue",
      {
        token: auth_token,
        enterpriseGroupKey: enterpriseGroupKey,
      }
    );
  },
  clearGroup(enterpriseGroupKey: string, targetUKey: string) {
    return request.post(HOME_URL + "/organization/quitEnterpriseGroup", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      targetUKey: targetUKey,
    });
  },
  batchSwitchFSOrg(params: any) {
    return request.post(HOME_URL + "/organization/batchSwitchFSOrg", {
      token: auth_token,
      ...params,
    });
  },
};
const okr = {
  getOKRPeriodList(enterpriseGroupKey: string) {
    return request.post(HOME_URL + "/okr/getOKRPeriodList", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  getHistoryOKRList(enterpriseGroupKey: string) {
    return request.post(HOME_URL + "/okr/getHistoryOKRList", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  createNextMonthPeriod(enterpriseGroupKey: string) {
    return request.post(HOME_URL + "/okr/createNextMonthPeriod", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
    });
  },
  getOKRUserList(enterpriseGroupKey: string, periodKey: string) {
    return request.post(HOME_URL + "/okr/getOKRUserList", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      periodKey: periodKey,
    });
  },
  createOKR(params: any) {
    return request.post(HOME_URL + "/okr/createOKR", {
      token: auth_token,
      ...params,
    });
  },
  getOKRDetail(
    enterpriseGroupKey: string,
    periodKey: string,
    targetUKey: string,
    type: number,
    currOKey?: string
  ) {
    return request.post(HOME_URL + "/okr/getOKRDetail", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      periodKey: periodKey,
      targetUKey: targetUKey,
      type: type,
      currOKey: currOKey,
    });
  },
  upAlign(oKey: string, upLevelOKey: string, upLevelKRKey: string) {
    return request.post(HOME_URL + "/okr/upAlign", {
      token: auth_token,
      oKey: oKey,
      upLevelOKey: upLevelOKey,
      upLevelKRKey: upLevelKRKey,
    });
  },
  getSingleOKRDetail(oKey: string) {
    return request.post(HOME_URL + "/okr/getSingleOKRDetail", {
      token: auth_token,
      oKey: oKey,
    });
  },
  setKRProperty(krKey: string, patchData: any) {
    return request.post(HOME_URL + "/okr/setKRProperty", {
      token: auth_token,
      krKey: krKey,
      patchData: patchData,
    });
  },
  createKR(oKey: string, krTitles: any) {
    return request.post(HOME_URL + "/okr/createKR", {
      token: auth_token,
      oKey: oKey,
      krTitles: krTitles,
    });
  },
  updateOnlyOProperty(
    oKey: string,
    upLevelOKey: string,
    upLevelKRKey: string,
    patchData: any
  ) {
    return request.post(HOME_URL + "/okr/updateOnlyOProperty", {
      token: auth_token,
      oKey: oKey,
      upLevelOKey: upLevelOKey,
      upLevelKRKey: upLevelKRKey,
      patchData: patchData,
    });
  },
  deleteKR(krKey: string) {
    return request.post(HOME_URL + "/okr/deleteKR", {
      token: auth_token,
      krKey: krKey,
    });
  },
  deleteO(oKey: string) {
    return request.post(HOME_URL + "/okr/deleteO", {
      token: auth_token,
      oKey: oKey,
    });
  },
  getKRTaskList(krKey: string) {
    return request.post(HOME_URL + "/okr/getKRTaskList", {
      token: auth_token,
      krKey: krKey,
    });
  },
  cancelUpAlign(oKey: string) {
    return request.post(HOME_URL + "/okr/cancelUpAlign", {
      token: auth_token,
      oKey: oKey,
    });
  },
  cancelKRDownAlign(oKey: string, krKey: string) {
    return request.post(HOME_URL + "/okr/cancelKRDownAlign", {
      token: auth_token,
      oKey: oKey,
      krKey: krKey,
    });
  },
  setOkrConfig(
    enterpriseGroupKey: string,
    monthLong: number,
    isOpenYear: number
  ) {
    return request.post(HOME_URL + "/okr/setOkrConfig", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      monthLong: monthLong,
      isOpenYear: isOpenYear,
    });
  },
  updateOOrKROrder(params) {
    return request.post(HOME_URL + "/okr/updateOOrKROrder", {
      token: auth_token,
      ...params,
    });
  },
  getOKRUserStatistics(
    enterpriseGroupKey: string,
    periodKey: string,
    targetUKey: string
  ) {
    return request.post(HOME_URL + "/okr/getOKRUserStatistics", {
      token: auth_token,
      enterpriseGroupKey: enterpriseGroupKey,
      periodKey: periodKey,
      targetUKey: targetUKey,
    });
  },
};
const thirdApi = {
  getThirdRandomPng(page: number) {
    return request.get("https://icondata.qingtime.cn/icon", {
      page: page,
      limit: 200,
      order: "asc",
      sortField: "createTime",
    });
  },
  searchThirdPng(page: number) {
    return request.post("https://icondata.qingtime.cn/icon", {
      page: page,
      limit: 20,
    });
  },
};
// eslint-disable-next-line
export default {
  common,
  auth,
  task,
  member,
  group,
  company,
  okr,
  thirdApi,
  ROCKET_CHAT_URL,
  SOCKET_URL,
};
