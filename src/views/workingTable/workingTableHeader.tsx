import React, { useState, useEffect, useRef, useMemo } from "react";
import "./workingTableHeader.css";
import { Checkbox, Modal, Menu } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import _ from "lodash";
// import { useAuth } from "../../context/auth";

import {
  getWorkingTableTask,
  setFilterObject,
} from "../../redux/actions/taskActions";
import {
  setWorkHeaderIndex,
  getMember,
  getEnterpriseMember,
} from "../../redux/actions/memberActions";
import {
  setTheme,
  setThemeLocal,
  setClickType,
  getTargetUserInfo,
} from "../../redux/actions/authActions";
import {
  setCommonHeaderIndex,
  setMoveState,
  setMessage,
} from "../../redux/actions/commonActions";

import DropMenu from "../../components/common/dropMenu";
import HeaderFilter from "../../components/headerFilter/headerFilter";
import Contact from "../../views/contact/contact";
import Loading from "../../components/common/loading";
// import LiquidChart from "../../components/common/chart/liquidChart";

import infoPng from "../../assets/img/info.png";
import groupSet1Png from "../../assets/img/groupSet1.png";
import labelbSvg from "../../assets/svg/labelb.svg";
import groupbSvg from "../../assets/svg/groupb.svg";
import downArrowPng from "../../assets/img/downArrow.png";
import lineMagicSvg from "../../assets/svg/lineMagic.svg";
import gridTimebSvg from "../../assets/svg/gridTimeb.svg";
import tabb0Svg from "../../assets/svg/tab0.svg";
import tabb1Svg from "../../assets/svg/tab1.svg";
import tabb4Svg from "../../assets/svg/tab4.svg";
import tabb5Svg from "../../assets/svg/tab5.svg";
import tabb6Svg from "../../assets/svg/tab6.svg";
// import tabb7Svg from "../../assets/svg/biaoge-black.svg";
import tab0Svg from "../../assets/svg/tabw0.svg";
import tab1Svg from "../../assets/svg/tabw1.svg";
import tab4Svg from "../../assets/svg/tabw4.svg";
import tab5Svg from "../../assets/svg/tabw5.svg";
import tab6Svg from "../../assets/svg/tabw6.svg";
// import tab7Svg from "../../assets/svg/biaoge-white.svg";
import filterPng from "../../assets/img/filter.png";
import Avatar from "../../components/common/avatar";

const { SubMenu } = Menu;
interface WorkingTableHeaderProps {
  // setLoading: Function;
}

const WorkingTableHeader: React.FC<WorkingTableHeaderProps> = (prop) => {
  // const { deviceState } = useAuth();
  const workHeaderIndex = useTypedSelector(
    (state) => state.member.workHeaderIndex
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const clickType = useTypedSelector((state) => state.auth.clickType);
  const user = useTypedSelector((state) => state.auth.user);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );

  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const [deleteMemberVisible, setDeleteMemberVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState("7");
  const [workVisible, setWorkVisible] = useState(false);
  const [workType, setWorkType] = useState(10);
  const viewImgb: string[] = [labelbSvg, labelbSvg, groupbSvg, gridTimebSvg];
  const viewArray = ["分频道", "单行", "分项目", "日程规划"];
  const checkedTitleRef = useRef<any>([
    "过期",
    "今天",
    "未来",
    "未完成",
    "已完成",
    "已归档",
    "一般卡片",
  ]);
  const workMenuRef = useRef<any>([
    "执行",
    "过期 / 今天",
    "今天",
    "过期",
    "未来",
    "已完成",
    "指派",
    "未完成",
    "已完成",
    "已过期",
    "私有",
  ]);
  let tabArrayRef = useRef<any>([
    { name: "任务", id: 0 },
    { name: "超级树", id: 4 },
    { name: "日报", id: 5 },
    { name: "活力", id: 6 },
    { name: "日程", id: 7 },
  ]);
  let tabImgRef = useRef<any>([
    // tab7Svg,
    tab0Svg,
    tab5Svg,
    tab1Svg,
    tab4Svg,
    tab6Svg,
  ]);
  let tabbImgRef = useRef<any>([
    // tabb7Svg,
    tabb0Svg,
    tabb5Svg,
    tabb1Svg,
    tabb4Svg,
    tabb6Svg,
  ]);

  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setWorkHeaderIndex(headIndex));
  };
  useMemo(() => {
    if (workingTaskArray) {
      setLoading(false);
    }
  }, [workingTaskArray]);

  useEffect(() => {
    if (headerIndex === 2) {
      tabArrayRef.current = [
        { name: "任务", id: 0 },
        { name: "日报", id: 5 },
        { name: "活力", id: 6 },
        { name: "日程", id: 7 },
      ];
      tabImgRef.current = [tab0Svg, tab1Svg, tab4Svg, tab6Svg];
      tabbImgRef.current = [tabb0Svg, tabb1Svg, tabb4Svg, tabb6Svg];
      // dispatch(setWorkHeaderIndex(1));
      // setTabIndex(1);
    } else {
      if (headerIndex === 1 && clickType !== "self") {
        tabArrayRef.current = [
          { name: "任务", id: 0 },
          { name: "超级树", id: 4 },
          { name: "日报", id: 5 },
          { name: "活力", id: 6 },
          { name: "日程", id: 7 },
        ];
        // dispatch(setWorkHeaderIndex(0));
        // setTabIndex(0);
      }
      if (clickType === "self") {
        tabArrayRef.current = [{ name: "任务", id: 0 }];
        // dispatch(setWorkHeaderIndex(0));
        // chooseMemberHeader(0);
      }
      tabImgRef.current = [
        // tab7Svg,
        tab0Svg,
        tab5Svg,
        tab1Svg,
        tab4Svg,
        tab6Svg,
      ];
      tabbImgRef.current = [
        // tabb7Svg,
        tabb0Svg,
        tabb5Svg,
        tabb1Svg,
        tabb4Svg,
        tabb6Svg,
      ];
    }
    let index = _.findIndex(tabArrayRef.current, { id: workHeaderIndex });
    if (index !== -1) {
      setTabIndex(index);
    } else if (headerIndex === 2 && workHeaderIndex === 3) {
      setTabIndex(0);
    } else {
      setTabIndex(0);
      if (headerIndex === 2) {
        dispatch(setWorkHeaderIndex(1));
      }
    }
  }, [headerIndex, workHeaderIndex, clickType, dispatch]);
  useEffect(() => {
    dispatch(setFilterObject(theme.filterObject));
    let filterCheckedArray: any = [false, false, false, false, false, false];
    if (theme.filterObject.filterType.length > 0) {
      filterCheckedArray = checkedTitleRef.current.map((item: any) => {
        return theme.filterObject.filterType.indexOf(item) !== -1;
      });
    }
    setFileInput(theme.fileDay);
    setFilterCheckedArray(filterCheckedArray);
  }, [theme, dispatch]);

  const changeFilterCheck = async (filterTypeText: string) => {
    let filterType = filterObject.filterType;
    let filterIndex = filterType.indexOf(filterTypeText);
    if (filterIndex === -1) {
      filterType.push(filterTypeText);
    } else {
      filterType.splice(filterIndex, 1);
    }
    let newTheme = _.cloneDeep(theme);
    if (filterType.length > 0) {
      newTheme.filterObject.filterType = filterType;
    } else {
      newTheme.filterObject.filterType = ["过期", "今天"];
    }

    dispatch(setThemeLocal(newTheme));
    dispatch(setFilterObject({ filterType: filterType }));
    await api.auth.setWorkingConfigInfo(newTheme);
    setLoading(true);
    if (headerIndex === 1 && clickType !== "self") {
      dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 2));
    } else if (
      targetUserInfo &&
      targetUserInfo._key &&
      (headerIndex === 2 || clickType === "self")
    ) {
      dispatch(
        getWorkingTableTask(
          user._key === targetUserInfo._key ? 4 : 2,
          targetUserInfo._key,
          1,
          [0, 1, 2, 10],
          2
        )
      );
    }
  };
  const deleteFilter = (filterTypeText: string) => {
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
    let newTheme = _.cloneDeep(theme);
    newTheme.filterObject = newFilterObject;
    dispatch(setTheme(newTheme));
    dispatch(setFilterObject(newFilterObject));
  };
  const changeFileDay = (fileDay: number) => {
    let newTheme = _.cloneDeep(theme);
    if (isNaN(fileDay)) {
      dispatch(setMessage(true, "请输入数字", "warning"));
      setFileInput("7");
      setFileState(true);
      return;
    }
    newTheme.fileDay = fileDay;
    dispatch(setTheme(newTheme));
    // if (headerIndex === 1) {
    //   dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10]));
    // } else if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
    //   dispatch(
    //     getWorkingTableTask(
    //       userKey === targetUserInfo._key ? 4 : 2,
    //       targetUserInfo._key,
    //       1,
    //       [0, 1, 2, 10]
    //     )
    //   );
    // }
    setFileState(true);
  };
  const deleteMember = async () => {
    let memberRes: any = await api.group.deleteGroupMember(mainGroupKey, [
      targetUserInfo._key,
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "删除好友成功", "success"));
      dispatch(getMember(mainGroupKey, 1));
      dispatch(
        getEnterpriseMember(
          1,
          mainEnterpriseGroup.mainEnterpriseGroupKey,
          1,
          1000
        )
      );
      dispatch(setCommonHeaderIndex(1));
      setDeleteMemberVisible(false);
      if (!theme.moveState) {
        dispatch(setMoveState("out"));
      }
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const changeWorkType = async (type) => {
    let newTheme = _.cloneDeep(theme);
    setWorkType(type);
    dispatch(setFilterObject(newTheme.filterObject));
    let newFilterObject: any = _.cloneDeep(newTheme.filterObject);
    newFilterObject.creatorKey = "";
    newFilterObject.creatorAvatar = "";
    newFilterObject.creatorName = "";
    newFilterObject.executorKey = "";
    newFilterObject.executorAvatar = "";
    newFilterObject.executorName = "";
    let targetUser: any = headerIndex === 1 ? user : targetUserInfo;
    switch (type) {
      case 0:
        newTheme.filterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      case 1:
        newTheme.filterObject.filterType = ["过期", "今天"];
        newFilterObject.filterType = ["过期", "今天"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      case 2:
        newTheme.filterObject.filterType = ["今天"];
        newFilterObject.filterType = ["今天"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      case 3:
        newTheme.filterObject.filterType = ["过期"];
        newFilterObject.filterType = ["过期"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      case 4:
        newTheme.filterObject.filterType = ["未来"];
        newFilterObject.filterType = ["未来"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      // case 4:
      //   newTheme.filterObject.filterType = ["未来"];
      //   newFilterObject.filterType = ["未来"];
      //   newFilterObject.executorKey = user._key;
      //   newFilterObject.executorAvatar = user.profile.avatar;
      //   newFilterObject.executorName = user.profile.nickName;
      //   break;
      case 5:
        newTheme.filterObject.filterType = ["已完成"];
        newFilterObject.filterType = ["已完成"];
        newFilterObject.executorKey = targetUser._key;
        newFilterObject.executorAvatar = targetUser.profile.avatar;
        newFilterObject.executorName = targetUser.profile.nickName;
        break;
      case 6:
        newTheme.filterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.creatorKey = targetUser._key;
        newFilterObject.creatorAvatar = targetUser.profile.avatar;
        newFilterObject.creatorName = targetUser.profile.nickName;
        break;
      case 7:
        newTheme.filterObject.filterType = ["未完成"];
        newFilterObject.filterType = ["未完成"];
        newFilterObject.creatorKey = targetUser._key;
        newFilterObject.creatorAvatar = targetUser.profile.avatar;
        newFilterObject.creatorName = targetUser.profile.nickName;
        break;
      case 8:
        newTheme.filterObject.filterType = ["已完成"];
        newFilterObject.filterType = ["已完成"];
        newFilterObject.creatorKey = targetUser._key;
        newFilterObject.creatorAvatar = targetUser.profile.avatar;
        newFilterObject.creatorName = targetUser.profile.nickName;
        break;
      case 9:
        newTheme.filterObject.filterType = ["过期"];
        newFilterObject.filterType = ["过期"];
        newFilterObject.creatorKey = targetUser._key;
        newFilterObject.creatorAvatar = targetUser.profile.avatar;
        newFilterObject.creatorName = targetUser.profile.nickName;
        break;
    }
    dispatch(setFilterObject(newFilterObject));
    newTheme.filterObject = newFilterObject;
    dispatch(setThemeLocal(newTheme));
    dispatch(setTheme(newTheme));
    await api.auth.setWorkingConfigInfo(newTheme);
    // if (type !== 4) {
    if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
      setLoading(true);
      dispatch(
        getWorkingTableTask(
          userKey === targetUserInfo._key ? 4 : 2,
          targetUserInfo._key,
          1,
          [0, 1, 2, 10],
          2
        )
      );
    } else if (headerIndex === 1) {
      setLoading(true);
      dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 2));
      dispatch(setClickType("out"));
    }
    // } else {
    //   dispatch(setCommonHeaderIndex(2));
    //   dispatch(setClickType("self"));
    // }
  };
  const menu = (
    <React.Fragment>
      <Menu>
        {tabArrayRef.current.map((tabItem: any, index: number) => {
          return (
            <React.Fragment key={"tabTable" + index}>
              {index === 0 ? (
                <SubMenu
                  className="viewTableHeader-tab"
                  title={
                    <div
                      onClick={() => {
                        chooseMemberHeader(headerIndex === 1 ? 0 : 1);
                        setTabIndex(0);
                      }}
                    >
                      {tabItem.name}
                    </div>
                  }
                  icon={
                    <img
                      src={tabbImgRef.current[index]}
                      alt=""
                      className="viewTableHeader-tab-logo"
                      style={{ marginBottom: "3px" }}
                    />
                  }
                  // onClick={() => {
                  //   chooseMemberHeader(0);
                  //   setTabIndex(0);
                  // }}
                >
                  {viewArray.map((viewItem: any, viewIndex: number) => {
                    return (
                      <React.Fragment key={"viewTable" + viewIndex}>
                        {headerIndex === 1 ||
                        (headerIndex === 2 && viewIndex !== 0) ? (
                          <Menu.Item
                            className="viewTableHeader-tab"
                            onClick={(value) => {
                              value.domEvent.stopPropagation();
                              chooseMemberHeader(viewIndex);
                              setTabIndex(0);
                            }}
                          >
                            <img
                              src={viewImgb[viewIndex]}
                              alt=""
                              className="viewTableHeader-tab-logo"
                              style={
                                viewIndex === 1
                                  ? { transform: "rotate(270deg)" }
                                  : {}
                              }
                            />
                            <span style={{ marginLeft: "10px" }}>
                              {viewItem}
                            </span>
                          </Menu.Item>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </SubMenu>
              ) : (
                <Menu.Item
                  className="viewTableHeader-tab"
                  onClick={() => {
                    chooseMemberHeader(tabItem.id);
                    setTabIndex(index);
                  }}
                >
                  <img
                    src={tabbImgRef.current[index]}
                    alt=""
                    className="viewTableHeader-tab-logo"
                  />
                  <span style={{ marginLeft: "10px" }}>{tabItem.name}</span>
                </Menu.Item>
              )}
            </React.Fragment>
          );
        })}
      </Menu>
    </React.Fragment>
  );
  const filterMenu = (
    <React.Fragment>
      {loading ? <Loading /> : null}
      <HeaderFilter />
      <div className="filter-info">
        <div className="filter-title">状态 :</div>
        <div className="filter-menu">
          {checkedTitleRef.current.map((item: any, index: number) => {
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
  const setMenu = (
    <div className="workingTableHeader-info-container">
      <div
        className="workingTableHeader-info-item"
        onClick={() => {
          setDeleteMemberVisible(true);
        }}
      >
        <img
          src={groupSet1Png}
          alt=""
          style={{ width: "18px", height: "18px" }}
        />
        删除好友
      </div>
    </div>
  );
  const workMenu = (
    <React.Fragment>
      {workMenuRef.current.map((item, index) => {
        return (
          <React.Fragment key={"workMenu" + index}>
            {index !== 9 ? (
              <div
                className="home-item header-home-item"
                onClick={() => {
                  changeWorkType(index);
                }}
              >
                {headerIndex === 2 && (index === 0 || index === 6)
                  ? targetUserInfo && targetUserInfo.profile
                    ? targetUserInfo.profile.nickName + "的"
                    : ""
                  : ""}
                {item}
              </div>
            ) : headerIndex !== 2 ? (
              <div
                className="home-item  header-home-item"
                onClick={() => {
                  dispatch(setClickType("self"));
                  // dispatch(setCommonHeaderIndex(1));
                  dispatch(getTargetUserInfo(user._key));
                  setWorkType(index);
                  // dispatch(setWorkHeaderIndex(0));
                }}
                style={{ paddingRight: "15px" }}
              >
                私有
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
  return (
    <div className="workingTableHeader">
      <div className="workingTableHeader-name">
        <div className="workingTableHeader-logo">
          <Avatar
            name={
              headerIndex === 2
                ? targetUserInfo?.profile
                  ? targetUserInfo.profile.nickName
                  : ""
                : user?.profile
                ? user.profile.nickName
                : ""
            }
            avatar={
              headerIndex === 2
                ? targetUserInfo?.profile
                  ? targetUserInfo.profile.avatar
                  : ""
                : user?.profile
                ? user.profile.avatar
                : ""
            }
            type={"person"}
            index={0}
          />
        </div>
        <div
          className="dropMenu-upBox"
          onMouseEnter={() => {
            if (headerIndex === 2 && targetUserInfo?.profile) {
              setMemberVisible(true);
            }
          }}
          onMouseLeave={() => {
            setMemberVisible(false);
          }}
        >
          <div className="groupTableHeader-name-title">
            {headerIndex === 2
              ? targetUserInfo?.profile
                ? targetUserInfo.profile.nickName
                : ""
              : user?.profile
              ? user.profile.nickName
              : ""}
            {headerIndex === 2 && targetUserInfo?.profile ? (
              <img
                src={downArrowPng}
                alt=""
                className="groupTableHeader-name-title-logo"
              />
            ) : null}
            <DropMenu
              visible={memberVisible}
              dropStyle={{
                width: "300px",
                height: document.body.offsetHeight - 100,
                top: "55px",
                left: "-40px",
                color: "#333",
                overflow: "visible",
              }}
              onClose={() => {
                setMemberVisible(false);
              }}
              title={"队友列表"}
            >
              <Contact contactIndex={1} contactType={"header"} />
            </DropMenu>
          </div>
        </div>
      </div>
      {headerIndex === 2 &&
      targetUserInfo?.profile &&
      targetUserInfo?.isMyFriend ? (
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
            className="workingTableHeader-info"
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
                height: "120px",
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
      ) : null}
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
            className="workingTableHeader-tag"
            onClick={() => {
              setFilterVisible(false);
              setMenuVisible(true);
              setInfoVisible(false);
            }}
          >
            <img
              src={tabImgRef.current[tabIndex]}
              alt=""
              style={{ width: "15px" }}
            ></img>
            {tabArrayRef.current[tabIndex]?.name +
              (workHeaderIndex < 4 ? " / " + viewArray[workHeaderIndex] : "")}
            <DropMenu
              visible={menuVisible}
              dropStyle={{
                width: "140px",
                height: headerIndex === 2 ? "250px" : "350px",
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
        {workHeaderIndex < 4 ? (
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
                  style={{ width: "14px", height: "14px", marginRight: "5px" }}
                />
                {/* (deviceState === "xl" || deviceState === "xxl")
                  ? */}
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
              {filterObject?.groupKey ? (
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
                    avatar={filterObject?.groupLogo}
                    name={filterObject?.groupName}
                    type={"group"}
                    index={0}
                    size={16}
                  />
                  {filterObject?.groupName}
                  <CloseOutlined
                    onClick={() => deleteFilter("groupKey")}
                    style={{ marginLeft: "6px" }}
                  />
                </div>
              ) : null}
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
                    index={0}
                    type={"person"}
                    size={16}
                  />
                  {"创建人: " + filterObject.creatorName}
                  <CloseOutlined
                    onClick={() => deleteFilter("creatorKey")}
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
                    index={0}
                    type={"person"}
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
            <div
              className="dropMenu-upBox"
              onMouseEnter={() => {
                setWorkVisible(true);
              }}
              onMouseLeave={() => {
                setWorkVisible(false);
              }}
            >
              <div
                style={{
                  // width: "70px",
                  height: "24px",
                  marginRight: "8px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  setWorkVisible(true);
                }}
              >
                <img
                  src={lineMagicSvg}
                  alt=""
                  style={{ width: "19px", height: "19px", marginRight: "5px" }}
                />
                {workMenuRef.current[workType] && workType === 9 ? (
                  <div className="workingTableHeader-smalltag">
                    {workMenuRef.current[workType]}
                  </div>
                ) : null}
                <DropMenu
                  visible={workVisible}
                  dropStyle={{
                    width: "250px",
                    height: "433px",
                    top: "35px",
                    left: "0px",
                    color: "#333",
                    overflow: "hidden",
                  }}
                  onClose={() => {
                    setWorkVisible(false);
                  }}
                  title={"快选"}
                >
                  {workMenu}
                </DropMenu>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>

      {/* {headerIndex === 2 && targetUserInfo && workHeaderIndex < 4 ? (
        deviceState === "xl" || deviceState === "xxl" ? (
          <LiquidChart
            percent={
              !isNaN(
                parseFloat(
                  (
                    (targetUserInfo.allTaskNumber -
                      targetUserInfo.notFinishTaskNumber) /
                    targetUserInfo.allTaskNumber
                  ).toFixed(2)
                )
              )
                ? parseFloat(
                    (
                      (targetUserInfo.allTaskNumber -
                        targetUserInfo.notFinishTaskNumber) /
                      targetUserInfo.allTaskNumber
                    ).toFixed(2)
                  )
                : 0
            }
            zoom={0.1}
            liquidId={"liquid" + targetUserInfo._key}
            fillColor={"#1890ff"}
          />
        ) : (
          <Progress
            percent={
              !isNaN(
                parseFloat(
                  (
                    (targetUserInfo.allTaskNumber -
                      targetUserInfo.notFinishTaskNumber) /
                    targetUserInfo.allTaskNumber
                  ).toFixed(2)
                )
              )
                ? parseFloat(
                    (
                      (targetUserInfo.allTaskNumber -
                        targetUserInfo.notFinishTaskNumber) /
                      targetUserInfo.allTaskNumber
                    ).toFixed(2)
                  )
                : 0
            }
            type="circle"
            size="small"
            status="active"
            width={35}
            style={{ color: "#fff" }}
          />
        )
      ) : null} */}
      <Modal
        title={"删除好友"}
        visible={deleteMemberVisible}
        onCancel={() => {
          setDeleteMemberVisible(false);
        }}
        onOk={() => {
          deleteMember();
        }}
      >
        是否删除该好友
      </Modal>
    </div>
  );
};
export default WorkingTableHeader;
