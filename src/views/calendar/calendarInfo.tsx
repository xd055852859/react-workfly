import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./calendarInfo.css";
import "./calendarItem.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import {
  Input,
  Button,
  DatePicker,
  TimePicker,
  Modal,
  Radio,
  Dropdown,
  Drawer,
} from "antd";
import {DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { setMessage } from "../../redux/actions/commonActions";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";

import plusPng from "../../assets/img/contact-plus.png";

// import deleteIconSvg from '../../assets/svg/deleteIcon.svg';
import Tooltip from "../../components/common/tooltip";
import Avatar from "../../components/common/avatar";
import ContactMember from "../contact/contactMember";
const { RangePicker } = DatePicker;
interface CalendarInfoProps {
  calendarKey?: any;
  calendarNumber: number;
  onClose: any;
  targetGroupKey: string;
  targetMemberKey: string;
  flashCalendar: any;
  startDay?: number;
  endDay?: number;
  remindTime?: any;
  remindEndTime?: any;
  groupArray?: any;
  targetDate?: any;
}

const CalendarInfo = forwardRef((props: CalendarInfoProps, ref) => {
  const {
    calendarKey,
    calendarNumber,
    onClose,
    targetGroupKey,
    targetMemberKey,
    targetDate,
    groupArray,
    flashCalendar,
    startDay,
    endDay,
    remindTime,
    remindEndTime,
  } = props;
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const dispatch = useDispatch();
  const [calendarInfo, setCalendarInfo] = useState<any>({
    circleData: [],
    groupKeyArray: [],
    title: "",
    startDay: moment().startOf("day").valueOf(),
    endDay: moment().endOf("day").valueOf(),
    remindTime:
      moment().minute() > 30
        ? moment().endOf("hour").valueOf() + 1
        : moment().startOf("hour").valueOf() + 1800001,
    remindEndTime:
      moment().minute() > 30
        ? moment().endOf("hour").valueOf() + 1800001
        : moment().startOf("hour").valueOf() + 3600001,
    type: 2,
    taskType: 0,
    groupKey: "",
  });

  const [calendarIndex, setCalendarIndex] = useState(0);
  const [repeatIndex, setRepeatIndex] = useState(1);
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [memberVisible, setMemberVisible] = useState(false);
  const [calendarMember, setCalendarMember] = useState<any>([]);
  const [calendarFollow, setCalendarFollow] = useState<any>([]);
  const [calendarFollowKey, setCalendarFollowKey] = useState<any>([]);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);

  const [calendarType, setCalendarType] = useState(0);
  const [groupIndex, setGroupIndex] = useState(0);
  const weekStr = ["日", "一", "二", "三", "四", "五", "六"];
  const calendarColor = [
    "#E8A861",
    "#9DC85E",
    "#39B98D",
    "#3970B9",
    "#9E5CCF",
    "#DA4949",
  ];
  const getCalendarInfo = useCallback(async (calendarKey, calendarNumber) => {
    let obj: any = {};
    if (calendarNumber === 7) {
      obj.eventKey = calendarKey;
    } else {
      obj.cardKey = calendarKey;
    }
    let calendarRes: any = await api.task.getCalendarInfo(obj);
    if (calendarRes.msg === "OK") {
      let calendarInfo: any = {
        circleData: [],
        groupKeyArray: [],
        title: calendarRes.result.title,
        startDay: moment(calendarRes.result.taskEndDate)
          .startOf("day")
          .valueOf(),
        endDay: moment(calendarRes.result.taskEndDate).endOf("day").valueOf(),
        remindTime: moment(calendarRes.result.remindTime)
          .startOf("hour")
          .valueOf(),
        type: calendarRes.result.type,
        taskType: calendarRes.result.taskType,
      };
      for (let key in _.cloneDeep(calendarRes.result)) {
        calendarInfo[key] = _.cloneDeep(calendarRes.result)[key];
      }
      if (!calendarInfo.circleData) {
        calendarInfo.circleData = [];
      }
      if (!calendarInfo.repeatCircle) {
        calendarInfo.repeatCircle = 1;
      }
      if (calendarInfo.repeatCircle) {
        setRepeatIndex(2);
      }
      if (!calendarInfo.groupKeyArray) {
        calendarInfo.groupKeyArray = [];
      } else {
      }
      if (!calendarInfo.calendarEditType) {
        calendarInfo.calendarEditType = 1;
      }
      if (isNaN(moment(calendarInfo.remindTime).valueOf())) {
        calendarInfo.remindTime = moment().valueOf() + 120000;
      }
      // newTaskItem.remindTime = moment(newTaskItem.remindTime).valueOf();
      if (calendarInfo.repeatCircle === 3) {
        setDayInput(calendarInfo.circleData[0]);
      }
      if (calendarInfo.repeatCircle === 4 && calendarInfo.circleData[0]) {
        setMonthInput(calendarInfo.circleData[0].month + 1);
        setDayInput(calendarInfo.circleData[0].date);
      }
      if (calendarInfo?.followUserArrayNew?.length > 0) {
        setCalendarFollow(calendarInfo.followUserArrayNew);
        let calendarFollowKey = calendarInfo.followUserArrayNew.map((item) => {
          return item.userId;
        });
        setCalendarFollowKey(calendarFollowKey);
        // getFollowList(newTaskItem);
      }
      setGroupIndex(_.findIndex(groupArray, { _key: calendarInfo.groupKey }));
      getCalendarMember(calendarInfo.groupKey);
      if (calendarInfo.type !== 8) {
        setCalendarType(1);
      } else {
        setCalendarType(0);
      }
      setCalendarIndex(calendarInfo.taskType);
      setCalendarInfo({ ...calendarInfo });
    }
    //eslint-disable-next-line
  }, []);

  useImperativeHandle(ref, () => ({
    saveCalendar: () => {
      saveCalendarInfo();
    },
  }));
  useEffect(() => {
    if (calendarKey) {
      getCalendarInfo(calendarKey, calendarNumber);
    } else {
      setCalendarInfo((prevCalendarInfo) => {
        if (startDay) {
          prevCalendarInfo.startDay = startDay;
          prevCalendarInfo.endDay = endDay;
        }
        prevCalendarInfo.followUserArray = [user._key];
        prevCalendarInfo.followUserArrayNew = [
          {
            userId: user._key,
            avatar: user.profile.avatar,
            nickName: user.profile.nickName,
          },
        ];
        if (targetGroupKey) {
          prevCalendarInfo.groupKeyArray = [targetGroupKey];
        }
        if (remindTime) {
          prevCalendarInfo.remindTime = remindTime;
        }
        if (remindEndTime) {
          prevCalendarInfo.remindEndTime = remindEndTime;
        }
        return { ...prevCalendarInfo };
      });
      if (targetGroupKey) {
        setGroupIndex(_.findIndex(groupArray, { _key: targetGroupKey }));
      }
      if (groupArray) {
        getCalendarMember(groupArray[0]._key, "start");
      }
      // setCalendarFollow([
      //   {
      //     userId: user._key,
      //     avatar: user.profile.avatar,
      //     nickName: user.profile.nickName,
      //   },
      // ]);
    }
    //eslint-disable-next-line
  }, [
    calendarKey,
    calendarNumber,
    getCalendarInfo,
    startDay,
    endDay,
    remindTime,
    remindEndTime,
  ]);
  // useEffect(() => {
  //   if (calendarGroup.length === 0 && headerIndex === 3 && groupInfo) {
  //     let newCalendarGroup: any = [];
  //     newCalendarGroup.push(groupInfo);
  //     setCalendarGroup(newCalendarGroup);
  //     setCalendarInfo((prevCalendarInfo) => {
  //       prevCalendarInfo.groupKeyArray.push(groupInfo._key);
  //       return { ...prevCalendarInfo };
  //     });
  //   }
  // }, [calendarGroup, headerIndex, groupInfo]);

  useEffect(() => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (!newCalendarInfo._key) {
      if (calendarType === 1) {
        if (repeatIndex === 2) {
          newCalendarInfo.endDay = moment(newCalendarInfo.startDay)
            .add(7, "day")
            .endOf("day")
            .valueOf();
          if (newCalendarInfo.circleData.length === 0) {
            newCalendarInfo.circleData = [1, 2, 3];
          }
        }
        //  else if (repeatIndex === 2) {
        //   newCalendarInfo.endDay = moment(newCalendarInfo.startDay)
        //     .add(1, "month")
        //     .endOf("day")
        //     .valueOf();
        // } else if (repeatIndex === 3) {
        //   newCalendarInfo.endDay = moment(newCalendarInfo.startDay)
        //     .add(1, "year")
        //     .endOf("day")
        //     .valueOf();
        // }
      } else if (calendarType === 0) {
        newCalendarInfo.endDay = moment(newCalendarInfo.startDay)
          .endOf("day")
          .valueOf();
      }
    }
    setCalendarInfo(newCalendarInfo);
    //eslint-disable-next-line
  }, [calendarType, repeatIndex]);
  useEffect(() => {
    if (calendarFollow.length > 0) {
      let calendarFollowKey = calendarFollow.map((item) => {
        return item && item.userId;
      });
      setCalendarFollowKey(calendarFollowKey);
    }
  }, [calendarFollow]);
  useEffect(() => {
    if (groupArray.length > 0 && calendarMember.length === 0) {
      getCalendarMember(groupArray[0]._key, "start");
    }
    //eslint-disable-next-line
  }, [groupArray, calendarMember, headerIndex]);
  useEffect(() => {
    if (targetGroupKey) {
      getCalendarMember(targetGroupKey);
    }
    //eslint-disable-next-line
  }, [targetGroupKey]);
  const getCalendarMember = async (groupKey: string, type?: string) => {
    let taskMemberRes: any = await api.member.getMember(groupKey, 4);
    if (taskMemberRes.msg === "OK") {
      setCalendarMember(taskMemberRes.result);
      let newCalendarFollowKey = [...calendarFollowKey];
      let newCalendarFollow = [...calendarFollow];
      if (type && newCalendarFollowKey.length === 0 && !calendarKey) {
        let index = _.findIndex(taskMemberRes.result, { userId: user._key });
        newCalendarFollowKey.push(user._key);
        newCalendarFollow.push(taskMemberRes.result[index]);
        if (targetMemberKey) {
          let index = _.findIndex(taskMemberRes.result, {
            userId: targetMemberKey,
          });
          newCalendarFollowKey.push(targetMemberKey);
          newCalendarFollow.push(taskMemberRes.result[index]);
        }
        setCalendarFollowKey(newCalendarFollowKey);
        setCalendarFollow(newCalendarFollow);
      }
    }
  };
  const changeWeekArr = (num: number) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    let weekIndex = newCalendarInfo.circleData.indexOf(num);
    if (weekIndex === -1) {
      newCalendarInfo.circleData.push(num);
    } else {
      newCalendarInfo.circleData.splice(weekIndex, 1);
    }
    setCalendarInfo(newCalendarInfo);
  };
  const changeTitle = (e: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    newCalendarInfo.title = e.target.value;
    setCalendarInfo(newCalendarInfo);
  };
  const changeDate = (dates) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (dates) {
      newCalendarInfo.startDay = dates[0].startOf("day").valueOf();
      newCalendarInfo.endDay = dates[1].endOf("day").valueOf();
      setCalendarInfo(newCalendarInfo);
    }
  };
  const changeSingleDate = (date) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (date) {
      newCalendarInfo.startDay = date.startOf("day").valueOf();
      newCalendarInfo.endDay = date.endOf("day").valueOf();
      setCalendarInfo(newCalendarInfo);
    }
  };
  const changeHour = (date: any, type: string) => {
    console.log(date);
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (date) {
      if (type === "start") {
        newCalendarInfo.remindTime = date.valueOf();
        newCalendarInfo.remindEndTime = date.valueOf() + 3600000;
      } else if (type === "end") {
        newCalendarInfo.remindEndTime = date.valueOf();
      }
      setCalendarInfo(newCalendarInfo);
    }
  };
  const chooseGroup = (item: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    newCalendarInfo.groupKeyArray[0] = item._key;
    newCalendarInfo.groupKey = item._key;
    setCalendarInfo(newCalendarInfo);
    getCalendarMember(item._key);
  };
  const chooseCalendarFollow = (item: any) => {
    let newCalendarFollow = _.cloneDeep(calendarFollow);
    let followIndex = _.findIndex(newCalendarFollow, { userId: item.userId });
    if (followIndex === -1) {
      newCalendarFollow.push({
        userId: item.userId,
        avatar: item.avatar,
        nickName: item.nickName,
      });
    } else {
      newCalendarFollow.splice(followIndex, 1);
    }
    setCalendarFollow(newCalendarFollow);
  };
  const deleteTask = async (calendar: any) => {
    setDeleteDialogShow(false);
    if (calendar.type === 8) {
      let deleteRes: any = await api.task.deleteTask(
        calendar._key,
        calendar.groupKey
      );
      if (deleteRes.msg === "OK") {
        dispatch(setMessage(true, "删除成功", "success"));
        flashCalendar();
        onClose();
      } else {
        dispatch(setMessage(true, deleteRes.msg, "error"));
      }
    } else {
      saveCalendarInfo("删除循环");
    }
  };
  // const onChange = (e: any) => {
  //   let newCalendarInfo = _.cloneDeep(calendarInfo);
  //   setCalendarEditType(e.target.value);
  //   //现在和未来
  //   newCalendarInfo.calendarEditType = parseInt(e.target.value);
  //   setCalendar(newCalendarInfo);
  //   changeEdit(true);
  // };
  const changeRepeat = (repeatStrIndex) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    setRepeatIndex(2);
    // newCalendarInfo.repeatCircle = repeatStrIndex;
    newCalendarInfo.repeatCircle = 2;
    // newCalendarInfo.type = repeatStrIndex > 0 ? 1 : 2;
    setCalendarInfo(newCalendarInfo);
  };
  const changeDay = (e) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (e.target.value > 31) {
      e.target.value = 31;
    } else if (e.target.value < 1) {
      e.target.value = 1;
    }
    setDayInput(e.target.value);
    if (repeatIndex === 4) {
      if (!newCalendarInfo.circleData[0]) {
        newCalendarInfo.circleData[0] = {};
      }

      newCalendarInfo.circleData[0].date = parseInt(e.target.value);
    } else {
      newCalendarInfo.circleData[0] = parseInt(e.target.value);
    }
    setCalendarInfo(newCalendarInfo);
  };
  const changeMonth = (e) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (e.target.value > 12) {
      e.target.value = 12;
    } else if (e.target.value < 1) {
      e.target.value = 1;
    }
    setMonthInput(e.target.value);
    if (!newCalendarInfo.circleData[0]) {
      newCalendarInfo.circleData[0] = {};
    }
    newCalendarInfo.circleData[0].month = parseInt(e.target.value) - 1;
    setCalendarInfo(newCalendarInfo);
  };
  const saveCalendarInfo = async (type?: string) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (newCalendarInfo) {
      if (!newCalendarInfo.title) {
        dispatch(setMessage(true, "请输入日程标题", "error"));
        return;
      }
      onClose(false);
      if (calendarKey) {
        // if (isEdit) {
        let obj: any = {
          type: newCalendarInfo.type === 8 ? 2 : 1,
          eventOrTaskKey: newCalendarInfo._key,
          remindTime: {
            hour: moment(newCalendarInfo.remindTime).hour(),
            minute: moment(newCalendarInfo.remindTime).minute(),
          },
          remindEndTime: {
            hour: moment(newCalendarInfo.remindEndTime).hour(),
            minute: moment(newCalendarInfo.remindEndTime).minute(),
          },
          followUserArray: calendarFollowKey,
          followUserArrayNew: calendarFollow,
          circleData: newCalendarInfo.circleData,
          repeatCircle: newCalendarInfo.repeatCircle,
          startDay: newCalendarInfo.startDay,
          title: newCalendarInfo.title,
          taskType: newCalendarInfo.taskType,
          startTime: newCalendarInfo.startTime,
          endTime: newCalendarInfo.endTime,
        };
        if (type) {
          obj.endDay = moment(targetDate)
            .subtract(1, "day")
            .endOf("day")
            .valueOf();
        } else {
          obj.endDay = newCalendarInfo.endDay - 1;
        }
        let calendarRes: any = await api.task.editSchedule(obj);
        if (calendarRes.msg === "OK") {
          flashCalendar();
          if (type) {
            dispatch(setMessage(true, "删除循环日程成功", "success"));
          } else {
            dispatch(setMessage(true, "编辑日程成功", "success"));
          }
          onClose(false);
          // getData(calendarDate, calendarGroupKey);
          // setInfoVisible(false);
        } else {
          dispatch(setMessage(true, calendarRes.msg, "error"));
        }
      } else {
        if (
          newCalendarInfo.startDay === newCalendarInfo.endDay &&
          newCalendarInfo.repeatCircle
        ) {
          dispatch(setMessage(true, "循环日程请选择正确的结束时间", "error"));
          return;
        }
        // setLoading(true)
        newCalendarInfo.remindTime = {
          hour: moment(newCalendarInfo.remindTime).hour(),
          minute: moment(newCalendarInfo.remindTime).minute(),
        };
        newCalendarInfo.remindEndTime = {
          hour: moment(newCalendarInfo.remindEndTime).hour(),
          minute: moment(newCalendarInfo.remindEndTime).minute(),
        };
        if (newCalendarInfo.repeatCircle) {
          newCalendarInfo.type = 1;
        }
        if (!newCalendarInfo.startDay) {
          newCalendarInfo.startDay = moment().startOf("day").valueOf();
        }
        if (!newCalendarInfo.endDay) {
          newCalendarInfo.endDay = moment().endOf("day").valueOf();
        }
        if (newCalendarInfo.groupKeyArray.length === 0) {
          newCalendarInfo.groupKeyArray = [groupArray[0]?._key];
        }
        newCalendarInfo.followUserArray = calendarFollowKey;
        newCalendarInfo.followUserArrayNew = calendarFollow;
        newCalendarInfo.taskType = _.random(1, 5);
        console.log(newCalendarInfo);
        let calendarRes: any = await api.task.createSchedule(newCalendarInfo);
        if (calendarRes.msg === "OK") {
          flashCalendar();
          dispatch(setMessage(true, "创建日程成功", "success"));
        } else {
          dispatch(setMessage(true, calendarRes.msg, "error"));
        }
      }
    } else {
      dispatch(setMessage(true, "请输入日程内容", "error"));
    }
  };
  const disabledHours = () => {
    let hours: any = [];
    // let time=new Date(+new Date() +8*3600*1000).toISOString().split("T")[1].split(".")[0];
    for (let i = 0; i < moment().hours(); i++) {
      hours.push(i);
    }
    return calendarType || (repeatIndex !== 0 && !calendarKey) ? [] : hours;
  };
  //限制分钟
  const disabledMinutes = (selectedHour) => {
    let minutes: any = [];
    if (selectedHour === moment().hours()) {
      for (let i = 0; i < moment().minutes(); i++) {
        minutes.push(i);
      }
    }
    return calendarType || (repeatIndex !== 0 && !calendarKey) ? [] : minutes;
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment().startOf("day");
  };
  const dropMenu = (
    <div className="dropDown-box drop-box">
      {groupArray
        ? groupArray.map((groupItem: any, groupIndex: number) => {
            return (
              <div
                onClick={() => {
                  setGroupIndex(groupIndex);
                  chooseGroup(groupItem);
                }}
                key={"group" + groupIndex}
                className="drop-item"
              >
                <Avatar
                  name={groupItem?.groupName}
                  avatar={groupItem?.groupLogo}
                  type={"group"}
                  index={groupIndex}
                  size={22}
                />
                <div style={{ marginLeft: "10px" }}>{groupItem?.groupName}</div>
              </div>
            );
          })
        : null}
    </div>
  );

  return (
    <div className="calendarInfo">
      {calendarKey ? (
        <div className="calendarInfo-item">
          <div className="calendarInfo-item-title">项目</div>
          <div className="calendar-menu">
            <Avatar
              avatar={groupArray && groupArray[groupIndex]?.groupLogo}
              name={groupArray && groupArray[groupIndex]?.groupName}
              type={"group"}
              index={0}
              size={22}
            />
            <div
              className="calendar-name-title"
              style={{ margin: "0px 10px 0px 5px" }}
            >
              {groupArray && groupArray[groupIndex]?.groupName}
            </div>
          </div>
        </div>
      ) : !calendarKey && headerIndex === 5 ? (
        <div className="calendarInfo-item">
          <div className="calendarInfo-item-title">项目</div>
          <Dropdown overlay={dropMenu}>
            <div
              className="calendar-menu"
              // style={{ width: "calc(100% - 65px)" }}
            >
              <Avatar
                avatar={groupArray && groupArray[groupIndex]?.groupLogo}
                name={groupArray && groupArray[groupIndex]?.groupName}
                type={"group"}
                index={0}
                size={22}
              />
              <div
                className="calendar-name-title"
                style={{ margin: "0px 10px 0px 5px" }}
              >
                {groupArray && groupArray[groupIndex]?.groupName}
              </div>
              <DownOutlined />
            </div>
          </Dropdown>
        </div>
      ) : null}
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">标题</div>
        <Input
          value={calendarInfo.title}
          autoComplete="off"
          onChange={changeTitle}
          style={{ width: "calc(100% - 73px)" }}
          placeholder="请输入日程标题"
          autoFocus={true}
        />
      </div>
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">时长</div>
        <div className="calendarInfo-item-notice">
          <TimePicker
            onChange={(data) => {
              changeHour(data, "start");
            }}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            value={moment(calendarInfo.remindTime)}
            format="HH:mm"
            allowClear={false}
            showNow={false}
            style={{ marginRight: "10px" }}
            minuteStep={5}
          />
          <TimePicker
            onChange={(data) => {
              changeHour(data, "end");
            }}
            // onOpenChange={() => {
            //   let indexButton: HTMLElement = document.querySelector(
            //     ".ant-picker-ok button"
            //   );

            //   if (indexButton) {
            //     console.log(indexButton);
            //     indexButton.click();
            //   }
            // }}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            value={moment(calendarInfo.remindEndTime)}
            format="HH:mm"
            allowClear={false}
            showNow={false}
            minuteStep={5}
          />
        </div>
      </div>
      {!calendarInfo._key ? (
        <div className="calendarInfo-item">
          <div className="calendarInfo-item-title">期限</div>
          <div className="calendarInfo-item-notice">
            <Radio.Group
              value={calendarType}
              onChange={(e) => {
                setCalendarType(e.target.value);
                changeRepeat(e.target.value);
              }}
            >
              <Radio value={0}>当日</Radio>
              <Radio value={1}>循环</Radio>
            </Radio.Group>
          </div>
        </div>
      ) : null}

      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">日期</div>
        <RangePicker
          value={[moment(calendarInfo.startDay), moment(calendarInfo.endDay)]}
          onChange={(dates) => {
            changeDate(dates);
          }}
          allowClear={false}
          disabledDate={disabledDate}
        />
      </div>
      {calendarType ? (
        <div className="calendarInfo-repeat-item">
          <div className="calendarInfo-item-title">重复</div>
          <div className="calendarInfo-repeat">
            {/* <Select
              value={repeatIndex}
              style={{ width: 60 }}
              onSelect={(value) => {
                changeRepeat(value);
              }}
            >
              {repeatStr.map((repeatItem: any, repeatStrIndex: number) => {
                return (
                  <React.Fragment key={"repeatStr" + repeatStrIndex}>
                    <Option value={repeatStrIndex + 1}>{repeatItem}</Option>
                  </React.Fragment>
                );
              })}
            </Select> */}
            {/* {repeatIndex === 3 ? (
              <div className="calendarInfo-repeat-input">
                <Input
                  type="number"
                  value={monthInput}
                  onChange={(e: any) => {
                    changeMonth(e);
                  }}
                  style={{ width: "70px", margin: "0px 8px" }}
                  max="12"
                />
                月
              </div>
            ) : null}
            {repeatIndex >= 2 ? (
              <div className="calendarInfo-repeat-input">
                <Input
                  type="number"
                  value={dayInput}
                  onChange={(e: any) => {
                    changeDay(e);
                  }}
                  max="31"
                  style={{ width: "70px", margin: "0px 8px" }}
                />
                日
              </div>
            ) : null} */}
            {repeatIndex === 2 ? (
              <div className="calendarInfo-week">
                {weekStr.map((weekItem: any, weekIndex: number) => {
                  return (
                    <div
                      key={"week" + weekIndex}
                      onClick={() => {
                        changeWeekArr(weekIndex);
                      }}
                      className="calendarInfo-week-item"
                      style={
                        calendarInfo.circleData.indexOf(weekIndex) !== -1
                          ? {
                              backgroundColor: "#1890ff",
                              color: "#fff",
                              border: "1px solid #1890ff",
                            }
                          : {}
                      }
                    >
                      {weekItem}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {calendarKey ? (
        <div className="calendarInfo-item">
          <div className="calendarInfo-item-title">颜色</div>
          <div className="calendarInfo-item-color">
            {calendarColor.map((colorItem: any, colorIndex: number) => {
              return (
                <div
                  style={{
                    backgroundColor: colorItem,
                    width: "25px",
                    height: "25px",
                  }}
                  key={"color" + colorIndex}
                  className="calendarInfo-color-title"
                  onClick={() => {
                    let newCalendarInfo = _.cloneDeep(calendarInfo);
                    setCalendarIndex(colorIndex);
                    newCalendarInfo.taskType = colorIndex;
                    setCalendarInfo(newCalendarInfo);
                  }}
                >
                  {calendarIndex === colorIndex ? (
                    <div className="calendarItem-color-point"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* {calendarType === '编辑' &&
      calendarInfo.type !== 8 &&
      calendarInfo.calendarType === '未来' ? (
        // &&
        // calendarInfo.origionalKey

        <div className="calendarInfo-item" style={{ marginTop: '20px' }}>
          <div className="calendarInfo-item-title">设置</div>
          <div className="calendarInfo-item-color">
            <Radio.Group onChange={onChange} value={calendarEditType}>
              <Radio value={1}>当日</Radio>
              <Radio value={2}>循环</Radio>
            </Radio.Group>
          </div>
        </div>
      ) : null} */}
      {calendarKey ? (
        <Button
          type="link"
          onClick={() => {
            setDeleteDialogShow(true);
          }}
          className="calendarInfo-delete-icon"
        >
          删除日程
        </Button>
      ) : null}

      <div className="calendarInfo-icon">
        <div className="calendarInfo-icon-title">参会者：</div>
        <div className="calendarInfo-icon-container">
          {calendarFollow.map((iconItem: any, iconIndex: number) => {
            return (
              <div className="calendarInfo-group" key={"icon" + iconIndex}>
                {iconItem.userId !== calendarInfo.creatorKey &&
                iconItem.userId !== user._key ? (
                  <div
                    className="calendarInfo-group-delete"
                    onClick={() => {
                      setCalendarFollow((prevCalendarFollow) => {
                        prevCalendarFollow.splice(iconIndex, 1);
                        return [...prevCalendarFollow];
                      });
                    }}
                  >
                    <DeleteOutlined style={{ color: "#fff" }} />
                  </div>
                ) : null}
                <div className="calendarInfo-group-item">
                  <Avatar
                    avatar={iconItem?.avatar}
                    name={iconItem?.nickName}
                    type={"person"}
                    index={0}
                  />
                </div>
                <Tooltip title={iconItem?.nickName}>
                  <div className="calendarInfo-group-title">
                    {iconItem?.nickName}
                  </div>
                </Tooltip>
              </div>
            );
          })}
          {groupArray[groupIndex]?._key !== mainGroupKey ? (
            <div
              className="calendarInfo-group"
              onClick={() => {
                setMemberVisible(true);
              }}
            >
              <div className="calendarInfo-group-item calendarInfo-group-add">
                <img src={plusPng} alt="" />
              </div>
              <div className="calendarInfo-group-title">新增</div>
            </div>
          ) : null}
        </div>
      </div>

      <Drawer
        visible={memberVisible}
        onClose={() => {
          setMemberVisible(false);
        }}
        width={400}
        title={"参会者"}
        bodyStyle={{
          padding: "0px",
        }}
      >
        <ContactMember
          memberList={calendarMember}
          chooseMember={chooseCalendarFollow}
          calendarFollowKey={calendarFollowKey}
        />
      </Drawer>

      {/* {calendarMember.map((item, index) => {
            return (
              <div
                key={"member" + index}
                onClick={() => {
                  if (item.userId !== user._key) {
                    chooseCalendarFollow(item);
                  }
                }}
                className="drop-item"
              >
                <div className="drop-left">
                  <Avatar
                    avatar={item.avatar}
                    name={item.nickName}
                    type={"person"}
                    index={index}
                    size={25}
                  />
                  <div
                    style={{ marginLeft: "10px", width: "calc(100% - 40px)" }}
                    className="toLong"
                  >
                    {item.nickName}
                  </div>
                </div>
                <div className="drop-right">
                  {calendarFollowKey &&
                  item.userId &&
                  calendarFollowKey.indexOf(item.userId) !== -1 ? (
                    <CheckOutlined />
                  ) : null}
                </div>
              </div>
            );
          })} */}
      <Modal
        visible={deleteDialogShow}
        onCancel={() => {
          setDeleteDialogShow(false);
        }}
        onOk={() => {
          deleteTask(calendarInfo);
        }}
        title={"删除日程"}
      >
        是否删除该日程
      </Modal>
    </div>
  );
});
CalendarInfo.defaultProps = {};
export default CalendarInfo;
