import React, { useState, useEffect, useRef, useCallback } from "react";
import "./groupTableTree.css";
import { MiniMenu, Tree } from "tree-graph-react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Tooltip, Button, Drawer, Modal, Dropdown, Menu } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import {
  setChooseKey,
  editTask,
  changeTaskInfoVisible,
  setTaskInfo,
  getGroupTask,
} from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";
import { changeStartId, getGroupInfo } from "../../redux/actions/groupActions";
import moment from "moment";
import _, { divide } from "lodash";
import api from "../../services/api";
import { useMount } from "../../hook/common";

import IconFont from "../../components/common/iconFont";
import TimeSet from "../../components/common/timeSet";
import TaskMember from "../../components/task/taskMember";
import GroupTableTreeType from "./groupTableTreeType";
import GroupTableTreeItem from "./groupTableTreeItem";
import Dialog from "../../components/common/dialog";
import FileList from "../../components/fileList/fileList";
import GroupTableInfo from "./groupTableInfo";

import defaultPersonPng from "../../assets/img/defaultPerson.png";
import memberSvg from "../../assets/svg/member.svg";
import taskType0Svg from "../../assets/svg/taskType0.svg";
import taskType1Svg from "../../assets/svg/taskType1.svg";
import taskType2Svg from "../../assets/svg/taskType2.svg";
import taskType3Svg from "../../assets/svg/taskType3.svg";
import taskType4Svg from "../../assets/svg/taskType4.svg";
import taskType5Svg from "../../assets/svg/taskType5.svg";
import taskType6Svg from "../../assets/svg/taskType6.svg";
import taskType7Svg from "../../assets/svg/taskType7.svg";
import taskType8Svg from "../../assets/svg/taskType8.svg";
import taskType9Svg from "../../assets/svg/taskType9.svg";
// import bigCloseSvg from "../../assets/svg/bigClose.svg";
import Loading from "../../components/common/loading";
import { Moveable } from "../../components/common/moveable";
import DropMenu from "../../components/common/dropMenu";

import packSvg from "../../assets/svg/pack.svg";
import unpackSvg from "../../assets/svg/unpack.svg";
import workIconSvg from "../../assets/svg/文档2@1.svg";
import drawIconSvg from "../../assets/svg/绘图2@1.svg";
import excelIconSvg from "../../assets/svg/表格2@1.svg";
import markdownIconSvg from "../../assets/svg/文本2@1.svg";
import pptIconSvg from "../../assets/svg/演示2@1.svg";

import linkBigIconSvg from "../../assets/svg/linkBigIcon.svg";
import pptBigIconSvg from "../../assets/img/ppt@1x.png";
import Avatar from "../../components/common/avatar";
import { NONAME } from "dns";
// import { useAuth } from "../../context/auth";
declare var window: Window;
const { SubMenu } = Menu;

interface GroupTableTreeProps {
  groupKey: string;
}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const { groupKey } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const startId = useTypedSelector((state) => state.group.startId);
  const token = useTypedSelector((state) => state.auth.token);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>({});
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetNodeArray, setTargetNodeArray] = useState<any>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [avatarDialogShow, setAvatarDialogShow] = useState(false);
  const [statusDialogShow, setStatusDialogShow] = useState(false);
  const [treeMenuLeft, setTreeMenuLeft] = useState(0);
  const [treeMenuTop, setTreeMenuTop] = useState(0);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [itemDialogShow, setItemDialogShow] = useState(false);
  const [typeDialogShow, setTypeDialogShow] = useState(0);
  const [treeTypeVisible, setTreeTypeVisible] = useState(0);

  const [batchLoading, setBatchLoading] = useState(false);
  const [infoBigVisible, setInfoBigVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [fileVisible, setFileVisible] = useState<any>(false);
  const [batchAddText, setBatchAddText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  // const [memberCheckIndex, setMemberCheckIndex] = useState<any>(null);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  const [moveState, setMoveState] = useState<any>("top");
  const [drawData, setDrawData] = useState<any>(null);
  const [closeSaveVisible, setCloseSaveVisible] = useState(false);
  // const [closeSaveVisible, setCloseSaveVisible] = useState(false);
  const [treeMemberArray, setTreeMemberArray] = useState<any>([]);
  const [newContent, setNewContent] = useState("");
  const [originContent, setOriginContent] = useState("");
  const [overTreeKey, setOverTreeKey] = useState("");

  const containerRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  const childRef = useRef<any>();
  let moveRef: any = useRef();
  const iconBigArray = [
    "https://cdn-icare.qingtime.cn/FtkXwZ6IehLY3esnusB7zXbATj0N",
    "https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo",
    "https://cdn-icare.qingtime.cn/FgcSN1LlGW1F0L5njTuMCEVtorPw",
    "https://cdn-icare.qingtime.cn/Fnwl_g4Re1NHyeNYBzGAq0goIWso",
    linkBigIconSvg,
    "https://cdn-icare.qingtime.cn/FhTo1tbXwsX2toqGmd2NXy4XGA-g",
    pptBigIconSvg,
    "https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo",
  ];
  const iconBigText = [
    "时光文档",
    "时光绘图",
    "时光表格",
    "时光文本",
    "链接",
    "电子书",
    "ppt",
    "绘图新版本",
  ];
  let unDistory = useRef<any>(true);
  // const iconArray = useRef<any>([
  //   "https://cdn-icare.qingtime.cn/FpCB_dxjQGMt0lBUP-PwBXAVkNHN",
  //   "https://cdn-icare.qingtime.cn/FgKrqQB-8wqIouNRWzTzCe2A12FK",
  //   "https://cdn-icare.qingtime.cn/FjFqTs8ZmMtsL1X8LGZEVSV9WSRW",
  //   "https://cdn-icare.qingtime.cn/FjO6YNYHntTHrgS_3hR2kZiID8rd",
  //   "https://cdn-icare.qingtime.cn/链接备份.png0.10111010111110010011100111101110010000101001111100011607666734264",
  //   "https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y",
  // ]);
  const iconArray = useRef<any>([
    workIconSvg,
    drawIconSvg,
    excelIconSvg,
    markdownIconSvg,
    "https://cdn-icare.qingtime.cn/链接备份.png0.10111010111110010011100111101110010000101001111100011607666734264",
    "https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y",
    pptIconSvg,
    drawIconSvg,
  ]);

  const taskTypeArray = useRef<any>([
    taskType0Svg,
    taskType1Svg,
    taskType2Svg,
    taskType3Svg,
    taskType4Svg,
    taskType5Svg,
    taskType6Svg,
    taskType7Svg,
    taskType8Svg,
    taskType9Svg,
  ]);
  // const { paramsToken } = useAuth()
  useMount(() => {
    // setHelpVisible(true);
    setTargetNode(null);
    setTargetNodeArray([]);
    window.addEventListener("message", handlerIframeEvent);
    return () => {
      window.removeEventListener("message", handlerIframeEvent);
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (!groupInfo) {
      dispatch(getGroupInfo(groupKey));
    }
    //eslint-disable-next-line
  }, [groupKey]);
  const handlerIframeEvent = (e: any) => {
    switch (e.data.eventName) {
      case "children-title-change":
        setDrawData(e.data.data);
        break;
    }
  };
  useEffect(() => {
    if (drawData) {
      let obj = { ...drawData };
      if (obj.title.trim() === "") {
        obj.title = "新主题";
      }

      dispatch(editTask({ key: obj.key, title: obj.title }, 3));
      setNodeObj((prevNodeObj) => {
        prevNodeObj[obj.key].name = obj.title;
        return prevNodeObj;
      });
      setGridList((prevGridList) => {
        let nodeIndex = _.findIndex(prevGridList, { _key: obj.key });
        prevGridList[nodeIndex].title = obj.title;
        return prevGridList;
      });
      setDrawData(null);
    }
  }, [drawData, dispatch]);
  //eslint-disable-next-line
  const getData = async (key: string, targetObj?: any, step?: string) => {
    if (groupInfo?.taskTreeRootCardKey && user) {
      setLoading(true);
      let gridRes: any = await api.task.getTaskTreeList(
        groupInfo.taskTreeRootCardKey,
        key
      );
      if (gridRes.msg === "OK") {
        setGridList((prevGridList) => {
          let newGridList: any = [];
          gridRes.result.forEach((taskItem: any) => {
            let nodeIndex = _.findIndex(prevGridList, {
              _key: taskItem._key,
            });
            if (nodeIndex === -1) {
              if (taskItem._key === groupInfo.taskTreeRootCardKey) {
                taskItem.executorKey = "";
                taskItem.executorName = "";
                taskItem.executorAvatar = "";
                taskItem.parentCardKey = "";
                if (groupKey === mainGroupKey) {
                  taskItem.name = user.profile.nickName;
                }
              }
              taskItem.children = taskItem.children.filter((item: any) => {
                return (
                  (_.findIndex(gridRes.result, { _key: item }) !== -1 &&
                    !taskItem.contract) ||
                  taskItem.contract
                );
              });
              newGridList.push(taskItem);
            } else {
              newGridList[nodeIndex] = _.cloneDeep(taskItem);
            }
          });
          if (targetObj) {
            prevGridList[targetObj.fatherIndex].children.splice(
              targetObj.targetIndex,
              1
            );
          }
          return [...prevGridList, ...newGridList];
        });

        setNodeObj((prevNodeObj) => {
          let frontPath = gridRes.frontPath;
          let newNodeObj: any = {};
          gridRes.result.forEach((taskItem: any) => {
            let gridTime = moment(taskItem.taskEndDate)
              .endOf("day")
              .diff(moment().endOf("day"), "days");
            taskItem.children = taskItem.children.filter((item: any) => {
              return (
                (_.findIndex(gridRes.result, { _key: item }) !== -1 &&
                  !taskItem.contract) ||
                taskItem.contract
              );
            });
            let editRole =
              (taskItem.groupRole &&
                taskItem.groupRole > 0 &&
                taskItem.groupRole < 4) ||
              taskItem.creatorKey === user._key ||
              taskItem.executorKey === user._key;
            if (
              key !== groupInfo.taskTreeRootCardKey &&
              taskItem._key !== key
            ) {
              taskItem.path1.splice(0, 1);
            }
            newNodeObj[taskItem._key] = {
              _key: taskItem._key,
              name:
                taskItem.rootType === 10
                  ? groupInfo.groupName
                  : taskItem.name
                  ? taskItem.name
                  : taskItem.title,
              // father	父節點 id	String
              type: taskItem.type ? taskItem.type : 1,
              disabled:
                taskItem._key === groupInfo.taskTreeRootCardKey ||
                !editRole ||
                taskItem._key === groupInfo.labelRootCard,
              strikethrough:
                taskItem.type === 6 && taskItem.finishPercent === 2,
              checked: taskItem.finishPercent > 0,
              showCheckbox: taskItem.type === 6,
              showStatus:
                taskItem._key !== groupInfo.taskTreeRootCardKey &&
                taskItem.type === 6
                  ? true
                  : false,
              hour: taskItem.hour,
              limitDay: moment(taskItem.taskEndDate).endOf("day").valueOf() + 1,
              avatarUri:
                taskItem.type === 6 && taskItem.executorKey
                  ? taskItem.executorAvatar
                    ? taskItem.executorAvatar
                    : defaultPersonPng
                  : null,
              // backgroundColor:
              //   taskItem.finishPercent === 2
              //     ? 'rgba(229, 231, 234, 0.9)'
              //     : 'rgb(255,255,255)',
              path1: [...frontPath, ...taskItem.path1],
              father:
                taskItem.parentCardKey || key !== groupInfo.taskTreeRootCardKey
                  ? taskItem.parentCardKey
                  : "",
              color:
                gridTime < 0
                  ? gridTime < 5
                    ? "999999"
                    : gridTime < 10
                    ? "CACACA"
                    : gridTime < 15
                    ? "D8D8D8"
                    : gridTime < 20
                    ? "EAEAEA"
                    : "F9F9F9"
                  : "#333",
            };
            if (
              taskItem._key === groupInfo.taskTreeRootCardKey &&
              groupKey === mainGroupKey
            ) {
              newNodeObj[taskItem._key].name =
                user.profile.nickName + "的超级树";
            }
            if (taskItem.type === 1 || taskItem.type === 6) {
              newNodeObj[taskItem._key].icon =
                taskItem.taskType !== 0
                  ? taskTypeArray.current[taskItem.taskType]
                  : null;
            } else {
              newNodeObj[taskItem._key].icon = taskItem?.extraData?.icon
                ? taskItem.extraData.icon
                : iconArray.current[taskItem.type - 10];
            }
            if (taskItem?.extraData?.pack) {
              newNodeObj[taskItem._key].icon = packSvg;
              newNodeObj[taskItem._key].childNum = taskItem.childNodeNumber;
            }
            if (taskItem.children) {
              newNodeObj[taskItem._key].sortList =
                taskItem.finishPercent !== 2 ? taskItem.children : [];
              newNodeObj[taskItem._key].contract =
                (taskItem.contract &&
                  newNodeObj[taskItem._key].sortList.length > 0) ||
                (taskItem.type === 15 && key === groupInfo.taskTreeRootCardKey)
                  ? true
                  : false;
            } else {
              newNodeObj[taskItem._key].sortList = [];
              newNodeObj[taskItem._key].contract = false;
            }
          });
          if (targetObj) {
            prevNodeObj[targetObj.fatherKey].sortList.splice(
              targetObj.targetIndex,
              1
            );
          }
          if (step === "start") {
            // if (groupMemberItem?.config?.treeStartId && newNodeObj[groupMemberItem?.config?.treeStartId]) {
            //   dispatch(changeStartId(groupMemberItem.config.treeStartId));
            // } else
            if (groupInfo.taskTreeRootCardKey) {
              dispatch(changeStartId(groupInfo.taskTreeRootCardKey));
            }
          }
          let obj = { ...prevNodeObj, ...newNodeObj };
          console.log(startId);
          console.log(obj);
          if (!obj[startId]) {
            dispatch(changeStartId(groupInfo.taskTreeRootCardKey));
          }
          return obj;
        });
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(setMessage(true, gridRes.msg, "error"));
      }
    }
  };

  useEffect(() => {
    if (taskInfo) {
      getData(taskInfo._key);
    }
    //eslint-disable-next-line
  }, [taskInfo]);

  useEffect(() => {
    if (groupInfo && groupInfo._key === groupKey) {
      if (startId) {
        console.log(startId);
        getData(groupInfo?.taskTreeRootCardKey);
      } else {
        getData(groupInfo.taskTreeRootCardKey, null, "start");
      }
      moveRef.current.reset();
      if (headerIndex === 3 && groupMemberArray) {
        let newLabelInfo: any = [];
        let newExecutorInfo: any = [];
        if (groupInfo.labelInfo) {
          groupInfo.labelInfo.forEach((item) => {
            // if (item && item.labelKey && item.executorKey) {
            if (
              item &&
              ((item.labelKey && item.executorKey) || !item.labelKey)
            ) {
              newExecutorInfo.push({ executorKey: item.executorKey });
              newLabelInfo.push({
                executorAvatar: item.executorAvatar,
                executorKey: item.executorKey,
                executorName: item.executorName,
                labelKey: item.labelKey,
                labelName: item.labelKey ? item.labelName : "ToDo",
                groupkey: groupKey,
              });
            }
          });

          let newExecutorItem = _.cloneDeep(newExecutorInfo[0]);
          newExecutorInfo.splice(0, 1);
          newExecutorInfo.push(newExecutorItem);
          let newLabelItem = _.cloneDeep(newLabelInfo[0]);
          newLabelInfo.splice(0, 1);
          newLabelInfo.push(newLabelItem);
          // let newLabelInfoLength: number = newLabelInfo.length;
          groupMemberArray.forEach((item) => {
            let groupMemberIndex: number = _.findIndex(newExecutorInfo, {
              executorKey: item.userId,
            });
            if (groupMemberIndex === -1) {
              newLabelInfo.push({
                executorAvatar: item.avatar,
                executorKey: item.userId,
                executorName: item.nickName,
                labelKey: null,
                labelName: "",
              });
            }
          });
          // if (newLabelInfo[newLabelInfoLength]) {
          //   newLabelInfo[newLabelInfoLength].labelName = 'ToDo'
          // }
          setTreeMemberArray(newLabelInfo);
        }
      }
    }
    //eslint-disable-next-line
  }, [groupInfo, groupKey, groupMemberItem, headerIndex, startId]);

  useEffect(() => {
    if (startId && nodeObj && nodeObj[startId]) {
      setSelectedPath(nodeObj[startId].path1);
    }
  }, [startId, nodeObj]);

  useEffect(() => {
    if (headerIndex === 1 && user) {
      setTreeMemberArray([
        {
          executorAvatar: user.profile.avatar,
          executorKey: user._key,
          executorName: user.profile.nickName,
          labelKey: null,
          labelName: "ToDo",
          groupkey: mainGroupKey,
        },
      ]);
    }
  }, [headerIndex, user, mainGroupKey]);
  const editTargetTask = useCallback(
    (taskItem: any) => {
      setGridList((prevGridList) => {
        let nodeIndex = _.findIndex(prevGridList, { _key: taskItem._key });
        if (nodeIndex !== -1) {
          prevGridList[nodeIndex] = taskItem;
        }
        return [...prevGridList];
      });
      setNodeObj((prevNodeObj) => {
        if (taskItem._key) {
          prevNodeObj[taskItem._key].name = taskItem.title;
          prevNodeObj[taskItem._key].type = taskItem.type;
          prevNodeObj[taskItem._key].contract = prevNodeObj[taskItem._key]
            .contract
            ? true
            : false;
          prevNodeObj[taskItem._key].checked = taskItem.finishPercent > 0;
          prevNodeObj[taskItem._key].showCheckbox = taskItem.type === 6;
          prevNodeObj[taskItem._key].showStatus = taskItem.type === 6;
          prevNodeObj[taskItem._key].hour = taskItem.hour;
          prevNodeObj[taskItem._key].limitDay = taskItem.taskEndDate
            ? moment(taskItem.taskEndDate).endOf("day").valueOf() + 1
            : 0;
          prevNodeObj[taskItem._key].showStatus =
            taskItem._key !== groupInfo.taskTreeRootCardKey &&
            taskItem.type === 6
              ? true
              : false;
          prevNodeObj[taskItem._key].avatarUri =
            taskItem.type === 6 && taskItem.executorKey
              ? taskItem.executorAvatar
                ? taskItem.executorAvatar
                : defaultPersonPng
              : null;
          // newNodeObj[taskItem._key].backgroundColor =
          //   taskItem.finishPercent === 2
          //     ? 'rgba(229, 231, 234, 0.9)'
          //     : 'rgb(255,255,255)';
          prevNodeObj[taskItem._key].strikethrough =
            taskItem.type === 6 && taskItem.finishPercent === 2;
        }
        if (taskItem.type === 1 || taskItem.type === 6) {
          prevNodeObj[taskItem._key].icon =
            taskItem.taskType !== 0
              ? taskTypeArray.current[taskItem.taskType]
              : null;
        } else {
          prevNodeObj[taskItem._key].icon = taskItem.extraData?.icon
            ? taskItem.extraData.icon
            : iconArray.current[taskItem.type - 10];
        }
        return { ...prevNodeObj };
      });
      // }
    },
    [groupInfo]
  );
  // const prevTaskInfo: any = usePrevious(_.cloneDeep(taskInfo));
  // useEffect(() => {
  //   // 用户已登录
  //   if (
  //     prevTaskInfo &&
  //     !_.isEqual(prevTaskInfo, taskInfo) &&
  //     (taskInfo.type === 1 || taskInfo.type === 6) &&
  //     nodeObj &&
  //     gridList
  //   ) {
  //     editTargetTask(taskInfo, nodeObj, gridList);
  //   }
  // }, [taskInfo, prevTaskInfo, editTargetTask, nodeObj, gridList]);

  const addChildrenTask = async (
    selectedNode: any,
    type: string,
    taskType: number
  ) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    if (type === "next" && groupInfo.taskTreeRootCardKey === selectedNode) {
      dispatch(setMessage(true, "根结点不能新建同级节点", "error"));
      return;
    }
    let fatherKey = "";
    if (type === "child") {
      fatherKey = selectedNode;
    } else {
      if (nodeObj[selectedNode] && nodeObj[selectedNode].father) {
        fatherKey = nodeObj[selectedNode].father;
      } else {
        return;
      }
    }
    setLoading(true);
    let addTaskRes: any = await api.task.addTask({
      title: "",
      groupKey: groupInfo._key,
      groupRole: groupInfo.role,
      labelKey:
        newGridList[targetIndex].type === 30
          ? newGridList[targetIndex].correspondLabelKey
          : newGridList[targetIndex].labelKey,
      parentCardKey: fatherKey,
      indexTree:
        type === "child"
          ? newNodeObj[selectedNode].sortList.length
          : type === "next"
          ? targetIndex + 1
          : 0,
      type: taskType ? taskType : 1,
      // type === 'child'
      //   ? newGridList[targetIndex].type === 6
      //     ? 6
      //     : 1
      //   : type === 'next'
      //   ? newGridList[fatherIndex].type === 6
      //     ? 6
      //     : 1
      //   : 1,
      taskType: 0,
    });
    if (addTaskRes.msg === "OK") {
      setLoading(false);
      let result = addTaskRes.result;
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      setTargetIndex(newGridList.length - 1);
      let newNode: any = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        type: taskType,
        contract: false,
        labelKey: result.labelKey,
        path1: result.path1,
        checked: result.finishPercent > 0,
        showCheckbox: result.type === 6,
        showStatus: result.type === 6 ? true : false,
        hour: result.hour,
        limitDay: result.taskEndDate + 1 ? result.taskEndDate + 1 : 0,
        father: result.parentCardKey,
        sortList: result.children,
        avatarUri:
          result.executorKey && result.type === 6
            ? result.executorAvatar
              ? result.executorAvatar + "?imageMogr2/auto-orient/thumbnail/80x"
              : defaultPersonPng
            : null,
        // backgroundColor:
        //   result.finishPercent == 2
        //     ? 'rgba(229, 231, 234, 0.9)'
        //     : 'rgb(255,255,255)',
        color: "#333",
      };
      if (taskType === 1 || taskType === 6) {
        newNode.icon =
          result.taskType !== 0 ? taskTypeArray.current[result.taskType] : null;
      } else {
        newNode.icon = iconArray.current[taskType - 10];
      }
      // setSelectedId(newNode._key);
      // setDefaultSelectedId(newNode._key);
      // chooseNode(newNode, 1);
      // targetTreeRef.current.closeOptions();
      newNodeObj[newNode._key] = newNode;
      if (type === "child") {
        newNodeObj[selectedNode].sortList.push(newNode._key);
      } else if (type === "next" && fatherKey) {
        let targetIndex = newNodeObj[fatherKey].sortList.indexOf(selectedNode);
        newNodeObj[fatherKey].sortList.splice(targetIndex + 1, 0, newNode._key);
      }
      setNodeObj(newNodeObj);
      setTargetNode(newNodeObj[newNode._key]);
      chooseNode(newNodeObj[newNode._key], 1);
      // setSelectedId(newNode._key);
      // targetTreeRef.current.rename();
      setAvatarDialogShow(false);
      setStatusDialogShow(false);
      setTreeTypeVisible(0);
      setItemDialogShow(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const chooseNode = (node: any, type?: number) => {
    if (node) {
      let newGridList = [...gridList];
      setTargetNode(node);
      let nodeIndex = _.findIndex(newGridList, { _key: node._key });
      if (nodeIndex !== -1) {
        setTargetIndex(nodeIndex);
        let [time, newTaskItem]: any = [0, _.cloneDeep(newGridList[nodeIndex])];
        if (newTaskItem.taskEndDate) {
          time = moment(newTaskItem.taskEndDate + 1)
            .endOf("day")
            .diff(moment().endOf("day"), "days");
          // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
        }
        // getTaskMemberArray(taskItem.grougKey)
        setDayNumber(time);
        setTimeNumber(node.hour);
      }
      setSelectedId(node._key);
      if (
        nodeIndex !== -1 &&
        (newGridList[nodeIndex]?.finishPercent === 2 ||
          newGridList[nodeIndex]?.extraData?.pack)
      ) {
        getData(node._key);
      }
      if (type === 1) {
        targetTreeRef.current.rename();
      }
    } else {
      setTargetNode(null);
      setTargetNodeArray([]);
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    if (newNodeObj[nodeId].type !== 30) {
      if (text.trim() === "") {
        text = "新主题";
      }
      newNodeObj[nodeId].name = text;
      let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
      newGridList[nodeIndex].title = text;
      dispatch(editTask({ key: nodeId, title: text.split("<")[0] }, 3));
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, "频道节点不允许修改频道名", "error"));
    }
  };
  const editType = async (type: number) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let newTargetNode = { ...targetNode };
    let nodeId = newTargetNode._key;
    let obj: any = {};

    obj = {
      key: nodeId,
      type: type,
      content: "",
    };
    if (type === 1) {
      if (newNodeObj[nodeId].type === 1) {
        dispatch(setMessage(true, "此节点为普通节点无需还原", "error"));
        return;
      }
      obj.finishPercent = 0;
    }
    let editTaskRes: any = await api.task.editTask(obj);
    if (editTaskRes.msg === "OK") {
      dispatch(setMessage(true, "修改节点成功", "success"));
      newTargetNode.type = type;
      newNodeObj[nodeId].type = type;
      if (type !== 1) {
        newNodeObj[nodeId].icon = editTaskRes.result?.extraData?.icon
          ? editTaskRes.result.extraData.icon
          : iconArray.current[editTaskRes.result.type - 10];
      } else {
        newNodeObj[nodeId].avatarUri = null;
        newNodeObj[nodeId].icon = null;
        newNodeObj[nodeId].showCheckbox = false;
        newNodeObj[nodeId].showStatus = false;
      }
      let nodeIndex = _.findIndex(newGridList, {
        _key: nodeId,
      });
      if (nodeIndex !== -1) {
        newGridList[nodeIndex].type = type;
      }
      setGridList(newGridList);
      setNodeObj(newNodeObj);
      setTargetNode(newTargetNode);
    } else {
      dispatch(setMessage(true, editTaskRes.msg, "error"));
    }
    setMenuVisible(false);
  };
  const editPack = async () => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let newTargetNode = { ...targetNode };
    let nodeId = newTargetNode._key;
    if (nodeId === groupInfo.taskTreeRootCardKey) {
      dispatch(setMessage(true, "根节点不允许打包", "error"));
      return;
    }
    if (newNodeObj[nodeId].type !== 30) {
      let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
      if (!newGridList[nodeIndex].extraData) {
        newGridList[nodeIndex].extraData = {};
        if (newGridList[nodeIndex].extraData.pack) {
          newGridList[nodeIndex].extraData.pack = false;
        }
      }
      newGridList[nodeIndex].extraData.pack =
        !newGridList[nodeIndex].extraData.pack;
      let editTaskRes: any = await api.task.editTask({
        key: nodeId,
        extraData: newGridList[nodeIndex].extraData,
        content: "",
      });
      if (editTaskRes.msg === "OK") {
        dispatch(
          setMessage(
            true,
            gridList[targetIndex]?.extraData?.pack ? "打包成功" : "解包成功",
            "success"
          )
        );
        newTargetNode.icon = gridList[targetIndex]?.extraData?.pack
          ? packSvg
          : "";
        setTargetNode(newTargetNode);
        getData(targetNode.father);
      } else {
        dispatch(setMessage(true, editTaskRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "频道节点不允许打包", "error"));
    }
  };
  const editFinishPercent = async (node: any) => {
    let newTargetNode = { ...targetNode };
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].finishPercent =
      newGridList[nodeIndex].finishPercent > 0 ? 0 : 1;
    newNodeObj[node._key].checked = !newNodeObj[node._key].checked;
    newNodeObj[node._key].strikethrough =
      newGridList[nodeIndex].type === 6 &&
      newGridList[nodeIndex].finishPercent === 2;

    dispatch(
      editTask(
        { key: node._key, finishPercent: newGridList[nodeIndex].finishPercent },
        3
      )
    );
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    if (targetNodeArray.length === 0) {
      let newNodeObj = { ...nodeObj };
      if (targetNode) {
        // if (taskItem.creatorGroupRole <= taskItem.groupRole) {
        if (targetNode._key === groupInfo.taskTreeRootCardKey) {
          dispatch(setMessage(true, "根节点不允许删除", "error"));
          return;
        }
        if (targetNode._key === groupInfo.thirdLevelRootKey) {
          dispatch(setMessage(true, "收藏节点不允许删除", "error"));
          return;
        }
        if (newNodeObj[targetNode._key].type !== 31) {
          if (groupInfo.role === 1) {
            let deleteRes: any = await api.task.seniorDeleteTreeCard(
              targetNode._key,
              groupInfo._key
            );
            if (deleteRes.msg === "OK") {
              dispatch(setMessage(true, "删除成功", "success"));
              getData(targetNode.father);
              // newNodeObj[targetNode._key]
            } else {
              dispatch(setMessage(true, deleteRes.msg, "error"));
            }
          } else {
            let deleteRes: any = await api.task.deleteTask(
              targetNode._key,
              groupInfo._key
            );
            if (deleteRes.msg === "OK") {
              dispatch(setMessage(true, "删除成功", "success"));
              setGridList((prevGridList) => {
                let fatherIndex = _.findIndex(prevGridList, {
                  _key: targetNode.father,
                });
                let targetIndex = _.findIndex(prevGridList, {
                  _key: targetNode._key,
                });
                if (fatherIndex !== -1) {
                  let nodeIndex = _.findIndex(
                    prevGridList[fatherIndex].children,
                    {
                      _key: targetNode._key,
                    }
                  );
                  if (nodeIndex !== -1) {
                    prevGridList[fatherIndex].children.splice(nodeIndex, 1);
                  }
                }
                if (targetIndex !== -1) {
                  prevGridList.splice(targetIndex, 1);
                }
                return [...prevGridList];
              });
              // getData(targetNode.father);
              setNodeObj((prevNodeObj) => {
                let deleteIndex = _.findIndex(
                  prevNodeObj[targetNode.father].sortList,
                  { _key: targetNode._key }
                );

                if (deleteIndex !== -1) {
                  prevNodeObj[targetNode.father].sortList.splice(
                    deleteIndex,
                    1
                  );
                }
                delete prevNodeObj[targetNode._key];
                return { ...prevNodeObj };
              });
              // newNodeObj[targetNode._key]
            } else {
              dispatch(setMessage(true, deleteRes.msg, "error"));
            }
          }
        } else {
          dispatch(setMessage(true, "基础节点不允许删除", "error"));
        }
      }
    } else {
      deleteTaskArray();
    }
    //}
  };
  const deleteTaskArray = async () => {
    let newTargetNodeArray = [...targetNodeArray];
    let newKeyArray: any = [];
    newKeyArray = newTargetNodeArray.map((item) => {
      return item._key;
    });
    let deleteRes: any = await api.task.deleteAllTask(newKeyArray, groupKey);
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除成功", "success"));
      getData(groupInfo.taskTreeRootCardKey, null);
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const dragNode = async (dragInfo: any, validSelectedNodes: any) => {
    let newNodeObj = { ...nodeObj };
    let fatherKey = newNodeObj[dragInfo.dropNodeId].father;
    let obj: any = {
      oldFatherTaskKeyArray: [],
      sonTaskKeyArray: [],
      newFatherTaskKey: null,
      childrenIndex: 0,
    };
    if (!validSelectedNodes || validSelectedNodes?.length === 0) {
      validSelectedNodes = [
        {
          nodeKey: dragInfo.dragNodeId,
          oldFather: newNodeObj[dragInfo.dragNodeId].father,
        },
      ];
    }
    validSelectedNodes.forEach((item: any) => {
      if (newNodeObj[item.nodeKey].type !== 30) {
        obj.oldFatherTaskKeyArray.push(item.oldFather);
        obj.sonTaskKeyArray.push(item.nodeKey);
        if (dragInfo.placement === "in") {
          obj.newFatherTaskKey = dragInfo.dropNodeId;
          obj.childrenIndex =
            newNodeObj[dragInfo.dropNodeId].sortList.length > 0
              ? newNodeObj[dragInfo.dropNodeId].sortList.length - 1
              : 0;
        } else if (fatherKey) {
          let nodeIndex = newNodeObj[fatherKey].sortList.indexOf(
            dragInfo.dropNodeId
          );
          obj.newFatherTaskKey = fatherKey;
          obj.childrenIndex =
            dragInfo.placement === "up" ? nodeIndex : nodeIndex + 1;
        }
      } else {
        dispatch(setMessage(true, "频道节点不允许拖拽", "error"));
      }
    });

    let treeRelationRes: any = await api.task.changeTreeTaskRelation(obj);
    if (treeRelationRes.msg === "OK") {
      // if (groupMemberItem?.config?.treeStartId) {
      //   getData(groupMemberItem.config.treeStartId);
      // } else if (groupInfo.taskTreeRootCardKey) {
      getData(groupInfo.taskTreeRootCardKey);
      // }
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, "error"));
    }
  };
  const editContract = async (node: any) => {
    let editTaskRes: any = await api.task.editTask({
      key: node._key,
      contract: node.contract ? false : true,
    });
    if (editTaskRes.msg === "OK") {
      getData(node._key);
    } else {
      dispatch(setMessage(true, editTaskRes.msg, "error"));
    }
    // setTargetNode(newTargetNode);
    // setNodeObj(newNodeObj);
    // setGridList(newGridList);
  };
  const editSortList = async (id: string, sortList: any, type: string) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    newNodeObj[newNodeObj[id].father].sortList = sortList;
    let nodeIndex = _.findIndex(newGridList, { _key: newNodeObj[id].father });
    newGridList[nodeIndex].children = sortList;
    let treeRelationRes: any = await api.task.editCardSimple(
      newNodeObj[id].father,
      { children: sortList }
    );
    if (treeRelationRes.msg === "OK") {
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, "error"));
    }
  };
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    let newGroupMemberItem = { ...groupMemberItem };
    dispatch(changeTaskInfoVisible(false));
    setStatusDialogShow(false);
    dispatch(changeStartId(node._key));
    setSelectedPath(nodeObj[node._key].path1);
    moveRef.current.reset();
    // const dotIndex = _.findIndex(newGridList, { _key: node._key });
    // if (
    //   dotIndex !== -1 &&
    //   (newGridList[dotIndex]?.finishPercent === 2 ||
    //     newGridList[dotIndex]?.extraData?.pack)
    // ) {
    //   getData(node._key);
    // }
    if (newGroupMemberItem?.config) {
      newGroupMemberItem.config.treeStartId = node._key;
      if (newGroupMemberItem.config.config) {
        delete newGroupMemberItem.config.config;
      }
      api.member.setConfig(newGroupMemberItem._key, newGroupMemberItem.config);
    }
    api.task.upsertGroupCardVisitTime(
      groupKey,
      node._key,
      { groupLogo: groupInfo.groupLogo, groupName: groupInfo.groupName },
      { icon: node.icon, name: node.name }
    );
  };

  const changeExecutor = async (executorItem: any) => {
    let newTaskItem = [...gridList][targetIndex];
    let obj: any = {};
    newTaskItem.executorKey = executorItem.executorKey;
    newTaskItem.executorName = executorItem.executorName;
    newTaskItem.executorAvatar = executorItem.executorAvatar;
    newTaskItem.labelKey = executorItem.labelKey;
    // newTaskMemberArray.splice(index, 1);
    // newTaskMemberArray.unshift(executorItem);
    obj = {
      executorKey: newTaskItem.executorKey,
      executorName: newTaskItem.executorName,
      executorAvatar: newTaskItem.executorAvatar,
      labelKey: newTaskItem.labelKey,
      type: 6,
      taskType: 0,
      groupKey: groupKey,
    };
    if (newTaskItem.type !== 6) {
      newTaskItem.taskEndDate = moment().endOf("day").valueOf();
      obj.taskEndDate = moment().endOf("day").valueOf();
    }
    newTaskItem.type = 6;
    newTaskItem.taskType = 0;
    let editTaskRes: any = await api.task.editTask({
      key: newTaskItem._key,
      ...obj,
    });
    if (editTaskRes.msg === "OK") {
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      editTargetTask(editTaskRes.result);
    } else {
      dispatch(setMessage(true, editTaskRes.msg, "error"));
    }
  };
  const changeExecutorArray = async (executorItem: any) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let newTargetNodeArray = [...targetNodeArray];
    let newKeyArray: any = [];
    newKeyArray = newTargetNodeArray.map((item) => {
      return item._key;
    });
    let obj: any = {};
    obj = {
      executorKey: executorItem.executorKey,
      executorName: executorItem.executorName,
      executorAvatar: executorItem.executorAvatar,
      labelKey: executorItem.labelKey,
      type: 6,
      groupkey: groupKey,
    };
    let changeRes: any = await api.task.editAllTask(newKeyArray, obj);
    if (changeRes.msg === "OK") {
      //   newKeyArray
      dispatch(setMessage(true, "批量设置执行人成功", "success"));
      newTargetNodeArray.forEach((item) => {
        let index = _.findIndex(newGridList, { _key: item._key });
        if (index !== -1) {
          newGridList[index].executorKey = executorItem.executorKey;
          newGridList[index].executorName = executorItem.executorName;
          newGridList[index].executorAvatar = executorItem.executorAvatar;
          newGridList[index].labelKey = executorItem.labelKey;
          newGridList[index].taskEndDate = moment().endOf("day").valueOf();
          newGridList[index].type = 6;
          newGridList[index].taskType = 0;
          newNodeObj[item._key].type = 6;
          newNodeObj[item._key].showStatus = true;
          newNodeObj[item._key].checked = false;
          newNodeObj[item._key].showCheckbox = true;
          newNodeObj[item._key].avatarUri = newGridList[index].executorKey
            ? newGridList[index].executorAvatar
              ? newGridList[index].executorAvatar
              : defaultPersonPng
            : null;
          newNodeObj[item._key].icon = null;
          newNodeObj[item._key].limitDay = moment().endOf("day").valueOf() + 1;
        }
      });
      setNodeObj(newNodeObj);
      setGridList(newGridList);
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      // setMemberCheckIndex(null)
    } else {
      dispatch(setMessage(true, changeRes.msg, "error"));
    }
    // editTargetTask(newTaskItem);
  };
  // const changeFollow = (followKey: number | string) => {
  //   let newTaskItem = [...gridList][targetIndex];
  //   if (!newTaskItem.followUKeyArray) {
  //     newTaskItem.followUKeyArray = [];
  //   }
  //   let followIndex = newTaskItem.followUKeyArray.indexOf(followKey);
  //   if (followIndex === -1) {
  //     newTaskItem.followUKeyArray.push(followKey);
  //   } else {
  //     newTaskItem.followUKeyArray.splice(followIndex, 1);
  //   }
  //   dispatch(
  //     editTask(
  //       {
  //         key: newTaskItem._key,
  //         followUKeyArray: newTaskItem.followUKeyArray,
  //       },
  //       3
  //     )
  //   );
  //   editTargetTask(newTaskItem);
  // };
  const changeTaskType = (taskType: number) => {
    let newTargetNode = { ...targetNode };
    if (newTargetNode.type === 6 || newTargetNode.type === 1) {
      let newNodeObj = { ...nodeObj };
      let newGridList = [...gridList];
      newTargetNode.icon = taskTypeArray.current[taskType];
      newNodeObj[newTargetNode._key].icon =
        taskType !== 0 ? taskTypeArray.current[taskType] : null;
      let nodeIndex = _.findIndex(newGridList, { _key: newTargetNode._key });
      newGridList[nodeIndex].taskType = taskType;
      dispatch(
        editTask(
          {
            key: newTargetNode._key,
            taskType: newGridList[nodeIndex].taskType,
          },
          3
        )
      );
      setTargetNode(newTargetNode);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    }
  };
  const changeTimeSet = async (type: string, value: number) => {
    if (targetNodeArray.length === 0) {
      let newTaskItem = [...gridList][targetIndex];
      let time = 0;
      if (type === "hour") {
        setTimeNumber(value);
        newTaskItem.hour = value;
      } else if (type === "day") {
        newTaskItem.day = value;
        newTaskItem.taskEndDate = moment()
          .add(value - 1, "day")
          .endOf("day")
          .valueOf();
        time = moment(newTaskItem.taskEndDate)
          .endOf("day")
          .diff(moment().endOf("day"), "days");
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
        setDayNumber(time);
      } else if (type === "infinite") {
        newTaskItem.taskEndDate = 99999999999999;
      }
      // if (newTaskItem.type === 1) {
      //   newTaskItem.taskEndDate = moment().endOf("day").valueOf();
      // }
      newTaskItem.type = 6;
      let editTaskRes: any = await api.task.editTask({
        key: newTaskItem._key,
        hour: newTaskItem.hour,
        day: newTaskItem.day,
        taskEndDate: newTaskItem.taskEndDate,
        type: 6,
        groupKey: groupKey,
      });
      if (editTaskRes.msg === "OK") {
        editTargetTask(editTaskRes.result);
      } else {
        dispatch(setMessage(true, editTaskRes.msg, "error"));
      }
    } else {
      changeTimeSetArray(type, value);
    }
  };
  const changeTimeSetArray = async (type: string, value: number) => {
    let newTargetNodeArray = [...targetNodeArray];
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let newKeyArray: any = [];
    newKeyArray = newTargetNodeArray.map((item) => {
      return item._key;
    });
    let obj: any = {};
    let time = 0;
    if (type === "hour") {
      setTimeNumber(value);
      obj.hour = value;
    } else if (type === "day") {
      obj.day = value;
      obj.taskEndDate = moment()
        .add(value - 1, "day")
        .endOf("day")
        .valueOf();
      time = moment(obj.taskEndDate)
        .endOf("day")
        .diff(moment().endOf("day"), "days");
      // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      setDayNumber(time);
    } else if (type === "infinite") {
      obj.taskEndDate = 99999999999999;
    }
    // if (obj.type === 1) {
    //   obj.taskEndDate = moment().endOf("day").valueOf();
    // }
    obj.groupKey = groupKey;
    obj.type = 6;
    let changeRes: any = await api.task.editAllTask(newKeyArray, obj);
    if (changeRes.msg === "OK") {
      dispatch(setMessage(true, "批量设置时间成功", "success"));
      newTargetNodeArray.forEach((item) => {
        let index = _.findIndex(newGridList, { _key: item._key });
        if (index !== -1) {
          newGridList[index].taskEndDate = obj.taskEndDate
            ? obj.taskEndDate
            : newGridList[index].taskEndDate;
          newGridList[index].hour = obj.hour
            ? obj.hour
            : newGridList[index].hour;
          newGridList[index].day = obj.day ? obj.day : newGridList[index].day;
          newGridList[index].type = 6;
          newNodeObj[item._key].type = 6;
          newNodeObj[item._key].hour = obj.hour
            ? obj.hour
            : newGridList[index].hour;
          newNodeObj[item._key].showStatus = true;
          newNodeObj[item._key].limitDay = obj.taskEndDate
            ? moment(obj.taskEndDate).endOf("day").valueOf() + 1
            : newGridList[index].taskEndDate
            ? moment(newGridList[index].taskEndDate).endOf("day").valueOf() + 1
            : moment().endOf("day").valueOf() + 1;
          newNodeObj[item._key].checked = false;
          newNodeObj[item._key].showCheckbox = true;
          newNodeObj[item._key].avatarUri = newGridList[index].executorKey
            ? newGridList[index].executorAvatar
              ? newGridList[index].executorAvatar
              : defaultPersonPng
            : null;
          newNodeObj[item._key].icon = null;
        }
      });
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, changeRes.msg, "error"));
    }
  };
  const changeFinishPercent = async (finishPercent: number, type?: string) => {
    if (targetNodeArray.length === 0) {
      let newTaskItem = [...gridList][targetIndex];
      let newTargetNode = { ...targetNode };
      if (
        newTargetNode.type !== 2 &&
        newTargetNode.type !== 6 &&
        finishPercent === 2
      ) {
        dispatch(setMessage(true, "非任务无法归档", "error"));
        return;
      }
      if (finishPercent === 10) {
        editType(1);
        return;
      } else {
        if (finishPercent === 2 && newTaskItem.finishPercent === 2) {
          newTaskItem.finishPercent = 1;
          // newTaskItem.contract = newTaskItem.hasChildren ? true : false;
        } else {
          if (finishPercent !== 2 && newTaskItem.finishPercent === 2) {
            // newTaskItem.contract = newTaskItem.hasChildren ? true : false;
          }
          newTaskItem.finishPercent = finishPercent;
        }
        newTaskItem.type = 6;
        if (newTaskItem.finishPercent === 1) {
          newTaskItem.taskEndDate = moment().endOf("day").valueOf();
        }
      }
      let editTaskRes: any = await api.task.editTask({
        key: newTaskItem._key,
        type: newTaskItem.type,
        groupKey: groupKey,
        finishPercent: newTaskItem.finishPercent,
      });
      if (editTaskRes.msg === "OK") {
        newTargetNode = {
          ...newTargetNode,
          type: newTaskItem.type,
          finishPercent: newTaskItem.finishPercent,
        };
        setTargetNode({ ...newTargetNode });
        getData(newTaskItem._key);
      } else {
        dispatch(setMessage(true, editTaskRes.msg, "error"));
      }
    } else {
      changeFinishPercentArray(finishPercent, type);
    }
  };
  const changeFinishPercentArray = async (
    finishPercent: number,
    type?: string
  ) => {
    if (finishPercent === 10) {
      dispatch(setMessage(true, "节点无法批量还原", "error"));
      return;
    }
    let newTargetNodeArray = [...targetNodeArray];
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let newKeyArray: any = [];
    newKeyArray = newTargetNodeArray.map((item) => {
      return item._key;
    });
    let changeRes: any = await api.task.editAllTask(newKeyArray, {
      finishPercent: finishPercent,
      type: 6,
    });
    if (changeRes.msg === "OK") {
      newTargetNodeArray.forEach((item) => {
        let index = _.findIndex(newGridList, { _key: item._key });
        if (index !== -1) {
          newGridList[index].finishPercent = finishPercent;
          newGridList[index].type = 6;
          newNodeObj[item._key].type = 6;
          newNodeObj[item._key].showStatus = true;
          newNodeObj[item._key].limitDay = moment().endOf("day").valueOf() + 1;
          newNodeObj[item._key].checked = finishPercent > 0;
          newNodeObj[item._key].strikethrough =
            newGridList[index].type === 6 && finishPercent === 2;
          newNodeObj[item._key].showCheckbox = true;
          newNodeObj[item._key].avatarUri = newGridList[index].executorKey
            ? newGridList[index].executorAvatar
              ? newGridList[index].executorAvatar
              : defaultPersonPng
            : null;
          newNodeObj[item._key].icon = null;
        }
      });
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, changeRes.msg, "error"));
    }
  };
  const checkNode = (node: any, targetGridList?: any) => {
    let newGridList = [...gridList];
    let newNodeObj = { ...nodeObj };
    // setEditInfoType('查看')
    if (targetGridList) {
      newGridList = _.cloneDeep(targetGridList);
    }
    let nodeIndex = _.findIndex(newGridList, {
      _key: node._key,
    });
    setTargetNode(node);
    if (nodeIndex !== -1) {
      setTargetIndex(nodeIndex);
    }

    switch (newNodeObj[node._key].type) {
      case 1:
        setMenuVisible(true);
        break;
      case 6:
        dispatch(changeTaskInfoVisible(true));
        dispatch(setChooseKey(node._key));
        dispatch(setTaskInfo(newGridList[nodeIndex]));
        break;
      case 11:
        // dispatch(changeTaskInfoVisible(true));
        dispatch(setChooseKey(node._key));
        dispatch(setTaskInfo(newGridList[nodeIndex]));
        let canEdit =
          (newGridList[nodeIndex].groupRole &&
            newGridList[nodeIndex].groupRole < 4) ||
          newGridList[nodeIndex].creatorKey === userKey ||
          newGridList[nodeIndex].executorKey === userKey;
        window.open(
          `https://draw.workfly.cn/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${
            node._key
          }"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${
            node._key
          }"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=${
            canEdit ? 2 : 0
          }`
        );

        break;
      default:
        setInfoBigVisible(true);
        break;
    }
  };
  const reflashNode = async (key: string, value: any) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(targetNode);
    let nodeIndex = _.findIndex(newGridList, {
      _key: newTargetNode._key,
    });
    if (nodeIndex !== -1) {
      switch (key) {
        case "title":
          newGridList[nodeIndex].title = value;
          newNodeObj[newGridList[nodeIndex]._key].name = value;
          newTargetNode.name = value;
          break;
        case "isOpenShare":
          newGridList[nodeIndex].isOpenShare = value;
          newTargetNode.isOpenShare = value;
          break;
        case "icon":
          newNodeObj[newTargetNode._key].icon = value;
          newTargetNode.icon = value;
          break;
      }
    }
    setGridList(newGridList);
    setNodeObj(newNodeObj);
    setTargetNode(newTargetNode);
    // let newGridList = [...gridList];
    // let newNodeObj = { ...nodeObj };
    // let nodeIndex = _.findIndex(newGridList, {
    //   _key: node._key,
    // });
    // newGridList[nodeIndex] = node;
    // newNodeObj[node._key].name = node.title;
    // newNodeObj[node._key].icon = node.extraData?.icon
    //   ? node.extraData.icon
    //   : iconArray.current[node.type - 10];
    // setGridList(newGridList);
    // setNodeObj(newNodeObj);
  };
  const pasteNode = async (
    pasteNodeKey: string,
    pasteType: any,
    targetNodeKey: string
  ) => {
    let newGridList = [...gridList];
    let newNodeObj = { ...nodeObj };
    if (pasteType === "copy") {
      let copyRes: any = await api.task.copyTreeTask(
        pasteNodeKey,
        targetNodeKey,
        groupInfo.taskTreeRootCardKey
      );
      if (copyRes.msg === "OK") {
        let targetIndex = _.findIndex(newGridList, {
          _key: targetNodeKey,
        });
        newNodeObj[targetNodeKey].sortList.push(copyRes.newRoot);
        newGridList[targetIndex].children.push(copyRes.newRoot);
        getData(copyRes.newRoot);
      } else {
        dispatch(setMessage(true, copyRes.msg, "error"));
      }
    } else if (pasteType === "cut") {
      dragNode(
        {
          dragNodeId: pasteNodeKey,
          dropNodeId: targetNodeKey,
          placement: "in",
        },
        []
      );
    }
  };

  const batchAddTask = async (text?: string) => {
    setBatchLoading(true);
    let nodeIndex = _.findIndex(gridList, { _key: targetNode._key });
    if (nodeIndex !== -1) {
      let batchTaskRes: any = await api.task.batchAddTreeCard(
        targetNode._key,
        text ? text : batchAddText
      );
      setBatchLoading(false);
      if (batchTaskRes.msg === "OK") {
        dispatch(setMessage(true, "新增成功", "success"));
        getData(targetNode._key);
        setTypeDialogShow(0);
        setItemDialogShow(false);
        setBatchAddText("");
      } else {
        dispatch(setMessage(true, batchTaskRes.msg, "error"));
      }
    }
  };
  const exportFile = async (type) => {
    let newNodeObj = { ...nodeObj };
    let exportFileRes: any = await api.task.exportTree(startId, type);
    if (exportFileRes.msg === "OK") {
      console.log(exportFileRes);
      // if (type === "txt") {
      //   fetch(exportFileRes.result.url).then((res) =>
      //     res.blob().then((blob) => {
      //       var a = document.createElement("a");
      //       var url = (window as any).URL.createObjectURL(blob);
      //       a.href = url;
      //       a.download = newNodeObj[startId].name;
      //       a.click();
      //       (window as any).URL.revokeObjectURL(url);
      //     })
      //   );
      // } else {
      let a = document.createElement("a");
      a.href = exportFileRes.result.url;
      a.download = newNodeObj[startId].name;
      a.click();
      // }
    } else {
      dispatch(setMessage(true, exportFileRes.msg, "error"));
    }
  };

  const dropMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          exportFile("excel");
        }}
      >
        导出excel
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          exportFile("txt");
        }}
      >
        导出txt
      </Menu.Item>
    </Menu>
  );

  const downMenu = (
    <>
      {nodeObj && overTreeKey ? (
        <MiniMenu
          nodes={nodeObj}
          startId={overTreeKey}
          columnSpacing={0.1}
          normalFirstLevel={true}
          backgroundColor="#e4e5e3"
          selectedBackgroundColor="#4b53bc"
          // dropdownNodeKeyList={nodeObj[overTreeKey].sortList}
          color="#131212"
          handleClickNode={(node) => {
            let newGroupMemberItem = { ...groupMemberItem };
            dispatch(changeStartId(node._key));
            setSelectedPath(nodeObj[node._key].path1);
            newGroupMemberItem.config.treeStartId = node._key;
            api.member.setConfig(
              newGroupMemberItem._key,
              newGroupMemberItem.config
            );
          }}
        />
      ) : null}
    </>
  );

  return (
    <div className="tree" ref={containerRef}>
      {loading ? <Loading /> : null}
      {groupInfo ? (
        <div className="tree-info">
          <div className="tree-path">
            {selectedPath
              ? selectedPath.map((pathItem: any, pathIndex: number) => {
                  return (
                    <React.Fragment key={"path" + pathIndex}>
                      <Dropdown
                        overlay={downMenu}
                        // visible={overTreeKey===pathItem._key}
                        placement="bottomRight"
                        overlayStyle={{ left: "300px" }}
                        onVisibleChange={(visible) => {
                          if (visible) {
                            setOverTreeKey(pathItem._key);
                          } else {
                            setOverTreeKey(null);
                          }
                        }}
                      >
                        <div
                          onClick={() => {
                            let newGroupMemberItem = { ...groupMemberItem };
                            dispatch(changeStartId(pathItem._key));
                            setSelectedPath(nodeObj[pathItem._key].path1);
                            newGroupMemberItem.config.treeStartId =
                              pathItem._key;
                            api.member.setConfig(
                              newGroupMemberItem._key,
                              newGroupMemberItem.config
                            );
                          }}
                          style={{
                            fontWeight:
                              startId === pathItem._key ? "bold" : "normal",
                          }}
                          className="tree-path-item"
                          // onMouseEnter={()=>{setOverTreeKey(pathItem._key)}}
                          // onMouseLeave={()=>{setOverTreeKey(null)}}
                        >
                          {pathItem.title === "项目任务树根节点" ||
                          (pathItem.title === "任务树" && pathIndex === 0)
                            ? groupKey === mainGroupKey
                              ? user.profile.nickName + "的超级树"
                              : groupInfo.groupName
                            : pathItem.title}
                          <div className="tree-path-icon">
                            <div className="tree-path-icon-top"></div>
                            <div className="tree-path-icon-bottom"></div>
                          </div>
                        </div>
                      </Dropdown>
                    </React.Fragment>
                  );
                })
              : null}
          </div>
          <div className="tree-time">
            <Dropdown overlay={dropMenu}>
              <CloudDownloadOutlined
                style={{ fontSize: "30px", marginRight: "10px" }}
              />
            </Dropdown>
            <Tooltip title="设置归档" placement="bottom">
              <img
                className="tree-time-pack"
                src={
                  targetNode && targetNode.icon === packSvg
                    ? packSvg
                    : unpackSvg
                }
                alt=""
                onClick={() => {
                  editPack();
                }}
              />
            </Tooltip>
            <div className="tree-time-taskType">
              <Tooltip title="重要性" placement="bottom">
                {taskTypeArray.current.map((item: any, index: number) => {
                  return (
                    <img
                      src={item}
                      key={"taskType" + index}
                      style={{ marginRight: "2px", cursor: "pointer" }}
                      onClick={() => {
                        changeTaskType(index);
                      }}
                      alt=""
                    />
                  );
                })}
              </Tooltip>
            </div>
            <div className="tree-time-line">|</div>
            <div className="tree-time-container" onClick={() => {}}>
              <TimeSet
                timeSetClick={changeTimeSet}
                percentClick={changeFinishPercent}
                dayNumber={dayNumber + 1}
                timeNumber={timeNumber}
                endDate={
                  gridList[targetIndex] && gridList[targetIndex].taskEndDate
                }
                viewStyle={"horizontal"}
                targetNode={targetNode}
              />
            </div>
          </div>
          <div
            className="tree-container"
            // onMouseDown={startMove}
            // onContextMenu={endMove}
            // ref={treeRef}
          >
            <Moveable
              scrollable={true}
              style={{ display: "flex" }}
              rightClickToStart={true}
              ref={moveRef}
            >
              <div className="tree-box" ref={boxRef}>
                {JSON.stringify(nodeObj) !== "{}" && startId ? (
                  <Tree
                    ref={targetTreeRef}
                    nodes={nodeObj}
                    startId={startId}
                    // renameSelectedNode={true}
                    showIcon={true}
                    showAvatar={true}
                    showMoreButton={true}
                    showAddButton={true}
                    showPreviewButton={true}
                    showChildNum={true}
                    // showStatus={true}
                    avatarRadius={13}
                    indent={22}
                    uncontrolled={false}
                    defaultSelectedId={selectedId}
                    handleAddChild={(selectedNode: any) => {
                      if (!loading) {
                        setSelectedId(selectedNode);
                        addChildrenTask(selectedNode, "child", 1);
                      }
                    }}
                    handleAddNext={(selectedNode: any) => {
                      if (!loading) {
                        setSelectedId(selectedNode);
                        addChildrenTask(selectedNode, "next", 1);
                      }
                    }}
                    handleClickNode={(node: any) => chooseNode(node)}
                    handleClickMoreButton={(node: any) => {
                      chooseNode(node);
                      setTreeMenuLeft(node.x);
                      setTreeMenuTop(node.y);
                      setItemDialogShow(true);
                    }}
                    handleDeleteNode={(node: any) => {
                      setDeleteDialogShow(true);
                      // if (targetNodeArray.length === 0) {
                      //   if (nodeObj[node]) {
                      //     if (nodeObj[node].  !== 30) {
                      //       setDeleteDialogShow(true);
                      //     } else {
                      //       dispatch(
                      //         setMessage(true, "频道节点不允许删除", "error")
                      //       );
                      //     }
                      //   }
                      // } else {
                      //   setDeleteDialogShow(true);
                      // }
                    }}
                    handleChangeNodeText={editTaskText}
                    handleCheck={editFinishPercent}
                    handleShiftUpDown={editSortList}
                    handleClickExpand={editContract}
                    handleClickPreviewButton={(node: any) => {
                      checkNode(node);
                      // if (node.type >= 10) {
                      //   api.task.setVisitCardTime(node._key);
                      // }
                    }}
                    handleClickAddButton={(node: any) => {
                      setSelectedId(node._key);
                      addChildrenTask(node._key, "child", 1);
                    }}
                    // showCheckbox={true}
                    handleDrag={dragNode}
                    handleClickDot={
                      clickDot
                      // setSelectedId(node._key);
                    }
                    handleClickAvatar={(node: any) => {
                      let newGridList = [...gridList];
                      let nodeIndex = _.findIndex(newGridList, {
                        _key: node._key,
                      });
                      chooseNode(node);
                      setTreeMenuLeft(node.x);
                      setTreeMenuTop(node.y);
                      dispatch(setChooseKey(node._key));
                      dispatch(setTaskInfo(newGridList[nodeIndex]));
                      setAvatarDialogShow(true);
                    }}
                    handleClickStatus={(node: any) => {
                      // set
                      chooseNode(node);
                      setTreeMenuLeft(node.x);
                      setTreeMenuTop(node.y);
                      setStatusDialogShow(true);
                    }}
                    hideHour={!theme.hourVisible}
                    handlePaste={pasteNode}
                    handleMutiSelect={(nodeArray) => {
                      setTargetNodeArray(nodeArray);
                    }}
                    handlePasteText={batchAddTask}
                    // nodeOptions={
                    //   <GroupTableTreeItem
                    //     taskDetail={gridList[targetIndex]}
                    //     editTargetTask={editTargetTask}
                    //   />
                    // }
                    // handleClickDot
                  />
                ) : null}
                <DropMenu
                  visible={statusDialogShow}
                  dropStyle={{
                    width: "275px",
                    height: "205px",
                    top: treeMenuTop + 35,
                    left: treeMenuLeft,
                    color: "#333",
                    overflow: "auto",
                  }}
                  onClose={() => {
                    setStatusDialogShow(false);
                  }}
                >
                  <TimeSet
                    timeSetClick={changeTimeSet}
                    percentClick={changeFinishPercent}
                    dayNumber={dayNumber + 1}
                    timeNumber={timeNumber}
                    endDate={
                      gridList[targetIndex] && gridList[targetIndex].taskEndDate
                    }
                    viewStyle={"tree"}
                  />
                </DropMenu>
                <DropMenu
                  visible={avatarDialogShow}
                  dropStyle={{
                    width: "260px",
                    height: "300px",
                    top: treeMenuTop + 35,
                    left: treeMenuLeft,
                    color: "#333",
                    overflow: "auto",
                  }}
                  onClose={() => {
                    setAvatarDialogShow(false);
                  }}
                >
                  <TaskMember
                    // targetGroupKey={groupKey}
                    // onClose={setAvatarDialogShow(false)}
                    // chooseFollow={changeFollow}
                    showMemberVisible={avatarDialogShow}
                  />
                </DropMenu>
                <DropMenu
                  visible={itemDialogShow}
                  dropStyle={{
                    width: "200px",
                    // height: '70px',
                    top: treeMenuTop + 35,
                    left: treeMenuLeft,
                    color: "#333",
                    overflow: "auto",
                  }}
                  onClose={() => {
                    setItemDialogShow(false);
                    // setTreeTypeVisible(false);
                    // setTypeDialogShow(0);
                  }}
                >
                  <GroupTableTreeItem
                    setTypeDialogShow={setTypeDialogShow}
                    setTreeTypeVisible={setTreeTypeVisible}
                    targetNode={gridList[targetIndex]}
                    reflashNode={reflashNode}
                  />
                </DropMenu>
                <DropMenu
                  visible={treeTypeVisible !== 0}
                  dropStyle={{
                    width: "200px",
                    // height: '70px',
                    top: treeMenuTop + 35,
                    left: treeMenuLeft + 205,
                    color: "#333",
                    overflow: "auto",
                  }}
                  onClose={() => {
                    // setItemDialogShow(false);
                    setTreeTypeVisible(0);
                  }}
                >
                  <GroupTableTreeType
                    targetNodeKey={targetNode && targetNode._key}
                    addChildrenTask={addChildrenTask}
                    typeshow={treeTypeVisible}
                    setTreeTypeVisible={setTreeTypeVisible}
                    // typeshow={1}
                  />
                </DropMenu>
              </div>
            </Moveable>
            <Modal
              visible={deleteDialogShow || typeDialogShow === 4}
              onCancel={() => {
                setDeleteDialogShow(false);
                if (typeDialogShow === 4) {
                  setItemDialogShow(false);
                  setTypeDialogShow(0);
                  setTreeTypeVisible(0);
                }
              }}
              onOk={() => {
                deleteTask();
                if (typeDialogShow === 4) {
                  setItemDialogShow(false);
                  setTypeDialogShow(0);
                  setTreeTypeVisible(0);
                }
              }}
              title={"删除节点"}
              width="400px"
              bodyStyle={{ height: "100px" }}
            >
              <div>
                是否{targetNodeArray && targetNodeArray.length ? `批量` : ""}
                删除节点{" "}
                {targetNodeArray && targetNodeArray.length
                  ? `( 有子节点将无法删除 )`
                  : ""}
                {targetNodeArray &&
                targetNodeArray.length === 0 &&
                groupInfo.role > 0 &&
                groupInfo.role < 3
                  ? `( 当前权限删除节点会将子节点一起删除 )`
                  : ""}
              </div>
            </Modal>
            <Dialog
              visible={typeDialogShow === 2}
              onClose={() => {
                setItemDialogShow(false);
                setTypeDialogShow(0);
                setTreeTypeVisible(0);
              }}
              onOK={() => {
                editType(1);
                setItemDialogShow(false);
                setTypeDialogShow(0);
                setTreeTypeVisible(0);
              }}
              title={"还原节点"}
              dialogStyle={{ width: "400px", height: "200px" }}
            >
              <div className="dialog-onlyTitle">是否还原成普通节点</div>
            </Dialog>
            <Dialog
              visible={typeDialogShow === 3}
              onClose={() => {
                setItemDialogShow(false);
                setTypeDialogShow(0);
                setTreeTypeVisible(0);
              }}
              onOK={() => {
                editPack();
                setItemDialogShow(false);
                setTypeDialogShow(0);
                setTreeTypeVisible(0);
              }}
              title={
                gridList[targetIndex]?.extraData?.pack ? "取消打包" : "打包节点"
              }
              dialogStyle={{ width: "400px", height: "200px" }}
            >
              <div className="dialog-onlyTitle">
                是否将节点
                {gridList[targetIndex]?.extraData?.pack ? "取消打包" : "打包"}
              </div>
            </Dialog>
            <Dialog
              visible={typeDialogShow === 1}
              onClose={() => {
                setItemDialogShow(false);
                setTypeDialogShow(0);
                setTreeTypeVisible(0);
                setBatchAddText("");
              }}
              onOK={() => {
                batchAddTask();
              }}
              title={"批量导入"}
              dialogStyle={{ width: "500px", height: "450px" }}
            >
              <div className="groupTableTree-textarea-container">
                {batchLoading ? <Loading /> : null}
                <textarea
                  value={batchAddText}
                  onChange={(e: any) => {
                    setBatchAddText(e.target.value);
                  }}
                  className="groupTableTree-textarea"
                  placeholder="空格区分父子节点"
                ></textarea>
              </div>
            </Dialog>
            {/* <Dialog
              visible={infoVisible}
              onClose={() => {
                setInfoVisible(false);
              }}
              title={'节点详情'}
              dialogStyle={{
                position: 'fixed',
                top: '68px',
                right: '0px',
                width: '600px',
                height: 'calc(100% - 70px)',
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <GroupTableInfo
                targetItem={gridList[targetIndex]}
                changeGridList={changeGridList}
                fullType={fullType}
                changeFullType={changeFullType}
                editInfoType={editInfoType}
              />
            </Dialog> */}
            <Dialog
              visible={fileVisible}
              onClose={() => {
                setFileVisible(false);
              }}
              title={"最近访问文件"}
              dialogStyle={{
                position: "fixed",
                top: "119px",
                right: moveState === "top" ? "10px" : "160px",
                // right: '110px',
                width: "350px",
                height: "calc(100% - 168px)",
                zIndex: 20,
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <FileList groupKey={groupKey} type="文档" />
            </Dialog>
            <Dialog
              visible={helpVisible}
              onClose={() => {
                setHelpVisible(false);
              }}
              title={"快捷键"}
              dialogStyle={{
                position: "fixed",
                top: "175px",
                right: moveState === "top" ? "10px" : "160px",
                // right: '60px',
                width: "300px",
                height: "calc(100% - 225px)",
                zIndex: 20,
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <div className="help-item">
                <span>创建同级节点</span> <span>Enter</span>
              </div>
              <div className="help-item">
                <span>创建下级节点</span> <span>Tab</span>
              </div>
              <div className="help-item">
                <span>拖动视图</span> <span>按住鼠标右键并拖动</span>
              </div>
              <div className="help-item">
                <span>选中节点</span> <span>鼠标单击</span>
              </div>
              <div className="help-item">
                <span>编辑节点名</span> <span>鼠标双击</span>
              </div>

              <div className="help-item">
                <span>复制节点</span> <span>Ctrl + C</span>
              </div>
              <div className="help-item">
                <span>剪切节点</span> <span>Ctrl + X</span>
              </div>
              <div className="help-item">
                <span>粘贴节点</span> <span>Ctrl + V</span>
              </div>
              <div className="help-item">
                <span>删除节点</span> <span>Delete</span>
              </div>
              <div className="help-item">
                <span>向上调整</span> <span>shift + ↑</span>
              </div>
              <div className="help-item">
                <span>向下调整</span> <span>shift + ↓</span>
              </div>
            </Dialog>
            {/* {gridList.length < 2 ? (
              <div className="tree-empty">
                <img src={emptySvg} alt="" />
              </div>
            ) : null} */}
          </div>
          <div
            className="help-container"
            style={{
              right: moveState === "bottom" ? "160px" : "10px",
              // right: '60px',
            }}
          >
            <Tooltip title="快捷键">
              <Button
                size="large"
                shape="circle"
                style={{ border: "0px" }}
                ghost
                icon={<IconFont type="icon-keyboard" />}
                onClick={() => {
                  setHelpVisible(true);
                  setFileVisible(false);
                }}
              />
            </Tooltip>
          </div>
          <div
            className="help-container"
            style={{
              right: moveState === "bottom" ? "210px" : "60px",
              // right: '110px',
            }}
          >
            <Tooltip title="最近访问文件">
              <Button
                size="large"
                shape="circle"
                style={{ border: "0px" }}
                ghost
                icon={<IconFont type="icon-wenjian" />}
                onClick={() => {
                  setHelpVisible(false);
                  setFileVisible(true);
                }}
              />
            </Tooltip>
          </div>
        </div>
      ) : null}
      <div
        className="tree-member"
        style={{
          height: moveState === "top" ? "45px" : "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "7px",
            boxSizing: "border-box",
          }}
          onClick={() => {
            setMoveState(moveState === "top" ? "bottom" : "top");
          }}
        >
          <img src={memberSvg} alt="" className="tree-logo" />
          <div style={{ marginLeft: "5px" }}>执行人</div>
        </div>
        {/* <div style={{ color: '#fff', fontSize: '14px', margin: '5px 0px' }}>
          任务树
        </div> */}

        <div className="tree-member-container">
          {treeMemberArray && gridList[targetIndex]
            ? treeMemberArray.map(
                (taskMemberItem: any, taskMemberIndex: number) => {
                  return (
                    <div
                      className="tree-member-item"
                      key={"taskMember" + taskMemberIndex}
                      onClick={() => {
                        if (targetNodeArray.length === 0) {
                          if (targetNode) {
                            changeExecutor(taskMemberItem);
                          }
                        } else {
                          changeExecutorArray(taskMemberItem);
                        }
                      }}
                      style={
                        gridList[targetIndex].type === 6 &&
                        gridList[targetIndex].labelKey ===
                          taskMemberItem.labelKey &&
                        gridList[targetIndex].executorKey ===
                          taskMemberItem.executorKey
                          ? { backgroundColor: "#f0f0f0" }
                          : {}
                      }
                    >
                      <div className="tree-member-name toLong">
                        {taskMemberItem.labelName}
                      </div>
                      <Tooltip
                        placement="left"
                        title={taskMemberItem.executorName}
                      >
                        <div
                          className="tree-member-img"
                          style={
                            gridList[targetIndex].type === 6 &&
                            gridList[targetIndex].labelKey ===
                              taskMemberItem.labelKey &&
                            gridList[targetIndex].executorKey ===
                              taskMemberItem.executorKey
                              ? { border: "3px solid #1890ff" }
                              : {}
                          }
                        >
                          <Avatar
                            avatar={taskMemberItem?.executorAvatar}
                            name={taskMemberItem?.executorName}
                            type={"person"}
                            index={0}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  );
                }
              )
            : null}
        </div>
      </div>
      <Drawer
        visible={infoBigVisible}
        onClose={() => {
          // setCloseSaveVisible(true);
          if (childRef?.current) {
            //@ts-ignore
            childRef.current.changeSave();
          }
          setInfoBigVisible(false);
          // setInfoBigVisible(false);
        }}
        width={750}
        bodyStyle={{
          padding: "0px 10px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        headerStyle={{
          display: "none",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        destroyOnClose={true}
        push={false}
      >
        <GroupTableInfo
          fileKey={gridList[targetIndex]?._key}
          type={"tree"}
          reflashNode={reflashNode}
          setNewContent={setNewContent}
          setOriginContent={setOriginContent}
          close={() => {
            setInfoBigVisible(false);
          }}
          ref={childRef}
        />

        {/* <img
            src={bigCloseSvg}
            alt=""
            className="bigClose"
            onClick={() => {
              // if (editable) {
              //   setCloseSaveVisible(true);
              // } else {
              setInfoBigVisible(false);
              setEditable(false);
              // }
            }}
          /> */}
        <Modal
          visible={closeSaveVisible}
          title={"关闭提示"}
          onOk={() => {
            setInfoBigVisible(false);
            setCloseSaveVisible(false);
          }}
          onCancel={() => {
            setCloseSaveVisible(false);
          }}
        >
          是否保存内容
        </Modal>
      </Drawer>
      <Drawer
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false);
        }}
        width={400}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        title={"转换节点"}
      >
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {iconBigArray.map((item: any, index: number) => {
            return (
              <div
                className="iconBig-container"
                onClick={() => {
                  editType(index + 10);
                }}
                key={"iconBig" + index}
              >
                <img src={item} alt="" className="iconBig-img" />
                <div className="iconBig-title">{iconBigText[index]}</div>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
