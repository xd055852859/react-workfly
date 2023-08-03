import React, { useState, useEffect, useRef, useCallback } from "react";
import "./calendar.css";
import { Modal, Button, Switch, Select } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";

import moment from "moment";
import _ from "lodash";
import api from "../../services/api";
import { useAuth } from "../../context/auth";
import { useMount } from "../../hook/common";
import calendarDay from "../../components/common/calendar";
import newCalendar from "../../components/common/newCalendar";

import { setMessage } from "../../redux/actions/commonActions";
import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";

import ClickOutSide from "../../components/common/clickOutside";
import CalendarHeader from "./calendarHeader";
import DropMenu from "../../components/common/dropMenu";
import CalendarInfo from "./calendarInfo";

import rightArrowPng from "../../assets/img/rightArroww.png";
import leftArrowPng from "../../assets/img/leftArroww.png";
import unfinishPng from "../../assets/img/timeSet2.png";
import finishPng from "../../assets/img/timeSet3.png";
import downArrowPng from "../../assets/img/downArrow.png";
import Avatar from "../../components/common/avatar";
const { Option } = Select;
interface CalendarProps {
  targetGroupKey: string;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { targetGroupKey } = props;
  const dispatch = useDispatch();
  const { deviceState } = useAuth();
  // const calendarList = useTypedSelector((state) => state.task.calendarList);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);

  const user = useTypedSelector((state) => state.auth.user);

  const [calendarDate, setCalendarDate] = useState<any>([]);
  const [calendarObj, setCalendarObj] = useState<any>({});
  const [calendarType, setCalendarType] = useState("");
  const [calendar, setCalendar] = useState<any>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [startDay, setStartDay] = useState(0);
  const [endDay, setEndDay] = useState(0);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [targetMonth, setTargetMonth] = useState(
    moment().startOf("month").startOf("day").format("YYYY") +
      "年" +
      moment().startOf("month").startOf("day").format("MM") +
      "月"
  );
  const [monthTaskList, setMonthTaskList] = useState<any>([]);
  const [calendarStartTime, setCalendarStartTime] = useState(
    moment().startOf("day").valueOf()
  );
  const [groupVisible, setGroupVisible] = useState(false);
  const [calendarGroupArray, setCalendarGroupArray] = useState<any>(null);
  const [calendarGroupIndex, setCalendarGroupIndex] = useState<any>(0);
  const [calendarGroupKey, setCalendarGroupKey] = useState<any>(mainGroupKey);
  const [moreTaskCheck, setMoreTaskCheck] = useState(false);
  const [calendarTaskType, setCalendarTaskType] = useState<any>(null);
  const [calendarDayType, setCalendarDayType] = useState<number>(2);
  const [calendarWeek, setCalendarWeek] = useState<string[]>([]);
  // const [followList, setFollowList] = useState<any>([]);
  // const [isEdit, setIsEdit] = useState(false);
  // const [followEdit, setFollowEdit] = useState(false);
  const childRef = useRef<any>();
  const weekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const calendarColor = [
    "#E8A861",
    "#9DC85E",
    "#39B98D",
    "#3970B9",
    "#9E5CCF",
    "#DA4949",
  ];
  const calendarRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(true);
  // window.onresize = _.debounce(function () {
  //   switch (calendarDayType) {
  //     case 0:
  //       setCalendarHeight(document.documentElement.offsetHeight - 140);
  //       break;
  //     case 1:
  //       setCalendarHeight(document.documentElement.offsetHeight - 140);
  //       break;
  //     case 2:
  //       if (
  //         moment(targetDate).startOf("month").day() === 0 ||
  //         moment(targetDate).startOf("month").day() < 2
  //       ) {
  //         setCalendarHeight(
  //           (document.documentElement.offsetHeight - 140) / 6
  //         );
  //       } else {
  //         setCalendarHeight(
  //           (document.documentElement.offsetHeight - 140) / 5
  //         );
  //       }
  //   }
  // }, 500);
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (taskInfo) {
      setMonthTaskList((prevMonthTaskList) => {
        prevMonthTaskList.map((item, index) => {
          item[_.findIndex(item, { _key: taskInfo._key })] =
            _.cloneDeep(taskInfo);
          return item;
        });
        return [...prevMonthTaskList];
      });
    }
  }, [taskInfo]);
  useEffect(() => {
    let newCalendarGroupArray: any = [];
    if (groupArray) {
      newCalendarGroupArray = _.cloneDeep(groupArray);
      // newCalendarGroupArray.unshift({
      //   _key: mainGroupKey,
      //   groupName: "全部",
      //   groupLogo: user?.profile.avatar,
      // });
      setCalendarGroupArray(newCalendarGroupArray);
    }
  }, [groupArray, mainGroupKey, user]);
  useEffect(() => {
    if (targetGroupKey) {
      setCalendarGroupKey(targetGroupKey);
    }
  }, [targetGroupKey]);
  useEffect(() => {
    if (moreTaskCheck) {
      getTask();
    }
    //eslint-disable-next-line
  }, [moreTaskCheck, calendarStartTime]);
  useEffect(() => {
    setMonthTaskList([]);
  }, [calendarStartTime, calendarDayType]);

  const getData = async (calendarDate: any, calendarGroupKey: string) => {
    console.log(
      calendarDate[0].startTime < calendarDate[calendarDate.length - 1].endTime
    );
    console.log(
      calendarDate[0].startTime < calendarDate[calendarDate.length - 1].endTime
        ? calendarDate[calendarDate.length - 1].endTime + 1
        : moment(calendarDate[calendarDate.length - 1].endTime)
            .add(1, "year")
            .valueOf()
    );
    let res: any = null;
    // await api.task.getScheduleList(
    //   [calendarGroupKey],
    //   calendarDate[0].startTime,
    //   calendarDate[0].startTime < calendarDate[calendarDate.length - 1].endTime
    //     ? calendarDate[calendarDate.length - 1].endTime + 1
    //     : moment(calendarDate[calendarDate.length - 1].endTime)
    //         .add(1, "year")
    //         .valueOf()
    // );
    if (res.msg === "OK") {
      console.log("????", res);
      setCalendarObj((prevCalendarObj) => {
        prevCalendarObj.arr = res.result.getNoCircleScheduleList;
        prevCalendarObj.repeatArr = res.result.validEvents;
        return { ...prevCalendarObj };
      });
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  useEffect(() => {
    if (calendarGroupKey && calendarDate.length > 0) {
      getData(calendarDate, calendarGroupKey);
      console.log(calendarDate);
      console.log(calendarGroupKey);
    }
    //eslint-disable-next-line
  }, [calendarGroupKey, calendarDate]);
  const getCalendar = useCallback(
    (targetDate: any, calendarDayType: number) => {
      // 获得当前月的天数  和 第一天的星期数
      // let newTaskList: any = [];

      let calendarDayNum = 0;
      switch (calendarDayType) {
        case 0:
          calendarDayNum = 3;
          setCalendarHeight(document.documentElement.offsetHeight - 140);
          break;
        case 1:
          calendarDayNum = 7;
          setCalendarHeight(document.documentElement.offsetHeight - 140);
          break;
        case 2:
          if (
            moment(targetDate).startOf("month").day() === 0 ||
            moment(targetDate).startOf("month").day() < 2
          ) {
            calendarDayNum = 42;
            setCalendarHeight(
              (document.documentElement.offsetHeight - 140) / 6
            );
          } else {
            calendarDayNum = 35;
            setCalendarHeight(
              (document.documentElement.offsetHeight - 140) / 5
            );
          }
      }
      getTargetDate(targetDate, calendarDayNum);
    },
    //eslint-disable-next-line
    []
  );
  const getTargetDate = (targetDate: any, calendarDayNum: number) => {
    let curDays = getMonthDays(targetDate); // 当前天数
    let curWeek = getWeekDays(targetDate.clone()); // 当前月第一天的星期(索引值)
    let upDays = getMonthDays(targetDate.clone().subtract(1, "month")); // 上月的天数
    // 生成的结构
    let strDate: any = [];
    // 下个月的起始日期
    let nextFirstDate = 0;
    let newCalendarWeek: any = [];
    switch (calendarDayNum) {
      case 3:
        for (let i = 0; i < calendarDayNum; i++) {
          let momentDate = targetDate.clone().add(i, "days");
          newCalendarWeek.push(weekArr[momentDate.day()]);
          let obj: any = {
            month: "target",
            day: momentDate.date(),
            date: momentDate,
            week: momentDate.day(),
            startTime: momentDate.startOf("day").valueOf(),
            endTime: momentDate.endOf("day").valueOf(),
            targetMonth: momentDate.month(),
          };
          if (
            momentDate.startOf("day").valueOf() ===
            moment().startOf("day").valueOf()
          ) {
            obj.targetDay = true;
          }
          strDate.push(obj);
        }
        break;
      case 7:
        for (let i = 0; i < calendarDayNum; i++) {
          let momentDate = targetDate.clone().add(i, "days");
          newCalendarWeek.push(weekArr[momentDate.day()]);

          let obj: any = {
            month: "target",
            day: momentDate.date(),
            date: momentDate,
            week: momentDate.day(),
            startTime: momentDate.startOf("day").valueOf(),
            endTime: momentDate.endOf("day").valueOf(),
            targetMonth: momentDate.month(),
          };
          if (
            momentDate.startOf("day").valueOf() ===
            moment().startOf("day").valueOf()
          ) {
            obj.targetDay = true;
          }
          strDate.push(obj);
        }
        break;
      default:
        newCalendarWeek = _.cloneDeep(weekArr);
        let newCalendarWeekItem = newCalendarWeek.splice(0, 1);
        newCalendarWeek.push(newCalendarWeekItem);
        for (let i = 0; i < calendarDayNum; i++) {
          // 1. 当前月的上一个月
          if (i < curWeek) {
            // 返回的索引值刚好是上月在当月显示的天数
            let momentDate = moment(
              `${targetDate.clone().year()}-${
                targetDate.clone().subtract(1, "months").month() + 1
              }-${upDays}`
            );

            strDate.unshift({
              month: "last",
              day: upDays,
              date: momentDate,
              week: momentDate.day(),
              startTime: momentDate.startOf("day").valueOf(),
              endTime: momentDate.endOf("day").valueOf(),
              targetMonth: momentDate.month(),
            });
            console.log(momentDate);
            upDays--; // 倒叙显示   30 31
          } else if (i >= curDays + curWeek) {
            //去除掉当月天数+上月天数就是下月天数
            // 2. 当前月的下一个月：除去当月最后一天+上月的几天剩余的是下月开始计算
            // curWeek 返回值刚好是上月占用的天数
            nextFirstDate++;
            let momentDate = moment(
              `${targetDate.clone().year()}-${
                targetDate.clone().add(1, "months").month() + 1
              }-${nextFirstDate}`
            );
            console.log(
              `${targetDate.clone().year()}-${
                targetDate.clone().add(1, "months").month() + 1
              }-${nextFirstDate}`
            );
            strDate.push({
              month: "next",
              day: nextFirstDate,
              date: momentDate,
              week: momentDate.day(),
              startTime: momentDate.startOf("day").valueOf(),
              endTime: momentDate.endOf("day").valueOf(),
              targetMonth: momentDate.month(),
            });
          } else {
            // 3. 当前月
            // i-curWeek+1 为当前月的天数
            // date()获取日期号
            // m.date() == i - curWeek + 1说明这一天是当月当天，添加样式
            let momentDate = moment(
              new Date(
                targetDate.year() +
                  "/" +
                  (targetDate.clone().month() + 1) +
                  "/" +
                  (i - curWeek + 1)
              ).getTime()
            );
            let obj: any = {
              month: "target",
              day: i - curWeek + 1,
              date: momentDate,
              week: momentDate.day(),
              startTime: momentDate.startOf("day").valueOf(),
              endTime: momentDate.endOf("day").valueOf(),
              targetMonth: momentDate.month(),
            };
            if (
              momentDate.startOf("day").valueOf() ===
              moment().startOf("day").valueOf()
            ) {
              obj.targetDay = true;
            }
            strDate.push(obj);
          }
        }
    }

    setCalendarWeek(newCalendarWeek);
    setCalendarDate(strDate);
  };
  useMount(() => {
    // setLoading(false);
    getCalendar(moment().startOf("month").startOf("day"), 0);
    // setTargetMonth(
    //   moment().startOf("month").startOf("day").format("YYYY") +
    //     "年" +
    //     moment().startOf("month").startOf("day").format("MM") +
    //     "月"
    // );
  });
  useEffect(() => {
    getCalendar(moment().startOf("day"), calendarDayType);
    if (calendarDayType === 2) {
      setCalendarStartTime(moment().startOf("month").startOf("day").valueOf());
    } else {
      setCalendarStartTime(moment().startOf("day").valueOf());
    }
  }, [calendarDayType, getCalendar]);
  useEffect(() => {
    if (JSON.stringify(calendarObj) !== "{}" && calendarDate.length > 0) {
      let newTaskList: any = [];
      calendarDate.forEach((dateItem: any, dateIndex: number) => {
        newTaskList[dateIndex] = [];
        calendarObj.arr.forEach((taskItem: any) => {
          if (
            taskItem.taskEndDate >= dateItem.startTime &&
            taskItem.taskEndDate <= dateItem.endTime
          ) {
            if (taskItem.taskEndDate === moment().valueOf()) {
              taskItem.calendarType = "今日";
            } else {
              taskItem.calendarType = "过去";
            }
            taskItem.repeatType = false;
            newTaskList[dateIndex].push(taskItem);
          }
        });
        calendarObj.repeatArr.forEach((taskItem: any) => {
          let findIndex = _.findIndex(calendarObj.arr, {
            origionalKey: taskItem.key,
            taskEndDate: dateItem.endTime,
          });
          if (
            (taskItem.repeatCircle === 1 ||
              (taskItem.repeatCircle === 2 &&
                taskItem.circleData.indexOf(dateItem.week) !== -1) ||
              (taskItem.repeatCircle === 3 &&
                taskItem.circleData.indexOf(dateItem.day) !== -1) ||
              (taskItem.repeatCircle === 4 &&
                taskItem.circleData[0].month === dateItem.targetMonth &&
                taskItem.circleData[0].date === dateItem.day)) &&
            moment().endOf("day").valueOf() <= dateItem.startTime &&
            taskItem.startDay <= dateItem.startTime &&
            dateItem.endTime <= taskItem.endDay &&
            findIndex === -1
          ) {
            taskItem.calendarType = "未来";
            taskItem.repeatType = true;
            newTaskList[dateIndex].push(taskItem);
          }
        });
      });
      console.log(newTaskList);
      setMonthTaskList(newTaskList);
      // setMonthTaskList((prevMonthTaskList) => {
      //   return [...prevMonthTaskList, ...newTaskList];
      // });
    }
    //eslint-disable-next-line
  }, [calendarObj]);

  const getMonthDays = (momentObj: any) => {
    return momentObj.daysInMonth();
  };
  const getWeekDays = (momentObj: any) => {
    return momentObj.startOf("month").weekday(); //
  };

  // {traditionalDate.GetLunarDay(moment())[1]}
  const changeDate = (type: number) => {
    let newCalendarStartTime = 0;
    switch (calendarDayType) {
      case 0:
        if (type === 0) {
          newCalendarStartTime = moment(calendarStartTime)
            .subtract(3, "days")
            .startOf("day")
            .valueOf();
        } else {
          newCalendarStartTime = moment(calendarStartTime)
            .add(3, "days")
            .startOf("day")
            .valueOf();
        }
        break;
      case 1:
        if (type === 0) {
          newCalendarStartTime = moment(calendarStartTime)
            .subtract(7, "days")
            .startOf("day")
            .valueOf();
        } else {
          newCalendarStartTime = moment(calendarStartTime)
            .add(7, "days")
            .startOf("day")
            .valueOf();
        }
        break;
      case 2:
        if (type === 0) {
          newCalendarStartTime = moment(calendarStartTime)
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf();
        } else {
          newCalendarStartTime = moment(calendarStartTime)
            .add(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf();
        }
    }
    //当前时间

    setCalendarStartTime(newCalendarStartTime);
    getCalendar(moment(newCalendarStartTime), calendarDayType);
    setTargetMonth(
      moment(newCalendarStartTime).format("YYYY") +
        "年" +
        moment(newCalendarStartTime).format("MM") +
        "月"
    );
  };
  const getCalendarItem = (e: any, taskItem: any, calendarIndex: number) => {
    if (taskItem.type === 8) {
      const canlendarIndex = _.findIndex(calendarObj.repeatArr, {
        _key: taskItem.origionalKey,
      });
      if (canlendarIndex !== -1) {
        taskItem.circleData = calendarObj.repeatArr[canlendarIndex].circleData;
        taskItem.repeatCircle =
          calendarObj.repeatArr[canlendarIndex].repeatCircle;
      }
    }
    setCalendar(taskItem);
    setCalendarType("编辑");
    setInfoVisible(true);
    e.stopPropagation();
  };
  const getTask = async () => {
    let obj: any = {
      startTime: calendarDate[0].startTime,
      endTime:
        calendarDate[0].startTime <
        calendarDate[calendarDate.length - 1].endTime
          ? calendarDate[calendarDate.length - 1].endTime
          : moment(calendarDate[calendarDate.length - 1].endTime)
              .add(1, "year")
              .valueOf(),
    };
    if (calendarGroupKey === mainGroupKey) {
      obj.groupKey = "";
      obj.targetUKey = user._key;
    } else {
      obj.groupKey = calendarGroupKey;
      obj.targetUKey = "";
    }
    let res: any = await api.task.getCalendarCardList(obj);
    if (unDistory.current) {
      if (res.msg === "OK") {
        setMonthTaskList((prevMonthTaskList) => {
          prevMonthTaskList.forEach((item, index) => {
            if (res.result[index]) {
              res.result[index].forEach((taskItem, taskIndex) => {
                let findIndex = _.findIndex(item, { _key: taskItem._key });
                if (findIndex === -1) {
                  item.push(taskItem);
                }
              });
            }
          });
          return [...prevMonthTaskList];
        });
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  };
  return (
    <div className="calendar">
      {!targetGroupKey ? (
        <CalendarHeader
          slot={
            <div
              className="calendar-name"
              onClick={() => {
                setGroupVisible(true);
              }}
            >
              <div className="calendar-logo">
                <Avatar
                  avatar={
                    calendarGroupArray &&
                    calendarGroupArray[calendarGroupIndex]?.groupLogo
                  }
                  name={
                    calendarGroupArray &&
                    calendarGroupArray[calendarGroupIndex].groupName
                  }
                  type={"group"}
                  index={0}
                  size={22}
                />
              </div>
              <div className="calendar-name-title">
                {calendarGroupArray &&
                  calendarGroupArray[calendarGroupIndex].groupName}
              </div>
              <img
                src={downArrowPng}
                alt=""
                className="calendar-name-title-logo"
              />
              <DropMenu
                visible={groupVisible}
                dropStyle={{
                  width: "300px",
                  height: "500px",
                  top: "55px",
                  left: "0px",
                  color: "#333",
                  overflow: "visible",
                }}
                onClose={() => {
                  setGroupVisible(false);
                }}
                title={"日程列表"}
              >
                <ClickOutSide
                  onClickOutside={() => {
                    setGroupVisible(false);
                  }}
                >
                  <React.Fragment>
                    {calendarGroupArray
                      ? calendarGroupArray.map(
                          (
                            calendarGroupItem: any,
                            calendarGroupIndex: number
                          ) => {
                            return (
                              <div
                                className="calendar-dropmenu-name"
                                onClick={() => {
                                  setCalendarGroupIndex(calendarGroupIndex);
                                  setCalendarGroupKey(calendarGroupItem._key);
                                  setMoreTaskCheck(false);
                                  setCalendarTaskType("全部");
                                }}
                                key={"group" + calendarGroupIndex}
                              >
                                <div className="calendar-logo">
                                  <Avatar
                                    name={calendarGroupItem.groupName}
                                    avatar={calendarGroupItem.groupLogo}
                                    type={"group"}
                                    index={calendarGroupIndex}
                                  />
                                </div>
                                <div className="calendar-name-title">
                                  {calendarGroupItem.groupName}
                                </div>
                              </div>
                            );
                          }
                        )
                      : null}
                  </React.Fragment>
                </ClickOutSide>
              </DropMenu>
            </div>
          }
        />
      ) : null}
      <div
        className="calendar-container"
        style={{ height: targetGroupKey ? "100%" : "calc(100vh - 68px)" }}
      >
        <div className="calendar-title">
          <div>
            <img
              src={leftArrowPng}
              className="calendar-choose-icon"
              onClick={() => {
                changeDate(0);
              }}
              alt=""
            />
            <img
              src={rightArrowPng}
              className="calendar-choose-icon"
              onClick={() => {
                changeDate(1);
              }}
              alt=""
            />
            {targetMonth}
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setInfoVisible(true);
                setCalendar(null);
                setCalendarType("新建");
                setStartDay(moment().startOf("day").valueOf());
                setEndDay(moment().endOf("day").valueOf());
              }}
            >
              创建日程
            </Button>
            <Switch
              checked={moreTaskCheck}
              checkedChildren="任务"
              unCheckedChildren="任务"
              onChange={(checked) => {
                setMoreTaskCheck(checked);
                setCalendarTaskType("全部");
              }}
              style={{ marginLeft: "10px" }}
            />
            {moreTaskCheck ? (
              <Select
                value={calendarTaskType}
                style={{ width: 120, marginLeft: "10px" }}
                onChange={(value) => {
                  setCalendarTaskType(value);
                }}
              >
                <Option value="全部">全部</Option>
                <Option value="指派">指派</Option>
                <Option value="执行">执行</Option>
              </Select>
            ) : null}
            <Select
              value={calendarDayType}
              style={{ width: 120, marginLeft: "10px" }}
              onChange={(value) => {
                setCalendarDayType(value);
                setMoreTaskCheck(false);
                setCalendarTaskType("全部");
              }}
            >
              <Option value={0}>3日</Option>
              <Option value={1}>星期</Option>
              <Option value={2}>月度</Option>
            </Select>
          </div>
          {/* <Checkbox onChange={getTask}>任务</Checkbox> */}
        </div>
        <div className="calendar-week">
          {calendarWeek.map((weekItem: any, weekIndex: number) => {
            return (
              <span
                key={"week" + weekIndex}
                className="calendar-week-item"
                style={{ width: calendarDayType ? "14.28%" : "33.33%" }}
              >
                {weekItem}
              </span>
            );
          })}
        </div>
        <div className="calendar-day" ref={calendarRef}>
          {calendarDate.map((calendarItem: any, calendarIndex: number) => {
            return (
              <div
                key={"calendar" + calendarIndex}
                className="calendar-day-item"
                onClick={(e) => {
                  setStartDay(
                    moment(calendarItem.startTime).startOf("day").valueOf()
                  );
                  setEndDay(
                    moment(calendarItem.endTime).endOf("day").valueOf()
                  );
                  setInfoVisible(true);
                  setCalendarType("新建");
                }}
                style={{
                  border: calendarItem.targetDay ? "4px solid #1890ff" : "",
                  height: calendarHeight,
                  width: calendarDayType ? "14.28%" : "33.33%",
                }}
              >
                <div
                  className="calendar-day-item-title"
                  style={{ zoom: deviceState === "xs" ? 0.7 : 1 }}
                >
                  {calendarItem.day}日 (
                  {`${
                    newCalendar(
                      calendarItem.date.year(),
                      calendarItem.date.month() + 1,
                      calendarItem.date.date()
                    ).lunarMonth
                  }月${
                    newCalendar(
                      calendarItem.date.year(),
                      calendarItem.date.month() + 1,
                      calendarItem.date.date()
                    ).lunarDay
                  }`}
                  )
                  {calendarItem.targetDay ? (
                    <span
                      style={{
                        color: "#1890ff",
                        marginLeft: "5px",
                      }}
                    >
                      今日
                    </span>
                  ) : null}
                </div>
                <div className="calendar-day-item-container">
                  {monthTaskList[calendarIndex]
                    ? monthTaskList[calendarIndex].map(
                        (taskItem: any, taskIndex: number) => {
                          return (
                            <React.Fragment key={"monthTaskList" + taskIndex}>
                              {(moreTaskCheck &&
                                (taskItem.type === 2 || taskItem.type === 6) &&
                                (calendarTaskType === "全部" ||
                                  (calendarTaskType === "指派" &&
                                    taskItem.creatorKey === user._key) ||
                                  (calendarTaskType === "执行" &&
                                    taskItem.executorKey === user._key))) ||
                              taskItem.type === 8 ||
                              !taskItem.type ? (
                                <div
                                  key={"task" + taskIndex}
                                  className="calendar-day-item-info"
                                  // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                  style={{
                                    borderLeft:
                                      "4px solid " +
                                      calendarColor[taskItem.taskType],
                                    color:
                                      taskItem.finishPercent === 2
                                        ? "#9ea2a8"
                                        : "333",
                                  }}
                                  // onDragEnd={(e: any) => {
                                  //   dragTask(e, calendarIndex, taskIndex);
                                  // }}
                                  // draggable="true"
                                  onClick={(e: any) => {
                                    if (
                                      taskItem.type !== 2 &&
                                      taskItem.type !== 6
                                    ) {
                                      getCalendarItem(
                                        e,
                                        taskItem,
                                        calendarIndex
                                      );
                                      // clickTask(e, taskItem, calendarIndex);
                                    } else {
                                      e.stopPropagation();
                                      dispatch(changeTaskInfoVisible(true));
                                      dispatch(setChooseKey(taskItem._key));
                                    }
                                  }}
                                  tabIndex={taskItem._key}
                                >
                                  {taskItem.type === 2 ||
                                  taskItem.type === 6 ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Avatar
                                        avatar={taskItem?.groupLogo}
                                        name={taskItem?.groupName}
                                        type={"group"}
                                        index={0}
                                        size={12}
                                      />
                                      <div
                                        style={{
                                          marginLeft: "5px",
                                          fontSize: "8px",
                                        }}
                                      >
                                        {taskItem?.groupName}
                                      </div>
                                    </div>
                                  ) : null}
                                  {taskItem.type === 5 ? (
                                    <React.Fragment>
                                      {moment(taskItem.taskEndDate).format(
                                        "HH:mm"
                                      ) + " "}
                                    </React.Fragment>
                                  ) : taskItem.type === 2 ||
                                    taskItem.type === 6 ? (
                                    <img
                                      src={
                                        taskItem.finishPercent
                                          ? finishPng
                                          : unfinishPng
                                      }
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        marginRight: "5px",
                                      }}
                                      onClick={() => {}}
                                      alt=""
                                    />
                                  ) : null}
                                  {taskItem.title}
                                </div>
                              ) : null}
                            </React.Fragment>
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        visible={infoVisible}
        onCancel={() => {
          setInfoVisible(false);
          setCalendar(null);
        }}
        onOk={() => {
          // deleteTask();
          // saveCalendar();
          if (childRef?.current) {
            //@ts-ignore
            childRef.current.saveCalendar();
          }
        }}
        title={calendarType + "日程"}
        centered={true}
        destroyOnClose={true}
      >
        {/* <CalendarInfo
          calendarKey={calendar?._key}
          calendarNumber={calendar?.type === 8 ? 8 : 7}
          onClose={(type?: string) => {
            setInfoVisible(false);
          }}
          flashCalendar={() => {
            getData(calendarDate, calendarGroupKey);
            if (moreTaskCheck) {
              getTask();
            }
          }}
          targetGroupKey={calendarGroupKey}
          ref={childRef}
          startDay={startDay}
          endDay={endDay}
        /> */}
      </Modal>
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
