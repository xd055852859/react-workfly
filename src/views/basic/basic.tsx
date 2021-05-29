import React, { useEffect, useRef } from "react";
import "./basic.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loadable from "react-loadable";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth";

import {
  setUnMessageNum,
  setSocketObj,
  setMoveState,
} from "../../redux/actions/commonActions";

import HeaderSet from "../../components/headerSet/headerSet";
import Home from "../home/home";
import { Route, Switch } from "react-router-dom";

interface BasicProps {}
const Content = Loadable({
  loader: () => import("../content/content"),
  loading: () => null,
});
const WorkingTable = Loadable({
  loader: () => import("../workingTable/workingTable"),
  loading: () => null,
});
const GroupTable = Loadable({
  loader: () => import("../groupTable/groupTable"),
  loading: () => null,
});
const Calendar = Loadable({
  loader: () => import("../calendar/calendar"),
  loading: () => null,
});
const Company = Loadable({
  loader: () => import("../companyBasic/company"),
  loading: () => null,
});

const Basic: React.FC<BasicProps> = () => {
  const { deviceState } = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useTypedSelector((state) => state.auth.socket);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const pageRef: React.RefObject<any> = useRef();

  useEffect(() => {
    if (socket) {
      socket.on("notice", (data: any) => {
        let taskData = JSON.parse(data);
        dispatch(setSocketObj({ data: taskData }));
      });
    }
  }, [socket, dispatch]);
  useEffect(() => {
    if (socketObj) {
      let newUnMessageNum = unMessageNum;
      // let newSelfTaskArray = _.cloneDeep(selfTaskArray);
      // let newWorkingTaskArray = _.cloneDeep(workingTaskArray);
      // let newTaskArray = _.cloneDeep(taskArray);
      dispatch(setUnMessageNum(newUnMessageNum + 1));
      dispatch(setSocketObj(null));
      // if (headerIndex === 0 && newSelfTaskArray) {
      //   newSelfTaskArray = newSelfTaskArray.map((taskItem: any) => {
      //     if (taskItem._key === socketObj.data.cardKey) {
      //       for (let key in taskItem) {
      //         if (socketObj.data[key] && key !== 'content' && key !== 'type') {
      //           if (typeof taskItem[key] === 'number') {
      //             taskItem[key] = parseInt(socketObj.data[key]);
      //           } else if (typeof taskItem[key] === 'boolean') {
      //             taskItem[key] = socketObj.data[key] ? true : false;
      //           } else {
      //             taskItem[key] = socketObj.data[key];
      //           }
      //         }
      //       }
      //     }
      //     return taskItem;
      //   });
      //   dispatch(setNewTaskArray('selfTaskArray', newSelfTaskArray));
      // } else if (
      //   (headerIndex === 1 || headerIndex === 2) &&
      //   newWorkingTaskArray
      // ) {
      //   newWorkingTaskArray = newWorkingTaskArray.map(
      //     (taskItem: any, taskIndex: number) => {
      //       taskItem = taskItem.map((item: any, index: number) => {
      //         if (item._key === socketObj.data.cardKey) {
      //           for (let key in item) {
      //             if (
      //               socketObj.data[key] &&
      //               key !== 'content' &&
      //               key !== 'type'
      //             ) {
      //               if (typeof item[key] === 'number') {
      //                 item[key] = parseFloat(socketObj.data[key]);
      //               } else if (typeof item[key] === 'boolean') {
      //                 item[key] = socketObj.data[key] ? true : false;
      //               } else {
      //                 item[key] = socketObj.data[key];
      //               }
      //             }
      //           }
      //         }
      //         return item;
      //       });
      //       return taskItem;
      //     }
      //   );
      //   dispatch(setNewTaskArray('workingTaskArray', newWorkingTaskArray));
      // } else if (headerIndex === 3 && newTaskArray) {
      //   newTaskArray = newTaskArray.map((taskItem: any, taskIndex: number) => {
      //     if (taskItem._key === socketObj.data.cardKey) {
      //       for (let key in taskItem) {
      //         if (socketObj.data[key] && key !== 'content' && key !== 'type') {
      //           if (typeof taskItem[key] === 'number') {
      //             taskItem[key] = parseInt(socketObj.data[key]);
      //           } else if (typeof taskItem[key] === 'boolean') {
      //             taskItem[key] = socketObj.data[key] ? true : false;
      //           } else {
      //             taskItem[key] = socketObj.data[key];
      //           }
      //         }
      //       }
      //     }
      //     return taskItem;
      //   });
      //   dispatch(setNewTaskArray('taskArray', newTaskArray));
      // }
    }
  }, [socketObj, unMessageNum, dispatch]);
  useEffect(() => {
    let title = "Workfly";
    switch (headerIndex) {
      case 0:
        history.push("/home/basic/content");
        break;
      case 1:
        history.push("/home/basic/workTable");
        break;
      case 2:
        history.push("/home/basic/workTable");
        if (targetUserInfo) {
          title = targetUserInfo.profile.nickName;
        }
        break;
      case 3:
        history.push("/home/basic/groupTable");
        if (groupInfo) {
          title = groupInfo.groupName;
        }
        break;
      case 5:
        history.push("/home/basic/calendar");
        break;
      case 6:
        history.push("/home/basic/company");
        break;
    }
    document.title = title;
  }, [headerIndex, targetUserInfo, groupInfo, history]);
  //清理redux数据

  return (
    <React.Fragment>
      <div
        style={{ width: "100%", height: "100%" }}
        ref={pageRef}
        className="basic"
      >
        <div
          className="basic-left"
          style={{
            width:
              moveState === "in"
                ? "0px"
                : deviceState === "xl" || deviceState === "xxl"
                ? "350px"
                : deviceState === "xs"
                ? "250px"
                : "300px",
          }}
        >
          <Home />
        </div>
        <div
          className="basic-right"
          style={
            moveState === "in"
              ? { width: "100%" }
              : // : headerIndex !== 3
                // ?
                {
                  width:
                    deviceState === "xl" || deviceState === "xxl"
                      ? "calc(100% - 350px)"
                      : deviceState === "xs"
                      ? "calc(100% - 250px)"
                      : "calc(100% - 300px)",
                }
            // : {}
          }
        >
          <Switch>
            <Route exact path="/home/basic/content" component={Content} />
            <Route
              exact
              path="/home/basic/workTable"
              component={WorkingTable}
            />
            <Route exact path="/home/basic/calendar" component={Calendar} />
            <Route exact path="/home/basic/groupTable" component={GroupTable} />
            <Route exact path="/home/basic/company" component={Company} />
          </Switch>
          <div
            className="home-openIcon"
            onClick={() => {
              dispatch(setMoveState(moveState === "in" ? "out" : "in"));
            }}
          >
            {moveState === "in" ? (
              <MenuUnfoldOutlined style={{ fontSize: "20px", color: "#fff" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "20px", color: "#fff" }} />
            )}
          </div>
        </div>
        <HeaderSet />
      </div>
    </React.Fragment>
  );
};
Basic.defaultProps = {};
export default Basic;
