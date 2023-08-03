import React, { useState, useEffect, useRef, useCallback } from "react";
import "./grid.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Tooltip } from "antd";
import _ from "lodash";
import moment from "moment";
import api from "../../services/api";
import { changeMusic } from "../../redux/actions/authActions";
import { setMessage } from "../../redux/actions/commonActions";
import { editTask, setTaskInfo } from "../../redux/actions/taskActions";
import Loading from "../common/loading";
import Avatar from "../common/avatar";

import { useMount } from "../../hook/common";
import Task from "../task/task";
interface GridProps {
  gridState: boolean;
}

const Grid: React.FC<GridProps> = (prop) => {
  let { gridState } = prop;
  const dispatch = useDispatch();
  // const user = useTypedSelector((state) => state.auth.user);
  // const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const [gridGroupArray, setGridGroupArray] = useState<any>([]);
  const [allGridGroupArray, setAllGridGroupArray] = useState<any>(null);
  const [allGridTaskArray, setAllGridTaskArray] = useState<any>(null);
  const [taskNavDate, setTaskNavDate] = useState<any>([]);
  const [taskNavDay, setTaskNavDay] = useState<any>(null);
  const [taskNavWeek, setTaskNavWeek] = useState<any>([]);
  const [avatarWidth, setAvatarWidth] = useState("30px");
  const [chooseIndex, setChooseIndex] = useState(100);
  const [loading, setLoading] = useState(false);
  const [trIndex, setTrIndex] = useState("");
  const labelRef: React.RefObject<any> = useRef();
  const avatarRef: React.RefObject<any> = useRef();
  const leftRef = useRef<any>(null);
  const rightRef = useRef<any>(null);
  const topRef = useRef<any>(null);
  let unDistory = useRef<any>(true);

  useEffect(() => {
    return () => {
      unDistory.current = false;
    };
  }, []);
  useEffect(() => {
    if (
      (headerIndex === 3 && groupKey) ||
      (headerIndex === 2 && targetUserKey)
    ) {
      setAllGridGroupArray(null);
      setAllGridTaskArray(null);
      setTaskNavDay(null);
    }
  }, [targetUserKey, groupKey, headerIndex]);
  const formatDate = useCallback(() => {
    let newTaskNavDate: any = [];
    let newTaskNavDay: any = [];
    let newTaskNavWeek: any = [];
    for (let i = 0; i < 30; i += 1) {
      let taskDate = moment().add(i, "days");
      newTaskNavDate.push(taskDate.date());
      newTaskNavDay.push({
        startTime: taskDate.startOf("day").valueOf(),
        endTime: taskDate.endOf("day").valueOf(),
        allTaskNum: 0,
      });
      newTaskNavWeek.push(moment().add(i, "days").weekday());
    }
    // setTaskNavDay(newTaskNavDay);
    setTaskNavDate(newTaskNavDate);
    setTaskNavWeek(newTaskNavWeek);
    return [newTaskNavDay, newTaskNavDate, newTaskNavWeek];
  }, []);
  const formatPerson = useCallback(
    (headerIndex: number, groupMemberArray: any, memberArray: any) => {
      let newTaskNavDate: any = [];
      let newTaskNavDay: any = [];
      let newMemberArray =
        headerIndex === 3
          ? _.cloneDeep(groupMemberArray)
          : _.cloneDeep(memberArray);
      newMemberArray.forEach((item: any, index: number) => {
        newTaskNavDate.push(item);
        newTaskNavDay.push({
          userId: item.userId,
          name: item.nickName,
          avatar: item.avatar,
          allTaskNum: 0,
        });
      });
      // setTaskNavDay(newTaskNavDay);
      setTaskNavDate(newTaskNavDate);
      return [newTaskNavDay, newTaskNavDate];
      // this.$nextTick(() => {
      //   avatarHeight = document.querySelectorAll(
      //     ".grid-label-td"
      //   )[0].clientWidth;
      // });
    },
    []
  );
  const formatData = useCallback(
    (headerIndex: number, groupMemberArray: any, memberArray: any) => {
      return gridState
        ? formatDate()
        : formatPerson(headerIndex, groupMemberArray, memberArray);
    },
    [gridState, formatDate, formatPerson]
  );
  const getGroupData = useCallback(
    (
      groupArray: any,
      taskArray: any,
      headerIndex: number,
      groupMemberArray: any,
      memberArray: any
    ) => {
      let arr: any = [];
      let newTaskNavDay: any = [];
      // if (taskNavDay) {
      //   newTaskNavDay = _.cloneDeep(taskNavDay).map((taskNavItem: any) => {
      //     taskNavItem.allTaskNum = 0;
      //     return taskNavItem;
      //   });
      // } else {
      newTaskNavDay = formatData(headerIndex, groupMemberArray, memberArray)[0];
      // }
      let newGridGroupArray: any = [];
      if (groupArray.length > 0 && taskArray.length > 0) {
        taskArray.forEach((item: any, index: number) => {
          arr[index] = {
            groupObj: groupArray[index],
            tabShow: true,
          };
          // if (item.type === 2) {
          item.forEach((groupItem: any, groupIndex: number) => {
            if (groupItem.labelKey) {
              if (!arr[index][groupItem.labelKey]) {
                let labelIndex = _.findIndex(groupArray[index].labelArray, {
                  _key: groupItem.labelKey,
                });
                arr[index][groupItem.labelKey] = {
                  arr: [],
                  labelObj: groupArray[index].labelArray[labelIndex],
                };
              }
              arr[index][groupItem.labelKey].arr = sortArr(
                arr[index][groupItem.labelKey].arr,
                groupItem
              );
            } else {
              if (!arr[index]["ToDo"]) {
                arr[index]["ToDo"] = {
                  arr: [],
                  labelObj: { cardLabelName: "ToDo" },
                };
              }
              arr[index]["ToDo"].arr = sortArr(
                arr[index]["ToDo"].arr,
                groupItem
              );
            }
          });
          // }
        });
        if (headerIndex === 1) {
          groupArray[0].labelArray.forEach((item: any, index: number) => {
            if (Object.keys(arr[0]).indexOf(item._key) === -1) {
              arr[0][item._key] = {
                arr: [],
                labelObj: item,
              };
            }
          });
        }
        arr.forEach((item: any, index: number) => {
          for (let key in item) {
            if (
              key !== "groupObj" &&
              key !== "tabShow" &&
              key !== "arrlength" &&
              key !== "show"
            ) {
              //eslint-disable-next-line no-loop-func
              item[key].arr = item[key].arr.filter((arrItem: any) => {
                newTaskNavDay.forEach((dayItem: any) => {
                  let state = gridState
                    ? arrItem.taskEndDate >= dayItem.startTime &&
                      arrItem.taskEndDate <= dayItem.endTime
                    : dayItem.userId === arrItem.executorKey;
                  //  !== 2
                  if (
                    state &&
                    arrItem.finishPercent === 0 &&
                    (arrItem.type === 2 || arrItem.type === 6)
                  ) {
                    dayItem.allTaskNum = dayItem.allTaskNum + arrItem.hour;
                  }
                });
                return arrItem.finishPercent === 0;
              });
            }
          }
        });
        if (!gridState) {
          newTaskNavDay = _.sortBy(newTaskNavDay, ["allTaskNum"]).reverse();
        }
        newGridGroupArray = [...arr].map((item: any, index: number) => {
          item.arrlength = 0;
          for (let key in item) {
            if (
              key !== "groupObj" &&
              key !== "tabShow" &&
              key !== "arrlength" &&
              key !== "show"
            ) {
              item[key].tabShow = true;
              item[key].show = true;
              item[key].arr.forEach((arrItem: any, arrIndex: number) => {
                arrItem.dayArr = [];
                newTaskNavDay.forEach((dayItem: any, dayIndex: number) => {
                  let state = gridState
                    ? arrItem.taskEndDate >= dayItem.startTime &&
                      arrItem.taskEndDate <= dayItem.endTime
                    : dayItem.userId === arrItem.executorKey;
                  if (
                    state &&
                    arrItem.finishPercent === 0 &&
                    (arrItem.type === 2 || arrItem.type === 6)
                  ) {
                    arrItem.dayArr.push(arrItem.hour);
                  } else {
                    arrItem.dayArr.push("");
                  }
                });
              });
              item.arrlength = item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        newGridGroupArray = _.sortBy(newGridGroupArray, [
          "arrlength",
        ]).reverse();
        setGridGroupArray(newGridGroupArray);
        setTaskNavDay(newTaskNavDay);

        // this.groupArray.splice(0, 1, this.groupArray[0]);
      }
    },
    [formatData, gridState]
  );
  const getGridData = async (
    headerIndex: number,
    groupKey: string,
    targetUserKey: string,
    groupMemberArray: any,
    memberArray: any
  ) => {
    let obj: any = {
      type1: headerIndex,
      finishPercentArray: [0],
    };
    if (headerIndex === 3) {
      obj.groupKey = groupKey;
    } else {
      obj.type2 = gridState ? 3 : 4;
      if (headerIndex === 2) {
        obj.targetUKey = targetUserKey;
      }
    }
    // setLoading(true);
    let gridRes: any = await api.task.allGridGroupTask(obj);
    if (unDistory.current) {
      if (gridRes.msg === "OK") {
        // setLoading(false);
        let gridObj: any = _.cloneDeep(gridRes.result);
        let newAllGridChildArray: any = [];
        let newAllGridTaskArray: any = [];
        let newAllGridGroupArray: any = [];
        let cardIndex = _.findIndex(gridObj.groupArray, {
          _key: localStorage.getItem("mainGroupKey"),
        });
        if (gridObj.groupArray.length > 0) {
          gridObj.groupArray.unshift(
            gridObj.groupArray.splice(cardIndex, 1)[0]
          );
          gridObj.cardArray.unshift(gridObj.cardArray.splice(cardIndex, 1)[0]);
        }
        newAllGridGroupArray = gridObj.groupArray;

        // (taskItem.finishPercent === 1 &&
        //   taskItem.children.length > 0) ||
        // (taskItem.finishPercent === 2 && taskItem.children.length > 0)
        newAllGridTaskArray = gridObj.cardArray.map(
          (item: any, index: number) => {
            item = item.filter((taskItem: any, taskIndex: number) => {
              return taskItem.finishPercent === 0;
            });
            return item;
          }
        );
        gridObj.sonCardArray.forEach((item: any, index: number) => {
          newAllGridChildArray[index] = {};
          for (let key in item) {
            if (item[key].finishPercent === 0) {
              newAllGridChildArray[index][key] = item[key];
            }
          }
        });
        setAllGridGroupArray(newAllGridGroupArray);
        setAllGridTaskArray(newAllGridTaskArray);
        formatData(headerIndex, groupMemberArray, memberArray);
        setLoading(false);
      } else {
        dispatch(setMessage(true, gridRes.msg, "error"));
      }
    }
  };

  useEffect(() => {
    if (headerIndex === 3 && groupInfo && labelArray && taskArray) {
      let groupArray: any = _.cloneDeep([groupInfo]);
      groupArray[0].labelArray = _.cloneDeep(labelArray);
      let cardArray: any = _.cloneDeep([taskArray]).map((item: any) => {
        item.children = [];
        // return _.cloneDeep(format.formatFilter(item, filterObject));
        return item;
      });
      console.log(groupArray);
      console.log(cardArray);
      getGroupData(
        groupArray,
        cardArray,
        headerIndex,
        groupMemberArray,
        memberArray
      );
    } else if (
      headerIndex !== 3 &&
      workingGroupArray &&
      workingTaskArray &&
      gridState
    ) {
      getGroupData(
        workingGroupArray,
        workingTaskArray,
        headerIndex,
        groupMemberArray,
        memberArray
      );
    } else if (
      (headerIndex === 3 && groupMemberArray) ||
      (headerIndex !== 3 && memberArray)
    ) {
      getGridData(
        headerIndex,
        groupKey,
        targetUserKey,
        groupMemberArray,
        memberArray
      );
    }
    //eslint-disable-next-line
  }, [
    groupInfo,
    labelArray,
    taskArray,
    workingGroupArray,
    workingTaskArray,
    groupKey,
    targetUserKey,
  ]);
  useMount(() => {
    if (avatarRef.current) {
      let clientWidth = !gridState
        ? avatarRef.current
          ? avatarRef.current.offsetWidth > 25
            ? "25px"
            : avatarRef.current.offsetWidth + "px"
          : "0px"
        : "25px";
      setAvatarWidth(clientWidth);
    }
  });
  useEffect(() => {
    if (allGridTaskArray) {
      getGroupData(
        _.cloneDeep(allGridGroupArray),
        _.cloneDeep(allGridTaskArray),
        headerIndex,
        groupMemberArray,
        memberArray
      );
    }
  }, [
    allGridTaskArray,
    allGridGroupArray,
    getGroupData,
    headerIndex,
    groupMemberArray,
    memberArray,
  ]);

  const sortArr = (arr: any, item: any) => {
    let time = 0;
    item.show = true;
    if (item.taskEndDate) {
      time = Math.floor(
        (moment(item.taskEndDate).endOf("day").valueOf() -
          moment(new Date().getTime()).endOf("day").valueOf()) /
          86400000
      );
    }
    item.endtime = {
      time: time < 0 ? Math.abs(time) : Math.abs(time) + 1,
      endState: time < 0 ? false : true,
    };
    arr.push(item);
    // arr = this._.sortBy(arr, ["taskEndDate"]).reverse();
    arr = _.sortBy(arr, ["finishPercent"]);
    return arr;
  };
  // const recurrenceData = (
  //   arr: any,
  //   arrIndex: number,
  //   groupIndex: number,
  //   taskItem: any
  // ) => {
  //   let key = arr[arrIndex];
  //   let newAllGridChildArray = _.cloneDeep(allGridChildArray);
  //   let newTaskNavDay = _.cloneDeep(taskNavDay);
  //   arr[arrIndex] = newAllGridChildArray[groupIndex][key];
  //   arr[arrIndex].dayArr = [];
  //   newTaskNavDay = newTaskNavDay.map((dayItem: any, dayIndex: number) => {
  //     let state = gridState
  //       ? arr[arrIndex].taskEndDate >= dayItem.startTime &&
  //         arr[arrIndex].taskEndDate < dayItem.endTime
  //       : dayItem.userId == arr[arrIndex].executorKey;
  //     if (
  //       state &&
  //       arr[arrIndex].finishPercent !== 2 &&
  //       arr[arrIndex].type === 2
  //     ) {
  //       arr[arrIndex].dayArr.push(arr[arrIndex].hour);
  //       dayItem.allTaskNum = dayItem.allTaskNum + arr[arrIndex].hour;
  //     } else {
  //       arr[arrIndex].dayArr.push('');
  //     }
  //     return dayItem;
  //   });
  //   // if (arr[arrIndex].children && arr[arrIndex].children.length > 0) {
  //   //   arr[arrIndex].children.forEach((childItem: any, childIndex: number) => {
  //   //     recurrenceData(
  //   //       arr[arrIndex].children,
  //   //       childIndex,
  //   //       groupIndex,
  //   //       taskItem
  //   //     );
  //   //   });
  //   // }
  //   setTaskNavDay(newTaskNavDay);
  // };

  // playTreeAudio() {
  //   this.$refs.treeAudio.play();
  // },
  const getLeftItem = (item: any) => {
    let dom: any = [];
    for (let groupIndex in item) {
      let groupItem: any = item[groupIndex];
      dom.push(
        <React.Fragment>
          {groupItem.labelObj && groupItem.show && groupItem.arr.length > 0 ? (
            <React.Fragment>
              <div
                className="grid-left-label grid-left-item"
                style={{ height: "35px" }}
                key={"left" + groupIndex}
              >
                {groupItem.labelObj.cardLabelName}
              </div>
              {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                return (
                  <div
                    key={"task" + taskIndex}
                    className="grid-left-item"
                    style={{
                      backgroundColor:trIndex===groupIndex + "-" + taskIndex? "rgba(240, 240, 240, 0.3)":"",
                    }}
                  >
                    {taskItem ? (
                      <Task
                        taskItem={taskItem}
                        bottomtype={"grid"}
                        changeTask={changeTask}
                      />
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      );
    }
    return dom;
  };
  const getRightItem = (item: any) => {
    let dom: any = [];
    for (let groupIndex in item) {
      let groupItem: any = item[groupIndex];
      dom.push(
        <React.Fragment>
          {groupItem.labelObj && groupItem.show && groupItem.arr.length > 0 ? (
            <React.Fragment>
              <div className="grid-right-item"></div>
              {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                return (
                  <div
                    className="grid-right-item grid-right-tr"
                    style={{
                      marginBottom: "-1px",
                    }}
                    key={"right" + taskIndex}
                    onMouseEnter={() => {
                      setTrIndex(groupIndex + "-" + taskIndex);
                    }}
                  >
                    {taskItem.dayArr.map((dateItem: any, dateIndex: number) => {
                      return (
                        <div
                          // v-for="() in taskItem.dayArr"
                          key={"dateItem" + dateIndex}
                          className="grid-right-td"
                          onClick={() => {
                            chooseTask(taskItem, dateIndex);
                          }}
                          onMouseEnter={() => {
                            setChooseIndex(dateIndex);
                          }}
                          style={{
                            backgroundColor: dateItem
                              ? "rgba(59,82,107,0.6)"
                              : dateIndex === chooseIndex
                              ? "rgba(240, 240, 240, 0.3)"
                              : "transparent",
                            border: "1px solid #fff",
                            margin: "0px -1px -1px 0px",
                            // paddingBottom: "-1px",
                          }}
                        >
                          {dateItem}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      );
    }
    return dom;
  };
  const changeTask = (item: any) => {
    // let newGridTaskItem = _.cloneDeep(gridTaskItem);
    // for (let key in newGridTaskItem) {
    //   if (item[key]) {
    //     newGridTaskItem[key] = item[key];
    //   }
    // }
    // setGridTaskItem(newGridTaskItem);
  };
  const chooseTask = (item: any, index: number) => {
    // this.$emit("playTreeAudio");
    let newTaskNavDay = _.cloneDeep(taskNavDay);
    let taskNavIndex = _.findIndex(item.dayArr, (item: any) => {
      return item !== "";
    });
    item.dayArr[taskNavIndex] = "";
    if (newTaskNavDay[taskNavIndex]?.allTaskNum) {
      newTaskNavDay[taskNavIndex].allTaskNum = parseFloat(
        (newTaskNavDay[taskNavIndex].allTaskNum - item.hour).toFixed(1)
      );
      item.dayArr[index] = 0;
    }
    item.dayArr[index] = item.hour;
    console.log(newTaskNavDay[index].allTaskNum);
    newTaskNavDay[index].allTaskNum = parseFloat(
      (newTaskNavDay[index].allTaskNum + item.hour).toFixed(1)
    );
    if (!gridState) {
      item.executorKey = newTaskNavDay[index].userId;
      item.executorName = newTaskNavDay[index].nickName;
      item.executorAvatar = newTaskNavDay[index].avatar;
      // newGridTaskItem.executorKey = taskNavDay[index].userId;
      api.group.addGroupMember(item.groupKey, [
        {
          userKey: taskNavDate[index].userId,
          nickName: taskNavDate[index].nickName,
          avatar: taskNavDate[index].avatar,
          gender: taskNavDate[index].gender,
          role: 4,
        },
      ]);
    } else {
      item.taskEndDate = new Date().getTime() + index * 86400000;
    }

    setTaskNavDay(newTaskNavDay);
    console.log(index);
    dispatch(editTask({ key: item._key, ...item }, 4));
    dispatch(setTaskInfo(item));
    setGridGroupArray((prevGridGroupArray) => {
      prevGridGroupArray.forEach((gridItem: any) => {
        for (let groupIndex in gridItem) {
          let groupItem: any = gridItem[groupIndex];
          if (
            groupItem.labelObj &&
            groupItem.show &&
            groupItem.arr.length > 0
          ) {
            groupItem.arr = groupItem.arr.map(
              (taskItem: any, taskIndex: number) => {
                if (taskItem._key === item._key) {
                  console.log(moment(item.taskEndDate).format("MM-DD"));
                  return _.cloneDeep(item);
                } else {
                  return _.cloneDeep(taskItem);
                }
              }
            );
          }
        }
      });
      return [..._.cloneDeep(prevGridGroupArray)];
    });
    dispatch(changeMusic(11));
  };
  const setScrollTop = (e: any) => {
    console.log();
    leftRef.current.scrollTop = e.target.scrollTop;
    rightRef.current.scrollTop = e.target.scrollTop;
    topRef.current.scrollLeft = e.target.scrollLeft;
  };
  return (
    <div className="grid">
      {loading ? <Loading /> : null}
      <div className="grid-date">
        <div className="grid-date-left">
          <div className="grid-date-title">任务时长统计</div>
          <div className="grid-date-title">
            {gridState ? "任务时间" : "执行人"}
          </div>
        </div>
        <div className="grid-date-right" ref={topRef}>
          <div className="grid-date-label">
            {taskNavDay
              ? taskNavDate.map((dateItem: any, dateIndex: number) => {
                  return (
                    <div
                      style={{ border: "0px" }}
                      className="grid-date-td"
                      ref={labelRef}
                      key={"taskNavDate" + dateIndex}
                    >
                      <div
                        style={{
                          background:
                            taskNavDay[dateIndex].allTaskNum > 8 &&
                            headerIndex === 1
                              ? "#E94848"
                              : taskNavDay[dateIndex].allTaskNum !== 0
                              ? "#16AE7A"
                              : "#B6B6B6",
                          borderRadius: "50%",
                          width: avatarWidth,
                          height: avatarWidth,
                          textAlign: "center",
                          lineHeight: avatarWidth,
                        }}
                      >
                        {taskNavDay[dateIndex].allTaskNum > 0
                          ? taskNavDay[dateIndex].allTaskNum.toFixed(1)
                          : ""}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="grid-date-label">
            {taskNavDate.map((dateItem: any, dateIndex: number) => {
              return (
                <div
                  key={"taskNavLabel" + dateIndex}
                  className="grid-date-td"
                  style={{
                    backgroundColor: gridState
                      ? taskNavWeek[dateIndex] > 4 && gridState
                        ? "#BABABA"
                        : "#505050"
                      : "",
                    paddingRight: "-1px",
                  }}
                >
                  {gridState ? (
                    <React.Fragment>{dateItem}</React.Fragment>
                  ) : (
                    <Tooltip title={dateItem.nickName}>
                      <div
                        className="grid-label-td-avatar"
                        style={{
                          borderRight:
                            dateIndex !== taskNavDate.length - 1
                              ? "1px solid transparent"
                              : "0px",
                        }}
                      >
                        {/* <div slot="title">{dateItem.nickName}</div> */}

                        <Avatar
                          name={dateItem.nickName}
                          avatar={taskNavDay[dateIndex].avatar}
                          type={"person"}
                          index={dateIndex}
                          size={35}
                        />
                      </div>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid-container">
        {/* {gridGroupArray.map((item: any, index: number) => {
          return (
            <React.Fragment key={"gridGroup" + index}>
              {item.arrlength > 0 ? <React.Fragment></React.Fragment> : null}
            </React.Fragment>
          );
        })} */}
        <div className="grid-left" ref={leftRef} onScroll={setScrollTop}>
          {gridGroupArray.map((item: any, index: number) => {
            return (
              <React.Fragment key={"gridGroup" + index}>
                {item.arrlength > 0 ? (
                  <React.Fragment>
                    {headerIndex !== 3 ? (
                      <div
                        className="grid-left-label grid-left-item"
                        style={{ height: "35px" }}
                      >
                        <Avatar
                          name={item.groupObj.groupName}
                          avatar={item.groupObj.groupLogor}
                          type={"group"}
                          index={index}
                          size={30}
                        />
                        <span style={{ marginLeft: "8px" }}>
                          {item.groupObj.groupName}
                        </span>
                      </div>
                    ) : null}
                    {getLeftItem(item)}
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div className="grid-right" ref={rightRef} onScroll={setScrollTop}>
          {gridGroupArray.map((item: any, index: number) => {
            return (
              <React.Fragment key={"gridGroup" + index}>
                {item.arrlength > 0 ? (
                  <React.Fragment>
                    {headerIndex !== 3 ? (
                      <div className="grid-right-item"></div>
                    ) : null}
                    {getRightItem(item)}
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Grid;
