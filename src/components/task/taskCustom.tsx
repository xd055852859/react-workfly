import React, { useState, useEffect, useRef, useCallback } from "react";
import "./task.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import _ from "lodash";

import { useMount } from "../../hook/common";
import { editTask, setTaskInfo } from "../../redux/actions/taskActions";

import Avatar from "../common/avatar";
import Empty from "../common/empty";
const { Search } = Input;
interface TaskCustomProps {
  targetGroupKey?: string;
  onClose?: any;
}

const TaskCustom: React.FC<TaskCustomProps> = (props) => {
  const { targetGroupKey } = props;
  const dispatch = useDispatch();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  // const taskCustomVisible = useTypedSelector(
  //   (state) => state.common.taskMemberVisible
  // );
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
      taskMemberRes = await api.group.getCustomList(groupKey, 1, 1000);
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
    if (targetGroupKey) {
      getTaskMemberArray(targetGroupKey, taskInfo);
    }
  }, [targetGroupKey, taskInfo, getTaskMemberArray]);
  useEffect(() => {
    if (!searchInput && taskMemberArray) {
      const newTaskMemberArray = _.cloneDeep(taskMemberArray);
      setSearchMemberArray(newTaskMemberArray);
    }
  }, [searchInput, taskMemberArray]);

  const changeCustom = (
    customUKey: number | string,
    customUName: string,
    customUAvatar: string
  ) => {
    let newTaskDetail = _.cloneDeep(taskMemberInfo);
    newTaskDetail.customUKey = customUKey;
    newTaskDetail.customName = customUName;
    newTaskDetail.customAvatar = customUAvatar;
    dispatch(setTaskInfo(newTaskDetail));
    dispatch(
      editTask(
        {
          key: newTaskDetail._key,
          customUKey: customUKey,
          customAvatar: customUAvatar,
          customName: customUName,
        },
        headerIndex
      )
    );
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
      </div>

      {searchMemberArray.length > 0 ? (
        searchMemberArray.map(
          (taskMemberItem: any, taskMemberIndex: number) => {
            return (
              <div
                className="task-executor-dropMenu-container"
                key={"taskMember" + taskMemberIndex}
                onClick={() => {
                  changeCustom(
                    taskMemberItem._key,
                    taskMemberItem.nickName,
                    taskMemberItem.avatar
                  );
                  // dispatch(changeTaskMemberVisible(false, 0, 0));
                }}
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
                  <div>{taskMemberItem.nickName}</div>
                </div>
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
TaskCustom.defaultProps = {};
export default TaskCustom;
