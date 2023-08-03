import React, { useState, useEffect, useRef, useCallback } from "react";
import "./task.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import _ from "lodash";
import moment from "moment";
import { useMount } from "../../hook/common";
import IconFont from "../../components/common/iconFont";
import {
  changeTaskMemberVisible,
  setMessage,
} from "../../redux/actions/commonActions";
import { editTask, setTaskInfo } from "../../redux/actions/taskActions";

import eyeSvg from "../../assets/svg/eye.svg";
import uneyeSvg from "../../assets/svg/uneye.svg";
import Avatar from "../common/avatar";
import Empty from "../common/empty";
const { Search } = Input;
interface TaskMemberProps {
  targetGroupKey?: string;
  onClose?: any;
  chooseFollow?: any;
  showMemberVisible?: boolean;
  type?: string;
  changeMember?: any;
  calendarFollow?: any;
}

const TaskMember: React.FC<TaskMemberProps> = (props) => {
  const {
    targetGroupKey,
    chooseFollow,
    showMemberVisible,
    type,
    changeMember,
    calendarFollow,
  } = props;
  const dispatch = useDispatch();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const taskMemberVisible = useTypedSelector(
    (state) => state.common.taskMemberVisible
  );
  const [taskMemberArray, setTaskMemberArray] = useState<any>([]);
  const [searchMemberArray, setSearchMemberArray] = useState<any>([]);
  const [taskMemberInfo, setTaskMemberInfo] = useState<any>({});
  // const [followIndex, setFollowIndex] = useState<any>(null);
  const [searchInput, setSearchInput] = useState<any>("");
  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getTaskMemberArray = useCallback(
    async (groupKey: string, taskInfo: any) => {
      let taskMemberRes: any = null;
      taskMemberRes = await api.member.getMember(groupKey, 4);
      if (unDistory.current) {
        if (taskMemberRes.msg === "OK") {
          setTaskMemberArray(taskMemberRes.result);
          setSearchMemberArray(taskMemberRes.result);
          setTaskMemberInfo(taskInfo);
        }
      }
    },
    []
  );
  useEffect(() => {
    // 用户已登录
    if (targetGroupKey) {
      getTaskMemberArray(targetGroupKey, taskInfo);
    } else if (taskInfo && (taskMemberVisible || showMemberVisible)) {
      getTaskMemberArray(taskInfo.groupKey, taskInfo);
    }
  }, [
    targetGroupKey,
    taskInfo,
    taskMemberVisible,
    showMemberVisible,
    getTaskMemberArray,
  ]);
  useEffect(() => {
    // 用户已登录
    if (!searchInput && taskMemberArray) {
      const newTaskMemberArray = _.cloneDeep(taskMemberArray);
      setSearchMemberArray(newTaskMemberArray);
    }
  }, [searchInput, taskMemberArray]);

  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string
  ) => {
    let newTaskDetail = _.cloneDeep(taskMemberInfo);
    let followIndex = newTaskDetail.followUKeyArray.indexOf(executorKey);
    if (followIndex === -1) {
      newTaskDetail.followUKeyArray.push(executorKey);
    } else {
      newTaskDetail.followUKeyArray.splice(followIndex, 1);
    }
    newTaskDetail.executorKey = executorKey;
    newTaskDetail.executorName = executorName;
    newTaskDetail.executorAvatar = executorAvatar;
    if (
      moment(newTaskDetail.taskEndDate).endOf("day").valueOf() <
      moment().startOf("day").valueOf()
    ) {
      newTaskDetail.taskEndDate = moment().endOf("day").valueOf();
    }
    getTaskMemberArray(newTaskDetail.groupKey, taskInfo);
    setTaskMemberInfo(newTaskDetail);
    if (changeMember) {
      changeMember({
        executorName: executorName,
        executorAvatar: executorAvatar,
        executorKey: executorKey,
      });
    }
    dispatch(setTaskInfo(newTaskDetail));
    dispatch(
      editTask(
        {
          key: newTaskDetail._key,
          executorKey: executorKey,
          executorName: executorName,
          executorAvatar: executorAvatar,
          followUKeyArray: newTaskDetail.followUKeyArray,
          taskEndDate: newTaskDetail.taskEndDate,
        },
        headerIndex
      )
    );
  };
  const changeFollow = async (followKey: number | string) => {
    let newTaskDetail = _.cloneDeep(taskMemberInfo);
    let followIndex = newTaskDetail.followUKeyArray.indexOf(followKey);
    if (followIndex === -1) {
      newTaskDetail.followUKeyArray.push(followKey);
    } else {
      newTaskDetail.followUKeyArray.splice(followIndex, 1);
    }
    setTaskMemberInfo(newTaskDetail);
    dispatch(setTaskInfo(newTaskDetail));
    const followRes: any = await api.task.followCard(
      taskInfo._key,
      newTaskDetail.followUKeyArray
    );
    if (followRes.msg === "OK") {
      // dispatch(setMessage(true, "设置关注者成功", "success"));
    } else {
      dispatch(setMessage(true, followRes.msg, "error"));
    }
  };
  const searchPerson = (e: any) => {
    let input = e.target.value;
    setSearchInput(input);
    if (input) {
      let newSearchMemberArray = _.cloneDeep(taskMemberArray);
      newSearchMemberArray = newSearchMemberArray.filter(
        (item: any, index: number) => {
          return (
            item.nickName &&
            item.nickName.toUpperCase().indexOf(input.toUpperCase()) !== -1
          );
        }
      );
      // if(newSearchMemberArray.length===0){
      //   dispatch(setMessage(true, "未搜索到执行人", "warning"));
      // }
      setSearchMemberArray(newSearchMemberArray);
    }
  };
  return (
    <div className="task-executor-dropMenu-info">
      <div className="task-executor-input">
        <Search
          type="text"
          placeholder={"输入用户名…"}
          onChange={searchPerson}
          value={searchInput}
          autoComplete="off"
          allowClear={false}
          style={{ width: "calc(100% - 40px)", height: "30px" }}
        />
        {type !== "follow" && type !== "calendar" ? (
          <Tooltip title="清除执行人">
            <Button
              size="large"
              shape="circle"
              style={{ border: "0px" }}
              ghost
              icon={
                <IconFont type="icon-saoba1" style={{ fontSize: "25px" }} />
              }
              onClick={() => {
                changeExecutor("", "", "");
                dispatch(changeTaskMemberVisible(false, 0, 0));
              }}
            />
          </Tooltip>
        ) : null}
      </div>

      {searchMemberArray.length > 0 ? (
        searchMemberArray.map(
          (taskMemberItem: any, taskMemberIndex: number) => {
            return (
              <div
                className="task-executor-dropMenu-container"
                key={"taskMember" + taskMemberIndex}
                // style={
                //   taskDetail.executorKey ===
                //     taskMemberItem.userId
                //     ? { background: '#F0F0F0' }
                //     : {}
                // }
                onClick={() => {
                  if (targetGroupKey) {
                    chooseFollow(taskMemberItem);
                  } else {
                    changeExecutor(
                      taskMemberItem.userId,
                      taskMemberItem.nickName,
                      taskMemberItem.avatar
                    );
                    dispatch(changeTaskMemberVisible(false, 0, 0));
                  }
                }}
                // onMouseEnter={() => {
                //   if (!targetGroupKey) {
                //     setFollowIndex(taskMemberIndex);
                //   }
                // }}
              >
                <div className="task-executor-dropMenu-left">
                  <div className="task-executor-dropMenu-img">
                    <Avatar
                      avatar={taskMemberItem.avatar}
                      name={taskMemberItem.nickName}
                      type={"person"}
                      index={taskMemberIndex}
                    />
                  </div>
                  <div>
                    {taskMemberItem.nickName}
                  </div>
                </div>
                {(!targetGroupKey &&
                  taskMemberInfo.executorKey === taskMemberItem.userId) ||
                (type === "calendar" &&
                  calendarFollow &&
                  calendarFollow.indexOf(taskMemberItem.userId) !== -1) ? (
                  <CheckOutlined />
                ) : (
                  <div
                    className="task-executor-dropMenu-follow"
                    onClick={(e: any) => {
                      if (!targetGroupKey) {
                        e.stopPropagation();
                        if (
                          taskMemberInfo.executorKey === taskMemberItem.userId
                        ) {
                          dispatch(
                            setMessage(true, "执行者无法取消关注", "error")
                          );
                          return;
                        }
                        if (
                          taskMemberInfo.creatorKey === taskMemberItem.userId
                        ) {
                          dispatch(
                            setMessage(true, "创建者无法取消关注", "error")
                          );
                          return;
                        }
                        changeFollow(taskMemberItem.userId);
                      }
                    }}
                    style={
                      !targetGroupKey &&
                      ((taskMemberInfo.followUKeyArray &&
                        taskMemberInfo.followUKeyArray.indexOf(
                          taskMemberItem.userId
                        ) !== -1) ||
                        taskMemberInfo.executorKey === taskMemberItem.userId ||
                        taskMemberInfo.creatorKey === taskMemberItem.userId)
                        ? { display: "flex" }
                        : {}
                    }
                  >
                    {!targetGroupKey &&
                    ((taskMemberInfo.followUKeyArray &&
                      taskMemberInfo.followUKeyArray.indexOf(
                        taskMemberItem.userId
                      ) !== -1) ||
                      taskMemberInfo.creatorKey === taskMemberItem.userId) ? (
                      <img
                        src={eyeSvg}
                        alt=""
                        style={{
                          width: "16px",
                          height: "19px",
                        }}
                      />
                    ) : (
                      <img
                        src={uneyeSvg}
                        alt=""
                        style={{
                          width: "16px",
                          height: "19px",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          }
        )
      ) : (
        <Empty />
      )}
    </div>
  );
};
TaskMember.defaultProps = {};
export default TaskMember;
