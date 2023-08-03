import React, { useState, useEffect, useRef } from "react";
import "./phoneContent.css";
import { Dropdown, Button, Input } from "antd";
import {} from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import {
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  FilterOutlined,
  // GlobalOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
// , usePrevious
import { useMount } from "../../hook/common";
import _ from "lodash";

import { setMessage } from "../../redux/actions/commonActions";
import {
  setThemeLocal,
  setTheme,
  changeMusic,
} from "../../redux/actions/authActions";
import { setFilterObject } from "../../redux/actions/taskActions";
import { getGroupInfo } from "../../redux/actions/groupActions";

import format from "../../components/common/format";
import Task from "../../components/task/task";
import Empty from "../../components/common/empty";
import Avatar from "../../components/common/avatar";
import Loading from "../../components/common/loading";

import contactTree from "../../assets/svg/contactTree.svg";
const { TextArea } = Input;
interface PhoneContentProps {
  contactKey: string;
  type: string;
  setHomeIndex?: any;
}

const PhoneContent: React.FC<PhoneContentProps> = (props) => {
  const { contactKey, type, setHomeIndex } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const theme = useTypedSelector((state) => state.auth.theme);
  const user = useTypedSelector((state) => state.auth.user);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const [phoneInfo, setPhoneInfo] = useState<any>(null);
  const [phoneTaskArray, setPhoneTaskArray] = useState<any>(null);
  const [workMenuIndex, setWorkMenuIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState("");
  const [addInput, setAddInput] = useState("");
  // const [moveState, setMoveState] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const BgColorArray = useRef<any>([
    "rgba(48,191,191,0.3)",
    "rgba(0,170,255,0.3)",
    "rgba(143,126,230,0.3)",
    "rgba(179,152,152,0.3)",
    "rgba(242,237,166,0.3)",
  ]);
  const workMenuRef = useRef<any>([
    "全部",
    "我执行的",
    "我计划的",
    "我完成的",
    "我指派的",
    "我指派且完成的",
    "我指派未完成的",
    "我指派已过期",
  ]);
  // const sortArr = useCallback((arr: object[], item: any) => {
  //   arr.push(item);
  //   arr = _.sortBy(arr, ["createTime"]).reverse();
  //   arr = _.sortBy(arr, ["finishPercent"]);
  //   return arr;
  // }, []);
  const getPersonData = useCallback(
    (workingTaskArray, workingGroupArray) => {
      setPhoneTaskArray([]);
      let labelArray: any = [];
      let labelArr: any = [];
      if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
        workingGroupArray.forEach((item: any, index: number) => {
          labelArr[index] = item.labelArray.map(
            (labelItem: any) => labelItem._key
          );
        });
        workingGroupArray.forEach((item: any, index: number) => {
          labelArray[index] = {};
          workingTaskArray[index].forEach(
            (taskItem: any, taskIndex: number) => {
              if (taskItem.taskEndDate) {
                if (labelArr[index].indexOf(taskItem.labelKey) !== -1) {
                  if (!labelArray[index][taskItem.labelKey]) {
                    labelArray[index][taskItem.labelKey] = {
                      arr: [],
                      groupObj: item,
                      labelObj:
                        item.labelArray[
                          labelArr[index].indexOf(taskItem.labelKey)
                        ],
                      position: [],
                    };
                  }
                  labelArray[index][taskItem.labelKey].arr.push(taskItem);
                  // labelArray[index][taskItem.labelKey].arr = sortArr(
                  //   labelArray[index][taskItem.labelKey].arr,
                  //   taskItem
                  // );
                } else {
                  if (!labelArray[index]["ToDo" + index]) {
                    labelArray[index]["ToDo" + index] = {
                      arr: [],
                      groupObj: item,
                      labelObj: {
                        groupKey: item._key,
                        cardLabelName: "ToDo",
                      },
                      position: [],
                    };
                  }
                  labelArray[index]["ToDo" + index].arr.push(taskItem);
                  // labelArray[index]["ToDo" + index].arr = sortArr(
                  //   labelArray[index]["ToDo" + index].arr,
                  //   taskItem
                  // );
                }
              }
            }
          );
        });
        workingGroupArray[0].labelArray.forEach((item: any, index: number) => {
          if (
            Object.keys(labelArray[0])[
              Object.keys(labelArray[0]).length - 1
            ] !== "null"
          ) {
            labelArray[0]["null"] = {
              arr: [],
              groupObj: workingGroupArray[0],
              labelObj: {
                groupKey: item.groupKey,
                cardLabelName: "ToDo",
              },
              position: [],
            };
          } else if (
            Object.keys(labelArray[0]).indexOf(item._key) === -1 &&
            item._key
          ) {
            labelArray[0][item._key] = {
              arr: [],
              groupObj: workingGroupArray[0],
              labelObj: item,
              position: [],
            };
          }
        });
        labelArray = labelArray.map((item: any, index: number) => {
          for (let key in item) {
            item[key].arr = format.formatFilter(item[key].arr, filterObject);
            item[key].arrlength = item[key].arr.length;
            item[key].open = true;
          }
          return Object.values(_.sortBy(item, "arrlength").reverse());
        });
        setPhoneTaskArray(labelArray);
      }
    },
    [filterObject]
  );

  const getData = useCallback(
    async (type: string, key: string) => {
      setLoading(true);
      if (type === "person") {
        let personRes: any = await api.task.getGroupTask(
          2,
          key,
          1,
          [0, 1, 2, 10]
        );
        if (personRes.msg === "OK") {
          setLoading(false);
          getPersonData(
            personRes.result.cardArray,
            personRes.result.groupArray
          );
        } else {
          setLoading(false);
          dispatch(setMessage(true, personRes.msg, "error"));
        }
      } else if (type === "group") {
        let groupRes: any = await api.task.getTaskListNew(3, key, "[0,1,2,10]");
        if (groupRes.msg === "OK") {
          setLoading(false);
          getPersonData(
            [groupRes.result.cardArray],
            [{ ...phoneInfo, labelArray: groupRes.result.labelArray }]
          );
        } else {
          setLoading(false);
          dispatch(setMessage(true, groupRes.msg, "error"));
        }
      } else if (type === "owner") {
        let ownerRes: any = await api.task.getGroupTask(
          1,
          key,
          1,
          [0, 1, 2, 10]
        );
        if (ownerRes.msg === "OK") {
          setLoading(false);
          getPersonData(ownerRes.result.cardArray, ownerRes.result.groupArray);
        } else {
          setLoading(false);
          dispatch(setMessage(true, ownerRes.msg, "error"));
        }
      } else {
        setLoading(false);
      }
    },
    [dispatch, phoneInfo, getPersonData]
  );
  useEffect(() => {
    if (type === "group") {
      setPhoneInfo(groupInfo);
    }
    //eslint-disable-next-line
  }, [groupInfo, type]);
  const getInfo = useCallback(
    async (type: string, key: string) => {
      if (type === "person") {
        let personInfoRes: any = await api.auth.getTargetUserInfo(key);
        if (personInfoRes.msg === "OK") {
          setPhoneInfo(personInfoRes.result);
        } else {
          dispatch(setMessage(true, personInfoRes.msg, "error"));
        }
      } else if (type === "group") {
        dispatch(getGroupInfo(key));
        // let groupInfoRes: any = await api.group.getGroupInfo(key);
        // if (groupInfoRes.msg === "OK") {
        //   setPhoneInfo(groupInfoRes.result);
        // } else {
        //   dispatch(setMessage(true, groupInfoRes.msg, "error"));
        // }
      } else if (type === "owner") {
        setPhoneInfo(user);
      }
    },
    [dispatch, user]
  );
  useEffect(() => {
    getInfo(type, contactKey);
    //eslint-disable-next-line
  }, [contactKey, type, getInfo, dispatch]);
  useEffect(() => {
    getData(type, contactKey);
    //eslint-disable-next-line
  }, [contactKey, type, getData, filterObject, dispatch]);
  useMount(() => {
    changeWorkType(0);
  });
  // const prevFilterObject = usePrevious(filterObject);
  // useEffect(() => {
  //   if (!prevFilterObject && filterObject) {
  //     changeWorkType(0);
  //   }
  //   //eslint-disable-next-line
  // }, [prevFilterObject, filterObject]);

  const changeWorkType = async (workType: number) => {
    let newTheme = _.cloneDeep(theme);
    let newFilterObject: any = _.cloneDeep(filterObject);
    setWorkMenuIndex(workType);
    newFilterObject.creatorKey = "";
    newFilterObject.creatorAvatar = "";
    newFilterObject.creatorName = "";
    newFilterObject.executorKey = "";
    newFilterObject.executorAvatar = "";
    newFilterObject.executorName = "";
    switch (workType) {
      case 0:
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        break;
      case 1:
        newFilterObject.filterType = ["过期", "今天"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 2:
        newFilterObject.filterType = ["未来"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 3:
        newFilterObject.filterType = ["已完成"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 4:
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 5:
        newFilterObject.filterType = ["已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 6:
        newFilterObject.filterType = ["未完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 7:
        newFilterObject.filterType = ["过期"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
    }
    dispatch(setFilterObject(newFilterObject));
    if (type === "person" || type === "owner") {
      newTheme.filterObject = newFilterObject;
      dispatch(setThemeLocal(newTheme));
      dispatch(setTheme(newTheme));
      await api.auth.setWorkingConfigInfo(newTheme);
    } else {
      if (groupMemberItem) {
        await api.member.setConfig(groupMemberItem._key, newFilterObject);
      }
    }
    //eslint-disable-next-line
  };
  const addTask = async (groupInfo: any, labelInfo: any) => {
    let obj = {};
    if (addInput === "") {
      setOpenIndex("");
      return;
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
      labelKey: labelInfo._key,
      executorKey: labelInfo.executorKey,
      taskType: labelInfo.taskType ? labelInfo.taskType : 1,
      title: addInput,
      extraData: obj,
    });
    if (addTaskRes.msg === "OK") {
      dispatch(setMessage(true, "新增任务成功", "success"));
      dispatch(changeMusic(5));
      getData(type, contactKey);
      // dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      // setAddTaskVisible(false);
      setAddInput("");
      setUrlInput("");
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const downMenu = (
    <div className="dropDown-box phoneContent-filter-box">
      {workMenuRef.current.map((item, index) => {
        return (
          <div
            className="phoneContent-filter-item"
            onClick={() => {
              changeWorkType(index);
            }}
            onTouchStart={() => {
              changeWorkType(index);
            }}
            key={"workMenu" + index}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="phoneContent">
      {loading ? <Loading /> : null}
      <div className="phoneContent-header">
        {phoneInfo ? (
          <div className="phoneContent-header-profile">
            <Avatar
              avatar={
                type === "person" || type === "owner"
                  ? phoneInfo.profile.avatar
                  : phoneInfo.groupLogo
              }
              name={
                type === "person" || type === "owner"
                  ? phoneInfo.profile.nickName
                  : phoneInfo.groupName
              }
              type={type === "group" ? "group" : "person"}
              index={0}
              size={35}
            />
            <div className="phoneContent-header-name">
              {type === "person" || type === "owner"
                ? phoneInfo.profile.nickName
                : phoneInfo.groupName}
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center" }}>
          {type === "group" ? (
            <Button
              type="primary"
              ghost
              size="large"
              shape="circle"
              icon={
                <img src={contactTree} alt="" style={{ marginTop: "3px" }} />
              }
              onClick={(e) => {
                setHomeIndex(7);
              }}
              className="treeButton"
            />
          ) : null}
          <Dropdown
            overlay={downMenu}
            placement="bottomLeft"
            trigger={["click"]}
            // getPopupContainer={() => createDivRef.current}
          >
            <div
              className="headerCreate-filter-title"
              style={{ color: "#fff", flexShrink: 0 }}
            >
              <FilterOutlined
                style={{ fontSize: "18px", marginRight: "3px" }}
              />
              {workMenuRef.current[workMenuIndex]}
            </div>
          </Dropdown>
        </div>
      </div>
      <div className="phoneContent-box">
        {phoneTaskArray && phoneTaskArray.length > 0 ? (
          phoneTaskArray.map((phoneTaskItem, phoneTaskIndex) => {
            return (
              <React.Fragment key={"phoneTask" + phoneTaskIndex}>
                {phoneTaskItem.map((phoneItem, phoneIndex) => {
                  return (
                    <div key={"phoneTask" + phoneIndex}>
                      {phoneItem.arrlength > 0 ? (
                        <React.Fragment>
                          <div
                            className="phoneContent-taskNav"
                            style={{
                              backgroundColor:
                                BgColorArray.current[phoneIndex % 5],
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Avatar
                                avatar={
                                  type === "person" || type === "owner"
                                    ? phoneItem.groupObj.groupLogo
                                    : phoneItem.labelObj.executorAvatar
                                }
                                name={
                                  type === "person" || type === "owner"
                                    ? phoneItem.groupObj.nickName
                                    : phoneItem.labelObj.cardLabelName
                                }
                                type={type === "group" ? "person" : "group"}
                                index={0}
                                size={30}
                              />
                              <div style={{ marginLeft: "8px" }}>
                                {type === "person" || type === "owner"
                                  ? phoneItem.groupObj.groupName + " / "
                                  : ""}
                                {phoneItem.labelObj.cardLabelName &&
                                phoneItem.labelObj._key
                                  ? phoneItem.labelObj.cardLabelName
                                  : "ToDo"}
                                （{phoneItem.arrlength}）
                              </div>
                            </div>
                            <div className="phoneContent-button">
                              {/* || (type === 'person' && phoneItem.groupObj.groupRole < 4 && phoneItem.groupObj.groupRole > 0) */}
                              {type === "group" || type === "owner" ? (
                                <Button
                                  type="primary"
                                  shape="circle"
                                  ghost
                                  icon={
                                    <PlusOutlined style={{ color: "#fff" }} />
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenIndex(
                                      phoneTaskIndex + "-" + phoneIndex
                                    );
                                  }}
                                  style={{ border: "0px" }}
                                />
                              ) : null}

                              {phoneItem.open ? (
                                <Button
                                  type="primary"
                                  shape="circle"
                                  ghost
                                  icon={
                                    <UpOutlined style={{ color: "#fff" }} />
                                  }
                                  onClick={(e) => {
                                    setPhoneTaskArray((prevPhoneTaskArray) => {
                                      prevPhoneTaskArray[phoneTaskIndex][
                                        phoneIndex
                                      ].open = false;
                                      return [...prevPhoneTaskArray];
                                    });
                                    setOpenIndex("");
                                  }}
                                  style={{ border: "0px" }}
                                />
                              ) : (
                                <Button
                                  type="primary"
                                  shape="circle"
                                  ghost
                                  icon={
                                    <DownOutlined style={{ color: "#fff" }} />
                                  }
                                  onClick={(e) => {
                                    setPhoneTaskArray((prevPhoneTaskArray) => {
                                      prevPhoneTaskArray[phoneTaskIndex][
                                        phoneIndex
                                      ].open = true;
                                      return [...prevPhoneTaskArray];
                                    });
                                  }}
                                  style={{ border: "0px" }}
                                />
                              )}
                            </div>
                          </div>
                          {openIndex === phoneTaskIndex + "-" + phoneIndex ? (
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
                                />
                              </div>
                              <div
                                className="taskItem-plus-button"
                                style={{ marginTop: "10px" }}
                              >
                                {/* <div className="taskNav-url">
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
                                </div> */}
                                <Button
                                  ghost
                                  onClick={() => {
                                    setOpenIndex("");
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
                                      phoneItem.groupObj,
                                      phoneItem.labelObj
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
                          <div>
                            {phoneItem.arr.map((taskItem, taskIndex) => {
                              return (
                                <div
                                  className="phoneContent-taskContainer"
                                  style={
                                    !phoneItem.open
                                      ? { display: "none" }
                                      : { display: "block" }
                                  }
                                  key={"phoneItem" + taskIndex}
                                >
                                  <Task
                                    key={"task" + taskIndex}
                                    taskItem={taskItem}
                                    taskIndex={0}
                                    taskInfoIndex={phoneIndex}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};
PhoneContent.defaultProps = {};
export default PhoneContent;
