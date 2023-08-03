import React, { useState, useRef, useMemo, useCallback } from "react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Tooltip, Input } from "antd";
import {
  GlobalOutlined,
  MessageOutlined,
  DashOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import "./task.css";
import "./taskSimple.css";
import { useDispatch } from "react-redux";
import moment from "moment";
import _, { isEqual } from "lodash";
import api from "../../services/api";

import {
  changeMusic,
  changeMove,
  changeVitalityNum,
} from "../../redux/actions/authActions";
import {
  setTaskKey,
  editTask,
  setChooseKey,
  setTaskInfo,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";
import {
  setMessage,
  changeTimeSetVisible,
  changeTaskMemberVisible,
} from "../../redux/actions/commonActions";

import DropMenu from "../common/dropMenu";
import TimeIcon from "../common/timeIcon";
import unfinishbPng from "../../assets/svg/unfinishb.svg";
import finishbPng from "../../assets/svg/finishb.svg";
import contactTree from "../../assets/svg/contactTreeb.svg";
import messageHandSvg from "../../assets/svg/messageHand.svg";
import messageunHandSvg from "../../assets/svg/messageunHand.svg";
import { useMount } from "../../hook/common";
import Avatar from "../common/avatar";
interface TaskSimpleProps {
  taskItem: any;
}
declare var window: Window 
const TaskSimple: React.FC<TaskSimpleProps> = (props) => {
  const { taskItem } = props;
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
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

  const titleRef: React.RefObject<any> = useRef();
  const taskRef: React.RefObject<any> = useRef();

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

  useMemo(() => {
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
  const chooseTask = (e: React.MouseEvent) => {
    dispatch(setTaskKey(taskItem._key));
    dispatch(setTaskInfo(taskDetail));
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
  const changeTitle = (title: string) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.title = title;
    setTaskDetail(newTaskDetail);
  };
  const changeTime = (e: any) => {
    if (editRole) {
      dispatch(changeTimeSetVisible(true, e.clientX, e.clientY));
    }
  };
  const changeTaskType = (taskType: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.taskType = taskType;
    setNewDetail(newTaskDetail, { taskType: taskType });
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
      // if (changeTask) {
      //   changeTask(_.cloneDeep(taskDetail));
      // }
    }
  };
  return (
    <React.Fragment>
      {taskDetail ? (
        <React.Fragment>
          <div
            className="task-container taskSimple-container"
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <div
              className="taskItem taskSimple"
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
                background:
                  taskDetail.finishPercent === 0 ||
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
                  taskItem._key === taskKey
                    ? "0 0 7px 0 rgba(0, 0, 0, 0.26)"
                    : "",
                // border: createTime ? '1px solid #efefef' : '0px',
                border: "1px solid #efefef",
                marginBottom: "6px",
              }}
            >
              <React.Fragment>
                <div className="taskSimple-top">
                  <div className="taskSimple-top-left">
                    <div>
                      {taskDetail.serialNumber
                        ? "#" + taskDetail.serialNumber
                        : ""}
                    </div>
                    <div>
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
                      <div className="taskItem-img" onClick={chooseExecutor}>
                        <Avatar
                          name={taskDetail.executorName}
                          avatar={taskDetail?.executorAvatar}
                          type={"person"}
                          index={0}
                        />
                      </div>
                    </div>
                    <div
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
                              ? unfinishbPng
                              : finishbPng
                          }
                          alt=""
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <TimeIcon
                        timeHour={taskDetail.hour}
                        timeColor={taskDayColor}
                        timeClick={changeTime}
                        timeDay={endtime}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="请输入任务名"
                        disabled={!editRole}
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          color:
                            taskDetail.finishPercent === 0 ? "#333" : "#4b4d4e",
                          textDecoration:
                            taskDetail.finishPercent === 2
                              ? "line-through #9ea2a8 solid"
                              : "",
                          border: "0px",
                        }}
                        value={taskTitle}
                        ref={titleRef}
                        onChange={(e) => {
                          if (e.target.value !== taskTitle) {
                            changeTitle(e.target.value);
                            setTaskTitle(e.target.value);
                          }
                        }}
                        // disabled={!editRole || taskKey !== taskDetail._key}
                      />
                    </div>
                  </div>
                  <div className="taskSimple-top-right">
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
                        style={taskDetail.hasComment ? { opacity: "1" } : {}}
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
                            ((taskDetail.extraData.fileList &&
                              taskDetail.extraData.fileList.length > 0) ||
                              (taskDetail.extraData.imgFileList &&
                                taskDetail.extraData.imgFileList.length > 0)))
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
                  </div>
                </div>
                <div className="taskSimple-bottom">
                  <div>
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
                    <div
                      style={{ margin: "0px 8px", width: "calc(100% - 20px)" }}
                      className="toLong"
                    >
                      {taskDetail.groupName.split("_")[0]} /{" "}
                      {taskDetail.labelName
                        ? taskDetail.labelName
                        : taskDetail.labelKey
                        ? ""
                        : "ToDo"}
                    </div>
                  </div>
                  {taskDetail.path1 &&
                  (taskDetail.type === 6 || taskDetail.type === 1) ? (
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
                          color: "#A1ACB7",
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
                </div>
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
                >
                  {suggestVisible ? (
                    <DropMenu
                      visible={suggestVisible}
                      dropStyle={{
                        width: "100px",
                        top: "-6px",
                        left: "-109px",
                        zIndex: "20",
                      }}
                      onClose={() => {
                        setSuggestVisible(false);
                      }}
                    >
                      {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                        return (
                          <div
                            key={"taskType" + taskTypeIndex}
                            className="taskItem-suggest-item"
                            style={{
                              color: color[taskTypeIndex],
                              backgroundColor: backgroundColor[taskTypeIndex],
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
                    </DropMenu>
                  ) : null}
                </div>
              </React.Fragment>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
TaskSimple.defaultProps = {};
export default TaskSimple;
