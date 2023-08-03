import React, { useState, useEffect, useRef, useMemo } from "react";
import "../workingTable/workingTableHeader.css";
import "./groupTableHeader.css";
import { Button, Tooltip, Checkbox, Modal, Menu, Progress } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _ from "lodash";
import copy from "copy-to-clipboard";
import api from "../../services/api";

import {
  changeMainenterpriseGroup,
  changeEnterpriseGroupState,
} from "../../redux/actions/authActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";
import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
  setCreateMemberState,
} from "../../redux/actions/commonActions";
import { setFilterObject, getGroupTask } from "../../redux/actions/taskActions";
import {
  changeLocalGroupInfo,
  getGroup,
  setGroupKey,
  getGroupInfo,
} from "../../redux/actions/groupActions";
import { getGroupMember } from "../../redux/actions/memberActions";

import DropMenu from "../../components/common/dropMenu";
import GroupSet from "../tabs/groupSet";
import GroupMember from "../tabs/groupMember";
import Loading from "../../components/common/loading";

import HeaderFilter from "../../components/headerFilter/headerFilter";
import Contact from "../../views/contact/contact";
import labelbSvg from "../../assets/svg/labelb.svg";
import gridTimebSvg from "../../assets/svg/gridTimeb.svg";
import gridPersonbSvg from "../../assets/svg/gridPersonb.svg";
import groupPersonbSvg from "../../assets/svg/groupPersonb.svg";
import filterPng from "../../assets/img/filter.png";
import infoPng from "../../assets/img/info.png";
import groupSet1Png from "../../assets/img/groupSet1.png";
import groupSet2Png from "../../assets/img/groupSet2.png";
import groupSet3Png from "../../assets/img/groupSet3.png";
import groupSet4Png from "../../assets/img/groupSet4.png";
import groupSet5Png from "../../assets/img/groupSet5.png";
import tabb0Svg from "../../assets/svg/tab0.svg";
import tabb1Svg from "../../assets/svg/tab1.svg";
import tabb2Svg from "../../assets/svg/tab2.svg";
import tabb4Svg from "../../assets/svg/tab4.svg";
import tabb5Svg from "../../assets/svg/tab5.svg";
import tabb6Svg from "../../assets/svg/tab6.svg";
import tab0Svg from "../../assets/svg/tabw0.svg";
import tab1Svg from "../../assets/svg/tabw1.svg";
import tab2Svg from "../../assets/svg/tabw2.svg";
import tab4Svg from "../../assets/svg/tabw4.svg";
import tab5Svg from "../../assets/svg/tabw5.svg";
import tab6Svg from "../../assets/svg/tabw6.svg";
import fileGroupSvg from "../../assets/svg/fileGroup.svg";
import unfileGroupSvg from "../../assets/svg/unfileGroup.svg";
import downArrowPng from "../../assets/img/downArrow.png";
import logoutPng from "../../assets/img/logout.png";
import lineMagicSvg from "../../assets/svg/lineMagic.svg";
import customServiceSvg from "../../assets/svg/customService.svg";

import Code from "../../components/qrCode/qrCode";
import Avatar from "../../components/common/avatar";
import LogoModel from "../../components/common/logoModal";
declare var window: Window;
const { SubMenu } = Menu;
const { confirm } = Modal;
interface GroupTableHeaderProps {
  finishPercent: number;
  finishNumber: number;
  setChatTabState: any;
}
const GroupTableHeader: React.FC<GroupTableHeaderProps> = (prop) => {
  const { finishPercent, finishNumber, setChatTabState } = prop;
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const user = useTypedSelector((state) => state.auth.user);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const createMemberState = useTypedSelector(
    (state) => state.common.createMemberState
  );

  const dispatch = useDispatch();
  const viewArray: string[] = ["频道看板", "日程规划", "人员分配", "成员看板"];
  const viewImgb: string[] = [
    labelbSvg,
    gridTimebSvg,
    gridPersonbSvg,
    groupPersonbSvg,
  ];
  const tabImg: string[] = [
    tab0Svg,
    tab5Svg,
    tab1Svg,
    tab4Svg,
    tab2Svg,
    tab6Svg,
  ];
  const tabbImg: string[] = [
    tabb0Svg,
    tabb5Svg,
    tabb1Svg,
    tabb4Svg,
    tabb2Svg,
    tabb6Svg,
  ];
  const checkedTitle = [
    "过期",
    "今天",
    "未来",
    "未完成",
    "已完成",
    "已归档",
    "一般卡片",
  ];
  const tabArray = ["任务", "超级树", "日报", "活力", "排行榜", "日程"];
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [groupSetVisible, setGroupSetVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [joinCount, setJoinCount] = useState(0);
  const [dismissVisible, setDismissVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);

  const [groupMember, setGroupMember] = useState<any>([]);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [groupTabIndex, setGroupTabIndex] = React.useState(0);
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [outGroupVisible, setOutGroupVisible] = useState(false);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState("7");
  const [infoChangeState, setInfoChangeState] = useState(false);
  const [defaultPngVisible, setDefaultPngVisible] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  // const [workType, setWorkType] = useState(10);
  const groupTableRef: React.RefObject<any> = useRef();
  const workMenuRef = useRef<any>([
    "我执行",
    "过期 / 今天",
    "今天",
    "过期",
    "未来",
    "已完成",
    "我指派",
    "未完成",
    "已完成",
    "已过期",
  ]);
  const chooseMemberHeader = async (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    let newFilterObject: any = _.cloneDeep(filterObject);
    newFilterObject.headerIndex = headIndex;
    dispatch(setFilterObject(newFilterObject));
  };
  useEffect(() => {
    if (groupMemberItem) {
      dispatch(setFilterObject(groupMemberItem.config));
    }
  }, [groupMemberItem, dispatch]);
  useMemo(() => {
    if (taskArray) {
      setLoading(false);
    }
  }, [taskArray]);

  useEffect(() => {
    if (createMemberState && groupInfo) {
      setGroupSetVisible(true);
      setGroupTabIndex(1);
      dispatch(setCreateMemberState(false));
    }
  }, [groupInfo, createMemberState, dispatch]);

  useEffect(() => {
    let index = memberHeaderIndex < 3 ? 0 : memberHeaderIndex - 2;
    if (memberHeaderIndex === 8 || memberHeaderIndex === 9) {
      index = 0;
    }
    setTabIndex(index);
  }, [memberHeaderIndex]);
  useEffect(() => {
    if (groupInfo) {
      setJoinCount(groupInfo.applyJoinGroupMemberCount);
    }
  }, [groupInfo]);
  useEffect(() => {
    if (filterObject) {
      let filterCheckedArray: any = [];
      const checkedTitle = [
        "过期",
        "今天",
        "未来",
        "未完成",
        "已完成",
        "已归档",
        "一般卡片",
      ];
      if (filterObject.filterType.length > 0) {
        filterCheckedArray = checkedTitle.map((item: any) => {
          return filterObject.filterType.indexOf(item) !== -1;
        });
      }
      setFileInput(filterObject.fileDay);
      setFilterCheckedArray(filterCheckedArray);
    }
  }, [filterObject]);
  const changeFilterCheck = async (filterTypeText: string) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    let fikterIndex = newFilterObject.filterType.indexOf(filterTypeText);
    if (fikterIndex === -1) {
      newFilterObject.filterType.push(filterTypeText);
    } else {
      newFilterObject.filterType.splice(fikterIndex, 1);
    }
    if (newFilterObject.filterType.length === 0) {
      newFilterObject.filterType = ["过期", "今天"];
    }
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    setLoading(true);
    dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    dispatch(setFilterObject(newFilterObject));
  };
  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
    setInfoChangeState(true);
  };
  const setGroup = async (type?: string) => {
    if (groupObj && infoChangeState) {
      if (
        groupObj.isHasPassword &&
        (!groupObj.question || !groupObj.password)
      ) {
        dispatch(setMessage(true, "口令加入必须包含口令问题和口令", "error"));
        return;
      }
      if (groupRole === 1 || groupRole === 2) {
        let groupRes: any = await api.group.changeGroupInfo(groupKey, groupObj);
        if (groupRes.msg === "OK") {
          dispatch(changeLocalGroupInfo(groupRes.result));
          dispatch(getGroup(3));
          dispatch(setMessage(true, "修改项目属性成功", "success"));
          setInfoChangeState(false);
          if (type === "close") {
            setGroupSetVisible(false);
          }
          if (groupInfo.enterprise === 2) {
            dispatch(changeEnterpriseGroupState(true));
          }
        } else {
          dispatch(setMessage(true, groupRes.msg, "error"));
          setInfoChangeState(false);
        }
      } else {
        dispatch(setMessage(true, "权限不够,无法修改项目属性", "error"));
      }
    } else {
      if (type === "close") {
        setGroupSetVisible(false);
      }
    }
  };
  const setMember = (groupMember: any) => {
    setGroupMember(groupMember);
    setInfoChangeState(true);
  };
  const saveGroupMember = async (type?: string) => {
    if (groupMember.length > 0 && infoChangeState) {
      let newGroupMember: any = [];
      let newGroupMemberRole: any = [];
      groupMember.forEach((groupMemberItem: any) => {
        newGroupMember.push(groupMemberItem.userId);
        newGroupMemberRole.push(groupMemberItem.role);
        //   {
        //   userKey: groupMemberItem.userId,
        //   nickName: groupMemberItem.nickName,
        //   avatar: groupMemberItem.avatar,
        //   gender: groupMemberItem.gender,
        //   role: groupMemberItem.role,
        // }

        // }
      });
      let addRes: any = await api.group.addAllGroupMember(
        groupKey,
        newGroupMember,
        newGroupMemberRole
      );
      if (addRes.msg === "OK") {
        dispatch(getGroupMember(groupKey, 4));
        dispatch(setMessage(true, "修改项目成员成功", "success"));
        setInfoChangeState(false);
        if (type === "close") {
          setGroupSetVisible(false);
        }
      } else {
        dispatch(setMessage(true, addRes.msg, "error"));
        setInfoChangeState(false);
      }
    } else {
      if (type === "close") {
        setGroupSetVisible(false);
      }
    }
  };
  const deleteFilter = async (filterTypeText: string) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    switch (filterTypeText) {
      case "groupKey":
        newFilterObject.groupKey = null;
        newFilterObject.groupLogo = "";
        newFilterObject.groupName = "";
        break;
      case "creatorKey":
        newFilterObject.creatorKey = null;
        newFilterObject.creatorAvatar = "";
        newFilterObject.creatorName = "";
        break;
      case "executorKey":
        newFilterObject.executorKey = null;
        newFilterObject.executorAvatar = "";
        newFilterObject.executorName = "";
    }
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    dispatch(setFilterObject(newFilterObject));
  };

  const dismissGroup = async () => {
    let groupRes: any = await api.group.dismissGroup(groupKey);
    if (groupRes.msg === "OK") {
      if (groupInfo.enterprise === 2) {
        dispatch(setMessage(true, "解散企业成功", "success"));
        dispatch(changeMainenterpriseGroup("", "", "全部项目", 0));
        dispatch(changeEnterpriseGroupState(true));
      } else {
        dispatch(setMessage(true, "解散项目成功", "success"));
      }
      dispatch(getGroup(3));
      dispatch(setCommonHeaderIndex(1));
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const shareGroup = (url: string) => {
    copy(url);
    dispatch(setMessage(true, "复制分享链接成功", "success"));
  };
  const outGroup = async () => {
    let memberRes: any = await api.group.outGroup(groupKey);
    if (memberRes.msg === "OK") {
      if (groupInfo.enterprise === 2) {
        dispatch(changeEnterpriseGroupState(true));
      }
      dispatch(setMessage(true, "退出项目成功", "success"));
      dispatch(getGroup(3));
      dispatch(setCommonHeaderIndex(1));
      if (!theme.moveState) {
        dispatch(setMoveState("out"));
      }
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const changeFileDay = async (fileDay: number) => {
    let newFilterObject = _.cloneDeep(filterObject);
    if (isNaN(fileDay)) {
      dispatch(setMessage(true, "请输入数字", "warning"));
      setFileInput("7");
      setFileState(true);
      return;
    }
    newFilterObject.fileDay = fileDay;
    let res: any = await api.member.setConfig(
      groupMemberItem._key,
      newFilterObject
    );
    if (res.msg === "OK") {
      setFileState(true);
      dispatch(setFilterObject(newFilterObject));
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const cloneGroup = async () => {
    if (groupInfo.enterprise !== 2) {
      let cloneRes: any = await api.group.cloneGroup(
        groupInfo._key,
        groupInfo.groupName + "_副本"
      );
      if (cloneRes.msg === "OK") {
        dispatch(setMessage(true, "克隆项目成功", "success"));
        dispatch(setGroupKey(cloneRes.result));
        dispatch(getGroupInfo(cloneRes.result));
        dispatch(setCommonHeaderIndex(3));
        // if (!theme.moveState) {
        //   dispatch(setMoveState("in"));
        // }
        await api.group.visitGroupOrFriend(2, cloneRes.result);
        dispatch(getGroup(3));
      } else {
        dispatch(setMessage(true, cloneRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "企业群不允许克隆", "error"));
    }
  };
  const foldGroup = async () => {
    let foldRes: any = await api.group.changeGroupInfo(groupKey, {
      isFile: groupInfo?.isFile ? false : true,
    });
    if (foldRes.msg === "OK") {
      dispatch(
        setMessage(
          true,
          (groupInfo?.isFile ? "还原项目" : "归档项目") + "成功",
          "success"
        )
      );
      dispatch(getGroup(3));
      setFileVisible(false);
    } else {
      dispatch(setMessage(true, foldRes.msg, "error"));
    }
  };
  const changeWorkType = async (type) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    // setWorkType(type);
    newFilterObject.creatorKey = "";
    newFilterObject.creatorAvatar = "";
    newFilterObject.creatorName = "";
    newFilterObject.executorKey = "";
    newFilterObject.executorAvatar = "";
    newFilterObject.executorName = "";
    switch (type) {
      case 0:
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 1:
        newFilterObject.filterType = ["过期", "今天"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 2:
        newFilterObject.filterType = ["今天"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 3:
        newFilterObject.filterType = ["过期"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 4:
        newFilterObject.filterType = ["未来"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 5:
        newFilterObject.filterType = ["已完成"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 6:
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 7:
        newFilterObject.filterType = ["未完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 8:
        newFilterObject.filterType = ["已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 9:
        newFilterObject.filterType = ["过期"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
    }
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    setLoading(true);
    dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    dispatch(setFilterObject(newFilterObject));
  };
  const toChatGroup = async () => {
    let groupRes: any = await api.group.changeGroupInfo(groupKey, {
      isCustomService: true,
    });
    if (groupRes.msg === "OK") {
      dispatch(changeLocalGroupInfo(groupRes.result));
      dispatch(getGroup(3));
      dispatch(setMessage(true, "转换成客服项目成功", "success"));
      dispatch(setHeaderIndex(9));
      setChatTabState(true);
      createTreeNode();
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const createTreeNode = async () => {
    // 2165229978;
    let tokenRes: any = await api.auth.switchToken();
    if (tokenRes.msg === "OK") {
      let urlRes: any = await api.common.createWorkingTreeNode(
        tokenRes.result.token,
        groupInfo.groupName + "知识库",
        groupKey
      );
      if (urlRes.msg === "OK") {
        let groupRes: any = await api.group.changeGroupInfo(groupKey, {
          treeNode: urlRes.data._key,
        });
        if (groupRes.msg === "OK") {
          console.log("ok");
        } else {
          dispatch(setMessage(true, groupRes.msg, "error"));
        }
        // urlRes.result._key
        // 2165229978;
      } else {
        dispatch(setMessage(true, urlRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, tokenRes.msg, "error"));
    }
  };
  const menu = (
    <React.Fragment>
      <Menu>
        {tabArray.map((tabItem: any, index: number) => {
          return (
            <React.Fragment key={"tabTable" + index}>
              {index === 0 ? (
                <SubMenu
                  key={"menutabTable" + index}
                  className="viewTableHeader-tab"
                  title={
                    <div
                      onClick={() => {
                        chooseMemberHeader(0);
                        setTabIndex(0);
                      }}
                    >
                      {tabItem}
                    </div>
                  }
                  icon={
                    <img
                      src={tabbImg[index]}
                      alt=""
                      className="viewTableHeader-tab-logo"
                      style={{ marginBottom: "3px" }}
                    />
                  }
                >
                  {viewArray.map((viewItem: any, viewIndex: number) => {
                    return (
                      <Menu.Item
                        key={"viewTable" + viewIndex}
                        className="viewTableHeader-tab"
                        onClick={() => {
                          if (viewIndex !== 3) {
                            chooseMemberHeader(viewIndex);
                            if (viewIndex !== 0) {
                              dispatch(setMoveState("in"));
                            }
                          } else {
                            chooseMemberHeader(8);
                          }
                          setTabIndex(0);
                        }}
                      >
                        <img
                          src={viewImgb[viewIndex]}
                          alt=""
                          className="viewTableHeader-tab-logo"
                        />
                        <span style={{ marginLeft: "10px" }}>{viewItem}</span>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={"menutabTable" + index}
                  className="viewTableHeader-tab"
                  onClick={() => {
                    chooseMemberHeader(index + 2);
                    setTabIndex(index);
                    if (index === 1) {
                      dispatch(setMoveState("in"));
                    }
                  }}
                >
                  <img
                    src={tabbImg[index]}
                    alt=""
                    className="viewTableHeader-tab-logo"
                  />
                  <span style={{ marginLeft: "10px" }}>{tabItem}</span>
                </Menu.Item>
              )}
            </React.Fragment>
          );
        })}
      </Menu>
    </React.Fragment>
  );
  const setMenu = (
    <div className="groupTableHeader-info-container">
      <div
        className="groupTableHeader-info-item"
        onClick={() => {
          setGroupSetVisible(true);
          setGroupTabIndex(0);
        }}
      >
        <img
          src={groupSet1Png}
          alt=""
          style={{ width: "18px", height: "18px" }}
        />
        项目属性
      </div>
      <div
        className="groupTableHeader-info-item"
        onClick={() => {
          setGroupSetVisible(true);
          setGroupTabIndex(1);
        }}
      >
        <img
          src={groupSet5Png}
          alt=""
          style={{ width: "22px", height: "20px" }}
        />
        项目成员
        {groupInfo && joinCount > 0 ? (
          <div
            className="group-member-title-num"
            style={
              joinCount > 10
                ? { borderRadius: "12px", padding: "0px 3px" }
                : { borderRadius: "50%", width: "20px" }
            }
          >
            {joinCount}
          </div>
        ) : null}
      </div>
      <div
        className="groupTableHeader-info-item"
        onClick={() => {
          setShareVisible(true);
        }}
      >
        <img
          src={groupSet2Png}
          alt=""
          style={{ width: "20px", height: "19px" }}
        />
        分享项目
      </div>
      <div
        className="groupTableHeader-info-item"
        onClick={() => {
          // setFileVisible(true);
          if (groupInfo && groupInfo.isCustomService) {
            dispatch(setHeaderIndex(9));
          } else {
            confirm({
              content: "是否将该项目转换为客服项目，转换后无法恢复成普通项目",
              onOk() {
                console.log("OK");
                toChatGroup();
              },
              onCancel() {
                console.log("Cancel");
              },
            });
          }
        }}
      >
        <img
          src={customServiceSvg}
          alt=""
          style={{ width: "20px", height: "18px" }}
        />
        客服界面
      </div>
      {groupInfo && groupInfo.role < 3 && groupInfo.role > 0 ? (
        <div
          className="groupTableHeader-info-item"
          onClick={() => {
            setFileVisible(true);
          }}
        >
          <img
            src={groupInfo?.isFile ? unfileGroupSvg : fileGroupSvg}
            alt=""
            style={{ width: "20px", height: "18px" }}
          />
          {groupInfo?.isFile ? "还原项目" : "归档项目"}
        </div>
      ) : null}
      {groupInfo && groupInfo.role === 1 ? (
        <div
          className="groupTableHeader-info-item"
          onClick={() => {
            setDismissVisible(true);
          }}
        >
          <img
            src={groupSet4Png}
            alt=""
            style={{ width: "20px", height: "18px" }}
          />
          解散项目
        </div>
      ) : null}
      {groupInfo && groupInfo.role < 3 && groupInfo.role > 0 ? (
        <div
          className="groupTableHeader-info-item"
          onClick={() => {
            setCloneGroupVisible(true);
          }}
        >
          <img
            src={groupSet3Png}
            alt=""
            style={{ width: "17px", height: "17px" }}
          />
          克隆项目
        </div>
      ) : null}
    </div>
  );
  const filterMenu = (
    <React.Fragment>
      {loading ? <Loading /> : null}
      <HeaderFilter />
      <div className="filter-info">
        <div className="filter-title">状态 :</div>
        <div className="filter-menu">
          {checkedTitle.map((item: any, index: number) => {
            return (
              <div key={"filter" + item} className="filter-menu-item">
                <Checkbox
                  checked={!!filterCheckedArray[index]}
                  onChange={() => {
                    changeFilterCheck(item);
                  }}
                >
                  {item}
                </Checkbox>
                {item === "已归档" ? (
                  <React.Fragment>
                    {fileState ? (
                      <span
                        onClick={() => {
                          setFileState(false);
                        }}
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                        }}
                      >
                        ( 近{fileInput}天 )
                      </span>
                    ) : (
                      <span style={{ marginLeft: "8px" }}>
                        ( 近
                        <input
                          value={fileInput}
                          onChange={(e) => {
                            setFileInput(e.target.value);
                          }}
                          onBlur={(e) => {
                            changeFileDay(parseInt(e.target.value));
                          }}
                          className="fileday"
                        />
                        天 )
                      </span>
                    )}
                  </React.Fragment>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
  const workMenu = (
    <React.Fragment>
      {workMenuRef.current.map((item, index) => {
        return (
          <div
            className="home-item header-home-item"
            onClick={() => {
              changeWorkType(index);
            }}
            key={"workMenu" + index}
          >
            {item}
          </div>
        );
      })}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <div
        className="workingTableHeader groupTableHeader"
        style={{ left: moveState === "in" ? "0px" : "320px" }}
        ref={groupTableRef}
      >
        <div
          className="groupTableHeader-name"
          onMouseEnter={() => {
            setGroupVisible(true);
          }}
          onMouseLeave={() => {
            setGroupVisible(false);
          }}
        >
          <div
            className="groupTableHeader-logo"
            onClick={(e) => {
              e.stopPropagation();
              setDefaultPngVisible(true);
            }}
          >
            <Avatar
              name={groupInfo?.groupName}
              avatar={groupInfo?.groupLogo}
              type={"group"}
              index={0}
            />
          </div>
          <div className="groupTableHeader-name-title">
            {groupInfo && groupInfo.groupName}
          </div>
          <img
            src={downArrowPng}
            alt=""
            className="groupTableHeader-name-title-logo"
          />
          <DropMenu
            visible={groupVisible}
            dropStyle={{
              width: "400px",
              height: document.body.offsetHeight - 80,
              top: "55px",
              left: "0px",
              color: "#333",
              overflow: "visible",
            }}
            onClose={() => {
              setGroupVisible(false);
            }}
          >
            <Contact contactIndex={0} contactType={"header"} />
          </DropMenu>
        </div>
        <div
          className="dropMenu-upBox"
          onMouseEnter={() => {
            setFilterVisible(false);
            setMenuVisible(false);
            setInfoVisible(true);
          }}
          onMouseLeave={() => {
            setInfoVisible(false);
          }}
        >
          <div
            className="groupTableHeader-info"
            onClick={() => {
              setFilterVisible(false);
              setMenuVisible(false);
              setInfoVisible(true);
            }}
          >
            <img
              src={infoPng}
              alt=""
              style={{ width: "18px", height: "18px" }}
            />
            <DropMenu
              visible={infoVisible}
              dropStyle={{
                width: "180px",
                height: groupInfo
                  ? groupInfo.role === 1
                    ? "360px"
                    : "320px"
                  : "0px",
                top: "55px",
                left: "0px",
                color: "#333",
                overflow: "visible",
              }}
              onClose={() => {
                setInfoVisible(false);
              }}
              title={"设置列表"}
            >
              {setMenu}
            </DropMenu>
          </div>
        </div>
        <div className="view-container">
          <div
            className="dropMenu-upBox"
            onMouseEnter={() => {
              setFilterVisible(false);
              setMenuVisible(true);
              setInfoVisible(false);
            }}
            onMouseLeave={() => {
              setMenuVisible(false);
            }}
          >
            <div
              // style={{ width: '85px' }}
              className="workingTableHeader-tag"
              onClick={() => {
                setFilterVisible(false);
                setMenuVisible(true);
                setInfoVisible(false);
              }}
            >
              <img
                src={tabImg[tabIndex]}
                alt=""
                style={{ width: "20px", height: "16px" }}
              />
              {tabArray[tabIndex] +
                (memberHeaderIndex < 3
                  ? " / " + viewArray[memberHeaderIndex]
                  : "")}
              <DropMenu
                visible={menuVisible}
                dropStyle={{
                  width: "140px",
                  height: "350px",
                  top: "55px",
                  left: "0px",
                  color: "#333",
                  overflow: "visible",
                }}
                onClose={() => {
                  // setMenuVisible(false);
                }}
                title={"视图列表"}
              >
                {menu}
              </DropMenu>
            </div>
          </div>
          <React.Fragment>
            {memberHeaderIndex < 2 || memberHeaderIndex === 8 ? (
              <React.Fragment>
                <div
                  className="dropMenu-upBox"
                  onMouseEnter={() => {
                    setFilterVisible(true);
                    setMenuVisible(false);
                    setInfoVisible(false);
                  }}
                  onMouseLeave={() => {
                    setFilterVisible(false);
                  }}
                >
                  <div
                    className="workingTableHeader-tag"
                    onClick={() => {
                      setFilterVisible(true);
                      setMenuVisible(false);
                      setInfoVisible(false);
                    }}
                  >
                    <img
                      src={filterPng}
                      alt=""
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "5px",
                      }}
                    />
                    {/* deviceState === "xl" || deviceState === "xxl"
                      ?  */}
                    {filterObject?.filterType.length > 0
                      ? filterObject.filterType.join(" / ")
                      : null}
                    {/* : null */}
                    <DropMenu
                      visible={filterVisible}
                      dropStyle={{
                        width: "350px",
                        height: "530px",
                        top: "55px",
                        left: "0px",
                        color: "#333",
                        overflow: "visible",
                      }}
                      onClose={() => {
                        setFilterVisible(false);
                      }}
                      title={"筛选列表"}
                    >
                      {filterMenu}
                    </DropMenu>
                  </div>
                </div>
                {/* {deviceState === "xl" || deviceState === "xxl" ? ( */}
                <React.Fragment>
                  {filterObject?.creatorKey ? (
                    <div
                      className="workingTableHeader-smalltag"
                      onClick={() => {
                        setFilterVisible(true);
                      }}
                      onMouseEnter={() => {
                        setFilterVisible(true);
                        setMenuVisible(false);
                        setInfoVisible(false);
                      }}
                      onMouseLeave={() => {
                        setFilterVisible(false);
                      }}
                    >
                      <Avatar
                        avatar={filterObject?.creatorAvatar}
                        name={filterObject?.creatorName}
                        type={"person"}
                        index={0}
                        size={16}
                      />
                      {"创建人: " + filterObject.creatorName}
                      <CloseOutlined
                        onClick={(e: any) => {
                          e.stopPropagation();
                          deleteFilter("creatorKey");
                        }}
                        style={{ marginLeft: "6px" }}
                      />
                    </div>
                  ) : null}
                  {filterObject?.executorKey ? (
                    <div
                      className="workingTableHeader-smalltag"
                      onClick={() => {
                        setFilterVisible(true);
                      }}
                      onMouseEnter={() => {
                        setFilterVisible(true);
                        setMenuVisible(false);
                        setInfoVisible(false);
                      }}
                      onMouseLeave={() => {
                        setFilterVisible(false);
                      }}
                    >
                      <Avatar
                        avatar={filterObject?.executorAvatar}
                        name={filterObject?.executorName}
                        type={"person"}
                        index={0}
                        size={16}
                      />
                      {"执行人: " + filterObject.executorName}
                      <CloseOutlined
                        onClick={() => deleteFilter("executorKey")}
                        style={{ marginLeft: "6px" }}
                      />
                    </div>
                  ) : null}
                </React.Fragment>
                {/* ) : null} */}
                <div
                  style={{
                    // width: "24px",
                    height: "24px",
                    marginRight: "8px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setWorkVisible(true);
                  }}
                  onMouseEnter={() => {
                    setWorkVisible(true);
                  }}
                  onMouseLeave={() => {
                    setWorkVisible(false);
                  }}
                >
                  <img
                    src={lineMagicSvg}
                    alt=""
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "5px",
                    }}
                  />
                  {/* {workMenuRef.current[workType] ? (
                    <div className="workingTableHeader-smalltag">
                      {workMenuRef.current[workType]}
                    </div>
                  ) : null} */}
                  <DropMenu
                    visible={workVisible}
                    dropStyle={{
                      width: "250px",
                      height: "350px",
                      top: "24px",
                      left: "-24px",
                      color: "#333",
                      overflow: "hidden",
                    }}
                    onClose={() => {
                      setWorkVisible(false);
                    }}
                  >
                    {workMenu}
                  </DropMenu>
                </div>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        </div>

        {groupInfo && (memberHeaderIndex < 2 || memberHeaderIndex === 8) ? (
          //  ( deviceState === "xl" || deviceState === "xxl" ? (
          //   <LiquidChart
          //     percent={finishPercent}
          //     zoom={0.1}
          //     liquidId={"liquid" + groupInfo._key}
          //     fillColor={"#1890ff"}
          //   />
          // ) : (
          // <Progress
          //   percent={finishPercent * 100}
          //   type="circle"
          //   size="small"
          //   status="active"
          //   width={35}
          //   style={{ color: "#fff" }}
          // />
          <Tooltip title={"完成" + finishPercent * 100 + "%"}>
            <Progress
              percent={finishPercent * 100}
              type="circle"
              size="small"
              status="active"
              width={35}
              format={() => finishNumber}
              // style={{ zoom: 0.3, color: '#fff' }}
            />
          </Tooltip>
        ) : null}
      </div>
      <Modal
        visible={dismissVisible}
        onCancel={() => {
          setDismissVisible(false);
        }}
        onOk={() => {
          dismissGroup();
        }}
        title={"解散项目"}
      >
        是否解散该项目
      </Modal>
      <Modal
        visible={fileVisible}
        onCancel={() => {
          setFileVisible(false);
        }}
        onOk={() => {
          foldGroup();
        }}
        title={groupInfo?.isFile ? "还原项目" : "归档项目"}
      >
        是否{groupInfo?.isFile ? "还原" : "归档"}该项目
      </Modal>
      <Modal
        visible={groupSetVisible}
        onCancel={() => {
          setGroupSetVisible(false);
        }}
        width={850}
        centered={true}
        bodyStyle={{
          height: "85vh",
        }}
        destroyOnClose={true}
        onOk={() => {
          if (groupTabIndex === 0) {
            setGroup("close");
          } else if (groupTabIndex === 1) {
            saveGroupMember("close");
          }
        }}
      >
        <div className="groupSet-tab">
          <div
            onClick={() => {
              setGroupTabIndex(0);
              saveGroupMember();
            }}
            className="groupSet-tab-item"
            style={
              groupTabIndex === 0
                ? {
                    borderBottom: "2px solid #1890ff",
                    color: "#1890ff",
                  }
                : {}
            }
          >
            项目属性
          </div>
          <div
            onClick={() => {
              setGroupTabIndex(1);
              setGroup();
            }}
            className="groupSet-tab-item"
            style={
              groupTabIndex === 1
                ? {
                    borderBottom: "2px solid #1890ff",
                    color: "#1890ff",
                  }
                : {}
            }
          >
            成员
          </div>
        </div>
        {groupTabIndex === 0 ? (
          <GroupSet
            saveGroupSet={saveGroupSet}
            type={"设置"}
            groupInfo={groupInfo}
          />
        ) : null}
        {groupTabIndex === 1 ? (
          <GroupMember
            setMember={setMember}
            changeCount={(count: any) => {
              setJoinCount(count);
            }}
          />
        ) : null}
        {groupInfo && groupInfo.role !== 1 ? (
          <img
            src={logoutPng}
            alt=""
            className="contact-dialog-out"
            onClick={() => {
              setOutGroupVisible(true);
            }}
          />
        ) : null}
      </Modal>
      <Modal
        visible={outGroupVisible}
        onCancel={() => {
          setOutGroupVisible(false);
        }}
        onOk={() => {
          outGroup();
        }}
        title={"退出项目"}
      >
        是否退出该项目
      </Modal>
      <Modal
        visible={cloneGroupVisible}
        onCancel={() => {
          setCloneGroupVisible(false);
        }}
        onOk={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={"克隆项目"}
      >
        是否克隆项目:{groupInfo?.groupName}
      </Modal>
      <Modal
        visible={shareVisible}
        onCancel={() => {
          setShareVisible(false);
        }}
        onOk={() => {
          cloneGroup();
        }}
        footer={null}
        title={"分享项目"}
      >
        <div className="groupTable-share">
          <div className="groupTable-share-title">
            {user?.profile?.nickName} 邀请加入 {groupInfo?.groupName}：
            {`${window.location.protocol}//${window.location.host}/home/basic?inviteKey=${groupKey}`}
          </div>
          <Button
            type="primary"
            onClick={() => {
              shareGroup(
                `${user?.profile?.nickName} 邀请加入 ${groupInfo?.groupName} 网址：${window.location.protocol}//${window.location.host}/home/basic?inviteKey=${groupKey}`
              );
            }}
            style={{ color: "#fff", height: "40px" }}
          >
            复制链接
          </Button>
        </div>
        <div className="groupTable-code">
          <div style={{ width: "50%" }}>
            <Code
              url={`${window.location.protocol}//${window.location.host}/home/basic?inviteKey=${groupKey}`}
              id={groupKey}
            />
          </div>
          <div>扫码分享</div>
        </div>
      </Modal>
      <LogoModel
        visible={defaultPngVisible}
        changeVisible={setDefaultPngVisible}
        type={"设置"}
      />
    </React.Fragment>
  );
};
export default GroupTableHeader;
