import React, { useState, useEffect, useRef } from "react";
import "./tabs.css";
import { useDispatch } from "react-redux";
import { Button, Input, Dropdown, Modal } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import _ from "lodash";
import api from "../../services/api";

import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
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
import { getMember } from "../../redux/actions/memberActions";

import ClickOutSide from "../../components/common/clickOutside";
import Contact from "../contact/contact";
import GroupCreate from "./groupCreate";
import Loading from "../../components/common/loading";
import Avatar from "../../components/common/avatar";

import searchPng from "../../assets/img/search.png";
import addPng from "../../assets/img/contact-add.png";
import downArrowbPng from "../../assets/img/downArrowb.png";

const { Search } = Input;
export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  const dispatch = useDispatch();
  // const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const [contactIndex, setContactIndex] = React.useState(0);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [searchAllVisible, setSearchAllVisible] = React.useState(false);
  const [searchInputVisible, setSearchInputVisible] = React.useState(false);

  const [addGroupVisible, setAddGroupVisible] = React.useState(false);
  const [searchList, setSearchList] = React.useState<any>([]);
  const [mainSearchList, setMainSearchList] = React.useState<any>([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [joinType, setJoinType] = React.useState(1);
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [searchItem, setSearchItem] = React.useState<any>(null);
  const [isHasPassword, setIsHasPassword] = React.useState(false);
  const [inviteVisible, setInviteVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = useState(false);

  const tabsRef: React.RefObject<any> = useRef();
  const limit = 30;
  useEffect(() => {
    if (searchInput === "") {
      setSearchList([]);
      setSearchVisible(false);
    }
  }, [searchInput, contactIndex]);

  const changeInput = (e: any) => {
    setSearchInput(e.target.value);
    searchMsg(e.target.value);
  };
  const changePasswordInput = (e: any) => {
    setPasswordInput(e.target.value);
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
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const joinGroup = async (
    groupKey: string,
    searchIndex: number,
    searchItem: any
  ) => {
    let newSearchList = _.cloneDeep(searchList);
    let groupRes: any = await api.group.getGroupInfo(groupKey);
    if (groupRes.msg === "OK") {
      let newGroupInfo = groupRes.result;
      if (newGroupInfo.joinType) {
        setQuestion(newGroupInfo.question);
        setJoinType(newGroupInfo.joinType);
        setIsHasPassword(newGroupInfo.isHasPassword);
        setSearchIndex(searchIndex);
        setSearchItem(searchItem);
        setInviteVisible(true);
      } else {
        let groupMemberRes: any = await api.group.addGroupMember(groupKey, [
          {
            userKey: user?._key,
            nickName: user?.profile.nickName,
            avatar: user?.profile.avatar,
            gender: user?.profile.gender,
            role: newGroupInfo.defaultPower,
          },
        ]);
        if (groupMemberRes.msg === "OK") {
          dispatch(setMessage(true, "加入项目成功", "success"));
          newSearchList.splice(searchIndex, 1);
          setSearchList(newSearchList);
          dispatch(getGroup(3));
        } else {
          dispatch(setMessage(true, groupMemberRes.msg, "error"));
        }
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const applyJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.applyJoinGroup(groupKey);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "申请加项目成功", "success"));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const passwordJoinGroup = async (groupKey: string) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.passwordJoinGroup(
      groupKey,
      passwordInput
    );
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "口令加项目成功", "success"));
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      dispatch(getGroup(3));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
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
      contactIndex ? getSearchPerson(newPage) : getSearchGroup(newPage);
    }
  };

  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    if (!theme.moveState) {
      dispatch(setMoveState("in"));
    }
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3));
    setSearchInputVisible(false);
  };
  const toTargetUser = async (targetUserKey: string) => {
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    if (!theme.moveState) {
      dispatch(setMoveState("in"));
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    dispatch(getMember(mainGroupKey));
    setSearchInputVisible(false);
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
      {!searchAllVisible ? (
        <div
          className="search-all-icon"
          onClick={() => {
            setSearchAllVisible(true);
            contactIndex ? getSearchPerson(page) : getSearchGroup(page);
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
                          <div>加为好友</div>
                        </div>
                      ) : (
                        <div
                          className="personMember-item-button"
                          onClick={
                            () => {
                              joinGroup(key, searchIndex, searchItem);
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
    <ClickOutSide
      onClickOutside={() => {
        setSearchInputVisible(false);
        setSearchInput("");
      }}
    >
      <div className="search-input-container">
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
    </ClickOutSide>
  );
  return (
    <div
      className="tabs"
      ref={tabsRef}
      style={{
        height:
          theme && theme.calendarVisible
            ? "calc(100% - 260px)"
            : "calc(100% - 210px)",
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
        localStorage.getItem("mainEnterpriseGroupKey") !== "out" ? (
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
        localStorage.getItem("mainEnterpriseGroupKey") !== "out" ? (
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
        <Dropdown
          overlay={searchMenu}
          placement="bottomRight"
          trigger={["click"]}
          onVisibleChange={() => {
            setSearchInputVisible(true);
          }}
          visible={searchInputVisible}
        >
          <img src={searchPng} alt="" className="search-icon" />
        </Dropdown>
        {contactIndex === 0 ? (
          <img
            src={addPng}
            alt=""
            className="add-icon"
            onClick={() => {
              setAddGroupVisible(true);
            }}
          />
        ) : null}
        <GroupCreate groupCreateVisible={addGroupVisible} setGroupCreateVisible={setAddGroupVisible}/>
        <Modal
          title="申请加入项目"
          visible={inviteVisible}
          footer={null}
          onCancel={() => {
            setInviteVisible(false);
          }}
        >
          <div className="invite-container">
            {isHasPassword ? (
              <div style={{ width: "100%;" }}>
                {question ? <div>{question} :</div> : null}

                <Input
                  placeholder="口令"
                  style={{
                    marginTop: question ? "15px" : "5px",
                    width: "100%",
                  }}
                  onChange={changePasswordInput}
                  value={passwordInput}
                />
              </div>
            ) : null}
            <div
              className="invite-button"
              style={
                isHasPassword
                  ? { justifyContent: "space-between" }
                  : { justifyContent: "center" }
              }
            >
              {isHasPassword ? (
                <Button
                  type="primary"
                  onClick={() => {
                    passwordJoinGroup(searchItem._key);
                  }}
                >
                  口令加项目
                </Button>
              ) : null}
              {joinType === 1 ? (
                <Button
                  type="primary"
                  onClick={() => {
                    applyJoinGroup(searchItem._key);
                  }}
                >
                  申请加项目
                </Button>
              ) : null}
            </div>
          </div>
        </Modal>
      </div>
      <Contact contactIndex={contactIndex} />
    </div>
  );
};
export default HomeTab;
