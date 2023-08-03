import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  // forwardRef,
  useCallback,
} from "react";
import "./taskInfo.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import {
  Input,
  Button,
  DatePicker,
  Modal,
  Tabs,
  Dropdown,
  Timeline,
  Tooltip,
} from "antd";
import { GlobalOutlined, SaveOutlined } from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";
import copy from "copy-to-clipboard";
import { useMount } from "../../hook/common";

import {
  getUploadToken,
  changeMusic,
  changeTaskState,
} from "../../redux/actions/authActions";
import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import {
  editTask,
  changeTaskInfoVisible,
  getWorkingTableTask,
  getGroupTask,
  setTaskInfo,
  changeDeleteState,
  changeDeleteKey,
} from "../../redux/actions/taskActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";

import { setGroupKey, changeStartId } from "../../redux/actions/groupActions";

import DropMenu from "../common/dropMenu";
import TaskMember from "../task/taskMember";
import Comment from "../comment/comment";
import TimeSet from "../common/timeSet";
import Editor from "../common/editor/editor";
import Loading from "../common/loading";
import CreateMoreTask from "../createMoreTask/createMoreTask";
import Avatar from "../common/avatar";
import Appendix from "../common/appendix";

import hourSvg from "../../assets/svg/hour.svg";
import unExecutorPng from "../../assets/img/unExecutor.png";
import taskFinishPng from "../../assets/svg/finishb.svg";
import taskUnfinishPng from "../../assets/svg/unfinishb.svg";
import taskClosePng from "../../assets/img/taskClose.png";
import ellipsisbPng from "../../assets/img/ellipsisb.png";
import timeline3Svg from "../../assets/svg/timeline3.svg";
import timeline4Svg from "../../assets/svg/timeline4.svg";
import timeline5Svg from "../../assets/svg/timeline5.svg";
import timeline8Svg from "../../assets/svg/timeline8.svg";
import timeline10Svg from "../../assets/svg/timeline10.svg";
import timeline11Svg from "../../assets/svg/timeline11.svg";
import timeline12Svg from "../../assets/svg/timeline12.svg";
import timeline13Svg from "../../assets/svg/timeline13.svg";
import timeline14Svg from "../../assets/svg/timeline14.svg";
import timeline23Svg from "../../assets/svg/timeline23.svg";
import timeline24Svg from "../../assets/svg/timeline24.svg";
import contactTree from "../../assets/svg/contactTreeb.svg";
import Empty from "../common/empty";
const { TextArea } = Input;
const { TabPane } = Tabs;
interface TaskInfoProps {
  fatherTaskItem?: any;
  onClose?: any;
  type?: string;
  ref: any;
}
declare var window: Window;
const TaskInfo: React.FC<TaskInfoProps> = React.forwardRef((prop, ref) => {
  const { onClose } = prop;
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const clickType = useTypedSelector((state) => state.auth.clickType);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const showComment = useTypedSelector((state) => state.task.showComment);
  const titleRef: React.RefObject<any> = useRef();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const user = useTypedSelector((state) => state.auth.user);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const [taskItem, setTaskItem] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState<any>("");
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [editRole, setEditRole] = useState(false);
  const [editState, setEditState] = useState(false);
  const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);

  const [taskHistoryTotal, setTaskHistoryTotal] = useState<any>(null);
  const [taskHistoryPage, setTaskHistoryPage] = useState(1);
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [taskCommentTotal, setTaskCommentTotal] = useState<any>(null);
  const [taskCommentPage, setTaskCommentPage] = useState(1);
  const [commentInput, setCommentInput] = useState("");
  const [hourVisible, setHourVisible] = useState(false);
  const [executorVisible, setExecutorVisible] = useState(false);
  const [ellipsisVisible, setEllipsisVisible] = useState(false);
  const [moveTaskVisible, setMoveTaskVisible] = useState(false);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [commentHeight, setCommentHeight] = useState("27px");
  const [moveTaskType, setMoveTaskType] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [content, setContent] = useState<any>(null);
  const [fileList, setFileList] = useState<any>([]);
  // const [imgFileList, setImgFileList] = useState<any>([]);
  const [activeKey, setActiveKey] = useState("1");
  // const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  // const [deleteIndex, setDeleteIndex] = useState<any>(0);
  const color = [
    "#6FD29A",
    "#21ABE4",
    "#F5A623",
    "#FB8444",
    "#FF5D5B",
    "#9F33FE",
  ];
  const backgroundColor = [
    "#DAF6E6",
    "#D8ECFF",
    "#FBE6C4",
    "#FFDDCC",
    "#FFE3DE",
    "#F3E5FF",
  ];
  const taskTypeArr = [
    { name: "建议", id: 1 },
    { name: "强烈建议", id: 2 },
    { name: "错误", id: 3 },
    { name: "严重错误", id: 4 },
    { name: "致命错误", id: 5 },
    { name: "顶级优先", id: 10 },
  ];
  const timelineArr = [
    { src: timeline3Svg, id: 3 },
    { src: timeline4Svg, id: 4 },
    { src: timeline5Svg, id: 5 },
    { src: timeline8Svg, id: 8 },
    { src: timeline10Svg, id: 10 },
    { src: timeline11Svg, id: 11 },
    { src: timeline12Svg, id: 12 },
    { src: timeline13Svg, id: 13 },
    { src: timeline14Svg, id: 14 },
    { src: timeline23Svg, id: 23 },
    { src: timeline24Svg, id: 24 },
  ];
  const taskLimit = 10;
  const taskInfoRef: React.RefObject<any> = useRef();
  const commentInputRef: React.RefObject<any> = useRef();

  let countRef = useRef<any>(null);
  let unDistory = useRef<any>(true);
  unDistory.current = true;
  useMount(() => {
    dispatch(getUploadToken());
    return () => {
      if (countRef.current) {
        clearInterval(countRef.current);
      }
    };
  });
  useEffect(() => {
    if (socketObj) {
      if (socketObj.data.type === "8") {
        let commentCardContent = socketObj.data.commentCardContent;
        commentCardContent.action = parseInt(commentCardContent.action);
        commentCardContent.createTime = parseInt(commentCardContent.createTime);
        commentCardContent.status = parseInt(commentCardContent.status);
        commentCardContent.updateTime = parseInt(commentCardContent.updateTime);
        setTaskCommentArray((prevTaskCommentArray) => {
          prevTaskCommentArray.push({ ...commentCardContent });
          return [...prevTaskCommentArray];
        });
        setTaskCommentTotal((prevTaskCommentTotal) => {
          return prevTaskCommentTotal++;
        });
      }
    }
  }, [socketObj]);
  useEffect(() => {
    if (activeKey === "2" && commentInputRef.current) {
      commentInputRef.current.focus();
    }
    //eslint-disable-next-line
  }, [activeKey, commentInputRef.current]);
  useEffect(() => {
    if (showComment && taskInfo && taskInfoVisible) {
      setActiveKey("2");
    }
  }, [showComment, taskInfo, taskInfoVisible]);
  const changeTaskInfo = useCallback(
    async (taskInfo: any) => {
      const taskTypeArr = [
        { name: "建议", id: 1 },
        { name: "强烈建议", id: 2 },
        { name: "错误", id: 3 },
        { name: "严重错误", id: 4 },
        { name: "致命错误", id: 5 },
        { name: "顶级优先", id: 10 },
      ];
      setStartDate(
        new Date(
          taskInfo.taskStartDate ? taskInfo.taskStartDate : taskInfo.taskEndDate
        )
      );
      setEndDate(new Date(taskInfo.taskEndDate));
      taskTypeArr.forEach((item: any, index: number) => {
        if (item.id === taskInfo.taskType) {
          setTaskTypeIndex(index);
        }
      });
      setEditRole(
        (taskInfo.groupRole && taskInfo.groupRole < 4) ||
          taskInfo.creatorKey === user._key ||
          taskInfo.executorKey === user._key
      );
      if (typeof taskInfo.content === "string") {
        setContent(taskInfo.content);
      } else {
        setContent(" ");
      }
      setTaskTitle(taskInfo.title);
      if (taskInfo.extraData) {
        if (taskInfo.extraData.url) {
          setUrlInput(taskInfo.extraData.url);
        }
        if (taskInfo.extraData.fileList) {
          setFileList(taskInfo.extraData.fileList);
        }
        // if (taskInfo.extraData.imgFileList) {
        //   setImgFileList(taskInfo.extraData.imgFileList);
        // }
      }
      // if (!type) {
      //   setLoading(true);
      //   let taskItemRes: any = await api.task.getTaskInfo(chooseKey);
      //   if (unDistory.current) {
      //     if (taskItemRes.msg === "OK") {
      //       setLoading(false);
      //       taskInfo.content = _.cloneDeep(taskItemRes.result).content;
      //       if (taskInfo.content) {
      //         setContent(taskInfo.content);
      //       } else {
      //         setContent("<p>备注信息</p>");
      //       }
      //       setTaskItem(taskInfo);
      //     } else {
      //       setLoading(false);
      //       dispatch(setMessage(true, taskItemRes.msg, "error"));
      //     }
      //   }
      // }
    },
    [user]
  );
  const getTaskItem = useCallback(
    async (chooseKey: string) => {
      setLoading(true);
      let taskItemRes: any = await api.task.getTaskInfo(chooseKey);
      if (unDistory.current) {
        if (taskItemRes.msg === "OK") {
          localStorage.removeItem("shareKey");
          let taskInfo = _.cloneDeep(taskItemRes.result);
          setLoading(false);
          changeTaskInfo(taskInfo);
          setTaskItem(taskInfo);
        } else {
          setLoading(false);
          dispatch(setMessage(true, taskItemRes.msg, "error"));
        }
      }
    },
    [dispatch, changeTaskInfo]
  );
  useEffect(() => {
    if ((chooseKey || taskInfo) && taskInfoVisible) {
      // if (!taskInfo || chooseKey !== taskInfo._key) {
      getTaskItem(chooseKey);
      // } else if (taskInfo) {
      //   changeTaskInfo(taskInfo, chooseKey);
      // }
    }
    //eslint-disable-next-line
  }, [chooseKey, taskInfoVisible, getTaskItem, changeTaskInfo, dispatch]);

  useImperativeHandle(ref, () => ({
    getInfo: () => {
      saveTaskInfo();
    },
  }));
  const getCommentList = useCallback(
    async (page: number, taskKey: string) => {
      let commentRes: any = await api.task.getTaskComment(
        taskKey,
        page,
        taskLimit
      );
      if (unDistory.current) {
        if (commentRes.msg === "OK") {
          setTaskCommentArray((prevCommentArray) => {
            if (page === 1) {
              prevCommentArray = [];
            }
            prevCommentArray.unshift(...commentRes.result);
            return [...prevCommentArray];
          });
          setTaskCommentTotal(commentRes.totalNumber);
        } else {
          dispatch(setMessage(true, commentRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );

  const getHistoryList = useCallback(
    async (page: number, taskKey: any) => {
      let historyRes: any = await api.task.getTaskHistory(
        taskKey,
        page,
        taskLimit,
        2
      );
      if (unDistory.current) {
        if (historyRes.msg === "OK") {
          setTaskHistoryArray((prevCommentArray) => {
            if (page === 1) {
              prevCommentArray = [];
            }
            prevCommentArray.push(...historyRes.result);
            return [...prevCommentArray];
          });
          setTaskHistoryTotal(historyRes.totalNumber);
        } else {
          dispatch(setMessage(true, historyRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (taskItem?._key) {
      if (activeKey === "1" || activeKey === "2") {
        getCommentList(1, taskItem._key);
      } else if (activeKey === "3") {
        getHistoryList(1, taskItem._key);
      }
    }
  }, [activeKey, getCommentList, getHistoryList, taskItem?._key]);
  const handleDateChange = (date: any, type: string) => {
    if (type === "start") {
      setStartDate(date);
      changeTaskItem("taskStartDate", date.valueOf());
    } else if ((type = "end")) {
      setEndDate(date);
      changeTaskItem("taskEndDate", date.valueOf());
    }
    setEditState(true);
  };
  //滚动加载
  const scrollCommentLoading = async (e: any) => {
    let page = taskCommentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      taskCommentArray.length < taskCommentTotal
    ) {
      page = page + 1;
      setTaskCommentPage(page);
      getCommentList(page, taskItem._key);
    }
  };
  const scrollHistoryLoading = async (e: any) => {
    let page = taskHistoryPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      taskHistoryArray.length < taskHistoryTotal
    ) {
      page = page + 1;
      setTaskHistoryPage(page);
      getHistoryList(page, taskItem._key);
    }
  };
  const changeInput = (e: any) => {
    setCommentInput(e.target.value);
    setEditState(true);
  };
  const changeTaskContent = (value: string) => {
    if (typeof value === "string") {
      setContent(value);
    } else {
      dispatch(setMessage(true, "内容无法保存,请重新输入内容", "error"));
      return;
    }
    changeTaskItem("content", value);
  };
  const changeTimeSet = (type: string, hour: number) => {
    changeTaskItem(type, hour);
  };
  const saveCommentMsg = async () => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    if (commentInput !== "") {
      //保存
      setButtonLoading(true);
      let saveRes: any = await api.task.addComment(taskItem._key, commentInput);
      if (saveRes.msg === "OK") {
        dispatch(setMessage(true, "评论成功", "success"));
        newCommentArray.push(saveRes.result);
        newCommentTotal = newCommentTotal + 1;
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(newCommentTotal);
        setCommentInput("");
        setButtonLoading(false);
      } else {
        setButtonLoading(false);
        dispatch(setMessage(true, saveRes.msg, "error"));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除评论成功", "success"));
      if (
        newCommentArray[commentIndex].userKey === taskItem.executorKey &&
        (newCommentArray[commentIndex].content === "同意" ||
          newCommentArray[commentIndex].content === "拒绝")
      ) {
        changeAuditStatus(1);
      }
      newCommentArray.splice(commentIndex, 1);
      newCommentTotal = newCommentTotal - 1;
      setTaskCommentArray(newCommentArray);
      setTaskCommentTotal(newCommentTotal);
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    dispatch(changeTaskInfoVisible(false));
    if (onClose) {
      onClose();
    }
    let deleteRes: any = await api.task.deleteTask(
      taskItem._key,
      taskItem.groupKey
    );
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除成功", "success"));
      if (
        targetUserInfo &&
        targetUserInfo._key &&
        (headerIndex === 2 || clickType === "self")
      ) {
        setLoading(true);
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10],
            1
          )
        );
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10],
            2
          )
        );
      } else if (headerIndex === 1 && clickType !== "self") {
        setLoading(true);
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10], 1));
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10], 2));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      }
      dispatch(changeDeleteState(true));
      dispatch(changeDeleteKey(taskItem._key));
      dispatch(
        changeTaskState({
          key: taskItem._key,
          type: "del",
          targetKey: taskItem.parentCardKey,
          state:taskItem.finishPercent,
        })
      );
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const changeTaskItem = (type: string, value: any) => {
    setEditState(true);
    setTaskItem((prevTaskItem) => {
      prevTaskItem[type] = _.cloneDeep(value);
      if (type === "finishPercent" && value === 1) {
        prevTaskItem.taskEndDate = moment().valueOf();
      }
      if (
        type === "content" &&
        value.trim() !== "" &&
        value !== "<p>&nbsp;</p>" &&
        value.indexOf("备注信息") === -1
      ) {
        prevTaskItem.hasContent = true;
      } else if (
        type === "content" &&
        (value.trim() === "" ||
          value === "<p>&nbsp;</p>" ||
          value === "备注信息")
      ) {
        prevTaskItem.hasContent = false;
      }
      return { ...prevTaskItem };
    });
  };
  // const formatHour = (formatTime: number) => {
  //   let hours = parseInt(
  //     (formatTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + ''
  //   );
  //   let minutes = parseInt((formatTime % (1000 * 60 * 60)) / (1000 * 60) + '');
  //   let seconds = parseInt((formatTime % (1000 * 60)) / 1000 + '');
  //   return addZero(hours) + ' : ' + addZero(minutes) + ' : ' + addZero(seconds);
  // };
  // const addZero = (num: number) => {
  //   return num > 9 ? num + '' : '0' + num;
  // };
  const shareTask = () => {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    copy(
      redirect +
        "/home/showPage?shareKey=" +
        (chooseKey ? chooseKey : taskItem._key) +
        "&showType=1"
    );
    dispatch(setMessage(true, "复制链接任务成功", "success"));
  };
  // const getLabelArray = async (groupKey: string) => {
  //   let newLabelArray = [
  //     { _key: null, cardLabelName: 'ToDo', executorKey: user._key },
  //   ];
  //   let labelRes: any = await api.group.getLabelInfo(groupKey);
  //   if (labelRes.msg === 'OK') {
  //     newLabelArray.push(...labelRes.result);
  //     setLabelArray(newLabelArray);
  //   } else {
  //     dispatch(setMessage(true, labelRes.msg, 'error'));
  //   }
  // };
  const changeAuditStatus = async (auditStatus: number) => {
    let newTaskItem = _.cloneDeep(taskItem);
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    let commentInput = "";
    if (newTaskItem) {
      if (!newTaskItem.extraData) {
        newTaskItem.extraData = {};
      }
      newTaskItem.extraData.auditStatus = auditStatus;
      dispatch(setTaskInfo(newTaskItem));
      dispatch(
        editTask({ key: newTaskItem._key, ...newTaskItem }, headerIndex)
      );
      if (auditStatus === 2 || auditStatus === 3) {
        commentInput = auditStatus === 2 ? "同意" : "拒绝";
        let saveRes: any = await api.task.addComment(
          taskItem._key,
          commentInput
        );
        if (saveRes.msg === "OK") {
          dispatch(setMessage(true, "审核成功", "success"));
          newCommentArray.push(saveRes.result);
          newCommentTotal = newCommentTotal + 1;
          setTaskCommentArray(newCommentArray);
          setTaskCommentTotal(newCommentTotal);
          setCommentInput("");
        } else {
          dispatch(setMessage(true, saveRes.msg, "error"));
        }
      }
    }
  };
  const saveTaskInfo = (msg?: string) => {
    if (!editRole && taskItem && editState) {
      dispatch(
        setMessage(true, "无编辑权限,请提升权限或加入对应项目", "error")
      );
      return;
    }
    let newTaskItem = _.cloneDeep(taskItem);
    if (newTaskItem) {
      if (!newTaskItem.extraData) {
        newTaskItem.extraData = {};
      }
      if (!taskTitle) {
        setMessage(true, "请输入任务标题", "error");
      } else {
        newTaskItem.title = taskTitle;
      }
      if (urlInput) {
        if (urlInput.includes("http://") || urlInput.includes("https://")) {
          newTaskItem.extraData.url = urlInput;
        } else {
          newTaskItem.extraData.url = `https://${urlInput}`;
        }
      }
      if (
        JSON.stringify(fileList) !==
        JSON.stringify(newTaskItem.extraData.fileList)
      ) {
        newTaskItem.extraData.fileList = [...fileList];
      }
      dispatch(setTaskInfo(newTaskItem));
      if (onClose) {
        onClose();
      }
      if (editState) {
        dispatch(
          editTask({ key: newTaskItem._key, ...newTaskItem }, headerIndex)
        );
      }
    }
    if (msg) {
      dispatch(setMessage(true, "保存成功", "success"));
    } else {
      dispatch(changeTaskInfoVisible(false));
    }
  };

  const suggestMenu = (
    <div className="dropDown-box" style={{ padding: "0px", width: "80px" }}>
      {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
        return (
          <div
            key={"taskType" + taskTypeIndex}
            className="taskInfo-item-suggest-item"
            style={{
              color: color[taskTypeIndex],
              backgroundColor: backgroundColor[taskTypeIndex],
            }}
            onClick={() => {
              setTaskTypeIndex(taskTypeIndex);
              changeTaskItem("taskType", taskTypeItem.id);
            }}
          >
            {taskTypeItem.name}
          </div>
        );
      })}
    </div>
  );
  const changeMember = (info) => {
    let newTaskItem = _.cloneDeep(taskItem);
    newTaskItem.executorAvatar = info.executorAvatar;
    newTaskItem.executorName = info.executorName;
    newTaskItem.executorKey = info.executorKey;
    setTaskItem(newTaskItem);
  };
  return (
    // changeTaskInfoVisible
    <div className="taskInfo" id="taskInfo">
      {loading ? <Loading loadingHeight="90px" loadingWidth="90px" /> : null}
      {taskItem ? (
        <React.Fragment>
          <div className="taskInfo-container" ref={taskInfoRef}>
            <div className="taskInfo-mainTitle">
              <div className="taskInfo-mainTitle-left">
                {taskItem.finishPercent === 0 ? (
                  <img
                    src={taskUnfinishPng}
                    alt=""
                    className="taskInfo-mainTitle-left-icon"
                    onClick={() => {
                      changeTaskItem("finishPercent", 1);
                    }}
                  />
                ) : taskItem.finishPercent === 1 ? (
                  <img
                    src={taskFinishPng}
                    alt=""
                    className="taskInfo-mainTitle-left-icon"
                    onClick={() => {
                      changeTaskItem("finishPercent", 0);
                      // changeTaskItem('todayTaskTime', 0);
                    }}
                  />
                ) : null}

                <div
                  className="taskInfo-mainTitle-left-info"
                  onClick={() => {
                    setExecutorVisible(true);
                  }}
                >
                  <div className="taskInfo-mainTitle-left-avatar">
                    <img
                      src={
                        taskItem.executorAvatar
                          ? taskItem.executorAvatar +
                            "?imageMogr2/auto-orient/thumbnail/80x"
                          : unExecutorPng
                      }
                      alt=""
                    />
                  </div>
                  <div className="toLong" style={{ width: "100px" }}>
                    {taskItem.executorName ? taskItem.executorName : "未分配"}
                  </div>

                  <DropMenu
                    visible={executorVisible}
                    dropStyle={{
                      width: "300px",
                      height: "500px",
                      top: "50px",
                      left: "0px",
                    }}
                    onClose={() => {
                      setExecutorVisible(false);
                    }}
                    title={"分配任务"}
                  >
                    <TaskMember
                      showMemberVisible={true}
                      changeMember={changeMember}
                    />
                  </DropMenu>
                </div>
              </div>
              <div className="taskInfo-mainTitle-right">
                {taskItem &&
                (!taskItem.extraData || !taskItem.extraData.auditStatus) &&
                taskItem.executorKey !== taskItem.creatorKey &&
                taskItem.creatorKey === userKey ? (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      changeAuditStatus(1);
                    }}
                  >
                    申请审核
                  </Button>
                ) : null}

                {taskItem.extraData && taskItem.extraData.auditStatus ? (
                  <React.Fragment>
                    {taskItem.extraData.auditStatus === 1 &&
                    taskItem.creatorKey === user._key ? (
                      <Button size="small">待审核</Button>
                    ) : null}
                    {/* {taskItem.extraData.auditStatus === 2 &&
                      taskItem.creatorKey === user._key ? (
                      <Button
                        type="text"
                        size="small"
                        style={{ marginRight: "7px" }}
                      >
                        已同意
                      </Button>
                    ) : null}
                    {taskItem.extraData.auditStatus === 3 &&
                      taskItem.creatorKey === user._key ? (
                      <Button danger size="small" type="text">
                        已拒绝
                      </Button>
                    ) : null} */}
                    {/* {(taskItem.extraData.auditStatus === 2 ||
                      taskItem.extraData.auditStatus === 3) &&
                      taskItem.executorKey === user._key ? (
                      <Button
                        size="small"
                        onClick={() => {
                          changeAuditStatus(1);
                        }}
                      >
                        重新审核
                      </Button>
                    ) : null} */}
                  </React.Fragment>
                ) : null}
                <Dropdown overlay={suggestMenu}>
                  <div
                    className="taskInfo-item-suggest"
                    style={{
                      color: color[taskTypeIndex],
                      backgroundColor: backgroundColor[taskTypeIndex],
                    }}
                  >
                    {taskTypeArr[taskTypeIndex].name}
                  </div>
                </Dropdown>
                <div
                  className="taskInfo-mainTitle-right-icon"
                  onClick={() => {
                    setEllipsisVisible(true);
                    setMoveTaskVisible(false);
                  }}
                >
                  <img
                    src={ellipsisbPng}
                    alt="详情"
                    style={{ width: "12px", height: "2px" }}
                  />
                  <DropMenu
                    visible={ellipsisVisible}
                    dropStyle={{
                      width: "120px",
                      top: "45px",
                      left: "-88px",
                    }}
                    onClose={() => {
                      setEllipsisVisible(false);
                    }}
                  >
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        shareTask();
                      }}
                    >
                      分享任务
                    </div>
                    {taskItem.type === 2 &&
                    editRole &&
                    taskItem.groupRole !== 5 ? (
                      <React.Fragment>
                        <div
                          className="dropMenu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoveTaskVisible(true);
                            setMoveTaskType("复制");
                          }}
                        >
                          复制任务
                        </div>
                        {taskItem.creatorKey === userKey ? (
                          <div
                            className="dropMenu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoveTaskVisible(true);
                              setMoveTaskType("移动");
                            }}
                          >
                            移动任务
                          </div>
                        ) : null}
                      </React.Fragment>
                    ) : null}
                    {editRole && taskItem.groupRole !== 5 ? (
                      <div
                        className="dropMenu-item"
                        onClick={() => {
                          if (taskItem.finishPercent < 2) {
                            dispatch(changeMusic(10));
                          }
                          changeTaskItem(
                            "finishPercent",
                            taskItem.finishPercent < 2 ? 2 : 1
                          );
                        }}
                      >
                        {taskItem.finishPercent < 2 ? "归档" : "取消归档"}
                      </div>
                    ) : null}
                    {/* <div
                    className="dropMenu-item"
                    onClick={() => {
                      changeTaskItem(
                        'importantStatus',
                        taskItem.importantStatus ? 0 : 1
                      );
                    }}
                  >
                    {!taskItem.importantStatus ? '设为重要' : '取消重要'}
                  </div> */}
                    {editRole &&
                    taskInfo?.groupRole !== 5 &&
                    !(headerIndex === 3 && memberHeaderIndex === 3) ? (
                      <div
                        className="dropMenu-item"
                        onClick={() => {
                          setDeleteDialogShow(true);
                        }}
                      >
                        删除任务
                      </div>
                    ) : null}
                    <CreateMoreTask
                      visible={moveTaskVisible}
                      createStyle={{
                        position: "fixed",
                        top: "129px",
                        right: "120px",
                        zIndex: 20,
                        color: "#333",
                      }}
                      onClose={() => {
                        setMoveTaskVisible(false);
                        setDeleteDialogShow(false);
                        dispatch(changeTaskInfoVisible(false));
                      }}
                      moreTitle={taskItem.title}
                      moveTaskType={moveTaskType}
                      taskKey={taskItem._key}
                      taskItem={taskItem}
                    />
                  </DropMenu>
                </div>
                <div className="taskInfo-mainTitle-right-icon">
                  <img
                    src={taskClosePng}
                    alt=""
                    style={{ width: "12px", height: "12px" }}
                    onClick={() => {
                      saveTaskInfo();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* <div
              className="taskInfo-title"
              // onChange={(e: any) => {
              //   setEditState(true);
              //   changeTaskItem('title', e.target.value);
              // }}
              contentEditable
              suppressContentEditableWarning
              // onKeyUp={(e: any) => {
              //   if (e.target.innerText != taskItem.title) {
              //     setEditState(true);
              //   }
              // }}
              onBlur={(e: any) => {
                if (e.target.innerText !== taskItem.title) {
                  changeTaskItem("title", e.target.innerText);
                }
                // setEditState(true);
              }}
              ref={titleRef}
            >
              {taskItem.title}
            </div> */}
            <TextArea
              value={taskTitle}
              className="taskInfo-title"
              autoSize={{ minRows: 1 }}
              placeholder="请输入任务名"
              onChange={(e: any) => {
                // if (e.target.value !== taskItem.title) {
                // changeTaskItem("title", e.target.value);
                setTaskTitle(e.target.value);
                changeTaskItem("title", e.target.value);
                // }
                // setEditState(true);
              }}
              onFocus={() => {
                changeTaskItem("title", taskTitle);
              }}
              ref={titleRef}
            />
            {headerIndex !== 3 ? (
              <div
                className="taskInfo-path-item"
                // style={{
                //   backgroundColor:
                //     taskDetail.finishPercent !== 0 || bottomtype
                //       ? 'transparent'
                //       : '#e0e0e0',
                // }}
              >
                <Avatar
                  avatar={taskItem.groupLogo}
                  name={taskItem.groupName}
                  type={"group"}
                  index={0}
                  size={18}
                />
                <div
                  style={{
                    marginLeft: "5px",
                    color: "#A1ACB7",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(setGroupKey(taskItem.groupKey));
                    dispatch(setCommonHeaderIndex(3));
                    dispatch(changeStartId(""));
                  }}
                >
                  {taskItem.groupName}
                </div>
              </div>
            ) : null}
            {taskItem.path1 && (taskItem.type === 6 || taskItem.type === 1) ? (
              <div
                className="taskInfo-path-item"
                // style={{
                //   backgroundColor:
                //     taskDetail.finishPercent !== 0 || bottomtype
                //       ? 'transparent'
                //       : '#e0e0e0',
                // }}
              >
                <img
                  src={contactTree}
                  alt=""
                  style={{
                    width: "9px",
                    height: "9px",
                    marginRight: "5px",
                  }}
                ></img>
                <div className="taskInfo-path" style={{ color: "#A1ACB7" }}>
                  {taskItem.path1.map((pathItem: any, pathIndex: number) => {
                    return (
                      <React.Fragment key={"path" + pathIndex}>
                        <span
                          onClick={async () => {
                            if (headerIndex === 3) {
                              // dispatch(changeStartId(pathItem._key));
                              let newGroupMemberItem = { ...groupMemberItem };
                              newGroupMemberItem.config.treeStartId =
                                pathItem._key;
                              await api.member.setConfig(
                                newGroupMemberItem._key,
                                newGroupMemberItem.config
                              );
                              dispatch(setHeaderIndex(3));
                            }
                          }}
                        >
                          {pathIndex === 0
                            ? pathItem.title
                            : "/" + pathItem.title}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {taskItem.taskEndDate !== 99999999999999 ? (
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">日期 </div>
                <div
                  className="taskInfo-item-info"
                  style={{ justifyContent: "flex-start" }}
                >
                  <DatePicker
                    value={moment(startDate)}
                    onChange={(date: any) => {
                      handleDateChange(date, "start");
                    }}
                    style={{ width: "130px", marginRight: "10px" }}
                    allowClear={false}
                  />
                  <DatePicker
                    value={moment(endDate)}
                    onChange={(date: any) => {
                      handleDateChange(date, "end");
                    }}
                    style={{ width: "130px", marginRight: "10px" }}
                    allowClear={false}
                  />
                  {theme.hourVisible ? (
                    <div
                      className="taskInfo-item-hour"
                      onClick={() => {
                        setHourVisible(true);
                      }}
                    >
                      <img src={hourSvg} alt="" />
                      {/* {taskItem.hour ? taskItem.hour + ' 小时' : '预计工时'} */}
                      <DropMenu
                        visible={hourVisible}
                        dropStyle={{ top: "36px", left: "-200px" }}
                        onClose={() => {
                          setHourVisible(false);
                        }}
                        title="预计工时"
                      >
                        <TimeSet
                          timeSetClick={changeTimeSet}
                          timestate={"hour"}
                          dayNumber={0}
                          timeNumber={taskItem.hour}
                        />
                      </DropMenu>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="taskInfo-item">
              <div className="taskInfo-item-title">链接</div>
              <Input
                className="taskInfo-item-input"
                value={urlInput}
                onChange={(e: any) => {
                  setUrlInput(e.target.value);
                  setEditState(true);
                }}
                placeholder="请输入链接地址"
              />
              <div
                className="taskInfo-item-url"
                onClick={() => {
                  let url = "";
                  if (
                    urlInput.includes("http://") ||
                    urlInput.includes("https://")
                  ) {
                    url = urlInput;
                  } else {
                    url = `https://${urlInput}`;
                  }
                  window.open(url);
                }}
              >
                {" "}
                <GlobalOutlined />
              </div>
            </div>
            <div className="taskInfo-auto-item">
              <div className="taskInfo-item-title">附件</div>
              <div className="taskInfo-item-info">
                <Appendix
                  fileList={fileList}
                  setFileList={setFileList}
                  cardKey={taskItem._key}
                  groupKey={taskItem.groupKey}
                />
              </div>
            </div>
            {/* <div className="taskInfo-auto-item">
              <div className="taskInfo-item-title">详图</div>
              <div className="taskInfo-item-img-info">
                <Image.PreviewGroup>
                  {imgFileList.map((imgFileItem, imgFileIndex) => {
                    return (
                      <div className="taskInfo-item-img-preview">
                        <Image
                          width={70}
                          height={70}
                          src={imgFileItem}
                          key={"imgFileList" + imgFileIndex}
                          // placeholder={
                          //   <Image
                          //     preview={false}
                          //     src={imgFileItem}
                          //     width={70}
                          //     height={70}
                          //   />
                          // }
                        />
                        <div
                          className="taskInfo-item-img-delete"
                          onClick={() => {
                            setDeleteIndex(imgFileIndex);
                            setDeleteVisible(true);
                          }}
                        >
                          <CloseCircleOutlined
                            style={{ fontSize: "25px", color: "#fff" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Image.PreviewGroup>
              </div>
            </div> */}
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onChange={(activeKey) => {
                setActiveKey(activeKey);
              }}
            >
              <TabPane tab="备注" key="1">
                {content !== null ? (
                  <div style={{ position: "relative" }}>
                    <Tooltip title="保存">
                      <Button
                        type="primary"
                        size="large"
                        shape="circle"
                        style={{
                          border: "0px",
                          position: "absolute",
                          right: "10px",
                          top: "38px",
                          zIndex: 50,
                        }}
                        icon={
                          <SaveOutlined
                            style={{ fontSize: "18px", color: "#fff" }}
                          />
                        }
                        onClick={() => {
                          saveTaskInfo("msg");
                        }}
                      />
                    </Tooltip>
                    <Editor
                      data={content}
                      height={document.body.offsetHeight - 390}
                      onChange={changeTaskContent}
                      editorKey={taskItem._key}
                      // setImgFileList={setImgFileList}
                      cardKey={taskItem._key}
                    />
                  </div>
                ) : null}
              </TabPane>
              <TabPane
                tab={"评论(" + (taskCommentTotal ? taskCommentTotal : 0) + ")"}
                key="2"
              >
                <div
                  className="taskInfo-comment-tab"
                  onScroll={scrollCommentLoading}
                >
                  {taskCommentArray.map(
                    (commentItem: any, commentIndex: number) => {
                      return (
                        <Comment
                          commentItem={commentItem}
                          commentIndex={commentIndex}
                          key={"comment" + commentIndex}
                          commentClick={deleteCommentMsg}
                        />
                      );
                    }
                  )}
                </div>
              </TabPane>
              <TabPane tab="历史" key="3">
                <div
                  className="taskInfo-comment-tab"
                  onScroll={scrollHistoryLoading}
                >
                  {taskHistoryArray.map(
                    (historyItem: any, historyIndex: number) => {
                      let historySrc = _.findIndex(timelineArr, {
                        id: historyItem.logType,
                      });
                      return (
                        <Timeline key={"timeline" + historyIndex}>
                          <Timeline.Item
                            dot={
                              <img
                                style={{ width: "15px", height: "15px" }}
                                src={timelineArr[historySrc]?.src}
                                alt=""
                              />
                            }
                          >
                            <div className="taskInfo-comment-historyLog">
                              <div className="taskInfo-comment-title">
                                <Avatar
                                  avatar={historyItem?.etc?.avatar}
                                  name={historyItem?.etc?.nickName}
                                  type={"person"}
                                  index={historyIndex}
                                  size={18}
                                />
                                <div
                                  style={{
                                    fontSize: "14px",
                                    color: "#333",
                                    marginLeft: "5px",
                                    width: "calc(100% - 20px)",
                                  }}
                                >
                                  {historyItem.log}
                                </div>
                              </div>
                              {moment(
                                moment().valueOf() -
                                  parseInt(historyItem.createTime) >
                                  0
                                  ? parseInt(historyItem.createTime)
                                  : moment().valueOf() - 3000
                              ).format("MM-DD HH:mm")}
                            </div>
                          </Timeline.Item>
                        </Timeline>
                      );
                    }
                  )}
                </div>
              </TabPane>
            </Tabs>
            <div
              className="taskInfo-comment-input"
              style={{
                width: taskInfoRef.current
                  ? taskInfoRef.current.offsetWidth + 6
                  : 0,
              }}
            >
              <TextArea
                placeholder="评论"
                onChange={changeInput}
                value={commentInput}
                style={{ height: commentHeight, width: "calc(100% - 66px)" }}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    saveCommentMsg();
                  }
                }}
                onFocus={() => {
                  setActiveKey("2");
                  setCommentHeight("70px");
                }}
                onBlur={() => {
                  // setActiveKey("2");
                  setCommentHeight("27px");
                }}
                ref={commentInputRef}
              />
              {/* {commentInput ? ( */}
              <Button
                loading={buttonLoading}
                type="primary"
                onClick={() => {
                  saveCommentMsg();
                }}
              >
                发布
              </Button>
              {/* ) : null} */}
            </div>
            {/* <div className="comment-button">
              <Badge
                count={taskCommentTotal}
                style={{ backgroundColor: "#1890ff" }}
                offset={[-6, 6]}
              >
                <Button
                  type="primary"
                  size="large"
                  shape="circle"
                  icon={<IconFont type="icon-pinglun" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentVisible(true);
                    getHistoryList(1, taskItem);
                    getCommentList(1, taskItem);
                  }}
                />
              </Badge>
            </div> */}
            <Modal
              visible={deleteDialogShow}
              onCancel={() => {
                setDeleteDialogShow(false);
              }}
              onOk={() => {
                deleteTask();
              }}
              title={"删除任务"}
            >
              是否删除该任务
            </Modal>
            {/* <Modal
              visible={deleteVisible}
              title={"删除附件"}
              onOk={() => {
                setImgFileList((prevImgFileList) => {
                  prevImgFileList.splice(deleteIndex, 1);
                  return [...prevImgFileList];
                });
                // changeFileList(newFileList);
                setDeleteVisible(false);
              }}
              onCancel={() => {
                setDeleteVisible(false);
              }}
            >
              是否删除该详图
            </Modal> */}
          </div>
        </React.Fragment>
      ) : (
        <Empty />
      )}
    </div>
  );
});
TaskInfo.defaultProps = {
  fatherTaskItem: null,
};
export default TaskInfo;
