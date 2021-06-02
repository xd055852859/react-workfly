import React, { useState, useEffect, useCallback } from "react";
import "./timeSet.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import moment from "moment";
import "moment/locale/zh-cn";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { Button } from "antd";

import { editTask, setTaskInfo } from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";

import timeSet1Svg from "../../assets/svg/timeSet1.svg";
import timeSet2Svg from "../../assets/svg/timeSet2.svg";
import timeSet3Svg from "../../assets/svg/timeSet3.svg";
import timeSet4Svg from "../../assets/svg/timeSet4.svg";
import timeSet5Svg from "../../assets/svg/timeSet5.svg";
import timeSet6Svg from "../../assets/svg/timeSet6.svg";
import clockSvg from "../../assets/svg/clock.svg";

import DropMenu from "../common/dropMenu";
moment.locale("zh-cn");

interface timeSetProp {
  timeSetClick?: any;
  dayNumber?: number;
  timeNumber?: number | null;
  endDate?: number;
  percentClick?: any;
  timestate?: string;
  viewStyle?: string;
  type?: string;
  targetNode?: any;
}

const TimeSet: React.FC<timeSetProp> = (prop) => {
  const {
    dayNumber,
    timeSetClick,
    timeNumber,
    endDate,
    percentClick,
    timestate,
    viewStyle,
    type,
    targetNode,
  } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [timeDate, setTimeDate] = useState<any>([]);
  const [timeWeek, setTimeWeek] = useState<any>([]);
  const [timeMonth, setTimeMonth] = useState<any>([]);
  const [freeTimeVisible, setFreeTimeVisible] = useState(false);
  const [freeTimeInput, setFreeTimeInput] = useState("");
  const [timeDateArray, setTimeDateArray] = useState<any>([]);
  const [timeDateType, setTimeDateType] = useState(0);
  const [dateIndex, setdateIndex] = useState(0);
  const [newEndDate, setNewEndDate] = useState<any>(0);
  const [newDayNumber, setNewDayNumber] = useState<any>(null);
  const [newTimeNumber, setNewTimeNumber] = useState<any>(null);
  const timeArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
  ];
  const changeDateIndex = useCallback(
    (timeDateType: number, newDayNumber: number) => {
      let dateIndex = 0;
      if (timeDateType) {
        dateIndex = moment()
          .add(newDayNumber - 1, "day")
          .endOf("day")
          .date();
      } else {
        if (newDayNumber >= 0) {
          dateIndex = newDayNumber;
        } else {
          dateIndex = 0;
        }
      }
      setdateIndex(dateIndex);
    },
    []
  );
  useEffect(() => {
    changeDateIndex(timeDateType, newDayNumber);
  }, [timeDateType, newDayNumber, changeDateIndex]);
  useEffect(() => {
    if (timeDate.length === 0) {
      mouthDate();
    }
  }, [timeDate]);

  useEffect(() => {
    setNewEndDate(endDate);
    setNewDayNumber(dayNumber);
    setNewTimeNumber(timeNumber);
  }, [targetNode, endDate, dayNumber, timeNumber]);

  useEffect(() => {
    if (taskInfo && type) {
      let [time, newTaskInfo]: any = [0, { ...taskInfo }];
      if (newTaskInfo.taskEndDate) {
        time = moment(newTaskInfo.taskEndDate)
          .endOf("day")
          .diff(moment().endOf("day"), "days");
        setNewEndDate(newTaskInfo.taskEndDate);
        setNewDayNumber(time + 1);
        setNewTimeNumber(newTaskInfo.hour);
      }
    }
  }, [taskInfo, type]);
  const mouthDate = () => {
    let timeDate: any = [];
    let timeWeek: any = [];
    let timeMonth: any = [];

    // const weekString = [
    //   "星期一",
    //   "星期二",
    //   "星期三",
    //   "星期四",
    //   "星期五",
    //   "星期六",
    //   "星期日",
    // ];
    for (let i = 0; i < 28; i += 1) {
      let targetDate = _.cloneDeep(moment().add(i, "days"));
      timeMonth.push(targetDate.date());
      // weeks[i] = weekString[
      //   this.$moment("2020-03-05")
      //     .add(i, "days")
      //     .weekday()
      // ];

      timeWeek.push(targetDate.weekday());
      timeDate.push(i + 1);
    }

    setTimeDate(timeDate);
    setTimeWeek(timeWeek);
    setTimeMonth(timeMonth);
    setTimeDateArray(timeDate);
  };

  const changeTimeDateType = (timeDateType: number) => {
    if (timeDateType) {
      setTimeDateArray(timeMonth);
    } else {
      setTimeDateArray(timeDate);
    }
    changeDateIndex(timeDateType, newDayNumber);
    setTimeDateType(timeDateType);
  };
  const changeTime = (type: string, value?: any) => {
    let newTaskItem: any = {};
    let newTaskInfo: any = _.cloneDeep(taskInfo);
    if (type === "finishPercent") {
      if (
        moment(newTaskInfo.taskEndDate)
          .endOf("day")
          .diff(moment().endOf("day"), "days") > -7 &&
        newTaskInfo.creatorKey !== user._key
      ) {
        dispatch(setMessage(true, "非创建者7天内不能归档", "error"));
        return;
      }
      newTaskItem.finishPercent = value;
      newTaskInfo.finishPercent = value;
      if (newTaskItem.finishPercent === 1) {
        // newTaskDetail.todayTaskTime = moment().valueOf();
        newTaskItem.taskEndDate = moment().valueOf();
        newTaskInfo.taskEndDate = moment().valueOf();
        setNewEndDate(newTaskItem.taskEndDate);
      }
    }
    if (type === "hour") {
      newTaskItem.hour = value;
      newTaskInfo.hour = value;
      setNewTimeNumber(newTaskItem.hour);
    } else if (type === "day") {
      newTaskItem.day = value;
      newTaskInfo.day = value;
      newTaskItem.taskEndDate = moment()
        .add(value - 1, "day")
        .endOf("day")
        .valueOf();
      setNewEndDate(newTaskItem.taskEndDate);
      setNewDayNumber(value);
      newTaskInfo.taskEndDate = _.cloneDeep(newTaskItem.taskEndDate);
    } else if (type === "infinite") {
      newTaskItem.taskEndDate = 99999999999999;
      newTaskInfo.taskEndDate = _.cloneDeep(newTaskItem.taskEndDate);
    }
    dispatch(
      editTask(
        {
          key: newTaskInfo._key,
          ...newTaskItem,
        },
        headerIndex
      )
    );
    dispatch(setTaskInfo(newTaskInfo));
  };
  return (
    <React.Fragment>
      {!viewStyle && theme.hourVisible ? (
        <div className="timeSet-title">
          预计工时 <span>{newTimeNumber + "小时"}</span>
        </div>
      ) : null}
      <div
        className="timeSet"
        style={
          theme.hourVisible
            ? viewStyle !== "horizontal"
              ? {
                  width: "100%",
                  height: "55px",
                  padding: "5px 10px",
                  display: "flex",
                }
              : { height: "42px" }
            : { height: "25px", marginTop: "15px" }
        }
      >
        {!timestate ? (
          <div
            className="timeSet-time-logo"
            style={
              theme.hourVisible
                ? viewStyle !== "horizontal"
                  ? { width: "45px", height: "40px" }
                  : {
                      width: "45px",
                      height: "42px",
                    }
                : {
                    width: "100px",
                    height: "25px",
                    marginLeft: "17px",
                  }
            }
          >
            <img
              src={timeSet1Svg}
              onClick={() => {
                if (
                  viewStyle !== "horizontal" ||
                  (viewStyle === "horizontal" &&
                    targetNode &&
                    (targetNode.type === 1 || targetNode.type === 6))
                ) {
                  if (type) {
                    changeTime("finishPercent", 10);
                  } else {
                    percentClick(10, viewStyle);
                  }
                }
              }}
              alt=""
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />

            <img
              src={timeSet2Svg}
              onClick={() => {
                if (
                  viewStyle !== "horizontal" ||
                  (viewStyle === "horizontal" &&
                    targetNode &&
                    (targetNode.type === 1 || targetNode.type === 6))
                ) {
                  if (type) {
                    changeTime("finishPercent", 0);
                  } else {
                    percentClick(0, viewStyle);
                  }
                }
              }}
              alt=""
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />
            <img
              src={timeSet3Svg}
              onClick={() => {
                if (
                  viewStyle !== "horizontal" ||
                  (viewStyle === "horizontal" &&
                    targetNode &&
                    (targetNode.type === 1 || targetNode.type === 6))
                ) {
                  if (type) {
                    changeTime("finishPercent", 1);
                  } else {
                    percentClick(1, viewStyle);
                  }
                }
              }}
              alt=""
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />
            <img
              src={timeSet4Svg}
              onClick={() => {
                if (
                  viewStyle !== "horizontal" ||
                  (viewStyle === "horizontal" &&
                    targetNode &&
                    (targetNode.type === 1 || targetNode.type === 6))
                ) {
                  if (type) {
                    changeTime("finishPercent", 2);
                  } else {
                    percentClick(2, viewStyle);
                  }
                }
              }}
              style={{
                width: "19px",
                height: "19px",
                // marginRight: !viewStyle ? '' : '5px',
              }}
              alt=""
            />
          </div>
        ) : null}
        {theme.hourVisible ? (
          <div
            className="timeSet-time-info"
            style={
              // !viewStyle
              // ?
              { width: "200px", height: "41px" }
              // : { width: '230px', height: '40px' }
            }
          >
            <img
              src={clockSvg}
              style={{
                width: "20px",
                height: "20px",
                marginRight: "2px",
                // marginBottom: '5px',
                cursor: "pointer",
              }}
              onClick={() => {
                if (
                  viewStyle !== "horizontal" ||
                  (viewStyle === "horizontal" &&
                    targetNode &&
                    (targetNode.type === 1 || targetNode.type === 6))
                ) {
                  setFreeTimeVisible(true);
                }
                // changeTimeDateType(1);
              }}
              alt=""
            />
            <DropMenu
              visible={freeTimeVisible}
              dropStyle={{
                width: "192px",
                height: "57px",
                top: "20px",
                left: "0px",
                color: "#333",
                padding: "10px 6px",
                boxSizing: "border-box",
                zIndex: "30",
              }}
              onClose={() => {
                setFreeTimeVisible(false);
              }}
            >
              <input
                type="text"
                value={freeTimeInput}
                placeholder="请输入自定义时间"
                onChange={(e) => {
                  setFreeTimeInput(e.target.value);
                }}
                className="timeSet-freeTime"
              />
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  if (isNaN(parseFloat(freeTimeInput))) {
                    dispatch(setMessage(true, "请输入数字", "error"));
                    return;
                  }
                  if (type) {
                    changeTime("hour", parseFloat(freeTimeInput));
                  } else {
                    timeSetClick("hour", parseFloat(freeTimeInput));
                    setFreeTimeVisible(false);
                  }
                }}
                style={{ color: "#fff", height: "35px" }}
                // className={classes.clockInButton}
              >
                确定
              </Button>
            </DropMenu>
            {timeArray.map((timeItem: any, timeIndex: number) => {
              return (
                <div
                  key={"time" + timeIndex}
                  // className="timeSet-item"
                  onClick={() => {
                    if (
                      viewStyle !== "horizontal" ||
                      (viewStyle === "horizontal" &&
                        targetNode &&
                        (targetNode.type === 1 || targetNode.type === 6))
                    ) {
                      if (type) {
                        changeTime("hour", timeItem);
                      } else {
                        timeSetClick("hour", timeItem);
                        setFreeTimeVisible(false);
                      }
                    }
                  }}
                  className="timeSet-time-item"
                  style={{
                    // marginBottom:
                    //  !viewStyle ?
                    // '5px',
                    //  : '0px',
                    marginRight:
                      // !viewStyle ?
                      "2px",
                    // : '1px',
                  }}
                >
                  <span style={{ zoom: 0.8 }}>{timeItem}</span>
                  <div
                    className="timeSet-time-choose"
                    style={{
                      borderColor:
                        newTimeNumber === timeItem
                          ? "#F28806  transparent transparent transparent"
                          : "#35a6f8 transparent transparent transparent",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {/* v-if="dateType" */}
      {!timestate ? (
        <React.Fragment>
          {!viewStyle ? (
            <div className="timeSet-title">
              到期时间
              <span>
                {newEndDate === 99999999999999
                  ? "无限期"
                  : moment(newEndDate).format("YYYY-MM-DD")}
              </span>
            </div>
          ) : null}
          <div
            className="timeSet-date"
            style={
              viewStyle !== "horizontal"
                ? {
                    width: "100%",
                    height: "55px",
                    padding: "5px 10px",
                    display: "flex",
                  }
                : { width: "350px", height: "41px", marginLeft: "10px",display: "flex", }
            }
          >
            <div
              className="timeSet-date-logo"
              style={
                // !viewStyle
                //   ?
                {
                  width: "45px",
                  height: "40px",
                  marginRight: viewStyle === "horizontal" ? "-3px" : "10px",
                  alignContent: "space-between",
                }
              }
            >
              <img
                src={timeSet5Svg}
                onClick={() => {
                  if (
                    viewStyle !== "horizontal" ||
                    (viewStyle === "horizontal" &&
                      targetNode &&
                      (targetNode.type === 1 || targetNode.type === 6))
                  ) {
                    if (type) {
                      changeTime("infinite");
                    } else {
                      timeSetClick("infinite");
                    }
                  }
                }}
                alt=""
                // style={{ marginRight: !viewStyle ? '' : '5px' }}
              />
              <img
                src={timeSet6Svg}
                style={{
                  width: "17px",
                  height: "14px",
                  // marginRight: !viewStyle ? '' : '5px',
                }}
                onClick={() => {
                  changeTimeDateType(timeDateType === 1 ? 0 : 1);
                }}
                alt=""
              />
            </div>
            <div className="timeSet-date-info" style={{ height: "41px" }}>
              {timeDateArray.map((dateTimeItem: any, dateTimeIndex: number) => {
                return (
                  <div
                    key={"date" + dateTimeIndex}
                    className="timeSet-date-item"
                    onClick={() => {
                      if (
                        viewStyle !== "horizontal" ||
                        (viewStyle === "horizontal" &&
                          targetNode &&
                          (targetNode.type === 1 || targetNode.type === 6))
                      ) {
                        if (type) {
                          changeTime("day", dateTimeIndex + 1);
                        } else {
                          timeSetClick("day", dateTimeIndex + 1);
                        }
                      }
                    }}
                    style={{
                      backgroundColor:
                        dateIndex === dateTimeItem
                          ? "#F28806"
                          : timeWeek[dateTimeIndex] > 4
                          ? "#BABABA"
                          : "#505050",
                      marginBottom: viewStyle !== "horizontal" ? "5px" : "1px",
                      marginRight:
                        // !viewStyle ?
                        "1px",
                      // : '1px',
                    }}
                  >
                    {dateTimeItem}
                  </div>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      ) : null}
      {/* {dayNumber < 1 ? (
        <div className="timeSet-title" style={{marginTop:'30px',color:'#D0021B'}}>
          已过期 <span style={{color:'#D0021B'}}>{Math.abs(dayNumber) + 1 + '天'}</span>
        </div>
      ) : null} */}
    </React.Fragment>
  );
};
TimeSet.defaultProps = {
  timeSetClick: null,
  dayNumber: 0,
  timeNumber: 0,
  percentClick: null,
};
export default TimeSet;
