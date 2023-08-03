import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../workingTable/workingTableLabel.css";
import "./groupTableGroup.css";
import api from "../../services/api";
import _ from "lodash";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, Modal, Tooltip } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/auth";
import { useMount } from "../../hook/common";

import { getGroupTask, setChooseKey } from "../../redux/actions/taskActions";
import { changeMusic } from "../../redux/actions/authActions";
import { setMessage } from "../../redux/actions/commonActions";

import format from "../../components/common/format";
import Task from "../../components/task/task";
import TaskNav from "../../components/taskNav/taskNav";
import Loading from "../../components/common/loading";
import Avatar from "../../components/common/avatar";
import DropMenu from "../../components/common/dropMenu";

import checkPersonPng from "../../assets/img/checkPerson.png";
import defaultPerson from "../../assets/img/defaultPerson.png";
import taskAddPng from "../../assets/img/contact-add.png";
import IconFont from "../../components/common/iconFont";

const { TextArea, Search } = Input;
interface GroupTableGroupProps {
  setFinishPercent?: any;
  setFinishNumber?: any;
}
const GroupTableGroup: React.FC<GroupTableGroupProps> = (prop) => {
  const { setFinishPercent, setFinishNumber } = prop;
  const { deviceWidth } = useAuth();
  const user = useTypedSelector((state) => state.auth.user);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );

  const [groupTaskArray, setGroupTaskArray] = useState<any>([]);
  const [taskNumber] = useState(() => {
    return Math.ceil((document.documentElement.offsetHeight - 128) / 70);
  });
  const [taskLoadInfo, setTaskLoadInfo] = useState<any>([]);
  const [taskNameArr, setTaskNameArr] = useState<any>([]);
  const [labelExecutorArray, setLabelExecutorArray] = useState<any>([]);
  const [labelFollowArray, setLabelFollowArray] = useState<any>([]);

  // const [labelIndex, setLabelIndex] = useState<any>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const [addLabelInput, setAddLabelInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [chooseLabelKey, setChooseLabelKey] = useState("");
  const [moveState, setMoveState] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [defaultItem, setDefaultItem] = useState<any>({});
  const [defaultKey, setDefaultKey] = useState<any>(null);

  const [avatarVisible, setAvatarVisible] = useState(false);
  const [searchMemberInput, setSearchMemberInput] = useState("");
  const [searchMemberArray, setSearchMemberArray] = useState<any>([]);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const dispatch = useDispatch();
  const containerRef: React.RefObject<any> = useRef();
  const labelIndex = useRef<any>();
  const { deviceType } = useAuth();
  useMount(() => {
    setLoading(true);
  });

  useEffect(() => {
    if (taskLoadInfo) {
      setTaskLoading(false);
    }
  }, [taskLoadInfo]);

  const getData = useCallback(
    (labelArray: any, taskArray: any, filterObject: any) => {
      let taskNameArr: any = [];
      let labelExecutorArray: any = [];
      let labelFollowArray: any = [];
      let groupTaskArray: any = [];

      let finishPercentArray1: any = [];
      let finishPercentArray2: any = [];
      let finishPercentArray10: any = [];
      labelArray.forEach((item: any, index: any) => {
        groupTaskArray[index] = [];
        labelFollowArray[index] = [];
        taskNameArr.push({ name: item.cardLabelName, key: item._key });
        labelExecutorArray.push({
          executorKey: item.executorKey,
          executorAvatar: item.executorAvatar,
          executorNickName: item.executorNickName,
        });
        if (item.followUserList) {
          item.followUserList.forEach((followItem, followIndex) => {
            labelFollowArray[index].push({
              _key: followItem._key,
              name: followItem.name,
              avatar: followItem.avatar,
            });
          });
        }
      });

      taskArray.forEach((item: any) => {
        if (item.finishPercent === 0) {
          for (let i = 0; i < labelArray.length; i++) {
            if (item.labelKey === labelArray[i]._key) {
              let index = labelArray[i].cardOrder.indexOf(item._key);
              groupTaskArray[i][index] = item;
            }
          }
        }
      });
      groupTaskArray = groupTaskArray.map((item: any) => {
        let arr: any = [];
        if (item) {
          for (let i = 0; i < item.length; i++) {
            if (item[i]) {
              arr.push(item[i]);
            }
          }
        }
        return arr;
      });
      taskArray.forEach((item: any) => {
        for (let i = 0; i < labelArray.length; i++) {
          let findIndex = _.findIndex(groupTaskArray[i], ["_key", item._key]);
          if (item.labelKey === labelArray[i]._key && findIndex === -1) {
            if (item.finishPercent === 1) {
              if (!finishPercentArray1[i]) {
                finishPercentArray1[i] = [];
              }
              finishPercentArray1[i].push(item);
            }
            if (item.finishPercent === 2) {
              if (!finishPercentArray2[i]) {
                finishPercentArray2[i] = [];
              }
              finishPercentArray2[i].push(item);
            }
            if (item.finishPercent === 10) {
              if (!finishPercentArray10[i]) {
                finishPercentArray10[i] = [];
              }
              finishPercentArray10[i].push(item);
            }
          }
        }
      });
      let allTaskNumber = 0;
      let finishTaskNumber = 0;
      groupTaskArray = groupTaskArray.map((item: any, index: number) => {
        item = _.cloneDeep(format.formatFilter(item, filterObject));
        if (finishPercentArray1[index]) {
          finishPercentArray1[index] = _.cloneDeep(
            format.formatFilter(finishPercentArray1[index], filterObject)
          );
          item.push(...finishPercentArray1[index]);
          finishTaskNumber =
            finishTaskNumber + finishPercentArray1[index].length;
        }
        if (finishPercentArray2[index]) {
          finishPercentArray2[index] = _.cloneDeep(
            format.formatFilter(finishPercentArray2[index], filterObject)
          );
          item.push(...finishPercentArray2[index]);
          finishTaskNumber =
            finishTaskNumber + finishPercentArray2[index].length;
        }
        if (finishPercentArray10[index]) {
          finishPercentArray10[index] = _.cloneDeep(
            format.formatFilter(finishPercentArray10[index], filterObject)
          );
          item.push(...finishPercentArray10[index]);
        }
        allTaskNumber = allTaskNumber + item.length;
        return item;
      });

      setFinishPercent(
        !isNaN(finishTaskNumber / allTaskNumber)
          ? parseFloat((finishTaskNumber / allTaskNumber).toFixed(1))
          : 0
      );
      setFinishNumber(allTaskNumber - finishTaskNumber);
      setGroupTaskArray(groupTaskArray);
      setTaskNameArr(taskNameArr);
      setLabelExecutorArray(labelExecutorArray);
      setLabelFollowArray(labelFollowArray);
    },
    //eslint-disable-next-line
    []
  );
  useEffect(() => {
    if (taskArray && filterObject) {
      setLoading(false);
      getData(labelArray, taskArray, filterObject);
    }
  }, [taskArray, labelArray, getData, filterObject]);
  useEffect(() => {
    if (groupTaskArray.length > 0) {
      let newTaskLoadInfo: any = [];
      groupTaskArray.forEach((item: any, index: number) => {
        newTaskLoadInfo[index] = item.slice(0, taskNumber + 1);
      });
      setTaskLoadInfo(newTaskLoadInfo);
    }
  }, [groupTaskArray, taskNumber]);

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
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: any,
    destination: any,
    droppableSource: any,
    droppableDestination: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    let cardOrder1: any = [];
    let cardOrder2: any = [];
    let newGroupTaskArray: any = _.cloneDeep(groupTaskArray);
    let labelObject: any = {};
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        newGroupTaskArray[parseInt(source.droppableId)],
        source.index,
        destination.index
      );
      newGroupTaskArray[parseInt(source.droppableId)] = items;
      cardOrder1 = items.map((item: any) => {
        return item._key;
      });

      labelObject = {
        groupKey: groupKey,
        labelObject1: {
          labelKey: labelArray[parseInt(source.droppableId)]._key,
          cardOrder: cardOrder1,
        },
      };
      labelObject = {
        groupKey: groupKey,
        labelKey1: labelArray[parseInt(source.droppableId)]._key,
        labelKey2: labelArray[parseInt(source.droppableId)]._key,
        cardKey:
          groupTaskArray[parseInt(source.droppableId)][source.index]._key,
      };
      let targetIndex = cardOrder1.indexOf(
        groupTaskArray[parseInt(source.droppableId)][source.index]._key
      );
      if (targetIndex !== -1) {
        if (targetIndex !== 0) {
          labelObject.previousCardKey = cardOrder1[targetIndex - 1];
        }
      }
    } else {
      const result = move(
        newGroupTaskArray[parseInt(source.droppableId)],
        newGroupTaskArray[parseInt(destination.droppableId)],
        source,
        destination
      );
      newGroupTaskArray[parseInt(source.droppableId)] =
        result[source.droppableId];
      newGroupTaskArray[parseInt(destination.droppableId)] =
        result[destination.droppableId];
      cardOrder1 = result[source.droppableId].map((item: any) => {
        return item._key;
      });
      cardOrder2 = result[destination.droppableId].map((item: any) => {
        return item._key;
      });
      labelObject = {
        groupKey: groupKey,
        labelKey1: labelArray[parseInt(source.droppableId)]._key,
        labelKey2: labelArray[parseInt(destination.droppableId)]._key,
        cardKey:
          groupTaskArray[parseInt(source.droppableId)][source.index]._key,
      };
      let targetIndex = cardOrder2.indexOf(
        groupTaskArray[parseInt(source.droppableId)][source.index]._key
      );
      if (targetIndex !== -1) {
        if (targetIndex !== 0) {
          labelObject.previousCardKey = cardOrder2[targetIndex - 1];
        }
      }
    }
    setGroupTaskArray(newGroupTaskArray);
    let taskRes: any = await api.task.changeTaskLabel(
      groupKey,
      groupTaskArray[parseInt(source.droppableId)][source.index]._key,
      labelArray[parseInt(destination.droppableId)]._key
    );
    if (taskRes.msg === "OK") {
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, taskRes.msg, "error"));
    }
    let labelRes: any = await api.task.setLabelCardOrder(labelObject);
    if (labelRes.msg === "OK") {
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    } else {
      dispatch(setMessage(true, labelRes.msg, "error"));
    }
  };
  const onDragNameEnd = async (result: any) => {
    if (!result.destination) {
      result.destination = {
        index: taskNameArr.length - 1,
        droppableId: "droppable",
      };
    }
    let newTaskNameArr: any = _.cloneDeep(taskNameArr);
    let newLabelExecutorArray = _.cloneDeep(labelExecutorArray);
    let newLabelItem = newTaskNameArr.splice(result.source.index, 1)[0];
    let newLabelExecutorItem = newLabelExecutorArray.splice(
      result.source.index,
      1
    )[0];

    newTaskNameArr.splice(result.destination.index, 0, newLabelItem);
    newLabelExecutorArray.splice(
      result.destination.index,
      0,
      newLabelExecutorItem
    );
    let labelOrder = newTaskNameArr.map(
      (labelItem: any, labelIndex: number) => {
        return labelItem.key ? labelItem.key : "null";
      }
    );
    setTaskNameArr(newTaskNameArr);
    setLabelExecutorArray(newLabelExecutorArray);
    let groupRes: any = await api.group.setLabelOrder(groupKey, labelOrder);
    if (groupRes.msg === "OK") {
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === "OK") {
      dispatch(changeMusic(10));
      dispatch(setMessage(true, "归档成功", "success"));
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    } else {
      dispatch(setMessage(true, batchRes.msg, "error"));
    }
  };
  const addLabel = async () => {
    let newTaskNameArr: any = _.cloneDeep(taskNameArr);
    labelIndex.current = labelIndex.current + 1;

    if (addLabelInput !== "") {
      // let labelRes: any = await api.group.setLabelOrder(groupKey, labelOrder);
      if (addLabelInput.indexOf("_") !== -1) {
        dispatch(setMessage(true, "请勿输入 _ 为特殊字符", "error"));
        return;
      }
      let labelRes: any = await api.task.addTaskLabel(
        groupKey,
        addLabelInput,
        defaultKey
      );
      if (labelRes.msg === "OK") {
        newTaskNameArr.splice(labelIndex.current, 0, {
          name: addLabelInput,
          key: labelRes.result._key,
        });
        let labelOrder = newTaskNameArr.map(
          (labelItem: any, labelIndex: number) => {
            return labelItem.key ? labelItem.key : "null";
          }
        );
        setTaskNameArr(newTaskNameArr);
        await api.group.setLabelOrder(groupKey, labelOrder);
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
        // let newGroupInfo = _.cloneDeep(groupInfo);
        // newGroupInfo.labelInfo.push({
        //   labelKey: labelRes.result._key,
        //   labelName: labelRes.result.cardLabelName,
        //   taskType: labelRes.result.taskType,
        // });
        // newGroupInfo.labelOrder.push(labelRes.result._key);
        // dispatch(changeLocalGroupInfo(newGroupInfo));
        setLabelVisible(false);
      } else {
        dispatch(setMessage(true, labelRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "请输入频道名", "error"));
      return;
    }
  };
  const changeLabelAvatar = async (item: any, index: number) => {
    let newLabelExecutorArray = _.cloneDeep(labelExecutorArray);
    newLabelExecutorArray[index] = {
      executorKey: item.userId,
      executorAvatar: item.avatar,
      executorNickName: item.nickName,
    };
    setLabelExecutorArray(newLabelExecutorArray);
  };

  const addTask = async (groupInfo: any, labelInfo: any) => {
    let obj = {};
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
    let labelIndex = _.findIndex(labelArray, { _key: labelInfo._key });
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.groupRole,
      labelKey: labelInfo._key,
      executorKey: labelInfo.executorKey,
      taskType:
        labelArray[labelIndex] && labelArray[labelIndex].taskType
          ? labelArray[labelIndex].taskType
          : 1,
      title: addInput,
      extraData: obj,
    });
    if (addTaskRes.msg === "OK") {
      dispatch(setMessage(true, "新增任务成功", "success"));
      dispatch(changeMusic(5));
      dispatch(setChooseKey(addTaskRes.result._key));
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      // setAddTaskVisible(false);
      setAddInput("");
      setUrlInput("");
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const scrollTask = (e: any, index: number) => {
    setTaskLoading(true);
    let newTaskLoadInfo = _.cloneDeep(taskLoadInfo);
    let taskLength = newTaskLoadInfo[index].length;
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop + 1 >= scrollHeight &&
      taskLength < groupTaskArray[index].length
    ) {
      newTaskLoadInfo[index].push(
        ...groupTaskArray[index].slice(taskLength, taskLength + taskNumber)
      );
      setTaskLoadInfo(newTaskLoadInfo);
    } else {
      setTaskLoading(false);
    }
  };

  return (
    <div className="task">
      {loading || taskLoading ? <Loading /> : null}
      {groupInfo && labelArray ? (
        <div className="task-container-profile" ref={containerRef}>
          <DragDropContext onDragEnd={onDragNameEnd}>
            <div className="task-container-taskName-container">
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="task-container-taskName"
                  >
                    {taskNameArr.map(
                      (taskNameitem: any, taskNameindex: any) => {
                        return (
                          <Draggable
                            key={"dragNav" + taskNameindex}
                            draggableId={
                              taskNameindex + ""
                              // taskNameindex !== 0 ? taskNameitem.key : '0'
                            }
                            isDragDisabled={!taskNameitem.key}
                            index={taskNameindex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // style={{ marginRight: '15px' }}
                                className="task-container-taskName-item"
                              >
                                <React.Fragment>
                                  {groupInfo &&
                                  groupInfo.role < 4 &&
                                  groupInfo.role > 0 ? (
                                    <img
                                      src={taskAddPng}
                                      onClick={() => {
                                        setLabelVisible(true);
                                      }}
                                      alt=""
                                      className="task-container-taskName-logo"
                                      style={
                                        // addVisible === "in"
                                        //   ? {
                                        //       animation: "navIn 200ms",
                                        //       width: "0px",
                                        //       height: "0px",
                                        //       right: "0px",
                                        //       top: "30px",
                                        //     }
                                        // : addVisible === "out"
                                        // ?
                                        {
                                          // animation: "navOut 200ms",
                                          width: "22px",
                                          height: "22px",
                                          right: "-3px",
                                          top: "20px",
                                        }
                                        // : {
                                        //     width: "0px",
                                        //     height: "0px",
                                        //     right: "0px",
                                        //     top: "30px",
                                        //   }
                                      }
                                    />
                                  ) : null}
                                  {groupInfo &&
                                  groupInfo.role > 0 &&
                                  groupInfo.role < 5 ? (
                                    <div
                                      className="taskNav-addLabel"
                                      onClick={() => {
                                        setAddTaskVisible(true);
                                        setChooseLabelKey(
                                          labelArray[taskNameindex]._key
                                            ? labelArray[taskNameindex]._key
                                            : "0"
                                        );
                                        document
                                          .querySelectorAll(".task-item-info")
                                          [taskNameindex].scrollTo(0, 0);
                                      }}
                                    ></div>
                                  ) : null}
                                  <div
                                    style={{
                                      width: deviceWidth,
                                      marginRight: "5px",
                                    }}
                                  >
                                    <TaskNav
                                      avatar={
                                        labelExecutorArray[taskNameindex] &&
                                        labelExecutorArray[taskNameindex]
                                          .executorAvatar
                                          ? labelExecutorArray[taskNameindex]
                                              .executorAvatar
                                          : defaultPerson
                                      }
                                      executorKey={
                                        labelExecutorArray[taskNameindex] &&
                                        labelExecutorArray[taskNameindex]
                                          .executorKey
                                      }
                                      name={taskNameitem.name}
                                      role={groupInfo && groupInfo.role}
                                      colorIndex={taskNameindex}
                                      taskNavArray={[
                                        groupInfo,
                                        labelArray[taskNameindex],
                                      ]}
                                      taskNavWidth={"350px"}
                                      chooseLabelKey={chooseLabelKey}
                                      setChooseLabelKey={setChooseLabelKey}
                                      batchTaskArray={() => {
                                        batchTaskArray(
                                          groupTaskArray[taskNameindex]
                                        );
                                      }}
                                      changeLabelAvatar={changeLabelAvatar}
                                      arrlength={labelArray.length}
                                      taskNavTask={
                                        groupTaskArray[taskNameindex]
                                      }
                                      followList={labelFollowArray}
                                      changeFollowList={setLabelFollowArray}
                                    />
                                  </div>
                                </React.Fragment>
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="task-container-task">
              {taskLoadInfo.map((taskInfoitem: any, taskInfoindex: any) => {
                return (
                  <React.Fragment key={"taskInfoitem" + taskInfoindex}>
                    <Droppable droppableId={taskInfoindex + ""}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className="task-item-info"
                          style={{
                            width: deviceWidth,
                            marginRight: "5px",
                          }}
                          onScroll={(e) => {
                            scrollTask(e, taskInfoindex);
                          }}
                        >
                          <React.Fragment>
                            {(addTaskVisible &&
                              labelArray[taskInfoindex] &&
                              labelArray[taskInfoindex]._key + "" ===
                                chooseLabelKey) ||
                            (chooseLabelKey === "0" &&
                              labelArray[taskInfoindex] &&
                              !labelArray[taskInfoindex]._key) ? (
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
                                        addTask(
                                          groupInfo,
                                          labelArray[taskInfoindex]
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <div
                                  className="taskItem-plus-button"
                                  style={{ marginTop: "10px" }}
                                >
                                  {deviceType !== "tool" ? (
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

                                      <Input
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
                                  ) : null}
                                  <Button
                                    ghost
                                    onClick={() => {
                                      setChooseLabelKey("");
                                      setAddTaskVisible(false);
                                      setAddInput("");
                                      setMoveState(false);
                                    }}
                                    style={{
                                      marginRight: "10px",
                                      border: "0px",
                                    }}
                                  >
                                    取消
                                  </Button>

                                  <Button
                                    loading={loading}
                                    type="primary"
                                    onClick={() => {
                                      addTask(
                                        groupInfo,
                                        labelArray[taskInfoindex]
                                      );
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
                            {taskInfoitem.map((item: any, index: any) => (
                              <Draggable
                                key={"task" + item._key}
                                draggableId={"task" + item._key}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="task-item-item"
                                    // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                  >
                                    {item.show ? (
                                      <Task
                                        taskItem={item}
                                        // timeSetStatus={
                                        //   taskInfoitem.length > 4 &&
                                        //   index > taskInfoitem.length - 3
                                        // }
                                        type="customService"
                                        taskIndex={
                                          labelArray[taskInfoindex] &&
                                          labelArray[
                                            taskInfoindex
                                          ].cardOrder.indexOf(item._key)
                                            ? labelArray[
                                                taskInfoindex
                                              ].cardOrder.indexOf(item._key)
                                            : 0
                                        }
                                        taskStyle={{
                                          // background: snapshot.isDragging
                                          //   ? "rgba(188,255,238,0.7)"
                                          //   : "rgb(255,255,255)",
                                          transform: snapshot.isDragging
                                            ? "rotate(10deg)"
                                            : "rotate(0deg)",
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </React.Fragment>
                        </div>
                      )}
                    </Droppable>
                  </React.Fragment>
                );
              })}
            </div>
          </DragDropContext>
          <Modal
            visible={labelVisible}
            onCancel={() => {
              setLabelVisible(false);
            }}
            onOk={() => {
              addLabel();
            }}
            title={"添加频道"}
          >
            <Input
              placeholder="请添加频道"
              value={addLabelInput}
              onChange={(e) => {
                setAddLabelInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  addLabel();
                  setLabelVisible(false);
                }
              }}
            />
            <div
              className="default-member"
              onClick={() => {
                setAvatarVisible(true);
              }}
            >
              <Avatar
                avatar={defaultItem.avatar}
                name={defaultItem.nickName}
                type={"person"}
                size={25}
                index={0}
              />
              <span style={{ marginLeft: "5px" }}>{defaultItem.nickName}</span>
              <DropMenu
                visible={avatarVisible}
                dropStyle={{
                  width: "80%",
                  height: "350px",
                  top: "155px",
                  color: "#333",
                }}
                onClose={() => {
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
                    style={{ width: "calc(100% - 40px)", height: "30px" }}
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
                        setDefaultItem({});
                        setDefaultKey(null);
                        setAvatarVisible(false);
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
                                setDefaultItem(groupMemberItem);
                                setDefaultKey(groupMemberItem.userId);
                                setAvatarVisible(false);
                              }}
                            >
                              <div className="defaultExecutor-info-left">
                                <Avatar
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
                              {defaultKey === groupMemberItem.userId ? (
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
          </Modal>
        </div>
      ) : null}
    </div>
  );
};
export default GroupTableGroup;
