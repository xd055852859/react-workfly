import React from "react";
import "./messageBoardItem.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Button, Tooltip } from "antd";
import moment from "moment";
import api from "../../services/api";

import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";
import { getGroup, setGroupKey } from "../../redux/actions/groupActions";
import { setCommonHeaderIndex } from "../../redux/actions/commonActions";

import Avatar from "../../components/common/avatar";

import messageunFinishSvg from "../../assets/svg/messageunFinish.svg";
import messageFinishSvg from "../../assets/svg/messageFinish.svg";
import messageButtonSvg from "../../assets/svg/messageButton.svg";
import messageTimeSvg from "../../assets/svg/messageTime.svg";
import messageHandSvg from "../../assets/svg/messageHand.svg";
import messageunHandSvg from "../../assets/svg/messageunHand.svg";
import urlSvg from "../../assets/svg/url.svg";
interface MessageBoardItemProps {
  messageItem: any;
  messageIndex: number;
  checkMsg: any;
  changeAddMessage: any;
  messageTypeArray: any;
  messageKey: string;
}
declare var window: Window 
const MessageBoardItem: React.FC<MessageBoardItemProps> = (props) => {
  const {
    messageItem,
    messageKey,
    messageIndex,
    checkMsg,
    changeAddMessage,
    messageTypeArray,
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const messageType = messageItem.type;
  // const editRole =
  //     (messageType === 3 &&
  //         messageItem.executorKey !== user._key) ||
  //     (messageType === 5 &&
  //         messageItem.creatorKey !== user._key) ||
  //     (messageType === 5 && messageItem.finishConfirm) ||
  //     (messageType === 3 && messageItem.assignConfirm) ||
  //     (messageType !== 5 && messageType !== 3);
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setCommonHeaderIndex(3));
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3, null, 2));
  };
  const headerContainer = (
    <div className="messageBoard-item-header">
      <div className="messageBoard-item-name toLong">
        {`${
          messageItem.type !== 22 ? messageItem.name1 : user.profile.nickName
        } ${messageItem.action}`}
      </div>
      <div
        className="messageBoard-item-time"
        style={{ width: "60px", justifyContent: "flex-end" }}
      >
        {moment(
          moment().valueOf() - parseInt(messageItem.time) > 0
            ? parseInt(messageItem.time)
            : moment().valueOf() - 3000
        ).fromNow()}
      </div>
    </div>
  );
  const footerContainer = (
    <React.Fragment>
      {(messageType === 3 &&
        !messageItem.assignConfirm &&
        messageItem.executorKey === user._key) ||
      (messageType === 5 &&
        !messageItem.finishConfirm &&
        messageItem.creatorKey === user._key) ||
      messageType === 11 ? (
        <div className="messageBoard-item-footer">
          {messageType === 11 ? (
            <div className="messageBoard-item-button">
              {messageItem.applyStatus === 0 ? (
                <React.Fragment>
                  <Button
                    type="primary"
                    style={{ color: "#fff", marginRight: "5px" }}
                    onClick={() => {
                      changeAddMessage(messageItem, 1, messageIndex);
                    }}
                  >
                    同意
                  </Button>
                  <Button
                    onClick={() => {
                      changeAddMessage(messageItem, 2, messageIndex);
                    }}
                  >
                    拒绝
                  </Button>
                </React.Fragment>
              ) : (
                <Button disabled>
                  {messageItem.applyStatus === 2 ? "已拒绝" : "已同意"}
                </Button>
              )}
            </div>
          ) : (
            <div
              className="messageBoard-item-task-button"
              onClick={(e) => {
                e.stopPropagation();
                checkMsg(messageKey, messageIndex);
              }}
            >
              <img
                src={messageButtonSvg}
                alt=""
                style={{ width: "12px", height: "13px" }}
              />
              <div style={{ marginLeft: "5px" }}>确认</div>
            </div>
          )}
        </div>
      ) : null}
    </React.Fragment>
  );
  const taskContainer = (
    <div className="messageBoard-item-task">
      <div className="messageBoard-item-taskTime">
        <Avatar
          avatar={messageItem?.groupLogo}
          name={messageItem?.groupName}
          type={"group"}
          index={0}
          size={20}
        />
        <div
          className="toLong messageBoard-item-taskGroup"
          onClick={(e) => {
            e.stopPropagation();
            toTargetGroup(messageItem.groupKey);
          }}
        >
          {`${messageItem.groupName} 
                / ${messageItem.labelName ? messageItem.labelName : "ToDo"}`}
        </div>
      </div>
      <div className="messageBoard-item-taskTitle">
        <img
          src={
            messageItem.finishPercent === 0
              ? messageunFinishSvg
              : messageFinishSvg
          }
          alt=""
          className="messageBoard-item-taskButton"
        />
        <div
          className="messageBoard-item-tasksubTime"
          style={{
            backgroundImage: "url(" + messageTimeSvg + ")",
          }}
        >
          <div className="messageBoard-item-day">
            {messageItem?.taskEndDate
              ? moment(messageItem.taskEndDate)
                  .endOf("day")
                  .diff(moment().endOf("day"), "days") < 0 &&
                !isNaN(
                  Math.abs(
                    moment(messageItem.taskEndDate)
                      .endOf("day")
                      .diff(moment().endOf("day"), "days")
                  )
                )
                ? Math.abs(
                    moment(messageItem.taskEndDate)
                      .endOf("day")
                      .diff(moment().endOf("day"), "days")
                  )
                : Math.abs(
                    moment(messageItem.taskEndDate)
                      .endOf("day")
                      .diff(moment().endOf("day"), "days")
                  ) + 1
              : ""}
          </div>
          <div
            className="messageBoard-item-hour"
            style={{
              right:
                (messageItem.hour + "").length > 2
                  ? "-1px"
                  : (messageItem.hour + "").length > 1
                  ? "10px"
                  : "8px",
            }}
          >
            {messageItem.hour}
          </div>
        </div>
        {messageItem?.creatorName ? messageItem.creatorName : ""}
        <img
          src={
            messageItem.finishConfirm && messageType === 5
              ? messageHandSvg
              : messageunHandSvg
          }
          className="messageBoard-item-taskButton"
          alt=""
        />

        {` ⇀ ${messageItem?.executorName ? messageItem.executorName : ""} `}
        <img
          src={
            messageItem.assignConfirm && messageType === 3
              ? messageHandSvg
              : messageunHandSvg
          }
          alt=""
          className="messageBoard-item-taskButton"
        />
        {messageItem?.extraData?.url ? (
          <img
            src={urlSvg}
            alt=""
            className="messageBoard-item-url"
            onClick={(e: any) => {
              (window as any).open(messageItem.extraData.url);
              e.stopPropagation();
            }}
          />
        ) : null}
      </div>
      <div className="messageBoard-item-taskContainer">
        {messageType === 8 ? messageItem.content : messageItem.title}
      </div>
    </div>
  );
  return (
    <div className="messageBoard-item-item">
      <div className="messageBoard-item-img">
        <Tooltip title={messageTypeArray[messageType]?.title}>
          <img src={messageTypeArray[messageType]?.img} alt="" />
        </Tooltip>
      </div>
      <div
        className="messageBoard-item-container"
        onClick={() => {
          if (messageItem.cardKey && messageItem.type !== 22) {
            dispatch(setChooseKey(messageItem.cardKey));
            dispatch(changeTaskInfoVisible(true));
          }
        }}
      >
        {headerContainer}
        {messageItem.cardKey && messageItem.type !== 22 ? (
          taskContainer
        ) : (
          <React.Fragment>
            <div className="messageBoard-item-name1">
              {(messageItem.type !== 22
                ? messageItem.name1
                : user.profile.nickName) + " "}
              {messageItem.content}
            </div>
            {messageItem.name2 ? (
              <div className="messageBoard-item-name2">{messageItem.name2}</div>
            ) : null}
            {messageItem.commentContent ? (
              <div className="messageBoard-item-commentContent">
                {messageItem.commentContent}
              </div>
            ) : null}
          </React.Fragment>
        )}
        {messageType === 11 || messageType === 3 || messageType === 5
          ? footerContainer
          : null}
      </div>
    </div>
  );
};
MessageBoardItem.defaultProps = {};
export default MessageBoardItem;
