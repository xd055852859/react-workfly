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
import { Input, Button, DatePicker, Modal, Badge, Tabs, Dropdown } from "antd";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";
import copy from "copy-to-clipboard";
import { useMount } from "../../hook/common";

import { getUploadToken } from "../../redux/actions/authActions";
import { setMessage } from "../../redux/actions/commonActions";
import {
  editTask,
  changeTaskInfoVisible,
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
  setTaskInfo,
} from "../../redux/actions/taskActions";

import IconFont from "../../components/common/iconFont";
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

const { TabPane } = Tabs;
interface TaskInfoProps {
  fatherTaskItem?: any;
  onClose?: any;
  type?: string;
  ref: any;
}

const TaskInfo: React.FC<TaskInfoProps> = React.forwardRef((prop, ref) => {
  const { onClose } = prop;
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const theme = useTypedSelector((state) => state.auth.theme);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);

  const titleRef: React.RefObject<any> = useRef();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const user = useTypedSelector((state) => state.auth.user);
  const [taskItem, setTaskItem] = useState<any>(null);
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
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [hourVisible, setHourVisible] = useState(false);
  const [executorVisible, setExecutorVisible] = useState(false);
  const [ellipsisVisible, setEllipsisVisible] = useState(false);
  const [moveTaskVisible, setMoveTaskVisible] = useState(false);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [moveTaskType, setMoveTaskType] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [content, setContent] = useState<any>(null);
  const [fileList, setFileList] = useState<any>([]);
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
    if (commentVisible) {
      commentInputRef.current.focus();
    }
  }, [commentVisible]);
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
        (taskInfo.groupRole &&
          taskInfo.groupRole > 0 &&
          taskInfo.groupRole < 4) ||
          taskInfo.creatorKey === user._key ||
          taskInfo.executorKey === user._key
      );
      if (taskInfo.content) {
        setContent(taskInfo.content);
      } else {
        setContent("<p>备注信息</p>");
      }
      if (taskInfo.extraData) {
        if (taskInfo.extraData.url) {
          setUrlInput(taskInfo.extraData.url);
        }
        if (taskInfo.extraData.fileList) {
          setFileList(taskInfo.extraData.fileList);
        }
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
  }, [chooseKey, taskInfo, taskInfoVisible, getTaskItem, changeTaskInfo]);

  useImperativeHandle(ref, () => ({
    getInfo: () => {
      saveTaskInfo();
    },
  }));

  const getCommentList = async (page: number, taskInfo: any) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    if (page === 1) {
      newCommentArray = [];
    }
    let commentRes: any = await api.task.getTaskComment(
      taskInfo._key,
      page,
      taskLimit
    );
    if (unDistory.current) {
      if (commentRes.msg === "OK") {
        newCommentArray.push(...commentRes.result);
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(commentRes.totalNumber);
      } else {
        dispatch(setMessage(true, commentRes.msg, "error"));
      }
    }
  };

  const getHistoryList = async (page: number, taskInfo: any) => {
    let newHistoryArray = _.cloneDeep(taskHistoryArray);
    if (page === 1) {
      newHistoryArray = [];
    }
    let historyRes: any = await api.task.getTaskHistory(
      taskInfo._key,
      page,
      taskLimit
    );
    if (unDistory.current) {
      if (historyRes.msg === "OK") {
        newHistoryArray.push(...historyRes.result);
        setTaskHistoryArray(newHistoryArray);
        setTaskHistoryTotal(historyRes.totalNumber);
      } else {
        dispatch(setMessage(true, historyRes.msg, "error"));
      }
    }
  };
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
      getCommentList(page, taskItem);
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
      getHistoryList(page, taskItem);
    }
  };
  const changeInput = (e: any) => {
    setCommentInput(e.target.value);
    setEditState(true);
  };
  const changeTaskContent = (value: string) => {
    if (value) {
      setContent(value);
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
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, "[0, 1]"));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            targetUserInfo._key === user._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      }
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const changeTaskItem = (type: string, value: any) => {
    let newTaskItem: any = _.cloneDeep(taskItem);
    newTaskItem[type] = value;
    if (type === "finishPercent" && value === 1) {
      newTaskItem.taskEndDate = moment().valueOf();
    }
    if (type === "content" && value !== "") {
      newTaskItem.hasContent = true;
    }
    setEditState(true);
    setTaskItem(newTaskItem);
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
  const saveTaskInfo = () => {
    if (!editRole) {
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
      if (urlInput) {
        if (urlInput.includes("http://") || urlInput.includes("https://")) {
          newTaskItem.extraData.url = urlInput;
        } else {
          newTaskItem.extraData.url = `https://${urlInput}`;
        }
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
    dispatch(changeTaskInfoVisible(false));
  };
  const changeFileList = (fileList: any) => {
    let newTaskItem: any = _.cloneDeep(taskItem);
    if (!newTaskItem.extraData) {
      newTaskItem.extraData = {};
    }
    newTaskItem.extraData.fileList = fileList;
    setFileList(fileList);
    changeTaskItem("extraData", newTaskItem.extraData);
  };
  const suggestMenu = (
    <div className="dropDown-box" style={{padding:'0px',width:'80px'}}>
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
              setSuggestVisible(false);
            }}
          >
            {taskTypeItem.name}
          </div>
        );
      })}
    </div>
  );
  return (
    // changeTaskInfoVisible
    <div
      className="taskInfo"
      id="taskInfo"
      onClick={() => {
        setCommentVisible(false);
      }}
    >
      {loading ? <Loading loadingHeight="90px" loadingWidth="90px" /> : null}
      {taskItem ? (
        <React.Fragment>
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
                <div>
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
                  <TaskMember showMemberVisible={true} />
                </DropMenu>
              </div>
            </div>

            <div className="taskInfo-mainTitle-right">
              {taskItem &&
              (!taskItem.extraData || !taskItem.extraData.auditStatus) &&
              taskItem.executorKey !== taskItem.creatorKey &&
              taskItem.creatorKey === user._key ? (
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
                  {taskItem.extraData.auditStatus === 2 &&
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
                  ) : null}
                  {taskItem.extraData.auditStatus === 1 &&
                  taskItem.executorKey === user._key &&
                  taskItem.creatorKey !== user._key ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        changeAuditStatus(2);
                      }}
                      style={{ marginRight: "7px" }}
                    >
                      同意
                    </Button>
                  ) : null}
                  {taskItem.extraData.auditStatus === 1 &&
                  taskItem.executorKey === user._key &&
                  taskItem.creatorKey !== user._key ? (
                    <Button
                      danger
                      type="primary"
                      size="small"
                      onClick={() => {
                        changeAuditStatus(3);
                      }}
                    >
                      拒绝
                    </Button>
                  ) : null}
                  {(taskItem.extraData.auditStatus === 2 ||
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
                  ) : null}
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
                  {taskItem.type === 2 ? (
                    <React.Fragment>
                      <div
                        className="dropMenu-item"
                        onClick={() => {
                          setMoveTaskVisible(true);
                          setMoveTaskType("复制");
                        }}
                      >
                        复制任务
                      </div>
                      <div
                        className="dropMenu-item"
                        onClick={() => {
                          setMoveTaskVisible(true);
                          setMoveTaskType("移动");
                        }}
                      >
                        移动任务
                      </div>
                    </React.Fragment>
                  ) : null}
                  <div
                    className="dropMenu-item"
                    onClick={() => {
                      changeTaskItem("finishPercent", 2);
                    }}
                  >
                    {taskItem.finishPercent < 2 ? "归档" : "取消归档"}
                  </div>
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
                  {(taskItem.groupRole < 3 && taskItem.groupRole > 0) ||
                  taskItem.creatorKey === user._key ? (
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
                      right: "158px",
                      zIndex: 20,
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
          <div className="taskInfo-container" ref={taskInfoRef}>
            <div
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
            </div>
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
            </div>
            <div className="taskInfo-auto-item">
              <div className="taskInfo-item-title">附件</div>
              <div className="taskInfo-item-info">
                <Appendix fileList={fileList} changeFileList={changeFileList} />
              </div>
            </div>
            {content ? (
              <Editor
                data={content}
                height={document.body.offsetHeight - 397}
                onChange={changeTaskContent}
                editorKey={taskItem._key}
              />
            ) : null}
            {commentVisible ? (
              <div
                className="comment-info"
                // onClose={() => {
                //   setCommentVisible(false);
                // }}
                style={{
                  height:
                    "calc(100vh - " +
                    (titleRef.current.offsetHeight + 208) +
                    "px)",
                  top: titleRef.current.offsetHeight + 140,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      "评论(" + (taskCommentTotal ? taskCommentTotal : 0) + ")"
                    }
                    key="1"
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
                    <div className="taskInfo-comment-input">
                      <Input
                        placeholder="评论"
                        onChange={changeInput}
                        value={commentInput}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            saveCommentMsg();
                          }
                        }}
                        ref={commentInputRef}
                      />
                      {commentInput ? (
                        <Button
                          loading={buttonLoading}
                          type="primary"
                          onClick={() => {
                            saveCommentMsg();
                          }}
                        >
                          发布
                        </Button>
                      ) : null}
                    </div>
                  </TabPane>
                  <TabPane tab="历史" key="2">
                    <div
                      className="taskInfo-comment-tab"
                      onScroll={scrollHistoryLoading}
                    >
                      {taskHistoryArray.map(
                        (historyItem: any, historyIndex: number) => {
                          return (
                            <div
                              key={"history" + historyIndex}
                              className="taskInfo-comment-historyLog"
                            >
                              <div className="taskInfo-comment-avatar">
                                <Avatar
                                  avatar={historyItem.etc.avatar}
                                  name={historyItem.etc.nickName}
                                  type={"person"}
                                  index={historyIndex}
                                />
                              </div>
                              <div className="taskInfo-comment-info">
                                <div>
                                  {moment(
                                    parseInt(historyItem.createTime)
                                  ).fromNow()}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#8091a0" }}
                                >
                                  {historyItem.log}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            ) : null}
            <div className="comment-button">
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
                    getHistoryList(1, taskInfo);
                    getCommentList(1, taskInfo);
                  }}
                />
              </Badge>
            </div>
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
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
});
TaskInfo.defaultProps = {
  fatherTaskItem: null,
};
export default TaskInfo;
