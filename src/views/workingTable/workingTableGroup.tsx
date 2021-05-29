import React, { useState, useRef, useEffect, useCallback } from "react";
import "./workingTableLabel.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import _ from "lodash";

import { changeMusic } from "../../redux/actions/authActions";
import { getWorkingTableTask } from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";

import Task from "../../components/task/task";
import TaskNav from "../../components/taskNav/taskNav";
import format from "../../components/common/format";
import { usePrevious } from "../../hook/common";

import defaultGroupPng from "../../assets/img/defaultGroup.png";
const WorkingTableGroup: React.FC = (prop) => {
  const { deviceWidth } = useAuth();
  const user = useTypedSelector((state) => state.auth.user);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [mainGroupArray, setMainGroupArray] = useState<any>([]);
  const [chooseLabelKey, setChooseLabelKey] = useState("");
  const dispatch = useDispatch();
  const workingTableRef: React.RefObject<any> = useRef();
  let oldPageX = 0;
  let labelScroll = 0;
  useEffect(() => {
    if (user && user._key && !workingTaskArray && headerIndex === 1) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
    }
    if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
      dispatch(
        getWorkingTableTask(
          user._key === targetUserInfo._key ? 4 : 2,
          targetUserInfo._key,
          1,
          [0, 1, 2, 10]
        )
      );
    }
  }, [user, targetUserInfo, dispatch, headerIndex, workingTaskArray]);
  const getData = useCallback(
    (workingTaskArray, workingGroupArray) => {
      let arr: any = [];
      let groupArray: any = [];
      if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
        workingTaskArray.forEach((item: any, index: number) => {
          arr[index] = { groupObj: workingGroupArray[index], position: [] };
          item.forEach((groupItem: any, groupIndex: number) => {
            if (groupItem.taskEndDate) {
              if (groupItem.labelKey) {
                if (!arr[index][groupItem.labelKey]) {
                  let labelIndex = _.findIndex(
                    workingGroupArray[index].labelArray,
                    {
                      _key: groupItem.labelKey,
                    }
                  );
                  arr[index][groupItem.labelKey] = {
                    arr: [],
                    labelObj: workingGroupArray[index].labelArray[labelIndex],
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
            }
          });
        });
        groupArray = arr;
        groupArray = groupArray.map((item: any) => {
          item.arrlength = 0;
          for (let key in item) {
            if (
              key !== "groupObj" &&
              key !== "position" &&
              key !== "arrlength"
            ) {
              item[key].arr = format.formatFilter(item[key].arr, filterObject);
              // .filter((arrItem) => {
              //   return arrItem.show;
              // });
              item.arrlength =
                item.groupObj._key === mainGroupKey
                  ? 10000
                  : item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        groupArray = _.sortBy(groupArray, ["arrlength"]).reverse();
        setMainGroupArray(groupArray);
      }
    },
    [filterObject, mainGroupKey]
  );
  const prevWorkingTaskArray: any = usePrevious(_.cloneDeep(workingTaskArray));
  useEffect(() => {
    if (
      workingTaskArray &&
      !_.isEqual(prevWorkingTaskArray, workingTaskArray)
    ) {
      getData(workingTaskArray, workingGroupArray);
    }
  }, [workingTaskArray, workingGroupArray, prevWorkingTaskArray, getData]);
  const prevFilterObject: any = usePrevious(_.cloneDeep(filterObject));
  useEffect(() => {
    if (
      workingTaskArray &&
      prevFilterObject &&
      !_.isEqual(prevFilterObject.filterType, filterObject.filterType)
    ) {
      getData(workingTaskArray, workingGroupArray);
    }
  }, [
    workingTaskArray,
    workingGroupArray,
    filterObject,
    prevFilterObject,
    getData,
  ]);

  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ["createTime"]).reverse();
    // arr = _.sortBy(arr, ['createTime']).reverse();
    arr = _.sortBy(arr, ["finishPercent"]);
    return arr;
  };
  const getGroupItem = (item: any, index: number) => {
    let dom: any = [];
    for (let key in item) {
      let groupItem = item[key];
      let groupIndex = key;
      dom.push(
        <div style={{ marginBottom: "2px" }} key={"groupItem" + groupIndex}>
          {groupItem.labelObj ? (
            <React.Fragment>
              {groupIndex !== "groupObj" && groupIndex !== "position" ? (
                <React.Fragment>
                  <TaskNav
                    name={
                      groupItem.labelObj
                        ? groupItem.labelObj.cardLabelName
                        : "无标题"
                    }
                    role={item.groupObj.groupRole}
                    colorIndex={index}
                    taskNavArray={[item.groupObj, groupItem.labelObj]}
                    taskNavWidth={memberHeaderIndex === 1 ? "350px" : "100%"}
                    chooseLabelKey={chooseLabelKey}
                    setChooseLabelKey={setChooseLabelKey}
                    batchTaskArray={() => {
                      batchTaskArray(groupItem.arr);
                    }}
                    taskNavTask={groupItem.arr}
                  />

                  <div className="workingTableLabel-info-item">
                    {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                      return (
                        <React.Fragment key={"task" + taskIndex}>
                          {/* {taskItem.show ? ( */}
                          <Task
                            taskItem={taskItem}
                            // timeSetStatus={taskIndex > groupItem.arr.length - 3}
                            // myState={item.groupObj._key === mainGroupKey}
                            taskIndex={index}
                          />
                          {/* ) : null} */}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === "OK") {
      dispatch(changeMusic(4));
      dispatch(setMessage(true, "归档成功", "success"));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      }
    } else {
      dispatch(setMessage(true, batchRes.msg, "error"));
    }
  };
  const startMove = (e: any) => {
    if (e.button === 2 && workingTableRef.current) {
      if (workingTableRef.current) {
        oldPageX = e.pageX;
      }
    }
  };
  const endMove = (e: any) => {
    if (workingTableRef.current) {
      if (e.pageX > oldPageX) {
        labelScroll = labelScroll - (e.pageX - oldPageX);
      } else if (e.pageX < oldPageX) {
        labelScroll = labelScroll + (oldPageX - e.pageX);
      }
      workingTableRef.current.scrollTo(labelScroll, 0);
    }
  };
  return (
    <div
      className="workingTableLabel-container"
      style={{ display: "flex", overflowX: "auto", height: "100%" }}
      ref={workingTableRef}
      onMouseDown={startMove}
      onContextMenu={endMove}
    >
      {mainGroupArray.map((item: any, index: number) => {
        return (
          <div key={"mainGroup" + index}>
            <div
              className="workingTableLabel-container-item"
              style={{ width:deviceWidth, height: "100%", flexShrink: 0 }}
              key={"group" + index}
              id={"workingTableGroup" + index}
            >
              <div className="workingTableLabel-info" style={{ width: "100%" }}>
                <div className="workingTableLabel-info-groupName">
                  <div
                    className="workingTableLabel-info-groupLogo"
                    style={{ borderRadius: "5px" }}
                  >
                    <img
                      src={
                        item.groupObj.groupLogo
                          ? item.groupObj.groupLogo
                          : defaultGroupPng
                      }
                      alt=""
                    />
                  </div>
                  <div style={{ color: "#fff" }}>{item.groupObj.groupName}</div>
                </div>
                <div
                  style={{ overflowY: "auto", overflowX: "hidden" }}
                  className="workingTableLabel-info-item-group-container"
                >
                  {getGroupItem(item, index)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WorkingTableGroup;
