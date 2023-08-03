import React, { useState, useEffect, useRef, useCallback } from "react";
import "./company.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Select, Row, Col, Progress, Tooltip } from "antd";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";
import { useAuth } from "../../context/auth";

import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import {
  getGroup,
  setGroupKey,
  getGroupInfo,
} from "../../redux/actions/groupActions";
import {
  getTargetUserInfo,
  setClickType,
} from "../../redux/actions/authActions";

import Avatar from "../../components/common/avatar";
import CompanyHeader from "./companyHeader";
import LiquidChart from "../../components/common/chart/liquidChart";
import LineChart from "../../components/common/chart/lineChart";

import carePng from "../../assets/img/care.png";
import uncarePng from "../../assets/img/uncare.png";
import companyTab1Svg from "../../assets/svg/companyTab1.svg";
import companyTab2Svg from "../../assets/svg/companyTab2.svg";
import companyTab3Svg from "../../assets/svg/companyTab3.svg";
import companyTab4Svg from "../../assets/svg/companyTab4.svg";
import companyUpSvg from "../../assets/svg/companyUp.svg";
import companyDownSvg from "../../assets/svg/companyDown.svg";
import vitality1Svg from "../../assets/svg/vitality1.svg";
import vitality2Svg from "../../assets/svg/vitality2.svg";
import vitality3Svg from "../../assets/svg/vitality3.svg";
import vitality4Svg from "../../assets/svg/vitality4.svg";
import vitality5Svg from "../../assets/svg/vitality5.svg";
import vitality6Svg from "../../assets/svg/vitality6.svg";
import vitality7Svg from "../../assets/svg/vitality7.svg";
import vitality8Svg from "../../assets/svg/vitality8.svg";
import vitality9Svg from "../../assets/svg/vitality9.svg";
import vitality10Svg from "../../assets/svg/vitality10.svg";
import vitality11Svg from "../../assets/svg/vitality11.svg";
import vitality12Svg from "../../assets/svg/vitality12.svg";
import vitality13Svg from "../../assets/svg/vitality13.svg";
import vitality14Svg from "../../assets/svg/vitality14.svg";
import vitality15Svg from "../../assets/svg/vitality15.svg";
import vitality16Svg from "../../assets/svg/vitality16.svg";
import vitality17Svg from "../../assets/svg/vitality17.svg";
import vitality18Svg from "../../assets/svg/vitality18.svg";
import vitality19Svg from "../../assets/svg/vitality19.svg";
import vitality20Svg from "../../assets/svg/vitality20.svg";
import vitality21Svg from "../../assets/svg/vitality21.svg";
import vitality22Svg from "../../assets/svg/vitality22.svg";
import vitality23Svg from "../../assets/svg/vitality23.svg";
import vitality24Svg from "../../assets/svg/vitality24.svg";
const { Option } = Select;
interface CompanyProps {}

const Company: React.FC<CompanyProps> = () => {
  const { deviceState } = useAuth();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const allTask = useTypedSelector((state) => state.auth.allTask);
  const userKey = useTypedSelector((state) => state.auth.userKey);

  const dispatch = useDispatch();
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyListData, setCompanyListData] = useState<any>([]);
  const [companyListData0, setCompanyListData0] = useState<any>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [careType, setCareType] = useState(2);
  const [companyPage, setCompanyPage] = useState(0);
  const [companyTotal, setCompanyTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState(2);
  const [sortType, setSortType] = useState(4);
  const [videoState, setVideoState] = useState(false);
  const groupTabArray = useRef<any>([
    { name: "项目图标", sortType: "", sortOrder: 2 },
    { name: "项目名", sortType: "", sortOrder: 2 },
    { name: "总任务", sortType: 1, sortOrder: 2 },
    { name: "待完成", sortType: 2, sortOrder: 2 },
    { name: "逾期数", sortType: 3, sortOrder: 2 },
    { name: "今日活力", sortType: 4, sortOrder: 2 },
    { name: "昨日活力", sortType: 5, sortOrder: 2 },
    { name: "7天活力趋势", sortType: "", sortOrder: 2 },
    { name: "关注", sortType: "", sortOrder: 2 },
  ]);
  const MemberTabArray = useRef<any>([
    { name: "头像", sortType: "", sortOrder: 2 },
    { name: "姓名", sortType: "", sortOrder: 2 },
    { name: "总活力值", sortType: 1, sortOrder: 2 },
    { name: "待完成度", sortType: 2, sortOrder: 2 },
    { name: "逾期数", sortType: 3, sortOrder: 2 },
    { name: "今日活力", sortType: 4, sortOrder: 2 },
    { name: "昨日活力", sortType: 5, sortOrder: 2 },
    { name: "7天活力趋势", sortType: "", sortOrder: 2 },
    { name: "关注", sortType: "", sortOrder: 2 },
  ]);
  const energyTabArray = useRef<any>([
    { name: "类型", sortType: "", sortOrder: 2 },
    { name: "时间", sortType: "", sortOrder: 2 },
    { name: "干系人", sortType: "", sortOrder: 2 },
    { name: "项目", sortType: "", sortOrder: 2 },
    { name: "操作", sortType: "", sortOrder: 2 },
    { name: "活力值", sortType: "", sortOrder: 2 },
  ]);
  const vitalityArr = useRef<any>([
    "",
    vitality1Svg,
    vitality2Svg,
    vitality3Svg,
    vitality4Svg,
    vitality5Svg,
    vitality6Svg,
    vitality7Svg,
    vitality8Svg,
    vitality9Svg,
    vitality10Svg,
    vitality11Svg,
    vitality12Svg,
    vitality13Svg,
    vitality14Svg,
    vitality15Svg,
    vitality16Svg,
    vitality17Svg,
    vitality18Svg,
    vitality19Svg,
    vitality20Svg,
    vitality21Svg,
    vitality22Svg,
    vitality23Svg,
    vitality24Svg,
    vitality5Svg,
    vitality3Svg,
    vitality7Svg,
    vitality4Svg,
    vitality4Svg,
    vitality4Svg,
    vitality4Svg,
    vitality4Svg,
  ]);
  // let unDistory = useRef<any>(true);
  useEffect(() => {
    setCompanyListData([]);
    setCompanyListData0([]);
    setCompanyPage(1);
  }, [tabIndex]);
  const getListData = useCallback(
    async (
      companyKey: string,
      careType: number,
      tabIndex: number,
      companyPage: number,
      sortType: number,
      sortOrder: number
    ) => {
      let companyRes: any = null;
      if (tabIndex === 0) {
        companyRes = await api.company.getEnterpriseGroupEnergyValueList(
          companyKey,
          moment().startOf("days").valueOf(),
          moment().add(1, "days").startOf("days").valueOf(),
          companyPage,
          20
        );
      } else if (tabIndex === 2) {
        companyRes = await api.company.getEnterpriseMemberList(
          companyKey,
          careType,
          companyPage,
          20,
          sortType,
          sortOrder
        );
      } else {
        companyRes = await api.company.getEnterpriseGroupList(
          companyKey,
          careType,
          companyPage,
          20,
          sortType,
          sortOrder
        );
      }
      // let newCompanyData: any = {};
      if (companyRes.msg === "OK") {
        setCompanyTotal(companyRes.totalNumber);
        if (tabIndex === 0) {
          setCompanyListData0((prevCompanyListData) => {
            if (companyPage === 1) {
              prevCompanyListData = [];
            }
            companyRes.result = companyRes.result.filter((item) => {
              if (item.logType === 3) {
                item.log = item.log + "任务";
              }
              return item.log.indexOf("undefined") === -1;
            });
            return [...prevCompanyListData, ...companyRes.result];
          });
        } else {
          setCompanyListData((prevCompanyListData) => {
            if (companyPage === 1) {
              prevCompanyListData = [];
            }
            companyRes.result = companyRes.result.map((item) => {
              item.energyValueArray = item.energyValueArray.map(
                (energyItem) => {
                  return {
                    name: moment(energyItem.date).format("dddd"),
                    value: energyItem.value,
                  };
                }
              );
              return item;
            });
            return [...prevCompanyListData, ...companyRes.result];
          });
        }
      } else {
        dispatch(setMessage(true, companyRes.msg, "error"));
      }
    },
    [dispatch]
  );
  const getData = useCallback(
    async (companyKey) => {
      // let newCompanyData: any = {};
      let companyRes: any = await api.company.getEnterpriseGroupData(
        companyKey
      );
      if (companyRes.msg === "OK") {
        setCompanyData(companyRes.result);
      } else {
        dispatch(setMessage(true, companyRes.msg, "error"));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (mainEnterpriseGroup.mainEnterpriseGroupKey) {
      dispatch(getGroupInfo(mainEnterpriseGroup.mainEnterpriseGroupKey));
      getData(mainEnterpriseGroup.mainEnterpriseGroupKey);
      setVideoState(false);
    } else {
      setVideoState(true);
    }
  }, [mainEnterpriseGroup, getData, dispatch]);
  useEffect(() => {
    if (mainEnterpriseGroup.mainEnterpriseGroupKey) {
      getListData(
        mainEnterpriseGroup.mainEnterpriseGroupKey,
        careType,
        tabIndex,
        1,
        sortType,
        sortOrder
      );
    }
    //eslint-disable-next-line
  }, [
    tabIndex,
    careType,
    getListData,
    mainEnterpriseGroup.mainEnterpriseGroupKey,
    sortType,
    sortOrder,
  ]);

  const changeCare = (type: number, key: string, index: number) => {
    let newCompanyListData = _.cloneDeep(companyListData);
    let status: number = newCompanyListData[index].isCare ? 2 : 1;
    newCompanyListData[index].isCare = !newCompanyListData[index].isCare;
    api.auth.dealCareFriendOrGroup(type, key, status);
    setCompanyListData(newCompanyListData);
  };
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3, null, 2));
  };
  const toTargetUser = async (targetUserKey: string) => {
    dispatch(getTargetUserInfo(targetUserKey));
    if (targetUserKey !== userKey) {
      dispatch(setCommonHeaderIndex(2));
      dispatch(setClickType("out"));
    } else {
      dispatch(setCommonHeaderIndex(1));
      setClickType("self");
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
  };
  const scrollListData = (e) => {
    let page = companyPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      companyListData.length < companyTotal
    ) {
      page = page + 1;
      setCompanyPage(page);
      getListData(
        mainEnterpriseGroup.mainEnterpriseGroupKey,
        careType,
        tabIndex,
        page,
        sortType,
        sortOrder
      );
    }
  };
  return (
    <div className="companyBasic">
      <CompanyHeader videoState={videoState} />
      <div className="companyBasic-container">
        {videoState ? (
          <div className="companyBasic-video-container">
            <div className="companyBasic-video-title">
              观看workfly课程，快速了解workfly功能
            </div>
            <div className="companyBasic-video-box">
              <Row gutter={[16, 14]}>
                <Col span={8}>
                  {/* 什么是workfly?  */}
                  <video
                    src="https://cdn-icare.qingtime.cn/1627093401559_workingVip"
                    controls
                    controlsList="nodownload"
                    poster="https://cdn-icare.qingtime.cn/1627093401559_workingVip?vframe/jpg/offset/10"
                  >
                    您的浏览器不支持 video 标签。
                  </video>
                </Col>
                <Col span={8}>
                  {/* 如何发布任务? */}
                  <video
                    src="https://cdn-icare.qingtime.cn/1627093458786_workingVip"
                    controls
                    controlsList="nodownload"
                    poster="https://cdn-icare.qingtime.cn/1627093458786_workingVip?vframe/jpg/offset/4"
                  >
                    您的浏览器不支持 video 标签。
                  </video>
                </Col>
                <Col span={8}>
                  {/* 如何新建项目？ */}
                  <video
                    src="https://cdn-icare.qingtime.cn/1627432844422_workingVip"
                    controls
                    controlsList="nodownload"
                    poster="https://cdn-icare.qingtime.cn/1627093489677_workingVip?vframe/jpg/offset/4"
                  >
                    您的浏览器不支持 video 标签。
                  </video>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <Row gutter={[16, 14]}>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-item">
                  <div className="companyBasic-tab-item-top">
                    <img src={companyTab1Svg} alt="" />
                    <span>
                      {companyData?.yestodayMyEnergyValue
                        ? +companyData?.yestodayMyEnergyValue.toFixed(1)
                        : 0}
                    </span>
                  </div>
                  <div className="companyBasic-tab-item-bottom">
                    昨日我的活力 同比{" "}
                    {companyData?.yestodayMyEnergyValueTB ? (
                      companyData.yestodayMyEnergyValueTB > 0 ? (
                        <span style={{ color: "#19b781" }}>
                          {"↑ " + companyData.yestodayMyEnergyValueTB}{" "}
                        </span>
                      ) : (
                        <span style={{ color: "#ff504f" }}>
                          {companyData.yestodayMyEnergyValueTB
                            .toString()
                            .replace("-", "↓ ")}{" "}
                        </span>
                      )
                    ) : (
                      0
                    )}
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-item">
                  <div className="companyBasic-tab-item-top">
                    <img src={companyTab2Svg} alt="" />
                    <span>
                      {companyData?.yestodayUserAverageEnergy
                        ? +companyData?.yestodayUserAverageEnergy.toFixed(1)
                        : 0}
                    </span>
                  </div>
                  <div className="companyBasic-tab-item-bottom">
                    昨日人均活力 同比{" "}
                    {companyData?.yestodayUserAverageEnergyTB ? (
                      companyData.yestodayUserAverageEnergyTB > 0 ? (
                        <span style={{ color: "#19b781" }}>
                          {"↑ " + companyData.yestodayUserAverageEnergyTB}{" "}
                        </span>
                      ) : (
                        <span style={{ color: "#ff504f" }}>
                          {companyData.yestodayUserAverageEnergyTB
                            .toString()
                            .replace("-", "↓ ")}{" "}
                        </span>
                      )
                    ) : (
                      0
                    )}
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-item">
                  <div className="companyBasic-tab-item-top">
                    <img src={companyTab3Svg} alt="" />
                    <span>
                      {companyData?.clockInUserNumber} /{" "}
                      <span style={{ fontSize: "14px" }}>
                        {companyData?.totalUserNumber}
                      </span>
                    </span>
                  </div>
                  <div className="companyBasic-tab-item-bottom">
                    今日打卡人数/总人数
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-item">
                  <div className="companyBasic-tab-item-top">
                    <img src={companyTab4Svg} alt="" />
                    <div>
                      {companyData ? (
                        deviceState === "xl" || deviceState === "xxl" ? (
                          <LiquidChart
                            percent={parseFloat(
                              (
                                companyData.userOnlineNumber /
                                companyData.totalUserNumber
                              ).toFixed(1)
                            )}
                            zoom={0.2}
                            liquidId={"companyBasic-top-liquid"}
                            fillColor={"#1890ff"}
                          />
                        ) : (
                          <Progress
                            percent={
                              allTask[0] > 0
                                ? parseFloat(
                                    (
                                      (allTask[0] - allTask[1]) /
                                      allTask[0]
                                    ).toFixed(1)
                                  ) * 100
                                : 0
                            }
                            type="circle"
                            size="small"
                            status="active"
                            width={50}
                          />
                        )
                      ) : null}
                    </div>
                  </div>
                  <div className="companyBasic-tab-item-bottom">员工上线率</div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-bottomItem">
                  <div className="companyBasic-tab-bottomItem-title">
                    我的今日完成度
                  </div>
                  <div className="companyBasic-tab-bottomItem-chart">
                    {companyData && !isNaN(companyData.myTodayFinishPercent) ? (
                      deviceState === "xl" || deviceState === "xxl" ? (
                        <LiquidChart
                          percent={companyData.myTodayFinishPercent / 100}
                          zoom={0.3}
                          liquidId={"companyBasic-bottom-liquid1"}
                          fillColor={"#1890ff"}
                        />
                      ) : (
                        <Progress
                          percent={companyData.myTodayFinishPercent / 100}
                          type="circle"
                          size="small"
                          status="active"
                          width={120}
                        />
                      )
                    ) : null}
                  </div>

                  <div
                    className="companyBasic-tab-item-bottom"
                    style={{ width: "100%" }}
                  >
                    今日活力{" "}
                    {companyData?.todayMyEnergyValue
                      ? +companyData?.todayMyEnergyValue.toFixed(1)
                      : 0}{" "}
                    比昨日{" "}
                    {companyData ? (
                      companyData.todayMyEnergyValue -
                        companyData.yestodayMyEnergyValue >
                      0 ? (
                        <span style={{ color: "#19b781" }}>
                          {"↑ " +
                            (
                              companyData.todayMyEnergyValue -
                              companyData.yestodayMyEnergyValue
                            ).toFixed(1)}{" "}
                        </span>
                      ) : (
                        <span style={{ color: "#ff504f" }}>
                          {(
                            companyData.todayMyEnergyValue -
                            companyData.yestodayMyEnergyValue
                          )
                            .toFixed(1)
                            .toString()
                            .replace("-", "↓ ")}{" "}
                        </span>
                      )
                    ) : (
                      0
                    )}
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-bottomItem">
                  <div className="companyBasic-tab-bottomItem-title">
                    昨日·项目活力榜
                  </div>
                  <div className="companyBasic-tab-bottomItem-content">
                    {companyData?.getYestodayGroupEnergyRankingList.map(
                      (item, index) => {
                        return (
                          <div
                            className="companyBasic-tab-bottomItem-item"
                            key={"yestodayGroupEnergy" + index}
                            onClick={() => {
                              toTargetGroup(item.groupKey);
                            }}
                          >
                            <div className="companyBasic-tab-bottomItem-left">
                              <div>{index + 1}</div>
                              <div
                                className="companyBasic-tab-bottomItem-img"
                                style={{ borderRadius: "5px" }}
                              >
                                <Avatar
                                  avatar={item.groupLogo}
                                  name={item.groupName}
                                  type={"group"}
                                  index={index}
                                />
                              </div>
                              <div>{item.groupName}</div>
                            </div>
                            <div>
                              {item.energyValue
                                ? parseInt(item.energyValue)
                                : 0}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-bottomItem">
                  <div className="companyBasic-tab-bottomItem-title">
                    昨日·创造之星
                  </div>
                  <div className="companyBasic-tab-bottomItem-content">
                    {companyData?.getYestodayCreatorRankingList.map(
                      (item, index) => {
                        return (
                          <div
                            className="companyBasic-tab-bottomItem-item"
                            key={"yestodayCreator" + index}
                            onClick={() => {
                              toTargetUser(item.userKey);
                            }}
                          >
                            <div className="companyBasic-tab-bottomItem-left">
                              <div>{index + 1}</div>
                              <div
                                className="companyBasic-tab-bottomItem-img"
                                style={{ borderRadius: "50%" }}
                              >
                                <Avatar
                                  avatar={item.avatar}
                                  name={item.nickName}
                                  type={"person"}
                                  index={index}
                                />
                              </div>
                              <div>{item.nickName}</div>
                            </div>
                            <div>
                              {item.createNumber ? item.createNumber : 0}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={12} xs={24}>
                <div className="companyBasic-tab-bottomItem">
                  <div className="companyBasic-tab-bottomItem-title">
                    昨日·执行之王
                  </div>
                  <div className="companyBasic-tab-bottomItem-content">
                    {companyData?.getYestodayExecutorRankingList.map(
                      (item, index) => {
                        return (
                          <div
                            className="companyBasic-tab-bottomItem-item"
                            key={"yestodayExecutor" + index}
                            onClick={() => {
                              toTargetUser(item.userKey);
                            }}
                          >
                            <div className="companyBasic-tab-bottomItem-left">
                              <div>{index + 1}</div>
                              <div
                                className="companyBasic-tab-bottomItem-img"
                                style={{ borderRadius: "50%" }}
                              >
                                <Avatar
                                  avatar={item.avatar}
                                  name={item.nickName}
                                  type={"person"}
                                  index={index}
                                />
                              </div>
                              <div>{item.nickName}</div>
                            </div>
                            <div>
                              {item.executeNumber ? item.executeNumber : 0}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <div className="companyBasic-box">
              <div className="companyBasic-box-nav">
                <div className="companyBasic-box-nav-item">
                  <span
                    onClick={() => {
                      setTabIndex(0);
                      setCompanyPage(1);
                    }}
                    style={
                      tabIndex === 0
                        ? { borderBottom: "2px solid #fff", color: "#fff" }
                        : {}
                    }
                  >
                    活力看板
                  </span>
                </div>
                <div className="companyBasic-box-nav-item">
                  <span
                    onClick={() => {
                      setTabIndex(1);
                      setCompanyPage(1);
                    }}
                    style={
                      tabIndex === 1
                        ? { borderBottom: "2px solid #fff", color: "#fff" }
                        : {}
                    }
                  >
                    {careType === 2 ? "关注" : "参与"}项目
                  </span>
                </div>
                <div className="companyBasic-box-nav-item">
                  <span
                    onClick={() => {
                      setTabIndex(2);
                      setCompanyPage(1);
                    }}
                    style={
                      tabIndex === 2
                        ? { borderBottom: "2px solid #fff", color: "#fff" }
                        : {}
                    }
                  >
                    {careType === 2 ? "关注" : "参与"}队友
                  </span>
                </div>
                {tabIndex !== 0 ? (
                  <Select
                    value={careType}
                    style={{ width: 120 }}
                    onChange={(value) => {
                      setCareType(value);
                      setCompanyPage(1);
                    }}
                  >
                    <Option value={2}>我关注的</Option>
                    <Option value={1}>我参与的</Option>
                  </Select>
                ) : null}
              </div>
              <div className="company-group-th">
                {tabIndex === 0
                  ? energyTabArray.current.map((energyItem, energyIndex) => {
                      return (
                        <div
                          key={"groupTh" + energyIndex}
                          className="energy-box"
                        >
                          {energyItem.name}
                        </div>
                      );
                    })
                  : tabIndex === 2
                  ? MemberTabArray.current.map((memberItem, memberIndex) => {
                      return (
                        <div
                          key={"memberTh" + memberIndex}
                          onClick={() => {
                            setSortOrder(sortOrder === 1 ? 2 : 1);
                            setSortType(memberItem.sortType);
                          }}
                        >
                          {memberItem.sortType ? (
                            <img
                              src={
                                sortType === memberItem.sortType
                                  ? sortOrder === 2
                                    ? companyDownSvg
                                    : companyUpSvg
                                  : companyDownSvg
                              }
                              alt=""
                              style={{ marginRight: "6px" }}
                            />
                          ) : null}
                          {memberItem.name}
                        </div>
                      );
                    })
                  : groupTabArray.current.map((groupItem, groupIndex) => {
                      return (
                        <div
                          key={"groupTh" + groupIndex}
                          onClick={() => {
                            setSortOrder(sortOrder === 1 ? 2 : 1);
                            setSortType(groupItem.sortType);
                          }}
                        >
                          {groupItem.sortType ? (
                            <img
                              src={
                                sortType === groupItem.sortType
                                  ? sortOrder === 2
                                    ? companyDownSvg
                                    : companyUpSvg
                                  : companyDownSvg
                              }
                              alt=""
                              style={{ marginRight: "6px" }}
                            />
                          ) : null}
                          {groupItem.name}
                        </div>
                      );
                    })}
              </div>

              <div className="company-group-body" onScroll={scrollListData}>
                {companyListData
                  ? tabIndex === 0
                    ? companyListData0.map(
                        (companyEnergyItem, companyEnergyIndex) => {
                          return (
                            <div
                              className="company-group-tr"
                              key={"companyEnergy" + companyEnergyIndex}
                            >
                              <div style={{ width: "10%" }}>
                                <img
                                  src={
                                    vitalityArr.current[
                                      companyEnergyItem.logType
                                    ]
                                  }
                                  style={{ width: "15px", height: "15px" }}
                                  alt=""
                                />
                              </div>
                              <div style={{ width: "10%" }}>
                                {moment(companyEnergyItem.createTime).format(
                                  "HH:mm"
                                )}
                              </div>
                              <div style={{ width: "20%" }}>
                                <Avatar
                                  avatar={companyEnergyItem?.userAvatar}
                                  name={companyEnergyItem.userName}
                                  type={"person"}
                                  index={companyEnergyIndex}
                                  size={26}
                                />
                                &nbsp;&nbsp;{companyEnergyItem.userName}
                              </div>
                              <div style={{ width: "20%" }}>
                                <Avatar
                                  avatar={companyEnergyItem?.groupLogo}
                                  name={companyEnergyItem.groupName}
                                  type={"group"}
                                  index={companyEnergyIndex}
                                  size={26}
                                />
                                &nbsp;&nbsp;{companyEnergyItem.groupName}
                              </div>
                              <div
                                className="toLong"
                                style={{
                                  width: "30%",
                                  display: "inline-block",
                                }}
                              >
                                <Tooltip title={companyEnergyItem.log}>
                                  {companyEnergyItem.log}
                                </Tooltip>
                              </div>
                              <div>
                                <span
                                  style={{
                                    backgroundColor:
                                      companyEnergyItem.energyValue > 0
                                        ? "#86B93F"
                                        : "#E94848",
                                    borderRadius: "8px",
                                    padding: "0px 6px",
                                    boxSizing: "border-box",
                                    color: "#fff",
                                    height: "20px",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {companyEnergyItem.energyValue > 0
                                    ? "+"
                                    : null}
                                  {companyEnergyItem.energyValue}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )
                    : tabIndex === 2
                    ? companyListData.map(
                        (companyGroupItem, companyGroupIndex) => {
                          return (
                            <div
                              className="company-group-tr"
                              key={"companyGroup" + companyGroupIndex}
                              onClick={() => {
                                toTargetUser(companyGroupItem.userKey);
                              }}
                            >
                              <div>
                                <div style={{ borderRadius: "50%" }}>
                                  <Avatar
                                    avatar={companyGroupItem?.avatar}
                                    name={companyGroupItem.nickName}
                                    type={"person"}
                                    index={companyGroupIndex}
                                  />
                                </div>
                              </div>
                              <div className="toLong">
                                {companyGroupItem.nickName}
                              </div>
                              <div>
                                {parseInt(companyGroupItem.energyValueTotal)}
                              </div>
                              <div>{companyGroupItem.notFinishTaskNumber}</div>
                              <div>{companyGroupItem.overTimeTaskNumber}</div>
                              <div>
                                {!isNaN(
                                  parseInt(companyGroupItem.todayEnergyValue)
                                )
                                  ? parseInt(companyGroupItem.todayEnergyValue)
                                  : 0}
                              </div>
                              <div>
                                {!isNaN(parseInt(companyGroupItem.energyValue))
                                  ? parseInt(companyGroupItem.energyValue)
                                  : 0}
                              </div>

                              <div>
                                {companyGroupItem.energyValueArray ? (
                                  <LineChart
                                    data={companyGroupItem.energyValueArray}
                                    chartHeight={60}
                                    lineId={
                                      "groupLine" +
                                      (careType === 1 ? "join" : "care") +
                                      companyGroupIndex
                                    }
                                    zoom={0.5}
                                  />
                                ) : null}
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeCare(
                                    1,
                                    companyGroupItem.userKey,
                                    companyGroupIndex
                                  );
                                }}
                              >
                                <img
                                  src={
                                    companyGroupItem.isCare
                                      ? carePng
                                      : uncarePng
                                  }
                                  alt=""
                                  style={{ width: "28px", height: "26px" }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )
                    : companyListData.map(
                        (companyMemberItem, companyMemberIndex) => {
                          return (
                            <div
                              className="company-group-tr"
                              key={"companyMember" + companyMemberIndex}
                              onClick={() => {
                                toTargetGroup(companyMemberItem.groupKey);
                              }}
                            >
                              <div>
                                <div>
                                  <Avatar
                                    avatar={companyMemberItem?.groupLogo}
                                    name={companyMemberItem.groupName}
                                    type={"group"}
                                    index={companyMemberIndex}
                                  />
                                </div>
                              </div>
                              <div className="toLong">
                                {companyMemberItem.groupName}
                              </div>
                              <div> {companyMemberItem.serialNumber}</div>
                              <div>
                                {companyMemberItem.notFinishTaskNumber}{" "}
                              </div>
                              <div>{companyMemberItem.overTimeTaskNumber}</div>
                              <div>
                                {!isNaN(
                                  parseInt(companyMemberItem.todayEnergyValue)
                                )
                                  ? parseInt(companyMemberItem.todayEnergyValue)
                                  : 0}
                              </div>
                              <div>
                                {!isNaN(parseInt(companyMemberItem.energyValue))
                                  ? parseInt(companyMemberItem.energyValue)
                                  : 0}{" "}
                              </div>

                              <div>
                                {companyMemberItem.energyValueArray ? (
                                  <LineChart
                                    data={companyMemberItem.energyValueArray}
                                    chartHeight={60}
                                    lineId={
                                      "groupMember" +
                                      (careType === 1 ? "join" : "care") +
                                      companyMemberIndex
                                    }
                                    zoom={0.5}
                                  />
                                ) : null}
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeCare(
                                    2,
                                    companyMemberItem.groupKey,
                                    companyMemberIndex
                                  );
                                }}
                              >
                                <img
                                  src={
                                    companyMemberItem.isCare
                                      ? carePng
                                      : uncarePng
                                  }
                                  alt=""
                                  style={{ width: "28px", height: "26px" }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )
                  : null}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
Company.defaultProps = {};
export default Company;
