import React, { useState, useEffect, useRef, useCallback } from "react";
import "./calendar.css";
import { Modal, Button } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import traditionalDate from "../../components/common/date";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";
import { useAuth } from "../../context/auth";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";
import { editTask } from "../../redux/actions/taskActions";

import ClickOutSide from "../../components/common/clickOutside";
import CalendarHeader from "./calendarHeader";
import DropMenu from "../../components/common/dropMenu";
import CalendarInfo from "./calendarInfo";

import rightArrowPng from "../../assets/img/rightArroww.png";
import leftArrowPng from "../../assets/img/leftArroww.png";
import unfinishPng from "../../assets/img/timeSet2.png";
import finishPng from "../../assets/img/timeSet3.png";
import downArrowPng from "../../assets/img/downArrow.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";

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
  const user = useTypedSelector((state) => state.auth.user);

  const [calendarDate, setCalendarDate] = useState<any>([]);
  const [calendarObj, setCalendarObj] = useState<any>({});
  const [calendarType, setCalendarType] = useState("");
  const [calendar, setCalendar] = useState<any>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [targetMonth, setTargetMonth] = useState("");
  const [monthTaskList, setMonthTaskList] = useState<any>([]);
  const [futureTime, setFutureTime] = useState<any>(0);
  const [calendarStartTime, setCalendarStartTime] = useState(
    moment().startOf("month").startOf("day").valueOf()
  );
  const [groupVisible, setGroupVisible] = useState(false);
  const [calendarGroupArray, setCalendarGroupArray] = useState<any>(null);
  const [calendarGroupIndex, setCalendarGroupIndex] = useState<any>(0);
  const [calendarGroupKey, setCalendarGroupKey] = useState<any>(mainGroupKey);
  const [followList, setFollowList] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [followEdit, setFollowEdit] = useState(false);

  const weekArr = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
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
  
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    let newCalendarGroupArray: any = [];
    if (groupArray) {
      newCalendarGroupArray = _.cloneDeep(groupArray);
      newCalendarGroupArray.unshift({
        _key: mainGroupKey,
        groupName: user?.profile.nickName,
        groupLogo: user?.profile.avatar,
      });
      setCalendarGroupArray(newCalendarGroupArray);
    }
  }, [groupArray, mainGroupKey, user]);
  useEffect(() => {
    if (targetGroupKey) {
      setCalendarGroupKey(targetGroupKey);
    }
  }, [targetGroupKey]);
  const getData = useCallback(
    async (calendarDate: any, calendarGroupKey: string) => {
      let res: any = await api.task.getScheduleList(
        [calendarGroupKey],
        calendarDate[0].startTime,
        calendarDate[calendarDate.length - 1].endTime
      );
      if (unDistory.current) {
        if (res.msg === "OK") {
          setCalendarObj((prevCalendarObj) => {
            prevCalendarObj.arr = res.result.getNoCircleScheduleList;
            prevCalendarObj.repeatArr = res.result.validEvents;
            return { ...prevCalendarObj };
          });
        } else {
          dispatch(setMessage(true, res.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (calendarGroupKey && calendarDate.length > 0) {
      getData(calendarDate, calendarGroupKey);
    }
  }, [calendarGroupKey, calendarDate, getData]);
  const getCalendar = useCallback((targetDate: any) => {
    // 获得当前月的天数  和 第一天的星期数
    // let newTaskList: any = [];
    let curDays = getMonthDays(targetDate); // 当前天数
    let curWeek = getWeekDays(targetDate.clone()); // 当前月第一天的星期(索引值)
    let upDays = getMonthDays(targetDate.clone().subtract(1, "month")); // 上月的天数
    // 生成的结构
    let strDate: any = [];
    // 下个月的起始日期
    let nextFirstDate = 0;
    for (let i = 0; i < 35; i++) {
      // 1. 当前月的上一个月
      if (i < curWeek) {
        // 返回的索引值刚好是上月在当月显示的天数
        let momentDate = moment(new Date(
          targetDate.year() +
            "/" +
            (targetDate.clone().subtract(1, "month").month() + 1) +
            "/" +
            upDays
        ).getTime());
        strDate.unshift({
          month: "last",
          day: upDays,
          date: momentDate,
          week: momentDate.day(),
          startTime: momentDate.startOf("day").valueOf(),
          endTime: momentDate.endOf("day").valueOf(),
          targetMonth: momentDate.month(),
        });
        upDays--; // 倒叙显示   30 31
      } else if (i >= curDays + curWeek) {
        //去除掉当月天数+上月天数就是下月天数
        // 2. 当前月的下一个月：除去当月最后一天+上月的几天剩余的是下月开始计算
        // curWeek 返回值刚好是上月占用的天数
        nextFirstDate++;
        let momentDate = moment(new Date(
          targetDate.year() +
            "/" +
            (targetDate.clone().add(1, "month").month() + 1) +
            "/" +
            nextFirstDate
        ).getTime());
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
        let momentDate = moment(new Date(
          targetDate.year() +
            "/" +
            (targetDate.clone().month() + 1) +
            "/" +
            (i - curWeek + 1)
        ).getTime());
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
    setCalendarDate(strDate);
  }, []);

  useMount(() => {
    // setLoading(false);
    getCalendar(moment().startOf("month").startOf("day"));
    setTargetMonth(
      moment().startOf("month").startOf("day").format("YYYY") +
        "年" +
        moment().startOf("month").startOf("day").format("MM") +
        "月"
    );
  });
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
      setMonthTaskList(newTaskList);
    }
  }, [calendarObj, calendarDate]);

  const getMonthDays = (momentObj: any) => {
    return momentObj.daysInMonth();
  };
  const getWeekDays = (momentObj: any) => {
    return momentObj.startOf("month").weekday(); //
  };

  // {traditionalDate.GetLunarDay(moment())[1]}
  const changeMonth = (type: number) => {
    let newCalendarStartTime = 0;
    //当前时间
    if (type === 0) {
      newCalendarStartTime = moment(calendarStartTime)
        .subtract(1, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      // newCalendarEndTime = moment(calendarStartTime)
      //   .subtract(1, "month")
      //   .endOf("month")
      //   .endOf("day")
      //   .valueOf();
    } else {
      newCalendarStartTime = moment(calendarStartTime)
        .add(1, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      // newCalendarEndTime = moment(calendarStartTime)
      //   .add(1, "month")
      //   .endOf("month")
      //   .endOf("day")
      //   .valueOf();
    }
    setCalendarStartTime(newCalendarStartTime);
    getCalendar(moment(newCalendarStartTime));
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
    setFutureTime(calendarDate[calendarIndex].startTime);
    setCalendar(taskItem);
    setCalendarType("编辑");
    setInfoVisible(true);
    e.stopPropagation();
  };
  const saveCalendar = async () => {
    let newCalendar = _.cloneDeep(calendar);
    if (newCalendar) {
      if (!newCalendar.title) {
        dispatch(setMessage(true, "请输入日程标题", "error"));
        return;
      }

      if (newCalendar.groupKeyArray && newCalendar.groupKeyArray.length === 0) {
        newCalendar.groupKeyArray = [mainGroupKey];
      } else if (newCalendar.groupKeyArray.indexOf(mainGroupKey) === -1) {
        newCalendar.groupKeyArray.push(mainGroupKey);
      }
      if (calendarType === "新建") {
        if (
          newCalendar.startDay === newCalendar.endDay &&
          newCalendar.repeatCircle
        ) {
          dispatch(setMessage(true, "循环日程请选择正确的结束时间", "error"));
          return;
        }
        let calendarRes: any = await api.task.createSchedule(newCalendar);
        if (calendarRes.msg === "OK") {
          dispatch(setMessage(true, "创建日程成功", "success"));
          getData(calendarDate, calendarGroupKey);
          setInfoVisible(false);
          setCalendar(null);
        } else {
          dispatch(setMessage(true, calendarRes.msg, "error"));
        }
      } else if (calendarType === "编辑") {
        if (isEdit) {
          let obj: any = {
            repeatCircle: newCalendar.repeatCircle,
            circleData: newCalendar.circleData,
            title: newCalendar.title,
            groupKey: newCalendar.groupKey,
            content: "",
            icon: "",
            taskType: newCalendar.taskType,
          };
          if (newCalendar.calendarType === "未来") {
            //未来
            obj.type1 = 2;
            obj.type2 = 2;
            obj.futureTime = futureTime;
            obj.eventKey = newCalendar._key;
          } else {
            let calendarIndex = _.findIndex(calendarObj.arr, {
              _key: newCalendar._key,
            });
            // console.log(calendarObj.arr[calendarIndex])
            if (!calendarObj.arr[calendarIndex].origionalKey) {
              dispatch(
                editTask(
                  {
                    key: newCalendar._key,
                    ...newCalendar,
                  },
                  0
                )
              );
              dispatch(setMessage(true, "编辑日程成功", "success"));
              getData(calendarDate, calendarGroupKey);
              setInfoVisible(false);
              // setCalendar(null);
              return;
            }
            obj.taskKey = newCalendar._key;
            obj.eventKey = calendarObj.arr[calendarIndex].origionalKey
              ? calendarObj.arr[calendarIndex].origionalKey
              : "";
            obj.taskEndDate = newCalendar.taskEndDate;
            obj.type1 = 1;
            obj.type2 = 1;
          }
          let calendarRes: any = await api.task.changeCircleSchedule(obj);
          if (calendarRes.msg === "OK") {
            dispatch(setMessage(true, "编辑日程成功", "success"));
            getData(calendarDate, calendarGroupKey);
            setInfoVisible(false);
            setCalendar(null);
          } else {
            dispatch(setMessage(true, calendarRes.msg, "error"));
          }
        } else if (followEdit) {
          let obj: any = { followUKeyArray: followList };
          if (newCalendar.origionalKey && newCalendar.calendarEditType === 2) {
            obj.eventKey = newCalendar.origionalKey;
          } else if (!newCalendar.type) {
            obj.eventKey = newCalendar._key;
          } else {
            obj.cardKey = newCalendar._key;
          }
          let followRes: any = await api.task.setEventFollowUser(obj);
          if (followRes.msg === "OK") {
            dispatch(setMessage(true, "编辑日程成功", "success"));
            setInfoVisible(false);
          } else {
            dispatch(setMessage(true, followRes.msg, "error"));
          }
        } else {
          setInfoVisible(false);
        }
      }
    } else {
      dispatch(setMessage(true, "请输入日程内容", "error"));
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
                <img
                  src={
                    calendarGroupArray &&
                    calendarGroupArray[calendarGroupIndex].groupLogo
                      ? calendarGroupArray[calendarGroupIndex].groupLogo
                      : defaultGroupPng
                  }
                  alt=""
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
                                }}
                                key={"group" + calendarGroupIndex}
                              >
                                <div className="calendar-logo">
                                  <img
                                    src={
                                      calendarGroupItem.groupLogo
                                        ? calendarGroupItem.groupLogo +
                                          "?imageMogr2/auto-orient/thumbnail/80x"
                                        : defaultGroupPng
                                    }
                                    alt=""
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
        <div className="calendar-box">
          <div className="calendar-title">
            <img
              src={leftArrowPng}
              className="calendar-choose-icon"
              onClick={() => {
                changeMonth(0);
              }}
              alt=""
            />
            {targetMonth}
            <img
              src={rightArrowPng}
              className="calendar-choose-icon"
              onClick={() => {
                changeMonth(1);
              }}
              alt=""
            />
            <Button
              type="primary"
              onClick={() => {
                setInfoVisible(true);
                setCalendar(null);
                setCalendarType("新建");
              }}
            >
              创建日程
            </Button>
          </div>
          <div className="calendar-week">
            {weekArr.map((weekItem: any, weekIndex: number) => {
              return (
                <span key={"week" + weekIndex} className="calendar-week-item">
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
                    setInfoVisible(true);
                    setCalendarType("新建");
                    setCalendar({
                      startDay: moment(calendarItem.startTime)
                        .startOf("day")
                        .valueOf(),
                      endDay: moment(calendarItem.endTime)
                        .startOf("day")
                        .valueOf(),
                    });
                  }}
                  style={{
                    border: calendarItem.targetDay ? "4px solid #1890ff" : "",
                  }}
                >
                  <div
                    className="calendar-day-item-title"
                    style={{ zoom: deviceState === "xs" ? 0.7 : 1 }}
                  >
                    {calendarItem.day}日 (
                    {traditionalDate.GetLunarDay(calendarItem.date)[2]})
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
                              <div
                                key={"task" + taskIndex}
                                className="calendar-day-item-info"
                                // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                style={{
                                  borderLeft:
                                    "4px solid " +
                                    calendarColor[taskItem.taskType],
                                  textDecoration:
                                    taskItem.finishPercent === 2
                                      ? "line-through"
                                      : "",
                                }}
                                // onDragEnd={(e: any) => {
                                //   dragTask(e, calendarIndex, taskIndex);
                                // }}
                                // draggable="true"
                                onClick={(e: any) => {
                                  getCalendarItem(e, taskItem, calendarIndex);
                                  // clickTask(e, taskItem, calendarIndex);
                                }}
                                tabIndex={taskItem._key}
                              >
                                {taskItem.type === 5 ? (
                                  <React.Fragment>
                                    {moment(taskItem.taskEndDate).format(
                                      "HH:mm"
                                    ) + " "}
                                  </React.Fragment>
                                ) : taskItem.type === 2 ? (
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
      </div>
      <Modal
        visible={infoVisible}
        onCancel={() => {
          setInfoVisible(false);
          setCalendar(null);
        }}
        onOk={() => {
          // deleteTask();
          saveCalendar();
        }}
        title={calendarType + "日程"}
        centered={true}
        destroyOnClose={true}
      >
        <CalendarInfo
          setCalendar={setCalendar}
          setFollowList={setFollowList}
          taskItem={calendar}
          calendarColor={calendarColor}
          calendarType={calendarType}
          targetGroupKey={targetGroupKey ? targetGroupKey : mainGroupKey}
          changeEdit={(isEdit: boolean) => {
            setIsEdit(isEdit);
          }}
          changeFollowEdit={(followEdit: boolean) => {
            setFollowEdit(followEdit);
          }}
          onClose={(type?: string) => {
            setInfoVisible(false);
            setCalendar(null);
            if (type === "delete") {
              getData(calendarDate, calendarGroupKey);
            }
          }}
        />
      </Modal>
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
