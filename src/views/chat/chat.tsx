import React, { useState, useEffect, useRef, useCallback } from "react";
import "./chat.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";

import {
  setChatState,
  setUnChatNum,
  setMessage,
} from "../../redux/actions/commonActions";

import { useMount } from "../../hook/common";
interface ChatProps {
  chatType?: any;
}

const Chat: React.FC<ChatProps> = (props) => {
  const { chatType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);

  const [url, setUrl] = useState("");

  let unDistory = useRef<any>(true);

  useMount(() => {
    document.addEventListener("message", handlerIframeEvent);
    return () => {
      document.removeEventListener("message", handlerIframeEvent);
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (user) {
      setUrl(api.ROCKET_CHAT_URL);
      const dom: any = document.querySelector("#chat");
      dom.onload = () => {
        dom.contentWindow.postMessage(
          {
            externalCommand: "login-with-token",
            token: user.rocketChat.authToken,
          },
          "*"
        );
      };
    }
  }, [user]);
  const goChat = useCallback(
    async (
      headerIndex: number,
      memberArray: any,
      mainGroupKey: string,
      targetUserKey: string,
      groupInfo: any
    ) => {
      const dom: any = document.querySelector("#chat");
      if (dom) {
        if (headerIndex === 2) {
          const privatePerson =
            memberArray[_.findIndex(memberArray, { userId: targetUserKey })];
          if (privatePerson) {
            const privateChatRId = privatePerson.privateChatRId;
            if (privateChatRId) {
              dom.contentWindow.postMessage(
                {
                  externalCommand: "go",
                  path: "/direct/" + privateChatRId,
                },
                "*"
              );
            } else {
              let chatRes: any = await api.member.getPrivateChatRId(
                mainGroupKey,
                targetUserKey
              );
              if (unDistory.current) {
                if (chatRes.msg === "OK") {
                  dom.contentWindow.postMessage(
                    {
                      externalCommand: "go",
                      path: "/direct/" + chatRes.result,
                    },
                    "*"
                  );
                } else {
                  dispatch(setMessage(true, chatRes.msg, "error"));
                }
              }
            }
          }
        } else if (headerIndex === 3) {
          dom.contentWindow.postMessage(
            {
              externalCommand: "go",
              path: "/group/" + groupInfo.groupUUID,
            },
            "*"
          );
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (
      (headerIndex === 2 && memberArray) ||
      (headerIndex === 3 && groupInfo)
    ) {
      goChat(headerIndex, memberArray, mainGroupKey, targetUserKey, groupInfo);
    }
  }, [
    headerIndex,
    mainGroupKey,
    targetUserKey,
    groupInfo,
    memberArray,
    url,
    goChat,
    chatType,
  ]);
  const handlerIframeEvent = (e: any) => {
    switch (e.data.eventName) {
      case "unread-changed":
        if (isNaN(e.data.data)) {
          e.data.data = 0;
        }
        dispatch(setUnChatNum(e.data.data));
        break;
    }
  };

  return (
    <React.Fragment>
      <div
        className="chat-iframe"
        style={
          chatState
            ? {
                width: "700px",
              }
            : chatType === "custom"
            ? {
                width: "480px",
                height: "calc(100% + 60px)",
                position: "absolute",
                top: "-60px",
                left: "0px",
              }
            : { opacity: 0, width: "0px", height: "0px" }
        }
      >
        <iframe
          id="chat"
          src={url}
          className="chat"
          title=" "
          style={
            chatType === "custom"
              ? { width: "100%", left: "0px" }
              : {
                  left: "0px",
                }
          }
        ></iframe>
      </div>
      {chatState ? (
        <div
          className="chat-close"
          onClick={() => {
            dispatch(setChatState(false));
          }}
        >
          <CloseCircleOutlined style={{ color: "#1890ff", fontSize: "25px" }} />
        </div>
      ) : null}
    </React.Fragment>
  );
};
export default Chat;
