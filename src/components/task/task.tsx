import React, { useState, useRef, useMemo, useCallback } from "react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Button, Tooltip, Input, message, Dropdown } from "antd";
import {
  GlobalOutlined,
  PlusOutlined,
  MessageOutlined,
  DashOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import "./task.css";
import { useDispatch } from "react-redux";
import moment from "moment";
import _, { isEqual } from "lodash";
import api from "../../services/api";

import { getGroup, setGroupKey } from "../../redux/actions/groupActions";
import {
  changeMusic,
  changeMove,
  changeVitalityNum,
} from "../../redux/actions/authActions";
import {
  setTaskKey,
  editTask,
  getWorkingTableTask,
  getGroupTask,
  setChooseKey,
  setTaskInfo,
  getSelfTask,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";
import {
  setMessage,
  changeTimeSetVisible,
  changeTaskMemberVisible,
  setCommonHeaderIndex,
  changeTaskCustomVisible,
} from "../../redux/actions/commonActions";
import { changeStartId } from "../../redux/actions/groupActions";
import TimeIcon from "../common/timeIcon";
import unfinishPng from "../../assets/img/unfinish.png";
import finishPng from "../../assets/img/finish.png";
import unfinishbPng from "../../assets/svg/unfinishb.svg";
import finishbPng from "../../assets/svg/finishb.svg";
import defaultPerson from "../../assets/img/defaultPerson.png";
import contactTree from "../../assets/svg/contactTreeb.svg";
import messageHandSvg from "../../assets/svg/messageHand.svg";
import messageunHandSvg from "../../assets/svg/messageunHand.svg";
import { useMount } from "../../hook/common";
import { useAuth } from "../../context/auth";
import Avatar from "../common/avatar";
import { useEffect } from "react";
import ClickOutside from "../common/clickOutside";
declare var window: Window;
const { TextArea } = Input;
interface TaskProps {
  taskItem: any;
  executorKey?: number | string;
  changeTask?: any;
  taskIndex?: number;
  taskInfoIndex?: number;
  showGroupName?: boolean;
  bottomtype?: string;
  timeSetStatus?: boolean;
  myState?: boolean;
  createTime?: string;
  reportState?: boolean;
  type?: string;
  changeTaskState?: any;
  taskStyle?: any;
}

const Task: React.FC<TaskProps> = (props) => {
  const {
    taskItem,
    taskIndex,
    showGroupName,
    bottomtype,
    myState,
    createTime,
    reportState,
    changeTask,
    type,
    taskStyle,
  } = props;
  const { deviceState } = useAuth();
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const dispatch = useDispatch();
  const [endtime, setEndtime] = useState(0);
  const [taskDayColor, setTaskDayColor] = useState<any>();
  const [editRole, setEditRole] = useState(false);
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [taskDetail, setTaskDetail] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [avatarShow, setAvatarShow] = useState<any>(null);
  const [avatarKey, setAvatarKey] = useState<any>(null);

  const titleRef: React.RefObject<any> = useRef();
  const taskRef: React.RefObject<any> = useRef();
  const addInputRef: React.RefObject<any> = useRef();

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

  // useEffect(() => {
  //   setTaskDetail(null);
  // }, [headerIndex, targetUserKey, groupKey]);
  // useEffect(() => {
  //   // 用户已登录
  //   if (taskItem) {
  //     editTargetTask(taskItem);
  //   }
  // }, [workingTaskArray]);
  useEffect(() => {
    if (addTaskVisible && addInputRef.current) {
      addInputRef.current.focus();
    }
    //eslint-disable-next-line
  }, [addTaskVisible, addInputRef.current]);
  const editTargetTask = useCallback(
    (newTaskItem: any, type: string) => {
      let [time, endTime, taskDayColor, endState, editRole]: any = [
        0,
        0,
        {},
        false,
        false,
      ];
      const taskTypeArr = [
        { name: "建议", id: 1 },
        { name: "强烈建议", id: 2 },
        { name: "错误", id: 3 },
        { name: "严重错误", id: 4 },
        { name: "致命错误", id: 5 },
        { name: "顶级优先", id: 10 },
      ];
      if (newTaskItem.taskEndDate) {
        time = moment(newTaskItem.taskEndDate)
          .endOf("day")
          .diff(moment().endOf("day"), "days");
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
        endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
        endState = time < 0 ? false : true;
        taskDayColor = !endState
          ? newTaskItem.finishPercent === 0
            ? { backgroundColor: "red" }
            : { backgroundColor: "#B6B7B7" }
          : time > 0
          ? { backgroundColor: "#555555" }
          : {};
        taskDayColor.margin = "5px 5px 0px 0px";
        setEndtime(endTime);
        setTaskDayColor(taskDayColor);
      }
      if (newTaskItem.path1) {
        newTaskItem.path1 = newTaskItem.path1.filter((item) => {
          return item.title !== newTaskItem.title;
        });
      }
      if (type === "taskItem") {
        // editRole =
        //   (newTaskItem.groupRole && (newTaskItem.groupRole === 1 ||
        //     (newTaskItem.groupRole === 2 && newTaskItem.creatorGroupRole >= newTaskItem.groupRole) ||
        //     (newTaskItem.groupRole === 3 && newTaskItem.creatorGroupRole > newTaskItem.groupRole))) ||
        //   newTaskItem.creatorKey === userKey ||
        //   newTaskItem.executorKey === userKey
        editRole =
          (newTaskItem.groupRole &&
            newTaskItem.groupRole > 0 &&
            newTaskItem.groupRole < 4) ||
          newTaskItem.creatorKey === userKey ||
          newTaskItem.executorKey === userKey;
        // watchRole =
        //   (newTaskItem.groupRole && (newTaskItem.groupRole > 0 && newTaskItem.groupRole < 4)) ||
        //   newTaskItem.creatorKey === userKey ||
        //   newTaskItem.executorKey === userKey
        setEditRole(editRole);
        // setWatchRole(watchRole);
      }
      // getTaskMemberArray(taskItem.grougKey)
      taskTypeArr.forEach((item: any, index: number) => {
        if (item.id === newTaskItem.taskType) {
          setTaskTypeIndex(index);
        }
      });

      // newTaskItem.followUKeyArray = newTaskItem.followUKeyArray
      //   ? newTaskItem.followUKeyArray
      //   : [];
      // setTaskTitle(taskItem.title)
      // if (!taskDetail || taskItem._key != taskDetail._key) {
      setTaskTitle(newTaskItem.title);
      setTaskDetail(newTaskItem);
    },
    [userKey]
  );
  useMount(() => {
    if (taskItem) {
      editTargetTask(taskItem, "taskItem");
    }
  });
  useMemo(() => {
    // 用户已登录
    if (taskItem && taskDetail?._key !== taskItem._key) {
      editTargetTask(taskItem, "taskItem");
    }
    //eslint-disable-next-line
  }, [taskItem, taskDetail?._key, editTargetTask]);

  useEffect(() => {
    // 用户已登录
    if (
      taskInfo &&
      taskDetail?._key === taskInfo._key &&
      !isEqual(taskDetail, taskInfo)
    ) {
      editTargetTask(taskInfo, "taskInfo");
    }
    //eslint-disable-next-line
  }, [taskInfo, taskDetail?._key, editTargetTask]);

  // useEffect(() => {
  //   if (titleRef.current && taskKey === taskDetail._key && editRole) {
  // if (titleRef.current.setSelectionRange) {
  //   titleRef.current.setSelectionRange(
  //     titleRef.current.value.length,
  //     titleRef.current.value.length
  //   );
  // } else {
  //   let range = titleRef.current.createTextRange();
  //   range.moveStart('character', titleRef.current.value.length);
  //   range.moveEnd('character', titleRef.current.value.length);
  //   range.select();
  // }
  // let range = document.createRange();
  // range.selectNodeContents(titleRef.current);
  // range.collapse(false);
  // let sel: any = window.getSelection();
  // sel.removeAllRanges();
  // sel.addRange(range);
  // }
  // dispatch(setChooseKey('0'));
  // }, [taskKey]);

  const chooseTask = (e: React.MouseEvent) => {
    dispatch(setTaskKey(taskItem._key));
    dispatch(setTaskInfo(taskDetail));
  };
  const changeFinishPercent = (finishPercent: number, e?: any) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    let obj: any = {};
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskDetail.finishPercent = finishPercent;
    if (newTaskDetail.finishPercent === 1) {
      // newTaskDetail.todayTaskTime = moment().valueOf();
      if (
        newTaskDetail.taskEndDate > moment().endOf("day").valueOf() ||
        newTaskDetail.taskEndDate < moment().startOf("day").valueOf()
      ) {
        newTaskDetail.taskEndDate = moment().endOf("day").valueOf();
        obj.taskEndDate = newTaskDetail.taskEndDate;
      }
      dispatch(changeMusic(1));
      if (e) {
        dispatch(changeMove([e.clientX, e.clientY]));
        if (
          userKey === newTaskDetail.executorKey &&
          groupKey !== mainGroupKey
        ) {
          setTimeout(() => {
            dispatch(changeVitalityNum(1));
          }, 2100);
        }
      }
    } else if (newTaskDetail.finishPercent === 0) {
      dispatch(changeMusic(3));
      if (userKey === newTaskDetail.executorKey && groupKey !== mainGroupKey) {
        dispatch(changeVitalityNum(-1));
      }
    }
    obj.finishPercent = finishPercent;
    setNewDetail(newTaskDetail, obj);
  };
  const changeTitle = (title: string) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.title = title;
    setTaskDetail(newTaskDetail);
  };

  // const changeImportant = (importantStatus: number) => {
  //   let newTaskDetail = _.cloneDeep(taskDetail);
  //   newTaskDetail.importantStatus = importantStatus;
  //   setNewDetail(newTaskDetail, { importantStatus: importantStatus });
  // };
  const changeTaskType = (taskType: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.taskType = taskType;
    setNewDetail(newTaskDetail, { taskType: taskType });
  };
  const chooseExecutor = (e: React.MouseEvent) => {
    // if (taskDetail.finishPercent === 1) {
    //   dispatch(setMessage(true, "完成任务后不能修改执行者", "error"));
    //   return;
    // }
    if (taskDetail.finishPercent === 2) {
      dispatch(setMessage(true, "归档任务后不能修改执行者", "error"));
      return;
    }
    if (editRole) {
      dispatch(changeTaskMemberVisible(true, e.clientX, e.clientY));
    }
  };
  const chooseCustom = (e: React.MouseEvent) => {
    if (editRole) {
      dispatch(changeTaskCustomVisible(true, e.clientX, e.clientY));
    }
  };
  const changeTime = (e: any) => {
    if (editRole) {
      dispatch(changeTimeSetVisible(true, e.clientX, e.clientY));
    }
  };

  const setNewDetail = (taskDetail: any, obj: any) => {
    if (editRole) {
      // setEditState(true);
      obj._key = taskDetail._key;
      for (let key in obj) {
        taskDetail[key] = _.cloneDeep(obj[key]);
      }
      dispatch(
        editTask(
          {
            key: taskDetail._key,
            ...obj,
          },
          headerIndex
        )
      );
      dispatch(setTaskInfo(_.cloneDeep(taskDetail)));
      editTargetTask(_.cloneDeep(taskDetail), "taskItem");
      if (changeTask) {
        changeTask(_.cloneDeep(taskDetail));
      }
    }
  };
  const plusTask = async () => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    setLoading(true);
    let addTaskRes: any = await api.task.addTask({
      groupKey: newTaskDetail.groupKey,
      groupRole: newTaskDetail.groupRole,
      labelKey: newTaskDetail.labelKey,
      executorKey: newTaskDetail.executorKey,
      taskType: newTaskDetail.taskType,
      title: addInput,
      cardIndex: taskIndex ? taskIndex + 1 : 0,
    });
    if (addTaskRes.msg === "OK") {
      await api.task.editTask({
        key: newTaskDetail._key,
        ...newTaskDetail,
      });
      setTaskInfo(newTaskDetail);
      setAddTaskVisible(false);
      setAddInput("");
      // setChooseKey(addTaskRes.result._key);
      setTaskKey(addTaskRes.result._key);
      dispatch(changeMusic(5));
      dispatch(setMessage(true, "新增成功", "success"));

      if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      } else if (headerIndex === 0) {
        dispatch(
          getSelfTask(
            1,
            userKey,
            "[0, 1]",
            1,
            moment().add(1, "days").startOf("day").valueOf(),
            1
          )
        );
      } else {
        dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 2));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
    setLoading(false);
  };
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3, null, 1));
  };
  const changeAuditStatus = async (auditStatus: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);

    if (!newTaskDetail.extraData) {
      newTaskDetail.extraData = {};
    }
    newTaskDetail.extraData.auditStatus = auditStatus;
    setNewDetail(newTaskDetail, { extraData: newTaskDetail.extraData });
  };
  return (
    <React.Fragment>
      {taskDetail ? (
        <React.Fragment>
          <div
            className="task-container"
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <div
              className="taskItem"
              onClick={chooseTask}
              tabIndex={taskItem._key}
              onBlur={() => {
                let newTaskItem = _.cloneDeep(taskItem);
                let newTaskDetail = _.cloneDeep(taskDetail);
                newTaskDetail.title = taskTitle;
                if (newTaskItem.title !== taskTitle) {
                  dispatch(
                    editTask(
                      {
                        key: newTaskDetail._key,
                        title: taskTitle,
                      },
                      headerIndex
                    )
                  );
                  setTaskInfo(newTaskDetail);
                }
              }}
              // onKeyDown={taskKeyDown}
              style={{
                background: taskStyle?.background
                  ? taskStyle.background
                  : bottomtype === "grid"
                  ? "transparent"
                  : taskDetail.finishPercent === 0 ||
                    taskDetail.finishPercent === 10
                  ? taskDetail.taskEndDate > moment().endOf("day").valueOf()
                    ? "rgba(255,255,255,0.95)"
                    : "rgb(255,255,255)"
                  : "rgba(229,231,234,0.9)",
                // opacity:
                //   taskDetail.finishPercent === 0 ||
                //   taskDetail.finishPercent === 10
                //     ? 1
                //     : 0.9,
                boxShadow:
                  !bottomtype && taskItem._key === taskKey
                    ? "0 0 7px 0 rgba(0, 0, 0, 0.26)"
                    : "",
                // border: createTime ? '1px solid #efefef' : '0px',
                border: bottomtype !== "grid" ? "1px solid #efefef" : "0px",
                marginBottom: bottomtype !== "grid" ? "6px" : "0px",
                ...taskStyle,
              }}
            >
              <React.Fragment>
                {createTime ? (
                  <div
                    className="taskItem-groupContainer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toTargetGroup(taskDetail?.groupKey);
                    }}
                  >
                    <div className="taskItem-group">
                      <div
                        className="taskItem-img"
                        style={{ marginRight: "5px", borderRadius: "5px" }}
                      >
                        <Avatar
                          avatar={taskDetail?.groupLogo}
                          name={taskDetail?.groupName}
                          type={"group"}
                          index={0}
                        />
                      </div>
                      <span>{taskDetail.groupName}</span>
                      <span>{" / "}</span>
                      <span>
                        {taskDetail.labelName ? taskDetail.labelName : "ToDo"}
                      </span>
                    </div>
                    <div className="taskItem-createTime">{createTime}</div>
                  </div>
                ) : null}
                {!bottomtype && !myState ? (
                  <Dropdown
                    overlay={
                      <ClickOutside
                        onClickOutside={() => {
                          setSuggestVisible(false);
                        }}
                      >
                        <div
                          className="dropDown-box"
                          style={{
                            padding: "0px",
                            width: "90px",
                            height: "180px",
                          }}
                        >
                          {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                            return (
                              <div
                                key={"taskType" + taskTypeIndex}
                                className="taskItem-suggest-item"
                                style={{
                                  color: color[taskTypeIndex],
                                  backgroundColor:
                                    backgroundColor[taskTypeIndex],
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTaskTypeIndex(taskTypeIndex);
                                  changeTaskType(taskTypeItem.id);
                                  setSuggestVisible(false);
                                }}
                              >
                                {taskTypeItem.name}
                              </div>
                            );
                          })}
                        </div>
                      </ClickOutside>
                    }
                    trigger={["click"]}
                    visible={suggestVisible}
                    placement="bottomRight"
                  >
                    <div
                      className="taskItem-taskType"
                      style={{
                        borderTop: "9px solid " + color[taskTypeIndex],
                        borderRight: "9px solid " + color[taskTypeIndex],
                        borderLeft: "9px solid transparent",
                        borderBottom: "9px solid transparent",
                      }}
                      onClick={(e: any) => {
                        if (taskKey === taskDetail._key && editRole) {
                          setSuggestVisible(true);
                        }
                      }}
                    ></div>
                  </Dropdown>
                ) : null}
                {taskDetail.finishPercent !== 10 ? (
                  <div
                    className="taskItem-finishIcon"
                    onClick={(e: any) => {
                      if (editRole) {
                        e.stopPropagation();
                        changeFinishPercent(
                          taskDetail.finishPercent !== 0 ? 0 : 1,
                          e
                        );
                      } else {
                        dispatch(
                          setMessage(true, "权限不足，请提升权限", "error")
                        );
                      }
                    }}
                  >
                    <Tooltip
                      title="设置完成度"
                      getPopupContainer={() => taskRef.current}
                    >
                      <img
                        src={
                          taskDetail.finishPercent === 0
                            ? bottomtype === "grid"
                              ? unfinishPng
                              : unfinishbPng
                            : bottomtype === "grid"
                            ? finishPng
                            : finishbPng
                        }
                        alt=""
                      />
                    </Tooltip>
                  </div>
                ) : null}
                <div className="taskItem-container">
                  <div className="taskItem-info">
                    {!myState ? (
                      <Tooltip
                        title="设置工时"
                        getPopupContainer={() => taskRef.current}
                      >
                        <React.Fragment>
                          <TimeIcon
                            timeHour={taskDetail.hour}
                            timeColor={taskDayColor}
                            timeClick={changeTime}
                            timeDay={endtime}
                          />
                        </React.Fragment>
                      </Tooltip>
                    ) : null}
                    {bottomtype === "grid" ? (
                      <Tooltip
                        title="设置执行人"
                        getPopupContainer={() => taskRef.current}
                      >
                        <div
                          className="taskItem-img"
                          onMouseEnter={() => {
                            setAvatarShow(2);
                          }}
                          onMouseLeave={() => {
                            setAvatarShow(1);
                          }}
                          style={
                            avatarShow &&
                            editRole &&
                            taskKey === taskDetail?._key
                              ? avatarShow === 1
                                ? {
                                    animation: "taskAvatarSmall 500ms",
                                    // animationFillMode: 'forwards',
                                    width: "18px",
                                    height: "18px",
                                  }
                                : {
                                    animation: "taskAvatarBig 500ms",
                                    // animationFillMode: 'forwards',
                                    width: "25px",
                                    height: "25px",
                                  }
                              : {
                                  // animationFillMode: 'forwards',
                                  width: "18px",
                                  height: "18px",
                                  marginTop: "5px",
                                }
                          }
                        >
                          <img
                            src={
                              taskDetail.executorAvatar
                                ? taskDetail.executorAvatar +
                                  "?imageMogr2/auto-orient/thumbnail/80x"
                                : defaultPerson
                            }
                            style={{ marginTop: "0px" }}
                            alt=""
                          />
                        </div>
                      </Tooltip>
                    ) : null}
                    <div className="taskItem-title">
                      <TextArea
                        autoSize={{ minRows: 1 }}
                        placeholder="请输入任务名"
                        disabled={!editRole}
                        style={{
                          width: "100%",
                          minHeight: "28px",
                          backgroundColor: "transparent",
                          color:
                            bottomtype === "grid"
                              ? "#fff"
                              : taskDetail.finishPercent === 0
                              ? "#333"
                              : "#4b4d4e",
                          textDecoration:
                            taskDetail.finishPercent === 2
                              ? "line-through #9ea2a8 solid"
                              : "",
                          border: !editRole ? "0px" : "",
                        }}
                        value={taskTitle}
                        ref={titleRef}
                        onChange={(e) => {
                          if (e.target.value !== taskTitle) {
                            changeTitle(e.target.value);
                            setTaskTitle(e.target.value);
                          }
                        }}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            // let newTaskItem = _.cloneDeep(taskItem);
                            // let newTaskDetail = _.cloneDeep(taskDetail);
                            // newTaskDetail.title = e.target.value;
                            // if (newTaskItem.title !== e.target.value) {
                            //   dispatch(
                            //     editTask(
                            //       {
                            //         key: newTaskDetail._key,
                            //         title: e.target.value,
                            //       },
                            //       headerIndex
                            //     )
                            //   );
                            //   setTaskInfo(newTaskDetail);
                            // }
                            e.preventDefault(); // 阻止浏览器默认换行操作
                            setAddTaskVisible(true);
                            return false;
                          }
                        }}
                        // disabled={!editRole || taskKey !== taskDetail._key}
                      />
                      {/* <TextareaAutosize
                        rowsMin={1}
                        aria-label="maximum height"
                        placeholder="请输入任务名"
                        value={taskTitle}
                        ref={titleRef}
                        onChange={(e) => {
                          if (e.target.value !== taskTitle) {
                            changeTitle(e.target.value);
                            setTaskTitle(e.target.value);
                          }
                        }}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            let newTaskItem = _.cloneDeep(taskItem);
                            let newTaskDetail = _.cloneDeep(taskDetail);
                            newTaskDetail.title = e.target.value;
                            if (newTaskItem.title !== e.target.value) {
                              dispatch(
                                editTask(
                                  {
                                    key: newTaskDetail._key,
                                    title: e.target.value,
                                  },
                                  headerIndex
                                )
                              );
                              setTaskInfo(newTaskDetail);
                            }
                            e.preventDefault(); // 阻止浏览器默认换行操作
                            return false;
                          }
                        }}
                        disabled={!editRole || taskKey !== taskDetail._key}
                      /> */}
                    </div>
                  </div>
                  {(taskItem.creatorKey === userKey ||
                    taskItem.executorKey === userKey) &&
                  taskItem?.extraData?.auditStatus ? (
                    <div className="taskItem-auditStatus">
                      {taskItem.extraData.auditStatus === 1 &&
                      taskItem.creatorKey === userKey ? (
                        <Button size="small">待审核</Button>
                      ) : null}
                      {taskItem.extraData.auditStatus === 3 ? (
                        <Button
                          danger
                          size="small"
                          style={{ marginRight: "7px" }}
                        >
                          审核已拒绝
                        </Button>
                      ) : null}
                      {taskItem.extraData.auditStatus === 2 ? (
                        <Button size="small" style={{ marginRight: "7px" }}>
                          审核已通过
                        </Button>
                      ) : null}
                      {(taskItem.extraData.auditStatus === 3 ||
                        taskItem.extraData.auditStatus === 2) &&
                      taskItem.executorKey === userKey &&
                      taskItem.creatorKey !== userKey ? (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            if (taskItem.executorKey === userKey) {
                              changeAuditStatus(1);
                            }
                          }}
                        >
                          重新审核
                        </Button>
                      ) : null}
                      {(taskItem.extraData.auditStatus === 3 ||
                        taskItem.extraData.auditStatus === 2) &&
                      taskItem.executorKey !== userKey &&
                      taskItem.creatorKey === userKey ? (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            if (taskItem.creatorKey === userKey) {
                              changeAuditStatus(1);
                            }
                          }}
                        >
                          重新申请
                        </Button>
                      ) : null}
                      {taskItem?.extraData?.auditStatus === 1 &&
                      taskItem.executorKey === userKey &&
                      taskItem.creatorKey !== userKey ? (
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
                      taskItem.executorKey === userKey &&
                      taskItem.creatorKey !== userKey ? (
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
                    </div>
                  ) : null}
                  {taskDetail.path1 &&
                  (taskDetail.type === 6 || taskDetail.type === 1) &&
                  type !== "okr" ? (
                    <div
                      className="taskItem-path-container"
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
                      <div
                        className="taskItem-path"
                        style={{
                          color: bottomtype === "grid" ? "#fff" : "#A1ACB7",
                        }}
                      >
                        {taskDetail.path1.map(
                          (pathItem: any, pathIndex: number) => {
                            return (
                              <React.Fragment key={"path" + pathIndex}>
                                <span
                                  onClick={async () => {
                                    if (headerIndex === 3) {
                                      // dispatch(changeStartId(pathItem._key));
                                      let newGroupMemberItem = {
                                        ...groupMemberItem,
                                      };
                                      newGroupMemberItem.config.treeStartId =
                                        pathItem._key;
                                      await api.member.setConfig(
                                        newGroupMemberItem._key,
                                        newGroupMemberItem.config
                                      );
                                      dispatch(setHeaderIndex(3));
                                    } else {
                                      dispatch(
                                        setGroupKey(taskDetail.groupKey)
                                      );
                                      dispatch(setCommonHeaderIndex(3));
                                      dispatch(setHeaderIndex(3));
                                      dispatch(changeStartId(taskDetail._key));
                                    }
                                  }}
                                >
                                  {pathIndex === 0
                                    ? pathItem.title
                                    : "/" + pathItem.title}
                                </span>
                              </React.Fragment>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ) : null}
                  {(!bottomtype || bottomtype === "create") && !myState ? (
                    <div className="taskItem-footer">
                      <div className="taskItem-footer-left">
                        {reportState && headerIndex !== 3 ? (
                          <div
                            className="taskItem-img"
                            style={{ borderRadius: "5px" }}
                          >
                            <Avatar
                              avatar={taskDetail?.groupLogo}
                              name={taskDetail?.groupName}
                              type={"group"}
                              index={0}
                            />
                          </div>
                        ) : null}
                        <div className="taskItem-name">
                          {reportState && headerIndex !== 3 ? (
                            <span style={{ margin: "0px 8px" }}>
                              {taskDetail.groupName.split("_")[0]} /{" "}
                              {taskDetail.labelName
                                ? taskDetail.labelName
                                : taskDetail.labelKey
                                ? ""
                                : "ToDo"}
                            </span>
                          ) : null}
                          {/* (deviceState === "xl" || deviceState === "xxl") */}
                          {(!showGroupName || createTime) && deviceState ? (
                            <span>
                              {taskDetail.serialNumber
                                ? "#" + taskDetail.serialNumber
                                : ""}
                            </span>
                          ) : (
                            <span style={{ flexShrink: 0 }}>
                              {taskDetail.groupName.split("_")[0]}
                            </span>
                          )}
                          <span style={{ flexShrink: 0 }}>
                            {taskDetail.creatorName &&
                            taskDetail.creatorName.length > 3
                              ? taskDetail.creatorName.substring(0, 3) + "..."
                              : taskDetail.creatorName}
                          </span>
                          <img
                            src={
                              taskDetail.finishConfirm
                                ? messageHandSvg
                                : messageunHandSvg
                            }
                            alt=""
                            style={{
                              width: "11px",
                              height: "10px",
                              marginLeft: "2px",
                              marginRight: "2px",
                              marginBottom: "3px",
                            }}
                          />
                          <span>⇀</span>
                          <span style={{ flexShrink: 0 }}>
                            {taskDetail.executorName &&
                            taskDetail.executorName.length > 3
                              ? taskDetail.executorName.substring(0, 3) + "..."
                              : taskDetail.executorName}
                          </span>
                          <img
                            src={
                              taskDetail.assignConfirm
                                ? messageHandSvg
                                : messageunHandSvg
                            }
                            alt=""
                            style={{
                              width: "11px",
                              height: "10px",
                              marginLeft: "2px",
                              marginRight: "2px",
                              marginBottom: "3px",
                            }}
                          />
                        </div>
                        <Tooltip title="选择执行人">
                          <div
                            className="taskItem-img-container"
                            onMouseEnter={() => {
                              setAvatarShow(2);
                              setAvatarKey(taskDetail._key);
                            }}
                            onMouseLeave={() => {
                              setAvatarShow(1);
                              setAvatarKey(null);
                            }}
                          >
                            <div
                              className="taskItem-img"
                              onClick={chooseExecutor}
                              style={
                                avatarShow && avatarKey === taskDetail._key
                                  ? avatarShow === 1
                                    ? {
                                        animation: "taskAvatarSmall 500ms",
                                        // animationFillMode: 'forwards',
                                        width: "18px",
                                        height: "18px",
                                      }
                                    : {
                                        animation: "taskAvatarBig 500ms",
                                        // animationFillMode: 'forwards',
                                        width: "30px",
                                        height: "30px",
                                      }
                                  : {
                                      // animationFillMode: 'forwards',
                                      width: "18px",
                                      height: "18px",
                                    }
                              }
                            >
                              <Avatar
                                name={taskDetail.executorName}
                                avatar={taskDetail?.executorAvatar}
                                type={"person"}
                                index={0}
                              />
                            </div>
                          </div>
                        </Tooltip>
                        {groupInfo?.isCustomService &&
                        headerIndex === 3 &&
                        type === "customService" ? (
                          <React.Fragment>
                            <span
                              style={{
                                marginLeft: "5px",
                                marginRight: "3px",
                                color: "#8091a0",
                              }}
                            >
                              ⇀
                            </span>
                            <span
                              style={{
                                flexShrink: 0,
                                fontSize: "12px",
                                color: "#8091a0",
                                marginRight: "3px",
                              }}
                            >
                              {taskDetail.customName &&
                              taskDetail.customName.length > 3
                                ? taskDetail.customName.substring(0, 3) + "..."
                                : taskDetail.customName}
                            </span>

                            <Tooltip title="选择客户">
                              <div className="taskItem-img-container">
                                <div
                                  className="taskItem-img"
                                  onClick={chooseCustom}
                                >
                                  <Avatar
                                    name={taskDetail.customName}
                                    avatar={taskDetail?.customAvatar}
                                    type={"person"}
                                    index={0}
                                  />
                                </div>
                              </div>
                            </Tooltip>
                          </React.Fragment>
                        ) : null}
                      </div>

                      {!taskDetail.isKR && !taskDetail.isO ? (
                        <div className="taskItem-icon-group">
                          {editRole &&
                          headerIndex === 3 &&
                          memberHeaderIndex === 0 ? (
                            <div
                              className="taskItem-check-icon"
                              onClick={() => {
                                setAddTaskVisible(true);
                              }}
                            >
                              <Tooltip
                                title="添加任务"
                                getPopupContainer={() => taskRef.current}
                              >
                                <PlusOutlined
                                  style={{ width: "16px", height: "16px" }}
                                />
                              </Tooltip>
                            </div>
                          ) : null}
                          {/* {taskDetail.importantStatus ? (
                          <div
                            className="taskItem-check-icon"
                            style={{ display: 'flex' }}
                          >
                            <Tooltip
                              title="重要"
                              getPopupContainer={() => taskRef.current}
                            >
                              <img
                                src={importantPng}
                                alt="重要"
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  changeImportant(0);
                                }}
                                style={{ height: '18px', width: '19px' }}
                              />
                            </Tooltip>
                          </div>
                        ) : (
                          <div className="taskItem-check-icon">
                            <Tooltip
                              title="重要"
                              getPopupContainer={() => taskRef.current}
                            >
                              <img
                                src={unimportantPng}
                                alt="不重要"
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  changeImportant(1);
                                }}
                                style={{ height: '18px', width: '19px' }}
                              />
                            </Tooltip>
                          </div>
                        )} */}
                          {/* && editRole */}
                          {taskDetail.extraData && taskDetail.extraData.url ? (
                            <div
                              className="taskItem-check-icon"
                              style={{ display: "flex" }}
                              onClick={() => {
                                window.open(taskDetail.extraData.url);
                              }}
                            >
                              <Tooltip
                                title="跳转链接"
                                getPopupContainer={() => taskRef.current}
                              >
                                <GlobalOutlined
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    marginRight: "3px ",
                                  }}
                                />
                              </Tooltip>
                            </div>
                          ) : null}
                          {/* {editRole &&
                          taskDetail.creatorGroupRole <= taskDetail.groupRole ? (
                            <div className="taskItem-check-icon">
                              <img
                                src={deleteIconSvg}
                                alt="删除"
                                onClick={() => {
                                  setDeleteDialogShow(true);
                                }}
                                style={{ height: '18px', width: '19px' }}
                              />
                            </div>
                          ) : null} */}
                          {/* {editRole ? ( */}
                          <Tooltip
                            title="评论信息"
                            getPopupContainer={() => taskRef.current}
                          >
                            <div
                              className="taskItem-detail"
                              style={
                                taskDetail.hasComment ? { opacity: "1" } : {}
                              }
                              onClick={() => {
                                dispatch(changeTaskInfoVisible(true, true));
                                dispatch(setChooseKey(taskDetail._key));
                              }}
                            >
                              <MessageOutlined
                                style={{
                                  height: "16px",
                                  width: "16px",
                                  marginTop: "3px",
                                }}
                              />
                            </div>
                          </Tooltip>
                          {/* ) : null}
                        {editRole ? ( */}
                          <Tooltip
                            title="任务详情"
                            getPopupContainer={() => taskRef.current}
                          >
                            <div
                              className="taskItem-detail"
                              style={
                                taskDetail.hasContent ||
                                (taskDetail?.extraData &&
                                  taskDetail.extraData.fileList &&
                                  taskDetail.extraData.fileList.length > 0)
                                  ? { opacity: "1" }
                                  : {}
                              }
                              onClick={() => {
                                dispatch(changeTaskInfoVisible(true));
                                dispatch(setChooseKey(taskDetail._key));
                              }}
                            >
                              {taskDetail?.extraData &&
                              taskDetail.extraData.fileList &&
                              taskDetail.extraData.fileList.length > 0 ? (
                                <LinkOutlined style={{ fontSize: "16px" }} />
                              ) : (
                                <DashOutlined
                                  style={
                                    taskDetail.hasContent
                                      ? { fontSize: "18px", marginTop: "2px" }
                                      : { fontSize: "16px", marginTop: "2px" }
                                  }
                                />
                              )}
                            </div>
                          </Tooltip>
                          {/* ) : null} */}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="taskItem-taskType"></div>
                  {/*  style={cardKey===taskItem._key?{borderTop:'10px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],borderRight:'10px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],borderRight:'7px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}} */}
                </div>
              </React.Fragment>
            </div>
            {addTaskVisible ? (
              <div className="taskItem-plus-title">
                <div className="taskItem-plus-input">
                  <input
                    // required
                    placeholder="任务标题"
                    value={addInput}
                    autoComplete="off"
                    onChange={(e) => {
                      setAddInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13 && addInput) {
                        plusTask();
                      }
                    }}
                    ref={addInputRef}
                  />
                </div>
                <div className="taskItem-plus-button">
                  <Button
                    ghost
                    onClick={() => {
                      setAddTaskVisible(false);
                      setAddInput("");
                    }}
                    style={{ border: "0px" }}
                  >
                    取消
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={() => {
                      if (addInput) {
                        plusTask();
                      } else {
                        message.error("请输入标题");
                      }
                    }}
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
Task.defaultProps = {
  taskItem: null,
  executorKey: 0,
  changeTask: null,
  showGroupName: false,
  taskIndex: 0,
};
export default Task;
