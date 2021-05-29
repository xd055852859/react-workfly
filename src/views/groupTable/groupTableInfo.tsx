import React, { useState, useEffect, useRef, useCallback } from "react";
import "./groupTableTree.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, Badge, Tabs } from "antd";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";
import { useMount, usePrevious } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";

import IconFont from "../../components/common/iconFont";
import Editor from "../../components/common/editor/editor";
import Loading from "../../components/common/loading";
import Table from "../../components/tree/table";
import Link from "../../components/tree/link";
import Comment from "../../components/comment/comment";
import Markdown from "../../components/tree/markDown/Markdown";
import Book from "../../components/tree/book";
import defaultPersonPng from "../../assets/img/defaultPerson.png";

const { TabPane } = Tabs;
interface GroupTableTreeInfoProps {
  targetItem: any;
  fullType: string;
  editable: boolean;
  changeContent: Function;
  changeTargetContent: Function;
  changeEditable: Function;
}

const GroupTableTreeInfo: React.FC<GroupTableTreeInfoProps> = (props) => {
  const { targetItem, fullType, editable, changeContent, changeTargetContent } =
    props;
  const dispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const [content, setContent] = useState<any>("");
  const [targetNode, setTargetNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [taskCommentTotal, setTaskCommentTotal] = useState<any>(null);
  const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);
  const [taskHistoryTotal, setTaskHistoryTotal] = useState<any>(null);
  const [taskHistoryPage, setTaskHistoryPage] = useState(1);
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [taskCommentPage, setTaskCommentPage] = useState(1);
  const [commentInput, setCommentInput] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const containerRef: React.RefObject<any> = useRef();
  const iframeRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(true);
  
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getCommentList = useCallback(
    async (page: number, taskInfo: any) => {
      let newCommentArray = _.cloneDeep(taskCommentArray);
      if (page === 1) {
        newCommentArray = [];
      }
      let commentRes: any = await api.task.getTaskComment(
        taskInfo._key,
        page,
        10
      );
      if (unDistory.current) {
        if (commentRes.msg === "OK") {
          newCommentArray.push(...commentRes.result);
          setTaskCommentArray(newCommentArray);
          setTaskCommentTotal(commentRes.totalNumber);
        } else {
          dispatch(setMessage(true, commentRes.msg, "error"));
        }
      }
    },
    [taskCommentArray, dispatch]
  );
  const getHistoryList = useCallback(
    async (page: number, taskInfo: any) => {
      let newHistoryArray = _.cloneDeep(taskHistoryArray);
      if (page === 1) {
        newHistoryArray = [];
      }
      let historyRes: any = await api.task.getTaskHistory(
        taskInfo._key,
        page,
        10
      );
      if (unDistory.current) {
        if (historyRes.msg === "OK") {
          newHistoryArray.push(...historyRes.result);
          setTaskHistoryArray(newHistoryArray);
          setTaskHistoryTotal(historyRes.totalNumber);
        } else {
          dispatch(setMessage(true, historyRes.msg, "error"));
        }
      }
    },
    [taskHistoryArray, dispatch]
  );
  const getTaskItem = useCallback(
    async (key: string, page: number) => {
      setLoading(true);
      let taskItemRes: any = await api.task.getTaskInfo(key);
      if (unDistory.current) {
        if (taskItemRes.msg === "OK") {
          let taskInfo = _.cloneDeep(taskItemRes.result);
          setLoading(false);
          if (taskInfo.content || taskInfo.type !== 10) {
            setContent(taskInfo.content);
          } else {
            setContent("<p>备注信息:</p>");
          }
          if (taskInfo.type === 11) {
            taskInfo.content = taskInfo.content.replace("<p>", "");
            taskInfo.content = taskInfo.content.replace("</p>", "");
            taskInfo.content = taskInfo.content.replace(
              '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
              ""
            );
            if (taskInfo.content === "") {
              taskInfo.content = "{}";
            }
          }
          setTargetNode(taskInfo);
          getHistoryList(page, taskInfo);
          getCommentList(page, taskInfo);
        } else {
          setLoading(false);
          dispatch(setMessage(true, taskItemRes.msg, "error"));
        }
      }
    },
    [dispatch, getHistoryList, getCommentList]
  );
  useEffect(() => {
    if (!targetNode || targetItem._key !== targetNode._key) {
      getTaskItem(targetItem._key, 1);
    }
  }, [targetItem, targetNode, getTaskItem]);

  const prevTargetItem = usePrevious(targetItem);
  useEffect(() => {
    if (
      targetNode &&
      !_.isEqual(prevTargetItem, targetItem) &&
      targetItem._key === targetNode._key &&
      iframeRef.current
    ) {
      iframeRef.current.contentWindow.postMessage(
        {
          eventName: "parent-title-change",
          data: targetItem.title,
        },
        "*"
      );
    }
  }, [targetItem, targetNode, prevTargetItem]);

  const changeTaskContent = (value: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let content = "";
    if (value) {
      content = value;
    } else if (newTargetNode.type === 10) {
      content = "<p>备注信息:</p>";
    }
    newTargetNode.content = content;
    setTargetNode(newTargetNode);
    setContent(content);
    changeTargetContent(content);
    if (newTargetNode.type === 11) {
      changeContent(content);
    }
  };

  const saveCommentMsg = async () => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    if (commentInput !== "") {
      //保存
      setButtonLoading(true);
      let saveRes: any = await api.task.addComment(
        targetNode._key,
        commentInput
      );
      if (saveRes.msg === "OK") {
        dispatch(setMessage(true, "评论成功", "success"));
        newCommentArray.push(saveRes.result);
        newCommentTotal = newCommentTotal + 1;
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(newCommentTotal);
        setCommentInput("");
        setButtonLoading(false);
      } else {
        setButtonLoading(false);
        dispatch(setMessage(true, saveRes.msg, "error"));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除评论成功", "success"));
      newCommentArray.splice(commentIndex, 1);
      newCommentTotal = newCommentTotal - 1;
      setTaskCommentArray(newCommentArray);
      setTaskCommentTotal(newCommentTotal);
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };

  const scrollCommentLoading = async (e: any) => {
    let page = taskCommentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      taskCommentArray.length < taskCommentTotal
    ) {
      page = page + 1;
      setTaskCommentPage(page);
      getCommentList(page, targetNode);
    }
  };
  const scrollHistoryLoading = async (e: any) => {
    let page = taskHistoryPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      taskHistoryArray.length < taskHistoryTotal
    ) {
      page = page + 1;
      setTaskHistoryPage(page);
      getHistoryList(page, targetNode);
    }
  };
  const changeInput = (e: any) => {
    setCommentInput(e.target.value);
    // setEditState(true);
  };
  return (
    <React.Fragment>
      {targetNode ? (
        <React.Fragment>
          <div
            className="groupTableTreeInfo-container"
            ref={containerRef}
            onClick={() => {
              setCommentVisible(false);
            }}
            style={{
              height: targetNode.type === 11 ? "100%" : "calc(100% - 54px)",
            }}
          >
            {loading ? (
              <Loading loadingHeight="90px" loadingWidth="90px" />
            ) : null}
            {targetNode.type === 10 ? (
              <React.Fragment>
                {editable ? (
                  <Editor
                    data={content}
                    height={
                      containerRef?.current?.offsetHeight
                        ? containerRef.current.offsetHeight
                        : 800
                    }
                    editorKey={targetNode?._key}
                    onChange={changeTaskContent}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                      height: "100%",
                      width: "100%",
                      overflow: "auto",
                      padding: "10px 17px",
                      boxSizing: "border-box",
                    }}
                  ></div>
                )}
              </React.Fragment>
            ) : null}
            {targetNode.type === 11 ? (
              <iframe
                ref={iframeRef}
                // src={`http://localhost:3001/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${targetNode._key}"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${targetNode._key}"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=1`}
                src={`https://draw.workfly.cn/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${targetNode._key}"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${targetNode._key}"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=1`}
                className="groupTableTreeInfo-iframe"
                title="绘图"
              />
            ) : null}
            {targetNode.type === 12 ? <Table node={targetNode} /> : null}
            {targetNode.type === 13 ? (
              <Markdown
                targetData={targetNode}
                onChange={changeTaskContent}
                editable={editable}
              />
            ) : null}
            {targetNode.type === 14 ? (
              <Link targetData={targetNode} onChange={changeContent} />
            ) : null}
            {targetNode.type === 15 ? (
              <Book
                targetData={targetNode}
                onChange={changeContent}
                fullType={fullType}
              />
            ) : null}
            {commentVisible ? (
              <div
                className="comment-info"
                // onClose={() => {
                //   setCommentVisible(false);
                // }}
                style={{
                  height: document.body.offsetHeight - 458,
                  top: 340,
                  padding: "10px",
                  boxSizing: "border-box",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      "评论(" + (taskCommentTotal ? taskCommentTotal : 0) + ")"
                    }
                    key="1"
                  >
                    <div
                      className="taskInfo-comment-tab"
                      onScroll={scrollCommentLoading}
                    >
                      {taskCommentArray.map(
                        (commentItem: any, commentIndex: number) => {
                          return (
                            <Comment
                              commentItem={commentItem}
                              commentIndex={commentIndex}
                              key={"comment" + commentIndex}
                              commentClick={deleteCommentMsg}
                            />
                          );
                        }
                      )}
                    </div>
                    <div className="taskInfo-comment-input">
                      <Input
                        placeholder="评论"
                        onChange={changeInput}
                        value={commentInput}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            saveCommentMsg();
                          }
                        }}
                      />
                      {commentInput ? (
                        <Button
                          loading={buttonLoading}
                          type="primary"
                          onClick={() => {
                            saveCommentMsg();
                          }}
                        >
                          发布
                        </Button>
                      ) : null}
                    </div>
                  </TabPane>
                  <TabPane tab="历史" key="2">
                    <div
                      className="taskInfo-comment-tab"
                      onScroll={scrollHistoryLoading}
                    >
                      {taskHistoryArray.map(
                        (historyItem: any, historyIndex: number) => {
                          return (
                            <div
                              key={"history" + historyIndex}
                              className="taskInfo-comment-historyLog"
                            >
                              <div className="taskInfo-comment-avatar">
                                <img
                                  src={
                                    historyItem.etc && historyItem.etc.avatar
                                      ? historyItem.etc.avatar +
                                        "?imageMogr2/auto-orient/thumbnail/80x"
                                      : defaultPersonPng
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="taskInfo-comment-info">
                                <div>
                                  {moment(
                                    parseInt(historyItem.createTime)
                                  ).fromNow()}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#8091a0" }}
                                >
                                  {historyItem.log}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            ) : null}
            <div className="comment-button">
              <Badge
                count={taskCommentTotal}
                style={{ backgroundColor: "#1890ff" }}
                offset={[-6, 6]}
              >
                <Button
                  type="primary"
                  size="large"
                  shape="circle"
                  icon={<IconFont type="icon-pinglun" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentVisible(true);
                  }}
                />
              </Badge>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
GroupTableTreeInfo.defaultProps = {};
export default GroupTableTreeInfo;
