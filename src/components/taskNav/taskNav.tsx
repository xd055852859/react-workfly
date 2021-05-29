import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Tooltip, Input, Avatar, Progress } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";
import { useTypedSelector } from "../../redux/reducer/RootState";

import { getWorkingTableTask } from "../../redux/actions/taskActions";
import {
  getGroupTask,
  setChooseKey,
  changeLabelarray,
} from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";
import { changeMusic } from "../../redux/actions/authActions";

import DropMenu from "../common/dropMenu";
import Dialog from "../common/dialog";
import Loading from "../common/loading";
import "./taskNav.css";
import plusPng from "../../assets/img/plus.png";
import ellipsisPng from "../../assets/img/ellipsis.png";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import checkPersonPng from "../../assets/img/checkPerson.png";

const { TextArea } = Input;
interface TaskNavProps {
  avatar?: any;
  executorKey?: any;
  name: string;
  role: string | number;
  colorIndex: number;
  taskNavArray: any;
  taskNavWidth: number | string;
  setChooseLabelKey?: any;
  chooseLabelKey?: string;
  batchTaskArray?: any;
  changeLabelAvatar?: any;
  arrlength?: number;
  taskNavTask?: any;
  changeLabelTaskType?: any;
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
    changeLabelAvatar,
    taskNavTask,
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
  const dispatch = useDispatch();
  const [labelName, setLabelName] = useState("");
  const [labelNameVisible, setLabelNameVisible] = useState(false);
  const [labelAvatar, setLabelAvatar] = useState("");
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
        dispatch(setMessage(true, "新建成功,请清除过滤项后查看", "warning"));
      } else {
        dispatch(setMessage(true, "新增任务成功", "success"));
      }
      dispatch(changeMusic(5));
      dispatch(setChooseKey(addTaskRes.result._key));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
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
          newLabelName: labelName,
        });
      } else {
        api.group.setCardLabel({
          groupKey: groupInfo._key,
          newLabelName: labelName,
        });
      }
    }
    setLabelNameVisible(false);
  };
  const changeDefaultExecutor = (executorItem: any, labelKey: string) => {
    let key = labelKey ? labelKey : taskNavArray[0]._key;
    let type = labelKey ? 1 : 2;
    let targetKey = "";
    if (executorItem.userId === executorKey) {
      targetKey = "";
      setLabelAvatar(defaultPersonPng);
      changeLabelAvatar(
        {
          executorKey: "",
          executorAvatar: "",
          executorNickName: "",
        },
        colorIndex
      );
    } else {
      targetKey = executorItem ? executorItem.userId : null;
      setLabelAvatar(executorItem.avatar);
      changeLabelAvatar(executorItem, colorIndex);
    }
    api.group.setLabelOrGroupExecutorKey(key, targetKey, type);
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
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
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
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
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
      {taskNavArray && taskNavArray[0] && taskNavArray[1] ? (
        <div
          className="taskNav-container"
          style={
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
              style={{
                maxWidth: "calc(100% - 55px)",
              }}
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
                  <Avatar
                    size={30}
                    icon={
                      <img
                        src={
                          labelAvatar
                            ? labelAvatar +
                              "?imageMogr2/auto-orient/thumbnail/80x"
                            : defaultPersonPng
                        }
                        alt=""
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = defaultPersonPng;
                        }}
                      />
                    }
                  />
                  <DropMenu
                    visible={
                      (taskNavArray[1]._key === chooseLabelKey ||
                        taskNavArray[0]._key === chooseLabelKey) &&
                      avatarVisible
                    }
                    dropStyle={{
                      width: "80%",
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
                    <div className="defaultExecutor-info">
                      {groupMemberArray
                        ? groupMemberArray.map(
                            (
                              groupMemberItem: any,
                              groupMemberIndex: number
                            ) => {
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
                                    <Avatar
                                      size={26}
                                      icon={
                                        <img
                                          src={
                                            groupMemberItem.avatar
                                              ? groupMemberItem.avatar +
                                                "?imageMogr2/auto-orient/thumbnail/80x"
                                              : defaultPersonPng
                                          }
                                          alt=""
                                          onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultPersonPng;
                                          }}
                                        />
                                      }
                                      style={{ marginRight: "10px" }}
                                    />
                                    {groupMemberItem.nickName}
                                  </div>
                                  {executorKey === groupMemberItem.userId ? (
                                    <img
                                      src={checkPersonPng}
                                      alt=""
                                      style={{
                                        width: "20px",
                                        height: "12px",
                                      }}
                                    />
                                  ) : null}
                                </div>
                              );
                            }
                          )
                        : null}
                    </div>
                  </DropMenu>
                </div>
              ) : null}
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
                      if (role > 0 && role < 4 && headerIndex === 3) {
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
                  title={allNum - unFinsihNum + " / " + allNum}
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
                <DropMenu
                  visible={
                    (taskNavArray[1]._key + "" === chooseLabelKey ||
                      taskNavArray[0]._key + "" === chooseLabelKey) &&
                    batchVisible
                  }
                  dropStyle={{
                    width: "150px",
                    top: "45px",
                    left: "190px",
                    color: "#333",
                  }}
                  onClose={() => {
                    setChooseLabelKey("");
                    setBatchVisible(false);
                    setTaskTypeVisible(false);
                  }}
                  title={"设置频道"}
                >
                  <div className="taskNav-set">
                    {role > 0 && role < 4 ? (
                      <div onClick={batchTaskArray}>归档全部已完成任务</div>
                    ) : null}
                    {role > 0 && role < 4 && headerIndex === 3 ? (
                      <div
                        onClick={() => {
                          setTaskTypeVisible(true);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        任务类型
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
                        <DropMenu
                          visible={taskTypeVisible}
                          onClose={() => {
                            setTaskTypeVisible(false);
                          }}
                          // title={'默认任务类型'}
                          dropStyle={{
                            width: "65px",
                            height: "120px",
                            left: "8px",
                            top: "0px",
                          }}
                        >
                          {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                            return (
                              <div
                                key={"taskType" + taskTypeIndex}
                                className="taskNav-taskType"
                                style={{
                                  backgroundColor:
                                    backgroundColor[taskTypeIndex],
                                  color: color[taskTypeIndex],
                                  height: "20px",
                                  lineHeight: "20px",
                                  fontSize: "10px",
                                }}
                                onClick={() => {
                                  setTaskTypeIndex(taskTypeIndex);
                                  setTaskTypeVisible(false);
                                  changeDefaultTaskType(taskTypeItem.id);
                                }}
                              >
                                {taskTypeItem.name}
                              </div>
                            );
                          })}
                        </DropMenu>
                      </div>
                    ) : null}
                    <div
                      onClick={() => {
                        setBatchAddVisible(true);
                      }}
                    >
                      批量导入
                    </div>
                    {role > 0 && role < 3 && taskNavArray[1]._key ? (
                      <div
                        onClick={() => {
                          setDeleteVisible(true);
                        }}
                      >
                        删除频道
                      </div>
                    ) : null}
                  </div>
                </DropMenu>
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
          {(taskNavArray[1]._key + "" === chooseLabelKey ||
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
                    if (e.keyCode === 13 && !loading) {
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
