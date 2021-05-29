import React, { useState, useEffect, useRef, useMemo } from "react";
import "./workingTableHeader.css";
import { Checkbox, Modal, Tooltip, Dropdown, Menu } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import _ from "lodash";
import { useAuth } from "../../context/auth";

import {
  getWorkingTableTask,
  setFilterObject,
} from "../../redux/actions/taskActions";
import { setHeaderIndex, getMember } from "../../redux/actions/memberActions";
import { setTheme, setThemeLocal } from "../../redux/actions/authActions";
import {
  setCommonHeaderIndex,
  setMoveState,
  setMessage,
} from "../../redux/actions/commonActions";

import DropMenu from "../../components/common/dropMenu";
import ClickOutSide from "../../components/common/clickOutside";
import HeaderFilter from "../../components/headerFilter/headerFilter";
import Contact from "../../views/contact/contact";
import Loading from "../../components/common/loading";

import infoPng from "../../assets/img/info.png";
import groupSet1Png from "../../assets/img/groupSet1.png";
import labelbSvg from "../../assets/svg/labelb.svg";
import groupbSvg from "../../assets/svg/groupb.svg";
import downArrowPng from "../../assets/img/downArrow.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import defaultPersonPng from "../../assets/img/defaultPerson.png";

import tabb0Svg from "../../assets/svg/tab0.svg";
import tabb1Svg from "../../assets/svg/tab1.svg";
import tabb4Svg from "../../assets/svg/tab4.svg";
import tabb5Svg from "../../assets/svg/tab5.svg";
import tabb6Svg from "../../assets/svg/tab6.svg";
import tab0Svg from "../../assets/svg/tabw0.svg";
import tab1Svg from "../../assets/svg/tabw1.svg";
import tab4Svg from "../../assets/svg/tabw4.svg";
import tab5Svg from "../../assets/svg/tabw5.svg";
import tab6Svg from "../../assets/svg/tabw6.svg";
import filterPng from "../../assets/img/filter.png";

const { SubMenu } = Menu;
interface WorkingTableHeaderProps {
  // setLoading: Function;
}

const WorkingTableHeader: React.FC<WorkingTableHeaderProps> = (prop) => {
  const { deviceState } = useAuth();
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const clickType = useTypedSelector((state) => state.auth.clickType);
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const [deleteMemberVisible, setDeleteMemberVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState("7");
  const [tabArray, setTabArray] = useState<any>([
    "任务",
    "日报",
    "活力",
    "日程",
    "超级树",
  ]);
  const viewImgb: string[] = [labelbSvg, groupbSvg];
  const tabImg: string[] = [tab0Svg, tab1Svg, tab4Svg, tab6Svg, tab5Svg];
  const tabbImg: string[] = [tabb0Svg, tabb1Svg, tabb4Svg, tabb6Svg, tabb5Svg];
  const viewArray = ["分频道", "分项目"];
  const checkedTitleRef = useRef<any>();
  checkedTitleRef.current = ["过期", "今天", "未来", "已完成", "已归档"];

  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
  };
  useMemo(() => {
    if (workingTaskArray) {
      setLoading(false);
    }
  }, [workingTaskArray]);
  useEffect(() => {
    setTabArray(
      headerIndex === 1
        ? ["任务", "日报", "活力", "日程", "超级树"]
        : clickType === "self"
        ? ["任务"]
        : ["任务", "日报", "活力"]
    );
    setTabIndex(headerIndex === 2 && clickType !== "self" ? 1 : 0);
  }, [headerIndex, clickType]);
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
    let fikterIndex = filterType.indexOf(filterTypeText);
    if (fikterIndex === -1) {
      filterType.push(filterTypeText);
    } else {
      filterType.splice(fikterIndex, 1);
    }
    let newTheme = _.cloneDeep(theme);
    newTheme.filterObject.filterType = filterType;
    dispatch(setThemeLocal(newTheme));
    dispatch(setFilterObject({ filterType: filterType }));
    await api.auth.setWorkingConfigInfo(newTheme);
    setLoading(true);
    if (headerIndex === 1) {
      dispatch(
        getWorkingTableTask(
          1,
          user._key,
          1,
          [0, 1, 2, 10],
          theme.fileDay ? theme.fileDay : 7
        )
      );
    } else if (headerIndex === 2) {
      dispatch(
        getWorkingTableTask(
          user._key === targetUserInfo._key ? 4 : 2,
          targetUserInfo._key,
          1,
          [0, 1, 2, 10],
          theme.fileDay ? theme.fileDay : 7
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
    newTheme.fileDay = fileDay;
    dispatch(setTheme(newTheme));
    setFileState(true);
  };
  const deleteMember = async () => {
    let memberRes: any = await api.group.deleteGroupMember(mainGroupKey, [
      targetUserInfo._key,
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "删除好友成功", "success"));
      dispatch(getMember(mainGroupKey));
      dispatch(setCommonHeaderIndex(1));
      setDeleteMemberVisible(false);
      if (!theme.moveState) {
        dispatch(setMoveState("out"));
      }
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
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
                  // onClick={() => {
                  //   chooseMemberHeader(0);
                  //   setTabIndex(0);
                  // }}
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
                    chooseMemberHeader(index + 1);
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
  const setMenu = (
    <div className="dropDown-box">
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
    </div>
  );
  return (
    <div className="workingTableHeader">
      {headerIndex === 2 ? (
        <React.Fragment>
          <div className="workingTableHeader-name">
            <div
              className="workingTableHeader-logo"
              style={{ borderRadius: "50%" }}
            >
              <img
                src={
                  targetUserInfo && targetUserInfo.profile.avatar
                    ? targetUserInfo.profile.avatar +
                      "?imageMogr2/auto-orient/thumbnail/80x"
                    : defaultPersonPng
                }
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  marginRight: "0px",
                }}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = defaultPersonPng;
                }}
              />
            </div>

            <div
              className="groupTableHeader-name-title"
              onClick={() => {
                setMemberVisible(true);
              }}
            >
              {targetUserInfo && targetUserInfo.profile.nickName}
              <img
                src={downArrowPng}
                alt=""
                className="groupTableHeader-name-title-logo"
              />
              <DropMenu
                visible={memberVisible}
                dropStyle={{
                  width: "250px",
                  height: document.body.offsetHeight - 80,
                  top: "40px",
                  left: "0px",
                  color: "#333",
                  overflow: "visible",
                }}
                onClose={() => {
                  setMemberVisible(false);
                }}
                title={"联系人列表"}
              >
                <Contact contactIndex={1} contactType={"header"} />
              </DropMenu>
            </div>
          </div>

          <Tooltip title="好友设置">
            <Dropdown overlay={setMenu} trigger={["click"]}>
              <div className="workingTableHeader-info">
                <img
                  src={infoPng}
                  alt=""
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
            </Dropdown>
          </Tooltip>
        </React.Fragment>
      ) : null}
      <div className="view-container">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div
            className="workingTableHeader-tag"
            onMouseEnter={() => {
              setFilterVisible(false);
            }}
            onClick={() => {
              setFilterVisible(false);
            }}
          >
            <img src={tabImg[tabIndex]} alt=""></img>
            {tabArray[tabIndex]}
          </div>
        </Dropdown>
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
            >
              <div className="workingTableHeader-tag">
                <img
                  src={filterPng}
                  alt=""
                  style={{ width: "16px", height: "16px" }}
                />
                {deviceState === "xl"||deviceState === "xxl"
                  ? filterObject?.filterType.length > 0
                    ? filterObject.filterType.join(" / ")
                    : null
                  : null}
              </div>
            </Dropdown>
            {deviceState === "xl"||deviceState === "xxl" ? (
              <React.Fragment>
                {filterObject?.groupKey ? (
                  <div
                    className="workingTableHeader-smalltag"
                    onClick={() => {
                      setFilterVisible(true);
                    }}
                  >
                    <img
                      src={
                        filterObject.groupLogo
                          ? filterObject.groupLogo
                          : defaultGroupPng
                      }
                      alt=""
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "5px",
                      }}
                    />
                    {filterObject.groupName}
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
      </div>
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
