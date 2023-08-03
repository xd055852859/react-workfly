import React, { useState, useEffect, useRef, useCallback } from "react";
import "./messageBoard.css";
import { useDispatch } from "react-redux";
import { Modal, Tooltip, Dropdown, Tabs } from "antd";
import {
  ClearOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import _ from "lodash";
import { useTypedSelector } from "../../redux/reducer/RootState";
import api from "../../services/api";

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
import messageType26Svg from "../../assets/svg/messageType26.svg";
import messageType27Svg from "../../assets/svg/messageType27.svg";
import messageType28Svg from "../../assets/svg/messageType28.svg";
import messageType29Svg from "../../assets/svg/messageType29.svg";
import messageType30Svg from "../../assets/svg/messageType30.svg";
import { useMount } from "../../hook/common";
import MessageBoardItem from "./messageBoardItem";

const { TabPane } = Tabs;
interface MessageBoardProps {
  type?: string;
}
const MessageBoard: React.FC<MessageBoardProps> = (prop) => {
  const { type } = prop;
  const dispatch = useDispatch();
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [firstTotal, setFirstTotal] = useState(0);
  const [secondTotal, setSecondTotal] = useState(0);
  const [messageNum, setMessageNum] = useState(0);
  const [messageType, setMessageType] = useState(7);
  const [activeKey, setActiveKey] = useState("1");
  const [messageArray, setMessageArray] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [messageCheck, setMessageCheck] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [filterType, setFilterType] = useState<any>([]);
  const [filterIndex, setFilterIndex] = useState(0);
  let messageTypeArray = useRef<any>([
    { type: 0, title: "全部", img: "", filter: true },
    "",
    { type: 2, title: "打卡", img: messageType2Png, filter: false },
    { type: 3, title: "指派", img: messageType3Png, filter: true },
    { type: 4, title: "内容", img: messageType4Png, filter: false },
    { type: 5, title: "完成", img: messageType5Png, filter: true },
    { type: 6, title: "删除", img: messageType6Png, filter: false },
    { type: 7, title: "归档", img: messageType7Png, filter: false },
    { type: 8, title: "评论", img: messageType8Png, filter: false },
    { type: 9, title: "权限", img: messageType9Png, filter: false },
    { type: 10, title: "退群", img: messageType10Png, filter: false },
    { type: 11, title: "申请加群", img: messageType11Png, filter: false },
    { type: 12, title: "确认指派", img: messageType12Png, filter: false },
    { type: 13, title: "确认完成", img: messageType12Png, filter: false },
    { type: 14, title: "调整日期", img: messageType14Png, filter: false },
    { type: 15, title: "取消完成", img: messageType15Png, filter: false },
    { type: 16, title: "修改工时", img: messageType16Png, filter: false },
    { type: 17, title: "取消归档", img: messageType17Png, filter: false },
    { type: 18, title: "修改类型", img: messageType18Png, filter: false },
    { type: 19, title: "加入群组", img: messageType19Png, filter: false },
    { type: 20, title: "批量归档", img: messageType20Svg, filter: false },
    { type: 21, title: "修改标题", img: messageType21Svg, filter: false },
    { type: 22, title: "预定日程", img: messageType22Svg, filter: false },
    "",
    "",
    "",
    { type: 26, title: "设为关注人", img: messageType26Svg, filter: false },
    { type: 27, title: "取消关注人", img: messageType27Svg, filter: false },
    { type: 28, title: "待审核", img: messageType28Svg, filter: false },
    { type: 29, title: "审核已通过", img: messageType29Svg, filter: false },
    { type: 30, title: "审核已拒绝", img: messageType30Svg, filter: false },
  ]);
  let unDistory = useRef<any>(true);
  const messageRef: React.RefObject<any> = useRef();
  useMount(() => {
    getMessage(1, messageCheck, filterType, messageType);
    return () => {
      unDistory.current = false;
    };
  });
  const getMessage = useCallback(
    async (
      page: number,
      check: boolean,
      filterType: number[],
      type: number
    ) => {
      setLoading(true);
      let messageRes: any = await api.auth.getMessageList(
        page,
        20,
        filterType,
        type,
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
          if (activeKey === "1") {
            setFirstTotal(messageRes.totalNumber);
            setSecondTotal(messageRes.otherTotalNumber);
          }
          if (check) {
            setFirstTotal(messageRes.allNotDealNotice35);
            setSecondTotal(0);
          }
          setMessageNum(messageRes.allNotDealNotice35);
        } else {
          setLoading(false);
          dispatch(setMessage(true, messageRes.msg, "error"));
        }
      }
    },
    [dispatch, activeKey]
  );
  useEffect(() => {
    getMessage(messagePage, messageCheck, filterType, messageType);
  }, [getMessage, messagePage, messageCheck, filterType, messageType]);
  useEffect(() => {
    if (socketObj) {
      // let newMessageArray = _.cloneDeep(messageArray);
      // let newSocketObj = _.cloneDeep(socketObj);
      // let newMessageTotal = messageTotal;
      // let newMessageNum = messageNum;
      // newMessageArray.unshift(newSocketObj);
      // newMessageArray[0]._key = newSocketObj.data.noticeKey;
      // if (newSocketObj.data.type == 3 || newSocketObj.data.type == 5) {
      // getMessage(messagePage, messageCheck, filterType, messageType);
      setMessageNum((prevMessageNum) => prevMessageNum + 1);
      dispatch(setSocketObj(null));
      // // }
      // setMessageArray(newMessageArray);
      // setMessageTotal(newMessageTotal + 1);
    }
    //eslint-disable-next-line
  }, [socketObj, dispatch]);

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
      // getMessage(newPage, messageCheck, filterType, messageType);
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
      dispatch(setMessage(true, "确认成功", "success"));
      dispatch(changeMusic(10));
      if (newMessageArray[index].data.type === 3) {
        newMessageArray[index].data.assignConfirm = true;
      } else if (newMessageArray[index].data.type === 5) {
        newMessageArray[index].data.finishConfirm = true;
      }
      newMessageArray[index].data.applyStatus = 1;
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
      dispatch(setMessage(true, "批量确认成功", "success"));
      dispatch(changeMusic(10));
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
      getMessage(1, messageCheck, filterType, messageType);
    } else {
      dispatch(setMessage(true, messageRes.msg, "error"));
    }
  };

  const changeFilterType = (activeKey) => {
    setMessagePage(1);
    setMessageType(activeKey === "1" ? 7 : 6);
    setActiveKey(activeKey);
    // getMessage(1, messageCheck, filterType, activeKey === '1' ? 5 : 6);
  };
  const downMenu = (
    <div
      className="dropDown-box messageBoard-filter-container"
      style={{ height: "96px" }}
    >
      {messageTypeArray.current.map((filterItem, filterIndex) => {
        return (
          <React.Fragment key={"filter" + filterIndex}>
            {filterItem.filter ? (
              <div
                onClick={() => {
                  setFilterType(filterItem.type ? [filterItem.type] : []);
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
  const messageMenu = (
    <div className="messageBoard-mainbutton">
      {/* {messageNum ? ( */}
      {/* <React.Fragment> */}
      <Tooltip title="待我确认" placement="bottom">
        <div
          onClick={() => {
            setMessageCheck(!messageCheck);
            setMessagePage(1);
            setFirstTotal(0);
            setSecondTotal(0);
            setActiveKey("1");
          }}
          style={{ width: "20px" }}
        >
          <ClockCircleOutlined
            style={{
              color: messageCheck ? "#1890ff" : "#333",
              fontSize: "18px",
            }}
          />
        </div>
      </Tooltip>
      <Tooltip title="批量确认" placement="bottom">
        <div
          onClick={(e: any) => {
            checkAllMessage();
          }}
          style={{ width: "20px", marginLeft: "5px" }}
        >
          <CheckSquareOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
        </div>
      </Tooltip>
      {/* </React.Fragment> */}
      {/* ) : null
      } */}
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
          {messageTypeArray.current[filterIndex].title}
        </div>
      </Dropdown>
      <Tooltip
        title="清除消息"
        placement="left"
        getPopupContainer={() => messageRef.current}
        getTooltipContainer={() => messageRef.current}
      >
        <div
          onClick={(e: any) => {
            setMessageVisible(true);
          }}
          style={{ width: "20px" }}
        >
          <ClearOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
        </div>
      </Tooltip>
    </div>
  );
  return (
    <div
      className="messageBoard"
      style={{ width: type ? "100%" : "360px" }}
      ref={messageRef}
    >
      {loading ? <Loading loadingWidth="80px" loadingHeight="80px" /> : null}

      <Tabs
        activeKey={activeKey}
        onChange={changeFilterType}
        tabBarExtraContent={messageMenu}
      >
        <TabPane tab={`参与 (${firstTotal ? firstTotal : 0})`} key="1">
          <div
            className="messageBoard-item"
            onScroll={scrollMessageLoading}
            style={
              // type && messageNum === 0
              //   ? { height: 'calc(100% - 10px)', marginTop: '10px' }
              { height: " calc(100vh - 100px)" }
            }
          >
            {messageArray.map((messageItem: any, messageIndex: number) => {
              return (
                <React.Fragment key={"message" + messageIndex}>
                  <MessageBoardItem
                    messageItem={messageItem?.data}
                    messageKey={messageItem?._key}
                    messageIndex={messageIndex}
                    checkMsg={checkMsg}
                    changeAddMessage={changeAddMessage}
                    messageTypeArray={messageTypeArray.current}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </TabPane>
        {!messageCheck ? (
          <TabPane tab={`关注 (${secondTotal ? secondTotal : 0})`} key="2">
            <div
              className="messageBoard-item"
              onScroll={scrollMessageLoading}
              style={
                // type && messageNum === 0
                //   ? { height: 'calc(100% - 10px)', marginTop: '10px' }
                { height: " calc(100vh - 100px)" }
              }
            >
              {messageArray.map((messageItem: any, messageIndex: number) => {
                return (
                  <React.Fragment key={"message" + messageIndex}>
                    <MessageBoardItem
                      messageItem={messageItem?.data}
                      messageKey={messageItem?._key}
                      messageIndex={messageIndex}
                      checkMsg={checkMsg}
                      changeAddMessage={changeAddMessage}
                      messageTypeArray={messageTypeArray.current}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </TabPane>
        ) : null}
      </Tabs>

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
