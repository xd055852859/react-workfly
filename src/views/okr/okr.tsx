import React, { useState, useEffect } from "react";
import "./okr.css";
import "../calendar/calendar.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _ from "lodash";
import OkrHeader from "./okrHeader";
import downArrowPng from "../../assets/img/downArrow.png";
import Avatar from "../../components/common/avatar";
import DropMenu from "../../components/common/dropMenu";
import ClickOutside from "../../components/common/clickOutside";
import OkrTable from "./okrTable";
import OkrTree from "./okrTree";
import OkrList from "./okrList";
import OkrStatistics from "./okrStatistics";
import Empty from "../../components/common/empty";
import api from "../../services/api";
import { setMessage } from "../../redux/actions/commonActions";
import { useMount } from "../../hook/common";
import moment from "moment";
import { Progress } from "antd";
interface OkrProps {}
const Okr: React.FC<OkrProps> = (props) => {
  // const { } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const okrMemberKey = useTypedSelector((state) => state.auth.okrMemberKey);
  const [okrHeaderIndex, setOkrHeaderIndex] = useState(0);
  const [memberVisible, setMemberVisible] = useState(false);
  const [memberIndex, setMemberIndex] = useState<any>(0);
  const [memberList, setMemberList] = useState<any>([]);
  const [memberKey, setMemberKey] = useState<any>(null);
  const [memberRole, setMemberRole] = useState<any>(null);
  const [targetRole, setTargetRole] = useState<any>(null);
  const [periodList, setPeriodList] = useState<any>([]);
  const [historyPeriodList, setHistoryPeriodList] = useState<any>([]);
  const [historyPeriodIndex, setHistoryPeriodIndex] = useState<number>(1000000);

  const [periodIndex, setPeriodIndex] = useState<number>(1000000);
  const [periodKey, setPeriodKey] = useState<string>(null);
  const [periodTitle, setPeriodTitle] = useState<string>("");
  const [nodeKey, setNodeKey] = useState<string>(null);
  const [okrList, setOkrList] = useState<any>([]);
  const [okrTree, setOkrTree] = useState<any>(null);

  const ologoType = [
    { title: "普通", color: "#009fe0", bgColor: "#edf5ff" },
    { title: "中等", color: "#1cb75f", bgColor: "#eafdf2" },
    { title: "重要", color: "#f5a623", bgColor: "#fff9ef" },
    { title: "严重", color: "#ff3d3c", bgColor: "#ffe7e7" },
  ];
  useEffect(() => {
    console.log(periodIndex);
    console.log(periodList[periodIndex]?._key);
    if (periodList[periodIndex]?._key && periodIndex !== 100000) {
      console.log("???");
      setPeriodKey(periodList[periodIndex]._key);
      setPeriodTitle(periodList[periodIndex].title);
      setHistoryPeriodIndex(100000);
      // setNodeKey(periodList[periodIndex].nodeKey);
    }
  }, [periodIndex, periodList]);
  useEffect(() => {
    if (
      historyPeriodList[historyPeriodIndex]?._key &&
      historyPeriodIndex !== 100000
    ) {
      console.log("!!!!");
      setPeriodKey(historyPeriodList[historyPeriodIndex]?._key);
      setPeriodTitle(historyPeriodList[historyPeriodIndex]?.title);
      setPeriodIndex(100000);
      // setNodeKey(periodList[periodIndex].nodeKey);
    }
  }, [historyPeriodList, historyPeriodIndex]);

  useEffect(() => {
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey) {
      getPeriodList();
    }
    //eslint-disable-next-line
  }, [mainEnterpriseGroup?.mainEnterpriseGroupKey]);
  useEffect(() => {
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey && periodKey && user) {
      getMemberList();
    }
    //eslint-disable-next-line
  }, [periodKey, mainEnterpriseGroup?.mainEnterpriseGroupKey]);
  useEffect(() => {
    if (memberKey && mainEnterpriseGroup?.mainEnterpriseGroupKey && periodKey) {
      getOkrList();
    }
    //eslint-disable-next-line
  }, [memberKey, periodKey, mainEnterpriseGroup?.mainEnterpriseGroupKey]);
  useEffect(() => {
    if (
      memberKey &&
      mainEnterpriseGroup?.mainEnterpriseGroupKey &&
      periodList[periodIndex]
    ) {
      getOkrTree();
    }
    //eslint-disable-next-line
  }, [memberKey]);
  useEffect(() => {
    if (memberList.length > 0) {
      let newIndex = _.findIndex(memberList, {
        userKey: okrMemberKey,
      });
      if (newIndex !== -1) {
        setMemberIndex(newIndex);
        setMemberKey(okrMemberKey);
        setMemberRole(memberList[newIndex].groupRole);
        if (memberList[newIndex].nodeKey) {
          setNodeKey(memberList[newIndex].nodeKey);
        } else {
          setNodeKey(null);
        }
      }
    }
  }, [okrMemberKey, memberList]);
  const getPeriodList = async () => {
    let periodRes: any = await api.okr.getOKRPeriodList(
      mainEnterpriseGroup.mainEnterpriseGroupKey
    );
    if (periodRes.msg === "OK") {
      console.log(periodRes.result);
      let newPeriodList: any = [];
      periodRes.result.forEach((item, index) => {
        if (item.isMonth) {
          if (item.startMonth <= moment().month() + 1) {
            newPeriodList[0] = {
              ...item,
              title: `${item.year}年${item.startMonth}月 ${
                item.long !== 1
                  ? "- " + (item.startMonth + item.long - 1) + "月"
                  : ""
              }`,
            };
          } else {
            if (item.startMonth + item.long > 12) {
              newPeriodList[2] = {
                ...item,
                title: `${item.year + 1}年 1月 ${
                  item.long !== 1
                    ? "- " + (item.startMonth + item.long - 1) + "月"
                    : ""
                }`,
              };
            } else {
              console.log(item.startMonth + item.long);
              newPeriodList[2] = {
                ...item,
                title: `${item.year}年${item.startMonth}月 ${
                  item.long !== 1
                    ? "- " + (item.startMonth + item.long - 1) + "月"
                    : ""
                }`,
              };
            }
          }
        } else {
          newPeriodList[1] = {
            ...item,
            title: `${item.year}年年度OKR`,
          };
        }
      });
      console.log(newPeriodList);
      if (localStorage.getItem("periodKey")) {
        let newIndex = _.findIndex(newPeriodList, {
          _key: localStorage.getItem("periodKey"),
        });
        if (newIndex !== -1) {
          setPeriodIndex(newIndex);
        }
      }
      setPeriodList(newPeriodList);
      getHistoryPeriodList(newPeriodList);
    } else {
      dispatch(setMessage(true, periodRes.msg, "error"));
    }
  };
  const getHistoryPeriodList = async (list) => {
    let periodRes: any = await api.okr.getHistoryOKRList(
      mainEnterpriseGroup.mainEnterpriseGroupKey
    );
    if (periodRes.msg === "OK") {
      console.log(periodRes.result);
      let newPeriodList: any = [];
      periodRes.result.forEach((item, index) => {
        if (item._key !== list[0]._key && item._key !== list[1]._key) {
          if (item.isMonth) {
            if (item.startMonth <= moment().month() + 1) {
              newPeriodList.push({
                ...item,
                title: `${item.year}年${item.startMonth}月 ${
                  item.long !== 1
                    ? "- " + (item.startMonth + item.long - 1) + "月"
                    : ""
                }`,
              });
            } else {
              if (item.startMonth + item.long > 12) {
                newPeriodList.push({
                  ...item,
                  title: `${item.year + 1}年 1月 ${
                    item.long !== 1
                      ? "- " + (item.startMonth + item.long - 1) + "月"
                      : ""
                  }`,
                });
              } else {
                console.log(item.startMonth + item.long);
                newPeriodList.push({
                  ...item,
                  title: `${item.year}年${item.startMonth}月 ${
                    item.long !== 1
                      ? "- " + (item.startMonth + item.long - 1) + "月"
                      : ""
                  }`,
                });
              }
            }
          } else {
            newPeriodList.unshift({
              ...item,
              title: `${item.year}年年度OKR`,
            });
          }
        }
      });
      setHistoryPeriodList(newPeriodList);
    } else {
      dispatch(setMessage(true, periodRes.msg, "error"));
    }
  };
  const createPeriod = async () => {
    let periodRes: any = await api.okr.createNextMonthPeriod(
      mainEnterpriseGroup.mainEnterpriseGroupKey
    );
    if (periodRes.msg === "OK") {
      console.log(periodRes.result);
      let newPeriodList: any = _.cloneDeep(periodList);
      let item = periodRes.result;
      if (item.startMonth + item.long > 12) {
        newPeriodList[2] = {
          ...item,
          // title: `${item.year + 1}年
          //       1月 - ${item.long - 1}月`,
          title: `${item.year + 1}年 1月 ${
            item.long !== 1
              ? "- " + (item.startMonth + item.long - 1) + "月"
              : ""
          }`,
        };
      } else {
        newPeriodList[2] = {
          ...item,
          title:
            // `${item.year}年${
            //   item.startMonth < 10 ? "0" + item.startMonth : item.startMonth
            // }月 - ${
            //   item.startMonth + item.long - 1 < 10
            //     ? "0" + (item.startMonth + item.long - 1)
            //     : item.startMonth + item.long - 1
            // }月`,
            `${item.year}年${item.startMonth}月 ${
              item.long !== 1
                ? "- " + (item.startMonth + item.long - 1) + "月"
                : ""
            }`,
        };
      }
      setPeriodList([...newPeriodList]);
    } else {
      dispatch(setMessage(true, periodRes.msg, "error"));
    }
  };
  const getMemberList = async () => {
    let memberRes: any = await api.okr.getOKRUserList(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey
    );
    if (memberRes.msg === "OK") {
      let newMemberList = [...memberRes.result].reverse();
      console.log(newMemberList);
      let index = _.findIndex(newMemberList, { userKey: user._key });
      if (index !== -1) {
        let item = newMemberList[index];
        newMemberList.splice(index, 1);
        newMemberList.unshift(item);
        if (item.nodeKey) {
          setNodeKey(item.nodeKey);
        }
        setTargetRole(item.groupRole);
      }
      if (localStorage.getItem("memberKey")) {
        let newIndex = _.findIndex(newMemberList, {
          userKey: localStorage.getItem("memberKey"),
        });
        if (newIndex !== -1) {
          setMemberIndex(newIndex);
          setMemberKey(localStorage.getItem("memberKey"));
          setMemberRole(newMemberList[newIndex].groupRole);
          if (newMemberList[newIndex].nodeKey) {
            setNodeKey(newMemberList[newIndex].nodeKey);
          } else {
            setNodeKey(null);
          }
        }
      } else {
        setMemberKey(user._key);
      }
      console.log(newMemberList);
      setMemberList([...newMemberList]);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const getOkrList = async () => {
    let okrListRes: any = await api.okr.getOKRDetail(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey,
      memberKey,
      1
    );
    if (okrListRes.msg === "OK") {
      console.log(okrListRes.result);
      okrListRes.result.forEach((item) => {
        let weightNum = 0;
        item.krs.forEach((krItem) => {
          weightNum = +krItem.weight + weightNum;
          if (!krItem.bindGroupInfoArray) {
            krItem.bindGroupInfoArray = [];
          }
          if (!krItem.bindGroupKeyArray) {
            krItem.bindGroupKeyArray = [];
          }
        });
        item.weightNum = weightNum;
        if (!item.bindGroupInfoArray) {
          item.bindGroupInfoArray = [];
        }
        if (!item.bindGroupKeyArray) {
          item.bindGroupKeyArray = [];
        }
      });
      console.log(okrListRes.result);
      setOkrList([...okrListRes.result.reverse()]);
    } else {
      dispatch(setMessage(true, okrListRes.msg, "error"));
    }
  };
  const getOkrTree = async () => {
    let okrTreeRes: any = await api.okr.getOKRDetail(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey,
      memberKey,
      3
    );
    if (okrTreeRes.msg === "OK") {
      let newOkrTree: any = {};
      if (
        okrTreeRes.result?.startOKeyArray &&
        okrTreeRes.result.startOKeyArray.length > 0
      ) {
        for (let key in okrTreeRes.result.resultObject) {
          let item = okrTreeRes.result.resultObject[key];
          newOkrTree[key] = {
            _key: item._key,
            sortList: item.children,
            father: item.upAlignKey,
            name: item.title,
            avatarUri: item.executorAvatar,
          };
        }
        newOkrTree["99999999"] = {
          sortList: okrTreeRes.result.startOKeyArray,
          father: "",
          name: mainEnterpriseGroup.mainEnterpriseGroupName,
          _key: "99999999",
        };

        okrTreeRes.result.startOKeyArray.forEach((item) => {
          console.log(item);
          console.log(newOkrTree[item]);
          newOkrTree[item].father = "99999999";
        });
      }
      console.log(newOkrTree);
      setOkrTree({ ...newOkrTree });
    } else {
      dispatch(setMessage(true, okrTreeRes.msg, "error"));
    }
  };
  const changeOkrList = (
    Okr: any,
    type?: string,
    upKey?: string,
    targetOkrList?: any
  ) => {
    let newOkrList = targetOkrList
      ? _.cloneDeep(targetOkrList)
      : _.cloneDeep(okrList);
    if (!targetOkrList) {
      let index = _.findIndex(okrList, { _key: Okr._key });
      let newIndex = _.findIndex(okrList, { _key: upKey });
      if (index !== -1) {
        if (type === "delete") {
          newOkrList.splice(index, 1);
        } else {
          if (type === "changeUp") {
            delete newOkrList[newIndex].upAlignExecutorAvatar;
            delete newOkrList[newIndex].upAlignExecutorName;
            delete newOkrList[newIndex].upAlignIsFromKr;
            delete newOkrList[newIndex].upAlignKey;
            delete newOkrList[newIndex].upAlignKrKey;
            delete newOkrList[newIndex].upAlignProgress;
            delete newOkrList[newIndex].upAlignTitle;
          }
          let weightNum = 0;
          let progressNum = 0;
          Okr.krs.forEach((krItem) => {
            weightNum = +krItem.weight + weightNum;
            progressNum = +krItem.progress * +krItem.weight + progressNum;
          });
          Okr.weightNum = +weightNum;
          Okr.progress = (progressNum / +weightNum).toFixed(0);
          newOkrList[index] = { ...Okr };
        }
      }
      console.log(newOkrList);
    }
    setOkrList(_.cloneDeep(newOkrList));
  };
  return (
    <>
      {mainEnterpriseGroup?.mainEnterpriseGroupKey ? (
        <div className="okr">
          <OkrHeader
            periodIndex={periodIndex}
            setPeriodIndex={setPeriodIndex}
            periodList={periodList}
            historyPeriodList={historyPeriodList}
            periodKey={periodKey}
            periodTitle={periodTitle}
            ownerUKey={memberKey}
            flashOkr={getOkrList}
            createPeriod={createPeriod}
            memberRole={memberRole}
            targetRole={targetRole}
            setHistoryPeriodIndex={setHistoryPeriodIndex}
            slot={
              <>
                <div
                  className="calendar-name"
                  onClick={() => {
                    setMemberVisible(true);
                  }}
                >
                  <div className="calendar-logo">
                    <Avatar
                      avatar={memberList && memberList[memberIndex]?.avatar}
                      name={memberList && memberList[memberIndex]?.nickName}
                      type={"person"}
                      index={0}
                      size={22}
                    />
                  </div>
                  <div className="calendar-name-title">
                    {memberList && memberList[memberIndex]?.nickName}
                  </div>

                  <img
                    src={downArrowPng}
                    alt=""
                    className="calendar-name-title-logo"
                  />
                  <DropMenu
                    visible={memberVisible}
                    dropStyle={{
                      minWidth: "200px",
                      maxHeight: "calc(100vh - 70px)",
                      top: "65px",
                      left: "0px",
                      color: "#333",
                      overflow: "auto",
                      padding: "10px",
                    }}
                    onClose={() => {
                      setMemberVisible(false);
                    }}
                  >
                    <ClickOutside
                      onClickOutside={() => {
                        setMemberVisible(false);
                      }}
                    >
                      <React.Fragment>
                        {memberList
                          ? memberList.map(
                              (memberItem: any, memberIndex: number) => {
                                return (
                                  <div
                                    className="okr-dropmenu-name"
                                    onClick={() => {
                                      setMemberIndex(memberIndex);
                                      localStorage.setItem(
                                        "memberKey",
                                        memberItem.userKey
                                      );
                                      setMemberKey(memberItem.userKey);
                                      setMemberRole(memberItem.groupRole);
                                      if (memberItem.nodeKey) {
                                        setNodeKey(memberItem.nodeKey);
                                      } else {
                                        setNodeKey(null);
                                      }
                                    }}
                                    key={"member" + memberIndex}
                                  >
                                    <div className="calendar-logo">
                                      <Avatar
                                        name={memberItem.nickName}
                                        avatar={memberItem.avatar}
                                        type={"person"}
                                        index={memberIndex}
                                        size={27}
                                      />
                                    </div>
                                    <div
                                      className="calendar-name-title"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {memberItem.nickName}
                                      {memberItem.oCount ? (
                                        <div
                                          className="okrTable-oLogo"
                                          style={{
                                            color: ologoType[0].color,
                                            backgroundColor:
                                              ologoType[0].bgColor,
                                            width: "45px",
                                            marginLeft: "10px",
                                          }}
                                          // onClick={() => {
                                          //   setOLogoVisible(true);
                                          // }}
                                        >
                                          O : {memberItem.oCount}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              }
                            )
                          : null}
                      </React.Fragment>
                    </ClickOutside>
                  </DropMenu>
                  <Progress
                    type="circle"
                    percent={memberList[memberIndex]?.allOProgress}
                    width={40}
                    strokeWidth={10}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              </>
            }
            changeOkrHeader={(index) => {
              setOkrHeaderIndex(index);
              if (index === 0) {
                getOkrList();
              } else if (index === 1) {
                getOkrTree();
              }
            }}
          />
          <div className="okr-box">
            {okrHeaderIndex === 0 ? (
              <OkrTable
                okrList={okrList}
                memberList={memberList}
                memberKey={memberKey}
                periodList={periodList}
                periodIndex={periodIndex}
                periodKey={periodKey}
                flashOkr={getOkrList}
                changeOkrList={changeOkrList}
                nodeKey={nodeKey}
                memberRole={memberRole}
                targetRole={targetRole}
              />
            ) : null}
            {okrHeaderIndex === 1 ? <OkrTree treeData={okrTree} /> : null}
            {okrHeaderIndex === 2 ? <OkrList okrList={okrList} /> : null}
            {okrHeaderIndex === 3 ? (
              <OkrStatistics
                memberList={memberList}
                periodList={periodList}
                periodIndex={periodIndex}
                periodKey={periodKey}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="okr">
          <div className="okr-header">okr</div>
          <div className="okr-box">
            <Empty description="请选择企业群" />
          </div>
        </div>
      )}
    </>
  );
};
Okr.defaultProps = {};
export default Okr;
