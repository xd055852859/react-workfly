import React, { useState, useEffect, useRef, useCallback } from "react";
import "./contact.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Breadcrumb, Button, Select, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Tree } from "tree-graph-react";
import api from "../../services/api";
import _ from "lodash";
import { usePrevious } from "../../hook/common";

import { getGroup, setGroupKey } from "../../redux/actions/groupActions";
import {
  setCommonHeaderIndex,
  setChatState,
  setShowChatState,
  setMessage,
  changeColorState,
  setMoveState,
} from "../../redux/actions/commonActions";
import {
  getTargetUserInfo,
  setClickType,
  changeMusic,
  changeMainenterpriseGroup,
  setOkrMemberKey
} from "../../redux/actions/authActions";
import {
  setHeaderIndex,
  setWorkHeaderIndex,
  changeCompanyItem,
  getMember,
  getEnterpriseMember,
  getGroupMember,
} from "../../redux/actions/memberActions";

import Loading from "../../components/common/loading";
import Avatar from "../../components/common/avatar";

import checkPersonPng from "../../assets/img/checkPerson.png";
import contactOkr from "../../assets/svg/contactOkr.svg";
import defaultPersonSvg from "../../assets/svg/defaultPerson.svg";
import defaultGroupSvg from "../../assets/svg/defaultGroup.svg";
import carePng from "../../assets/img/care.png";
import chatSvg from "../../assets/svg/chat.svg";
import uncarePng from "../../assets/img/uncare.png";
import contactTree from "../../assets/svg/contactTree.svg";
// import contactBook from "../../assets/svg/contactBook.svg";
import contactGroup from "../../assets/svg/contactGroup.svg";
import vitality from "../../assets/svg/vitality.svg";
import rank from "../../assets/svg/rank.svg";
import computer from "../../assets/svg/computer.svg";
import { useMount } from "../../hook/common";
import FileList from "../../components/fileList/fileList";
const { Option } = Select;
export interface ContactProps {
  contactIndex: number;
  contactType?: string;
  type?: string;
  changeHomeIndex?: Function;
  bindGroup?: Function;
}

const Contact: React.FC<ContactProps> = (props) => {
  const { contactIndex, contactType, type, changeHomeIndex, bindGroup } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const companyMemberArray = useTypedSelector(
    (state) => state.member.companyMemberArray
  );
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const companyItem = useTypedSelector((state) => state.member.companyItem);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const enterpriseMemberArray = useTypedSelector(
    (state) => state.member.enterpriseMemberArray
  );
  // const memberHeaderIndex = useTypedSelector(
  //   (state) => state.member.memberHeaderIndex
  // );
  // const workHeaderIndex = useTypedSelector(
  //   (state) => state.member.workHeaderIndex
  // );
  const [contactArray, setContactArray] = useState<any>([]);
  const [contactKey, setContactKey] = useState<any>(null);
  const [contactSearchInput, setContactSearchInput] = useState("");

  const [cloneGroupIndex, setCloneGroupIndex] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [fileNum, setFileNum] = useState<any>(null);
  //eslint-disable-next-line
  const [targetNodeArray, setTargetNodeArray] = useState<any>([]);
  let unDistory = useRef<any>(true);
  const contactRef = useRef<any>();
  useMount(() => {
    setLoading(true);
    if (type === "phone") {
      dispatch(changeMainenterpriseGroup("", "", "全部项目", 0));
      localStorage.setItem("mainEnterpriseGroupKey", "");
    }
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (mainGroupKey) {
      if (contactIndex === 1) {
        dispatch(getMember(mainGroupKey, 1));
      } else if (contactIndex === 0) {
        dispatch(getGroup(3));
        if (!memberArray) {
          dispatch(getMember(mainGroupKey, 1));
        }
      }
    }
    //eslint-disable-next-line
  }, [mainGroupKey, contactIndex]);

  const getGroupTree = useCallback(
    async (nodeId: any, info: any, index: number) => {
      if (info && info.mainEnterpriseGroupKey) {
        let newCompanyData: any = {};
        let companyDepartmentRes: any = await api.company.getOrganizationTree({
          enterpriseGroupKey: info.mainEnterpriseGroupKey,
          type: index === 3 ? 4 : 5,
        });
        setLoading(false);
        if (unDistory.current) {
          if (companyDepartmentRes.msg === "OK") {
            let data = companyDepartmentRes.result;
            for (let key in data) {
              newCompanyData[key] = {
                _key: data[key]._key,
                contract: false,
                father: data[key].parentOrgKey,
                //  data[key].name,
                name:
                  data[key].orgType === 1
                    ? data[key].name
                    : data[key].name +
                      (data[key].post ? `( ${data[key].post} )` : ""),
                path: data[key].path1,
                sortList: data[key].children,
                enterpriseGroupKey: data[key].enterpriseGroupKey,
                groupMemberKey: data[key].groupMemberKey,
                orgType: data[key].orgType,
                staffKey: data[key].staffKey,
                groupKey: data[key].groupKey,
                color: "#fff",
                // disabled: data[key].orgType === 2,
                backgroundColor: "transparent",
                childrenAll: data[key].childrenAll,
              };
              if (data[key].orgType !== 1) {
                //?imageMogr2/auto-orient/thumbnail/80x
                newCompanyData[key].avatarUri =
                  index === 3
                    ? data[key].avatar
                      ? data[key].avatar
                      : defaultPersonSvg
                    : data[key].groupLogo
                    ? data[key].groupLogo
                    : defaultGroupSvg;
              }
              if (!nodeId && !data[key].parentOrgKey) {
                nodeId = data[key]._key;
                newCompanyData[key].icon = info.mainEnterpriseGroupLogo
                  ? info.mainEnterpriseGroupLogo
                  : defaultGroupSvg;
              }
            }
            setStartId(nodeId);
            setSelectedId(nodeId);
            setCompanyData(newCompanyData);
          } else {
            dispatch(setMessage(true, companyDepartmentRes.msg, "error"));
          }
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (companyItem?.config) {
      if (contactIndex === 3) {
        setLoading(true);
        getGroupTree(
          companyItem.config.memberStartId,
          mainEnterpriseGroup,
          contactIndex
        );
      } else if (contactIndex === 4) {
        getGroupTree(
          companyItem.config.groupStartId,
          mainEnterpriseGroup,
          contactIndex
        );
      }
    }
  }, [companyItem, contactIndex, getGroupTree, mainEnterpriseGroup]);
  const getCompanyperson = useCallback(
    async (enterpriseMemberArray: any) => {
      let arr: any = [];
      enterpriseMemberArray.forEach((item: any) => {
        if (item.userId !== user._key) {
          arr.push({
            avatar: item.avatar,
            gender: item.gender,
            mobile: item.mobile,
            mobileArea: "+86",
            nickName: item.nickName,
            role: item.role,
            userId: item.userId,
            _key: item._key,
            isFriend: item.isFriend,
          });
        }
      });
      setContactArray(arr);
    },
    [user]
  );
  useEffect(() => {
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey) {
      dispatch(
        getEnterpriseMember(
          1,
          mainEnterpriseGroup.mainEnterpriseGroupKey,
          1,
          1000
        )
      );
    }
  }, [mainEnterpriseGroup, dispatch]);

  useEffect(() => {
    if (contactIndex === 7) {
      getCompanyperson(enterpriseMemberArray);
    }
  }, [enterpriseMemberArray, contactIndex, getCompanyperson]);
  useEffect(() => {
    if (groupArray && (contactIndex === 0 || contactIndex === 5)) {
      setLoading(false);
      let newGroupArray: any = null;
      if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
        newGroupArray = groupArray.filter((item: any) => {
          return (
            item.enterpriseGroupKey ===
              mainEnterpriseGroup.mainEnterpriseGroupKey ||
            item._key === mainEnterpriseGroup.mainEnterpriseGroupKey
          );
        });
      } else if (localStorage.getItem("mainEnterpriseGroupKey") === "freedom") {
        newGroupArray = groupArray.filter((item: any) => {
          return !item.enterpriseGroupKey && item.enterprise !== 2;
        });
      } else {
        newGroupArray = groupArray;
      }
      if (contactIndex === 0) {
        let fileNum = 0;
        newGroupArray = newGroupArray.filter((item: any) => {
          if (item.isFile) {
            fileNum++;
          }
          return !item.isFile;
        });
        if (setFileNum) {
          setFileNum(fileNum);
        }
      } else if (contactIndex === 5) {
        newGroupArray = newGroupArray.filter((item: any) => {
          return item.isFile;
        });
      }
      setContactArray(newGroupArray);
    }
  }, [groupArray, contactIndex, mainEnterpriseGroup, setFileNum]);

  useEffect(() => {
    if (memberArray && contactIndex === 1) {
      setLoading(false);
      let arr: any = [];
      memberArray.forEach((item: any) => {
        if (item.userId !== user._key) {
          arr.push(item);
        }
      });
      setContactArray(arr);
    }
  }, [user, memberArray, contactIndex]);
  useEffect(() => {
    if (companyMemberArray && contactIndex === 2) {
      setContactArray(companyMemberArray);
    }
  }, [companyMemberArray, contactIndex]);

  const prevContactSearchInput = usePrevious(contactSearchInput);
  useEffect(() => {
    if (prevContactSearchInput && contactSearchInput === "") {
      if (groupArray && contactIndex === 0) {
        let newGroupArray: any = [];
        if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
          newGroupArray = groupArray.filter((item: any) => {
            return (
              item.enterpriseGroupKey ===
                mainEnterpriseGroup.mainEnterpriseGroupKey ||
              item._key === mainEnterpriseGroup.mainEnterpriseGroupKey
            );
          });
        } else if (
          localStorage.getItem("mainEnterpriseGroupKey") === "freedom"
        ) {
          newGroupArray = groupArray.filter((item: any) => {
            return !item.enterpriseGroupKey && item.enterprise !== 2;
          });
        } else {
          newGroupArray = groupArray;
        }
        newGroupArray = newGroupArray.filter((item: any) => {
          return !item.isFile && item._key !== mainGroupKey;
        });
        setContactArray(newGroupArray);
      } else if (memberArray && contactIndex === 1) {
        let arr: any = [];
        memberArray.forEach((item: any) => {
          if (item.userId !== user._key) {
            arr.push(item);
          }
        });
        setContactArray(arr);
      }
    }
    //eslint-disable-next-line
  }, [
    prevContactSearchInput,
    contactSearchInput,
    contactIndex,
    mainEnterpriseGroup,
    groupArray,
    memberArray,
    user,
  ]);

  const goChat = useCallback(
    async (contactKey: string, memberArray: any, contactIndex: number) => {
      const dom: any = document.querySelector("#chat");
      if (dom) {
        if (contactIndex) {
          const privatePerson =
            memberArray[_.findIndex(memberArray, { userId: contactKey })];
          if (privatePerson) {
            const privateChatRId = privatePerson.privateChatRId;
            if (privateChatRId) {
              dom.contentWindow.postMessage(
                {
                  externalCommand: "go",
                  path: "/direct/" + privateChatRId,
                },
                "*"
              );
            } else {
              let chatRes: any = await api.member.getPrivateChatRId(
                mainGroupKey,
                contactKey
              );

              if (chatRes.msg === "OK") {
                dom.contentWindow.postMessage(
                  {
                    externalCommand: "go",
                    path: "/direct/" + chatRes.result,
                  },
                  "*"
                );
              } else {
                dispatch(setMessage(true, chatRes.msg, "error"));
              }
            }
          }
        } else {
          dom.contentWindow.postMessage(
            {
              externalCommand: "go",
              path: "/group/" + contactKey,
            },
            "*"
          );
        }
      }
    },
    [dispatch, mainGroupKey]
  );
  useEffect(() => {
    if (contactKey && memberArray) {
      goChat(contactKey, memberArray, contactIndex);
    }
  }, [contactKey, memberArray, contactIndex, goChat]);
  useEffect(() => {
    if (startId && companyData && companyData[startId]) {
      setSelectedPath(companyData[startId].path);
    }
  }, [startId, companyData]);
  const toTargetGroup = async (
    groupKey: string,
    frozenStatus?: number,
    thawDayNumber?: number
  ) => {
    await api.group.visitGroupOrFriend(2, groupKey);
    if (frozenStatus === 1) {
      if (headerIndex === 3) {
      }
      dispatch(setCommonHeaderIndex(1));
      dispatch(setMessage(true, "企业账号冻结，请联系平台客服。", "warning"));
    } else {
      dispatch(setGroupKey(groupKey));
      dispatch(setCommonHeaderIndex(3));
      dispatch(getGroupMember(groupKey, 4));
      if (memberHeaderIndex === 9) {
        dispatch(setHeaderIndex(0));
      }
      if (thawDayNumber && thawDayNumber < 7) {
        dispatch(
          setMessage(
            true,
            "企业账号有效时间仅剩" + thawDayNumber + "天",
            "warning"
          )
        );
      }
    }
    // dispatch(getGroup(3, null, 1));
  };
  const toTargetUser = async (targetUserKey: string) => {
    dispatch(getTargetUserInfo(targetUserKey));
    if (targetUserKey !== user._key) {
      dispatch(setCommonHeaderIndex(2));
      dispatch(setClickType("out"));
    } else {
      dispatch(setCommonHeaderIndex(1));
      setClickType("self");
    }
    // dispatch(setWorkHeaderIndex(1));
    await api.group.visitGroupOrFriend(1, targetUserKey);
    // if (contactType === "header") {
    //   dispatch(getMember(mainGroupKey, 1));
    // }
  };
  const changeCare = (
    e: any,
    type: number,
    key: string,
    status: number,
    index: number
  ) => {
    e.stopPropagation();
    let newContactArray: any = _.cloneDeep(contactArray);
    api.auth.dealCareFriendOrGroup(type, key, status);
    newContactArray[index].isCare = status === 1 ? true : false;
    setContactArray(newContactArray);
  };
  const searchGroup = (input?: string) => {
    let newContactArray = _.cloneDeep(groupArray);
    let searchInput = input ? input : contactSearchInput;
    newContactArray = newContactArray.filter((item: any, index: number) => {
      return (
        item.groupName &&
        item.groupName.toUpperCase().indexOf(searchInput.toUpperCase()) !==
          -1 &&
        item._key !== mainGroupKey
      );
    });
    setContactArray(newContactArray);
  };
  const searchPerson = (input?: string) => {
    let newContactArray = _.cloneDeep(memberArray);
    let searchInput = input ? input : contactSearchInput;
    newContactArray = newContactArray.filter((item: any, index: number) => {
      return (
        item.nickName &&
        item.nickName.toUpperCase().indexOf(searchInput.toUpperCase()) !== -1
      );
    });
    setContactArray(newContactArray);
  };

  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    let newCompanyItem = _.cloneDeep(companyItem);
    setStartId(node._key);
    setSelectedPath(node.path);
    if (contactIndex === 3) {
      newCompanyItem.config.memberStartId = node._key;
    } else if (contactIndex === 4) {
      newCompanyItem.config.groupStartId = node._key;
    }
    getGroupTree(node._key, mainEnterpriseGroup, contactIndex);
    api.member.setConfig(newCompanyItem.groupMemberKey, newCompanyItem.config);
    dispatch(changeCompanyItem(newCompanyItem));
    // setSelectedPath(nodeObj[node._key].path1);
  };
  const editContract = (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newCompanyData = _.cloneDeep(companyData);
    newTargetNode.contract = newTargetNode.contract ? false : true;
    newCompanyData[node._key].contract = !newCompanyData[node._key].contract;
    setTargetNode(newTargetNode);
    setCompanyData(newCompanyData);
    // setGridList(newGridList);
  };
  const addMember = async (searchItem: any, searchIndex: number) => {
    let newContactArray = _.cloneDeep(contactArray);
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
      newContactArray[searchIndex].isFriend = true;
      setContactArray(newContactArray);
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
  const handleChange = (value) => {
    let newGroupArray: any = null;
    if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
      newGroupArray = groupArray.filter((item: any) => {
        return (
          item.enterpriseGroupKey ===
            mainEnterpriseGroup.mainEnterpriseGroupKey ||
          item._key === mainEnterpriseGroup.mainEnterpriseGroupKey
        );
      });
    } else if (localStorage.getItem("mainEnterpriseGroupKey") === "freedom") {
      newGroupArray = groupArray.filter((item: any) => {
        return !item.enterpriseGroupKey && item.enterprise !== 2;
      });
    } else {
      newGroupArray = groupArray;
    }
    if (value === "全部") {
      let fileNum = 0;
      newGroupArray = newGroupArray.filter((item: any) => {
        if (item.isFile) {
          fileNum++;
        }
        return !item.isFile;
      });
      if (setFileNum) {
        setFileNum(fileNum);
      }
    } else {
      newGroupArray = newGroupArray.filter((item: any) => {
        return item.isFile;
      });
    }
    setContactArray(newGroupArray);
  };
  return (
    <div
      className="contact"
      ref={contactRef}
      style={{
        height:
          contactType || type === "phone"
            ? "100%"
            : contactIndex === 0 || contactIndex === 1
            ? "calc(100% - 115px)"
            : "calc(100% - 85px)",
        position:
          contactIndex === 3 || contactIndex === 4 ? "relative" : "static",
        color: contactType ? "#333" : "#fff",
      }}
    >
      {loading ? <Loading /> : null}
      {(contactType || type === "phone") &&
      (contactIndex === 0 || contactIndex === 1) ? (
        <div className="contact-header">
          <div
            className={
              type === "phone" || contactIndex === 1
                ? "contact-phone-search"
                : "contact-search"
            }
          >
            <SearchOutlined />
            <input
              type="text"
              value={contactSearchInput}
              onChange={(e: any) => {
                setContactSearchInput(e.target.value);
                if (contactIndex) {
                  searchPerson(e.target.value);
                } else {
                  searchGroup(e.target.value);
                }
              }}
              className={
                type === "phone"
                  ? "contact-phone-search-input"
                  : "contact-search-input"
              }
              placeholder={contactIndex ? "请输入队友名" : "请输入项目名"}
              onKeyDown={(e: any) => {
                if (e.keyCode === 13) {
                  if (contactIndex) {
                    searchPerson();
                  } else {
                    searchGroup();
                  }
                }
              }}
            />
            {/* <Button
            variant="contained"
            color="primary"
            onClick={() => {
              searchGroup();
            }}
            className="contact-search-button"
          >
            搜索
          </Button> */}
          </div>
          {type !== "phone" && contactIndex === 0 ? (
            //       onChange={handleChange}
            <Select
              defaultValue="全部"
              style={{
                width: 130,
              }}
              onChange={handleChange}
              getPopupContainer={() => contactRef.current}
            >
              <Option value="全部">全部</Option>

              <Option value="已归档">已归档 ( {fileNum} ) </Option>
            </Select>
          ) : null}
        </div>
      ) : null}

      {contactIndex === 0 ||
      contactIndex === 1 ||
      contactIndex === 5 ||
      contactIndex === 7 ? (
        contactArray && contactArray.length > 0 ? (
          <div
            className="contact-box"
            style={type === "phone" ? { height: "calc(100% - 35px)" } : {}}
          >
            {contactArray.map((item: any, index: number) => {
              let name =
                contactIndex === 1 || contactIndex === 7
                  ? item.nickName
                  : item.groupName;
              let avatar =
                contactIndex === 1 || contactIndex === 7
                  ? item.avatar
                  : item.groupLogo;
              let key =
                contactIndex === 1 || contactIndex === 7
                  ? item.userId
                  : item._key;
              let onlineColor =
                item.onlineStatus === "online"
                  ? "#7ED321"
                  : item.onlineStatus === "busy"
                  ? "#EA3836"
                  : item.onlineStatus === "away"
                  ? "#F5A623"
                  : "#B3B3B3";
              return (
                <React.Fragment key={"contact" + index}>
                  {contactType !== "clone" ||
                  (contactType === "clone" &&
                    item.role > 0 &&
                    item.role < 3) ? (
                    <div
                      className="contact-item"
                      onClick={() => {
                        dispatch(changeMusic(11));
                        if (type === "phone" && changeHomeIndex) {
                          changeHomeIndex(contactIndex, key, item.frozenStatus);
                        } else {
                          if (contactType === "o" || contactType === "kr") {
                            bindGroup(item, contactType, "add");
                          } else {
                            contactIndex === 1 || contactIndex === 7
                              ? toTargetUser(key)
                              : toTargetGroup(
                                  key,
                                  item.frozenStatus,
                                  item.thawDayNumber
                                );
                          }
                        }
                      }}
                      // onMouseOver={() => {
                      //   dispatch(changeMusic(14));
                      // }}
                      style={
                        cloneGroupIndex === index
                          ? { backgroundColor: "#f0f0f0" }
                          : {}
                      }
                    >
                      <div
                        className="contact-left"
                        style={{
                          width: contactType
                            ? "100%"
                            : contactIndex === 1
                            ? "calc(100% - 100px)"
                            : "calc(100% - 130px)",
                        }}
                      >
                        <div
                          className="contact-avatar"
                          style={{
                            borderRadius: contactIndex === 1 ? "50%" : "5px",
                          }}
                        >
                          <Avatar
                            name={name}
                            avatar={avatar}
                            type={
                              contactIndex === 1 || contactIndex === 7
                                ? "person"
                                : "group"
                            }
                            index={index}
                          />
                        </div>
                        {contactIndex === 1 ? (
                          <div
                            className="contact-online"
                            style={{ backgroundColor: onlineColor }}
                          >
                            {item.onlineStatus === "online" && !contactType ? (
                              <img
                                src={computer}
                                alt=""
                                style={{
                                  width: "20px",
                                  height: "17px",
                                  zoom: 0.4,
                                }}
                              ></img>
                            ) : null}
                          </div>
                        ) : null}
                        <div
                          className="contact-left-title"
                          style={
                            contactIndex === 1 || contactIndex === 7
                              ? { maxWidth: "calc(100% - 87px)" }
                              : { width: "calc(100% - 27px)" }
                          }
                        >
                          {name}{" "}
                        </div>
                        {/* {contactIndex === 1 ? (
                        <React.Fragment>
                          <img
                            src={fireSvg}
                            alt=""
                            className="contact-uncare-img"
                            style={{ display: 'block', marginRight: '5px', opacity: 0.6 }}
                            onClick={() => { dispatch(setWorkHeaderIndex(4)) }}
                          />
                          <span onClick={() => { dispatch(setWorkHeaderIndex(4)) }} style={{ opacity: 0.6 }}>{item.todayEnergyValue} / {item.energyValueTotal}</span>
                        </React.Fragment>
                      ) : null} */}

                        {/* {!contactType && !contactIndex ? (
                    <img
                      src={unUseSvg}
                      alt=""
                      className="contact-uncare-img"
                      onClick={(e: any) => {
                        changeUse(e, key, 1, index);
                      }}
                    />
                  ) : null} */}
                      </div>
                      {type !== "phone" ? (
                        <div className="contact-icon-right">
                          {!contactType &&
                          !item.notActive &&
                          contactIndex !== 7 ? (
                            <Tooltip title="聊天">
                              <img
                                src={chatSvg}
                                alt=""
                                className="contact-uncare-img"
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  // dispatch(setChatState(true))
                                  // dispatch(setShowChatState(true));
                                  dispatch(setShowChatState(true));
                                  dispatch(setChatState(true));
                                  setContactKey(
                                    contactIndex ? key : item.groupUUID
                                  );
                                }}
                              />
                            </Tooltip>
                          ) : null}
                          {(contactType === "create" ||
                            contactType === "clone") &&
                          cloneGroupIndex === index ? (
                            <img
                              src={checkPersonPng}
                              alt=""
                              style={{
                                width: "20px",
                                height: "12px",
                              }}
                            ></img>
                          ) : null}

                          {/* {!contactType && item.knowledgeBaseNodeKey ? (
                        <img
                          src={contactBook}
                          alt=""
                          style={{
                            width: "14px",
                            height: "17px",
                            marginRight: "5px",
                          }}
                          onClick={() => {
                            dispatch(setHeaderIndex(9));
                          }}
                        ></img>
                      ) : null} */}
                          {!contactType && contactIndex !== 7 ? (
                            <Tooltip title="日报">
                              <img
                                src={contactGroup}
                                alt=""
                                className="contact-uncare-img"
                                style={{
                                  width: "14px",
                                  height: "17px",
                                  // marginRight: "5px",
                                }}
                                onClick={() => {
                                  dispatch(
                                    contactIndex === 1
                                      ? setWorkHeaderIndex(1)
                                      : setHeaderIndex(0)
                                  );
                                }}
                              ></img>
                            </Tooltip>
                          ) : null}
                          {!contactType && contactIndex === 1 ? (
                            <Tooltip title="okr">
                              <img
                                src={contactOkr}
                                alt=""
                                className="contact-uncare-img"
                                style={{
                                  width: "14px",
                                  height: "17px",
                                  // marginRight: "5px",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem(
                                    "memberKey",
                                    item.userId
                                  );
                                  dispatch(setOkrMemberKey(item.userId));
                                  dispatch(setCommonHeaderIndex(8));
                                  dispatch(setMoveState("in"));
                                }}
                              ></img>
                            </Tooltip>
                          ) : null}

                          {/* && memberHeaderIndex !== 3 */}
                          {!item.isFriend && contactIndex === 7 ? (
                            <Button
                              type="primary"
                              ghost
                              style={{
                                height: "27px",
                                padding: "0px 5px",
                              }}
                              className="contact-uncare-button"
                              onClick={() => {
                                addMember(item, index);
                              }}
                            >
                              + 好友
                            </Button>
                          ) : null}
                          {!contactType && contactIndex === 0 ? (
                            <Tooltip title="超级树">
                              <img
                                src={contactTree}
                                alt=""
                                className="contact-uncare-img"
                                style={{
                                  width: "18px",
                                  height: "17px",
                                }}
                                onClick={() => {
                                  dispatch(setHeaderIndex(3));
                                  dispatch(changeColorState(true));
                                  setTimeout(() => {
                                    dispatch(changeColorState(false));
                                  }, 1000);
                                  dispatch(setMoveState("in"));
                                }}
                              ></img>
                            </Tooltip>
                          ) : null}
                          {/*  && memberHeaderIndex !== 4  */}
                          {!contactType &&
                          (contactIndex === 1 ||
                            contactIndex === 0 ||
                            contactIndex === 5) ? (
                            <Tooltip title="排行榜">
                              <img
                                src={rank}
                                alt=""
                                className="contact-uncare-img"
                                style={{
                                  width: "18px",
                                  height: "17px",
                                }}
                                onClick={() => {
                                  dispatch(
                                    contactIndex === 1
                                      ? setWorkHeaderIndex(5)
                                      : setHeaderIndex(4)
                                  );
                                }}
                              ></img>
                            </Tooltip>
                          ) : null}
                          {/*  && workHeaderIndex !== 4  && memberHeaderIndex !== 5 */}
                          {!contactType &&
                          (contactIndex === 0 ||
                            contactIndex === 5 ||
                            contactIndex === 1) ? (
                            <Tooltip title="活力">
                              <img
                                src={vitality}
                                alt=""
                                className="contact-uncare-img"
                                style={{
                                  width: "18px",
                                  height: "17px",
                                }}
                                onClick={() => {
                                  dispatch(
                                    contactIndex === 1
                                      ? setWorkHeaderIndex(6)
                                      : setHeaderIndex(5)
                                  );
                                }}
                              ></img>
                            </Tooltip>
                          ) : null}
                          {!contactType && contactIndex !== 7 ? (
                            item.isCare ? (
                              <Tooltip title="取消关注">
                                <img
                                  src={carePng}
                                  alt=""
                                  className="contact-care-img"
                                  onClick={(e) => {
                                    changeCare(
                                      e,
                                      contactIndex === 0 ? 2 : 1,
                                      key,
                                      2,
                                      index
                                    );
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="关注">
                                <img
                                  src={uncarePng}
                                  alt=""
                                  className="contact-uncare-img"
                                  onClick={(e) => {
                                    changeCare(
                                      e,
                                      contactIndex === 0 ? 2 : 1,
                                      key,
                                      1,
                                      index
                                    );
                                  }}
                                />
                              </Tooltip>
                            )
                          ) : null}
                          {/* {item.todayTotalTaskNumber && !contactType ? (
                    <TimeIcon
                      timeHour={Math.ceil(item.todayTotalTaskHours)}
                      timeDay={Math.ceil(item.todayTotalTaskNumber)}
                    />
                  ) : (
                    <div style={{ width: '24px' }}></div>
                  )} */}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        ) : null
      ) : contactIndex === 6 ? (
        <FileList
          groupKey={""}
          type="侧边文档"
          // fileItemWidth={'calc(100% - 270px)'}
        />
      ) : companyData && startId ? (
        <div
          style={{
            marginTop: "0px",
            marginLeft: "-78px",
          }}
        >
          <Tree
            // disabled
            itemHeight={32}
            blockHeight={25}
            columnSpacing={25}
            singleColumn={true}
            nodes={companyData}
            uncontrolled={false}
            showAvatar={true}
            pathColor={"#fff"}
            // showMoreButton
            startId={startId}
            avatarRadius={13}
            pathWidth={0.5}
            root_zoom_ratio={1}
            second_zoom_ratio={1}
            // disabled={true}
            disableShortcut={true}
            // selectedBackgroundColor="#E3E3E3"
            defaultSelectedId={selectedId}
            handleClickNode={(node: any) => {
              if (node) {
                setTargetNode(node);
                if (node.orgType === 2) {
                  toTargetUser(node.staffKey);
                } else if (node.orgType === 3) {
                  toTargetGroup(node.groupKey);
                }
              } else {
                setTargetNode(null);
                setTargetNodeArray([]);
              }
            }}
            handleClickDot={
              clickDot
              // setSelectedId(node._key);
            }
            handleClickExpand={editContract}
            handleMutiSelect={(nodeArray) => {
              setTargetNodeArray(nodeArray);
            }}
            // itemHeight={32}
            // blockHeight={
            //   departmentRef.current ? departmentRef.current.offsetHeight : 0
            // }
          />
        </div>
      ) : null}
      <React.Fragment>
        {selectedPath && (contactIndex === 3 || contactIndex === 4) ? (
          <div className="contact-tree-path">
            <Breadcrumb separator=">">
              {selectedPath.map((pathItem: any, pathIndex: number) => {
                return (
                  <Breadcrumb.Item
                    key={"path" + pathIndex}
                    onClick={() => {
                      getGroupTree(
                        pathItem._key,
                        mainEnterpriseGroup,
                        contactIndex
                      );
                      let newCompanyItem = _.cloneDeep(companyItem);
                      if (contactIndex === 3) {
                        newCompanyItem.config.memberStartId = pathItem._key;
                      } else if (contactIndex === 4) {
                        newCompanyItem.config.groupStartId = pathItem._key;
                      }
                      api.member.setConfig(
                        newCompanyItem.groupMemberKey,
                        newCompanyItem.config
                      );
                      dispatch(changeCompanyItem(newCompanyItem));
                    }}
                  >
                    {pathItem.name}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
