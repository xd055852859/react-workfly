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
import { Input, Button, DatePicker, TimePicker, Modal, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { setMessage } from "../../redux/actions/commonActions";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";

import plusPng from "../../assets/img/contact-plus.png";

// import deleteIconSvg from '../../assets/svg/deleteIcon.svg';
import Dialog from "../../components/common/dialog";
import Tooltip from "../../components/common/tooltip";
import TaskMember from "../../components/task/taskMember";
import Avatar from "../../components/common/avatar";

const { Option } = Select;
const { RangePicker } = DatePicker;
interface CalendarInfoProps {
  calendarKey?: any;
  calendarNumber: number;
  onClose: any;
  targetGroupKey: string;
  flashCalendar: any;
  startDay?: number;
  endDay?: number;
}

const CalendarInfo = forwardRef((props: CalendarInfoProps, ref) => {
  const {
    calendarKey,
    calendarNumber,
    onClose,
    targetGroupKey,
    flashCalendar,
    startDay,
    endDay,
  } = props;
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const dispatch = useDispatch();
  const [calendarInfo, setCalendarInfo] = useState<any>({
    circleData: [],
    groupKeyArray: [],
    title: "",
    startDay: moment().startOf("day").valueOf(),
    endDay: moment().endOf("day").valueOf(),
    remindTime: moment().valueOf() + 120000,
    type: 2,
    taskType: 0,
  });

  const [calendarIndex, setCalendarIndex] = useState(0);
  const [repeatIndex, setRepeatIndex] = useState(0);
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [groupVisible, setGroupVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [calendarGroup, setCalendarGroup] = useState<any>([]);
  const [calendarFollow, setCalendarFollow] = useState<any>([]);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [calendarType, setCalendarType] = useState("今日");
  const weekStr = ["日", "一", "二", "三", "四", "五", "六"];
  const repeatStr = ["无", "", "周", "月", "年"];
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
        calendarInfo.repeatCircle = 0;
      }
      if (calendarInfo.repeatCircle) {
        setRepeatIndex(calendarInfo.repeatCircle);
      }
      if (!calendarInfo.groupKeyArray) {
        calendarInfo.groupKeyArray = [];
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
        // getFollowList(newTaskItem);
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
        prevCalendarInfo.startDay = startDay;
        prevCalendarInfo.endDay = endDay;
        return { ...prevCalendarInfo };
      });
    }
  }, [calendarKey, calendarNumber, getCalendarInfo, startDay, endDay]);
  useEffect(() => {
    if (calendarInfo) {
      setCalendarType(
        calendarInfo.endDay > moment().endOf("day").valueOf()
          ? "未来"
          : calendarInfo.endDay < moment().endOf("day").valueOf()
          ? "过去"
          : "今日"
      );
    }
  }, [calendarInfo]);
  useEffect(() => {
    if (calendarGroup.length === 0 && headerIndex === 3 && groupInfo) {
      let newCalendarGroup: any = [];
      newCalendarGroup.push(groupInfo);
      setCalendarGroup(newCalendarGroup);
      setCalendarInfo((prevCalendarInfo) => {
        prevCalendarInfo.groupKeyArray.push(groupInfo._key);
        return { ...prevCalendarInfo };
      });
    }
  }, [calendarGroup, headerIndex, groupInfo]);

  // const getFollowList = async (calendar: any) => {
  //   let obj: any =
  //     calendar.type === 8
  //       ? { cardKey: calendar._key }
  //       : { eventKey: calendar._key };
  //   let followRes: any = await api.task.getCalendarInfo(obj);
  //   if (followRes.msg === "OK") {
  //     setCalendarFollow(followRes.result.followUserArray);
  //   } else {
  //     dispatch(setMessage(true, followRes.msg, "error"));
  //   }
  // };
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
      newCalendarInfo.startDay = dates[0].valueOf();
      newCalendarInfo.endDay = dates[1].valueOf();
      setCalendarInfo(newCalendarInfo);
    }
  };
  const changeHour = (date: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (date) {
      newCalendarInfo.remindTime = date.valueOf();
      setCalendarInfo(newCalendarInfo);
    }
  };
  const chooseCalendarGroup = (item: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    let newCalendarGroup = _.cloneDeep(calendarGroup);
    let groupIndex = _.findIndex(newCalendarGroup, { _key: item._key });
    if (groupIndex === -1) {
      newCalendarGroup.push(item);
      newCalendarInfo.groupKeyArray.push(item._key);
    } else {
      newCalendarGroup.splice(groupIndex, 1);
      newCalendarInfo.groupKeyArray.splice(groupIndex, 1);
    }
    setCalendarGroup(newCalendarGroup);
    setCalendarInfo(newCalendarInfo);
  };
  const chooseCalendarFollow = (item: any) => {
    setCalendarFollow((prevCalendarFollow) => {
      let followIndex = _.findIndex(prevCalendarFollow, { _key: item._key });
      if (followIndex === -1) {
        prevCalendarFollow.push(item);
      } else {
        prevCalendarFollow.splice(followIndex, 1);
      }
      return [...prevCalendarFollow];
    });
  };
  const deleteTask = async (calendar: any) => {
    setDeleteDialogShow(false);
    let deleteRes: any = null;
    if (calendar.type === 8) {
      deleteRes = await api.task.deleteTask(calendar._key, calendar.groupKey);
    } else {
      deleteRes = await api.task.deleteEvent(calendar._key);
    }
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除成功", "success"));
      flashCalendar();
      onClose();
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
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
    setRepeatIndex(repeatStrIndex);
    newCalendarInfo.repeatCircle = repeatStrIndex;
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
  const saveCalendarInfo = async () => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (newCalendarInfo) {
      if (!newCalendarInfo.title) {
        dispatch(setMessage(true, "请输入日程标题", "error"));
        return;
      }
      if (newCalendarInfo.groupKeyArray) {
        if (newCalendarInfo.groupKeyArray.indexOf(targetGroupKey) === -1) {
          newCalendarInfo.groupKeyArray.push(targetGroupKey);
        }
      }
      if (calendarKey) {
        // if (isEdit) {
        const calendarFollowKey = calendarFollow.map((item) => {
          return item.userId;
        });
        let obj: any = {
          type: newCalendarInfo.type === 8 ? 2 : 1,
          eventOrTaskKey: newCalendarInfo._key,
          remindTime: {
            hour: moment(newCalendarInfo.remindTime).hour(),
            minute: moment(newCalendarInfo.remindTime).minute(),
          },
          followUserArray: calendarFollowKey,
          followUserArrayNew: calendarFollow,
          circleData: newCalendarInfo.circleData,
          repeatCircle: newCalendarInfo.repeatCircle,
          startDay: newCalendarInfo.startDay,
          endDay: newCalendarInfo.endDay - 1,
          title: newCalendarInfo.title,
          taskType: newCalendarInfo.taskType,
        };
        let calendarRes: any = await api.task.editSchedule(obj);
        if (calendarRes.msg === "OK") {
          flashCalendar();
          dispatch(setMessage(true, "编辑日程成功", "success"));
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
        if (newCalendarInfo.repeatCircle) {
          newCalendarInfo.type = 1;
        }
        console.log(newCalendarInfo);
        let calendarRes: any = await api.task.createSchedule(newCalendarInfo);
        if (calendarRes.msg === "OK") {
          flashCalendar();
          dispatch(setMessage(true, "创建日程成功", "success"));
          onClose(false);
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
    return calendarType === "未来" || (repeatIndex !== 0 && !calendarKey)
      ? []
      : hours;
  };
  //限制分钟
  const disabledMinutes = (selectedHour) => {
    let minutes: any = [];
    if (selectedHour === moment().hours()) {
      for (let i = 0; i < moment().minutes(); i++) {
        minutes.push(i);
      }
    }
    return calendarType === "未来" || (repeatIndex !== 0 && !calendarKey)
      ? []
      : minutes;
  };

  return (
    <div className="calendarInfo">
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">日程标题</div>
        <Input
          value={calendarInfo.title}
          autoComplete="off"
          onChange={changeTitle}
          style={{ width: "calc(100% - 73px)" }}
          placeholder="请输入日程标题"
        />
      </div>
      {calendarType === "未来" || !calendarKey ? (
        <React.Fragment>
          <div className="calendarInfo-item">
            <div className="calendarInfo-item-title">日程时间</div>
            <RangePicker
              value={[
                moment(calendarInfo.startDay),
                moment(calendarInfo.endDay),
              ]}
              onChange={(dates) => {
                changeDate(dates);
              }}
              allowClear={false}
            />
          </div>
          <div className="calendarInfo-repeat-item">
            <div className="calendarInfo-item-title">重复</div>
            <div className="calendarInfo-repeat">
              <Select
                value={repeatIndex}
                style={{ width: 60 }}
                onSelect={(value) => {
                  changeRepeat(value);
                }}
              >
                {repeatStr.map((repeatItem: any, repeatStrIndex: number) => {
                  return (
                    <React.Fragment key={"repeatStr" + repeatStrIndex}>
                      {repeatItem ? (
                        <Option value={repeatStrIndex}>{repeatItem}</Option>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </Select>
              {repeatIndex === 4 ? (
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
              {repeatIndex >= 3 ? (
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
              ) : null}
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
                            ? { backgroundColor: "#1890ff", color: "#fff" }
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
        </React.Fragment>
      ) : null}
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">提醒</div>
        <div className="calendarInfo-item-notice">
          <TimePicker
            onChange={(data) => {
              changeHour(data);
            }}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            value={moment(calendarInfo.remindTime)}
            format="HH:mm"
            allowClear={false}
            showNow={false}
            disabled={calendarType === "过去"}
          />
        </div>
      </div>
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
      {calendarKey ? (
        <div className="calendarInfo-icon">
          <div className="calendarInfo-icon-title">关注者：</div>
          <div className="calendarInfo-icon-container">
            {calendarFollow.map((iconItem: any, iconIndex: number) => {
              return (
                <div className="calendarInfo-group" key={"icon" + iconIndex}>
                  {calendarType !== "过去" ? (
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
                  <Tooltip title={iconItem.nickName}>
                    <div className="calendarInfo-group-title">
                      {iconItem.nickName}
                    </div>
                  </Tooltip>
                </div>
              );
            })}
            {calendarType !== "过去" ? (
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
      ) : // </div>
      null}
      {!calendarKey ? (
        <div className="calendarInfo-icon">
          <div className="calendarInfo-icon-title">复制到日程表：</div>
          <div className="calendarInfo-icon-container">
            {calendarGroup.map((iconItem: any, iconIndex: number) => {
              return (
                <Tooltip title={iconItem.groupName} key={"icon" + iconIndex}>
                  <div className="calendarInfo-group">
                    <div
                      className="calendarInfo-group-delete"
                      onClick={() => {
                        let newCalendarInfo = _.cloneDeep(calendarInfo);
                        let newCalendarGroup = _.cloneDeep(calendarGroup);
                        newCalendarGroup.splice(iconIndex, 1);
                        newCalendarInfo.groupKeyArray.splice(iconIndex, 1);
                        setCalendarGroup(newCalendarGroup);
                        setCalendarInfo(newCalendarInfo);
                      }}
                    >
                      <DeleteOutlined style={{ color: "#fff" }} />
                    </div>
                    <div
                      className="calendarInfo-group-item"
                      style={{ borderRadius: "5px" }}
                    >
                      <Avatar
                        avatar={iconItem?.groupLogo}
                        name={iconItem?.groupName}
                        type={"group"}
                        index={0}
                      />
                    </div>
                  </div>
                </Tooltip>
              );
            })}

            <div
              className="calendarInfo-group"
              onClick={() => {
                setGroupVisible(true);
              }}
            >
              <div className="calendarInfo-group-item calendarInfo-group-add">
                <img src={plusPng} alt="" />
              </div>
              <div className="calendarInfo-group-title">新增</div>
            </div>
          </div>
        </div>
      ) : null}
      <Dialog
        visible={groupVisible}
        dialogStyle={{
          position: "fixed",
          width: "245px",
          maxHeight: "90%",
          top: "5%",
          left: "calc(50% + 263px)",
          color: "#333",
          overflow: "auto",
        }}
        onClose={() => {
          setGroupVisible(false);
        }}
        showMask={false}
        footer={false}
      >
        <div className="calendarInfo-group-box">
          {groupArray
            ? groupArray.map((groupItem: any, groupIndex: number) => {
                return (
                  <div
                    className="calendarInfo-group-box-container"
                    key={"group" + groupIndex}
                    onClick={() => {
                      chooseCalendarGroup(groupItem);
                    }}
                    style={
                      calendarGroup.indexOf(groupItem._key) !== -1
                        ? { backgroundColor: "#efefef" }
                        : {}
                    }
                  >
                    <div
                      className="calendarInfo-group-box-item"
                      style={{ borderRadius: "5px" }}
                    >
                      <Avatar
                        avatar={groupItem?.groupLogo}
                        name={groupItem?.groupName}
                        type={"group"}
                        index={0}
                      />
                    </div>
                    <Tooltip title={groupItem.groupName}>
                      <div className="calendarInfo-group-title">
                        {groupItem.groupName}
                      </div>
                    </Tooltip>
                  </div>
                );
              })
            : null}
        </div>
      </Dialog>
      <Dialog
        visible={memberVisible}
        onClose={() => {
          setMemberVisible(false);
        }}
        dialogStyle={{
          position: "fixed",
          width: "245px",
          maxHeight: "90%",
          top: "5%",
          left: "calc(50% + 263px)",
          color: "#333",
          overflow: "auto",
        }}
        showMask={false}
        footer={false}
      >
        <TaskMember
          targetGroupKey={calendarInfo?.groupKey}
          onClose={() => {
            setMemberVisible(false);
          }}
          chooseFollow={chooseCalendarFollow}
          type="follow"
        />
      </Dialog>
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
