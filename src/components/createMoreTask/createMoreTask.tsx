import React, { useState, useEffect, useRef, useCallback } from "react";
import "./createMoreTask.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Tooltip } from "antd";
import api from "../../services/api";
import _ from "lodash";

import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
} from "../../redux/actions/commonActions";
import { getGroupTask } from "../../redux/actions/taskActions";
import { setGroupKey, getGroup } from "../../redux/actions/groupActions";

import Loading from "../common/loading";

import defaultGroupPng from "../../assets/img/defaultGroup.png";
import rightArrowPng from "../../assets/img/rightArrow.png";
import { useMount } from "../../hook/common";
import { setTaskInfo } from "../../redux/actions/taskActions";

interface CreateMoreTaskProps {
  visible: boolean;
  moreTitle?: string | undefined;
  onClose?: any;
  createStyle?: any;
  changeGroupArray?: any;
  groupIndex?: number;
  labelIndex?: number;
  labelArray?: any;
  groupArray?: any;
  moveTaskType?: string;
  taskKey?: string;
  taskItem?: any;
}

const CreateMoreTask: React.FC<CreateMoreTaskProps> = (props) => {
  const {
    visible,
    moreTitle,
    onClose,
    createStyle,
    changeGroupArray,
    groupIndex,
    labelArray,
    groupArray,
    moveTaskType,
    taskKey,
    taskItem,
  } = props;
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([
    {
      executorAvatar: "",
      executorKey: "",
      executorName: "",
      labelKey: null,
      labelName: "Todo",
    },
  ]);
  const [groupChooseIndex, setGroupChooseIndex] = useState<any>(0);
  const [groupAllArray, setGroupAllArray] = useState<any>([]);
  const [labelAllArray, setLabelAllArray] = useState<any>([]);
  const [searchGroupArray, setSearchGroupArray] = useState<any>([]);
  const [searchLabelArray, setSearchLabelArray] = useState<any>([]);
  const [searchGroupInput, setSearchGroupInput] = useState<any>("");
  const [searchLabelInput, setSearchLabelInput] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const createRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getGroupArray = useCallback(async () => {
    let newGroupArray: any = [];
    let newLabelAllArray: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 6);
    if (unDistory.current) {
      if (groupRes.msg === "OK") {
        newGroupArray.push(...groupRes.result);
        groupRes.result.forEach((item: any, index: number) => {
          newLabelAllArray[index] = _.cloneDeep(item.labelInfo);
        });
        setGroupAllArray(newGroupArray);
        setLabelAllArray(newLabelAllArray);
        let newLabelChooseArray: any = [];
        newGroupArray.forEach((item: any, index: number) => {
          newLabelChooseArray.push([]);
        });
        setLabelChooseArray(newLabelChooseArray);
        setSearchGroupArray([...newGroupArray]);
        setSearchLabelArray([...newLabelAllArray]);
      } else {
        dispatch(setMessage(true, groupRes.msg, "error"));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    setGroupChooseIndex(groupIndex ? groupIndex : 0);
    setGroupAllArray([...groupArray]);
    setLabelAllArray([...labelArray]);
    setSearchGroupArray([...groupArray]);
    setSearchLabelArray([...labelArray]);
    if (!changeGroupArray) {
      getGroupArray();
    }
  }, [groupArray, labelArray, changeGroupArray, groupIndex, getGroupArray]);
  useEffect(() => {
    // 用户已登录
    if (!searchGroupInput) {
      const newGroupAllArray = _.cloneDeep(groupAllArray);
      setSearchGroupArray(newGroupAllArray);
    }
  }, [searchGroupInput, groupAllArray]);
  useEffect(() => {
    // 用户已登录
    if (!searchLabelInput) {
      const newLabelAllArray = _.cloneDeep(labelAllArray);
      setSearchLabelArray(newLabelAllArray);
    }
  }, [searchLabelInput, labelAllArray]);

  const addMoreTask = async (groupItem: any, labelItem: any) => {
    setLoading(true);
    let addTaskRes: any = await api.task.togetherCreateCard({
      title: moreTitle ? moreTitle : "",
      taskType: taskItem.taskType,
      groupKeyArray: [groupItem._key],
      labelKey2Array: [[labelItem.labelKey]],
    });
    if (addTaskRes.msg === "OK") {
      // setLoading(false);
      dispatch(setMessage(true, "复制任务成功", "success"));
      onClose();
      if (
        taskItem.groupKey !== mainGroupKey ||
        headerIndex !== 3 ||
        (headerIndex === 3 && taskItem.groupKey !== groupItem._key)
      ) {
        dispatch(setGroupKey(groupItem._key));
        // dispatch(getGroupInfo(groupKey));
        dispatch(setCommonHeaderIndex(3));
        if (!theme.moveState) {
          dispatch(setMoveState("in"));
        }
        // await api.group.visitGroupOrFriend(2, groupKey);
        dispatch(getGroup(3));
      }
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const moveMoreTask = async (groupAllItem: any, labelAllItem: any) => {
    let addTaskRes: any = await api.task.editTask({
      groupKey: groupAllItem._key,
      labelKey: labelAllItem.labelKey,
      key: taskKey,
    });
    if (addTaskRes.msg === "OK") {
      let newTaskInfo = { ...taskInfo };
      newTaskInfo.groupKey = groupAllItem._key;
      newTaskInfo.groupName = groupAllItem.groupName;
      newTaskInfo.labelKey = labelAllItem.labelKey;
      newTaskInfo.labelName = groupAllItem.labelName;
      dispatch(setTaskInfo(newTaskInfo));
      dispatch(setMessage(true, "移动任务成功", "success"));
      onClose();
      if (headerIndex === 3 && taskItem.groupKey === groupAllItem._key) {
        dispatch(getGroupTask(3, taskItem.groupKey, "[0,1,2,10]"));
      } else if (
        taskItem.groupKey !== mainGroupKey ||
        headerIndex !== 3 ||
        (headerIndex === 3 && taskItem.groupKey !== groupAllItem._key)
      ) {
        dispatch(setGroupKey(groupAllItem._key));
        // dispatch(getGroupInfo(groupKey));
        dispatch(setCommonHeaderIndex(3));
        if (!theme.moveState) {
          dispatch(setMoveState("in"));
        }
        // await api.group.visitGroupOrFriend(2, groupAllKey);
        dispatch(getGroup(3));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const chooseLabel = (labelItem: any, index: number) => {
    let newLabelChooseArray = _.cloneDeep(labelChooseArray);
    let newGroupArray = _.cloneDeep(groupAllArray);
    labelItem.index = index;
    // if (labelIndex === -1) {
    // newLabelChooseArray.push(labelItem);
    // } else {
    //   newLabelChooseArray.splice(labelIndex);
    // }
    // setLabelChooseArray(newLabelChooseArray);
    newLabelChooseArray = [labelItem];
    newGroupArray[groupChooseIndex].index = groupChooseIndex;
    changeGroupArray(newGroupArray[groupChooseIndex], newLabelChooseArray);
    setLabelChooseArray([]);
    localStorage.setItem(
      "createGroupKey",
      groupAllArray[groupChooseIndex]._key
    );
    localStorage.setItem("createLabelKey", labelItem.labelKey);
    // console.log(groupAllArray[groupChooseIndex]._key, labelItem.labelKey);
    onClose();
  };
  const searchGroup = (e: any, type: string) => {
    let input = e.target.value;
    let newSearchArray: any =
      type === "group"
        ? _.cloneDeep(groupAllArray)
        : _.cloneDeep(labelAllArray)[groupChooseIndex];
    if (input) {
      newSearchArray = newSearchArray.filter((item: any) => {
        let name =
          type === "group"
            ? item.groupName
            : item.labelName
            ? item.labelName
            : "ToDo";
        return name && name.toUpperCase().indexOf(input.toUpperCase()) !== -1;
      });
    }
    if (type === "group") {
      setSearchGroupInput(input);
      setSearchGroupArray(newSearchArray);
    } else {
      setSearchLabelInput(input);
      let newSearchAllArray = _.cloneDeep(searchLabelArray);
      newSearchAllArray[groupChooseIndex] = newSearchArray;
      setSearchLabelArray(newSearchAllArray);
    }
  };
  return (
    <React.Fragment>
      {visible && groupAllArray ? (
        <React.Fragment>
          <div
            className="createMoreTask"
            style={{ ...createStyle }}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            ref={createRef}
          >
            {loading ? (
              <Loading loadingWidth="80px" loadingHeight="80px" />
            ) : null}
            <div className="createMoreTask-left">
              <div className="createMoreTask-right-header">
                项目列表
                {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={closePng}
                    onClick={onClose}
                    style={{
                      height: '25px',
                      width: '25px',
                      cursor: 'pointer',
                    }}
                  />
                </div> */}
                <input
                  type="text"
                  className="createMoreTask-left-input"
                  placeholder={"输入项目名…"}
                  onChange={(e: any) => {
                    searchGroup(e, "group");
                  }}
                  value={searchGroupInput}
                />
              </div>

              <div className="createMoreTask-left-container">
                {searchGroupArray.length > 0
                  ? searchGroupArray.map((item: any, index: number) => {
                      return (
                        <div
                          className="createMoreTask-item"
                          onMouseEnter={(e: any) => {
                            // setMoveState('right');
                            setGroupChooseIndex(
                              _.findIndex(groupAllArray, { _key: item._key })
                            );
                          }}
                          key={"group" + index}
                          style={
                            groupChooseIndex ===
                            _.findIndex(groupAllArray, {
                              _key: item._key,
                            })
                              ? {
                                  background: "#F0F0F0",
                                  color: "#1890ff",
                                }
                              : {}
                          }
                        >
                          <div className="createMoreTask-item-title">
                            <div className="createMoreTask-avatar">
                              <img
                                src={
                                  item.groupLogo
                                    ? item.groupLogo
                                    : defaultGroupPng
                                }
                                alt=""
                              />
                            </div>
                            <Tooltip
                              title={item.groupName}
                              getPopupContainer={() => createRef.current}
                              getTooltipContainer={() => createRef.current}
                            >
                              <div className="createMoreTask-groupName">
                                {item.groupName}
                              </div>
                            </Tooltip>
                          </div>
                          {groupChooseIndex === index ? (
                            <img
                              src={rightArrowPng}
                              alt=""
                              style={{
                                width: "7px",
                                height: "11px",
                              }}
                            />
                          ) : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            <div className="createMoreTask-right">
              <div className="createMoreTask-right-header">频道列表</div>
              {/* <input
                type="text"
                className="createMoreTask-left-input"
                placeholder={'输入频道名…'}
                onChange={(e: any) => {
                  searchGroup(e, 'label');
                }}
                value={searchLabelInput}
              /> */}
              <div className="createMoreTask-right-container">
                {searchLabelArray[groupChooseIndex]
                  ? searchLabelArray[groupChooseIndex].map(
                      (item: any, index: number) => {
                        return (
                          <div
                            className="createMoreTask-item"
                            onClick={() => {
                              if (changeGroupArray) {
                                chooseLabel(
                                  item,
                                  _.findIndex(labelAllArray, {
                                    _key: item._key,
                                  })
                                );
                              } else if (moveTaskType === "复制") {
                                addMoreTask(
                                  groupAllArray[groupChooseIndex],
                                  item
                                );
                              } else if (moveTaskType === "移动") {
                                moveMoreTask(
                                  groupAllArray[groupChooseIndex],
                                  item
                                );
                              }
                            }}
                            key={"label" + index}
                            // style={
                            //   labelChooseIndex === index
                            //     ? { background: '#F0F0F0' }
                            //     : {}
                            // }
                          >
                            <div className="createMoreTask-item-title">
                              <div className="createMoreTask-item-left">
                                {/* <Tooltip
                                  title={
                                    item.labelName ? item.labelName : 'ToDo'
                                  }
                                > */}
                                <div
                                  className="createMoreTask-item-label"
                                  style={{ width: "100%" }}
                                >
                                  {item.labelName ? item.labelName : "ToDo"} ({" "}
                                  {item.executorName
                                    ? item.executorName
                                    : "无默认执行人"}{" "}
                                  )
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
CreateMoreTask.defaultProps = { labelArray: [], groupArray: [] };

export default CreateMoreTask;
