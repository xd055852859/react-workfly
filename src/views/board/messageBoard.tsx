import React, { useState, useEffect, useRef, useCallback } from "react";
import "./messageBoard.css";
import { useDispatch } from "react-redux";
import { Button, Checkbox, Modal, Tooltip, Dropdown } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import _ from "lodash";
import moment from "moment";
import { useTypedSelector } from "../../redux/reducer/RootState";
import api from "../../services/api";

import {
  setChooseKey,
  changeTaskInfoVisible,
} from "../../redux/actions/taskActions";
import { setMessage, setSocketObj } from "../../redux/actions/commonActions";
import { changeMusic } from "../../redux/actions/authActions";

import Loading from "../../components/common/loading";
import IconFont from "../../components/common/iconFont";

import messageType2Png from "../../assets/img/messageType2.png";
import messageType3Png from "../../assets/img/messageType3.png";
import messageType4Png from "../../assets/img/messageType4.png";
import messageType5Png from "../../assets/img/messageType5.png";
import messageType6Png from "../../assets/img/messageType6.png";
import messageType7Png from "../../assets/img/messageType7.png";
import messageType8Png from "../../assets/img/messageType8.png";
import messageType9Png from "../../assets/img/messageType9.png";
import messageType10Png from "../../assets/img/messageType10.png";
import messageType11Png from "../../assets/img/messageType11.png";
import messageType12Png from "../../assets/img/messageType12.png";
import messageType14Png from "../../assets/img/messageType14.png";
import messageType15Png from "../../assets/img/messageType15.png";
import messageType16Png from "../../assets/img/messageType16.png";
import messageType17Png from "../../assets/img/messageType17.png";
import messageType18Png from "../../assets/img/messageType18.png";
import messageType19Png from "../../assets/img/messageType19.png";
import messageType20Svg from "../../assets/svg/messageType20.svg";
import messageType21Svg from "../../assets/svg/messageType21.svg";
import messageType22Svg from "../../assets/svg/messageType22.svg";
import messageunFinishSvg from "../../assets/svg/messageunFinish.svg";
import messageFinishSvg from "../../assets/svg/messageFinish.svg";
import messageButtonSvg from "../../assets/svg/messageButton.svg";
import messageTimeSvg from "../../assets/svg/messageTime.svg";
import messageHandSvg from "../../assets/svg/messageHand.svg";
import messageunHandSvg from "../../assets/svg/messageunHand.svg";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import urlSvg from "../../assets/svg/url.svg";
import { useMount } from "../../hook/common";

interface MessageBoardProps {
  type?: string;
}

const MessageBoard: React.FC<MessageBoardProps> = (prop) => {
  const { type } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  // const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [messageNum, setMessageNum] = useState(0);
  const [messageArray, setMessageArray] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [messageCheck, setMessageCheck] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [filterType, setFilterType] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const messageTypeArray = [
    { type: 0, title: "全部", img: "", filter: true },
    { type: 2, title: "打卡", img: messageType2Png, filter: true },
    { type: 3, title: "指派", img: messageType3Png, filter: true },
    { type: 4, title: "内容", img: messageType4Png, filter: false },
    { type: 5, title: "完成", img: messageType5Png, filter: true },
    { type: 6, title: "删除", img: messageType6Png, filter: false },
    { type: 7, title: "归档", img: messageType7Png, filter: true },
    { type: 8, title: "评论", img: messageType8Png, filter: false },
    { type: 9, title: "权限", img: messageType9Png, filter: false },
    { type: 10, title: "退群", img: messageType10Png, filter: false },
    { type: 11, title: "申请加群", img: messageType11Png, filter: false },
    { type: 12, title: "确认指派", img: messageType12Png, filter: false },
    { type: 13, title: "确认完成", img: messageType12Png, filter: false },
    { type: 14, title: "调整日期", img: messageType14Png, filter: true },
    { type: 15, title: "取消完成", img: messageType15Png, filter: false },
    { type: 16, title: "修改工时", img: messageType16Png, filter: true },
    { type: 17, title: "取消归档", img: messageType17Png, filter: false },
    { type: 18, title: "修改类型", img: messageType18Png, filter: false },
    { type: 19, title: "加入群组", img: messageType19Png, filter: false },
    { type: 20, title: "批量归档", img: messageType20Svg, filter: false },
    { type: 21, title: "修改标题", img: messageType21Svg, filter: true },
    { type: 22, title: "预定日程", img: messageType22Svg, filter: false },
  ];
  let unDistory = useRef<any>(true);
  const messageRef: React.RefObject<any> = useRef();

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getMessage = useCallback(
    async (page: number, check: boolean, filterType: number) => {
      setLoading(true);
      let messageRes: any = await api.auth.getMessageList(
        page,
        20,
        filterType,
        check ? 2 : 1
      );
      if (unDistory.current) {
        if (messageRes.msg === "OK") {
          setLoading(false);
          setMessageArray((prevMessage) => {
            if (page === 1) {
              prevMessage = [];
            }
            prevMessage.push(...messageRes.result);
            return [...prevMessage];
          });
          setMessageTotal(messageRes.totalNumber);
          setMessageNum(messageRes.allNotDealNotice35);
        } else {
          setLoading(false);
          dispatch(setMessage(true, messageRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (user && user._key) {
      if (messagePage === 1) {
        getMessage(messagePage, messageCheck, filterType);
      }
    }
  }, [user, getMessage, messagePage, messageCheck, filterType]);

  useEffect(() => {
    if (socketObj) {
      let newMessageArray = _.cloneDeep(messageArray);
      let newSocketObj = _.cloneDeep(socketObj);
      let newMessageTotal = messageTotal;
      let newMessageNum = messageNum;
      newMessageArray.unshift(newSocketObj);
      newMessageArray[0]._key = newSocketObj.data.noticeKey;
      // if (newSocketObj.data.type == 3 || newSocketObj.data.type == 5) {
      dispatch(setSocketObj(null));
      setMessageNum(newMessageNum + 1);
      // }
      setMessageArray(newMessageArray);
      setMessageTotal(newMessageTotal + 1);
    }
  }, [socketObj, messageNum, messageTotal, messageArray, dispatch]);

  const scrollMessageLoading = async (e: any) => {
    let newPage = messagePage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop + 1 >= scrollHeight &&
      messageArray.length < messageTotal
    ) {
      newPage = newPage + 1;
      setMessagePage(newPage);
      getMessage(newPage, messageCheck, filterType);
    }
  };
  const changeAddMessage = async (
    item: any,
    applyStatus: number,
    index: number
  ) => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.group.changeAddMessage(
      item.userKey,
      item.groupKey,
      newMessageArray[index]._key,
      applyStatus,
      item.applyKey
    );
    if (messageRes.msg === "OK") {
      newMessageArray[index].data.applyStatus = applyStatus;
      setMessageArray(newMessageArray);
      setMessageTotal(messageRes.totalNumber);
    } else {
      setLoading(false);
      dispatch(setMessage(true, messageRes.msg, "error"));
    }
  };
  const checkMsg = async (key: string, index: number) => {
    let newMessageArray = _.cloneDeep(messageArray);
    let newMessageNum = messageNum;
    let messageRes: any = await api.auth.sendReceipt(key);
    if (messageRes.msg === "OK") {
      dispatch(setMessage(true, "签收成功", "success"));
      dispatch(changeMusic(2));
      if (newMessageArray[index].data.type === 3) {
        newMessageArray[index].data.assignConfirm = true;
      } else if (newMessageArray[index].data.type === 5) {
        newMessageArray[index].data.finishConfirm = true;
      }

      setMessageArray(newMessageArray);
      setMessageNum(newMessageNum - 1);
    } else {
      dispatch(setMessage(true, messageRes.msg, "error"));
    }
  };
  const checkAllMessage = async () => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.auth.batchSendReceipt();
    if (messageRes.msg === "OK") {
      dispatch(setMessage(true, "批量签收成功", "success"));
      newMessageArray = newMessageArray.map((item: any, index: number) => {
        if (item.data.type === 3) {
          item.data.assignConfirm = true;
        } else if (item.data.type === 5) {
          item.data.finishConfirm = true;
        }
        item.data.applyStatus = 1;
        return item;
      });
      setMessageNum(messageRes.result.failureNoticeKeyArray.length);
      setMessageArray(newMessageArray);
    } else {
      dispatch(setMessage(true, messageRes.msg, "error"));
    }
  };
  const clearMessage = async () => {
    let messageRes: any = await api.auth.clearMessage();
    if (messageRes.msg === "OK") {
      dispatch(setMessage(true, "清除消息成功", "success"));
      setMessageVisible(false);
      getMessage(1, messageCheck, filterType);
    } else {
      dispatch(setMessage(true, messageRes.msg, "error"));
    }
  };
  const downMenu = (
    <div
      className="dropDown-box messageBoard-filter-container"
      style={{ height: "236px" }}
    >
      {messageTypeArray.map((filterItem, filterIndex) => {
        return (
          <React.Fragment key={"filter" + filterIndex}>
            {filterItem.filter ? (
              <div
                onClick={() => {
                  setFilterType(filterItem.type);
                  setFilterIndex(filterIndex);
                  setMessagePage(1);
                }}
              >
                {filterItem.title}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
  return (
    <div
      className="messageBoard"
      style={{ width: type ? "100%" : "360px" }}
      ref={messageRef}
    >
      {loading ? <Loading loadingWidth="80px" loadingHeight="80px" /> : null}
      <div
        className="messageBoard-maintitle"
        style={
          !type ? { borderBottom: "1px solid rgba(216, 216, 216, 0.4)" } : {}
        }
      >
        <div>{!type ? "提醒" : null}</div>
        <div className="messageBoard-mainbutton">
          <Dropdown
            overlay={downMenu}
            getPopupContainer={() => messageRef.current}
            trigger={["click"]}
          >
            <div className="messageBoard-filter-title">
              <IconFont
                type="icon-guolv"
                style={{ fontSize: "25px", marginRight: "5px" }}
              />
              {messageTypeArray[filterIndex].title}
            </div>
          </Dropdown>
          <Tooltip title="清除消息">
            <div
              onClick={(e: any) => {
                setMessageVisible(true);
              }}
              style={{ width: "30px" }}
            >
              <ClearOutlined style={{ color: "#1890ff" }} />
            </div>
          </Tooltip>

          {messageNum ? (
            <React.Fragment>
              <Checkbox
                checked={messageCheck}
                onChange={(e: any) => {
                  setMessageCheck(e.target.checked);
                  setMessagePage(1);
                }}
                style={{ fontSize: "14px", color: !type ? "#fff" : "#333" }}
              >
                待签收
              </Checkbox>
              <Button
                type="primary"
                onClick={() => {
                  checkAllMessage();
                }}
                style={{ color: "#fff", marginLeft: "10px", height: "30px" }}
              >
                批量签收
                <span style={{ marginLeft: "5px" }}> ({messageNum}) </span>
              </Button>
            </React.Fragment>
          ) : null}
        </div>
      </div>

      <div
        className="messageBoard-item"
        onScroll={scrollMessageLoading}
        style={
          // type && messageNum === 0
          //   ? { height: 'calc(100% - 10px)', marginTop: '10px' }
          { height: " calc(100% - 50px)" }
        }
      >
        {messageArray.map((messageItem: any, messageIndex: number) => {
          const editRole =
            (messageItem.data.type === 3 &&
              messageItem.data.executorKey !== user._key) ||
            (messageItem.data.type === 5 &&
              messageItem.data.creatorKey !== user._key) ||
            (messageItem.data.type === 5 && messageItem.data.finishConfirm) ||
            (messageItem.data.type === 3 && messageItem.data.assignConfirm) ||
            (messageItem.data.type !== 5 && messageItem.data.type !== 3);
          return (
            <React.Fragment key={"message" + messageIndex}>
              {messageItem.data.name1 ? (
                <div className="messageBoard-item-item">
                  <div className="messageBoard-item-img">
                    <Tooltip
                      title={messageTypeArray[messageItem.data.type - 1].title}
                    >
                      <img
                        src={messageTypeArray[messageItem.data.type - 1].img}
                        alt=""
                      />
                    </Tooltip>
                  </div>
                  {messageItem.data.cardKey && messageItem.data.type !== 22 ? (
                    <div
                      className="messageBoard-item-container"
                      onClick={() => {
                        dispatch(setChooseKey(messageItem.data.cardKey));
                        dispatch(changeTaskInfoVisible(true));
                        // setTaskInfoShow(true);
                      }}
                    >
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
                            <img
                              src={
                                messageItem.data.groupLogo
                                  ? messageItem.data.groupLogo
                                  : defaultGroupPng
                              }
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="toLong" style={{ width: "190px" }}>
                            <span style={{ marginRight: "5px" }}>
                              {messageItem.data.groupName}
                            </span>
                            /
                            <span style={{ marginLeft: "5px" }}>
                              {messageItem.data.labelName
                                ? messageItem.data.labelName
                                : "ToDo"}
                            </span>
                          </div>
                        </div>
                        <div style={{ color: "#333", marginTop: "2px" }}>
                          {moment(parseInt(messageItem.data.time)).fromNow()}
                        </div>
                      </div>
                      <div className="messageBoard-item-time">
                        <div>{messageItem.data.creatorName}</div>
                        <img
                          src={
                            messageItem.data.finishConfirm &&
                            messageItem.data.type === 5
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
                          {messageItem.data.executorName}
                        </div>
                        <img
                          src={
                            messageItem.data.assignConfirm &&
                            messageItem.data.type === 3
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
                            messageItem.data.finishPercent === 0
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
                            messageItem.data &&
                            messageItem.data.taskEndDate
                              ? moment(messageItem.data.taskEndDate)
                                  .endOf("day")
                                  .diff(moment().endOf("day"), "days") < 0 &&
                                !isNaN(
                                  Math.abs(
                                    moment(messageItem.data.taskEndDate)
                                      .endOf("day")
                                      .diff(moment().endOf("day"), "days")
                                  )
                                )
                                ? Math.abs(
                                    moment(messageItem.data.taskEndDate)
                                      .endOf("day")
                                      .diff(moment().endOf("day"), "days")
                                  )
                                : Math.abs(
                                    moment(messageItem.data.taskEndDate)
                                      .endOf("day")
                                      .diff(moment().endOf("day"), "days")
                                  ) + 1
                              : ""}
                          </div>
                          <div className="messageBoard-item-hour">
                            {messageItem.data.hour}
                          </div>
                        </div>

                        {messageItem.data.extraData &&
                        messageItem.data.extraData.url ? (
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
                              window.open(messageItem.data.extraData.url);
                              e.stopPropagation();
                            }}
                          />
                        ) : null}
                      </div>
                      {messageItem.data.type !== 21 ? (
                        <div className="messageBoard-item-task">
                          <div>
                            {messageItem.data.type === 8
                              ? messageItem.data.content
                              : messageItem.data.title}
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
                      <div
                        className="messageBoard-item-name1"
                        style={{
                          margin: editRole
                            ? "0px 0px 6px 0px"
                            : "10px 0px 6px 0px",
                          color: editRole ? "#333" : "#1890ff",
                          width: editRole ? "100%" : "calc(100% - 55px)",
                        }}
                      >
                        {messageItem.data.type !== 21
                          ? messageItem.data.name1 +
                            " " +
                            messageItem.data.action
                          : messageItem.data.content}
                      </div>

                      {(messageItem.data.type === 3 &&
                        !messageItem.data.assignConfirm &&
                        messageItem.data.executorKey === user._key) ||
                      (messageItem.data.type === 5 &&
                        !messageItem.data.finishConfirm &&
                        messageItem.data.creatorKey === user._key) ? (
                        <div
                          style={{
                            animation:
                              messageItem.data.applyStatus === 1
                                ? "changeSmall 500ms"
                                : "",
                            animationFillMode:
                              messageItem.data.applyStatus === 1
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
                          <div style={{ marginLeft: "5px" }}>签收</div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div
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
                          {messageItem.data.name1 + " "}
                          {messageItem.data.action}
                        </div>
                        {messageItem.data.name2 ? (
                          <div className="messageBoard-item-name2">
                            {messageItem.data.name2}
                          </div>
                        ) : null}
                        {messageItem.data.commentContent ? (
                          <div className="messageBoard-item-commentContent">
                            {messageItem.data.commentContent}
                          </div>
                        ) : null}
                        {messageItem.data.type === 11 ? (
                          <div className="messageBoard-item-button">
                            {messageItem.data.applyStatus === 0 ? (
                              <React.Fragment>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    changeAddMessage(
                                      messageItem.data,
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
                                      messageItem.data,
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
                                {messageItem.data.applyStatus === 2
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
                        {moment(parseInt(messageItem.data.time)).fromNow()}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <Modal
        title="清除消息"
        visible={messageVisible}
        onOk={() => {
          clearMessage();
        }}
        onCancel={() => {
          setMessageVisible(false);
        }}
      >
        清理消息将删除所有消息，确定要清理吗？
      </Modal>
    </div>
  );
};
export default MessageBoard;
