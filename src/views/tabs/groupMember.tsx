import React, { useState, useEffect, useRef, useCallback } from "react";
import "./groupMember.css";
import { Checkbox, Tooltip, Button, Input } from "antd";
import { QuestionOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import _ from "lodash";
import api from "../../services/api";

import { setMessage } from "../../redux/actions/commonActions";
import { getMember, getGroupMember } from "../../redux/actions/memberActions";

import DropMenu from "../../components/common/dropMenu";

import closePng from "../../assets/img/taskClose.png";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import { useMount } from "../../hook/common";
const { Search } = Input;
export interface GroupMemberProps {
  setMember: any;
  changeCount?: any;
}

const GroupMember: React.FC<GroupMemberProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const { setMember, changeCount } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [mainMemberList, setMainMemberList] = useState<any>([]);
  const [searchMemberList, setSearchMemberList] = useState<any>([]);
  const [groupMemberList, setGroupMemberList] = useState<any>([]);
  const [joinMemberList, setJoinMemberList] = useState<any>([]);
  const [memberList, setMemberList] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [chooseIndex, setChooseIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState<any>(null);
  const [roleHelpVisible, setRoleHelpVisible] = useState<any>(false);

  const [pos, setPos] = useState<any>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const roleTypeArr = ["项目管理", "管理员", "编辑", "作者", "项目成员"];
  const limit = 15;
  let unDistory = useRef<any>(true);
  
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (groupKey) {
      let newMemberList: any = _.cloneDeep(groupMemberArray);
      setMemberList(_.sortBy(newMemberList, ["role"]));
    }
  }, [groupKey, chooseIndex, groupMemberArray]);

  const getJoinGroupList = useCallback(async () => {
    let res: any = await api.group.applyJoinGroupList(groupKey);
    if (unDistory.current) {
      if (res.msg === "OK") {
        setJoinMemberList(res.result);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  }, [groupKey, dispatch]);

  useEffect(() => {
    if (memberArray && memberList && searchInput === "") {
      let newMemberArray = _.cloneDeep(memberArray);
      newMemberArray = newMemberArray.map((memberItem: any) => {
        let newMemberIndex = _.findIndex(memberList, {
          userId: memberItem.userId,
        });
        if (newMemberIndex === -1) {
          memberItem.checked = false;
        } else {
          memberItem.checked = true;
        }
        return memberItem;
      });
      setMainMemberList(_.sortBy(newMemberArray, ["checked"]));
      setGroupMemberList(_.sortBy(newMemberArray, ["checked"]));
    }
  }, [memberArray, memberList, searchInput]);

  useEffect(() => {
    if (user && user._key && groupKey) {
      getJoinGroupList();
    }
  }, [user, groupKey, getJoinGroupList]);

  useEffect(() => {
    if (searchInput) {
      setSearchType(false);
    }
  }, [searchInput]);

  const changeMember = (key: string, index: number) => {
    let newMainMemberList = _.cloneDeep(mainMemberList);
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    if (searchInput !== "") {
      let index = _.findIndex(newSearchMemberList, { _key: key });
      if (newSearchMemberList[index].checked) {
        newSearchMemberList[index].checked = false;
        let newSearchIndex = _.findIndex(newMemberList, {
          userId: newSearchMemberList[index].userId,
        });
        if (newSearchIndex !== -1) {
          newMemberList.splice(newSearchIndex, 1);
        }
      } else {
        newSearchMemberList[index].checked = true;
        newSearchMemberList[index].role = groupInfo.defaultPower;
        newMemberList.push(newSearchMemberList[index]);
      }
      setGroupMemberList(newSearchMemberList);
    } else {
      if (newMainMemberList[index].checked) {
        newMainMemberList[index].checked = false;
        let newSearchIndex = _.findIndex(newMemberList, {
          userId: newMainMemberList[index].userId,
        });
        if (newSearchIndex !== -1) {
          newMemberList.splice(newSearchIndex, 1);
        }
      } else {
        newMainMemberList[index].checked = true;
        newMainMemberList[index].role = groupInfo.defaultPower;
        newMemberList.push(newMainMemberList[index]);
      }
      setGroupMemberList(newMainMemberList);
    }
    setSearchMemberList(newSearchMemberList);
    setMainMemberList(newMainMemberList);
    setMemberList(newMemberList);
    setMember(newMemberList);
  };
  const searchMember = () => {
    if (searchInput !== "") {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getSearchPerson(page);
    }
  };
  const searchPerson = (input?: string) => {
    let newMainMemberList = _.cloneDeep(mainMemberList);
    let personInput = input ? input : searchInput;
    let searchPersonList: any = [];
    searchPersonList = newMainMemberList.filter((item: any, index: number) => {
      return (
        item.nickName &&
        item.nickName.toUpperCase().indexOf(personInput.toUpperCase()) !== -1
      );
    });
    setSearchMemberList(searchPersonList);
    setGroupMemberList(searchPersonList);
  };
  const getSearchPerson = async (page: number) => {
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList: any = [];
    if (page === 1) {
      setSearchMemberList([]);
    } else {
      newSearchMemberList = _.cloneDeep(searchMemberList);
    }
    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg === "OK") {
      res.result.forEach((searchItem: any) => {
        searchItem.avatar = searchItem.avatar
          ? searchItem.avatar
          : defaultPersonPng;
        let searchMemberIndex = _.findIndex(newMemberList, {
          userId: searchItem.userId,
        });
        if (searchMemberIndex === -1) {
          searchItem.checked = false;
        } else {
          searchItem.checked = true;
        }
        searchItem._key = searchItem.userId;
        newSearchMemberList.push(searchItem);
      });
      setSearchMemberList(newSearchMemberList);
      setGroupMemberList(newSearchMemberList);
      setTotal(res.totalNumber);
      setSearchType(true);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
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
    if (
      clientHeight + scrollTop >= scrollHeight &&
      searchMemberList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getSearchPerson(newPage);
    }
  };
  const deleteMember = async (userId: number) => {
    let newMainMemberList = _.cloneDeep(mainMemberList);
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    if (searchInput !== "") {
      let newSearchIndex = _.findIndex(newSearchMemberList, {
        userId: userId,
      });
      let newGroupIndex = _.findIndex(newMemberList, {
        userId: userId,
      });
      newMemberList.splice(newGroupIndex, 1);
      if (newSearchIndex !== -1) {
        newSearchMemberList[newSearchIndex].checked = false;
      }
      setGroupMemberList(newSearchMemberList);
      setSearchMemberList(newSearchMemberList);
    } else {
      let newMainIndex = _.findIndex(newMainMemberList, {
        userId: userId,
      });
      let newGroupIndex = _.findIndex(newMemberList, {
        userId: userId,
      });
      newMemberList.splice(newGroupIndex, 1);
      if (newMainIndex !== -1) {
        newMainMemberList[newMainIndex].checked = false;
      }
      setGroupMemberList(newMainMemberList);
      setMainMemberList(newMainMemberList);
    }
    setMemberList(newMemberList);
    setMember(newMemberList);
    if (_.findIndex(groupMemberArray, { userId: userId }) !== -1) {
      let memberRes: any = null;
      if (groupInfo.enterprise === 2) {
        memberRes = await api.company.deletePerson(userId + "", groupKey);
      } else {
        memberRes = await api.group.deleteGroupMember(groupKey, [userId]);
      }

      if (memberRes.msg === "OK") {
        // dispatch(setMessage(true, '删除项目成员成功', 'success'));
      } else {
        dispatch(setMessage(true, memberRes.msg, "error"));
      }
    }
  };
  const changeRoleVisible = (event: any, index: number) => {
    let posX: number = 0,
      posY: number = 0;
    let e: any = event || window.event;
    if (e.pageX || e.pageY) {
      posX = e.pageX;
      posY = e.pageY;
    } else if (e.clientX || e.clientY) {
      posX =
        e.clientX +
        document.documentElement.scrollLeft +
        document.body.scrollLeft;
      posY =
        e.clientY +
        document.documentElement.scrollTop +
        document.body.scrollTop;
    }
    setPos([posX, posY]);
    setRoleVisible(true);
    setRoleIndex(index);
  };
  const changeRole = (roleIndex: number, index: number) => {
    let newMemberRoleList: any = _.cloneDeep(memberList);
    if (roleIndex === 0) {
      newMemberRoleList[0].role = 2;
    }
    newMemberRoleList[index].role = roleIndex + 1;
    setMemberList(newMemberRoleList);
    setMember(newMemberRoleList);
    setRoleVisible(false);
    // this.$set(this.targetMemberList, index, this.targetMemberList[index]);
    // this.setRole({
    //   groupKey: this.groupKey,
    //   targetUKey: this.newMemberList[index].userId,
    //   role: roleIndex + 1,
    // });
    let memberIndex = _.findIndex(groupMemberArray, {
      userId: newMemberRoleList[index].userId,
    });
    if (memberIndex !== -1) {
      if (roleIndex === 0) {
        api.group.groupOwnerChange(groupKey, newMemberRoleList[index].userId);
      } else {
        api.auth.setRole(
          groupKey,
          newMemberRoleList[index].userId,
          roleIndex + 1
        );
      }
    }
  };
  const addJoinMember = async (joinItem: any, joinIndex: number) => {
    let newJoinMemberList = _.cloneDeep(joinMemberList);
    let memberRes: any = await api.group.addGroupMember(groupKey, [
      {
        userKey: joinItem.userKey,
        nickName: joinItem.nickName,
        avatar: joinItem.avatar,
        gender: 0,
        role: groupInfo.defaultPower,
      },
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "通过审核成功", "success"));
      newJoinMemberList.splice(joinIndex, 1);
      setJoinMemberList(newJoinMemberList);
      changeCount(newJoinMemberList.length);
      dispatch(getGroupMember(groupKey));
      api.group.deleteApplyJoinGroup(joinItem._key);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const deleteJoinMember = async (joinItem: any, joinIndex: number) => {
    let newJoinMemberList = _.cloneDeep(joinMemberList);
    let memberRes: any = await api.group.deleteApplyJoinGroup(joinItem._key);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "拒绝审核成功", "success"));
      newJoinMemberList.splice(joinIndex, 1);
      setJoinMemberList(newJoinMemberList);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const addMember = async (addItem: any, addIndex: number, type?: string) => {
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    let memberRes: any = await api.group.addGroupMember(mainGroupKey, [
      {
        userKey: addItem.userId,
        nickName: addItem.nickName,
        avatar: addItem.avatar,
        gender: 0,
        role: 5,
      },
    ]);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "添加好友成功", "success"));
      if (!type) {
        newSearchMemberList[addIndex].isMyMainGroupMember = true;
        setSearchMemberList(newSearchMemberList);
        setGroupMemberList(newSearchMemberList);
      }
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  return (
    <div className="group-member">
      <div className="group-member-person">
        <div className="group-member-choose">
          <div className="group-member-title">
            <div
              onClick={() => {
                setChooseIndex(0);
              }}
              style={{
                borderBottom: chooseIndex === 0 ? "2px solid #1890ff" : "none",
                marginRight: "15px",
                cursor: "pointer",
              }}
            >
              联系人({mainMemberList.length})
            </div>
            <div
              onClick={() => {
                setChooseIndex(1);
              }}
              style={{
                borderBottom: chooseIndex === 1 ? "2px solid #1890ff" : "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              申请人({joinMemberList.length})
            </div>
          </div>
          {chooseIndex === 0 ? (
            <React.Fragment>
              <div className="group-member-search">
                <Search
                  className="group-member-input"
                  placeholder="搜索"
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    searchPerson(e.target.value);
                  }}
                  value={searchInput}
                  onSearch={() => {
                    if (searchInput !== "") {
                      searchMember();
                    }
                  }}
                  bordered={false}
                />
              </div>
              <div
                className="group-member-container"
                onScroll={(e) => {
                  if (searchInput !== "") {
                    scrollSearchLoading(e);
                  }
                }}
              >
                {groupMemberList.map((mainItem: any, mainIndex: number) => {
                  return (
                    <div className="group-member-item" key={"main" + mainIndex}>
                      <div
                        className="group-member-item-container"
                        style={{ width: "80%" }}
                      >
                        <div className="group-member-img">
                          <img
                            src={
                              mainItem.avatar
                                ? mainItem.avatar +
                                  "?imageMogr2/auto-orient/thumbnail/80x"
                                : defaultPersonPng
                            }
                            alt=""
                          />
                        </div>
                        <div className="group-member-name">
                          {mainItem.nickName}
                        </div>
                        {searchType && !mainItem.isMyMainGroupMember ? (
                          <div
                            className="group-member-add"
                            onClick={() => {
                              addMember(mainItem, mainIndex);
                            }}
                          >
                            + 好友
                          </div>
                        ) : null}
                      </div>
                      <Checkbox
                        onChange={() => {
                          changeMember(mainItem._key, mainIndex);
                        }}
                        checked={mainItem.checked}
                      />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ) : null}
          {chooseIndex === 1 ? (
            <div className="group-member-container" style={{ height: "100%" }}>
              {joinMemberList.map((mainItem: any, mainIndex: number) => {
                return (
                  <div className="group-member-item" key={"join" + mainIndex}>
                    <div className="group-member-item-container">
                      <div className="group-member-img">
                        <img
                          src={
                            mainItem.avatar
                              ? mainItem.avatar +
                                "?imageMogr2/auto-orient/thumbnail/80x"
                              : defaultPersonPng
                          }
                          alt=""
                        />
                      </div>
                      <div className="group-member-name">
                        {mainItem.nickName}
                      </div>
                    </div>
                    <div className="group-member-item-button">
                      <Button
                        type="primary"
                        onClick={() => {
                          addJoinMember(mainItem, mainIndex);
                        }}
                        style={{ marginRight: "5px" }}
                      >
                        通过
                      </Button>
                      <Button
                        onClick={() => {
                          deleteJoinMember(mainItem, mainIndex);
                        }}
                      >
                        拒绝
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="group-member-team">
        <div className="group-member-title">
          项目权限设置
          <Tooltip title="权限说明">
            <Button
              ghost
              shape="circle"
              icon={<QuestionOutlined />}
              onClick={(e: any) => {
                setRoleHelpVisible(true);
              }}
              style={{ border: "0px" }}
            />
          </Tooltip>
          <DropMenu
            visible={roleHelpVisible}
            dropStyle={{
              width: "320px",
              height: "400px",
              top: "34px",
              left: "88px",
              padding: "0px 16px",
            }}
            onClose={() => {
              setRoleHelpVisible(false);
            }}
            title={"权限说明"}
          >
            <div className="roleHelp-item">
              <div>管理员</div>
              <div>
                <div>1.设置他人为编辑及以下权限</div>
                <div>2.邀请进项目</div>
                <div>3.增删频道</div>
                <div>4.增删改项目任务</div>
              </div>
            </div>
            <div className="roleHelp-item">
              <div>编辑</div>
              <div>
                <div>1.增删频道</div>
                <div>2.指派任务</div>
                <div> 3.增、删、改自己及下级的任务</div>
              </div>
            </div>
            <div className="roleHelp-item">
              <div>作者</div>
              <div>
                <div>1.指派任务</div>
                <div>2.增、删、改自己指派的任务</div>
              </div>
            </div>
            <div className="roleHelp-item">
              <div>成员</div>
              <div>
                <div>1.被指派任务</div>
              </div>
            </div>
          </DropMenu>
        </div>
        <div className="group-member-container contact-team-container">
          {memberList.map((newItem: any, newIndex: number) => {
            return (
              <div className="group-member-item" key={"new" + newIndex}>
                <div className="group-member-item-container">
                  <div className="group-member-img">
                    <img
                      src={
                        newItem.avatar
                          ? newItem.avatar +
                            "?imageMogr2/auto-orient/thumbnail/80x"
                          : defaultPersonPng
                      }
                      alt=""
                    />
                  </div>
                  <div className="group-member-name">{newItem.nickName}</div>
                </div>
                <div
                  className="group-time-set"
                  style={
                    newItem.userId !== user._key && groupRole < newItem.role
                      ? { cursor: "pointer" }
                      : {}
                  }
                >
                  {_.findIndex(memberArray, { userId: newItem.userId }) ===
                  -1 ? (
                    <div
                      className="group-member-add"
                      onClick={() => {
                        addMember(newItem, newIndex, "group");
                      }}
                    >
                      + 好友
                    </div>
                  ) : null}
                  <div
                    className="group-time"
                    onClick={(e) => {
                      if (
                        newItem.userId !== user._key &&
                        groupRole < newItem.role
                      ) {
                        changeRoleVisible(e, newIndex);
                      }
                    }}
                  >
                    {roleTypeArr[newItem.role - 1]}
                  </div>
                  <div className="group-time-close">
                    {groupRole > 0 &&
                    groupRole < 3 &&
                    groupRole < newItem.role &&
                    newItem.userId !== user._key ? (
                      <img
                        src={closePng}
                        alt=""
                        onClick={() => {
                          deleteMember(newItem.userId);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DropMenu
        visible={roleVisible}
        dropStyle={{
          position: "fixed",
          top: pos[1] + 15 + "px",
          left: pos[0] - 30 + "px",
          width: "80px",
          zIndex: "5",
          color: "#333",
        }}
        onClose={() => {
          setRoleVisible(false);
        }}
      >
        <div className="group-role">
          {groupRole === 1 || groupRole === 2 ? (
            <React.Fragment>
              {roleTypeArr.map((item: any, index: number) => {
                return (
                  <React.Fragment key={"role" + index}>
                    {index > 0 && (groupRole === 1 || groupRole < index + 1) ? (
                      <div
                        onClick={() => {
                          changeRole(index, roleIndex);
                        }}
                        className="group-role-item"
                      >
                        {item}
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ) : null}
        </div>
      </DropMenu>
    </div>
  );
};
export default GroupMember;
