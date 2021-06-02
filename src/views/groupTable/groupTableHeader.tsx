import React, { useState, useEffect, useRef, useMemo } from "react";
import "../workingTable/workingTableHeader.css";
import "./groupTableHeader.css";
import { Button, Tooltip, Checkbox, Dropdown, Modal, Menu } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _ from "lodash";
import copy from "copy-to-clipboard";
import api from "../../services/api";
import { useAuth } from "../../context/auth";

import { setHeaderIndex } from "../../redux/actions/memberActions";
import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
} from "../../redux/actions/commonActions";
import { setFilterObject, getGroupTask } from "../../redux/actions/taskActions";
import {
  changeGroupInfo,
  getGroup,
  setGroupKey,
  getGroupInfo,
} from "../../redux/actions/groupActions";
import { getGroupMember } from "../../redux/actions/memberActions";

import ClickOutSide from "../../components/common/clickOutside";
import DropMenu from "../../components/common/dropMenu";
import GroupSet from "../tabs/groupSet";
import GroupMember from "../tabs/groupMember";
import Loading from "../../components/common/loading";

import HeaderFilter from "../../components/headerFilter/headerFilter";
import Contact from "../../views/contact/contact";
import labelbSvg from "../../assets/svg/labelb.svg";
import gridTimebSvg from "../../assets/svg/gridTimeb.svg";
import gridPersonbSvg from "../../assets/svg/gridPersonb.svg";
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
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import downArrowPng from "../../assets/img/downArrow.png";
import logoutPng from "../../assets/img/logout.png";
import Code from "../../components/qrCode/qrCode";
import Avatar from "../../components/common/avatar";

const { SubMenu } = Menu;

const GroupTableHeader: React.FC = (prop) => {
  const { deviceState } = useAuth();
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
  const dispatch = useDispatch();
  const viewArray: string[] = ["分频道看板", "时间计划表", "任务分配表"];

  const viewImgb: string[] = [labelbSvg, gridTimebSvg, gridPersonbSvg];
  const tabImg: string[] = [
    tab0Svg,
    tab5Svg,
    tab1Svg,
    tab2Svg,
    tab4Svg,
    tab6Svg,
  ];
  const tabbImg: string[] = [
    tabb0Svg,
    tabb5Svg,
    tabb1Svg,
    tabb2Svg,
    tabb4Svg,
    tabb6Svg,
  ];
  const checkedTitle = ["过期", "今天", "未来", "已完成", "已归档"];
  const tabArray = ["任务", "超级树", "日报", "排行榜", "活力", "日程"];
  const [filterVisible, setFilterVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [groupSetVisible, setGroupSetVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [joinCount, setJoinCount] = useState(0);
  const [dismissVisible, setDismissVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
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
  ]);
  const [outGroupVisible, setOutGroupVisible] = useState(false);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState("7");
  const [infoChangeState, setInfoChangeState] = useState(false);
  const groupTableRef: React.RefObject<any> = useRef();
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
    if (groupInfo && infoChangeState) {
      dispatch(getGroup(3));
      setInfoChangeState(false);
      // dispatch(setMessage(true, '修改项目属性成功', 'success'));
    }
  }, [groupInfo, dispatch, infoChangeState]);

  useEffect(() => {
    let index = memberHeaderIndex < 3 ? 0 : memberHeaderIndex - 2;
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
      const checkedTitle = ["过期", "今天", "未来", "已完成", "已归档"];
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
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    setLoading(true);
    dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    dispatch(setFilterObject({ filterType: newFilterObject.filterType }));
  };
  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
  };
  const setGroup = async () => {
    if (groupObj) {
      if (groupRole === 1) {
        setInfoChangeState(true);
        dispatch(changeGroupInfo(groupKey, groupObj));
        dispatch(getGroup(3));
      } else {
        dispatch(setMessage(false, "权限不够,无法修改项目属性", "success"));
      }
    }
  };
  const setMember = (groupMember: any) => {
    setGroupMember(groupMember);
  };
  const saveGroupMember = async () => {
    if (groupMember.length > 0) {
      let newGroupMember: any = [];
      groupMember.forEach((groupMemberItem: any) => {
        newGroupMember.push({
          userKey: groupMemberItem.userId,
          nickName: groupMemberItem.nickName,
          avatar: groupMemberItem.avatar,
          gender: groupMemberItem.gender,
          role: groupMemberItem.role,
        });
        // }
      });
      let addRes: any = await api.group.addGroupMember(
        groupKey,
        newGroupMember
      );
      if (addRes.msg === "OK") {
        dispatch(getGroupMember(groupKey));
        // dispatch(setMessage(true, '修改项目成员成功', 'success'));
      } else {
        dispatch(setMessage(true, addRes.msg, "error"));
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
      dispatch(setMessage(true, "解散项目成功", "success"));
      dispatch(getGroup(3));
      dispatch(setCommonHeaderIndex(1));
      if (!theme.moveState) {
        dispatch(setMoveState("out"));
      }
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
    if (!fileDay) {
      fileDay = 7;
    }
    newFilterObject.fileDay = fileDay;
    let res: any = await api.member.setConfig(
      groupMemberItem._key,
      newFilterObject
    );
    if (res.msg === "OK") {
      setFileState(true);
      dispatch(setFilterObject(newFilterObject));
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      groupInfo._key,
      groupInfo.groupName + "_副本"
    );
    if (cloneRes.msg === "OK") {
      dispatch(setMessage(true, "克隆项目成功", "success"));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      if (!theme.moveState) {
        dispatch(setMoveState("in"));
      }
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3));
    } else {
      dispatch(setMessage(true, cloneRes.msg, "error"));
    }
  };
  const menu = (
    <div className="dropDown-box" style={{ padding: "5px" }}>
      <Menu>
        {tabArray.map((tabItem: any, index: number) => {
          return (
            <React.Fragment key={"tabTable" + index}>
              {index === 0 ? (
                <SubMenu
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
                    />
                  }
                >
                  {viewArray.map((viewItem: any, viewIndex: number) => {
                    return (
                      <Menu.Item
                        key={"viewTable" + viewIndex}
                        className="viewTableHeader-tab"
                        onClick={() => {
                          chooseMemberHeader(viewIndex);
                          setTabIndex(0);
                        }}
                      >
                        <img
                          src={viewImgb[viewIndex]}
                          alt=""
                          className="viewTableHeader-tab-logo"
                        />
                        {viewItem}
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              ) : (
                <Menu.Item
                  className="viewTableHeader-tab"
                  onClick={() => {
                    chooseMemberHeader(index + 2);
                    setTabIndex(index);
                  }}
                >
                  <img
                    src={tabbImg[index]}
                    alt=""
                    className="viewTableHeader-tab-logo"
                  />
                  {tabItem}
                </Menu.Item>
              )}
            </React.Fragment>
          );
        })}
      </Menu>
    </div>
  );
  const setMenu = (
    <div className="dropDown-box">
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
      </div>
    </div>
  );
  const filterMenu = (
    <ClickOutSide
      onClickOutside={() => {
        setFilterVisible(false);
      }}
    >
      <div className="dropDown-box">
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
                            type="number"
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
      </div>
    </ClickOutSide>
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
          onClick={() => {
            setGroupVisible(true);
          }}
        >
          <div className="groupTableHeader-logo">
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
              width: "300px",
              height: document.body.offsetHeight - 80,
              top: "55px",
              left: "0px",
              color: "#333",
              overflow: "visible",
            }}
            onClose={() => {
              setGroupVisible(false);
            }}
            title={"群列表"}
          >
            <Contact contactIndex={0} contactType={"header"} />
          </DropMenu>
        </div>

        <div className="groupTableHeader-info">
          <Tooltip
            title="项目属性"
            getPopupContainer={() => groupTableRef.current}
          >
            <Dropdown
              overlay={setMenu}
              trigger={["click"]}
              getPopupContainer={() => groupTableRef.current}
            >
              <img
                src={infoPng}
                alt=""
                style={{ width: "18px", height: "18px" }}
                onClick={() => {
                  setFilterVisible(false);
                }}
              />
            </Dropdown>
          </Tooltip>
        </div>

        <div className="view-container">
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            getPopupContainer={() => groupTableRef.current}
          >
            <div
              // style={{ width: '85px' }}
              className="workingTableHeader-tag"
              onMouseEnter={() => {
                setFilterVisible(false);
              }}
              onClick={() => {
                setFilterVisible(false);
              }}
            >
              <img
                src={tabImg[tabIndex]}
                alt=""
                style={{ width: "20px", height: "16px" }}
              />
              {tabArray[tabIndex]}
            </div>
          </Dropdown>

          <React.Fragment>
            {memberHeaderIndex < 2 ? (
              <React.Fragment>
                <Dropdown
                  overlay={filterMenu}
                  onVisibleChange={() => {
                    setFilterVisible(true);
                  }}
                  visible={filterVisible}
                  overlayStyle={{ width: "350px" }}
                  trigger={["click"]}
                  getPopupContainer={() => groupTableRef.current}
                >
                  <div
                    className="workingTableHeader-tag"
                    onClick={() => {
                      setFilterVisible(true);
                    }}
                    onMouseEnter={() => {
                      setFilterVisible(true);
                    }}
                  >
                    <img
                      src={filterPng}
                      alt=""
                      style={{ width: "16px", height: "16px" }}
                    />
                    {deviceState === "xl" || deviceState === "xxl"
                      ? filterObject?.filterType.length > 0
                        ? filterObject.filterType.join(" / ")
                        : null
                      : null}
                  </div>
                </Dropdown>
                {deviceState === "xl" || deviceState === "xxl" ? (
                  <React.Fragment>
                    {filterObject?.creatorKey ? (
                      <div
                        className="workingTableHeader-smalltag"
                        onClick={() => {
                          setFilterVisible(true);
                        }}
                      >
                        <img
                          src={
                            filterObject.creatorAvatar
                              ? filterObject.creatorAvatar +
                                "?imageMogr2/auto-orient/thumbnail/80x"
                              : defaultPersonPng
                          }
                          alt=""
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                          }}
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
                      >
                        <img
                          src={
                            filterObject.executorAvatar
                              ? filterObject.executorAvatar +
                                "?imageMogr2/auto-orient/thumbnail/80x"
                              : defaultPersonPng
                          }
                          alt=""
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                          }}
                        />
                        {"执行人: " + filterObject.executorName}
                        <CloseOutlined
                          onClick={() => deleteFilter("executorKey")}
                          style={{ marginLeft: "6px" }}
                        />
                      </div>
                    ) : null}
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : null}
          </React.Fragment>
        </div>
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
        visible={groupSetVisible}
        onCancel={() => {
          setGroupSetVisible(false);
        }}
        width={750}
        centered={true}
        onOk={() => {
          if (groupTabIndex === 0) {
            setGroup();
          } else if (groupTabIndex === 1) {
            saveGroupMember();
          }
          setGroupSetVisible(false);
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
        <img
          src={logoutPng}
          alt=""
          className="contact-dialog-out"
          onClick={() => {
            setOutGroupVisible(true);
          }}
        />
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
            {`${window.location.protocol}//${window.location.host}/home/basic?groupKey=${groupKey}`}
          </div>
          <Button
            type="primary"
            onClick={() => {
              shareGroup(
                `${user?.profile?.nickName} 邀请加入 ${groupInfo?.groupName} 网址：${window.location.protocol}//${window.location.host}/home/basic?groupKey=${groupKey}`
              );
            }}
            style={{ color: "#fff", height: "40px" }}
          >
            复制链接
          </Button>
        </div>
        <div className="groupTable-code">
          <Code
            url={`${window.location.protocol}//${window.location.host}/home/basic?groupKey=${groupKey}`}
            id={groupKey}
          />
          扫码分享
        </div>
      </Modal>
    </React.Fragment>
  );
};
export default GroupTableHeader;
