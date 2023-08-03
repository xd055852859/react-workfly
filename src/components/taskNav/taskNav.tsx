import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Tooltip, Input, Progress, Dropdown } from "antd";
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";
import { useTypedSelector } from "../../redux/reducer/RootState";

import { getGroupInfo } from "../../redux/actions/groupActions";
import {
  getGroupTask,
  setChooseKey,
  changeLabelarray,
  getWorkingTableTask,
} from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";
import { changeMusic } from "../../redux/actions/authActions";

import IconFont from "../../components/common/iconFont";
import DropMenu from "../common/dropMenu";
import Dialog from "../common/dialog";
import Loading from "../common/loading";
import "./taskNav.css";
import plusPng from "../../assets/img/plus.png";
import ellipsisPng from "../../assets/img/ellipsis.png";
import AvatarIcon from "../common/avatar";
import eyeSvg from "../../assets/svg/eye.svg";
import uneyeSvg from "../../assets/svg/uneye.svg";

const { TextArea, Search } = Input;
interface TaskNavProps {
  avatar?: any;
  executorKey?: any;
  name: string;
  role: string | number;
  colorIndex: number;
  taskNavArray?: any;
  taskNavWidth: number | string;
  setChooseLabelKey?: any;
  chooseLabelKey?: string;
  batchTaskArray?: any;
  changeLabelAvatar?: any;
  arrlength?: number;
  taskNavTask?: any;
  changeLabelTaskType?: any;
  type?: string;
  followList?: any;
  changeFollowList?: any;
}
const TaskNav: React.FC<TaskNavProps> = (prop) => {
  const {
    avatar,
    executorKey,
    name,
    role,
    colorIndex,
    taskNavArray,
    setChooseLabelKey,
    chooseLabelKey,
    batchTaskArray,
    // changeLabelAvatar,
    taskNavTask,
    type,
    followList,
    changeFollowList,
  } = prop;
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const clickType = useTypedSelector((state) => state.auth.clickType);
  const dispatch = useDispatch();
  const [labelName, setLabelName] = useState("");
  const [labelNameVisible, setLabelNameVisible] = useState(false);
  const [labelAvatar, setLabelAvatar] = useState<any>("");
  const [batchVisible, setBatchVisible] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [batchAddVisible, setBatchAddVisible] = useState(false);
  const [batchAddText, setBatchAddText] = useState("");
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [taskTypeVisible, setTaskTypeVisible] = useState(false);

  const [addInput, setAddInput] = useState("");
  const [unFinsihNum, setUnFinsihNum] = useState(0);
  const [taskTypeIndex, setTaskTypeIndex] = useState<any>(null);
  const [allNum, setAllNum] = useState(0);
  const [moveState, setMoveState] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [searchMemberInput, setSearchMemberInput] = useState("");
  const [searchMemberArray, setSearchMemberArray] = useState<any>([]);
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
  const taskNavRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (avatar) {
      setLabelAvatar(avatar);
    }
  }, [avatar]);
  // useEffect(() => {
  //   if (taskNavArray && taskNavArray[1] && taskNavArray[1].taskType) {
  //     setTaskTypeIndex(taskNavArray[1].taskType);
  //   }
  // }, [taskNavArray]);

  useEffect(() => {
    if (name) {
      setLabelName(name);
    }
  }, [name]);
  useEffect(() => {
    if (taskNavTask) {
      let unfinishNum = 0;
      let allNum = 0;
      taskNavTask.forEach((item: any, index: number) => {
        // if (item.show) {
        if (item.finishPercent === 0) {
          unfinishNum++;
        }
        allNum++;
        // }
      });
      setUnFinsihNum(unfinishNum);
      setAllNum(allNum);
    }
  }, [taskNavTask]);
  useEffect(() => {
    if (searchMemberInput) {
      setSearchMemberArray((prevSearchMemberArray) => {
        prevSearchMemberArray = groupMemberArray.filter(
          (item: any, index: number) => {
            return (
              item.nickName &&
              item.nickName
                .toUpperCase()
                .indexOf(searchMemberInput.toUpperCase()) !== -1
            );
          }
        );
        return [...prevSearchMemberArray];
      });
    } else {
      setSearchMemberArray(groupMemberArray);
    }
  }, [searchMemberInput, groupMemberArray]);
  const BgColorArray = [
    "rgba(48,191,191,0.3)",
    "rgba(0,170,255,0.3)",
    "rgba(143,126,230,0.3)",
    "rgba(179,152,152,0.3)",
    "rgba(242,237,166,0.3)",
  ];
  const taskNavBgColor = colorIndex % 5;
  const addTask = async (groupInfo: any, labelInfo: any) => {
    let obj: any = {};
    if (addInput === "") {
      setAddTaskVisible(false);
      return;
    }
    if (mainGroupKey === groupInfo._key) {
      labelInfo.executorKey = user._key;
    }
    if (urlInput) {
      obj = {
        url:
          urlInput.indexOf("http://") !== -1 ||
          urlInput.indexOf("https://") !== -1
            ? urlInput
            : "http://" + urlInput,
      };
    }
    setLoading(true);
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.groupRole,
      taskType:
        taskTypeArr[taskTypeIndex] && taskTypeArr[taskTypeIndex].id
          ? taskTypeArr[taskTypeIndex].id
          : 1,
      labelKey: labelInfo._key,
      executorKey: labelInfo.executorKey,
      title: addInput,
      extraData: obj,
    });
    if (addTaskRes.msg === "OK") {
      if (
        filterObject.creatorKey ||
        filterObject.executorKey ||
        filterObject.groupKey ||
        filterObject.filterType.indexOf("今天") === -1
      ) {
        dispatch(
          setMessage(true, "新建成功,如果未显示请清除过滤项后查看", "warning")
        );
      } else {
        dispatch(setMessage(true, "新增任务成功", "success"));
      }
      dispatch(changeMusic(5));
      dispatch(setChooseKey(addTaskRes.result._key));
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
      // setAddTaskVisible(false);
      setAddInput("");
      setUrlInput("");
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const changeLabelName = (labelInfo: any, groupInfo: any) => {
    if (labelName === "") {
      setLabelName(name);
      setLabelNameVisible(false);
      dispatch(setMessage(true, "频道名不能为空", "error"));
      return;
    }
    if (labelName !== name) {
      if (labelInfo._key) {
        api.group.setCardLabel({
          labelKey: labelInfo._key,
          newLabelName: labelName ? labelName.replace("个人事务 /", "") : "",
        });
      } else {
        api.group.setCardLabel({
          groupKey: groupInfo._key,
          newLabelName: labelName ? labelName.replace("个人事务 /", "") : "",
        });
      }
    }
    setLabelNameVisible(false);
  };
  const changeDefaultExecutor = async (
    executorItem: any,
    labelKey: string,
    cleartype?: string
  ) => {
    let key = labelKey ? labelKey : taskNavArray[0]._key;
    let type = labelKey ? 1 : 2;
    let targetKey = null;
    if (cleartype === "clear") {
      targetKey = null;
      setLabelAvatar(null);
      // changeLabelAvatar(
      //   {
      //     executorKey: null,
      //     executorAvatar: "",
      //     executorNickName: "",
      //   },
      //   colorIndex
      // );
    } else {
      targetKey = executorItem ? executorItem.userId : null;
      setLabelAvatar(executorItem.avatar);
      // changeLabelAvatar(executorItem, colorIndex);
    }
    let res: any = await api.group.setLabelOrGroupExecutorKey(
      key,
      targetKey,
      type
    );
    if (res.msg === "OK") {
      // setCompanyGroupList(res.result);
      if (headerIndex === 3) {
        dispatch(getGroupInfo(groupKey));
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      }
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const changeDefaultFollow = (followItem: any, labelKey: string) => {
    let newFollowList = _.cloneDeep(followList);
    let followKeyList: any = [];

    let followIndex = _.findIndex(newFollowList[colorIndex], {
      _key: followItem.userId,
    });
    if (followIndex !== -1) {
      newFollowList[colorIndex].splice(followIndex, 1);
    } else {
      newFollowList[colorIndex].push({
        _key: followItem.userId,
        name: followItem.nickName,
        avatar: followItem.avatar,
      });
    }
    let key = labelKey ? labelKey : taskNavArray[0]._key;
    let type = labelKey ? 1 : 2;
    changeFollowList([...newFollowList]);
    newFollowList[colorIndex].forEach((item, index) => {
      if (item._key) {
        followKeyList.push(item._key);
      }
    });
    if (headerIndex === 3) {
      dispatch(getGroupInfo(groupKey));
    }
    api.group.setLabelOrGroupFollowUKeyArray(key, followKeyList, type);
  };
  const changeDefaultTaskType = (taskType: number) => {
    let newLabelArray = _.cloneDeep(labelArray);
    let key = taskNavArray[1]._key
      ? taskNavArray[1]._key
      : taskNavArray[0]._key;
    let newlabelName = labelName;
    if (headerIndex !== 3) {
      newlabelName = labelName.split(" / ")[1];
    }
    if (taskNavArray[1]._key) {
      let labelIndex = _.findIndex(newLabelArray, {
        _key: taskNavArray[1]._key,
      });
      newLabelArray[labelIndex].cardLabelName = newlabelName;
      newLabelArray[labelIndex].taskType = taskType;
      api.group.setCardLabel({
        labelKey: key,
        taskType: taskType,
      });
    } else {
      newLabelArray[0].cardLabelName = newlabelName;
      newLabelArray[0].taskType = taskType;
      api.group.setCardLabel({
        groupKey: key,
        taskType: taskType,
      });
    }
    dispatch(changeLabelarray(newLabelArray));
  };
  const batchAddTask = async () => {
    setBatchLoading(true);
    let batchTaskRes: any = await api.task.batchCard(
      batchAddText,
      taskNavArray[0]._key,
      taskNavArray[1]._key
    );
    setBatchLoading(false);
    if (batchTaskRes.msg === "OK") {
      dispatch(setMessage(true, "新增成功", "success"));
      dispatch(changeMusic(5));
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
      setBatchAddVisible(false);
    } else {
      dispatch(setMessage(true, batchTaskRes.msg, "error"));
    }
  };
  const deleteLabel = async () => {
    let deleteLabelRes: any = await api.task.deleteTaskLabel(
      taskNavArray[0]._key,
      taskNavArray[1]._key
    );
    if (deleteLabelRes.msg === "OK") {
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
      setBatchAddVisible(false);
    } else {
      dispatch(setMessage(true, deleteLabelRes.msg, "error"));
    }
  };
  return (
    <React.Fragment>
      {(taskNavArray && taskNavArray[0] && taskNavArray[1]) ||
      type === "person" ? (
        <div
          className="taskNav-container"
          style={
            taskNavArray &&
            (taskNavArray[1]._key + "" === chooseLabelKey ||
              taskNavArray[0]._key + "" === chooseLabelKey) &&
            addTaskVisible
              ? {
                  minHeight: "172px",
                }
              : { height: "60px" }
          }
        >
          <div
            className="taskNav"
            style={{
              backgroundColor: BgColorArray[taskNavBgColor],
              marginRight: headerIndex === 3 ? "15px" : "0px",
            }}
          >
            <div
              className="taskNav-name-info"
              // style={{
              //   maxWidth: "calc(100% - 55px)",
              // }}
              ref={taskNavRef}
            >
              {avatar ? (
                <div
                  className="taskNav-avatar"
                  onClick={() => {
                    if (role > 0 && role < 4 && headerIndex === 3) {
                      setChooseLabelKey(
                        taskNavArray[1]._key
                          ? taskNavArray[1]._key
                          : taskNavArray[0]._key
                      );
                      setAvatarVisible(true);
                    }
                  }}
                >
                  <AvatarIcon
                    avatar={labelAvatar}
                    name={labelName}
                    type={"group"}
                    index={colorIndex}
                  />
                </div>
              ) : null}
              {/* {followList &&
              followList[colorIndex] &&
              followList[colorIndex].length > 0 ? (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => {
                    if (role > 0 && role < 4 && headerIndex === 3) {
                      setChooseLabelKey(
                        taskNavArray[1]._key
                          ? taskNavArray[1]._key
                          : taskNavArray[0]._key
                      );
                      setAvatarVisible(true);
                    }
                  }}
                >
                  <Avatar.Group
                    size={25}
                    maxCount={3}
                    maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {followList[colorIndex].map((followItem, followIndex) => {
                      return (
                        <Tooltip
                          title={followItem?.nickName}
                          key={avatar + "followIndex"}
                        >
                          {followItem?.avatar ? (
                            <Avatar src={followItem.avatar} />
                          ) : (
                            <Avatar style={{ backgroundColor: "#1890ff" }}>
                              {followItem.name.substring(0, 1)}
                            </Avatar>
                          )}
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>{" "}
                </div>
              ) : null} */}
              <DropMenu
                visible={
                  taskNavArray &&
                  (taskNavArray[1]._key === chooseLabelKey ||
                    taskNavArray[0]._key === chooseLabelKey) &&
                  avatarVisible
                }
                dropStyle={{
                  width: "90%",
                  height: "350px",
                  top: "45px",
                  color: "#333",
                }}
                onClose={() => {
                  setChooseLabelKey("");
                  setAvatarVisible(false);
                }}
                title={"设置默认执行人"}
              >
                <div className="defaultExecutor-search">
                  <Search
                    placeholder="请输入执行人名称"
                    value={searchMemberInput}
                    autoComplete="off"
                    onChange={(e) => {
                      setSearchMemberInput(e.target.value);
                    }}
                    allowClear={false}
                    style={{ width: "calc(100% - 50px)", height: "30px" }}
                  />
                  <Tooltip title="清除执行人">
                    <Button
                      size="large"
                      shape="circle"
                      style={{ border: "0px" }}
                      ghost
                      icon={
                        <IconFont
                          type="icon-saoba1"
                          style={{ fontSize: "25px" }}
                        />
                      }
                      onClick={() => {
                        changeDefaultExecutor(
                          {},
                          taskNavArray[1]._key,
                          "clear"
                        );
                      }}
                    />
                  </Tooltip>
                </div>
                <div className="defaultExecutor-info">
                  {searchMemberArray
                    ? searchMemberArray.map(
                        (groupMemberItem: any, groupMemberIndex: number) => {
                          return (
                            <div
                              key={"groupMember" + groupMemberIndex}
                              className="defaultExecutor-info-item"
                              style={{ justifyContent: "space-between" }}
                              onClick={() => {
                                changeDefaultExecutor(
                                  groupMemberItem,
                                  taskNavArray[1]._key
                                );
                              }}
                            >
                              <div className="defaultExecutor-info-left">
                                <AvatarIcon
                                  avatar={groupMemberItem?.avatar}
                                  name={groupMemberItem?.nickName}
                                  type={"person"}
                                  index={0}
                                  size={30}
                                />

                                <span style={{ marginLeft: "5px" }}>
                                  {groupMemberItem.nickName}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {executorKey === groupMemberItem.userId ? (
                                  <CheckOutlined />
                                ) : null}
                                {followList ? (
                                  <div
                                    className="task-executor-dropMenu-follow"
                                    onClick={(e: any) => {
                                      e.stopPropagation();
                                      changeDefaultFollow(
                                        groupMemberItem,
                                        taskNavArray[1]._key
                                      );
                                      // if (!targetGroupKey) {
                                      //   changeFollow(taskMemberItem.userId);
                                      // }
                                    }}
                                    style={
                                      _.findIndex(followList[colorIndex], {
                                        _key: groupMemberItem.userId,
                                      }) !== -1
                                        ? { display: "flex" }
                                        : {}
                                    }
                                  >
                                    {_.findIndex(followList[colorIndex], {
                                      _key: groupMemberItem.userId,
                                    }) !== -1 ? (
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
                                ) : null}
                              </div>
                            </div>
                          );
                        }
                      )
                    : null}
                </div>
              </DropMenu>
              {!labelNameVisible ? (
                <Tooltip
                  title={
                    labelName.split("_")[1] !== "副本" &&
                    labelName.split("_")[1]
                      ? labelName.split("_")[0] + "/" + labelName.split("/")[1]
                      : labelName
                  }
                  getPopupContainer={() => taskNavRef.current}
                >
                  <div
                    className="taskNav-name"
                    onClick={() => {
                      if (
                        (role > 0 && role < 4 && headerIndex === 3) ||
                        (clickType === "self" && headerIndex === 2)
                      ) {
                        setLabelNameVisible(true);
                      }
                    }}
                  >
                    {labelName.split("_")[1] !== "副本" &&
                    labelName.split("_")[1]
                      ? labelName.split("_")[0] + "/" + labelName.split("/")[1]
                      : labelName}
                  </div>
                </Tooltip>
              ) : (
                <input
                  // variant="outlined"
                  placeholder="请输入标题名"
                  onChange={(e: any) => {
                    setLabelName(e.target.value);
                  }}
                  className="taskNav-input"
                  value={labelName}
                  onBlur={() => {
                    changeLabelName(taskNavArray[1], taskNavArray[0]);
                  }}
                />
              )}
              {unFinsihNum || allNum ? (
                // <div style={{ width: '20px', height: '20px' }}>
                <Tooltip
                  title={
                    "完成" +
                    Math.round(((allNum - unFinsihNum) / allNum) * 100) +
                    "%"
                  }
                  getPopupContainer={() => taskNavRef.current}
                >
                  <Progress
                    percent={Math.round(
                      ((allNum - unFinsihNum) / allNum) * 100
                    )}
                    type="circle"
                    size="small"
                    status="active"
                    width={35}
                    format={() => allNum}
                    // style={{ zoom: 0.3, color: '#fff' }}
                  />
                </Tooltip>
              ) : // </div>
              null}
            </div>

            {/* {!taskNavArray[1]._key ? (
              <img
                src={unDragPng}
                alt=""
                style={{ width: '17px', height: '20px' }}
              />
            ) : null} */}

            {role > 0 && role < 5 ? (
              <div className="taskNav-name-info">
                <div
                  className="icon-container"
                  onClick={() => {
                    if (headerIndex !== 3) {
                      setChooseLabelKey(
                        taskNavArray[1]._key
                          ? taskNavArray[1]._key
                          : taskNavArray[0]._key
                      );
                      setAddTaskVisible(true);
                      setBatchVisible(false);
                    }
                  }}
                >
                  <img src={plusPng} className="taskNav-name-plus" alt="" />
                </div>
                {type !== "person" ? (
                  <Dropdown
                    visible={
                      taskNavArray &&
                      (taskNavArray[1]._key + "" === chooseLabelKey ||
                        taskNavArray[0]._key + "" === chooseLabelKey) &&
                      batchVisible
                    }
                    trigger={["click"]}
                    overlay={
                      <div className="dropDown-box">
                        <div className="taskNav-set">
                          {role > 0 && role < 4 ? (
                            <div onClick={batchTaskArray}>
                              归档全部已完成任务
                            </div>
                          ) : null}
                          {role > 0 && role < 4 && headerIndex === 3 ? (
                            <Dropdown
                              visible={taskTypeVisible}
                              trigger={["click"]}
                              overlay={
                                <>
                                  {taskTypeArr.map(
                                    (taskTypeItem, taskTypeIndex) => {
                                      return (
                                        <div
                                          key={"taskType" + taskTypeIndex}
                                          className="taskNav-taskType"
                                          style={{
                                            backgroundColor:
                                              backgroundColor[taskTypeIndex],
                                            color: color[taskTypeIndex],
                                            height: "35px",
                                            lineHeight: "35px",
                                            fontSize: "10px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            console.log(">????");
                                            setTaskTypeIndex(taskTypeIndex);
                                            setTaskTypeVisible(false);
                                            changeDefaultTaskType(
                                              taskTypeItem.id
                                            );
                                          }}
                                        >
                                          {taskTypeItem.name}
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              }
                            >
                              <div
                                onClick={() => {
                                  setTaskTypeVisible(true);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                卡片默认类型
                                <div
                                  style={{
                                    backgroundColor: color[taskTypeIndex],
                                    borderRadius: "50%",
                                    width: "15px",
                                    height: "15px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                ></div>
                              </div>
                            </Dropdown>
                          ) : null}
                          <div
                            onClick={() => {
                              setBatchAddVisible(true);
                            }}
                          >
                            批量导入
                          </div>
                          {taskNavArray &&
                          role > 0 &&
                          role < 4 &&
                          taskNavArray[1]._key ? (
                            <div
                              onClick={() => {
                                setDeleteVisible(true);
                              }}
                            >
                              删除频道
                            </div>
                          ) : null}
                        </div>
                      </div>
                    }
                    // dropStyle={{
                    //   width: "150px",
                    //   top: "45px",
                    //   left: "190px",
                    //   color: "#333",
                    // }}
                    onVisibleChange={(visible) => {
                      if (!visible) {
                        setChooseLabelKey("");
                        setBatchVisible(false);
                        setTaskTypeVisible(false);
                      }
                    }}
                    // onClose={() => {}}
                  >
                    <div
                      className="icon-container"
                      onClick={() => {
                        setChooseLabelKey(
                          taskNavArray[1]._key
                            ? taskNavArray[1]._key
                            : taskNavArray[0]._key
                        );
                        setBatchVisible(true);
                        setAddTaskVisible(false);
                        if (
                          taskNavArray &&
                          taskNavArray[1]._key &&
                          taskTypeIndex === null
                        ) {
                          let taskType = taskNavArray[1]._key
                            ? taskNavArray[1].taskType
                            : taskNavArray[0].taskType;
                          taskTypeArr.forEach((item: any, index: number) => {
                            if (item.id === taskType) {
                              setTaskTypeIndex(index);
                            }
                          });
                        }
                      }}
                    >
                      <img
                        src={ellipsisPng}
                        className="taskNav-name-ellipsis"
                        alt=""
                      />
                    </div>
                  </Dropdown>
                ) : null}
                {/* <DropMenu
                visible={addTaskVisible}
                dropStyle={{
                  width: '100%',
                  top: '60px',
                  left: '0px',
                  color: '#333',
                }}
                onClose={() => {
                  setAddTaskVisible(false);
                  setAddInput('');
                }}
                title={'新增任务'}
              >
                
              </DropMenu> */}
              </div>
            ) : null}
            <Dialog
              visible={batchAddVisible}
              onClose={() => {
                setBatchAddVisible(false);
              }}
              onOK={() => {
                batchAddTask();
              }}
              title={"批量导入"}
              dialogStyle={{ width: "500px", height: "450px" }}
            >
              <div className="taskNav-textarea-container">
                {batchLoading ? <Loading /> : null}
                <textarea
                  value={batchAddText}
                  onChange={(e: any) => {
                    setBatchAddText(e.target.value);
                  }}
                  className="taskNav-textarea"
                  placeholder="换行新建多个任务"
                ></textarea>
              </div>
            </Dialog>
            <Dialog
              visible={deleteVisible}
              onClose={() => {
                setDeleteVisible(false);
              }}
              onOK={() => {
                deleteLabel();
                setDeleteVisible(false);
              }}
              title={"删除频道"}
              dialogStyle={{ width: "300px", height: "200px" }}
            >
              <div className="deleteLabel-container">是否删除该频道</div>
            </Dialog>
          </div>
          {taskNavArray &&
          (taskNavArray[1]._key + "" === chooseLabelKey ||
            taskNavArray[0]._key + "" === chooseLabelKey) &&
          addTaskVisible &&
          headerIndex !== 3 ? (
            <div className="taskItem-plus-title taskNav-plus-title">
              <div className="taskItem-plus-input">
                <TextArea
                  autoSize={{ minRows: 1 }}
                  placeholder="任务标题"
                  value={addInput}
                  autoComplete="off"
                  onChange={(e: any) => {
                    setAddInput(e.target.value);
                  }}
                  style={{ width: "100%" }}
                  onKeyDown={(e: any) => {
                    if (e.shiftKey && e.keyCode === 13) {
                      setAddInput(e.target.value + "\n");
                    } else if (e.keyCode === 13 && !loading) {
                      e.preventDefault();
                      addTask(taskNavArray[0], taskNavArray[1]);
                    }
                  }}
                />
              </div>
              <div
                className="taskItem-plus-button"
                style={{ marginTop: "10px" }}
              >
                <div className="taskNav-url">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<GlobalOutlined />}
                    ghost
                    style={{ border: "0px", color: "#fff" }}
                    onClick={() => {
                      setMoveState(true);
                    }}
                  />

                  <input
                    className="taskNav-url-input"
                    value={urlInput}
                    onChange={(e: any) => {
                      setUrlInput(e.target.value);
                    }}
                    placeholder="请输入链接地址"
                    style={
                      moveState
                        ? {
                            animation: "urlOut 500ms",
                            animationFillMode: "forwards",
                          }
                        : {}
                    }
                  />
                </div>
                <Button
                  ghost
                  onClick={() => {
                    setChooseLabelKey("");
                    setAddTaskVisible(false);
                    setAddInput("");
                    setUrlInput("");
                    setMoveState(false);
                  }}
                  style={{ marginRight: "10px", border: "0px" }}
                >
                  取消
                </Button>

                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => {
                    addTask(taskNavArray[0], taskNavArray[1]);
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
      ) : null}
    </React.Fragment>
  );
};
TaskNav.defaultProps = {
  avatar: null,
  name: "",
  role: 0,
  colorIndex: 0,
  taskNavArray: null,
  taskNavWidth: "",
  setChooseLabelKey: null,
  chooseLabelKey: "",
  batchTaskArray: null,
};
export default TaskNav;
