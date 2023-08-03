import React, { useState, useEffect, useRef, useCallback } from "react";
import "./vitality.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Table, Dropdown, Tooltip } from "antd";
import api from "../../services/api";
import moment from "moment";
import _ from "lodash";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";

import VitalityIcon from "../vitalityIcon/vitalityIcon";
import fireBlueSvg from "../../assets/svg/fireBlue.svg";
import helpMsgSvg from "../../assets/svg/helpMsg.svg";
import PieChart from "../../components/common/chart/pieChart";
import emptyData from "../../assets/svg/emptyData.svg";
import Avatar from "../common/avatar";
import Iframeview from "../common/iframeview";
import TimelineChart from "../common/amChart/timelineChart";
import bugSvg from "../../assets/svg/bug.svg";
import vitalityb1Svg from "../../assets/svg/vitalityb1.svg";
import vitalityb2Svg from "../../assets/svg/vitalityb2.svg";
import vitalityb3Svg from "../../assets/svg/vitalityb3.svg";
import vitalityb4Svg from "../../assets/svg/vitalityb4.svg";
import vitalityb5Svg from "../../assets/svg/vitalityb5.svg";
import vitalityb6Svg from "../../assets/svg/vitalityb6.svg";
import vitalityb7Svg from "../../assets/svg/vitalityb7.svg";
import vitalityb8Svg from "../../assets/svg/vitalityb8.svg";
import vitalityb9Svg from "../../assets/svg/vitalityb9.svg";
import vitalityb10Svg from "../../assets/svg/vitalityb10.svg";
import vitalityb11Svg from "../../assets/svg/vitalityb11.svg";
import vitalityb12Svg from "../../assets/svg/vitalityb12.svg";
import vitalityb13Svg from "../../assets/svg/vitalityb13.svg";
import vitalityb14Svg from "../../assets/svg/vitalityb14.svg";
import vitalityb15Svg from "../../assets/svg/vitalityb15.svg";
import vitalityb16Svg from "../../assets/svg/vitalityb16.svg";
import vitalityb17Svg from "../../assets/svg/vitalityb17.svg";
import vitalityb18Svg from "../../assets/svg/vitalityb18.svg";
import vitalityb19Svg from "../../assets/svg/vitalityb19.svg";
import vitalityb20Svg from "../../assets/svg/vitalityb20.svg";
import vitalityb21Svg from "../../assets/svg/vitalityb21.svg";
import vitalityb22Svg from "../../assets/svg/vitalityb22.svg";
import vitalityb23Svg from "../../assets/svg/vitalityb23.svg";
import vitalityb24Svg from "../../assets/svg/vitalityb24.svg";

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
interface VitalityProps {
  vitalityType: number;
  vitalityKey: string;
  fatherVitalityInfo?: any;
  showTargetDay?: string;
}

const Vitality: React.FC<VitalityProps> = (props) => {
  let { vitalityType, vitalityKey, showTargetDay } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const vitalityLogRef: React.RefObject<any> = useRef();
  const [vitalityInfo, setvitalityInfo] = useState<any>(null);
  const [startTime, setStartTime] = useState(0);
  const [targetMonthStr, setTargetMonthStr] = useState("");
  const [pieData, setPieData] = useState<any>(null);
  const [monthData, setMonthData] = useState<any>([]);
  const [monthTitleArr, setMonthTitleArr] = useState<any>([]);
  const [vitalityState, setVitalityState] = useState("month");
  const [logDate, setLogDate] = useState("");
  const [logList, setLogList] = useState<any>([]);
  const [vitalityData, setVitalityData] = useState<any>(null);
  // const [logtotal, setLogtotal] = useState(0);
  // const [page, setLogPage] = useState(1);

  const monthArr = ["S", "M", "T", "W", "T", "F", "S"];
  const vitalityArr = useRef<any>([
    "",
    vitalityb1Svg,
    vitalityb2Svg,
    vitalityb3Svg,
    vitalityb4Svg,
    vitalityb5Svg,
    vitalityb6Svg,
    vitalityb7Svg,
    vitalityb8Svg,
    vitalityb9Svg,
    vitalityb10Svg,
    vitalityb11Svg,
    vitalityb12Svg,
    vitalityb13Svg,
    vitalityb14Svg,
    vitalityb15Svg,
    vitalityb16Svg,
    vitalityb17Svg,
    vitalityb18Svg,
    vitalityb19Svg,
    vitalityb20Svg,
    vitalityb21Svg,
    vitalityb22Svg,
    vitalityb23Svg,
    vitalityb24Svg,
  ]);

  const vitalityBArr = useRef<any>([
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
  const limit = 500;
  const chartRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const columns = [
    {
      title: "图标",
      dataIndex: "logType",
      key: "logType",
      width: 40,
      align: "center" as "center",
      render: (logType, item, index) => (
        <React.Fragment key={"log" + index}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <img
              src={vitalityArr.current[logType]}
              alt=""
              style={{
                height: "18px",
              }}
            />
          </div>
        </React.Fragment>
      ),
    },
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 50,
      align: "center" as "center",
    },
    {
      title: "项目",
      dataIndex: "groupName",
      key: "groupName",
      width: 90,
      align: "center" as "center",
    },
    {
      title: "干系人",
      dataIndex: "person",
      key: "person",
      width: 100,
      align: "center" as "center",
    },
    {
      title: "操作",
      dataIndex: "log",
      key: "log",
      width: 100,
      align: "center" as "center",
      render: (log, item, index) => (
        <React.Fragment key={"log" + index}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {log}
          </div>
        </React.Fragment>
      ),
    },
    {
      title: "任务",
      key: "cardTitle",
      dataIndex: "cardTitle",
      width: 160,
      align: "center" as "center",
      render: (cardTitle, item, index) => (
        <React.Fragment key={"cardTitle" + index}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {cardTitle}
          </div>
        </React.Fragment>
      ),
    },
    {
      title: "活力",
      key: "energyValue",
      dataIndex: "energyValue",
      width: 50,
      render: (energyValue, item, index) => (
        <React.Fragment key={"energyValue" + index}>
          <span
            style={{
              backgroundColor: energyValue > 0 ? "#86B93F" : "#E94848",
              borderRadius: "8px",
              padding: "0px 6px",
              boxSizing: "border-box",
              color: "#fff",
              height: "20px",
              lineHeight: "20px",
            }}
          >
            {energyValue > 0 ? "+" : null}
            {energyValue}
          </span>
        </React.Fragment>
      ),
      align: "center" as "center",
    },
  ];
  const groupColumns = [
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 40,
      align: "center" as "center",
    },
    {
      title: "干系人",
      dataIndex: "person",
      key: "person",
      width: 80,
      align: "center" as "center",
    },
    {
      title: "操作",
      dataIndex: "log",
      key: "log",
      width: 120,
      align: "center" as "center",
      render: (log, item, index) => (
        <React.Fragment key={"log" + index}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {log}
          </div>
        </React.Fragment>
      ),
    },
    {
      title: "任务",
      key: "cardTitle",
      dataIndex: "cardTitle",
      width: 180,
      align: "center" as "center",
      render: (cardTitle, item, index) => (
        <React.Fragment key={"cardTitle" + index}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {cardTitle}
          </div>
        </React.Fragment>
      ),
    },
    {
      title: "活力",
      key: "energyValue",
      dataIndex: "energyValue",
      width: 50,
      render: (energyValue, item, index) => (
        <React.Fragment key={"energyValue" + index}>
          <span
            style={{
              backgroundColor: energyValue > 0 ? "#86B93F" : "#E94848",
              borderRadius: "8px",
              padding: "0px 6px",
              boxSizing: "border-box",
              color: "#fff",
              height: "20px",
              lineHeight: "20px",
            }}
          >
            {energyValue > 0 ? "+" : null}
            {energyValue}
          </span>
        </React.Fragment>
      ),
      align: "center" as "center",
    },
  ];
  const getPersonVitality = useCallback(
    async (startTime: number, endTime: number) => {
      let personRes: any = await api.auth.monthEnergyWeb(
        startTime,
        endTime,
        vitalityType > 1 ? vitalityType - 1 : vitalityType,
        vitalityKey
      );
      if (personRes.msg === "OK") {
        let data: object[] = [];
        personRes.result.forEach((item: any) => {
          if (item.energyValueTotal > 0) {
            data.push({
              type: item.name,
              value: item.energyValueTotal,
            });
          }
        });
        data = _.sortBy(data, "value").reverse();
        setPieData(data);
        console.log(data);
        // setPiechart(chart.createPieChart('piechartdiv', data));
      } else {
        dispatch(setMessage(true, personRes.msg, "error"));
      }
    },
    [dispatch, vitalityType, vitalityKey]
  );
  //todo
  const getVitalityData = useCallback(
    async (obj: any) => {
      let newMonthData: any = [];
      let newMonthTitleArr: any = [];
      let personStartTime = moment().startOf("month").startOf("day").valueOf();
      let personEndTime = moment().endOf("month").endOf("day").valueOf();
      setTargetMonthStr(moment().format("YYYY") + "/" + moment().format("MM"));
      getPersonVitality(personStartTime, personEndTime);
      let monthStartTime = moment()
        .subtract(4, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      let monthEndTime = moment()
        .add(1, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      let monthObj = {
        startTime: monthStartTime,
        endTime: monthEndTime,
        ...obj,
      };
      let monthTimeArr = [
        {
          startTime: moment()
            .subtract(3, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: moment()
            .subtract(2, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
        {
          startTime: moment()
            .subtract(2, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: moment()
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
        {
          startTime: moment()
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: moment().startOf("month").startOf("day").valueOf(),
        },
        {
          startTime: moment().startOf("month").startOf("day").valueOf(),
          endTime: moment()
            .add(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
      ];
      let monthRes: any = await api.auth.monthEnergy(monthObj);
      if (unDistory.current) {
        if (monthRes.msg === "OK") {
          // monthRes.result.forEach((item: any) => {
          //   newMonthData.push({
          //     weekDay: moment(item.startTime).format('dddd'),
          //     value: item.value * 10,
          //   });
          // });
          monthTimeArr.forEach((monthItem, monthIndex) => {
            newMonthData[monthIndex] = [];
            monthRes.result.forEach((item: any) => {
              if (
                item.startTime >= monthItem.startTime &&
                item.startTime < monthItem.endTime
              ) {
                newMonthData[monthIndex].push({
                  color: getColor(item.value),
                  date: moment(item.startTime).date(),
                  value: item.value.toFixed(1),
                  startTime: item.startTime,
                });
              }
            });
          });
          newMonthData.forEach((item: any, index: number) => {
            newMonthTitleArr.unshift(
              moment(item[0].startTime).format("M") + "月"
            );
            item = formatMonth(item[0].startTime, item);
          });
          newMonthData.reverse();
        } else {
          dispatch(setMessage(true, monthRes.msg, "error"));
        }
        setStartTime(moment().startOf("day").valueOf());
        setLogDate(moment().format("M") + "月" + moment().format("D") + "日");
        setMonthData(newMonthData);
        setMonthTitleArr(newMonthTitleArr);
        // getLog(
        //   moment().startOf("day").valueOf(),
        //   page,
        //   limit,
        //   logList,
        //   vitalityKey,
        //   vitalityType
        // );
      }
    },
    [dispatch, getPersonVitality]
  );
  const getVitalityInfo = useCallback(
    async (userKey) => {
      let res: any = await api.auth.getTargetUserInfo(userKey);
      if (unDistory.current) {
        if (res.msg === "OK") {
          setvitalityInfo(res.result);
          getVitalityData({
            type: 1,
            targetUGKey: userKey,
          });
        } else {
          dispatch(setMessage(true, res.msg, "error"));
        }
      }
    },
    [dispatch, getVitalityData]
  );
  useEffect(() => {
    switch (headerIndex) {
      case 1:
        if (user) {
          getVitalityInfo(user._key);
        }
        break;
      case 2:
        if (targetUserInfo) {
          getVitalityInfo(targetUserInfo._key);
        }
        break;
      case 3:
        if (groupInfo) {
          setvitalityInfo(groupInfo);
          getVitalityData({
            type: 2,
            targetUGKey: groupInfo._key,
          });
        }
        break;
    }
  }, [
    getVitalityInfo,
    user,
    headerIndex,
    groupInfo,
    targetUserInfo,
    getVitalityData,
  ]);

  const getLog = useCallback(
    async (
      startTime: number,
      page: number,
      limit: number,
      logList: any,
      vitalityKey: string,
      vitalityType: number
    ) => {
      let newLogList: any = _.cloneDeep(logList);
      let dataRes: any = null;
      if (page === 1) {
        newLogList = [];
      }
      if (vitalityType === 3) {
        dataRes = await api.auth.getGroupLog(
          vitalityKey,
          startTime,
          moment(startTime).endOf("day").valueOf(),
          page,
          limit
        );
      } else if (vitalityType !== 3) {
        dataRes = await api.auth.getUserLog(
          startTime,
          moment(startTime).endOf("day").valueOf(),
          page,
          limit,
          vitalityKey !== user._key && user ? vitalityKey : null
        );
      }
      if (dataRes.msg === "OK") {
        if (vitalityType !== 3) {
          let vitalityData1: any = [];
          let vitalityTime: any = [];
          let vitalityData2: any = [];
          // let count: any = dataRes.yestodayEnergyValue;
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
              icon: vitalityBArr.current[dataItem.logType],
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
          console.log(
            _.sortBy([...vitalityData1, ...vitalityData2], "startTime")
          );
          setVitalityData(
            _.sortBy([...vitalityData1, ...vitalityData2], "startTime")
          );
        }
        dataRes.result.forEach((item: any) => {
          item.createTime = moment(item.createTime).format("HH:mm");
          item.person = `${item.creatorName ? item.creatorName : ""} ${
            item.creatorName && item.executorName ? "⇀" : ""
          } ${item.executorName ? item.executorName : ""}`;
          newLogList.push(item);
        });
        setLogList(newLogList);
        // setLogtotal(dataRes.totalNumber);
      } else {
        dispatch(setMessage(true, dataRes.msg, "error"));
      }
    },
    [dispatch, user]
  );
  useEffect(() => {
    if (vitalityState === "day") {
      // setLogPage(1);
      setLogList([]);
      getLog(startTime, 1, limit, [], vitalityKey, vitalityType);
    }
  }, [
    startTime,
    getLog,
    limit,
    vitalityState,
    user,
    headerIndex,
    vitalityKey,
    vitalityType,
  ]);

  useEffect(() => {
    if (showTargetDay) {
      getTargetLog(moment().valueOf());
    }
  }, [showTargetDay]);
  const getTargetLog = (startTime: number) => {
    setVitalityState("day");
    if (vitalityLogRef.current) {
      vitalityLogRef.current.scrollTop = 0;
    }
    setStartTime(startTime);
    setLogDate(
      moment(startTime).format("M") +
        "月" +
        moment(startTime).format("D") +
        "日"
    );
  };
  const getColor = (num: number) => {
    let color = "";
    if (num <= 0) {
      color = "#D8E2FF";
    } else if (num < 10 && num > 0) {
      color = "#D1DEFF";
    } else if (num < 20 && num >= 10) {
      color = "#94B2FF";
    } else if (num < 30 && num >= 20) {
      color = "#7FA3FF";
    } else if (num < 40 && num >= 30) {
      color = "#376EF8";
    } else if (num < 50 && num >= 40) {
      color = "#476FD5";
    } else if (num < 60 && num >= 50) {
      color = "#1F4CC1";
    } else if (num >= 60) {
      color = "#214EC1";
    }
    return color;
  };

  // const changeMonth = (type: number) => {
  //   let personStartTime = 0;
  //   let personEndTime = 0;
  //   //当前时间
  //   if (type === 0) {
  //     personStartTime = moment(targetTime)
  //       .subtract(1, 'month')
  //       .startOf('month')
  //       .startOf('day')
  //       .valueOf();
  //     personEndTime = moment(targetTime)
  //       .subtract(1, 'month')
  //       .endOf('month')
  //       .endOf('day')
  //       .valueOf();
  //     setTargetMonthStr(
  //       moment(targetTime).subtract(1, 'month').format('YYYY') +
  //         '/' +
  //         moment(targetTime).subtract(1, 'month').format('MM')
  //     );
  //   } else {
  //     personStartTime = moment(targetTime)
  //       .add(1, 'month')
  //       .startOf('month')
  //       .startOf('day')
  //       .valueOf();
  //     personEndTime = moment(targetTime)
  //       .add(1, 'month')
  //       .endOf('month')
  //       .endOf('day')
  //       .valueOf();
  //     setTargetMonthStr(
  //       moment(targetTime).add(1, 'month').format('YYYY') +
  //         '/' +
  //         moment(targetTime).add(1, 'month').format('MM')
  //     );
  //   }
  //   setTargetTime(personStartTime);
  //   getPersonVitality(personStartTime, personEndTime);
  // };
  const formatMonth = (time: number, arr: any) => {
    let weekIndex = moment(time).day();
    for (let i = weekIndex - 1; i > -1; i--) {
      arr.unshift({
        color: "#FFFFFF",
        date: "",
        value: "",
      });
    }
    return arr;
  };
  // const scrollLogLoading = (e: any) => {
  //   let newPage = page;
  //   let scrollHeight = e.target.scrollHeight;
  //   //滚动条滚动距离
  //   let scrollTop = e.target.scrollTop;
  //   //窗口可视范围高度
  //   let clientHeight = e.target.clientHeight;
  //   if (
  //     clientHeight + scrollTop >= scrollHeight - 1 &&
  //     logList.length < logtotal
  //   ) {
  //     newPage = newPage + 1;
  //     getLog(startTime, newPage, limit, logList, vitalityKey, vitalityType);
  //   }
  // };
  // const handleChangePage = (page: number) => {
  //   // setPage(page);
  //   getLog(startTime, page, limit, logList, vitalityKey, vitalityType);
  // };
  const changeTargetMonth = (index: number) => {
    getPersonVitality(
      moment().subtract(index, "month").startOf("month").valueOf(),
      moment().subtract(index, "month").endOf("month").valueOf()
    );
    setTargetMonthStr(
      moment().subtract(index, "month").format("YYYY") +
        "/" +
        moment().subtract(index, "month").format("MM")
    );
    setVitalityState("month");
  };
  return (
    <React.Fragment>
      {vitalityInfo ? (
        <div className="vitality-container">
          {/* <div className="vitality-chart-info"> */}
          <div className="vitality-month">
            <div className="vitality-top">
              {vitalityType === 3 ? (
                <div className="vitality-img" style={{ borderRadius: "5px" }}>
                  <Avatar
                    avatar={vitalityInfo?.groupLogo}
                    name={""}
                    type={"group"}
                    index={0}
                  />
                </div>
              ) : (
                <div className="vitality-img">
                  <Avatar
                    avatar={vitalityInfo?.profile?.avatar}
                    name={""}
                    type={"person"}
                    index={0}
                  />
                </div>
              )}
              <div className="vitality-top-info">
                <div className="vitality-title vitality-top-title">
                  <div className="toLong" style={{ maxWidth: "150px" }}>
                    {vitalityType === 3 && vitalityInfo
                      ? vitalityInfo.groupName
                      : vitalityInfo.profile?.nickName}
                  </div>
                  <div className="vitality-numImg">
                    <img src={fireBlueSvg} alt="" />
                  </div>
                  <div
                    style={{
                      color: "#1890ff",
                      fontSize: "14px",
                      marginRight: "8px",
                    }}
                  >
                    {vitalityInfo.energyValueTotal}
                  </div>
                  <Dropdown
                    overlay={
                      <div
                        className="dropDown-box"
                        style={{
                          width: "750px",
                          height: "calc(100vh - 140px)",
                          overflow: "auto",
                        }}
                      >
                        {/* <img src={helpPng} alt="" style={{ width: "100%" }} /> */}
                        <Iframeview uri="https://mindcute.com/home/qdoc/docEditor?key=2165214009" />
                      </div>
                    }
                  >
                    <Tooltip title="活力值规则">
                      <img src={helpMsgSvg} alt="" />
                      {/* <Button
                        ghost
                        shape="circle"
                        icon={<QuestionOutlined style={{ color: '#333' }} />}
                        style={{ border: "0px" }}
                      /> */}
                    </Tooltip>
                  </Dropdown>
                </div>
                <div className="vitality-subtitle vitality-bottom-title">
                  <VitalityIcon
                    vitalityNum={vitalityInfo.energyValueTotal}
                    vitalityDirection={"vertical"}
                    vitalityStyle={{ marginLeft: "5px", color: "#87b940" }}
                    vitalityIconType={1}
                  />
                </div>
              </div>
            </div>
            <div className="vitality-title">月活力分布</div>
            <div className="vitality-month-container">
              <div
                style={{
                  paddingLeft: "40px",
                  boxSizing: "border-box",
                  width: "100%",
                  display: "flex",
                  height: "17px",
                }}
              >
                {monthArr.map((monthItem: any, monthIndex: number) => {
                  return (
                    <div
                      className="vitality-month-item-title vitality-month-item"
                      key={"month" + monthIndex}
                    >
                      {monthItem}
                    </div>
                  );
                })}
              </div>
              {monthData.map((item: any, index: number) => {
                return (
                  <React.Fragment key={"monthData" + index}>
                    <div
                      className="vitality-month-title   btn btn-primary btn-ghost btn-shine"
                      onClick={() => {
                        changeTargetMonth(index);
                      }}
                    >
                      {monthTitleArr[index]}
                    </div>
                    <div className="vitality-month-info">
                      {item.map((dayItem: any, dayIndex: number) => {
                        return (
                          <div
                            className="vitality-month-item"
                            key={"vitality" + index + dayIndex}
                          >
                            <div
                              className="vitality-month-item-day"
                              style={{
                                // backgroundColor: dayItem.color,
                                backgroundColor: dayItem.date
                                  ? "rgba(233, 233, 233, 0.5)"
                                  : "rgba(255, 255, 255, 0)",
                                border: dayItem.date ? "1px solid #fff" : 0,
                              }}
                              onClick={() => {
                                // if (
                                //   headerIndex !== 2 ||
                                //   (headerIndex === 2 &&
                                //     dayItem.startTime ===
                                //       moment().startOf("day").valueOf()) ||
                                //   vitalityKey === user._key
                                // ) {
                                getTargetLog(dayItem.startTime);
                                // }
                              }}
                            >
                              {dayItem.value && dayItem.value !== "0.0" ? (
                                <React.Fragment>
                                  <div
                                    className="vitality-changeNum-box"
                                    style={{
                                      color:
                                        dayItem.value > 0 ? "#fff" : "#FB7552",
                                    }}
                                  >
                                    {dayItem.value.indexOf("-") === -1
                                      ? Math.round(dayItem.value)
                                      : Math.round(dayItem.value.split("-")[1])}
                                  </div>
                                  <div
                                    className="vitality-changeNum"
                                    style={{
                                      borderColor: `${dayItem.color} transparent transparent transparent`,
                                    }}
                                  ></div>
                                </React.Fragment>
                              ) : null}
                              {dayItem.date}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
              {/* {heatmapData ? (
                  <HeatmapChart
                    data={heatmapData}
                    height={400}
                    width={200}
                    heatmapId={'heatmap' + groupKey}
                  />
                ) : null} */}
            </div>
          </div>

          <div className="vitality-box" ref={boxRef}>
            <div
              className="vitality-chart"
              style={
                vitalityState === "month"
                  ? { opacity: "1" }
                  : {
                      opacity: "0",
                      height: "0px",
                      width: "0px",
                      zIndex: -1,
                    }
              }
            >
              <div
                className="vitality-title"
                // style={{ justifyContent: 'space-between' }}
              >
                <div>月活力</div>
                <div className="vitality-choose">
                  {/* <img
                      src={leftArrowPng}
                      className="vitality-choose-icon"
                      onClick={() => {
                        changeMonth(0);
                      }}
                    /> */}
                  <div>{targetMonthStr}</div>
                  {/* <img
                      src={rightArrowPng}
                      className="vitality-choose-icon"
                      onClick={() => {
                        changeMonth(1);
                      }}
                    /> */}
                </div>
              </div>
              {/* <div className="vitality-week" id="piechartdiv"></div> */}
              <div
                style={{
                  width: "100%",
                  height: "calc(100% - 30px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                ref={chartRef}
              >
                {pieData && boxRef?.current ? (
                  pieData.length > 0 ? (
                    <PieChart
                      data={pieData}
                      height={boxRef.current.offsetHeight + 50}
                      width={boxRef.current.offsetWidth + 50}
                      pieId={"pie" + vitalityKey}
                      fontColor="#333"
                    />
                  ) : (
                    <div
                      style={{
                        height: boxRef.current.offsetHeight - 40,
                        width: boxRef.current.offsetWidth - 40,
                      }}
                      className="box-center"
                    >
                      <img src={emptyData} alt="" />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div
              className="vitality-log"
              style={
                vitalityState === "day"
                  ? { opacity: "1" }
                  : {
                      opacity: "0",
                      height: "0px",
                      width: "0px",
                      padding: "0px",
                      zIndex: -1,
                    }
              }
            >
              <div className="vitality-title" style={{ height: "57px" }}>
                活力日志
                <span style={{ marginLeft: "5px" }}>( {logDate} )</span>
              </div>
              {boxRef.current && vitalityData ? (
                <TimelineChart
                  timelineId="timelineContentId"
                  data={vitalityData}
                  width={boxRef.current.offsetWidth}
                  height={boxRef.current.offsetHeight * 0.7}
                  // onClick={clickChart}
                />
              ) : null}

              <div className="vitality-log-container" ref={vitalityLogRef}>
                {boxRef.current ? (
                  <Table
                    columns={headerIndex === 3 ? groupColumns : columns}
                    dataSource={logList}
                    size="small"
                    scroll={{
                      x: boxRef.current.offsetWidth - 40,
                      y: boxRef.current.offsetHeight - 125,
                    }}
                    pagination={false}
                    // pagination={{
                    //   pageSize: 50,
                    //   pageSizeOptions: ["50"],
                    //   showQuickJumper: true,
                    //   onChange: handleChangePage,
                    //   total: logtotal,
                    // }}
                  />
                ) : null}
                {/* <div className="vitality-msg">
                  <div
                    style={{
                      width: "10%",
                    }}
                  >
                    时间
                  </div>
                  {vitalityType !== 3 ? <div style={{ width: "15%" }}>项目</div> : null}
                  <div style={{ width: "18%" }}>干系人</div>
                  <div style={{ width: "10%" }}>操作</div>
                  <div style={{ width: vitalityType !== 3 ? "33%" : "45%" }}>任务</div>
                  <div style={{ width: "10%" }}>活力</div>
                </div>
                {logList.map((logItem: any, logIndex: number) => {
                  return (
                    <div className="vitality-msg" key={"log" + logIndex}>
                      <div
                        style={{
                          width: "10%",
                        }}
                      >
                        {logItem.createTime}
                      </div>
                      {vitalityType !== 3 ? <div
                        style={{
                          width: "15%",
                        }}
                      >
                        {logItem.groupName}
                      </div> : null}
                      <div style={{ width: "18%" }}>
                        {logItem.creatorName}
                        {logItem.creatorName && logItem.executorName
                          ? "⇀"
                          : ""}
                        {logItem.executorName}
                      </div>
                      <div
                        style={{ width: "13%", justifyContent: "flex-start" }}
                      >
                        {logItem.log}
                      </div>
                      <div
                        style={{ width: vitalityType !== 3 ? "33%" : "45%", justifyContent: "flex-start" }}
                      >
                        {logItem.cardTitle}
                      </div>

                      <div style={{ width: "10%" }}>

                      </div>
                    </div>
                  );
                })} */}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
Vitality.defaultProps = {
  vitalityType: 0,
};
export default Vitality;
