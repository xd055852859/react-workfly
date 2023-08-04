import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "../../redux/reducer/RootState";
import "./home.css";
import _ from "lodash";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { Tooltip, Button, Progress, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";
// import { useAuth } from "../../context/auth";

import {
  setCommonHeaderIndex,
  setMessage,
  setCreateMemberState,
  changeAnimateState,
  setMoveState,
} from "../../redux/actions/commonActions";
import {
  changeMainenterpriseGroup,
  // getTargetUserInfo,
  setClickType,
  setThemeLocal,
  setTheme,
  changeEnterpriseGroupState,
} from "../../redux/actions/authActions";
import {
  setHeaderIndex,
  getCompanyItem,
  setWorkHeaderIndex,
} from "../../redux/actions/memberActions";

import {
  setGroupKey,
  getGroup,
  changeStartId,
} from "../../redux/actions/groupActions";
import {
  getWorkingTableTask,
  setFilterObject,
} from "../../redux/actions/taskActions";

import Tabs from "../tabs/tabs";
// import LiquidChart from "../../components/common/chart/liquidChart";

import companyTab2Svg from "../../assets/svg/companyTab2.svg";
import logoSvg from "../../assets/svg/logo.svg";
import okrSvg from "../../assets/svg/okr.svg";
import tablePng from "../../assets/img/table.png";
import calendarPng from "../../assets/img/calendarHome.png";
import companyIcon from "../../assets/svg/companyIcon.svg";
import smallFireSvg from "../../assets/svg/smallFire.svg";
// import tabb5Svg from "../../assets/svg/tab5.svg";
import otherGroupSvg from "../../assets/svg/otherGroup.svg";
import allGroupSvg from "../../assets/svg/allGroup.svg";
import Avatar from "../../components/common/avatar";
import DropMenu from "../../components/common/dropMenu";
// import work1Svg from "../../assets/svg/work1.svg";
// import work2Svg from "../../assets/svg/work2.svg";
// import work3Svg from "../../assets/svg/work3.svg";
// import work4Svg from "../../assets/svg/work4.svg";
// import work5Svg from "../../assets/svg/work5.svg";
// import work6Svg from "../../assets/svg/work6.svg";
// import work7Svg from "../../assets/svg/work7.svg";
// import work8Svg from "../../assets/svg/work8.svg";
import createGroupSvg from "../../assets/svg/createGroup.svg";
import wendangSvg from "../../assets/svg/wendang.svg";
import huoliSvg from "../../assets/svg/huoli.svg";

import Loading from "../../components/common/loading";
import Dialog from "../../components/common/dialog";
import GroupConfig from "../tabs/groupConfig";
import GroupSet from "../tabs/groupSet";

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const history = useHistory();
  // const { deviceState } = useAuth();
  const dispatch = useDispatch();
  const finishPos = useTypedSelector((state) => state.auth.finishPos);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const enterpriseGroupState = useTypedSelector(
    (state) => state.auth.enterpriseGroupState
  );
  const allTask = useTypedSelector((state) => state.auth.allTask);
  const allNumber = useTypedSelector((state) => state.auth.allNumber);
  const startId = useTypedSelector((state) => state.group.startId);

  const [companyGroupList, setCompanyGroupList] = useState<any>([]);
  const [nodeList, setNodeList] = useState<any>([]);
  const [menuVisible, setMenuVisible] = useState<any>(false);
  const [nodeVisible, setNodeVisible] = useState<any>(false);

  const [fireVisible, setFireVisible] = useState<any>(false);
  const [addVisible, setAddVisible] = useState<any>(false);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [addCompanyVisible, setAddCompanyVisible] = React.useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<any>(null);
  const childCreateRef = useRef<any>();
  // const workImgRef = useRef<any>([
  //   work1Svg,
  //   work2Svg,
  //   work3Svg,
  //   work4Svg,
  //   work5Svg,
  //   work6Svg,
  //   work7Svg,
  //   work8Svg,
  // ]);
  const getCompanyGroupList = useCallback(async () => {
    let newCompanyGroupList: any = [];
    let res: any = await api.group.getUserEnterpriseGroupList();
    if (res.msg === "OK") {
      res.result.forEach((item: any) => {
        // if (mainEnterpriseGroup.mainEnterpriseGroupKey === item._key) {
        //   newCompanyGroupList.unshift(item);
        // } else {
        newCompanyGroupList.push(item);
        // }
      });
      newCompanyGroupList.push({
        _key: "",
        groupLogo: allGroupSvg,
        groupName: "全部项目",
        isRight: 0,
      });
      newCompanyGroupList.push({
        _key: "freedom",
        groupLogo: otherGroupSvg,
        groupName: "自由项目",
        isRight: 0,
      });
      setCompanyGroupList(newCompanyGroupList);
      // if (
      //   mainEnterpriseGroup.mainEnterpriseGroupKey &&
      //   localStorage.getItem("mainEnterpriseGroupKey") !== "out"
      // ) {
      //   dispatch(getCompanyItem(mainEnterpriseGroup.mainEnterpriseGroupKey));
      // }
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
    //eslint-disable-next-line
  }, [dispatch]);
  const getNodeList = useCallback(async () => {
    let nodeRes: any = await api.task.getGroupCardVisitTimeList();
    if (nodeRes.msg === "OK") {
      setNodeList(nodeRes.result);
    } else {
      dispatch(setMessage(true, nodeRes.msg, "error"));
    }
  }, [dispatch]);
  useEffect(() => {
    if (startId) {
      getNodeList();
    }
  }, [getNodeList, startId]);
  useEffect(() => {
    if (user) {
      getNodeList();
    }
  }, [user, getNodeList]);

  useEffect(() => {
    if (
      mainEnterpriseGroup &&
      !mainEnterpriseGroup.mainEnterpriseGroupKey &&
      companyGroupList.length > 2
    ) {
      dispatch(
        changeMainenterpriseGroup(
          companyGroupList[0]._key,
          companyGroupList[0].groupLogo,
          companyGroupList[0].groupName,
          companyGroupList[0].isRight
        )
      );
      localStorage.setItem("mainEnterpriseGroupKey", companyGroupList[0]._key);
      dispatch(getCompanyItem(companyGroupList[0]._key));
    }
    //eslint-disable-next-line
  }, [companyGroupList]);
  useEffect(() => {
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey) {
      dispatch(getCompanyItem(mainEnterpriseGroup.mainEnterpriseGroupKey));
      localStorage.setItem(
        "mainEnterpriseGroupKey",
        mainEnterpriseGroup.mainEnterpriseGroupKey
      );
    }
  }, [dispatch, mainEnterpriseGroup.mainEnterpriseGroupKey]);
  useEffect(() => {
    if (user && enterpriseGroupState) {
      getCompanyGroupList();
      dispatch(changeEnterpriseGroupState(false));
    }
    //eslint-disable-next-line
  }, [user, enterpriseGroupState]);
  useEffect(() => {
    if (finishPos.length > 0) {
      setFireVisible(false);
      fileRef.current = setTimeout(() => {
        setFireVisible(true);
        clearTimeout(fileRef.current);
      }, 2000);
    }
    //eslint-disable-next-line
  }, [finishPos]);
  const changeMainEnterpriseKey = async (
    groupKey: string,
    groupName: string,
    mainGroupItem?: any
  ) => {
    let newCompanyGroupList: any = _.cloneDeep(companyGroupList);
    if (groupKey && groupKey !== "freedom") {
      let res: any = await api.group.setMainEnterpriseGroup(groupKey);
      if (res.msg === "OK") {
        // setCompanyGroupList(res.result);
        let groupIndex: number = 0;
        let groupItem: any = "";
        if (mainGroupItem) {
          groupItem = { ...mainGroupItem };
        } else {
          groupIndex = _.findIndex(newCompanyGroupList, { _key: groupKey });
          groupItem = _.cloneDeep(newCompanyGroupList[groupIndex]);
          newCompanyGroupList.splice(groupIndex, 1);
        }
        newCompanyGroupList.unshift(groupItem);
        setCompanyGroupList(newCompanyGroupList);
        dispatch(
          changeMainenterpriseGroup(
            groupItem._key,
            groupItem.groupLogo,
            groupItem.groupName,
            groupItem.isRight
          )
        );

        localStorage.setItem("mainEnterpriseGroupKey", groupItem._key);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    } else {
      localStorage.setItem("mainEnterpriseGroupKey", groupKey);
      dispatch(changeMainenterpriseGroup("", "", groupName, 0));
    }
  };
  // const toTargetUser = () => {
  //   dispatch(setClickType("self"));
  //   dispatch(setCommonHeaderIndex(1));
  //   dispatch(getTargetUserInfo(user._key));

  //   // dispatch(getWorkingTableTask(4, user._key, 1, [0, 1, 2, 10], 1));
  //   // dispatch(getWorkingTableTask(4, user._key, 1, [0, 1, 2, 10], 2));
  // };
  const toTargetNode = (cardKey, groupKey) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    dispatch(setHeaderIndex(3));
    dispatch(changeStartId(cardKey));
  };
  const changeWorkType = async (type) => {
    dispatch(setWorkHeaderIndex(1));
    let newTheme = _.cloneDeep(theme);
    dispatch(setFilterObject(newTheme.filterObject));
    let newFilterObject: any = _.cloneDeep(newTheme.filterObject);
    newFilterObject.creatorKey = "";
    newFilterObject.creatorAvatar = "";
    newFilterObject.creatorName = "";
    newFilterObject.executorKey = "";
    newFilterObject.executorAvatar = "";
    newFilterObject.executorName = "";
    switch (type) {
      case 1:
        newTheme.filterObject.filterType = ["过期", "今天"];
        newFilterObject.filterType = ["过期", "今天"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 2:
        newTheme.filterObject.filterType = ["未来"];
        newFilterObject.filterType = ["未来"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 3:
        newTheme.filterObject.filterType = ["已完成"];
        newFilterObject.filterType = ["已完成"];
        newFilterObject.executorKey = user._key;
        newFilterObject.executorAvatar = user.profile.avatar;
        newFilterObject.executorName = user.profile.nickName;
        break;
      case 4:
        newTheme.filterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.filterType = ["过期", "今天", "未来", "已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 5:
        newTheme.filterObject.filterType = ["已完成"];
        newFilterObject.filterType = ["已完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 6:
        newTheme.filterObject.filterType = ["未完成"];
        newFilterObject.filterType = ["未完成"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
      case 7:
        newTheme.filterObject.filterType = ["过期"];
        newFilterObject.filterType = ["过期"];
        newFilterObject.creatorKey = user._key;
        newFilterObject.creatorAvatar = user.profile.avatar;
        newFilterObject.creatorName = user.profile.nickName;
        break;
    }
    dispatch(setFilterObject(newFilterObject));
    newTheme.filterObject = newFilterObject;
    dispatch(setThemeLocal(newTheme));
    dispatch(setTheme(newTheme));
    await api.auth.setWorkingConfigInfo(newTheme);
    // if (type !== 4) {
    dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10], 2));
    dispatch(setCommonHeaderIndex(1));
    dispatch(setClickType("out"));
    // } else {
    //   dispatch(setCommonHeaderIndex(2));
    //   dispatch(setClickType("self"));
    // }
  };
  const saveGroupSet = (obj: any, type?: string) => {
    // if (!isNaN(templateKey)) {
    //   obj.templateKey = templateKey;
    //   obj.isContainTask = taskCheck;
    // }

    setGroupObj((prevGroupObj) => {
      if (!prevGroupObj) {
        prevGroupObj = {};
      }
      for (let key in obj) {
        if (type || (!type && key !== "groupName" && key !== "groupLogo")) {
          prevGroupObj[key] = obj[key];
        }
      }
      return { ...prevGroupObj };
    });
  };
  const addGroup = async () => {
    let newGroupObj = _.cloneDeep(groupObj);
    let obj = {
      enterprise: 2,
      groupDesc: "",
      modelUrl: "",
      isOpen: false,
      joinType: "1",
      password: "",
      question: "",
      isHasPassword: false,
      isLinkJoin: false,
      defaultPower: 4,
    };
    for (let key in obj) {
      if (newGroupObj[key] === undefined || newGroupObj[key] === null) {
        newGroupObj[key] = obj[key];
      }
    }
    if (
      newGroupObj.isHasPassword &&
      (!newGroupObj.question || !newGroupObj.password)
    ) {
      dispatch(setMessage(true, "口令加入必须包含口令问题和口令", "error"));
      return;
    }
    if (!newGroupObj.groupName || !newGroupObj.groupName.trim()) {
      dispatch(setMessage(true, "请输入企业名", "error"));
      return;
    }
    setLoading(true);
    let groupRes: any = await api.group.addGroup(newGroupObj);
    if (groupRes.msg === "OK") {
      setLoading(false);
      dispatch(setMessage(true, "创建企业成功", "success"));
      dispatch(setGroupKey(groupRes.result._key));
      groupRes.result.isRight = 1;
      // dispatch(getGroupInfo(groupRes.result._key));
      dispatch(setCommonHeaderIndex(3));
      dispatch(getGroup(3));
      changeMainEnterpriseKey(
        groupRes.result._key,
        groupRes.result.groupName,
        groupRes.result
      );
      dispatch(changeAnimateState(true));
      setAddVisible(false);
      dispatch(setCreateMemberState(true));
    } else {
      setLoading(false);
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const nodeMenu = (
    <React.Fragment>
      {nodeList.length > 0
        ? nodeList.map((nodeItem: any, nodeIndex: number) => {
            return (
              <div
                key={"node" + nodeIndex}
                className="home-work-item"
                onClick={(e) => {
                  e.stopPropagation();
                  toTargetNode(nodeItem.cardKey, nodeItem.groupKey);
                }}
              >
                <div className="home-item-logo">
                  <Avatar
                    avatar={nodeItem?.groupInfo?.groupLogo}
                    name={nodeItem?.groupInfo?.groupName}
                    type={"group"}
                    index={nodeIndex}
                  />
                </div>
                <div className="home-item-name toLong">
                  {nodeItem?.groupInfo?.groupName} · {nodeItem?.cardInfo?.name}
                </div>
              </div>
            );
          })
        : null}
    </React.Fragment>
  );
  const enterpriseGroupMenu = (
    <React.Fragment>
      {companyGroupList.length > 0
        ? companyGroupList.map((groupItem: any, groupIndex: number) => {
            return (
              <div
                key={"home" + groupIndex}
                onClick={() => {
                  changeMainEnterpriseKey(groupItem._key, groupItem.groupName);
                }}
                className="home-item"
                style={{ paddingLeft: "5px" }}
              >
                <div className="home-item-logo">
                  <Avatar
                    avatar={groupItem?.groupLogo}
                    name={groupItem?.groupName}
                    type={"group"}
                    index={groupIndex}
                  />
                </div>
                <div className="home-item-name toLong">
                  {groupItem?.groupName}
                </div>
              </div>
            );
          })
        : null}
      <div
        onClick={() => {
          setAddCompanyVisible(true);
        }}
        className="home-item"
        style={{ paddingLeft: "5px" }}
      >
        <div className="home-item-logo">
          <img src={createGroupSvg} alt="" />
        </div>
        <div className="home-item-name toLong">创建企业</div>
      </div>
    </React.Fragment>
  );
  // const workMenu = (
  //   <React.Fragment>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(1);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[0]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我执行的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(2);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[1]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我计划的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(3);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[2]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我完成的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(4);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[3]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我指派的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(5);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[4]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我指派且完成的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(6);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[5]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我指派未完成的
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={() => {
  //         changeWorkType(7);
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[6]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我指派已过期
  //     </div>
  //     <div
  //       className="home-work-item"
  //       onClick={(e) => {
  //         dispatch(setWorkHeaderIndex(1));
  //         e.stopPropagation();
  //         toTargetUser();
  //       }}
  //     >
  //       <img
  //         src={workImgRef.current[7]}
  //         alt=""
  //         style={{ marginRight: "5px" }}
  //       />
  //       我私有的
  //     </div>
  //   </React.Fragment>
  // );

  return (
    <div className="home" ref={homeRef} id="home">
      <div
        className="home-bg1"
        style={{
          background: "rgba(0,0,0," + theme.grayPencent + ")",
        }}
      ></div>
      {!theme.randomVisible ? (
        <div
          className="home-bg2"
          style={
            theme.backgroundImg
              ? {
                  backgroundImage: "url(" + theme.backgroundImg + ")",
                }
              : { backgroundColor: theme.backgroundColor }
          }
        ></div>
      ) : null}
      <div className="home-b"></div>
      {/* <HomeCanvas /> */}
      <div className="home-header">
        <div className="home-header-logo">
          <img src={logoSvg} alt="" />
        </div>
        <div
          className="home-header-item"
          style={
            headerIndex === 0 ? { background: "rgba(255, 255, 255, 0.34)" } : {}
          }
          onClick={() => {
            dispatch(setCommonHeaderIndex(0));
          }}
          // onMouseEnter={() => {
          //   setNodeVisible(true);
          // }}
          // onMouseLeave={() => {
          //   setNodeVisible(false);
          // }}
        >
          <img src={huoliSvg} alt="" className="home-header-item-logo" />
          <div>活力看板</div>
          <div
            className="home-header-icon"
            style={{ marginRight: "2px" }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCommonHeaderIndex(1));
              dispatch(setWorkHeaderIndex(6));
            }}
          >
            <img
              src={companyTab2Svg}
              alt=""
              style={{ width: "40px", height: "40px" }}
            />
            <div className="home-header-icon-text">
              {!isNaN(allNumber[1])
                ? allNumber[1] < 100
                  ? parseFloat(allNumber[1].toFixed(1))
                  : parseInt(allNumber[1].toFixed(0))
                : 0}
            </div>
            {fireVisible ? (
              <React.Fragment>
                <div className="smallFire smallFire1">
                  <img src={smallFireSvg} alt="" />
                </div>
                <div className="smallFire smallFire2">
                  <img src={smallFireSvg} alt="" />
                </div>
                <div className="smallFire smallFire3">
                  <img src={smallFireSvg} alt="" />
                </div>
              </React.Fragment>
            ) : null}
          </div>
        </div>
        <div
          style={
            headerIndex === 1 ? { background: "rgba(255, 255, 255, 0.34)" } : {}
          }
          className="home-header-item"
          onClick={() => {
            if (headerIndex !== 1) {
              dispatch(setCommonHeaderIndex(1));
              dispatch(setClickType("out"));
            }
          }}
          onMouseEnter={() => {
            setNodeVisible(true);
          }}
          onMouseLeave={() => {
            setNodeVisible(false);
          }}
        >
          <img src={tablePng} alt="" className="home-header-item-logo" />
          <div style={{ flexShrink: 0, width: "200px" }}>我的工作</div>
          <Tooltip
            title={
              (allTask[0] > 0
                ? parseInt(((allTask[0] - allTask[1]) / allTask[0]) * 100 + "")
                : 0) + "%"
            }
          >
            <div
              className="home-header-icon"
              onClick={() => {
                changeWorkType(5);
              }}
              style={{ marginRight: "5px" }}
            >
              <Progress
                percent={
                  allTask[0] > 0
                    ? parseFloat(
                        ((allTask[0] - allTask[1]) / allTask[0]).toFixed(2)
                      ) * 100
                    : 0
                }
                type="circle"
                size="small"
                status="active"
                width={35}
                style={{ color: "#fff" }}
                format={() => allTask[1]}
              />
            </div>
          </Tooltip>
          {/* <DropMenu
            visible={workVisible}
            dropStyle={{
              width: "350px",
              height: "310px",
              top: "70px",
              left: homeRef.current ? homeRef.current.offsetWidth : 0,
              color: "#333",
              overflow: "auto",
              position: "fixed",
              zIndex: 5,
              borderRadius: "0px",
            }}
            onClose={() => {
              setWorkVisible(false);
            }}
            closeType={1}
          >
            {workMenu}
          </DropMenu> */}
          <DropMenu
            visible={nodeVisible}
            dropStyle={{
              width: "350px",
              maxHeight: homeRef.current
                ? homeRef.current.offsetHeight - 70
                : 0,
              top: "116px",
              left: homeRef.current ? homeRef.current.offsetWidth : 0,
              color: "#333",
              overflow: "auto",
              position: "fixed",
              zIndex: 5,
              borderRadius: "0px",
            }}
            onClose={() => {
              setNodeVisible(false);
            }}
            closeType={1}
            title={"最近访问超级树路径"}
          >
            {nodeMenu}
          </DropMenu>
        </div>
        {theme && theme.calendarVisible ? (
          <div
            style={
              headerIndex === 8
                ? { background: "rgba(255, 255, 255, 0.34)" }
                : {}
            }
            className="home-header-item"
            onClick={() => {
              dispatch(setCommonHeaderIndex(8));
              dispatch(setMoveState("in"));
              // dispatch(changeColorState(true));
              // setTimeout(() => {
              //   dispatch(changeColorState(false));
              // }, 1000);
            }}
          >
            <img src={okrSvg} alt="" className="home-header-item-logo" />
            OKR目标管理
          </div>
        ) : null}
        {/* <div
          style={
            headerIndex === 7 ? { background: "rgba(255, 255, 255, 0.34)" } : {}
          }
          className="home-header-item"
          onClick={() => {
            dispatch(setCommonHeaderIndex(7));
            // dispatch(changeColorState(true));
            // setTimeout(() => {
            //   dispatch(changeColorState(false));
            // }, 1000);
          }}
        >
          <img src={wendangSvg} alt="" className="home-header-item-logo" />
          我的文档
        </div> */}
        <div
          style={
            headerIndex === 5 ? { background: "rgba(255, 255, 255, 0.34)" } : {}
          }
          className="home-header-item"
          onClick={() => {
            dispatch(setCommonHeaderIndex(5));
          }}
        >
          <img src={calendarPng} alt="" className="home-header-item-logo" />
          我的日程
        </div>

        {/* ) : null} */}

        <div
          style={
            headerIndex === 6 ? { background: "rgba(255, 255, 255, 0.34)" } : {}
          }
          className="home-header-item home-space"
          onClick={() => dispatch(setCommonHeaderIndex(6))}
          onMouseEnter={() => {
            setMenuVisible(true);
          }}
          onMouseLeave={() => {
            setMenuVisible(false);
          }}
        >
          <div className="home-header-item-left">
            <img src={companyIcon} alt="" className="home-header-item-logo" />
            {mainEnterpriseGroup?.mainEnterpriseGroupName ? (
              <React.Fragment>
                {mainEnterpriseGroup.mainEnterpriseGroupKey ? (
                  <div className="home-header-item-groupLogo">
                    {mainEnterpriseGroup.mainEnterpriseGroupLogo.indexOf(
                      "https"
                    ) !== -1 ? (
                      <img
                        src={mainEnterpriseGroup.mainEnterpriseGroupLogo}
                        alt=""
                      />
                    ) : (
                      <div style={{ fontSize: "20px" }}>
                        {mainEnterpriseGroup.mainEnterpriseGroupLogo}
                      </div>
                    )}
                  </div>
                ) : null}
                <div className="home-header-item-groupName toLong">
                  {mainEnterpriseGroup.mainEnterpriseGroupName}
                </div>
              </React.Fragment>
            ) : null}
            {companyGroupList[
              _.findIndex(companyGroupList, {
                _key: mainEnterpriseGroup.mainEnterpriseGroupKey,
              })
            ]?.isRight &&
            companyGroupList[
              _.findIndex(companyGroupList, {
                _key: mainEnterpriseGroup.mainEnterpriseGroupKey,
              })
            ]?.frozenStatus !== 1 ? (
              <div className="home-header-icon">
                <Button
                  size="large"
                  shape="circle"
                  style={{ border: "0px", color: "#fff" }}
                  ghost
                  icon={<SettingOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      setGroupKey(mainEnterpriseGroup.mainEnterpriseGroupKey)
                    );
                    history.push("/home/company");
                    localStorage.setItem(
                      "companyKey",
                      mainEnterpriseGroup.mainEnterpriseGroupKey
                    );
                    // window.open('https://cheerchat.qingtime.cn');
                  }}
                />
              </div>
            ) : null}
            <DropMenu
              visible={menuVisible}
              dropStyle={{
                width: "350px",
                maxHeight: homeRef.current
                  ? homeRef.current.offsetHeight - 215
                  : 0,
                top: "296px",
                left: homeRef.current ? homeRef.current.offsetWidth : 0,
                color: "#333",
                overflow: "auto",
                position: "fixed",
                zIndex: 5,
                borderRadius: "0px",
              }}
              onClose={() => {
                setMenuVisible(false);
              }}
              closeType={1}
            >
              {enterpriseGroupMenu}
            </DropMenu>
          </div>
          {/* <DownOutlined style={{ color: '#1890ff' }} /> */}
        </div>

        {/* <DropMenu
            visible={companyVisible}
            dropStyle={{
              width: '100%',
              maxHeight: '500px',
              top: '40px',
              left: '0px',
              color: '#333',
              overflow: 'auto',
            }}
            onClose={() => {
              setCompanyVisible(false);
            }}
          >
          
          </DropMenu> */}
      </div>
      <Tabs />
      <Modal
        visible={addVisible}
        onCancel={() => {
          setAddVisible(false);
        }}
        onOk={() => {
          addGroup();
          // onClose();
        }}
        width={750}
        centered={true}
        title={"项目属性"}
        bodyStyle={{
          height: "80vh",
        }}
        destroyOnClose={true}
      >
        <GroupSet saveGroupSet={saveGroupSet} type={"企业"} />
      </Modal>
      <Modal
        visible={addCompanyVisible}
        onCancel={() => {
          setAddCompanyVisible(false);
          // onClose();
        }}
        onOk={() => {
          if (childCreateRef?.current) {
            //@ts-ignore
            childCreateRef.current.changeCompanyConfig();
            setAddVisible(true);
            setAddCompanyVisible(false);
          }
        }}
        title={"企业属性"}
        width={750}
        centered={true}
        bodyStyle={{ height: "80vh" }}
      >
        <GroupConfig
          type={"创建"}
          ref={childCreateRef}
          saveGroupSet={saveGroupSet}
        />
      </Modal>
    </div>
  );
};
export default Home;
