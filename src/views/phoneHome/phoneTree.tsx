import React, { useState, useEffect, useCallback, useRef } from "react";
import "./phoneTree.css";
import { MobileTree } from "tree-graph-react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Tooltip, Button, Drawer, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  setChooseKey,
  editTask,
  changeTaskInfoVisible,
  setTaskInfo,
  getGroupTask,
} from "../../redux/actions/taskActions";

import { setMessage } from "../../redux/actions/commonActions";
import { changeStartId } from "../../redux/actions/groupActions";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";

import GroupTableInfo from "../groupTable/groupTableInfo";

import createChildSvg from "../../assets/svg/createChild.svg";
import createbroSvg from "../../assets/svg/createbro.svg";
import treePackTaskSvg from "../../assets/svg/treePackTask.svg";
import treeTypeSvg from "../../assets/svg/treeType.svg";
import treeFileTaskSvg from "../../assets/svg/treeFileTask.svg";
import treeDelSvg from "../../assets/svg/treedel.svg";
import treeLabelSvg from "../../assets/svg/treeLabel.svg";

import uncreateChildSvg from "../../assets/svg/uncreateChild.svg";
import uncreatebroSvg from "../../assets/svg/uncreatebro.svg";
import untreePackTaskSvg from "../../assets/svg/untreePackTask.svg";
import untreeTypeSvg from "../../assets/svg/untreeType.svg";
import untreeFileTaskSvg from "../../assets/svg/untreeFileTask.svg";
import untreeDelSvg from "../../assets/svg/untreedel.svg";
import untreeLabelSvg from "../../assets/svg/untreeLabel.svg";

import packSvg from "../../assets/svg/pack.svg";
import linkBigIconSvg from "../../assets/svg/linkBigIcon.svg";
import Avatar from "../../components/common/avatar";

import defaultPersonPng from "../../assets/img/defaultPerson.png";
interface PhoneTreeProps {
  setHomeIndex: any;
}

const PhoneTree: React.FC<PhoneTreeProps> = (props) => {
  const { setHomeIndex } = props;
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const user = useTypedSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const startId = useTypedSelector((state) => state.group.startId);

  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>({});
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [selectedPath, setSelectedPath] = useState<any>([]);

  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [infoBigVisible, setInfoBigVisible] = useState(false);
  // const [memberCheckIndex, setMemberCheckIndex] = useState<any>(null)
  // const [closeSaveVisible, setCloseSaveVisible] = useState(false);
  const [treeMemberArray, setTreeMemberArray] = useState<any>([]);
  const targetTreeRef: React.RefObject<any> = useRef();
  const iconBigArray = [
    "https://cdn-icare.qingtime.cn/FtkXwZ6IehLY3esnusB7zXbATj0N",
    "https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo",
    "https://cdn-icare.qingtime.cn/FgcSN1LlGW1F0L5njTuMCEVtorPw",
    "https://cdn-icare.qingtime.cn/Fnwl_g4Re1NHyeNYBzGAq0goIWso",
    linkBigIconSvg,
    "https://cdn-icare.qingtime.cn/FhTo1tbXwsX2toqGmd2NXy4XGA-g",
  ];
  const iconBigText = [
    "时光文档",
    "时光绘图",
    "时光表格",
    "时光文本",
    "链接",
    "电子书",
  ];
  let unDistory = useRef<any>(true);
  const iconArray = useRef<any>([
    "https://cdn-icare.qingtime.cn/FpCB_dxjQGMt0lBUP-PwBXAVkNHN",
    "https://cdn-icare.qingtime.cn/FgKrqQB-8wqIouNRWzTzCe2A12FK",
    "https://cdn-icare.qingtime.cn/FjFqTs8ZmMtsL1X8LGZEVSV9WSRW",
    "https://cdn-icare.qingtime.cn/FjO6YNYHntTHrgS_3hR2kZiID8rd",
    "https://cdn-icare.qingtime.cn/链接备份.png0.10111010111110010011100111101110010000101001111100011607666734264",
    "https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y",
  ]);

  const getData = useCallback(
    async (key: string, targetObj?: any, step?: string) => {
      if (groupInfo?.taskTreeRootCardKey) {
        let gridRes: any = await api.task.getTaskTreeList(
          groupInfo.taskTreeRootCardKey,
          key
        );
        if (unDistory.current) {
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
                  limitDay:
                    moment(taskItem.taskEndDate).endOf("day").valueOf() + 1,
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
                    taskItem.parentCardKey ||
                    key !== groupInfo.taskTreeRootCardKey
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
                if (taskItem.type === 6) {
                  newNodeObj[taskItem._key].icon = taskItem.executorKey
                    ? taskItem.executorAvatar
                      ? taskItem.executorAvatar
                      : defaultPersonPng
                    : null;
                } else {
                  newNodeObj[taskItem._key].icon = taskItem?.extraData?.icon
                    ? taskItem.extraData.icon
                    : iconArray.current[taskItem.type - 10];
                }
                if (taskItem?.extraData?.pack) {
                  newNodeObj[taskItem._key].icon = packSvg;
                }
                if (taskItem.children) {
                  newNodeObj[taskItem._key].sortList =
                    taskItem.finishPercent !== 2 ? taskItem.children : [];
                  newNodeObj[taskItem._key].contract =
                    (taskItem.contract &&
                      newNodeObj[taskItem._key].sortList.length > 0) ||
                    (taskItem.type === 15 &&
                      key === groupInfo.taskTreeRootCardKey)
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
              console.log(newNodeObj)
              return { ...prevNodeObj, ...newNodeObj };
            });
          } else {
            dispatch(setMessage(true, gridRes.msg, "error"));
          }
        }
      }
    },
    [dispatch, groupInfo, user]
  );
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
        if (taskItem.type === 6) {
          prevNodeObj[taskItem._key].icon = taskItem.executorKey
            ? taskItem.executorAvatar
              ? taskItem.executorAvatar
              : defaultPersonPng
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
  useEffect(() => {
    if (taskInfo) {
      getData(taskInfo._key);
    }
  }, [taskInfo, getData]);
  useEffect(() => {
    if (groupInfo) {
      getData(groupInfo.taskTreeRootCardKey, null, "start");
    }
    if (groupMemberArray) {
      let newLabelInfo: any = [];
      let newExecutorInfo: any = [];
      groupInfo.labelInfo.forEach((item) => {
        // if (item && item.labelKey && item.executorKey) {
        if (item && ((item.labelKey && item.executorKey) || !item.labelKey)) {
          newExecutorInfo.unshift({ executorKey: item.executorKey });
          newLabelInfo.unshift({
            executorAvatar: item.executorAvatar,
            executorKey: item.executorKey,
            executorName: item.executorName,
            labelKey: item.labelKey,
            labelName: item.labelKey ? item.labelName : "ToDo",
            groupkey: groupKey,
          });
        }
      });
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
  }, [groupInfo, groupKey, getData, groupMemberArray, dispatch]);

  useEffect(() => {
    if (startId && nodeObj && nodeObj[startId]) {
      setSelectedPath(nodeObj[startId].path1);
    }
  }, [startId, nodeObj]);
  const chooseNode = (node: any, type?: number) => {
    if (node) {
      let newGridList = [...gridList];
      let nodeIndex = _.findIndex(newGridList, { _key: node._key });
      if (JSON.stringify(targetNode) !== JSON.stringify(node)) {
        setTargetNode(node);
        if (nodeIndex !== -1) {
          setTargetIndex(nodeIndex);
          // getTaskMemberArray(taskItem.grougKey)
        }
        setSelectedId(node._key);
        if (
          nodeIndex !== -1 &&
          (newGridList[nodeIndex]?.finishPercent === 2 ||
            newGridList[nodeIndex]?.extraData?.pack)
        ) {
          getData(node._key);
        }
      } else {
        if (node.type !== 1) {
          switch (node.type) {
            case 6:
              dispatch(changeTaskInfoVisible(true));
              dispatch(setChooseKey(node._key));
              dispatch(setTaskInfo(newGridList[nodeIndex]));
              break;
            default:
              setInfoBigVisible(true);
              break;
          }
        }
      }
    }
  };
  const addChildrenTask = async (
    selectedNode: any,
    type: string,
    taskType: number
  ) => {
    if (type === "next" && groupInfo.taskTreeRootCardKey === selectedNode) {
      dispatch(setMessage(true, "根结点不能新建同级节点", "error"));
      return;
    }
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let fatherKey =
      type === "child"
        ? selectedNode
        : type === "next"
        ? newNodeObj[selectedNode].father
        : "";
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
      if (taskType === 6) {
        newNode.icon = result.executorKey
          ? result.executorAvatar
            ? result.executorAvatar
            : defaultPersonPng
          : null;
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
      } else if (type === "next") {
        if (
          !newNodeObj[selectedNode] ||
          !newNodeObj[newNodeObj[selectedNode].father]
        ) {
          return;
        }
        let targetIndex =
          newNodeObj[newNodeObj[selectedNode].father].sortList.indexOf(
            selectedNode
          );
        newNodeObj[newNodeObj[selectedNode].father].sortList.splice(
          targetIndex + 1,
          0,
          newNode._key
        );
      }
      setNodeObj(newNodeObj);
      setTargetNode(newNodeObj[newNode._key]);
      chooseNode(newNodeObj[newNode._key], 1);
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    if (text.trim() === "") {
      text = "新主题";
    }
    newNodeObj[nodeId].name = text;
    let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    newGridList[nodeIndex].title = text;
    dispatch(editTask({ key: nodeId, title: text }, 3));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
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
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    if (node) {
      let newGridList = [...gridList];
      // dispatch(changeTaskInfoVisible(false));

      dispatch(changeStartId(node._key));
      setSelectedPath(nodeObj[node._key].path1);
      const dotIndex = _.findIndex(newGridList, { _key: node._key });
      if (
        dotIndex !== -1 &&
        (newGridList[dotIndex]?.finishPercent === 2 ||
          newGridList[dotIndex]?.extraData?.pack)
      ) {
        getData(node._key);
      }
    }
  };
  const editPack = async () => {
    let newGridList = [...gridList];
    let newTargetNode = { ...targetNode };
    let nodeId = newTargetNode._key;
    if (nodeId === groupInfo.taskTreeRootCardKey) {
      dispatch(setMessage(true, "根节点不允许打包", "error"));
      return;
    }

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
      getData(targetNode.father);
    } else {
      dispatch(setMessage(true, editTaskRes.msg, "error"));
    }
  };
  const editFinishPercent = async (node: any) => {
    let newTargetNode = { ...targetNode };
    let newNodeObj = { ...nodeObj };
    let newGridList = [...gridList];
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].finishPercent = 2;
    newNodeObj[node._key].checked = true;
    newNodeObj[node._key].strikethrough = true;
    dispatch(editTask({ key: node._key, finishPercent: 2 }, 3));
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editType = async (type: number) => {
    let newNodeObj = { ...nodeObj };
    let newTargetNode = { ...targetNode };
    let nodeId = newTargetNode._key;
    let obj: any = {};
    if (newNodeObj[nodeId].type !== 30) {
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
        setTargetNode(newTargetNode);
        getData(newNodeObj[nodeId].father);
      } else {
        dispatch(setMessage(true, editTaskRes.msg, "error"));
      }

      setMenuVisible(false);
    } else {
      dispatch(setMessage(true, "频道节点不允许修改频道类型", "error"));
    }
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
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
            let nodeIndex = _.findIndex(prevGridList, {
              _key: targetNode._key,
            });
            if (nodeIndex !== -1) {
              prevGridList[nodeIndex].children.splice(nodeIndex, 1);
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
              prevNodeObj[targetNode.father].sortList.splice(deleteIndex, 1);
            }
            delete prevNodeObj[targetNode._key];
            return { ...prevNodeObj };
          });
          // newNodeObj[targetNode._key]
        } else {
          dispatch(setMessage(true, deleteRes.msg, "error"));
        }
      }
    }

    //}
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
  return (
    <div className="phoneTree">
      <div className="phoneTree-header">
        <div>
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode ? createChildSvg : uncreateChildSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              if (targetNode) {
                addChildrenTask(targetNode._key, "child", 1);
              } else {
                dispatch(setMessage(true, "请选择节点", "error"));
              }
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode ? createbroSvg : uncreatebroSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              if (targetNode) {
                addChildrenTask(targetNode._key, "next", 1);
              } else {
                dispatch(setMessage(true, "请选择节点", "error"));
              }
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode ? treePackTaskSvg : untreePackTaskSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              if (targetNode) {
                editPack();
              } else {
                dispatch(setMessage(true, "请选择节点", "error"));
              }
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode?.type === 1 ? treeTypeSvg : untreeTypeSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              if (targetNode?.type === 1) {
                setMenuVisible(true);
              } else {
                dispatch(setMessage(true, "请选择普通节点", "error"));
              }
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={
                  targetNode && targetNode.type === 6
                    ? treeFileTaskSvg
                    : untreeFileTaskSvg
                }
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              if (targetNode && targetNode.type === 6) {
                editFinishPercent(targetNode);
              } else {
                dispatch(setMessage(true, "请选择节点", "error"));
              }
            }}
            className="phoneTree-button"
          />
        </div>
        <div>
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode ? treeDelSvg : untreeDelSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              setDeleteDialogShow(true);
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <img
                src={targetNode ? treeLabelSvg : untreeLabelSvg}
                alt=""
                className="phoneTree-button-img"
              />
            }
            onClick={(e) => {
              setMemberVisible(true);
            }}
            className="phoneTree-button"
          />
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={
              <ArrowLeftOutlined
                className="phoneTree-button-img"
                style={{ color: "#fff" }}
              />
            }
            onClick={(e) => {
              setHomeIndex(1);
            }}
            className="phoneTree-button"
          />
        </div>
      </div>
      <div className="phoneTree-path">
        {selectedPath
          ? selectedPath.map((pathItem: any, pathIndex: number) => {
              return (
                <React.Fragment key={"path" + pathIndex}>
                  <div
                    onClick={() => {
                      dispatch(changeStartId(pathItem._key));
                      setSelectedPath(nodeObj[pathItem._key].path1);
                    }}
                    style={{
                      fontWeight: startId === pathItem._key ? "bold" : "normal",
                    }}
                    className="phoneTree-path-item"
                  >
                    {pathItem.title === "项目任务树根节点" ||
                    (pathItem.title === "任务树" && pathIndex === 0)
                      ? groupInfo.groupName
                      : pathItem.title}
                    <div className="phoneTree-path-icon">
                      <div className="phoneTree-path-icon-top"></div>
                      <div className="phoneTree-path-icon-bottom"></div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          : null}
      </div>
      <div className="phoneTree-container">
        {groupInfo && nodeObj ? (
          <MobileTree
            ref={targetTreeRef}
            nodes={nodeObj}
            uncontrolled={false}
            startId={startId}
            backgroundColor="#f5f5f5"
            selectedBackgroundColor="#02cdd3"
            color="#333"
            hoverColor="#fff"
            defaultSelectedId={selectedId}
            showMoreButton={true}
            handleClickNode={(node: any) => {
              chooseNode(node);
            }}
            handleAddChild={(selectedNode: any) => {
              addChildrenTask(selectedNode, "child", 1);
            }}
            handleAddNext={(selectedNode: any) => {
              addChildrenTask(selectedNode, "next", 1);
            }}
            handleChangeNodeText={(nodeId: string, text: string) => {
              editTaskText(nodeId, text);
            }}
            handleClickExpand={editContract}
            handleDeleteNode={(nodeId: any) => {
              setDeleteDialogShow(true);
            }}
            handleClickDot={
              clickDot
              // setSelectedId(node._key);
            }
            // handleClickMoreButton={(node: any) => {
            //   chooseNode(node);
            //   // setTreeMenuLeft(node.x);
            //   // setTreeMenuTop(node.y);
            //   // setItemDialogShow(true);
            // }}
          />
        ) : null}
      </div>
      <Modal
        visible={deleteDialogShow}
        onCancel={() => {
          setDeleteDialogShow(false);
        }}
        onOk={() => {
          deleteTask();
        }}
        title={"删除节点"}
        centered={true}
        width="250px"
        bodyStyle={{
          height: "70px",
          padding: "0px",
        }}
        destroyOnClose={true}
      >
        <div className="dialog-onlyTitle">是否 删除节点</div>
      </Modal>
      <Drawer
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false);
        }}
        width={300}
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
      <Drawer
        visible={memberVisible}
        onClose={() => {
          setMemberVisible(false);
        }}
        width={200}
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
        title={"频道看板"}
      >
        <div className="tree-member-container">
          {treeMemberArray && gridList[targetIndex]
            ? treeMemberArray.map(
                (taskMemberItem: any, taskMemberIndex: number) => {
                  return (
                    <div
                      className="tree-member-item"
                      key={"taskMember" + taskMemberIndex}
                      onClick={() => {
                        if (targetNode) {
                          changeExecutor(taskMemberItem);
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
                      <Tooltip title={taskMemberItem.executorName}>
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
      </Drawer>
      <Drawer
        visible={infoBigVisible}
        onClose={() => {
          setInfoBigVisible(false);
        }}
        width={document.documentElement.offsetWidth}
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
        title={"节点属性"}
      >
        <GroupTableInfo fileKey={gridList[targetIndex]?._key} type={"h5"} />
      </Drawer>
    </div>
  );
};
PhoneTree.defaultProps = {};
export default PhoneTree;
