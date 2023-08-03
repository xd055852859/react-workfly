import React, { useState, useEffect, useRef } from "react";
import "./okrItem.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import {
  Progress,
  Divider,
  Modal,
  Drawer,
  Radio,
  Rate,
  Input,
  Button,
  Menu,
  Dropdown,
  Tabs,
  Tooltip,
  InputNumber,
  Timeline,
  Space,
} from "antd";
import {
  DashOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";
import OkrDialog from "./okrDialog";
import Avatar from "../../components/common/avatar";
import DropMenu from "../../components/common/dropMenu";
import {
  setCommonHeaderIndex,
  setMessage,
} from "../../redux/actions/commonActions";
import UpLevelOkrItem from "./okrItem";

import okraddSvg from "../../assets/svg/okradd.svg";
import addKrSvg from "../../assets/svg/addKr.svg";
import cancelUpAlignSvg from "../../assets/svg/cancelUpAlign.svg";
import okrlinkGroupSvg from "../../assets/svg/okrlinkGroup.svg";
import confidenceSvg from "../../assets/svg/confidence.svg";
import confidencewSvg from "../../assets/svg/confidencew.svg";
import Task from "../../components/task/task";
import moment from "moment";
import Contact from "../contact/contact";
import GroupCreate from "../tabs/groupCreate";
import Editor from "../../components/common/editor/editor";
import Comment from "../../components/comment/comment";
import { setGroupKey, changeStartId } from "../../redux/actions/groupActions";
import { getGroupMember } from "../../redux/actions/memberActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";
import ClickOutside from "../../components/common/clickOutside";
const { TextArea } = Input;
const { TabPane } = Tabs;
interface OkrItemProps {
  item: any;
  index?: number;
  chooseOKey?: string;
  memberList?: any;
  periodList?: any;
  flashOkr?: any;
  type?: string;
  sonItem?: any;
  changeOkrList?: any;
  krStyle?: any;
  memberKey?: string;
  memberRole?: number;
  targetRole?: number;
  periodIndex?: number;
  setDrawVisible?: any;
}
const OkrItem: React.FC<OkrItemProps> = (props) => {
  const {
    item,
    index,
    sonItem,
    memberList,
    periodList,
    flashOkr,
    type,
    changeOkrList,
    krStyle,
    memberKey,
    memberRole,
    targetRole,
    periodIndex,
    setDrawVisible,
    chooseOKey,
  } = props;
  const dispatch = useDispatch();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const user = useTypedSelector((state) => state.auth.user);
  const taskState = useTypedSelector((state) => state.auth.taskState);

  const [fatherOkey, setFatherOkey] = useState("");
  const [oDialogVisble, setODialogVisble] = useState(false);
  const [oInfoVisble, setOInfoVisble] = useState(false);
  const [oLogoIndex, setOLogoIndex] = useState(10000);
  const [upLevelOKey, setUpLevelOKey] = useState<string | null>(null);
  const [upLevelKRKey, setUpLevelKRKey] = useState<string | null>(null);
  const [overOKey, setOverOKey] = useState<string | null>(null);
  const [overOItem, setOverOItem] = useState<any>(null);
  const [overSonKey, setOverSonKey] = useState<string | null>(null);
  const [overSonItem, setOverSonItem] = useState<any>(null);
  const [krItem, setKrItem] = useState<any>(null);
  const [krVisible, setKrVisible] = useState<boolean>(false);
  const [oVisible, setOVisible] = useState<boolean>(false);

  const [krKey, setKrKey] = useState<any>(null);
  const [oTitle, setOTitle] = useState<string>("");
  const [krTitle, setKrTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskVisible, setTaskVisible] = useState<boolean>(false);
  const [weight, setWeight] = useState<number>(1);
  const [oLogoVisible, setOLogoVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);
  const [commentInput, setCommentInput] = useState("");
  const [krList, setKrList] = useState<any>(null);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [moveState, setMoveState] = useState(false);
  const [oProgress, setOProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canEdit, setCanEdit] = useState(false);
  const [dragKey, setDragKey] = useState("");
  const [changeState, setChangeState] = useState(false);
  const ologoType = [
    { title: "普通", color: "#009fe0", bgColor: "#edf5ff" },
    { title: "中等", color: "#1cb75f", bgColor: "#eafdf2" },
    { title: "重要", color: "#f5a623", bgColor: "#fff9ef" },
    { title: "严重", color: "#ff3d3c", bgColor: "#ffe7e7" },
  ];
  const inputRef = useRef<any>(null);
  const barRef = useRef<any>(null);
  const txtRef = useRef<any>("");
  const barleft = useRef<number>(0);
  const progressRef = useRef<any>(null);
  useEffect(() => {
    setOTitle(item.title);
    // setOProgress(item.progress);
    setContent(item.content);
  }, [item]);
  useEffect(() => {
    if (krItem) {
      setProgress(krItem.progress);
    }
  }, [krItem]);
  useEffect(() => {
    if (krItem?._key) {
      getKrTaskList(krItem._key);
    }
  }, [krItem?._key]);
  useEffect(() => {
    if (barRef.current && krItem) {
      barRef.current.style.left = krItem.progress * 2.8 + "px";
      txtRef.current.style.left = krItem.progress * 2.8 - 8 + "px";
    }
  }, [barRef.current, krItem]);
  useEffect(() => {
    if (taskState && taskState.key && krList && krList.length > 0) {
      console.log(taskState);
      let newKrList = _.cloneDeep(krList);
      let newItem = _.cloneDeep(item);
      if (taskState.type === "del") {
        let index = _.findIndex(krList, { _key: taskState.key });
        newKrList.splice(index, 1);
        setKrList(newKrList);
        let newIndex = _.findIndex(newItem.krs, { _key: taskState.targetKey });
        if (taskState.state) {
          newItem.krs[newIndex].finishTaskNumber =
            newItem.krs[newIndex].finishTaskNumber - 1;
        } else {
          newItem.krs[newIndex].notFinishTaskNumber =
            newItem.krs[newIndex].notFinishTaskNumber - 1;
        }
        console.log(newItem);
        changeOkrList(newItem);
      }
    }
  }, [taskState]);
  const chooseFatherO = () => {
    setFatherOkey(item._key);
    setODialogVisble(true);
  };
  const chooseOverOKey = async () => {
    console.log(item);
    console.log(item.upAlignKey);
    let upAlignRes: any = await api.okr.getSingleOKRDetail(item.upAlignKey);
    if (upAlignRes.msg === "OK") {
      setOverOKey(item._key);
      setOverOItem(upAlignRes.result);
    } else {
      dispatch(setMessage(true, upAlignRes.msg, "error"));
    }
  };
  const chooseOverSonKey = async (key) => {
    let upAlignRes: any = await api.okr.getSingleOKRDetail(key);
    if (upAlignRes.msg === "OK") {
      setOverSonKey(key);
      setOverSonItem(upAlignRes.result);
    } else {
      dispatch(setMessage(true, upAlignRes.msg, "error"));
    }
  };

  const saveUpAlign = async () => {
    if (!upLevelOKey) {
      dispatch(setMessage(true, "请选择一项目标", "error"));
      return;
    }
    let saveUpAlignRes: any = await api.okr.upAlign(
      fatherOkey,
      upLevelOKey,
      upLevelKRKey
    );
    if (saveUpAlignRes.msg === "OK") {
      console.log(saveUpAlignRes.result);
      dispatch(setMessage(true, "对齐成功", "success"));
      flashOkr();
      setODialogVisble(false);
    } else {
      dispatch(setMessage(true, saveUpAlignRes.msg, "error"));
    }
  };
  const changeKrItem = (key: string, value: any) => {
    setChangeState(true);
    setKrItem({ ...krItem, [key]: value });
  };
  const changeOItem = async (key, value) => {
    let setKRRes: any = await api.okr.updateOnlyOProperty(
      item._key,
      item.upAlignKey,
      item.upAlignKrKey,
      { [key]: value }
    );
    if (setKRRes.msg === "OK") {
      setOLogoIndex(10000);
      setOLogoVisible(false);
      let newItem = _.cloneDeep(item);
      newItem[key] = value;
      changeOkrList(newItem);
    } else {
      dispatch(setMessage(true, setKRRes.msg, "error"));
    }
  };
  const saveKr = async (type?: string) => {
    if (changeState || type) {
      let setKRRes: any = await api.okr.setKRProperty(krItem._key, {
        ...krItem,
      });
      if (setKRRes.msg === "OK") {
        console.log(setKRRes.result);
        let newItem = _.cloneDeep(item);
        let index = _.findIndex(newItem.krs, { _key: krItem._key });
        newItem.krs[index] = setKRRes.result;
        // setKrItem(null);
        // setKrVisible(false);
        setChangeState(false);
        changeOkrList(newItem);
      } else {
        dispatch(setMessage(true, setKRRes.msg, "error"));
      }
    }
    // else {
    //   addKr();
    // }
  };
  const addKr = async () => {
    let addKRRes: any = await api.okr.createKR(item._key, [{ title: "" }]);
    if (addKRRes.msg === "OK") {
      console.log(addKRRes.result);
      dispatch(setMessage(true, "创建kr成功", "success"));
      let newItem = _.cloneDeep(item);
      newItem.krs.push(addKRRes.result[0]);
      newItem.children.push(addKRRes.result._key);
      setKrItem(null);
      setKrVisible(false);
      changeOkrList(newItem);
    } else {
      dispatch(setMessage(true, addKRRes.msg, "error"));
    }
  };
  const deleteKr = async (krKey) => {
    let delKRRes: any = await api.okr.deleteKR(krKey);
    if (delKRRes.msg === "OK") {
      dispatch(setMessage(true, "删除kr成功", "success"));
      let newItem = _.cloneDeep(item);
      let index = _.findIndex(newItem.krs, { _key: krKey });
      newItem.krs.splice(index, 1);
      newItem.children.splice(index, 1);
      changeOkrList(newItem);
    } else {
      dispatch(setMessage(true, delKRRes.msg, "error"));
    }
  };
  const deleteO = async () => {
    let delORes: any = await api.okr.deleteO(item._key);
    if (delORes.msg === "OK") {
      dispatch(setMessage(true, "删除O成功", "success"));
      changeOkrList(item, "delete");
    } else {
      dispatch(setMessage(true, delORes.msg, "error"));
    }
  };
  const getKrTaskList = async (krKey) => {
    let krListORes: any = await api.okr.getKRTaskList(krKey);
    if (krListORes.msg === "OK") {
      console.log(krListORes.result);
      setKrList(krListORes.result);
    } else {
      dispatch(setMessage(true, krListORes.msg, "error"));
    }
  };
  const cancelUpAlign = async (oKey: string, cancelType: string) => {
    let cancelORes: any = await api.okr.cancelUpAlign(oKey);
    if (cancelORes.msg === "OK") {
      dispatch(setMessage(true, "删除关联成功", "success"));
      let newItem = null;
      if (cancelType === "down") {
        newItem = type ? _.cloneDeep(sonItem) : _.cloneDeep(item);
        let index = _.findIndex(newItem.downAlign, { downAlignKey: oKey });
        if (index !== -1) {
          newItem.downAlign.splice(index, 1);
        }
      } else {
        newItem =
          cancelType === "up" ? _.cloneDeep(sonItem) : _.cloneDeep(item);
        delete newItem.upAlignExecutorAvatar;
        delete newItem.upAlignExecutorName;
        delete newItem.upAlignIsFromKr;
        delete newItem.upAlignKey;
        delete newItem.upAlignKrKey;
        delete newItem.upAlignProgress;
        delete newItem.upAlignTitle;
      }
      changeOkrList(newItem, "changeUp", oKey);
    } else {
      dispatch(setMessage(true, cancelORes.msg, "error"));
    }
  };
  const cancelAlign = async (oKey, krKey) => {
    let cancelORes: any = await api.okr.cancelKRDownAlign(oKey, krKey);
    if (cancelORes.msg === "OK") {
      dispatch(setMessage(true, "删除关联成功", "success"));
      flashOkr();
    } else {
      dispatch(setMessage(true, cancelORes.msg, "error"));
    }
  };
  //okr cancelUpAlign post{ token, oKey}
  const addTask = async () => {
    let addTaskRes: any = await api.task.addNormalTask({
      type: 6,
      title: taskTitle,
      parentCardKey: krItem._key,
      groupKey: mainEnterpriseGroup?.mainEnterpriseGroupKey,
      taskEndDate: moment().endOf("day").valueOf(),
      executorKey: memberKey,
      taskType: 0,
    });
    if (addTaskRes.msg === "OK") {
      dispatch(setMessage(true, "添加任务成功", "success"));
      setKrList([...krList, addTaskRes.result]);
      setTaskTitle("");
      let newItem = _.cloneDeep(item);
      let index = _.findIndex(newItem.krs, { _key: krItem._key });

      newItem.krs[index].notFinishTaskNumber =
        newItem.krs[index].notFinishTaskNumber + 1;
      changeOkrList(newItem);
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const bindGroup = async (groupItem, targetType: string, type?: string) => {
    console.log(targetType);
    let newItem = _.cloneDeep(targetType === "o" ? item : krItem);
    let arr = [...newItem.bindGroupInfoArray];
    let keyArr = [...newItem.bindGroupKeyArray];
    let index = newItem.bindGroupKeyArray.indexOf(groupItem._key);
    if (type === "add") {
      if (index === -1) {
        keyArr.push(groupItem._key);
        arr.push({
          _key: groupItem._key,
          groupName: groupItem.groupName,
          groupLogo: groupItem.groupLogo,
        });
      } else {
        dispatch(setMessage(true, "已关联", "error"));
      }
    } else {
      keyArr.splice(index, 1);
      arr.splice(index, 1);
    }
    newItem.bindGroupInfoArray = arr;
    newItem.bindGroupKeyArray = keyArr;
    if (targetType === "o") {
      changeOkrList(newItem);
      let setORes: any = await api.okr.updateOnlyOProperty(
        item._key,
        item.upAlignKey,
        item.upAlignKrKey,
        { bindGroupKeyArray: keyArr }
      );
      if (setORes.msg === "OK") {
        changeOkrList(newItem);
      } else {
        dispatch(setMessage(true, setORes.msg, "error"));
      }
    } else {
      // let setKrRes: any = await api.okr.updateOnlyOProperty(
      //   item._key,
      //   item.upAlignKey,
      //   item.upAlignKrKey,
      //   { bindGroupKeyArray: keyArr }
      // );
      // if (setORes.msg === "OK") {
      // let newItem = _.cloneDeep(krItem);
      // newItem.bindGroupInfoArray = arr;
      // newItem.bindGroupKeyArray = keyArr;
      console.log(newItem);
      setKrItem({
        ...newItem,
      });
      // } else {
      //   dispatch(setMessage(true, setORes.msg, "error"));
      // }
    }
  };
  const getComment = async (nodeKey) => {
    let commentRes: any = await api.task.getTaskComment(nodeKey, 1, 1000);
    if (commentRes.msg === "OK") {
      setTaskCommentArray([...commentRes.result.reverse()]);
    } else {
      dispatch(setMessage(true, commentRes.msg, "error"));
    }
  };
  const getHistoryList = async (nodeKey) => {
    let historyRes: any = await api.task.getTaskHistory(nodeKey, 1, 1000, 2);
    if (historyRes.msg === "OK") {
      setTaskHistoryArray([...historyRes.result]);
    } else {
      dispatch(setMessage(true, historyRes.msg, "error"));
    }
  };
  const saveCommentMsg = async (nodeKey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    if (commentInput !== "") {
      let saveRes: any = await api.task.addComment(nodeKey, commentInput);
      if (saveRes.msg === "OK") {
        dispatch(setMessage(true, "评论成功", "success"));
        newCommentArray.push(saveRes.result);
        setTaskCommentArray([...newCommentArray]);
        setCommentInput("");
      } else {
        dispatch(setMessage(true, saveRes.msg, "error"));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除评论成功", "success"));
      newCommentArray.splice(commentIndex, 1);
      setTaskCommentArray([...newCommentArray]);
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const changeKrContent = (value: string) => {
    if (typeof value === "string") {
      setContent(value);
    } else {
      dispatch(setMessage(true, "内容无法保存,请重新输入内容", "error"));
      return;
    }
    changeKrItem("content", value);
  };
  const changeOContent = (value: string) => {
    if (typeof value === "string") {
      setContent(value);
    } else {
      dispatch(setMessage(true, "内容无法保存,请重新输入内容", "error"));
      return;
    }
  };
  const toTargetGroup = async (groupKey: string) => {
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    dispatch(getGroupMember(groupKey, 4));
    // dispatch(getGroup(3, null, 1));
  };
  const moveProgress = (e, type?: string) => {
    let event = e || window.event;
    let newProgress = 0;
    // let leftVal = event.clientX - barRef.current.offsetLeft;
    console.log(e.clientX);
    console.log(progressRef.current.getBoundingClientRect().left);
    barleft.current =
      event.clientX - progressRef.current.getBoundingClientRect().left;
    console.log(barleft.current);
    if (barleft.current <= 280) {
      barRef.current.style.left = barleft.current + "px";
      txtRef.current.style.left = barleft.current - 8 + "px";
    }
    newProgress = barleft.current / 2.8;
    setProgress(newProgress);
    if (type) {
      setMoveState(false);
      changeKrItem(
        "progress",
        parseInt((newProgress > 100 ? 100 : newProgress) + "")
      );
    }
  };
  const onDragEnd = async (result: any) => {
    console.log(result);
    let newItem = _.cloneDeep(item);
    let newchildren = [];
    let krItem = _.cloneDeep(newItem.krs[result.source.index]);
    newItem.krs.splice(result.source.index, 1);
    newItem.krs.splice(result.destination.index, 0, krItem);
    changeOkrList(newItem);
    newItem.krs.forEach((item) => {
      newchildren.push(item._key);
    });

    let dragRes: any = await api.okr.updateOOrKROrder({
      enterpriseGroupKey: mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey: periodList[periodIndex]._key,
      targetUKey: memberKey,
      newChildrenOrder: newchildren,
      oKey: item._key,
    });
    if (dragRes.msg === "OK") {
      console.log(dragRes);
    } else {
      dispatch(setMessage(true, dragRes.msg, "error"));
    }
  };
  const linkGroup = (
    <ClickOutside
      onClickOutside={() => {
        setGroupVisible(false);
      }}
    >
      <div className="dropDown-box drop-box">
        <Contact contactIndex={0} contactType={"o"} bindGroup={bindGroup} />
      </div>
    </ClickOutside>
  );
  const linkKrGroup = (
    <ClickOutside
      onClickOutside={() => {
        setGroupVisible(false);
      }}
    >
      <div className="dropDown-box drop-box">
        <Contact contactIndex={0} contactType={"kr"} bindGroup={bindGroup} />
      </div>
    </ClickOutside>
  );
  return (
    <div className="okrTable" style={type ? { ...krStyle } : {}}>
      {!type ? (
        <div className="okrTable-header">
          <div
            className="okrTable-left"
            onClick={() => {
              if (!item.upAlignKey) {
                chooseFatherO();
              }
            }}
            onMouseLeave={() => {
              setOverOItem(null);
              setOverOKey(null);
            }}
            style={{ boxSizing: "border-box" }}
          >
            {item.upAlignKey ? (
              <>
                <span style={{ width: "90px" }}>已对齐目标 :</span>
                <Avatar
                  avatar={item.upAlignExecutorAvatar}
                  name={item.upAlignExecutorName}
                  type={"person"}
                  index={0}
                  size={22}
                  avatarStyle={{ margin: "0px 5px" }}
                />

                <Dropdown
                  visible={overOKey === item._key}
                  trigger={["click"]}
                  overlay={
                    <div
                      className="dropDown-box dropover-box"
                      style={
                        !overOItem
                          ? { display: "none" }
                          : { backgroundColor: "#eff3f5" }
                      }
                    >
                      {overOItem ? (
                        <UpLevelOkrItem
                          item={overOItem}
                          type={"show"}
                          changeOkrList={changeOkrList}
                          sonItem={item}
                          krStyle={{
                            backgroundColor: "#eff3f5",
                            padding: "5px 10px",
                          }}
                        />
                      ) : null}
                    </div>
                  }
                >
                  <div
                    className="dropMenu-upBox"
                    onClick={() => {
                      if (item.upAlignKey) {
                        chooseOverOKey();
                      }
                      setOverSonKey(null);
                      setOverSonItem(null);
                    }}
                  >
                    {item.upAlignTitle}
                  </div>
                </Dropdown>
                {!type && targetRole < 4 ? (
                  <div className="okr-cancel-box">
                    <Tooltip title="删除关联">
                      <img
                        src={cancelUpAlignSvg}
                        alt=""
                        className="okr-cancel-align"
                        onClick={() => {
                          cancelUpAlign(item._key, "targetUp");
                        }}
                      />
                    </Tooltip>
                  </div>
                ) : null}
              </>
            ) : targetRole < 4 || user?._key === memberKey ? (
              <>
                <img
                  src={okraddSvg}
                  alt=""
                  style={{
                    marginRight: "10px",
                    width: "12px",
                    height: "12px",
                  }}
                />
                向上对齐
              </>
            ) : null}
            {/* <DropMenu
              visible={overOKey === item._key}
              dropStyle={{
                width: "600px",
                maxHeight: "320px",
                top: "45px",
                left: "55px",
                overflow: "auto",
              }}
              onClose={() => {
                setOverOKey(null);
              }}
            >
              {overOItem ? (
                <UpLevelOkrItem item={overOItem} type={"show"} />
              ) : null}
            </DropMenu> */}
          </div>
          <div className="okrTable-right" style={{ fontWeight: 800 }}>
            <div>子目标</div>
            <div>关联项目</div>
            <div>进度</div>
            <div>信心值</div>
            <div>权重</div>
            <div>任务</div>
          </div>
          {memberRole > targetRole || user?._key === memberKey ? (
            <div className="okr-set-button">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <div onClick={deleteO}>删除目标</div>
                    </Menu.Item>
                  </Menu>
                }
              >
                <DashOutlined />
              </Dropdown>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className="okrTable-o"
        style={type ? { marginBottom: "10px" } : {}}
        onClick={() => {
          if (!type) {
            setOVisible(true);
            setKrVisible(false);
            getComment(item._key);
            getHistoryList(item._key);
            setDrawVisible(true);
          }
        }}
        onMouseLeave={() => {
          setOverOKey(null);
          setOverOItem(null);
          setOverSonKey(null);
          setOverSonItem(null);
        }}
      >
        <div className="okrTable-left" style={type ? { width: "100%" } : {}}>
          {!type || targetRole < 4 || user?._key === memberKey ? (
            <Dropdown
              overlay={
                <div className="dropDown-box drop-box">
                  {ologoType.map((item, index) => {
                    return (
                      <div
                        className="okr-oLogo-title"
                        key={"ologo" + index}
                        style={{
                          color: item.color,
                          border: "1px solid " + item.color,
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          changeOItem("priority", index + 1);
                        }}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              }
            >
              <div
                className="okrTable-oLogo"
                style={{
                  color: ologoType[item.priority - 1]?.color,
                  backgroundColor: ologoType[item.priority - 1]?.bgColor,
                }}
              >
                O目标
              </div>
            </Dropdown>
          ) : (
            <div
              className="okrTable-oLogo"
              style={{
                color: ologoType[item.priority - 1]?.color,
                backgroundColor: ologoType[item.priority - 1]?.bgColor,
              }}
            >
              O目标
            </div>
          )}
          {/* 
          <div className="okrTable-oTitle toLong"> */}
          <TextArea
            placeholder="新OKR"
            bordered={false}
            value={oTitle}
            autoSize={{ minRows: 1 }}
            style={{ fontWeight: 600, fontSize: "16px" }}
            onBlur={() => {
              changeOItem("title", oTitle);
            }}
            onChange={(e) => {
              setOTitle(e.target.value);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            // onFoucus={(e) => {
            //   if (e.keyCode === 10) {
            //     changeOItem("title", oTitle);
            //   }
            // }}
            disabled={
              type || (targetRole > 3 && user?._key !== memberKey)
                ? true
                : false
            }
          />
          <Progress
            type="circle"
            percent={isNaN(item.progress) ? 0 : item.progress}
            width={40}
            strokeWidth={10}
            style={{ marginLeft: "10px" }}
          />
          {/* </div> */}
        </div>

        {!type ? (
          <div className="okrTable-right">
            <div>
              {item?.downAlign
                ? item.downAlign.map((downItem, downIndex) => {
                    return (
                      <>
                        {!downItem.downAlignIsFromKr ? (
                          <div
                            className="oItem-align-item okrTable-o-item"
                            onMouseEnter={() => {
                              chooseOverSonKey(downItem.downAlignKey);
                              setOverOKey(null);
                              setOverOItem(null);
                            }}
                            onMouseLeave={() => {
                              setOverSonKey(null);
                              setOverSonItem(null);
                            }}
                            key={"downItem" + downIndex}
                          >
                            <Dropdown
                              visible={overSonKey === downItem.downAlignKey}
                              overlay={
                                <div
                                  className="dropDown-box dropover-box"
                                  style={
                                    !overSonItem ||
                                    overSonKey !== downItem.downAlignKey
                                      ? { display: "none" }
                                      : { backgroundColor: "#eff3f5" }
                                  }
                                >
                                  {overSonItem &&
                                  overSonKey === downItem.downAlignKey ? (
                                    <UpLevelOkrItem
                                      item={overSonItem}
                                      type={"sonshow"}
                                      sonItem={item}
                                      krStyle={{
                                        backgroundColor: "#eff3f5",
                                        padding: "5px 10px",
                                      }}
                                    />
                                  ) : null}
                                </div>
                              }
                            >
                              <>
                                <Avatar
                                  avatar={downItem?.downAlignExecutorAvatar}
                                  name={downItem?.downAlignExecutorName}
                                  type={"person"}
                                  index={0}
                                  size={24}
                                  avatarStyle={{
                                    position: "absolute",
                                    top: 3,
                                    left: 3,
                                    zIndex: 1,
                                  }}
                                />
                                <Progress
                                  type="circle"
                                  width={30}
                                  showInfo={false}
                                  percent={
                                    downItem?.downAlignProgress
                                      ? isNaN(downItem.downAlignProgress)
                                        ? 0
                                        : downItem.downAlignProgress
                                      : 0
                                  }
                                />
                              </>
                            </Dropdown>
                          </div>
                        ) : null}
                      </>
                    );
                  })
                : null}
            </div>
            <div>
              {item?.bindGroupInfoArray
                ? item.bindGroupInfoArray.map((groupItem, groupIndex) => {
                    return (
                      <Tooltip title={groupItem?.groupName}>
                        <div
                          className="oItem-group-item okrTable-o-item"
                          key={"ogroup" + groupIndex}
                          onClick={() => {
                            dispatch(setGroupKey(groupItem?._key));
                            dispatch(setCommonHeaderIndex(3));
                            dispatch(setHeaderIndex(3));
                            dispatch(changeStartId(groupItem?.taskTreeRootKey));
                          }}
                        >
                          <Avatar
                            avatar={groupItem?.groupLogo}
                            name={groupItem?.groupName}
                            type={"group"}
                            index={0}
                            size={24}
                          />
                        </div>
                      </Tooltip>
                    );
                  })
                : null}
            </div>
          </div>
        ) : targetRole < 4 || user?._key === memberKey ? (
          <Button
            onClick={() => {
              cancelUpAlign(
                type === "show" ? sonItem._key : item._key,
                type === "show" ? "up" : "down"
              );
            }}
          >
            取消对齐
          </Button>
        ) : null}
      </div>
      <div className="okrTable-kr-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"droppablekr"}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {item.krs.map((targetItem, krIndex) => {
                  return (
                    <Draggable
                      key={"krDrag-" + targetItem._key + krIndex}
                      draggableId={"krDrag-" + targetItem._key + krIndex}
                      index={krIndex}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="okr-drag"
                          onMouseEnter={() => {
                            setDragKey("krDrag-" + targetItem._key + krIndex);
                          }}
                          onMouseLeave={() => {
                            setDragKey("");
                          }}
                        >
                          {dragKey === "krDrag-" + targetItem._key + krIndex ? (
                            <div
                              className="okr-drag-handle"
                              {...provided.dragHandleProps}
                            >
                              <HolderOutlined />
                            </div>
                          ) : null}
                          <div
                            className="okrTable-kr"
                            style={
                              type
                                ? { marginBottom: "5px", marginTop: "0px" }
                                : {}
                            }
                          >
                            <div
                              className="okrTable-left kr-item"
                              style={type ? { width: "100%" } : {}}
                              // onClick={() => {
                              //   if (krItem?._key !== targetItem?._key) {
                              //     setKrItem(targetItem);
                              //     setKrTitle(targetItem.title);
                              //   }
                              // }}
                            >
                              <span className="okrTable-krLogo">KR</span>
                              {/* { ? ( */}
                              <TextArea
                                placeholder="关键结果"
                                bordered={false}
                                autoSize={{ minRows: 1 }}
                                value={
                                  krItem?._key === targetItem?._key
                                    ? krTitle
                                    : targetItem.title
                                }
                                onBlur={() => {
                                  console.log("????");
                                  if (krTitle !== targetItem.title) {
                                    saveKr("save");
                                  }
                                  // setKrTitle("");
                                }}
                                onFocus={(e) => {
                                  setKrItem(targetItem);
                                  setKrTitle(targetItem.title);
                                }}
                                // onKeyPress={(e) => {
                                //   if (e.keyCode === 10) {
                                //     setKrItem(targetItem);
                                //     setKrTitle(targetItem.title);
                                //   }
                                // }}
                                disabled={
                                  type ||
                                  (targetRole > 3 && user?._key !== memberKey)
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  console.log(e.target.value);
                                  setKrTitle(e.target.value);
                                  changeKrItem("title", e.target.value);
                                }}
                              />
                              {!type &&
                              targetItem?.downAlign &&
                              targetItem.downAlign.length > 0 ? (
                                <div className="okr-cancel-box">
                                  <Tooltip title="删除关联">
                                    <img
                                      src={cancelUpAlignSvg}
                                      alt=""
                                      className="okr-cancel-align"
                                      onClick={() => {
                                        cancelAlign(item._key, targetItem._key);
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              ) : null}
                            </div>
                            {!type ? (
                              <div
                                className="okrTable-right"
                                onClick={() => {
                                  if (
                                    targetRole < 4 ||
                                    user?._key === memberKey
                                  ) {
                                    setKrItem(targetItem);
                                    setKrTitle(targetItem.title);
                                    setWeight(targetItem.weight);
                                    setKrVisible(true);
                                    setOVisible(false);
                                    getComment(targetItem._key);
                                    getHistoryList(targetItem._key);
                                    setContent(targetItem.content);
                                    setDrawVisible(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  setOverOKey(null);
                                  setOverOItem(null);
                                  setOverSonKey(null);
                                  setOverSonItem(null);
                                }}
                              >
                                <div>
                                  {targetItem?.downAlign
                                    ? targetItem.downAlign.map(
                                        (downItem, downIndex) => {
                                          return (
                                            <div
                                              className="oItem-align-item okrTable-o-item"
                                              onMouseEnter={() => {
                                                chooseOverSonKey(
                                                  downItem.downAlignKey
                                                );
                                                setOverOKey(null);
                                                setOverOItem(null);
                                              }}
                                              onMouseLeave={() => {
                                                setOverSonKey(null);
                                                setOverSonItem(null);
                                              }}
                                              key={"downItem" + downIndex}
                                            >
                                              <Dropdown
                                                visible={
                                                  overSonKey ===
                                                  downItem.downAlignKey
                                                }
                                                overlay={
                                                  <div
                                                    className="dropDown-box dropover-box"
                                                    style={
                                                      !overSonItem ||
                                                      overSonKey !==
                                                        downItem.downAlignKey
                                                        ? { display: "none" }
                                                        : {
                                                            backgroundColor:
                                                              "#eff3f5",
                                                          }
                                                    }
                                                  >
                                                    {overSonItem &&
                                                    overSonKey ===
                                                      downItem.downAlignKey ? (
                                                      <UpLevelOkrItem
                                                        item={overSonItem}
                                                        type={"sonshow"}
                                                        sonItem={item}
                                                        krStyle={{
                                                          backgroundColor:
                                                            "#eff3f5",
                                                          padding: "5px 10px",
                                                        }}
                                                      />
                                                    ) : null}
                                                  </div>
                                                }
                                              >
                                                <>
                                                  <Avatar
                                                    avatar={
                                                      downItem?.downAlignExecutorAvatar
                                                    }
                                                    name={
                                                      downItem?.downAlignExecutorName
                                                    }
                                                    type={"person"}
                                                    index={0}
                                                    size={24}
                                                    avatarStyle={{
                                                      position: "absolute",
                                                      top: 3,
                                                      left: 3,
                                                      zIndex: 1,
                                                    }}
                                                  />
                                                  <Progress
                                                    type="circle"
                                                    width={30}
                                                    showInfo={false}
                                                    percent={
                                                      downItem?.downAlignProgress
                                                        ? isNaN(
                                                            downItem.downAlignProgress
                                                          )
                                                          ? 0
                                                          : downItem.downAlignProgress
                                                        : 0
                                                    }
                                                  />
                                                </>
                                              </Dropdown>
                                            </div>
                                          );
                                        }
                                      )
                                    : null}
                                </div>
                                <div>
                                  {targetItem?.bindGroupInfoArray
                                    ? targetItem.bindGroupInfoArray.map(
                                        (groupItem, groupIndex) => {
                                          return (
                                            <Tooltip
                                              title={groupItem?.groupName}
                                            >
                                              <div
                                                className="oItem-group-item okrTable-o-item"
                                                key={"krgroup" + groupIndex}
                                                onClick={() => {
                                                  dispatch(
                                                    setGroupKey(groupItem?._key)
                                                  );
                                                  dispatch(
                                                    setCommonHeaderIndex(3)
                                                  );
                                                  dispatch(setHeaderIndex(3));
                                                  dispatch(
                                                    changeStartId(
                                                      groupItem?.taskTreeRootKey
                                                    )
                                                  );
                                                }}
                                              >
                                                <Avatar
                                                  avatar={groupItem?.groupLogo}
                                                  name={groupItem?.groupName}
                                                  type={"group"}
                                                  index={0}
                                                  size={24}
                                                />
                                              </div>
                                            </Tooltip>
                                          );
                                        }
                                      )
                                    : null}
                                </div>
                                <div>
                                  <Progress
                                    type="circle"
                                    percent={targetItem.progress}
                                    width={20}
                                    showInfo={false}
                                    strokeColor={
                                      targetItem?.state === 2
                                        ? "#FF9A01"
                                        : targetItem?.state === 3
                                        ? "#D0021B"
                                        : "#17B881"
                                    }
                                    strokeWidth={15}
                                  />
                                  <div style={{ marginLeft: "5px" }}>
                                    {targetItem?.progress
                                      ? targetItem.progress + "%"
                                      : "0%"}
                                  </div>
                                </div>
                                {/* <img src={kr1IconSvg} alt="" /> */}
                                <div>
                                  {targetItem?.confidence
                                    ? targetItem.confidence
                                    : 1}
                                </div>
                                {/* <img src={kr2IconSvg} alt="" /> */}
                                <div>
                                  {targetItem?.weight
                                    ? parseInt(
                                        (+targetItem.weight / +item.weightNum) *
                                          100 +
                                          ""
                                      ) + "%"
                                    : "100%"}
                                </div>
                                {/* <img src={kr3IconSvg} alt="" /> */}
                                <div
                                // onClick={(e) => {
                                //   if (
                                //     memberRole < 4 ||
                                //     user?._key === memberKey
                                //   ) {
                                //     e.stopPropagation();
                                //     setTaskVisible(true);
                                //     setKrItem(targetItem);
                                //     setKrTitle(targetItem.title);
                                //     // getKrTaskList(targetItem._key);
                                //   }
                                // }}
                                >
                                  {`${
                                    isNaN(targetItem.finishTaskNumber)
                                      ? 0
                                      : targetItem.finishTaskNumber
                                  } / 
                  ${
                    isNaN(
                      targetItem.finishTaskNumber +
                        targetItem.notFinishTaskNumber
                    )
                      ? 0
                      : targetItem.finishTaskNumber +
                        targetItem.notFinishTaskNumber
                  }`}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {!type && (targetRole < 4 || user?._key === memberKey) ? (
        <div className="okrTable-footer">
          <div
            className="okrTable-left"
            style={{
              paddingLeft: "45px",
              color: "#7c8192",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <img
              src={addKrSvg}
              alt=""
              style={{ marginRight: "10px", width: "14px", height: "14px" }}
              onClick={() => {
                // setKrItem({});
                // setKrVisible(true);
                addKr();
              }}
            />
            <div
              onClick={() => {
                addKr();
              }}
            >
              增加kr
            </div>
          </div>
        </div>
      ) : null}
      <Modal
        visible={oDialogVisble}
        onCancel={() => {
          setODialogVisble(false);
        }}
        onOk={() => {
          saveUpAlign();
        }}
        destroyOnClose={true}
        title={"选择向上对齐的目标"}
        width={"60vw"}
        bodyStyle={{ padding: "10px", height: "70vh" }}
      >
        <OkrDialog
          memberList={memberList}
          periodList={periodList}
          periodIndex={periodIndex}
          upLevelOKey={upLevelOKey}
          setUpLevelOKey={setUpLevelOKey}
          upLevelKRKey={upLevelKRKey}
          setUpLevelKRKey={setUpLevelKRKey}
          fatherOkey={fatherOkey}
        />
      </Modal>
      <Drawer
        title={`KR详情`}
        width={414}
        onClose={() => {
          saveKr();
          setKrVisible(false);
          setDrawVisible(false);
          setGroupVisible(false);
          setContent("");
          setActiveKey("1");
        }}
        visible={krVisible && item._key === chooseOKey}
        bodyStyle={{ padding: "15px 20px 55px 20px" }}
        contentWrapperStyle={{
          top: "83px",
          right: "15px",
          height: "calc(100vh - 83px)",
        }}
        destroyOnClose={true}
        mask={false}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                saveKr();
                setGroupVisible(false);
                setContent("");
                setActiveKey("1");
              }}
            >
              保存
            </Button>
          </Space>
        }
      >
        <div
          onMouseLeave={() => {
            saveKr();
          }}
          className="kr-dialog-container"
        >
          {targetRole > 3 && user?._key !== memberKey ? (
            <div className="kr-dialog-mask"></div>
          ) : null}
          <div className="krItem-name">
            <div
              className="okrTable-oLogo"
              style={{
                color: ologoType[item.priority - 1]?.color,
                backgroundColor: ologoType[item.priority - 1]?.bgColor,
                width: "45px",
              }}
              // onClick={() => {
              //   setOLogoVisible(true);
              // }}
            >
              KR
            </div>
            <TextArea
              placeholder="请输入标题"
              value={krTitle}
              onChange={(e) => {
                setKrTitle(e.target.value);
              }}
              onBlur={(e) => {
                changeKrItem("title", krTitle);
              }}
              autoSize={{ minRows: 1 }}
              bordered={false}
              style={{
                fontSize: "18px",
                lineHeight: "26px",
                width: "calc(100% - 60px)",
                padding: "0px",
                borderRadius: "4px",
              }}
            />
          </div>

          <div className="dp-space-center">
            <div
              className="krItem-title"
              style={{ width: "90px", height: "70px" }}
            >
              形象进度
            </div>
            {/* <div ref={progressRef}>
          <div className="scroll" ref={scrollRef}>
            <div
              className="bar"
              ref={barRef}
              onMouseDown={(e) => {
                changeProgress(e);
              }}
            ></div>
            <div className="mask" ref={maskRef}></div>
          </div>
        </div> */}
            <div
              className="krItem-progress"
              ref={progressRef}
              onMouseMove={(e) => {
                if (moveState) {
                  moveProgress(e);
                }
              }}
              onMouseUp={() => {
                setMoveState(false);
                changeKrItem(
                  "progress",
                  parseInt((progress > 100 ? 100 : progress) + "")
                );
              }}
              onClick={(e) => {
                moveProgress(e, "click");
              }}
            >
              <Progress percent={progress + 3} showInfo={false} />
              <div className="krItem-progress-num" ref={txtRef}>
                {parseInt((progress > 100 ? 100 : progress) + "") + "%"}
              </div>
              <div
                className="krItem-progress-box"
                onMouseDown={() => {
                  setMoveState(true);
                }}
                ref={barRef}
              ></div>
            </div>
          </div>
          <div className="dp-space-center">
            <div
              className="krItem-title"
              style={{ marginTop: "0px", width: "90px" }}
            >
              状态
            </div>
            <div className="krItem-state">
              <Radio.Group
                onChange={(e) => {
                  changeKrItem("state", e.target.value);
                }}
                value={krItem?.state ? krItem.state : 1}
              >
                <Radio value={1} style={{ color: "#17B881" }}>
                  正常
                </Radio>
                <Radio value={2} style={{ color: "#FF9A01" }}>
                  风险
                </Radio>
                <Radio value={3} style={{ color: "#D0021B" }}>
                  延期
                </Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="dp-space-center">
            <div className="krItem-title" style={{ width: "90px" }}>
              信心值
            </div>
            <Rate
              character={({ index }) => (
                <img
                  src={
                    krItem?.confidence <= index ? confidencewSvg : confidenceSvg
                  }
                  alt=""
                  style={{ width: "18px" }}
                />
              )}
              count={10}
              value={krItem?.confidence ? krItem.confidence : 1}
              onChange={(value) => {
                changeKrItem("confidence", value);
              }}
            />
          </div>
          <div className="dp-space-center">
            <div className="krItem-title">权重 (1~100)</div>
            <InputNumber
              min={1}
              max={100}
              placeholder="请输入权重"
              value={weight}
              onBlur={() => {
                changeKrItem("weight", +weight);
              }}
              onChange={(value) => {
                setWeight(value);
              }}
            />
          </div>

          <div
            className="krItem-title"
            style={{ justifyContent: "space-between" }}
          >
            <span>子目标</span>
            <span
              style={{ color: "#999", fontSize: "12px", cursor: "pointer" }}
            >
              对齐到本目标的
            </span>
          </div>
          <div className="oItem-downAlign">
            {krItem?.downAlign
              ? krItem.downAlign.map((downItem, downIndex) => {
                  return (
                    <div
                      className="oItem-downAlign-item"
                      key={"krDownItem" + downIndex}
                    >
                      <Avatar
                        avatar={downItem?.downAlignExecutorAvatar}
                        name={downItem?.downAlignExecutorName}
                        type={"person"}
                        index={0}
                        size={32}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {downItem?.downAlignTitle}
                      </div>
                      <Tooltip title="删除关联">
                        <div
                          className="kr-item-button"
                          onClick={() => {
                            cancelUpAlign(downItem.downAlignKey, "down");
                          }}
                        >
                          <img
                            src={cancelUpAlignSvg}
                            alt=""
                            style={{ cursor: "pointer", marginTop: "5px" }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              : null}
          </div>
          <div
            className="krItem-title"
            style={{ justifyContent: "space-between" }}
          >
            关联项目
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Dropdown
                overlay={linkKrGroup}
                trigger={["click"]}
                visible={groupVisible}
              >
                <img
                  src={okrlinkGroupSvg}
                  alt=""
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                  onClick={() => {
                    setGroupVisible(true);
                  }}
                />
              </Dropdown>

              <GroupCreate addPng={addKrSvg} />
            </div>
          </div>
          <div className="oItem-downAlign">
            {krItem?.bindGroupKeyArray
              ? krItem.bindGroupInfoArray.map((groupItem, groupIndex) => {
                  return (
                    <div
                      className="oItem-downAlign-item"
                      key={"group" + groupIndex}
                      onClick={() => {
                        toTargetGroup(groupItem._key);
                      }}
                    >
                      <Avatar
                        avatar={groupItem?.groupLogo}
                        name={groupItem?.groupName}
                        type={"person"}
                        index={0}
                        size={32}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {groupItem?.groupName}
                      </div>
                      <Tooltip title="删除关联">
                        <div
                          className="kr-item-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            bindGroup(groupItem, "kr", "del");
                          }}
                        >
                          <img
                            src={cancelUpAlignSvg}
                            alt=""
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onChange={(activeKey) => {
            setActiveKey(activeKey);
          }}
        >
          <TabPane
            tab={`任务(${
              krItem && krItem.finishTaskNumber ? krItem.finishTaskNumber : 0
            } / ${
              krItem
                ? isNaN(krItem.finishTaskNumber + krItem.notFinishTaskNumber)
                  ? 0
                  : krItem.finishTaskNumber + krItem.notFinishTaskNumber
                : 0
            }) `}
            key="1"
          >
            <div className="okr-comment-task">
              <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                <TextArea
                  placeholder="请输入标题"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                  }}
                  onPressEnter={addTask}
                  rows={5}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <Button
                  type="primary"
                  onClick={addTask}
                  disabled={taskTitle ? false : true}
                >
                  提交
                </Button>
              </div>
              <div className="krList-content">
                {krList
                  ? krList.map((item, index) => {
                      return (
                        <Task
                          key={"krList" + index}
                          taskItem={item}
                          type="okr"
                        />
                      );
                    })
                  : null}
              </div>
            </div>
          </TabPane>
          <TabPane tab={"评论(" + taskCommentArray.length + ")"} key="2">
            <div className="okr-comment-tabs">
              <div
                className="comment-input"
                style={{
                  position: "fixed",
                  bottom: "15px",
                  right: "30px",
                  width: "384px",
                }}
              >
                <Input
                  value={commentInput}
                  onChange={(e) => {
                    setCommentInput(e.target.value);
                  }}
                  placeholder="添加评论"
                  style={{ width: "calc(100% - 80px)" }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    saveCommentMsg(krItem._key);
                  }}
                  disabled={commentInput ? false : true}
                >
                  提交
                </Button>
              </div>
              <div
                style={{
                  margin: "15px 0px",
                  width: "100%",
                  padding: "0px 10px",
                  boxSizing: "border-box",
                }}
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
            </div>
          </TabPane>
          <TabPane tab={"历史(" + taskHistoryArray.length + ")"} key="3">
            <div className="okr-comment-history">
              {taskHistoryArray.map(
                (historyItem: any, historyIndex: number) => {
                  return (
                    <Timeline key={"timeline" + historyIndex}>
                      <Timeline.Item>
                        <div className="okr-comment-historyLog">
                          <div className="okr-comment-title">
                            <Avatar
                              avatar={historyItem?.etc?.avatar}
                              name={historyItem?.etc?.nickName}
                              type={"person"}
                              index={historyIndex}
                              size={18}
                              avatarStyle={{ marginTop: "3px" }}
                            />
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#333",
                                marginLeft: "5px",
                                width: "calc(100% - 20px)",
                              }}
                            >
                              {historyItem.log}
                            </div>
                          </div>
                          {moment(
                            moment().valueOf() -
                              parseInt(historyItem.createTime) >
                              0
                              ? parseInt(historyItem.createTime)
                              : moment().valueOf() - 3000
                          ).fromNow()}
                        </div>
                      </Timeline.Item>
                    </Timeline>
                  );
                }
              )}
            </div>
          </TabPane>
          <TabPane tab="备注" key="4">
            {content !== null ? (
              <Editor
                data={content}
                height={document.body.offsetHeight - 390}
                onChange={changeKrContent}
                editorKey={krItem?._key}
                // setImgFileList={setImgFileList}
                cardKey={krItem?._key}
              />
            ) : null}
          </TabPane>
        </Tabs>
      </Drawer>
      <Drawer
        title={`O详情`}
        width={414}
        onClose={() => {
          if (content) {
            changeOItem("content", content);
          }
          setOVisible(false);
          setDrawVisible(false);
          setGroupVisible(false);
          setContent("");
          setActiveKey("1");
        }}
        contentWrapperStyle={{
          top: "83px",
          right: "15px",
          height: "calc(100vh - 83px)",
        }}
        visible={oVisible && chooseOKey === item._key}
        bodyStyle={{ padding: "15px 20px" }}
        destroyOnClose={true}
        mask={false}
      >
        <div className="kr-dialog-container">
          {targetRole > 3 && user?._key !== memberKey ? (
            <div className="kr-dialog-mask"></div>
          ) : null}
          {item.upAlignKey ? (
            <>
              <div
                style={{
                  display: "flex",
                  height: "30px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "10px 0px 15px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  已关联父目标
                  <Avatar
                    avatar={item.upAlignExecutorAvatar}
                    name={item.upAlignExecutorName}
                    type={"person"}
                    index={0}
                    size={22}
                    avatarStyle={{ margin: "0px 5px" }}
                  />
                  {item.upAlignTitle}
                </div>
                <Tooltip title="删除关联">
                  <img
                    src={cancelUpAlignSvg}
                    alt=""
                    style={{ cursor: "pointer", width: "15px", height: "15px" }}
                    onClick={() => {
                      cancelUpAlign(item._key, "targetUp");
                    }}
                  />
                </Tooltip>
              </div>
            </>
          ) : null}
          <div className="krItem-name">
            <div
              className="okrTable-oLogo"
              style={{
                color: ologoType[item.priority - 1]?.color,
                backgroundColor: ologoType[item.priority - 1]?.bgColor,
              }}
              onClick={() => {
                setOLogoVisible(true);
              }}
            >
              O目标
              <DropMenu
                visible={oLogoVisible}
                dropStyle={{
                  top: "25px",
                  left: "-25px",
                  color: "#333",
                  overflow: "visible",
                  padding: "10px 15px 0px 15px",
                  boxSizing: "border-box",
                  zIndex: 3,
                }}
                onClose={() => {
                  // setMenuVisible(false);
                }}
              >
                {ologoType.map((item, index) => {
                  return (
                    <div
                      className="okr-oLogo-title"
                      key={"ologo" + index}
                      style={{
                        color: item.color,
                        border: "1px solid " + item.color,
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        changeOItem("priority", index + 1);
                      }}
                    >
                      {item.title}
                    </div>
                  );
                })}
              </DropMenu>
            </div>
            <TextArea
              placeholder="请输入标题"
              value={oTitle}
              onBlur={() => {
                changeOItem("title", oTitle);
              }}
              onChange={(e) => {
                setOTitle(e.target.value);
              }}
              autoSize={{ minRows: 1 }}
              bordered={false}
              style={{
                fontSize: "18px",
                lineHeight: "26px",
                width: "calc(100% - 45px)",
                padding: "0px",
              }}
            />
          </div>
          <Divider />
          <div
            className="krItem-title"
            style={{ justifyContent: "space-between" }}
          >
            KR (关键结果):
            <img
              src={addKrSvg}
              alt=""
              style={{
                marginRight: "10px",
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
              onClick={() => {
                // setKrItem({});
                // setKrVisible(true);
                addKr();
              }}
            />
          </div>
          {item.krs.map((targetItem, krIndex) => {
            return (
              <div
                className="okrTable-kr"
                key={"oItem" + krIndex}
                style={type ? { marginBottom: "5px", marginTop: "0px" } : {}}
              >
                <div
                  className="okrTable-left kr-item2 toLong"
                  style={{ width: "100%", paddingLeft: "0px" }}
                  onClick={() => {
                    setKrItem(targetItem);
                    setKrTitle(targetItem.title);
                  }}
                >
                  <span className="okrTable-krLogo">KR</span>
                  {/* { ? ( */}
                  <TextArea
                    placeholder="关键结果"
                    bordered={false}
                    value={
                      krItem?._key === targetItem?._key
                        ? krTitle
                        : targetItem.title
                    }
                    style={{ width: "calc(100% - 60px)" }}
                    onBlur={() => {
                      saveKr("save");
                      // setKrTitle("");
                    }}
                    autoSize={{ minRows: 1 }}
                    onChange={(e) => {
                      setKrTitle(e.target.value);
                      changeKrItem("title", e.target.value);
                    }}
                  />
                  <div
                    className="kr-item-button"
                    onClick={() => {
                      deleteKr(targetItem._key);
                    }}
                  >
                    <DeleteOutlined style={{ color: "999" }} />
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="krItem-title"
            style={{ justifyContent: "space-between" }}
          >
            <span>子目标</span>
            <span
              style={{ color: "#999", fontSize: "12px", cursor: "pointer" }}
            >
              对齐到本目标的
            </span>
          </div>
          <div className="oItem-downAlign">
            {item?.downAlign
              ? item.downAlign.map((downItem, downIndex) => {
                  return (
                    <div className="oItem-downAlign-item">
                      <Avatar
                        avatar={downItem?.downAlignExecutorAvatar}
                        name={downItem?.downAlignExecutorName}
                        type={"person"}
                        index={0}
                        size={32}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {downItem?.downAlignTitle}
                      </div>
                      <Tooltip title="删除关联">
                        <div
                          className="kr-item-button"
                          onClick={() => {
                            cancelUpAlign(downItem.downAlignKey, "down");
                          }}
                        >
                          <img
                            src={cancelUpAlignSvg}
                            alt=""
                            style={{ cursor: "pointer", marginTop: "5px" }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              : null}
          </div>
          <Divider />
          <div
            className="krItem-title"
            style={{ justifyContent: "space-between" }}
          >
            关联项目
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Dropdown
                overlay={linkGroup}
                trigger={["click"]}
                visible={groupVisible}
              >
                <img
                  src={okrlinkGroupSvg}
                  alt=""
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                  onClick={() => {
                    setGroupVisible(true);
                  }}
                />
              </Dropdown>
              <GroupCreate addPng={addKrSvg} />
            </div>
          </div>
          <div className="oItem-downAlign">
            {item?.bindGroupKeyArray
              ? item.bindGroupInfoArray.map((groupItem, groupIndex) => {
                  return (
                    <div
                      className="oItem-downAlign-item"
                      key={"group" + groupIndex}
                      onClick={() => {
                        toTargetGroup(groupItem._key);
                      }}
                    >
                      <Avatar
                        avatar={groupItem?.groupLogo}
                        name={groupItem?.groupName}
                        type={"person"}
                        index={0}
                        size={32}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {groupItem?.groupName}
                      </div>
                      <Tooltip title="删除关联">
                        <div
                          className="kr-item-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            bindGroup(groupItem, "o", "del");
                          }}
                        >
                          <img
                            src={cancelUpAlignSvg}
                            alt=""
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onChange={(activeKey) => {
            setActiveKey(activeKey);
          }}
        >
          <TabPane tab={"评论(" + taskCommentArray.length + ")"} key="1">
            <div className="okr-comment-tabs">
              <div
                className="comment-input"
                style={{
                  position: "fixed",
                  bottom: "15px",
                  right: "30px",
                  width: "384px",
                }}
              >
                <Input
                  value={commentInput}
                  onChange={(e) => {
                    setCommentInput(e.target.value);
                  }}
                  placeholder="添加评论"
                  style={{ width: "calc(100% - 80px)" }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    saveCommentMsg(item._key);
                  }}
                  disabled={commentInput ? false : true}
                >
                  提交
                </Button>
              </div>
              <div
                style={{
                  margin: "15px 0px",
                  width: "100%",
                  padding: "0px 10px",
                  boxSizing: "border-box",
                }}
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
            </div>
          </TabPane>
          <TabPane tab={"历史(" + taskHistoryArray.length + ")"} key="2">
            <div className="okr-comment-history">
              {taskHistoryArray.map(
                (historyItem: any, historyIndex: number) => {
                  return (
                    <Timeline key={"timeline" + historyIndex}>
                      <Timeline.Item>
                        <div className="okr-comment-historyLog">
                          <div className="okr-comment-title">
                            <Avatar
                              avatar={historyItem?.etc?.avatar}
                              name={historyItem?.etc?.nickName}
                              type={"person"}
                              index={historyIndex}
                              size={18}
                            />
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#333",
                                marginLeft: "5px",
                                width: "calc(100% - 20px)",
                              }}
                            >
                              {historyItem.log}
                            </div>
                          </div>
                          {moment(
                            moment().valueOf() -
                              parseInt(historyItem.createTime) >
                              0
                              ? parseInt(historyItem.createTime)
                              : moment().valueOf() - 3000
                          ).fromNow()}
                        </div>
                      </Timeline.Item>
                    </Timeline>
                  );
                }
              )}
            </div>
          </TabPane>
          <TabPane tab="备注" key="3">
            {content !== null ? (
              <Editor
                data={content}
                height={document.body.offsetHeight - 390}
                onChange={changeOContent}
                editorKey={item?._key}
                // setImgFileList={setImgFileList}
                cardKey={item?._key}
              />
            ) : null}
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};
OkrItem.defaultProps = {};
export default OkrItem;
