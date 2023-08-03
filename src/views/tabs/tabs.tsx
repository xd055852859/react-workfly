import React, { useState, useEffect, useRef } from "react";
import "./tabs.css";
import { useDispatch } from "react-redux";
import { Input, Modal, Select, Button } from "antd";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import _ from "lodash";
import api from "../../services/api";

import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import {
  getTargetUserInfo,
  // userKeyToGroupKey
} from "../../redux/actions/authActions";
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from "../../redux/actions/groupActions";

import {
  getMember,
  getEnterpriseMember,
} from "../../redux/actions/memberActions";

import Contact from "../contact/contact";
import GroupCreate from "./groupCreate";
import Loading from "../../components/common/loading";
import Avatar from "../../components/common/avatar";
import Invite from "../invite/invite";

import uncarePng from "../../assets/img/uncare.png";
import searchPng from "../../assets/img/search.png";
import addPng from "../../assets/img/contact-add.png";
import downArrowbPng from "../../assets/img/downArrowb.png";
import DropMenu from "../../components/common/dropMenu";
import MemberBoard from "../board/memberBoard";

const { Option } = Select;
const { Search } = Input;
export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  const dispatch = useDispatch();
  // const classes = useStyles();
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const enterpriseMemberArray = useTypedSelector(
    (state) => state.member.enterpriseMemberArray
  );
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [contactIndex, setContactIndex] = React.useState(0);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [searchAllVisible, setSearchAllVisible] = React.useState(false);
  const [searchInputVisible, setSearchInputVisible] = React.useState(false);

  const [searchList, setSearchList] = React.useState<any>([]);
  const [mainSearchList, setMainSearchList] = React.useState<any>([]);
  const [searchInput, setSearchInput] = React.useState("");

  const [searchIndex, setSearchIndex] = React.useState(0);
  const [searchGroupKey, setSearchGroupKey] = React.useState<any>("");

  const [inviteVisible, setInviteVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const [loading, setLoading] = useState(false);
  const [boardVisible, setBoardVisible] = useState(false);
  const tabsRef: React.RefObject<any> = useRef();
  const searchRef: React.RefObject<any> = useRef();

  const limit = 30;
  useEffect(() => {
    if (searchInput === "") {
      setSearchList([]);
      setSearchVisible(false);
    }
  }, [searchInput, contactIndex]);
  useEffect(() => {
    setPage(1);
    setBoardVisible(false);
  }, [contactIndex]);

  useEffect(() => {
    if (mainEnterpriseGroup) {
      setContactIndex(0);
    }
  }, [mainEnterpriseGroup]);
  const changeInput = (e: any) => {
    setSearchInput(e.target.value);
    searchMsg(e.target.value);
  };

  const searchMsg = (input?: string) => {
    let newMainSearchList = [];
    let msgInput = input ? input : searchInput;
    if (msgInput !== "") {
      if (contactIndex === 1) {
        newMainSearchList = memberArray.filter(
          (memberItem: any, memberIndex: number) => {
            return (
              memberItem.nickName &&
              memberItem.nickName
                .toUpperCase()
                .indexOf(msgInput.toUpperCase()) !== -1
            );
          }
        );
      } else if (contactIndex === 0) {
        newMainSearchList = groupArray.filter(
          (groupItem: any, groupIndex: number) => {
            return (
              groupItem.groupName &&
              groupItem.groupName
                .toUpperCase()
                .indexOf(msgInput.toUpperCase()) !== -1 &&
              groupItem._key !== mainGroupKey
            );
          }
        );
      } else if (contactIndex === 7) {
        newMainSearchList = enterpriseMemberArray.filter(
          (memberItem: any, memberIndex: number) => {
            return (
              memberItem.nickName &&
              memberItem.nickName
                .toUpperCase()
                .indexOf(msgInput.toUpperCase()) !== -1
            );
          }
        );
      }
      setMainSearchList(newMainSearchList);
      setSearchVisible(true);
      setSearchAllVisible(false);
      // if (searchAllVisible) {
      //   contactIndex ? getSearchPerson(1) : getSearchGroup(1);
      // }
    } else {
      dispatch(setMessage(true, "请输入搜索内容", "error"));
      return;
    }
  };
  const getSearchEnterprise = async (page: number) => {
    let newSearchList: any = [];
    if (page === 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    setLoading(true);
    let res: any = await api.company.getCompanyList(
      1,
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      page,
      limit,
      searchInput
    );
    if (res.msg === "OK") {
      res.result.forEach((searchItem: any) => {
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
      setLoading(false);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
      setLoading(false);
    }
  };
  const getSearchGroup = async (page: number) => {
    let newSearchList: any = [];
    if (page === 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    let res: any = await api.member.searchGroupNew(searchInput, page, limit);
    if (res.msg === "OK") {
      res.result.forEach((searchItem: any) => {
        searchItem.avatar = searchItem.logo;
        searchItem.nickName = searchItem.groupName;
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getSearchPerson = async (page: number) => {
    let newSearchList: any = [];
    if (page === 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    setLoading(true);
    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg === "OK") {
      res.result.forEach((searchItem: any) => {
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
      setLoading(false);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
      setLoading(false);
    }
  };
  const addMember = async (searchItem: any, searchIndex: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.addGroupMember(mainGroupKey, [
      {
        userKey: searchItem.userId,
        nickName: searchItem.nickName,
        avatar: searchItem.avatar,
        gender: 0,
        role: 5,
      },
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "添加好友成功", "success"));
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      dispatch(getMember(mainGroupKey, 1));
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const joinGroup = async (groupKey: string, searchIndex: number) => {
    setInviteVisible(true);
    setSearchGroupKey(groupKey);
    setSearchIndex(searchIndex);
  };
  const scrollSearchLoading = (e: any) => {
    let newPage = page;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (clientHeight + scrollTop >= scrollHeight && searchList.length < total) {
      newPage = newPage + 1;
      setPage(newPage);
      contactIndex
        ? contactIndex === 1
          ? getSearchPerson(newPage)
          : getSearchEnterprise(newPage)
        : getSearchGroup(newPage);
    }
  };
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    // if (!theme.moveState) {
    //   dispatch(setMoveState("in"));
    // }
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3));
    setSearchInputVisible(false);
  };
  const toTargetUser = async (targetUserKey: string) => {
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    // if (!theme.moveState) {
    //   dispatch(setMoveState("in"));
    // }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    dispatch(getMember(mainGroupKey, 1));
    setSearchInputVisible(false);
  };
  const addEnterpriseGroupMember = async (
    searchItem: any,
    searchIndex: number
  ) => {
    const newMainSearchList = _.cloneDeep(mainSearchList);
    let memberRes: any = await api.group.addGroupMember(mainGroupKey, [
      {
        userKey: searchItem.userId,
        nickName: searchItem.nickName,
        avatar: searchItem.avatar,
        gender: 0,
        role: 5,
      },
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "添加好友成功", "success"));
      newMainSearchList[searchIndex].isFriend = true;
      setMainSearchList(newMainSearchList);
      dispatch(
        getEnterpriseMember(
          1,
          mainEnterpriseGroup.mainEnterpriseGroupKey,
          1,
          1000
        )
      );
      dispatch(getMember(mainGroupKey, 1));
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const searchContainer = (
    <div className="search-container">
      {mainSearchList.map((mainSearchItem: any, mainSearchIndex: number) => {
        let avatar =
          contactIndex === 0 ? mainSearchItem.groupLogo : mainSearchItem.avatar;
        let name =
          contactIndex === 0
            ? mainSearchItem.groupName
            : mainSearchItem.nickName;
        let key =
          contactIndex === 0 ? mainSearchItem._key : mainSearchItem.userId;
        return (
          <div
            className="personMember-item"
            key={"mainSearch" + mainSearchIndex}
            onClick={() => {
              contactIndex ? toTargetUser(key) : toTargetGroup(key);
            }}
          >
            <div className="personMember-item-title">
              <div
                className="personMember-item-avatar"
                style={{ borderRadius: contactIndex ? "50%" : "5px" }}
              >
                <Avatar
                  name={name}
                  avatar={avatar}
                  type={contactIndex ? "person" : "group"}
                  index={mainSearchIndex}
                />
              </div>
              <div className="personMember-item-name">{name}</div>
            </div>
            {!mainSearchItem.isFriend && contactIndex === 7 ? (
              <Button
                type="primary"
                ghost
                style={{
                  height: "27px",
                  padding: "0px 5px",
                }}
                className="contact-uncare-button"
                onClick={(e) => {
                  e.stopPropagation();
                  addEnterpriseGroupMember(mainSearchItem, mainSearchIndex);
                }}
              >
                + 好友
              </Button>
            ) : null}
          </div>
        );
      })}
      {mainSearchList.length > 0 ? (
        <hr
          style={{
            background: "#F0F0F0",
            margin: "5px 0px",
          }}
        />
      ) : null}
      {!searchAllVisible && contactIndex !== 7 ? (
        <div
          className="search-all-icon"
          onClick={() => {
            setSearchAllVisible(true);
            contactIndex
              ? contactIndex === 1
                ? getSearchPerson(page)
                : getSearchEnterprise(page)
              : getSearchGroup(page);
          }}
          style={{ cursor: "pointer" }}
        >
          全平台搜索
          <img
            src={downArrowbPng}
            alt=""
            style={{ width: "11px", height: "7px", marginRight: "5px" }}
          />
        </div>
      ) : (
        <div className="personMember">
          <div
            className="personMember-container"
            onScroll={scrollSearchLoading}
          >
            {loading ? (
              <Loading loadingWidth="50px" loadingHeight="50px" />
            ) : null}
            {searchList.map((searchItem: any, searchIndex: number) => {
              let name = contactIndex
                ? searchItem.nickName
                : searchItem.groupName;
              let avatar = contactIndex
                ? searchItem.avatar
                : searchItem.groupLogo;
              let key = contactIndex ? searchItem.userId : searchItem._key;
              return (
                <React.Fragment key={"search" + searchIndex}>
                  {(contactIndex === 1 && !searchItem.isMyMainGroupMember) ||
                  (contactIndex === 0 && !searchItem.isGroupMember) ? (
                    <div className="personMember-item">
                      <div className="personMember-item-title">
                        <div
                          className="personMember-item-avatar"
                          style={{ borderRadius: contactIndex ? "50%" : "5px" }}
                        >
                          <Avatar
                            name={name}
                            avatar={avatar}
                            type={contactIndex ? "person" : "group"}
                            index={searchIndex}
                          />
                        </div>
                        <div className="personMember-item-name">{name}</div>
                      </div>
                      {contactIndex ? (
                        <div
                          className="personMember-item-button"
                          onClick={
                            () => {
                              addMember(searchItem, searchIndex);
                            }
                            // addMember(item)
                          }
                        >
                          <div>+ 好友</div>
                        </div>
                      ) : (
                        <div
                          className="personMember-item-button"
                          onClick={
                            () => {
                              joinGroup(key, searchIndex);
                            }
                            // addMember(item)
                          }
                        >
                          <div>加入项目</div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const searchMenu = (
    // <ClickOutSide
    //   onClickOutside={() => {
    //     setSearchInputVisible(false);
    //     setSearchInput("");
    //   }}
    // >
    <div ref={searchRef}>
      <Select
        value={contactIndex}
        style={{ width: 90 }}
        onChange={(value) => {
          setSearchInputVisible(true);
          setSearchInput("");
          setContactIndex(value);
        }}
        getPopupContainer={() => searchRef.current}
      >
        <Option value={0}>项目</Option>
        <Option value={1}>队友</Option>
        <Option value={7}>通讯录</Option>
      </Select>
      <Search
        className="search-input"
        placeholder={contactIndex === 0 ? "输入项目关键字…" : "输入用户名…"}
        onChange={changeInput}
        value={searchInput}
        onSearch={() => {
          if (searchInput !== "") {
            searchMsg();
            setSearchVisible(true);
          }
        }}
        bordered={false}
      />
      {searchVisible ? searchContainer : null}
    </div>
    // </ClickOutSide>
  );
  return (
    <div
      className="tabs"
      ref={tabsRef}
      style={{
        height:
          // theme && theme.calendarVisible
          //   ?
          "calc(100% - 300px)",
        // : "calc(100% - 210px)",
      }}
      id="tab"
    >
      <div className="tabs-tab-nav">
        <div
          onClick={() => {
            setContactIndex(0);
            setSearchList([]);
          }}
          style={
            contactIndex === 0
              ? { background: "rgba(255, 255, 255, 0.34)" }
              : {}
          }
          className="tabs-tab-nav-item"
        >
          项目
        </div>
        {mainEnterpriseGroup?.mainEnterpriseGroupKey &&
        localStorage.getItem("mainEnterpriseGroupKey") !== "freedom" ? (
          <div
            onClick={() => {
              setContactIndex(4);
            }}
            style={
              contactIndex === 4
                ? { background: "rgba(255, 255, 255, 0.34)" }
                : {}
            }
            className="tabs-tab-nav-item"
          >
            项目树
          </div>
        ) : null}
        <div
          onClick={() => {
            setContactIndex(1);
          }}
          style={
            contactIndex === 1
              ? { background: "rgba(255, 255, 255, 0.34)" }
              : {}
          }
          className="tabs-tab-nav-item"
        >
          队友
        </div>
        {mainEnterpriseGroup?.mainEnterpriseGroupKey &&
        localStorage.getItem("mainEnterpriseGroupKey") !== "freedom" ? (
          <div
            onClick={() => {
              setContactIndex(3);
            }}
            style={
              contactIndex === 3
                ? { background: "rgba(255, 255, 255, 0.34)" }
                : {}
            }
            className="tabs-tab-nav-item"
          >
            组织树
          </div>
        ) : null}
        {mainEnterpriseGroup?.mainEnterpriseGroupKey &&
        localStorage.getItem("mainEnterpriseGroupKey") !== "freedom" ? (
          <div
            onClick={() => {
              setContactIndex(7);
            }}
            style={
              contactIndex === 7
                ? { background: "rgba(255, 255, 255, 0.34)" }
                : {}
            }
            className="tabs-tab-nav-item"
          >
            通讯录
          </div>
        ) : null}
        {/* <div
          onClick={() => {
            setContactIndex(6);
          }}
          style={
            contactIndex === 6
              ? { background: "rgba(255, 255, 255, 0.34)" }
              : {}
          }
          className="tabs-tab-nav-item"
        >
          文档
        </div> */}
        {contactIndex === 0 || contactIndex === 1 || contactIndex === 7 ? (
          <React.Fragment>
            <img
              src={searchPng}
              alt=""
              className="search-icon"
              onClick={() => {
                setSearchInput("");
                setSearchInputVisible(true);
              }}
            />
            <DropMenu
              visible={searchInputVisible}
              dropStyle={{
                width: "320px",
                minHeight: "150px",
                top: "40px",
                left: "0px",
                color: "#333",
                overflow: "auto",
                borderRadius: "0px",
                padding: "10px",
                boxSizing: "border-box",
              }}
              onClose={() => {
                setSearchInputVisible(false);
              }}
            >
              {searchMenu}
            </DropMenu>
          </React.Fragment>
        ) : null}

        {contactIndex === 0 ? <GroupCreate addPng={addPng}/> : null}
        <Modal
          title="加入项目"
          visible={inviteVisible}
          footer={null}
          onCancel={() => {
            setInviteVisible(false);
          }}
        >
          <Invite
            searchList={searchList}
            searchIndex={searchIndex}
            setSearchList={setSearchList}
            groupKey={searchGroupKey}
            onClose={setInviteVisible}
          />
        </Modal>
      </div>
      {contactIndex === 5 ? (
        <div
          className="tabs-file"
          onClick={() => {
            setContactIndex(0);
          }}
        >
          <div>
            <LeftOutlined />
            返回
          </div>
        </div>
      ) : null}
      <Contact contactIndex={contactIndex} />
      {contactIndex === 0 || contactIndex === 1 ? (
        <div
          className="tabs-file"
          onClick={() => {
            // setContactIndex(5);
            setBoardVisible(true);
          }}
        >
          <div>
            <img
              style={{ width: "17px", height: "15px", margin: "0px 5px" }}
              src={uncarePng}
              alt=""
            />
            关注{contactIndex === 0 ? "项目" : "队友"}今日看板
          </div>
          <RightOutlined />
        </div>
      ) : null}
      <DropMenu
        visible={boardVisible}
        dropStyle={{
          width: "100vw",
          height: "100vh)",
          top: "0px",
          bottom: "0px",
          left: tabsRef.current ? tabsRef.current.offsetWidth : 0,
          color: "#333",
          overflow: "auto",
          position: "fixed",
          zIndex: 20,
          borderRadius: "0px",
        }}
        onClose={() => {
          setBoardVisible(false);
        }}
      >
        <MemberBoard boardIndex={contactIndex ? 0 : 1} />
      </DropMenu>
    </div>
  );
};
export default HomeTab;
