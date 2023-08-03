import React, { useEffect, useRef } from "react";
import "./basic.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useHistory, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loadable from "react-loadable";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import _ from "lodash";

import {
  setUnMessageNum,
  setSocketObj,
  setMoveState,
} from "../../redux/actions/commonActions";
import { setNewTaskArray } from "../../redux/actions/taskActions";

// import faceSvg from "../../assets/svg/face.svg";
// import closeSvg from "../../assets/svg/close.svg";
import HeaderSet from "../../components/headerSet/headerSet";
import Home from "../home/home";
import { useMount } from "../../hook/common";
import { is_mobile } from "../../services/util";

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
  // loader: () => import("../calendar/newCalendar"),
  loading: () => null,
});
const Company = Loadable({
  loader: () => import("../companyBasic/company"),
  loading: () => null,
});
const FileBasic = Loadable({
  loader: () => import("./fileBasic"),
  loading: () => null,
});
const File = Loadable({
  loader: () => import("../file/file"),
  loading: () => null,
});
const Okr = Loadable({
  loader: () => import("../okr/okr"),
  loading: () => null,
});
const Basic: React.FC<BasicProps> = () => {
  const { deviceState } = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useTypedSelector((state) => state.auth.socket);
  // const token = useTypedSelector((state) => state.auth.token);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const colorState = useTypedSelector((state) => state.common.colorState);
  // const [chatVisible, setChatVisible] = useState<boolean>(false);
  const pageRef: React.RefObject<any> = useRef();
  useMount(() => {
    if (is_mobile() || deviceState === "xxs") {
      history.push("/home/phoneHome");
    }
  });
  useEffect(() => {
    if (socket) {
      socket.on("notice", (data: any) => {
        let taskData = JSON.parse(data);
        dispatch(setSocketObj({ data: taskData }));
      });
      socket.on("close", (data: any) => {
        console.log("关闭");
      });
      socket.on("error", (data: any) => {
        console.log("错误");
      });
    }
  }, [socket, dispatch]);
  useEffect(() => {
    if (socketObj) {
      let newUnMessageNum = unMessageNum;
      let newSelfTaskArray = _.cloneDeep(selfTaskArray);
      let newWorkingTaskArray = _.cloneDeep(workingTaskArray);
      let newTaskArray = _.cloneDeep(taskArray);
      dispatch(setUnMessageNum(newUnMessageNum + 1));

      if (headerIndex === 0 && newSelfTaskArray) {
        newSelfTaskArray = newSelfTaskArray.map((taskItem: any) => {
          if (taskItem._key === socketObj.data.cardKey) {
            for (let key in taskItem) {
              if (socketObj.data[key] && key !== "content" && key !== "type") {
                if (typeof taskItem[key] === "number") {
                  taskItem[key] = parseInt(socketObj.data[key]);
                } else if (typeof taskItem[key] === "boolean") {
                  taskItem[key] = socketObj.data[key] ? true : false;
                } else {
                  taskItem[key] = socketObj.data[key];
                }
              }
            }
          }
          return taskItem;
        });
        dispatch(setNewTaskArray("selfTaskArray", newSelfTaskArray));
      } else if (
        (headerIndex === 1 || headerIndex === 2) &&
        newWorkingTaskArray
      ) {
        newWorkingTaskArray = newWorkingTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            taskItem = taskItem.map((item: any, index: number) => {
              if (item._key === socketObj.data.cardKey) {
                for (let key in item) {
                  if (
                    socketObj.data[key] &&
                    key !== "content" &&
                    key !== "type"
                  ) {
                    if (typeof item[key] === "number") {
                      item[key] = parseFloat(socketObj.data[key]);
                    } else if (typeof item[key] === "boolean") {
                      item[key] = socketObj.data[key] ? true : false;
                    } else {
                      item[key] = socketObj.data[key];
                    }
                  }
                }
              }
              return item;
            });
            return taskItem;
          }
        );
        dispatch(setNewTaskArray("workingTaskArray", newWorkingTaskArray));
      } else if (headerIndex === 3 && newTaskArray) {
        newTaskArray = newTaskArray.map((taskItem: any, taskIndex: number) => {
          if (taskItem._key === socketObj.data.cardKey) {
            for (let key in taskItem) {
              if (socketObj.data[key] && key !== "content" && key !== "type") {
                if (typeof taskItem[key] === "number") {
                  taskItem[key] = parseInt(socketObj.data[key]);
                } else if (typeof taskItem[key] === "boolean") {
                  taskItem[key] = socketObj.data[key] ? true : false;
                } else {
                  taskItem[key] = socketObj.data[key];
                }
              }
            }
          }
          return taskItem;
        });
        dispatch(setNewTaskArray("taskArray", newTaskArray));
      }
      dispatch(setSocketObj(null));
    }
    //eslint-disable-next-line
  }, [socketObj, unMessageNum, dispatch]);
  useEffect(() => {
    let title = "Workfly";
    if (is_mobile() || deviceState === "xxs") {
      history.push("/home/phoneHome");
    } else {
      switch (headerIndex) {
        case 0:
          history.push("/home/basic/content");
          break;
        case 1:
          history.push("/home/basic/workTable");
          break;
        case 2:
          history.push("/home/basic/workTable");
          if (targetUserInfo?.profile) {
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
        case 7:
          history.push("/home/basic/file");
          break;
        case 8:
          history.push("/home/basic/okr");
          dispatch(setMoveState("in"));
          break;
      }
      document.title = title;
    }
  }, [headerIndex, targetUserInfo, groupInfo, history, deviceState,dispatch]);
  //清理redux数据
  return (
    <React.Fragment>
      <div
        style={{ width: "100%", height: "100vh" }}
        ref={pageRef}
        className="basic"
      >
        <div
          className="basic-left"
          style={{
            width:
              moveState === "in"
                ? "0px"
                : // deviceState === "xl" || deviceState === "xxl"?
                  "320px",
            // : deviceState === "xs"
            //   ? "250px"
            //   : "300px",
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
                    // deviceState === "xl" || deviceState === "xxl"
                    //   ?
                    "calc(100% - 320px)",
                  // : deviceState === "xs"
                  //   ? "calc(100% - 250px)"
                  //   : "calc(100% - 300px)",
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
            <Route exact path="/home/basic/fileBasic" component={FileBasic} />
            <Route exact path="/home/basic/okr" component={Okr} />
            <Route exact path="/home/basic/file" component={File} />
          </Switch>
          <div
            className="home-openIcon"
            onClick={() => {
              dispatch(setMoveState(moveState === "in" ? "out" : "in"));
            }}
            // style={colorState ? { animation: "colorChange 1500ms" } : {}}
          >
            {moveState === "in" ? (
              <RightOutlined style={{ fontSize: "20px", color: "#fff" }} />
            ) : !colorState ? (
              <LeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
            ) : null}
          </div>
        </div>
        <HeaderSet />
        {/* <div className="chat-button">
          <img
            src={faceSvg}
            alt=""
            onClick={() => {
              setChatVisible(true);
            }}
            style={{ width: "40px", height: "40px" }}
          />
        </div>
        {token ? (
          <div
            v-show="chatVisible"
            className="chat-container"
            style={
              chatVisible
                ? { width: "400px", height: "520px" }
                : { visibility: "hidden" }
            }
          >
            <iframe
              title=" "
              src={`https://agent.workfly.cn/?token=${token}&groupKey=2283983677&treeKey=2165231388&type=workfly`}
              frameBorder={0}
            ></iframe>
            <img
              src={closeSvg}
              alt=""
              className="chat-closeButton"
              onClick={() => {
                setChatVisible(false);
              }}
            />
          </div>
        ) : null} */}
      </div>
    </React.Fragment>
  );
};
Basic.defaultProps = {};
export default Basic;
