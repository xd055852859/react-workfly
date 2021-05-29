import React, { useState, useEffect, useRef, useCallback } from "react";
import "./contact.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Breadcrumb } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Tree } from "tree-graph-react";
import api from "../../services/api";
import _ from "lodash";
import { usePrevious } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";
import { getMember } from "../../redux/actions/memberActions";
import {
  getGroup,
  setGroupKey,
  getGroupInfo,
} from "../../redux/actions/groupActions";
import {
  setCommonHeaderIndex,
  setChatState,
  setShowChatState,
} from "../../redux/actions/commonActions";
import {
  getTargetUserInfo,
  setClickType,
} from "../../redux/actions/authActions";
import {
  setHeaderIndex,
  changeCompanyItem,
} from "../../redux/actions/memberActions";

import Loading from "../../components/common/loading";
import Dialog from "../../components/common/dialog";
import Avatar from "../../components/common/avatar";

import checkPersonPng from "../../assets/img/checkPerson.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import carePng from "../../assets/img/care.png";
import chatSvg from "../../assets/svg/chat.svg";
import uncarePng from "../../assets/img/uncare.png";
import contactTree from "../../assets/svg/contactTree.svg";
import contactBook from "../../assets/svg/contactBook.svg";
import computer from "../../assets/svg/computer.svg";
import { useMount } from "../../hook/common";

export interface ContactProps {
  contactIndex: number;
  contactType?: string;
}

const Contact: React.FC<ContactProps> = (props) => {
  const { contactIndex, contactType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const companyMemberArray = useTypedSelector(
    (state) => state.member.companyMemberArray
  );
  const companyItem = useTypedSelector((state) => state.member.companyItem);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [contactArray, setContactArray] = useState<any>([]);
  const [contactKey, setContactKey] = useState<any>(null);
  const [contactSearchInput, setContactSearchInput] = useState("");
  const [cloneGroupKey, setCloneGroupKey] = useState("");
  const [cloneGroupName, setCloneGroupName] = useState("");
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [cloneGroupIndex, setCloneGroupIndex] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [targetNode, setTargetNode] = useState<any>(null);

  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useMount(() => {
    setLoading(true);
    dispatch(getGroup(3, null, 2));
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    dispatch(getMember(mainGroupKey, 2));
  }, [mainGroupKey, dispatch]);
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
                name: data[key].name,
                // data[key].orgType === 1
                //   ? data[key].name
                //   : data[key].name +
                //     ' (' +
                //     (data[key].post ? data[key].post : '无职务') +
                //     ' )',
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
                  index === 3 ? data[key].avatar : data[key].groupLogo;
              }
              if (!nodeId && !data[key].parentOrgKey) {
                nodeId = data[key]._key;
                newCompanyData[key].icon = info.mainEnterpriseGroupLogo
                  ? info.mainEnterpriseGroupLogo
                  : defaultGroupPng;
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
  useEffect(() => {
    if (groupArray && contactIndex === 0) {
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
      } else if (localStorage.getItem("mainEnterpriseGroupKey") === "out") {
        newGroupArray = groupArray.filter((item: any) => {
          return !item.enterpriseGroupKey && item.enterprise !== 2;
        });
      } else {
        newGroupArray = groupArray;
      }
      setContactArray(newGroupArray);
    }
  }, [groupArray, contactIndex, mainEnterpriseGroup]);

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
        setContactArray(groupArray);
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
  }, [
    prevContactSearchInput,
    contactSearchInput,
    contactIndex,
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
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3, null, 2));
  };
  const toTargetUser = async (targetUserKey: string) => {
    if (targetUserKey !== user._key) {
      dispatch(getTargetUserInfo(targetUserKey));
      dispatch(setCommonHeaderIndex(2));
      dispatch(setClickType("out"));
    } else {
      dispatch(setCommonHeaderIndex(1));
      setClickType("self");
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    if (contactType === "header") {
      dispatch(getMember(mainGroupKey, 2));
    }
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
        item.groupName.toUpperCase().indexOf(searchInput.toUpperCase()) !== -1
      );
    });
    setContactArray(newContactArray);
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      cloneGroupKey,
      cloneGroupName + "_副本"
    );
    if (cloneRes.msg === "OK") {
      dispatch(setMessage(true, "克隆项目成功", "success"));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3, null, 2));
      setCloneGroupVisible(false);
    } else {
      dispatch(setMessage(true, cloneRes.msg, "error"));
    }
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
  return (
    <div
      className="contact"
      style={{
        height: contactType ? "100%" : "calc(100% - 40px)",
        position:
          contactIndex === 3 || contactIndex === 4 ? "relative" : "static",
      }}
    >
      {loading ? <Loading /> : null}
      {contactType && contactIndex === 0 ? (
        <div className="contact-search">
          <SearchOutlined />
          <input
            type="text"
            value={contactSearchInput}
            onChange={(e: any) => {
              setContactSearchInput(e.target.value);
              searchGroup(e.target.value);
            }}
            className="contact-search-input"
            placeholder="请输入项目名"
            onKeyDown={(e: any) => {
              if (e.keyCode === 13) {
                searchGroup();
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
      ) : null}
      {contactIndex === 0 || contactIndex === 1 ? (
        contactArray && contactArray.length > 0 ? (
          contactArray.map((item: any, index: number) => {
            let name = contactIndex ? item.nickName : item.groupName;
            let avatar = contactIndex ? item.avatar : item.groupLogo;
            let key = contactIndex ? item.userId : item._key;
            let onlineColor =
              item.onlineStatus === "online"
                ? "#7ED321"
                : item.onlineStatus === "busy"
                ? "#EA3836"
                : item.onlineStatus === "away"
                ? "#F5A623"
                : "#B3B3B3";
            return (
              <div
                className="contact-item"
                key={"contact" + index}
                onClick={() => {
                  if (contactType === "create") {
                    setCloneGroupKey(key);
                    setCloneGroupName(name);
                    setCloneGroupIndex(index);
                    setCloneGroupVisible(true);
                    // ;
                  } else {
                    contactIndex ? toTargetUser(key) : toTargetGroup(key);
                  }
                }}
                style={
                  cloneGroupIndex === index
                    ? { backgroundColor: "#f0f0f0" }
                    : {}
                }
              >
                <div
                  className="contact-left"
                  style={{ width: contactType ? "100%" : "calc(100% - 75px)" }}
                >
                  <div
                    className="contact-avatar"
                    style={{ borderRadius: contactIndex ? "50%" : "5px" }}
                  >
                    <Avatar
                      name={name}
                      avatar={avatar}
                      type={contactIndex ? "person" : "group"}
                      index={index}
                    />
                  </div>
                  {contactIndex ? (
                    <div
                      className="contact-online"
                      style={{ backgroundColor: onlineColor }}
                    ></div>
                  ) : null}
                  <div className="contact-left-title">{name}</div>

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
                <div className="contact-icon-right">
                  {!contactType && !item.notActive ? (
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
                        setContactKey(contactIndex ? key : item.groupUUID);
                      }}
                    />
                  ) : null}
                  {contactType === "create" && cloneGroupIndex === index ? (
                    <img
                      src={checkPersonPng}
                      alt=""
                      style={{
                        width: "20px",
                        height: "12px",
                      }}
                    ></img>
                  ) : null}
                  {!contactType && item.knowledgeBaseNodeKey ? (
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
                  ) : null}
                  {!contactType && item.isHasKnowledge ? (
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
                      }}
                    ></img>
                  ) : null}
                  {!contactType ? (
                    item.isCare ? (
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
                    ) : (
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
                    )
                  ) : null}
                  {item.onlineStatus === "online" && !contactType ? (
                    <img
                      src={computer}
                      alt=""
                      style={{
                        width: "20px",
                        height: "17px",
                        marginLeft: "5px",
                      }}
                    ></img>
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
              </div>
            );
          })
        ) : null
      ) : companyData && startId ? (
        <div style={{ marginTop: "40px" }}>
          <Tree
            // disabled
            itemHeight={32}
            blockHeight={25}
            columnSpacing={25}
            singleColumn={true}
            nodes={companyData}
            uncontrolled={false}
            showAvatar={true}
            pathColor={'#fff'}
            // showMoreButton
            startId={startId}
            pathWidth={0.5}
            root_zoom_ratio={1}
            second_zoom_ratio={1}
            // selectedBackgroundColor="#E3E3E3"
            defaultSelectedId={selectedId}
            handleClickNode={(node: any) => {
              setTargetNode(node);
              if (node.orgType === 2) {
                toTargetUser(node.staffKey);
              } else if (node.orgType === 3) {
                toTargetGroup(node.groupKey);
              }
            }}
            handleClickDot={
              clickDot
              // setSelectedId(node._key);
            }
            handleClickExpand={editContract}
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

      <Dialog
        visible={cloneGroupVisible}
        onClose={() => {
          setCloneGroupVisible(false);
        }}
        onOK={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={"克隆群"}
        dialogStyle={{ width: "400px", height: "200px" }}
      >
        <div className="dialog-onlyTitle">是否克隆群:{cloneGroupName}</div>
      </Dialog>
    </div>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
