import React, { useState, useRef, useCallback, useEffect } from "react";
import "./content.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import moment from "moment";
import _ from "lodash";
// import { Tabs } from "antd";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";

import TimelineChart from "../../components/common/amChart/timelineChart";
import XYamChart from "../../components/common/amChart/XYamChart";
// import MemberBoard from "../board/memberBoard";
// import MainBoard from "../board/mainBoard";
// import FileList from "../../components/fileList/fileList";
// import FileInfo from "../../components/fileInfo/fileInfo";
import ContentHeader from "./contentHeader";

import bugSvg from "../../assets/svg/bug.svg";
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

import Avatar from "../../components/common/avatar";
import { DatePicker } from "antd";
// const { TabPane } = Tabs;

export interface ContentProps {}
const Content: React.FC<ContentProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  // const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  // const fileVisible = useTypedSelector((state) => state.common.fileVisible);
  // const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);

  // const [prompt, setPrompt] = useState("");
  const [chartData, setChartData] = useState<any>(null);
  const [vitalityData, setVitalityData] = useState<any>(null);
  const [vitalityList, setVitalityList] = useState<any>([]);
  const [vitalityName, setVitalityName] = useState<any>("");
  const [vitalityLogo, setVitalityLogo] = useState<any>("");
  const [vitalityKey, setVitalityKey] = useState<any>("");
  const [vitalityDate, setVitalityDate] = useState<number>(
    moment().startOf("day").valueOf()
  );
  // const [tabKey, setTabKey] = useState<any>("1");

  const colorArr = useRef<any>([
    "rgb(103,183,220)",
    "rgb(128,103,220)",
    "rgb(220,103,206)",
    "rgb(220,105,103)",
    "rgb(220,210,103)",
    "rgb(125,220,103)",
    "rgb(103,220,187)",
    "rgb(128,173,245)",
    "rgb(188,128,245)",
    "rgb(245,128,196)",
    "rgb(245,165,128)",
    "rgb(220,245,128)",
    "rgb(128,245,142)",
    "rgb(128,243,245)",
    "rgb(140,150,255)",
    "rgb(236,140,255)",
    "rgb(255,140,173)",
    "rgb(255,212,140)",
    "rgb(197,255,140)",
    "rgb(140,255,189)",
    "rgb(147,227,255)",
    "rgb(170,147,255)",
    "rgb(255,147,250)",
    "rgb(255,147,147)",
    "rgb(255,250,147)",
    "rgb(170,255,147)",
    "rgb(147,255,228)",
    "rgb(167,210,255)",
    "rgb(221,167,255)",
    "rgb(255,167,232)",
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
  ]);
  // const [tabsetVisible, setTabsetVisible] = useState(false);
  // const [contentConfig, setContentConfig] = useState<any>({
  //   mainCheck: true,
  //   lastCheck: true,
  //   fileCheck: true,
  //   memberCheck: true,
  //   groupCheck: true,
  // });
  const chartRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(true);

  // const getPrompt = useCallback(async () => {
  //   let promptRes: any = await api.auth.getPrompt();
  //   if (unDistory.current) {
  //     if (promptRes.msg === "OK") {
  //       setPrompt(promptRes.result.content);
  //     } else {
  //       dispatch(setMessage(true, promptRes.msg, "error"));
  //     }
  //   }
  // }, [dispatch]);
  const getChartData = useCallback(
    async (type: number, targetDate?: any) => {
      let chartRes: any = await api.common.getChartData(
        type,
        moment(targetDate ? targetDate : vitalityDate)
          .startOf("day")
          .valueOf(),
        moment(targetDate ? targetDate : vitalityDate)
          .endOf("day")
          .valueOf()
      );
      if (unDistory.current) {
        if (chartRes.msg === "OK") {
          let chartData: any = {};
          // chartData.group30EnergyValueStatistics = chartRes.result.group30EnergyValueStatistics.filter((item) => {
          //   item.date = item.date1;
          //   item.value = parseInt(item.sumEnergyValue);
          //   return item
          // })
          // chartData.my7EnergyValueStatistics = _.sortBy(chartRes.result.my7EnergyValueStatistics.filter((item) => {
          //   item.type = item.groupName;
          //   item.value = parseInt(item.sumEnergyValue);
          //   return item.value > 0
          // }), ['value']).reverse()
          chartData.todayGMEnergyValueStatistics = _.sortBy(
            chartRes.result.todayGMEnergyValueStatistics.filter((item) => {
              item.steps =
                item.sumEnergyValue && !isNaN(item.sumEnergyValue)
                  ? item.sumEnergyValue < 100
                    ? parseFloat(item.sumEnergyValue.toFixed(1))
                    : parseInt(item.sumEnergyValue.toFixed(0))
                  : 0;
              item.name =
                item.nickName.length > 5
                  ? item.nickName.substring(0, 3) + "..."
                  : item.nickName;
              item.href = item.avatar;
              return item.steps > 0;
            }),
            ["steps"]
          ).reverse();
          // chartData.todayGroupEnergyValueStatistics = {
          //   name: 'root',
          //   children: []
          // }
          // chartData.todayGroupEnergyValueStatistics.children
          // chartData.todayGroupEnergyValueStatistics = _.sortBy(chartRes.result.todayGroupEnergyValueStatistics.filter((item) => {
          //   item.type = item.groupName;
          //   item.value = parseInt(item.sumEnergyValue);
          //   return item.value > 0
          // }), ['value'])
          console.log(chartData)
          setChartData({ ...chartData });
        } else {
          dispatch(setMessage(true, chartRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  const getVitalityData = useCallback(
    async (
      userKey: string,
      userName: string,
      userLogo: string,
      targetDate?: any
    ) => {
      setVitalityName(userName);
      setVitalityLogo(userLogo);
      setVitalityKey(userKey);
      const dataRes: any = await api.auth.getUserLog(
        moment(targetDate ? targetDate : vitalityDate)
          .startOf("day")
          .valueOf(),
        moment(targetDate ? targetDate : vitalityDate)
          .endOf("day")
          .valueOf(),
        1,
        300,
        userKey
      );
      if (unDistory.current) {
        if (dataRes.msg === "OK") {
          let vitalityData1: any = [];
          let vitalityTime: any = [];
          let vitalityData2: any = [];
          // let count: any = dataRes.yestodayEnergyValue;
          setVitalityList(dataRes.result);
          vitalityData1 = dataRes.result.filter((dataItem, dataIndex) => {
            return (
              dataItem.logType !== 5 ||
              (dataItem.logType === 5 && dataItem.taskType < 3)
            );
          });
          vitalityTime = vitalityData1.map((dataItem, dataIndex) => {
            return dataItem.createTime;
          });
          vitalityData1 = vitalityData1.map((dataItem, dataIndex) => {
            let createIndex = _.sortBy(vitalityTime, "createTime")
              .reverse()
              .indexOf(dataItem.createTime);
            // dataItem.log = dataItem.log
            //   .split("")
            //   .map((item, index) => {
            //     return index === 0 || index % 15 ? item : item + "\n";
            //   })
            //   .join("");
            // dataItem.cardTitle = dataItem.cardTitle.split("").map((item, index) => {
            //   return (index === 0 || index % 10)? item : (item + "\n")
            // }).join("")
            return {
              ...dataItem,
              start: moment(dataItem.createTime).format("YYYY-MM-DD HH:mm"),
              end:
                createIndex !== vitalityTime.length - 1
                  ? moment(vitalityTime[createIndex + 1]).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : moment().endOf("day").format("YYYY-MM-DD HH:mm"),
              category: "normal",
              // textDisabled: false,
              text: dataItem.log,
              icon: vitalityArr.current[dataItem.logType],
              startTime: dataItem.createTime,
              logIndex: dataIndex,
              personName: `${dataItem.creatorName ? dataItem.creatorName : ""}${
                dataItem.creatorName && dataItem.executorName ? "⇀" : ""
              }${dataItem.executorName ? dataItem.executorName : ""}`,
              energyValue:
                dataItem.energyValue > 0
                  ? "+" + dataItem.energyValue
                  : dataItem.energyValue,
            };
          });
          vitalityData2 = dataRes.result.filter((dataItem, dataIndex) => {
            return dataItem.logType === 5 && dataItem.taskType > 2;
          });
          vitalityData2 = vitalityData2.map((dataItem, dataIndex) => {
            return {
              ...dataItem,
              start: moment(dataItem.taskCreateTime).format("YYYY-MM-DD HH:mm"),
              end: moment(dataItem.createTime).format("YYYY-MM-DD HH:mm"),
              category: "bug",
              // textDisabled: false,
              text: dataItem.log,
              icon: bugSvg,
              logIndex: dataIndex,
              startTime: dataItem.taskCreateTime,
              personName: `${dataItem.creatorName ? dataItem.creatorName : ""}${
                dataItem.creatorName && dataItem.executorName ? "⇀" : ""
              }${dataItem.executorName ? dataItem.executorName : ""}`,
              energyValue:
                dataItem.energyValue > 0
                  ? "+" + dataItem.energyValue
                  : dataItem.energyValue,
            };
          });
          setVitalityData(
            _.sortBy([...vitalityData1, ...vitalityData2], "startTime")
          );
        } else {
          dispatch(setMessage(true, dataRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useMount(() => {
    if (localStorage.getItem("config")) {
      //@ts-ignore
      setContentConfig(JSON.parse(localStorage.getItem("config")));
    }
    // getPrompt();
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (user) {
      getVitalityData(
        user._key,
        user.profile.nickName,
        user.profile.avatar,
        vitalityDate
      );
      getChartData(3, vitalityDate);
    }
    //eslint-disable-next-line
  }, [user, vitalityDate]);
  const changeVitalityDate = (date) => {
    setVitalityDate(date.valueOf());
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current > moment().endOf("day");
  };
  // const toTargetUser = async (userKey,userName) => {
  //   getVitalityData(userKey,userName);
  // const chartData: any = args[0].data.data;
  // const targetUserKey = chartData.userKey
  // dispatch(setWorkHeaderIndex(3));
  // if (targetUserKey !== userKey) {
  //   dispatch(getTargetUserInfo(targetUserKey));
  //   dispatch(setCommonHeaderIndex(2));
  // } else {
  //   dispatch(setCommonHeaderIndex(1));
  // }

  // await api.group.visitGroupOrFriend(1, targetUserKey);
  // if (contactType === "header") {
  //   dispatch(getMember(mainGroupKey, 1));
  // }
  // };
  // const clickChart = (chartIndex) => {
  //   setChartVisible(true);
  //   setChartIndex(chartIndex)
  // }
  // const changeConfig = (configType: string, checked: boolean) => {
  //   let newContentConfig = _.cloneDeep(contentConfig);
  //   newContentConfig[configType] = checked;
  //   setContentConfig(newContentConfig);
  //   localStorage.setItem("config", JSON.stringify(newContentConfig));
  // };
  // const contentMenu = (
  //   <div className="content-dot">
  //     <IconFont
  //       type="icon-dot"
  //       onClick={() => {
  //         setTabsetVisible(true);
  //       }}
  //     />
  //     <DropMenu
  //       visible={tabsetVisible}
  //       dropStyle={{
  //         width: "120px",
  //         height: "170px",
  //         top: "48px",
  //         left: "240px",
  //         padding: "10px 0px 10px 15px",
  //         boxSizing: "border-box",
  //         overflow: "hidden",
  //       }}
  //       onClose={() => {
  //         setTabsetVisible(false);
  //       }}
  //       // title={'分配任务'}
  //     >
  //       <div className="content-dot-item">
  //         <Checkbox checked={contentConfig.mainCheck} disabled>
  //           今日
  //         </Checkbox>
  //       </div>
  //       <div className="content-dot-item">
  //         <Checkbox
  //           checked={contentConfig.lastCheck}
  //           onChange={(e: any) => {
  //             changeConfig("lastCheck", e.target.checked);
  //           }}
  //         >
  //           最近
  //         </Checkbox>
  //       </div>
  //       <div className="content-dot-item">
  //         <Checkbox
  //           checked={contentConfig.fileCheck}
  //           onChange={(e: any) => {
  //             changeConfig("fileCheck", e.target.checked);
  //           }}
  //         >
  //           收藏
  //         </Checkbox>
  //       </div>
  //       <div className="content-dot-item">
  //         <Checkbox
  //           checked={contentConfig.memberCheck}
  //           onChange={(e: any) => {
  //             changeConfig("memberCheck", e.target.checked);
  //           }}
  //         >
  //           队友
  //         </Checkbox>
  //       </div>
  //       <div className="content-dot-item">
  //         <Checkbox
  //           checked={contentConfig.groupCheck}
  //           onChange={(e: any) => {
  //             changeConfig("groupCheck", e.target.checked);
  //           }}
  //         >
  //           项目
  //         </Checkbox>
  //       </div>
  //     </DropMenu>
  //   </div>
  // );
  return (
    <div className="content">
      <ContentHeader
        vitalityName={vitalityName}
        vitalityLogo={vitalityLogo}
        vitalityKey={vitalityKey}
        slot={
          <div>
            <DatePicker
              bordered={false}
              value={moment(vitalityDate)}
              onChange={changeVitalityDate}
              allowClear={false}
              suffixIcon={null}
              disabledDate={disabledDate}
            />
            {vitalityDate === moment().startOf("day").valueOf() ? "(今日)" : ""}{" "}
            活力
          </div>
        }
      />
      <div className="content-container">
        {/* <ContentTime>
          <div className="content-subTitle">{prompt}</div>
        </ContentTime> */}
        <div className="content-chartContainer" ref={chartRef}>
          {chartData && chartRef?.current ? (
            <React.Fragment>
              <div className="content-chartContainer-left">
                {/* <div className="content-chartContainer-title">{vitalityName} 今日活力</div> */}
                {/* <DualAxesChart
                  data={vitalityData}
                  dualAxesId="dualAxesContentId"
                  width={chartRef.current.offsetWidth - 10}
                  height={chartRef.current.offsetHeight / 2 - 90} /> */}
                {vitalityData ? (
                  <TimelineChart
                    timelineId="timelineContentId"
                    data={vitalityData}
                    width={chartRef.current.offsetWidth}
                    height={chartRef.current.offsetHeight * 0.7}
                    chartDate={vitalityDate}
                    // onClick={clickChart}
                  />
                ) : null}
              </div>
              <div className="content-chartContainer-right">
                <div>
                  {/* <div className="content-chartContainer-title">今日队友活力
                  </div> */}
                  {/* <BarChart barId="barContentId"
                    data={chartData.todayGMEnergyValueStatistics}
                    width={chartRef.current.offsetWidth / 2 - 10}
                    height={chartRef.current.offsetHeight / 2 - 90}
                    onClick={toTargetUser} /> */}
                  {chartData.todayGMEnergyValueStatistics ? (
                    <XYamChart
                      XYId="XYContentId"
                      data={chartData.todayGMEnergyValueStatistics}
                      width={chartRef.current.offsetWidth - 10}
                      height={chartRef.current.offsetHeight * 0.3 + 30}
                      onClick={getVitalityData}
                    />
                  ) : null}
                </div>
                {/* <RoseChart roseId="roseContentId"
                  data={chartData.my7EnergyValueStatistics}
                  width={chartRef.current.offsetWidth / 2 - 10}
                  height={chartRef.current.offsetHeight / 2 - 65} /> */}
                {/* <div>
                  <div className="content-chartContainer-title">7日项目活力
                  </div>
                  <PieChart pieId="pieContentId"
                    data={chartData.my7EnergyValueStatistics}
                    width={chartRef.current.offsetWidth / 2 - 10}
                    height={chartRef.current.offsetHeight / 2 - 90}
                    fontColor="#fff"
                  />
                </div> */}
              </div>
            </React.Fragment>
          ) : null}
        </div>
        {/*tabBarExtraContent={operations}>*/}
        {/* {fileVisible && fileInfo ? (
          <div className="content-fileContainer">
            <FileInfo />
          </div>
        ) : null} */}
        <div className="content-tabPane">
          {vitalityList.map((item, index) => {
            return (
              <div key={"vitality" + index} className="vitality-item">
                <div className="vitality-header">
                  <div className="vitality-header-left">
                    <div
                      className="vitality-header-img"
                      style={{
                        backgroundColor: colorArr.current[item.logType],
                      }}
                    >
                      <img src={vitalityArr.current[item.logType]} alt="" />
                      <div
                        style={{
                          borderTop: `15px solid  ${
                            colorArr.current[item.logType]
                          }`,
                        }}
                        className="vitality-header-down"
                      ></div>
                    </div>

                    <div className="vitality-header-title">{item.log}</div>
                  </div>
                  <div className="vitality-header-right">
                    {moment(
                      moment().valueOf() - parseInt(item.createTime) > 0
                        ? parseInt(item.createTime)
                        : moment().valueOf() - 3000
                    ).fromNow()}
                  </div>
                </div>
                <div className="vitality-content">{item.cardTitle}</div>
                <div className="vitality-footer">
                  <div className="vitality-footer-left">
                    {item.groupName ? (
                      <React.Fragment>
                        <Avatar
                          name={item.groupName}
                          avatar={item.groupLogo}
                          type={"group"}
                          index={0}
                          size={18}
                        />
                        <div className="vitality-header-title toLong">
                          {item.groupName} / {item.labelName}
                        </div>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <span
                    className="vitality-footer-right"
                    style={{
                      backgroundColor:
                        item.energyValue > 0 ? "#86B93F" : "#E94848",
                      borderRadius: "8px",
                      padding: "0px 6px",
                      boxSizing: "border-box",
                      color: "#fff",
                      height: "20px",
                      lineHeight: "20px",
                    }}
                  >
                    {item.energyValue > 0 ? "+" : null}
                    {item.energyValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* tabBarExtraContent={contentMenu} */}
        {/* <Tabs activeKey={tabKey}
          onChange={(activeKey) => {
            setTabKey(activeKey);
          }} tabBarStyle={{ color: "#fff" }}>
          {contentConfig.mainCheck ? (
            <TabPane tab="今日" key="1">
              <div className="content-tabPane">
                <MainBoard />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.lastCheck ? (
            <TabPane tab="文档" key="2">
              <div className="content-tabPane">
                <FileList
                  groupKey={""}
                  type="文档"
                  fileItemWidth={"calc(100% - 270px)"}
                  tabKey={tabKey}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.fileCheck ? (
            <TabPane tab="收藏" key="3">
              <div className="content-tabPane">
                <FileList
                  groupKey={mainGroupKey}
                  type="收藏"
                  fileItemWidth={"calc(100% - 270px)"}
                  tabKey={tabKey}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.memberCheck ? (
            <TabPane tab="队友" key="4">
              <div className="content-tabPane">
                <MemberBoard boardIndex={0} />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.groupCheck ? (
            <TabPane tab="项目" key="5">
              <div className="content-tabPane">
                <MemberBoard boardIndex={1} />
              </div>
            </TabPane>
          ) : null}
        </Tabs> */}
        {/* {chartState && vitalityData[chartIndex] ?
          <ClickOutSide onClickOutside={() => {
            setChartState(false)
          }}>
            <div className="chart-box" style={{ top: chartY, left: chartX }}>
              <div>时间：${title}</div>
              <div><div>项目：</div><div>{vitalityData[chartIndex].groupName}</div></div>
              <div><div>干系人：</div><div>{vitalityData[chartIndex].creatorName}
                {vitalityData[chartIndex].creatorName && vitalityData[chartIndex].executorName
                  ? "⇀"
                  : ""}
                {vitalityData[chartIndex].executorName ? vitalityData[chartIndex].executorName : ''}</div></div>
              <div><div>操作：</div><div>{vitalityData[chartIndex].log}</div></div>
              <div><div>任务：</div><div>{vitalityData[chartIndex].cardTitle}</div></div>
              <div><div>活力：</div><div>{vitalityData[chartIndex].energyValue}</div></div>
            </div>
          </ClickOutSide>
          : null} */}
        {/* <MainBoard /> : null} */}
        {/* {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null} */}
      </div>
    </div>
  );
};
export default Content;
