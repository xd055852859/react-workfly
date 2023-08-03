import React, { useState, useEffect, useRef, useCallback } from "react";
import "./common.css";
import { Drawer, Modal, notification } from "antd";

import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { changeMusic } from "../../redux/actions/authActions";
import {
  changeTimeSetVisible,
  changeTaskMemberVisible,
  changeTaskCustomVisible,
  setInviteKey,
  setMessage,
  changeAnimateState,
  changeContentVisible,
} from "../../redux/actions/commonActions";
import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";
import api from "../../services/api";
import { is_mobile } from "../../services/util";

import ClickOutSide from "../../components/common/clickOutside";
import TimeSet from "../../components/common/timeSet";
import TaskMember from "../../components/task/taskMember";
import TaskInfo from "../../components/taskInfo/taskInfo";
import Invite from "../invite/invite";
import FireAnimate from "../../components/common/fireAnimate";
import ContentModal from "../content/contentModal";
import { useAuth } from "../../context/auth";
import TaskCustom from "../../components/task/taskCustom";
declare var window: Window;
//叮咚：你指派的任务已完成，请注意查收
const finishTaskMusic = require("../../assets/mp3/叮咚：你指派的任务已完成，请注意查收.mp3");
const newTaskMusic = require("../../assets/mp3/叮咚：你有新的任务，请注意查收.mp3");
const packTaskMusic = require("../../assets/mp3/签收或归档.mp3");
const createTaskMusic = require("../../assets/mp3/参与任务提醒.mp3");
const endTaskMusic = require("../../assets/mp3/任务完成.mp3");
const clickMusic = require("../../assets/mp3/主按钮点击.mp3");
const startMusic = require("../../assets/mp3/readygo.mp3");
const endMusic = require("../../assets/mp3/下班打卡.mp3");
const mouseMusic = require("../../assets/mp3/鼠标路过.mp3");
const unFinishTaskMusic = require("../../assets/mp3/叮咚：你的任务被取消，请注意查看.mp3");
const careTaskMusic = require("../../assets/mp3/叮咚：你被设为关注者，请注意查收.mp3");
// const unTaskMusic = require('../../assets/mp3/挑战失败.mp3')
//addMember
const checkTaskMusic = require("../../assets/mp3/叮咚您的任务已被确认请注意查看.mp3");
// const checkTaskMusic = require('../../assets/mp3/叮咚 您的任务已被签收请注意查看.mp3')
const auditTaskMusic = require("../../assets/mp3/叮咚：你有新的审批，请注意查收.mp3");
const checkAuditTaskMusic = require("../../assets/mp3/叮咚：你审批已确认，请注意查收.mp3");

interface CommonProps {
  clientHeight: number;
  clientWidth: number;
}

const Common: React.FC<CommonProps> = (props) => {
  const { clientHeight, clientWidth } = props;
  const dispatch = useDispatch();
  const { todayState } = useAuth();
  const musicNum = useTypedSelector((state) => state.auth.musicNum);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const user = useTypedSelector((state) => state.auth.user);
  const token = useTypedSelector((state) => state.auth.token);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const timeSetVisible = useTypedSelector(
    (state) => state.common.timeSetVisible
  );
  const taskMemberVisible = useTypedSelector(
    (state) => state.common.taskMemberVisible
  );
  const taskCustomVisible = useTypedSelector(
    (state) => state.common.taskCustomVisible
  );
  const animateState = useTypedSelector((state) => state.common.animateState);
  const contentVisible = useTypedSelector(
    (state) => state.common.contentVisible
  );
  const timeSetX = useTypedSelector((state) => state.common.timeSetX);
  const timeSetY = useTypedSelector((state) => state.common.timeSetY);
  const taskMemberX = useTypedSelector((state) => state.common.taskMemberX);
  const taskMemberY = useTypedSelector((state) => state.common.taskMemberY);
  const taskCustomX = useTypedSelector((state) => state.common.taskCustomX);
  const taskCustomY = useTypedSelector((state) => state.common.taskCustomY);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const inviteKey = useTypedSelector((state) => state.common.inviteKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [timesetObj, setTimesetObj] = useState<any>(null);
  const [taskMemberObj, setTaskMemberObj] = useState<any>(null);
  const [taskCustomObj, setTaskCustomObj] = useState<any>(null);
  const childRef = useRef<any>();
  const musicRef: React.RefObject<any> = useRef();
  let timer = useRef<any>(null);
  useEffect(() => {
    if (animateState) {
      timer.current = setTimeout(() => {
        dispatch(changeAnimateState(false));
      }, 4000);
    }
  }, [animateState, dispatch]);
  //完成任务,签收消息,未完成任务,归档任务,创建任务,启动音乐

  useEffect(() => {
    if (musicNum) {
      const musicArray = [
        //完成任务
        // "https://cdn-icare.qingtime.cn/1605433190681_workingVip",
        endTaskMusic.default,
        //签收任务
        "https://cdn-icare.qingtime.cn/1605432111005_workingVip",
        //取消任务
        "https://cdn-icare.qingtime.cn/1606524071707_workingVip",
        // unTaskMusic.default,
        //归档任务
        "https://cdn-icare.qingtime.cn/1605495620233_workingVip",
        //新增任务
        // "https://cdn-icare.qingtime.cn/1607480783765_workingVip",
        createTaskMusic.default,
        //登录
        "https://cdn-icare.qingtime.cn/EB137B51.mp3",
        //通知新任务
        "https://cdn-icare.qingtime.cn/1622773119200_workingVip",
        newTaskMusic.default,
        finishTaskMusic.default,
        packTaskMusic.default,
        clickMusic.default,
        startMusic.default,
        endMusic.default,
        mouseMusic.default,
        unFinishTaskMusic.default,
        careTaskMusic.default,
        checkTaskMusic.default,
        auditTaskMusic.default,
        checkAuditTaskMusic.default,
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
        obj.minHeight = "160px";
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
    let obj: any = {};
    if (taskCustomVisible) {
      if (clientHeight * 0.5 > taskCustomY) {
        obj.top = taskCustomY + 10;
      } else {
        obj.bottom = clientHeight - taskCustomY - 20;
      }
      if (clientWidth - taskCustomX > 260) {
        obj.left = taskCustomX - 130;
      } else {
        obj.right = clientWidth - taskCustomX - 110;
      }
      obj.display = "block";
      setTaskCustomObj(obj);
    }
  }, [taskCustomX, taskCustomY, taskCustomVisible, clientWidth, clientHeight]);
  const checkMsg = useCallback(
    async (key: string) => {
      let messageRes: any = await api.auth.sendReceipt(key);
      if (messageRes.msg === "OK") {
        dispatch(setMessage(true, "确认任务成功", "success"));
      } else {
        dispatch(setMessage(true, messageRes.msg, "error"));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (socketObj) {
      if (
        ((socketObj.data.type === "3" || socketObj.data.type === "5") &&
          (socketObj.data.creatorKey === userKey ||
            socketObj.data.executorKey === userKey)) ||
        socketObj.data.type === "22" ||
        socketObj.data.type === "9"
      ) {
        const socketTitle =
          socketObj.data.type === "22"
            ? "日程提醒"
            : socketObj.data.type === "3"
            ? "指派任务确认"
            : socketObj.data.type === "9"
            ? "加入群组"
            : "完成任务确认";

        notification.open({
          message: socketTitle,
          description:
            socketObj.data.type === "22"
              ? socketObj.data.action + " : " + socketObj.data.content
              : socketObj.data.content,
          onClick: () => {
            if (socketObj.data.type === "3" || socketObj.data.type === "5") {
              dispatch(changeTaskInfoVisible(true));
              dispatch(setChooseKey(socketObj.data.cardKey));
              checkMsg(socketObj.data.noticeKey);
            }
            notification.close(socketTitle + socketObj.data.cardKey);
          },
          onClose: () => {
            if (socketObj.data.type === "3" || socketObj.data.type === "5") {
              checkMsg(socketObj.data.noticeKey);
            }
          },
          key: socketTitle + socketObj.data.cardKey,
          duration: null,
        });
        // if (localStorage.getItem("soundVisible")) {

        // let url =
        //   "https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=4&tex=" +
        //   socketObj.data.content;
        // let n = new Audio(url);
        // n.src = url;
        // n.play();
        // }
      }
      if (socketObj.data.type === "3") {
        dispatch(changeMusic(8));
      }
      if (
        socketObj.data.type === "5" &&
        socketObj.data.creatorKey === userKey
      ) {
        dispatch(changeMusic(9));
      }
      if (socketObj.data.type === "12" || socketObj.data.type === "13") {
        dispatch(changeMusic(17));
      }
      if (
        socketObj.data.type === "15" &&
        (socketObj.data.creatorKey === userKey ||
          socketObj.data.executorKey === userKey)
      ) {
        dispatch(changeMusic(15));
      }
      if (socketObj.data.type === "26") {
        dispatch(changeMusic(16));
      }
      if (socketObj.data.type === "28") {
        dispatch(changeMusic(18));
      }
      if (socketObj.data.type === "29" || socketObj.data.type === "30") {
        dispatch(changeMusic(19));
      }
    }
  }, [socketObj, dispatch, checkMsg, userKey]);
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
          width={
            is_mobile()
              ? "100%"
              : window?.frames?.length !== window?.parent?.frames?.length
              ? 380
              : 430
          }
          bodyStyle={{
            padding: "10px 8px",
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
        <ClickOutSide
          onClickOutside={() => {
            dispatch(changeTimeSetVisible(false, 0, 0));
          }}
        >
          <div
            className="timeSet-container"
            style={timesetObj}
            // onMouseLeave={() => {
            //   dispatch(changeTimeSetVisible(false, 0, 0));
            // }}
          >
            <TimeSet type="new" />
          </div>
        </ClickOutSide>
      ) : null}
      {taskMemberVisible && taskMemberX && taskMemberY ? (
        <ClickOutSide
          onClickOutside={() => {
            dispatch(changeTaskMemberVisible(false, 0, 0));
          }}
        >
          <div
            className="taskMember-container"
            style={taskMemberObj}
            // onMouseLeave={(e) => {
            //   e.stopPropagation();
            //   dispatch(changeTaskMemberVisible(false, 0, 0));
            // }}
          >
            <TaskMember />
          </div>
        </ClickOutSide>
      ) : null}
      {taskCustomVisible && taskCustomX && taskCustomY ? (
        <ClickOutSide
          onClickOutside={() => {
            dispatch(changeTaskCustomVisible(false, 0, 0));
          }}
        >
          <div
            className="taskMember-container"
            style={taskCustomObj}
            // onMouseLeave={(e) => {
            //   e.stopPropagation();
            //   dispatch(changeTaskMemberVisible(false, 0, 0));
            // }}
          >
            <TaskCustom targetGroupKey={groupKey} />
          </div>
        </ClickOutSide>
      ) : null}
      {animateState ? <FireAnimate /> : null}
      {contentVisible && user && todayState ? (
        <ClickOutSide
          onClickOutside={() => {
            dispatch(changeContentVisible(false));
          }}
        >
          <ContentModal />
        </ClickOutSide>
      ) : null}
      <Modal
        title="加入项目"
        visible={inviteKey && token ? true : false}
        footer={null}
        onCancel={() => {
          dispatch(setInviteKey(""));
        }}
      >
        <Invite
          groupKey={inviteKey}
          onClose={() => {
            dispatch(setInviteKey(""));
          }}
        />
      </Modal>
    </React.Fragment>
  );
};
Common.defaultProps = {};
export default Common;
