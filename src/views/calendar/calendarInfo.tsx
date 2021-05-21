import React, { useState, useEffect } from "react";
import "./calendarInfo.css";
import "./calendarItem.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, DatePicker, TimePicker, Modal, Select } from "antd";
import { setMessage } from "../../redux/actions/commonActions";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";

import plusPng from "../../assets/img/contact-plus.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import defaultPersonPng from "../../assets/img/defaultPerson.png";

// import deleteIconSvg from '../../assets/svg/deleteIcon.svg';
import Dialog from "../../components/common/dialog";
import Tooltip from "../../components/common/tooltip";
import TaskMember from "../../components/task/taskMember";
import { useMount } from "../../hook/common";

const { Option } = Select;
const { RangePicker } = DatePicker;
interface CalendarInfoProps {
  taskItem?: any;
  setCalendar: any;
  calendarColor: any;
  calendarType: string;
  onClose: any;
  targetGroupKey: string;
  setFollowList?: any;
  changeEdit: Function;
  changeFollowEdit: Function;
}

const CalendarInfo: React.FC<CalendarInfoProps> = (props) => {
  const {
    taskItem,
    setCalendar,
    calendarColor,
    calendarType,
    onClose,
    targetGroupKey,
    setFollowList,
    changeEdit,
    changeFollowEdit,
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
    remindTime: moment(),
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

  const weekStr = ["日", "一", "二", "三", "四", "五", "六"];
  const repeatStr = ["无", "日", "周", "月", "年"];

  useMount(() => {
    if (taskItem) {
      let newTaskItem: any = {
        circleData: [],
        groupKeyArray: [],
        title: "",
        startDay: moment().startOf("day").valueOf(),
        endDay: moment().endOf("day").valueOf(),
        remindTime: moment().valueOf(),
        type: 2,
        taskType: 0,
      };
      for (let key in _.cloneDeep(taskItem)) {
        newTaskItem[key] = _.cloneDeep(taskItem)[key];
      }
      if (!newTaskItem.circleData) {
        newTaskItem.circleData = [];
      }
      if (newTaskItem.repeatCircle) {
        setRepeatIndex(newTaskItem.repeatCircle);
      }
      if (!newTaskItem.groupKeyArray) {
        newTaskItem.groupKeyArray = [];
      }
      if (!newTaskItem.calendarEditType) {
        newTaskItem.calendarEditType = 1;
      }
      if (isNaN(moment(newTaskItem.remindTime).valueOf())) {
        newTaskItem.remindTime = moment().valueOf();
      }
      // newTaskItem.remindTime = moment(newTaskItem.remindTime).valueOf();
      if (calendarType !== "新建") {
        if (newTaskItem.repeatCircle === 3) {
          setDayInput(newTaskItem.circleData[0]);
        }
        if (newTaskItem.repeatCircle === 4 && newTaskItem.circleData[0]) {
          setMonthInput(newTaskItem.circleData[0].month + 1);
          setDayInput(newTaskItem.circleData[0].date);
        }
        if (calendarFollow.length > 0) {
          getFollowList(newTaskItem);
        }
      }
      console.log("newTaskItem", newTaskItem);
      setCalendarInfo({ ...newTaskItem });
    }
  });

  useEffect(() => {
    if (calendarGroup.length === 0 && headerIndex === 3 && groupInfo) { 
      let newCalendarGroup: any = [];
      newCalendarGroup.push(groupInfo); 
      setCalendarGroup(newCalendarGroup);
      setCalendarInfo((prevCalendarInfo)=>{
        prevCalendarInfo.groupKeyArray.push(groupInfo._key);
        return {...prevCalendarInfo}
      })
    }
  }, [calendarGroup, headerIndex, groupInfo]);

  const getFollowList = async (calendar: any) => {
    let obj: any =
      calendar.type === 8
        ? { cardKey: calendar._key }
        : { eventKey: calendar._key };
    let followRes: any = await api.task.getCalendarInfo(obj);
    if (followRes.msg === "OK") {
      setCalendarFollow(followRes.result.followUserArray);
    } else {
      dispatch(setMessage(true, followRes.msg, "error"));
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
    setCalendar(newCalendarInfo);
    changeEdit(true);
  };
  const changeTitle = (e: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    newCalendarInfo.title = e.target.value;
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
    changeEdit(true);
  };
  const changeDate = (dates) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (dates) {
      newCalendarInfo.startDay = dates[0].valueOf();

      newCalendarInfo.endDay = dates[1].valueOf();

      setCalendarInfo(newCalendarInfo);
      setCalendar(newCalendarInfo);
      changeEdit(true);
    }
  };
  const changeHour = (date: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (date) {
      newCalendarInfo.remindTime = date.valueOf();
      setCalendarInfo(newCalendarInfo);
      setCalendar(newCalendarInfo);
      changeEdit(true);
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
    setCalendar(newCalendarInfo);
    changeEdit(true);
  };
  const chooseCalendarFollow = (item: any) => {
    let newCalendarFollow = _.cloneDeep(calendarFollow);
    let newFollowList = [];
    let followIndex = _.findIndex(newCalendarFollow, { _key: item._key });
    if (followIndex === -1) {
      newCalendarFollow.push(item);
    } else {
      newCalendarFollow.splice(followIndex, 1);
    }
    setCalendarFollow(newCalendarFollow);
    newFollowList = newCalendarFollow.map((item: any, index: number) => {
      return item.userId ? item.userId : item._key;
    });
    setFollowList(newFollowList);
    changeFollowEdit(true);
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
      onClose("delete");
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
    newCalendarInfo.type = repeatStrIndex > 0 ? 1 : 2;
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
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
    setCalendar(newCalendarInfo);
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
    setCalendar(newCalendarInfo);
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
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">日程时间</div>
        <RangePicker
          value={[moment(calendarInfo.startDay), moment(calendarInfo.endDay)]}
          onChange={(dates) => {
            changeDate(dates);
          }}
        />
      </div>

      {calendarInfo.type !== 8 ? (
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
                  <Option
                    value={repeatStrIndex}
                    key={"repeatStr" + repeatStrIndex}
                  >
                    {repeatItem}
                  </Option>
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
      ) : null}
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">提醒</div>
        <div className="calendarInfo-item-notice">
          <TimePicker
            onChange={(data) => {
              changeHour(data);
            }}
            value={moment(calendarInfo.remindTime)}
            format="HH:mm"
            allowClear={false}
            showNow={false}
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
                  setCalendar(newCalendarInfo);
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
      {calendarType === "编辑" ? (
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
      {calendarType === "编辑" ? (
        <div className="calendarInfo-icon">
          <div className="calendarInfo-icon-title">关注者：</div>
          <div className="calendarInfo-icon-container">
            {calendarFollow.map((iconItem: any, iconIndex: number) => {
              return (
                <div className="calendarInfo-group" key={"icon" + iconIndex}>
                  <div className="calendarInfo-group-item">
                    <img
                      src={
                        iconItem.avatar
                          ? iconItem.avatar +
                            "?imageMogr2/auto-orient/thumbnail/80x"
                          : defaultPersonPng
                      }
                      alt=""
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = defaultPersonPng;
                      }}
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
          </div>
        </div>
      ) : // </div>
      null}
      {calendarType === "新建" ? (
        <div className="calendarInfo-icon">
          <div className="calendarInfo-icon-title">复制到日程表：</div>
          <div className="calendarInfo-icon-container">
            {calendarGroup.map((iconItem: any, iconIndex: number) => {
              return (
                <div className="calendarInfo-group" key={"icon" + iconIndex}>
                  <div
                    className="calendarInfo-group-item"
                    style={{ borderRadius: "5px" }}
                  >
                    <img
                      src={
                        iconItem.groupLogo
                          ? iconItem.groupLogo
                          : defaultGroupPng
                      }
                      alt=""
                    />
                  </div>
                  <Tooltip title={iconItem.groupName}>
                    <div className="calendarInfo-group-title">
                      {iconItem.groupName}
                    </div>
                  </Tooltip>
                </div>
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
          left: "calc(50% + 205px)",
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
                      <img
                        src={
                          groupItem.groupLogo
                            ? groupItem.groupLogo
                            : defaultGroupPng
                        }
                        alt=""
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
          left: "calc(50% + 205px)",
          color: "#333",
          overflow: "auto",
        }}
        showMask={false}
        footer={false}
      >
        <TaskMember
          targetGroupKey={targetGroupKey}
          onClose={() => {
            setMemberVisible(false);
          }}
          chooseFollow={chooseCalendarFollow}
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
};
CalendarInfo.defaultProps = {};
export default CalendarInfo;
