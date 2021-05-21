import React, { useState, useEffect, useCallback } from "react";
import "./memberBoard.css";
import moment from "moment";
import _ from "lodash";
import { Avatar } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";

import { getTeamTask, getProjectTask } from "../../redux/actions/taskActions";

import Task from "../../components/task/task";
import Loading from "../../components/common/loading";

import defaultGroupPng from "../../assets/img/defaultGroup.png";
import noneBoardPng from "../../assets/img/noneBoard.png";
import uncarePng from "../../assets/img/uncare.png";
interface MemberBoardProps {
  boardIndex: number;
}
interface MemberBoardItemProps {
  memberItem: any;
}
interface ProjectBoardItemProps {
  projectItem: any;
}
const MemberBoardItem: React.FC<MemberBoardItemProps> = (props) => {
  const { memberItem } = props;
  return (
    <React.Fragment>
      <div className="memberBoard-title">
        <Avatar
          style={{
            width: "22px",
            height: "22px",
            marginRight: "5px",
          }}
          src={memberItem[0][0].executorAvatar}
        />
        {memberItem[0][0].executorName}
      </div>
      {memberItem.map((item: any, index: number) => {
        return (
          <div key={"memberItem" + index} style={{ width: "100%" }}>
            <div className="memberBoard-group" style={{ marginTop: "5px" }}>
              {item[0].groupName.indexOf("主项目") === -1 ? (
                <Avatar
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                  shape="square"
                  src={
                    item[0].groupLogo
                      ? item[0].groupLogo +
                        "?imageMogr2/auto-orient/thumbnail/80x"
                      : defaultGroupPng
                  }
                />
              ) : null}
              {item[0].groupName}
            </div>
            <div className="memberBoard-info">
              {item.map((taskItem: any, taskIndex: number) => {
                return (
                  <Task
                    taskItem={taskItem}
                    key={"task" + taskIndex}
                    // timeSetStatus={taskIndex > item.length - 3}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};
const ProjectBoardItem: React.FC<ProjectBoardItemProps> = (props) => {
  const { projectItem } = props;
  const getProjectBoardTask = () => {
    let dom: any = [];
    for (let key in projectItem) {
      if (key !== "groupObj" && key !== "position") {
        dom.push(
          <React.Fragment key={projectItem.groupObj.groupName + key}>
            <div
              className="memberBoard-group-item-label"
              style={{ marginTop: "5px" }}
            >
              {projectItem[key].labelObj
                ? projectItem[key].labelObj.cardLabelName
                : "无标题"}
            </div>
            {projectItem[key].arr.map((taskItem: any, taskIndex: number) => {
              return (
                <Task
                  taskItem={taskItem}
                  key={"task" + taskIndex}
                  // timeSetStatus={taskIndex > projectItem[key].arr.length - 3}
                />
              );
            })}
          </React.Fragment>
        );
      }
    }
    return dom;
  };
  return (
    <React.Fragment>
      <div className="memberBoard-group-item">
        <img
          src={projectItem.groupObj.groupLogo}
          className="memberBoard-group-avatar"
          alt=""
        />
        {projectItem.groupObj.groupName}
      </div>
      {getProjectBoardTask()}
    </React.Fragment>
  );
};
const MemberBoard: React.FC<MemberBoardProps> = (props) => {
  const { boardIndex } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const teamTaskArray = useTypedSelector((state) => state.task.teamTaskArray);
  const projectTaskArray = useTypedSelector(
    (state) => state.task.projectTaskArray
  );
  const [memberGroupArray, setMemberGroupArray] = useState<any>([]);
  const [projectGroupArray, setProjectGroupArray] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (mainGroupKey) {
      setLoading(true);
      if (boardIndex === 0) {
        dispatch(
          getTeamTask(
            [0, 1],
            undefined,
            moment().startOf("day").valueOf(),
            moment().add(1, "days").startOf("day").valueOf()
          )
        );
      } else {
        dispatch(getProjectTask([0]));
      }
    }
  }, [mainGroupKey, boardIndex, dispatch]);
  const formatDay = useCallback((item: any) => {
    let time = 0;
    item.percent = Math.floor(
      (item.hour * 3600000 - item.countDownTime) / (item.hour * 36000)
    );
    let countTime = item.hour * 3600000 - item.countDownTime;
    let hours = Math.floor(
      (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((countTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((countTime % (1000 * 60)) / 1000);
    item.countDownText =
      addZero(hours) + " : " + addZero(minutes) + " : " + addZero(seconds);
    if (item.taskEndDate) {
      time = Math.floor(
        (moment(item.taskEndDate).endOf("day").valueOf() -
          moment().endOf("day").valueOf()) /
          86400000
      );
    }
    item.time = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
    item.endState = time < 0 ? false : true;
    return item;
  }, []);
  useEffect(() => {
    // 用户已登录
    if (teamTaskArray && user && user._key) {
      setLoading(false);
      let personObj: any = {};
      let personGroupObj: any = {};
      let personGroupArray: any = [];
      teamTaskArray.forEach((item: any, index: number) => {
        if (
          item.executorKey !== user._key &&
          item.groupName &&
          item.title !== ""
        ) {
          if (!personObj[item.executorKey]) {
            personObj[item.executorKey] = [];
          }
          item = formatDay(item);
          personObj[item.executorKey].push(item);
          // this.showTabObj[item.executorKey] = true;
          personObj[item.executorKey] = _.sortBy(personObj[item.executorKey], [
            "taskEndDate",
          ]).reverse();
        }
      });
      for (let key in personObj) {
        personGroupObj[key] = {};
        personObj[key].forEach((personItem: any, personIndex: number) => {
          if (!personGroupObj[key][personItem.groupKey]) {
            personGroupObj[key][personItem.groupKey] = [];
          }
          personGroupObj[key][personItem.groupKey].push(personItem);
        });
      }
      Object.values(personGroupObj).forEach((item: any, index: number) => {
        personGroupArray.push(Object.values(item));
      });
      setMemberGroupArray(personGroupArray);
    }
  }, [teamTaskArray, user, formatDay]);
  const sortArr = useCallback(
    (arr: any, item: any) => {
      item = formatDay(item);
      arr.push(item);
      arr = _.sortBy(arr, ["createTime"]).reverse();
      arr = _.sortBy(arr, ["finishPercent"]);
      return arr;
    },
    [formatDay]
  );
  useEffect(() => {
    if (projectTaskArray && user && user._key) {
      setLoading(false);
      let taskArray = _.cloneDeep(projectTaskArray.cardArray);
      let groupArray = _.cloneDeep(projectTaskArray.groupArray);
      let arr: any = [];
      taskArray.forEach((item: any, index: number) => {
        arr[index] = { groupObj: groupArray[index] };
        item.forEach((groupItem: any, groupIndex: number) => {
          if (
            groupItem.finishPercent === 0 &&
            item.title !== "" &&
            groupItem.groupName.indexOf("主项目") === -1
          ) {
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
          }
        });
      });
      setProjectGroupArray(arr);
    }
  }, [projectTaskArray, user, sortArr]);

  const addZero = (num: number) => {
    return num > 9 ? num + "" : "0" + num;
  };

  // const downMenu = (
  //   <div className="dropDown-box">
  //     <div
  //       className="memberBoard-maintitle-board"
  //       onClick={() => {
  //         setBoardIndex(0);
  //       }}
  //     >
  //       好友看板
  //     </div>
  //     <div
  //       className="memberBoard-maintitle-board"
  //       onClick={() => {
  //         setBoardIndex(1);
  //       }}
  //     >
  //       项目看板
  //     </div>
  //   </div>
  // );
  return (
    <div className="memberBoard">
      {loading ? <Loading loadingWidth="80px" loadingHeight="80px" /> : null}
      {/* <Dropdown overlay={downMenu}>
        <div
          className="memberBoard-maintitle"
          onClick={() => {
            setBoardVisible(true);
          }}
        >
          {boardIndex === 0 ? '关注好友看板' : '关注项目看板'}

          <img
            src={downArrowPng}
            alt=""
            style={{ width: '15px', height: '9px', marginLeft: '15px' }}
          />
        </div>
      </Dropdown> */}
      {boardIndex === 0 ? (
        <div className="memberBoard-item">
          {memberGroupArray.length > 0 ? (
            memberGroupArray.map((memberItem: any, memberIndex: number) => {
              return (
                <MemberBoardItem
                  memberItem={memberItem}
                  key={"memberGroup" + memberIndex}
                />
              );
            })
          ) : (
            <React.Fragment>
              <img src={noneBoardPng} className="memberBoard-item-img" alt="" />
              <div className="memberBoard-item-title">
                点击项目和好友右侧的
                <img
                  style={{ width: "17px", height: "15px", margin: "0px 5px" }}
                  src={uncarePng}
                  alt=""
                />
                关注
              </div>
            </React.Fragment>
          )}
        </div>
      ) : null}
      {boardIndex === 1 ? (
        <div className="memberBoard-item">
          {projectGroupArray.map((projectItem: any, projectIndex: number) => {
            return (
              <ProjectBoardItem
                projectItem={projectItem}
                key={"projectGroup" + projectIndex}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
export default MemberBoard;
