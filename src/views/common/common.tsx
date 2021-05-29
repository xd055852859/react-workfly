import React, { useState, useEffect, useRef } from "react";
import { Drawer } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { changeMusic } from "../../redux/actions/authActions";
import {
  changeTimeSetVisible,
  changeTaskMemberVisible,
} from "../../redux/actions/commonActions";
import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";

import TimeSet from "../../components/common/timeSet";
import TaskMember from "../../components/task/taskMember";
import TaskInfo from "../../components/taskInfo/taskInfo";

interface CommonProps {
  clientHeight: number;
  clientWidth: number;
}

const Common: React.FC<CommonProps> = (props) => {
  const { clientHeight, clientWidth } = props;
  const dispatch = useDispatch();
  const musicNum = useTypedSelector((state) => state.auth.musicNum);
  const theme = useTypedSelector((state) => state.auth.theme);

  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const timeSetVisible = useTypedSelector(
    (state) => state.common.timeSetVisible
  );
  const taskMemberVisible = useTypedSelector(
    (state) => state.common.taskMemberVisible
  );
  const timeSetX = useTypedSelector((state) => state.common.timeSetX);
  const timeSetY = useTypedSelector((state) => state.common.timeSetY);
  const taskMemberX = useTypedSelector((state) => state.common.taskMemberX);
  const taskMemberY = useTypedSelector((state) => state.common.taskMemberY);
  const socketObj = useTypedSelector((state) => state.common.socketObj);

  const [timesetObj, setTimesetObj] = useState<any>(null);
  const [taskMemberObj, setTaskMemberObj] = useState<any>(null);
  const childRef = useRef<any>();
  const musicRef: React.RefObject<any> = useRef();
  //完成任务,签收消息,未完成任务,归档任务,创建任务,启动音乐

  useEffect(() => {
    if (musicNum) {
      const musicArray = [
        "https://cdn-icare.qingtime.cn/1605433190681_workingVip",
        "https://cdn-icare.qingtime.cn/1605432111005_workingVip",
        "https://cdn-icare.qingtime.cn/1606524071707_workingVip",
        "https://cdn-icare.qingtime.cn/1605495620233_workingVip",
        "https://cdn-icare.qingtime.cn/1607480783765_workingVip",
        "https://cdn-icare.qingtime.cn/EB137B51.mp3",
      ];
      musicRef.current.src = musicArray[musicNum - 1];
      musicRef.current.play();
      dispatch(changeMusic(0));
    }
  }, [musicNum, dispatch]);

  useEffect(() => {
    if (timeSetVisible) {
      let obj: any = {};
      if (clientHeight - timeSetY > 205) {
        obj.top = timeSetY + 10;
      } else {
        obj.bottom = clientHeight - timeSetY;
      }
      if (clientWidth - timeSetX > 274) {
        obj.left = timeSetX;
      } else {
        obj.right = clientWidth - timeSetX;
      }
      obj.display = "block";
      if (!theme.hourVisible) {
        obj.height = "160px";
      }
      setTimesetObj(obj);
    }
  }, [
    timeSetX,
    timeSetY,
    timeSetVisible,
    theme?.hourVisible,
    clientWidth,
    clientHeight,
  ]);
  useEffect(() => {
    let obj: any = {};
    if (taskMemberVisible) {
      if (clientHeight * 0.5 > taskMemberY) {
        obj.top = taskMemberY + 10;
      } else {
        obj.bottom = clientHeight - taskMemberY - 20;
      }
      if (clientWidth - taskMemberX > 260) {
        obj.left = taskMemberX - 130;
      } else {
        obj.right = clientWidth - taskMemberX - 110;
      }
      obj.display = "block";
      setTaskMemberObj(obj);
    }
  }, [taskMemberX, taskMemberY, taskMemberVisible, clientWidth, clientHeight]);
  useEffect(() => {
    if (socketObj && localStorage.getItem("soundVisible")) {
      let url =
        "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&text=" +
        socketObj.data.content;
      let n = new Audio(url);
      n.src = url;
      n.play();
    }
  }, [socketObj]);
  return (
    <React.Fragment>
      {taskInfoVisible ? (
        <Drawer
          visible={taskInfoVisible}
          onClose={() => {
            dispatch(changeTaskInfoVisible(false));
            dispatch(setChooseKey(""));
            localStorage.removeItem("shareKey");
            if (childRef?.current) {
              //@ts-ignore
              childRef.current.getInfo();
            }
          }}
          title={"任务详情"}
          width={430}
          bodyStyle={{
            padding: "10px 15px",
            boxSizing: "border-box",
          }}
          headerStyle={{
            display: "none",
          }}
          destroyOnClose={true}
          push={false}
        >
          <TaskInfo ref={childRef} />
        </Drawer>
      ) : null}
      <audio
        ref={musicRef}
        src=""
        // muted
        // controls
        style={{ position: "fixed", zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      {timeSetVisible && timeSetX && timeSetY ? (
        <div
          className="timeSet-container"
          style={timesetObj}
          onMouseLeave={() => {
            dispatch(changeTimeSetVisible(false, 0, 0));
          }}
        >
          <TimeSet type="new" />
        </div>
      ) : null}
      {taskMemberVisible && taskMemberX && taskMemberY ? (
        <div
          className="taskMember-container"
          style={taskMemberObj}
          onMouseLeave={() => {
            dispatch(changeTaskMemberVisible(false, 0, 0));
          }}
        >
          <TaskMember />
        </div>
      ) : null}
    </React.Fragment>
  );
};
Common.defaultProps = {};
export default Common;
