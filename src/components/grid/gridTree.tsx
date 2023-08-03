import React, { useState, useEffect } from "react";
import "./gridTree.css";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import _ from "lodash";

import { editTask, setTaskInfo } from "../../redux/actions/taskActions";

import Task from "../task/task";

interface GridTreeProps {
  taskItem: any;
  left: number;
  lineLeft: number;
  gridState: boolean;
  taskNavDate: any;
  taskNavDay: any;
  changeTaskNum: any;
}

const GridTree: React.FC<GridTreeProps> = (props) => {
  let { taskItem, gridState, taskNavDate, taskNavDay, changeTaskNum } = props;
  const dispatch = useDispatch();
  const [gridTaskItem, setGridTaskItem] = useState<any>(null);
  const [gridTaskNavDay, setGridTaskNavDay] = useState<any>(null);

  // useMount(() => {
  //   if (taskItem) {
  //     setGridTaskItem(_.cloneDeep(taskItem));
  //   }
  // });
  useEffect(() => {
    if (taskItem) {
      setGridTaskItem(_.cloneDeep(taskItem));
      setGridTaskNavDay(_.cloneDeep(taskNavDay));
    }
    //eslint-disable-next-line
  }, [taskItem]);
  const chooseTask = async (index: number) => {
    // this.$emit("playTreeAudio");
    let newGridTaskItem = _.cloneDeep(gridTaskItem);
    let newGridTaskNavDay = _.cloneDeep(gridTaskNavDay);
    let taskNavIndex = _.findIndex(newGridTaskItem.dayArr, (item: any) => {
      return item !== "";
    });
    newGridTaskItem.dayArr[taskNavIndex] = "";
    if (newGridTaskNavDay[taskNavIndex]?.allTaskNum) {
      newGridTaskNavDay[taskNavIndex].allTaskNum = parseFloat(
        (
          newGridTaskNavDay[taskNavIndex].allTaskNum - newGridTaskItem.hour
        ).toFixed(1)
      );
      newGridTaskItem.dayArr[index] = 0;
    }
    newGridTaskItem.dayArr[index] = newGridTaskItem.hour;
    console.log(newGridTaskNavDay[index].allTaskNum);
    newGridTaskNavDay[index].allTaskNum = parseFloat(
      (newGridTaskNavDay[index].allTaskNum + newGridTaskItem.hour).toFixed(1)
    );
    console.log(newGridTaskNavDay[index].allTaskNum);
    if (!gridState) {
      newGridTaskItem.executorKey = taskNavDay[index].userId;
      newGridTaskItem.executorName = taskNavDay[index].nickName;
      newGridTaskItem.executorAvatar = taskNavDay[index].avatar;
      // newGridTaskItem.executorKey = taskNavDay[index].userId;
      api.group.addGroupMember(newGridTaskItem.groupKey, [
        {
          userKey: taskNavDate[index].userId,
          nickName: taskNavDate[index].nickName,
          avatar: taskNavDate[index].avatar,
          gender: taskNavDate[index].gender,
          role: 4,
        },
      ]);
    } else {
      newGridTaskItem.taskEndDate = new Date().getTime() + index * 86400000;
    }

    setGridTaskItem(newGridTaskItem);
    setGridTaskNavDay(newGridTaskNavDay);
    changeTaskNum(newGridTaskNavDay);
    dispatch(editTask({ key: newGridTaskItem._key, ...newGridTaskItem }, 4));
    dispatch(setTaskInfo(newGridTaskItem));
  };
  const changeTask = (item: any) => {
    let newGridTaskItem = _.cloneDeep(gridTaskItem);
    for (let key in newGridTaskItem) {
      if (item[key]) {
        newGridTaskItem[key] = item[key];
      }
    }
    setGridTaskItem(newGridTaskItem);
  };
  return (
    <React.Fragment>
      {gridTaskItem ? (
        <React.Fragment>
          <div
            className="grid-title"
            //  :ref="'task'+taskItem._key"
          >
            {/* <div className="line-img-task" style={{ left: lineLeft + 'px' }}></div> */}
            <div className="grid-title-subtitle" style={{ paddingLeft: "5px" }}>
              <Task
                taskItem={gridTaskItem}
                bottomtype={"grid"}
                changeTask={changeTask}
              />
            </div>
            <div className="grid-label-tr grid-title-subtask">
              {gridTaskItem.dayArr.map((dateItem: any, dateIndex: number) => {
                return (
                  <div
                    // v-for="() in taskItem.dayArr"
                    key={"dateItem" + dateIndex}
                    className="grid-label-td"
                    onClick={() => {
                      chooseTask(dateIndex);
                    }}
                    style={
                      dateItem ? { backgroundColor: "rgba(59,82,107,0.6)" } : {}
                    }
                  >
                    {dateItem}
                  </div>
                );
              })}
            </div>
          </div>
          {/* {gridTaskItem.children.map((child: any, index: number) => {
            return (
              <React.Fragment>
                {child ? (
                  <div
                    key={'child' + index}
                    className="grid-title-task chooseTr"
                  >
                    <NewGridTree
                      taskItem={child}
                      left={taskLeft}
                      lineLeft={lineTaskLeft}
                      gridState={gridState}
                      taskNavDate={taskNavDate}
                      taskNavDay={taskNavDay}
                      changeTaskNum={changeTaskNum}
                      // @playTreeAudio="playTreeAudio"
                    />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })} */}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
GridTree.defaultProps = {};
export default GridTree;
