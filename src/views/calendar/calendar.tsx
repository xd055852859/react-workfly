import React, { useState, useEffect, useRef } from "react";
import "./calendar.css";
import { Modal } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import cnLocale from "@fullcalendar/core/locales/zh-cn";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";

import { useMount } from "../../hook/common";


import { setMessage } from "../../redux/actions/commonActions";

import ClickOutSide from "../../components/common/clickOutside";
import CalendarHeader from "./calendarHeader";
import DropMenu from "../../components/common/dropMenu";
import CalendarInfo from "./calendarInfo";

import downArrowPng from "../../assets/img/downArrow.png";
import Avatar from "../../components/common/avatar";

interface CalendarProps {
  targetGroupKey: string;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { targetGroupKey } = props;
  const dispatch = useDispatch();
  // const calendarList = useTypedSelector((state) => state.task.calendarList);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  const user = useTypedSelector((state) => state.auth.user);

  const [calendarDate, setCalendarDate] = useState<any>([
    moment().subtract(1, "month").startOf("month").startOf("day").valueOf(),
    moment().add(1, "month").endOf("month").endOf("day").valueOf(),
  ]);
  const [calendarObj, setCalendarObj] = useState<any>({});

  const [monthTaskList, setMonthTaskList] = useState<any>([]);
  const [monthSearchList, setMonthSearchList] = useState<any>([]);

  // const [calendarStartTime, setCalendarStartTime] = useState(
  //   moment().startOf("day").valueOf()
  // );
  const [targetDate, setTargetDate] = useState<any>(
    moment().endOf("day").valueOf()
  );
  const [memberVisible, setMemberVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [calendarGroupArray, setCalendarGroupArray] = useState<any>(null);
  const [calendarMemberArray, setCalendarMemberArray] = useState<any>(null);
  const [calendarGroupIndex, setCalendarGroupIndex] = useState<any>(10000);
  const [calendarMemberIndex, setCalendarMemberIndex] = useState<any>(10000);

  const [calendarMemberKey, setCalendarMemberKey] = useState<any>(null);
  const [calendarGroupKey, setCalendarGroupKey] = useState<any>("");
  const [moreTaskCheck, setMoreTaskCheck] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const childRef = useRef<any>();
  const [calendar, setCalendar] = useState<any>(null);
  const [startDay, setStartDay] = useState<any>(0);
  const [endDay, setEndDay] = useState<any>(0);
  const [remindTime, setRemindTime] = useState<any>(0);
  const [remindEndTime, setRemindEndTime] = useState<any>(0);
  const calendarColor = [
    "#E8A861",
    "#9DC85E",
    "#39B98D",
    "#3970B9",
    "#9E5CCF",
    "#DA4949",
  ];
  let calendarRef = useRef<any>(null);
  let unDistory = useRef<any>(true);
  useMount(() => {
    getGroupArray("");
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
  // useEffect(() => {
  //   let newCalendarGroupArray: any = [];
  //   if (groupArray) {
  //     newCalendarGroupArray = groupArray.filter((item) => {
  //       return item.groupName.indexOf("主群") === -1;
  //     });
  //     // newCalendarGroupArray.unshift({
  //     //   _key: mainGroupKey,
  //     //   groupName: "全部",
  //     //   groupLogo: user?.profile.avatar,
  //     // });
  //     setCalendarGroupArray(newCalendarGroupArray);
  //   }
  // }, [user]);
  useEffect(() => {
    if (memberArray) {
      let newCalendarMemberArray: any = _.cloneDeep(memberArray);
      let index = _.findIndex(newCalendarMemberArray, { userId: user._key });
      let item = newCalendarMemberArray[index];
      newCalendarMemberArray.splice(index, 1);
      newCalendarMemberArray.unshift(item);
      setCalendarMemberArray(newCalendarMemberArray);
    }
  }, [memberArray, user]);
  useEffect(() => {
    if (targetGroupKey) {
      setCalendarGroupKey(targetGroupKey);
    }
  }, [targetGroupKey]);
  useEffect(() => {
    if (
      calendarDate.length > 0 &&
      (headerIndex === 1 ||
        headerIndex === 2 ||
        headerIndex === 3 ||
        headerIndex === 5)
    ) {
      getData(calendarDate, calendarMemberKey);
    }
    //eslint-disable-next-line
  }, [
    calendarMemberKey,
    calendarMemberIndex,
    calendarDate,
    headerIndex,
    groupKey,
    targetUserKey,
  ]);

  useEffect(() => {
    if (JSON.stringify(calendarObj) !== "{}" && calendarDate.length > 0) {
      let newTaskList: any = [];
      let groupObj: any = {};
      calendarObj.arr.forEach((taskItem: any) => {
        if (taskItem.remindTime) {
          newTaskList.push({
            ...taskItem,
            id: taskItem._key,
            title: taskItem.title,
            start: moment(taskItem.taskEndDate)
              .hour(taskItem.remindTime.hour)
              .minute(taskItem.remindTime.minute)
              .valueOf(),
            end:
              !isNaN(taskItem?.remindEndTime?.hour) &&
              !isNaN(taskItem?.remindEndTime?.minute)
                ? moment(taskItem.taskEndDate)
                    .hour(taskItem.remindEndTime.hour)
                    .minute(taskItem.remindEndTime.minute)
                    .valueOf()
                : moment(taskItem.taskEndDate)
                    .hour(taskItem.remindTime.hour)
                    .minute(taskItem.remindTime.minute)
                    .valueOf() + 1800000,
            color: calendarColor[taskItem.taskType],
          });
        }
        if (!groupObj[taskItem.groupKey]) {
          groupObj[taskItem.groupKey] = {
            groupKey: taskItem.groupKey,
            groupLogo: taskItem.groupLogo,
            groupName: taskItem.groupName,
          };
        }
      });
      calendarObj.repeatArr.forEach((taskItem: any) => {
        newTaskList.push({
          ...taskItem,
          id: taskItem._key,
          title: taskItem.title,
          startRecur: moment(taskItem.startDay).startOf("day").valueOf(),
          endRecur: moment(taskItem.endDay).endOf("day").valueOf(),
          allDay: true,
          daysOfWeek: taskItem.circleData,
        });
      });
      setMonthTaskList(newTaskList);
      // setMonthSearchList(newTaskList);
      searchGroup(calendarGroupKey, newTaskList);
      // setMonthTaskList((prevMonthTaskList) => {
      //   return [...prevMonthTaskList, ...newTaskList];
      // });
    }
    //eslint-disable-next-line
  }, [calendarObj, calendarGroupKey]);
  const getGroupArray = async (targetUserKey) => {
    let res: any = await api.task.getCalendarGroup(targetUserKey);
    if (res.msg === "OK") {
      let newCalendarGroupArray = res.result.filter(
        (item: any, index: number) => {
          if (item._key === mainGroupKey) {
            item.groupName = "私有项目";
            item.groupLogo = "";
          }
          return (
            item.groupName.indexOf("主群") === -1 &&
            item.groupName.indexOf("私聊群") === -1 &&
            item.myRole < 4
          );
        }
      );
      // let item = _.cloneDeep(newCalendarGroupArray[newIndex]);
      // newCalendarGroupArray.splice(newIndex, 1);
      // console.log(newIndex)
      // if (!targetUserKey) {
      //   newCalendarGroupArray.push(item);
      // }
      console.log(newCalendarGroupArray);
      setCalendarGroupArray(newCalendarGroupArray);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getData = async (calendarDate: any, calendarMemberKey: string) => {
    let obj: any = {
      startTime: calendarDate[0],
      endTime: calendarDate[1],
    };
    if (headerIndex === 2) {
      obj.targetUKey = targetUserKey;
      obj.type = 3;
    } else if (headerIndex === 3) {
      obj.groupKeyArray = [groupKey];
      obj.type = 1;
    } else if (headerIndex === 1) {
      obj.type = 2;
    } else if (headerIndex === 5) {
      if (calendarMemberIndex !== 10000) {
        obj.targetUKey = calendarMemberKey;
        obj.type = 3;
      } else {
        obj.type = 2;
      }
    }
    let res: any = await api.task.getScheduleList({ ...obj });
    if (res.msg === "OK") {
      setCalendarObj((prevCalendarObj) => {
        prevCalendarObj.arr = res.result.getNoCircleScheduleList;
        prevCalendarObj.repeatArr = res.result.validEvents;
        return { ...prevCalendarObj };
      });
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };

  // {traditionalDate.GetLunarDay(moment())[1]}

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

  const dropCalendar = async (dropInfo) => {
    let index = _.findIndex(monthTaskList, { _key: dropInfo.event.id });
    let item = _.cloneDeep(monthTaskList[index]);
    if (item.type) {
      let obj: any = {
        eventOrTaskKey: item._key,
        remindTime: {
          hour: moment(dropInfo.event.start).hour(),
          minute: moment(dropInfo.event.start).minute(),
        },
        remindEndTime: {
          hour: moment(dropInfo.event.end).hour(),
          minute: moment(dropInfo.event.end).minute(),
        },
        startDay: moment(dropInfo.event.start).startOf("day").valueOf(),
        endDay: moment(dropInfo.event.end).endOf("day").valueOf(),
        type: 2,
        followUserArray: item.followUserArray,
        followUserArrayNew: item.followUserArrayNew,
        circleData: [],
        repeatCircle: 1,
        title: item.title,
        taskType: item.taskType,
      };
      let calendarRes: any = await api.task.editSchedule(obj);
      if (calendarRes.msg === "OK") {
        api.task.editTask({
          key: item._key,
          taskEndDate: moment(dropInfo.event.end).endOf("day").valueOf(),
        });
      } else {
        dispatch(setMessage(true, calendarRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "循环任务无法拖拽修改", "error"));
      dropInfo.revert();
    }
  };

  const clickCalendar = (info) => {
    let item = _.cloneDeep(
      monthTaskList[_.findIndex(monthTaskList, { _key: info.event.id })]
    );
    if (item.myRole < 4 || item.followUserArray.indexOf(user._key) !== -1) {
      setTargetDate(moment(info.event.startStr).valueOf());
      setCalendar(item);
      setInfoVisible(true);
    } else {
      dispatch(setMessage(true, "权限不够无法查看", "error"));
    }

    // event.setProp("title", "11111");
  };
  const dateClickCalendar = (info) => {
    console.log(info);
    if ((headerIndex === 3 && groupInfo.role < 4) || headerIndex !== 3) {
      if (calendarGroupArray.length > 0) {
        setStartDay(moment(info.dateStr).startOf("day").valueOf());
        setEndDay(moment(info.dateStr).endOf("day").valueOf());
        setRemindTime(0);
        setRemindEndTime(0);
        if (
          moment(info.dateStr).startOf("day").valueOf() !==
          moment().startOf("day").valueOf()
        ) {
          console.log("????");
          setRemindTime(moment(info.dateStr).hour(8).minute(0).valueOf());
          setRemindEndTime(moment(info.dateStr).hour(9).minute(0).valueOf());
        } else {
          setRemindTime(
            moment().minute() > 30
              ? moment().endOf("hour").valueOf() + 1
              : moment().startOf("hour").valueOf() + 1800001
          );
          setRemindEndTime(
            moment().minute() > 30
              ? moment().endOf("hour").valueOf() + 1800001
              : moment().startOf("hour").valueOf() + 3600001
          );
        }
        setInfoVisible(true);
      } else {
        dispatch(setMessage(true, "没有共同群可以创建日程", "error"));
      }
    } else {
      dispatch(setMessage(true, "权限不够无法创建", "error"));
    }
    // change the day's background color just for fun
  };
  const selectCalendar = (info) => {
    if (calendarGroupArray && calendarGroupArray.length > 0) {
      let view = calendarRef.current.getApi().view;
      if (view.type !== "dayGridMonth") {
        setRemindTime(moment(info.start).valueOf());
        setRemindEndTime(moment(info.end).valueOf());
      }
      setStartDay(moment(info.start).startOf("day").valueOf());
      setEndDay(moment(info.start).endOf("day").valueOf());
      setInfoVisible(true);
    }
    // change the day's background color just for fun
  };
  const searchGroup = (groupKey, taskList?: any) => {
    let newMonthSearchList = _.cloneDeep(monthSearchList);
    let newMonthTaskList = taskList ? taskList : _.cloneDeep(monthTaskList);
    if (groupKey) {
      newMonthSearchList = _.cloneDeep(newMonthTaskList).filter((item: any) => {
        return item.groupKey === groupKey;
      });
    } else {
      newMonthSearchList = _.cloneDeep(newMonthTaskList);
    }
    setMonthSearchList(newMonthSearchList);
  };
  const changeDate = () => {
    let view = calendarRef.current.getApi().view;
    let newCalendarDate = _.cloneDeep(calendarDate);
    newCalendarDate = [
      moment(view.currentStart).startOf("day").valueOf(),
      moment(view.currentEnd).endOf("day").valueOf(),
    ];
    setCalendarDate(newCalendarDate);
  };
  return (
    <div className="calendar">
      {!targetGroupKey ? (
        <CalendarHeader
          slot={
            <>
              <div
                className="calendar-name"
                onClick={() => {
                  setMemberVisible(true);
                }}
              >
                {calendarMemberIndex === 10000 ? (
                  <>
                    <div className="calendar-logo">
                      <Avatar
                        name={user?.profile?.nickName}
                        avatar={user?.profile?.avatar}
                        type={"person"}
                        index={0}
                        size={22}
                      />
                    </div>
                    <div className="calendar-name-title">
                      {user?.profile?.nickName}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="calendar-logo">
                      <Avatar
                        avatar={
                          calendarMemberArray &&
                          calendarMemberArray[calendarMemberIndex]?.avatar
                        }
                        name={
                          calendarMemberArray &&
                          calendarMemberArray[calendarMemberIndex].nickName
                        }
                        type={"person"}
                        index={0}
                        size={22}
                      />
                    </div>
                    <div className="calendar-name-title">
                      {calendarMemberArray &&
                        calendarMemberArray[calendarMemberIndex].nickName}
                    </div>
                  </>
                )}
                <img
                  src={downArrowPng}
                  alt=""
                  className="calendar-name-title-logo"
                />
                <DropMenu
                  visible={memberVisible}
                  dropStyle={{
                    width: "300px",
                    height: "500px",
                    top: "55px",
                    left: "0px",
                    color: "#333",
                    overflow: "visible",
                  }}
                  onClose={() => {
                    setMemberVisible(false);
                  }}
                  title={"队友列表"}
                >
                  <ClickOutSide
                    onClickOutside={() => {
                      setGroupVisible(false);
                    }}
                  >
                    <React.Fragment>
                      {calendarMemberArray
                        ? calendarMemberArray.map(
                            (memberItem: any, memberpIndex: number) => {
                              return (
                                <div
                                  className="calendar-dropmenu-name"
                                  onClick={() => {
                                    setCalendarMemberIndex(memberpIndex);
                                    setCalendarMemberKey(memberItem.userId);
                                    setCalendarGroupIndex(10000);
                                    setMoreTaskCheck(false);
                                    getGroupArray(
                                      memberItem.userId === user?._key
                                        ? ""
                                        : memberItem.userId
                                    );
                                  }}
                                  key={"member" + memberpIndex}
                                >
                                  <div className="calendar-logo">
                                    <Avatar
                                      name={memberItem.nickName}
                                      avatar={memberItem.avatar}
                                      type={"person"}
                                      index={memberpIndex}
                                    />
                                  </div>
                                  <div className="calendar-name-title">
                                    {memberItem.nickName}
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
              <div
                className="calendar-name"
                onClick={() => {
                  setGroupVisible(true);
                }}
              >
                {calendarGroupIndex === 10000 ? (
                  <>
                    <div className="calendar-logo">
                      <Avatar
                        name={"全部"}
                        avatar={""}
                        type={"group"}
                        index={0}
                        size={22}
                      />
                    </div>
                    <div className="calendar-name-title">全部</div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                      <div
                        className="calendar-dropmenu-name"
                        onClick={() => {
                          setCalendarGroupIndex(10000);
                          setMoreTaskCheck(false);
                          setCalendarGroupKey("");
                          searchGroup("");
                        }}
                      >
                        <div className="calendar-logo">
                          <Avatar
                            name={"全部"}
                            avatar={""}
                            type={"group"}
                            index={0}
                          />
                        </div>
                        <div className="calendar-name-title">全部</div>
                      </div>
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
                                    setMoreTaskCheck(false);
                                    setCalendarGroupKey(calendarGroupItem._key);
                                    searchGroup(calendarGroupItem._key);
                                  }}
                                  key={"group" + calendarGroupIndex}
                                >
                                  <div className="calendar-logo">
                                    <Avatar
                                      name={calendarGroupItem?.groupName}
                                      avatar={calendarGroupItem?.groupLogo}
                                      type={"group"}
                                      index={calendarGroupIndex}
                                    />
                                  </div>
                                  <div className="calendar-name-title">
                                    {calendarGroupItem?.groupName}
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
            </>
          }
        />
      ) : null}
      <div className="calendar-box">
        <FullCalendar
          ref={calendarRef}
          height={document.documentElement.offsetHeight - 68}
          locale={cnLocale}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={"dayGridMonth"}
          buttonText={{
            today: "今日",
            month: "月",
            week: "周",
            day: "日",
            list: "列表",
          }}
          slotDuration={'00:15:00'}
          customButtons={{
            createButton: {
              text: "创建日程(会议)",
              click: function () {
                if (
                  (headerIndex === 3 && groupInfo.role < 4) ||
                  headerIndex !== 3
                ) {
                  if (calendarGroupArray.length > 0) {
                    setInfoVisible(true);
                  } else {
                    dispatch(
                      setMessage(true, "没有共同群可以创建日程", "error")
                    );
                  }
                } else {
                  dispatch(setMessage(true, "权限不够无法创建", "error"));
                }
              },
            },
            prevButton: {
              icon: "chevron-left",
              click: function () {
                calendarRef.current.getApi().prev();
                changeDate();
              },
            },
            nextButton: {
              icon: "chevron-right",
              click: function () {
                calendarRef.current.getApi().next();
                changeDate();
              },
            },
            todayButton: {
              text: "今日",
              click: function () {
                calendarRef.current.getApi().today();
                changeDate();
              },
            },
            monthButton: {
              text: "月",
              click: function () {
                calendarRef.current.getApi().changeView("dayGridMonth");
                changeDate();
              },
            },
            weekButton: {
              text: "周",
              click: function () {
                calendarRef.current.getApi().changeView("timeGridWeek");
                changeDate();
              },
            },
            dayButton: {
              text: "日",
              click: function () {
                calendarRef.current.getApi().changeView("timeGridDay");
                changeDate();
              },
            },
            listButton: {
              text: "列表",
              click: function () {
                calendarRef.current.getApi().changeView("list");
                changeDate();
              },
            },
          }}
          headerToolbar={{
            left: "prevButton,nextButton todayButton createButton",
            center: "title",
            right: "monthButton,weekButton,dayButton,listButton",
          }}
          droppable={true} // this allows things to be dropped onto the calendar
          editable={true}
          unselectAuto={true} // 选中时，点击页面其它位置是否取消选中
          selectable={true} // 允许用户点击或拖拽选中
          selectOverlap={true} // 用户选择时能否重叠到事件上, selectable必须为true才生效
          eventStartEditable={true}
          eventDurationEditable={true}
          handleWindowResize={true} //随浏览器窗口变化
          events={monthSearchList}
          eventDrop={dropCalendar}
          eventResize={dropCalendar}
          eventClick={clickCalendar}
          dateClick={dateClickCalendar}
          select={selectCalendar}
        />
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
          title={
            (calendar?._key ? "编辑 " : "创建") +
            (calendar?._key && !calendar?.type ? "循环" : "") +
            "日程"
          }
          centered={true}
          destroyOnClose={true}
          bodyStyle={{
            height: "450px",
            overflow: "auto",
          }}
        >
          <CalendarInfo
            calendarKey={calendar?._key}
            calendarNumber={calendar?.type === 8 ? 8 : 7}
            onClose={(type?: string) => {
              setInfoVisible(false);
              setRemindTime(0);
              setRemindEndTime(0);
              setStartDay(0);
              setEndDay(0);
            }}
            flashCalendar={() => {
              getData(calendarDate, calendarMemberKey);
              if (moreTaskCheck) {
                getTask();
              }
              setCalendar(null);
            }}
            targetDate={targetDate}
            targetGroupKey={calendarGroupKey}
            targetMemberKey={calendarMemberKey}
            groupArray={calendarGroupArray}
            ref={childRef}
            startDay={startDay}
            endDay={endDay}
            remindTime={remindTime}
            remindEndTime={remindEndTime}
          />
        </Modal>
      </div>
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
