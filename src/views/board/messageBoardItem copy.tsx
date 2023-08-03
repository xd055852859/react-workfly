import React from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { Button, Tooltip } from "antd";
import moment from "moment";
import api from "../../services/api";

import { setChooseKey, changeTaskInfoVisible } from "../../redux/actions/taskActions";
import {
    getGroup,
    setGroupKey,
} from "../../redux/actions/groupActions";
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
    messageItem: any,
    messageIndex: number,
    checkMsg: any,
    changeAddMessage: any,
    messageTypeArray: any
}
declare var window: Window 
const MessageBoardItem: React.FC<MessageBoardItemProps> = (props) => {
    const { messageItem, messageIndex, checkMsg, changeAddMessage, messageTypeArray } = props;
    const dispatch = useDispatch();
    const user = useTypedSelector((state) => state.auth.user);
    const messageType = messageItem.type
    const editRole =
        (messageType === 3 &&
            messageItem.executorKey !== user._key) ||
        (messageType === 5 &&
            messageItem.creatorKey !== user._key) ||
        (messageType === 5 && messageItem.finishConfirm) ||
        (messageType === 3 && messageItem.assignConfirm) ||
        (messageType !== 5 && messageType !== 3);
    const toTargetGroup = async (groupKey: string) => {
        dispatch(setGroupKey(groupKey));
        dispatch(setCommonHeaderIndex(3));
        await api.group.visitGroupOrFriend(2, groupKey);
        dispatch(getGroup(3, null, 2));
    };

    const getMessageContainer = (messageType) => {
        let dom = [];
        switch (messageType) {
            // case 2
        }
        return dom
    }
    const nameContainer =  
    <div className="messageBoard-item-name1"
    style={{
        margin: editRole
            ? "0px 0px 6px 0px"
            : "10px 0px 6px 0px",
        color: editRole ? "#333" : "#1890ff",
        width: editRole ? "100%" : "calc(100% - 55px)",
    }}
>
    {messageType !== 21
        ? messageItem.name1 +
        " " +
        messageItem.action
        : messageItem.content}
</div>
    return (
        <React.Fragment>
            {messageItem.name1 ? (
                <div className="messageBoard-item-item">
                    <div className="messageBoard-item-img">
                        <Tooltip
                            title={messageTypeArray[messageType - 1]?.title}
                        >
                            <img
                                src={messageTypeArray[messageType - 1]?.img}
                                alt=""
                            />
                        </Tooltip>
                    </div>
                    {messageItem.cardKey ?
                        <div
                            className="messageBoard-item-container"
                            onClick={() => {
                                dispatch(setChooseKey(messageItem.cardKey));
                                dispatch(changeTaskInfoVisible(true));
                                // setTaskInfoShow(true);
                            }}
                        >
                            <div>
                               
                                <div style={{ color: "#333", marginTop: "2px" }}>
                                    {moment(parseInt(messageItem.time)).fromNow()}
                                </div>
                            </div>
                            <div
                                className="messageBoard-item-time"
                                style={{
                                    marginBottom: "2px",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            overflow: "hidden",
                                            marginRight: "5px",
                                        }}
                                    >
                                        <Avatar
                                            avatar={
                                                messageItem?.groupLogo
                                            }
                                            name={messageItem?.groupName}
                                            type={"group"}
                                            index={0}
                                            size={20}
                                        />

                                    </div>
                                    <div className="toLong" style={{ width: "190px", cursor: 'pointer' }} onClick={(e) => {
                                        e.stopPropagation();
                                        toTargetGroup(messageItem.groupKey)
                                    }}>
                                        <span style={{ marginRight: "5px" }}>
                                            {messageItem.groupName}
                                        </span>
                                        /
                                        <span style={{ marginLeft: "5px" }}>
                                            {messageItem.labelName
                                                ? messageItem.labelName
                                                : "ToDo"}
                                        </span>
                                    </div>
                                </div>

                            </div>
                            {messageType !== 22 ?
                                <div className="messageBoard-item-time">
                                    <div>{messageItem.creatorName}</div>
                                    <img
                                        src={
                                            messageItem.finishConfirm &&
                                                messageType === 5
                                                ? messageHandSvg
                                                : messageunHandSvg
                                        }
                                        alt=""
                                        style={{
                                            width: "11px",
                                            height: "10px",
                                            marginLeft: "5px",
                                            marginRight: "5px",
                                            marginBottom: "3px",
                                        }}
                                    />
                                    <div>⇀</div>
                                    <div style={{ margin: "0px 5px" }}>
                                        {messageItem.executorName}
                                    </div>
                                    <img
                                        src={
                                            messageItem.assignConfirm &&
                                                messageType === 3
                                                ? messageHandSvg
                                                : messageunHandSvg
                                        }
                                        alt=""
                                        style={{
                                            width: "11px",
                                            height: "10px",
                                            marginBottom: "3px",
                                        }}
                                    />
                                    <img
                                        src={
                                            messageItem.finishPercent === 0
                                                ? messageunFinishSvg
                                                : messageFinishSvg
                                        }
                                        alt=""
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            marginLeft: "8px",
                                        }}
                                    />
                                    <div
                                        className="messageBoard-item-taskTime"
                                        style={{
                                            backgroundImage: "url(" + messageTimeSvg + ")",
                                        }}
                                    >
                                        <div className="messageBoard-item-day">
                                            {messageItem &&
                                                messageItem &&
                                                messageItem.taskEndDate
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
                                        <div className="messageBoard-item-hour" style={{
                                            right:
                                                (messageItem.hour + '').length > 2
                                                    ? '-1px'
                                                    : (messageItem.hour + '').length > 1
                                                        ? '10px'
                                                        : '8px',
                                        }}>
                                            {messageItem.hour}
                                        </div>
                                    </div>

                                    {messageItem.extraData &&
                                        messageItem.extraData.url ? (
                                        <img
                                            src={urlSvg}
                                            alt=""
                                            style={{
                                                height: "18px",
                                                width: "18px",
                                                cursor: "pointer",
                                                marginLeft: "8px",
                                            }}
                                            onClick={(e: any) => {
                                                window.open(messageItem.extraData.url);
                                                e.stopPropagation();
                                            }}
                                        />
                                    ) : null}
                                </div>
                                : null}
                            {messageType !== 21 ? (
                                <div className="messageBoard-item-task">
                                    <div>
                                        {messageType === 8
                                            ? messageItem.content
                                            : messageItem.title}
                                    </div>

                                    {/* <div
          className="taskItem-day"
          style={taskDayColor}                   
        >
          <div
            className="taskItem-time-day"
            style={{ left: endtime < 10 ? '5px' : '0px' }}
          >
            {endtime}
          </div>
          <div className="taskItem-time"></div>
          <div
            className="taskItem-time-hour"
            style={{
              right: taskDetail.hour < 1 ? '5px' : '0px',
            }}
          >
            {taskDetail.hour}
          </div>
        </div> */}
                                </div>
                            ) : null}
                            {(messageType === 3 &&
                                !messageItem.assignConfirm &&
                                messageItem.executorKey === user._key) ||
                                (messageType === 5 &&
                                    !messageItem.finishConfirm &&
                                    messageItem.creatorKey === user._key) ? (
                                <div
                                    style={{
                                        animation:
                                            messageItem.applyStatus === 1
                                                ? "changeSmall 500ms"
                                                : "",
                                        animationFillMode:
                                            messageItem.applyStatus === 1
                                                ? "forwards"
                                                : "",
                                    }}
                                    className="messageBoard-item-task-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        checkMsg(messageItem._key, messageIndex);
                                    }}
                                >
                                    <img
                                        src={messageButtonSvg}
                                        alt=""
                                        style={{ width: "12px", height: "13px" }}
                                    />
                                    <div style={{ marginLeft: "5px" }}>确认</div>
                                </div>
                            ) : null}
                        </div>
                        : <div
                            className="messageBoard-item-container"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    width: "75%",
                                }}
                            >
                                <div className="messageBoard-item-name1">
                                    {messageItem.name1 + " "}
                                    {messageItem.action}
                                </div>
                                {messageItem.name2 ? (
                                    <div className="messageBoard-item-name2">
                                        {messageItem.name2}
                                    </div>
                                ) : null}
                                {messageItem.commentContent ? (
                                    <div className="messageBoard-item-commentContent">
                                        {messageItem.commentContent}
                                    </div>
                                ) : null}
                                {messageType === 11 ? (
                                    <div className="messageBoard-item-button">
                                        {messageItem.applyStatus === 0 ? (
                                            <React.Fragment>
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        changeAddMessage(
                                                            messageItem,
                                                            1,
                                                            messageIndex
                                                        );
                                                    }}
                                                    style={{ color: "#fff", marginRight: "5px" }}
                                                >
                                                    同意
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        changeAddMessage(
                                                            messageItem,
                                                            2,
                                                            messageIndex
                                                        );
                                                    }}
                                                >
                                                    拒绝
                                                </Button>
                                            </React.Fragment>
                                        ) : (
                                            <Button disabled>
                                                {messageItem.applyStatus === 2
                                                    ? "已拒绝"
                                                    : "已同意"}
                                            </Button>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div
                                className="messageBoard-item-time"
                                style={{
                                    height: "22px",
                                }}
                            >
                                {moment(parseInt(messageItem.time)).fromNow()}
                            </div>
                        </div>

                    }
                </div>
            ) : null}
        </React.Fragment>
    );
};
MessageBoardItem.defaultProps = {
};
export default MessageBoardItem;