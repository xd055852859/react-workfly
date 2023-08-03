import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./groupTableTree.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Button, Input, Modal, Switch, Tooltip } from "antd";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
// import moment from "moment";
import copy from "copy-to-clipboard";
import _ from "lodash";
import api from "../../services/api";
import { useMount } from "../../hook/common";
import { editTask } from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";
import { getUploadToken } from "../../redux/actions/authActions";
import { getGroupInfo } from "../../redux/actions/groupActions";
import Editor from "../../components/common/editor/editor";
// import NewEditor from "../../components/common/editor/newEditor";

import Loading from "../../components/common/loading";
import Table from "../../components/tree/table";
import Link from "../../components/tree/link";
import Code from "../../components/qrCode/qrCode";
// import Comment from "../../components/comment/comment";
import Markdown from "../../components/tree/markDown/Markdown";
import Book from "../../components/tree/book";
// import Avatar from "../../components/common/avatar";
import { useAuth } from "../../context/auth";
import fileShareSvg from "../../assets/svg/fileShare.svg";
import fileEditSvg from "../../assets/svg/fileEdit.svg";
import fileViewSvg from "../../assets/svg/fileView.svg";
import fileUrlSvg from "../../assets/svg/fileUrl.svg";
// const { TabPane } = Tabs;
declare var window: Window;
interface GroupTableTreeInfoProps {
  fileKey: string;
  fullType?: string;
  type: string;
  reflashNode?: any;
  setNewContent?: any;
  setOriginContent?: any;
  close?: any;
}

const GroupTableTreeInfo = forwardRef((props: GroupTableTreeInfoProps, ref) => {
  const { fileKey, type, reflashNode, setNewContent, setOriginContent, close } =
    props;
  const dispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const [content, setContent] = useState<any>("");
  const [targetNode, setTargetNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [isOpenShare, setIsOpenShare] = useState(false);
  // const [taskCommentTotal, setTaskCommentTotal] = useState<any>(null);
  // const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);
  // const [taskHistoryTotal, setTaskHistoryTotal] = useState<any>(null);
  // const [taskHistoryPage, setTaskHistoryPage] = useState(1);
  // const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  // const [taskCommentPage, setTaskCommentPage] = useState(1);
  // const [commentInput, setCommentInput] = useState("");
  // const [taskEditAble, setTaskEditAble] = useState(false);
  // const [buttonLoading, setButtonLoading] = useState(false);
  // const [commentVisible, setCommentVisible] = useState(false);
  const containerRef: React.RefObject<any> = useRef();
  const iframeRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(true);
  let { deviceType } = useAuth();
  useMount(() => {
    if (setNewContent) {
      setNewContent("");
      setOriginContent("");
    }
    return () => {
      unDistory.current = false;
    };
  });
  useImperativeHandle(ref, () => ({
    changeSave: () => {
      console.log(targetNode);
      if (targetNode.type !== 11 && targetNode.type !== 17) {
        console.log(content);
        changeContent(targetNode.type, "", "", true);
      }
    },
  }));
  //@ts-ignore
  (window as any).changeEditState = (editState: string) => {
    // alert("测试" + editState)
    if (editState === "1") {
      if (editable) {
        changeContent(0);
        return content;
      }
      setEditable(false);
    } else if (editState === "2") {
      setEditable(true);
    }
  };
  const getTaskItem = async (fileKey: string) => {
    let taskItemRes: any = await api.task.getTaskInfo(fileKey);
    if (unDistory.current) {
      if (taskItemRes.msg === "OK") {
        let taskInfo = _.cloneDeep(taskItemRes.result);
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
        if (taskInfo.type === 14) {
          setContent(
            taskInfo.extraData && taskInfo.extraData.url
              ? taskInfo.extraData.url
              : ""
          );
          console.log(
            taskInfo.extraData && taskInfo.extraData.url
              ? taskInfo.extraData.url
              : ""
          );
        } else if (taskInfo.content || taskInfo.type !== 10) {
          setContent(taskInfo.content);
        } else {
          setContent("<p>备注信息:</p>");
        }

        // if (
        //   ((taskInfo.groupRole && taskInfo.groupRole < 4) ||
        //     taskInfo.creatorKey === userKey) &&
        //   deviceType !== "mobile" &&
        //   type !== "h5"
        // ) {
        //   setTaskEditAble(true);
        // }
        // if (deviceType === 'mobile' && taskInfo.type !== 2 && taskInfo.type !== 6) {
        //   setTaskEditAble(false)
        // }

        if (!taskInfo.isOpenShare || type !== "h5") {
          api.task.setVisitCardTime(taskInfo._key);
          dispatch(getGroupInfo(taskInfo.groupKey));
          dispatch(getUploadToken());
        }
        if (setOriginContent) {
          setOriginContent(taskInfo.content);
          setNewContent(taskInfo.content);
        }
        console.log(taskInfo.groupRole);
        setCanEdit(
          (taskInfo.groupRole && taskInfo.groupRole < 4) ||
            taskInfo.creatorKey === userKey ||
            taskInfo.executorKey === userKey
        );
        if (
          (taskInfo.groupRole && taskInfo.groupRole < 4) ||
          taskInfo.creatorKey === userKey ||
          taskInfo.executorKey === userKey
        ) {
          setEditable(true);
        }
        if (type === "h5") {
          setCanEdit(false);
        }
        setIsOpenShare(taskInfo.isOpenShare);
        setTargetNode(taskInfo);
      } else {
        setLoading(false);
        dispatch(setMessage(true, taskItemRes.msg, "error"));
      }
    }
  };
  useMount(() => {
    if (fileKey) {
      getTaskItem(fileKey);
    }
    // setCommentVisible(false);
    //eslint-disable-next-line
  });
  // useEffect(()=>{
  //   iframeRef.current.contentWindow.postMessage(
  //     {
  //       eventName: "parent-title-change",
  //       data: taskInfo.title,
  //     },
  //     "*"
  //   );
  // },)
  const changeContent = async (
    type: number,
    value?: string,
    title?: string,
    noMessage?: true
  ) => {
    // let newTargetNode = _.cloneDeep(gridList[targetIndex]);
    let linkUrl = "";
    console.log(type);
    if (type === 14) {
      if (content.includes("http://") || content.includes("https://")) {
        linkUrl = content;
      } else {
        linkUrl = `https://${content}`;
      }
      let editTaskRes: any = await api.task.editTask({
        key: targetNode._key,
        extraData: { url: content },
      });
      console.log(content);
      if (editTaskRes.msg === "OK") {
        if (!noMessage) {
          dispatch(setMessage(true, "保存成功", "success"));
        }
      } else {
        dispatch(setMessage(true, editTaskRes.msg, "error"));
      }
      // dispatch(setMessage(true, "保存成功", "success"));
      // changeGridList(newTargetNode);
      // newTargetNode.extraData = { url: value, icon: "" };
      console.log(linkUrl);
      let urlRes: any = await api.auth.getUrlIcon(linkUrl);
      if (urlRes.msg === "OK") {
        if (urlRes.icon) {
          targetNode.extraData = { url: linkUrl, icon: urlRes.icon };
          dispatch(
            editTask(
              {
                key: targetNode._key,
                extraData: { url: linkUrl, icon: urlRes.icon },
              },
              3
            )
          );
        }
        if (reflashNode) {
          reflashNode("icon", urlRes.icon);
        }
      } else {
        dispatch(setMessage(true, urlRes.msg, "error"));
      }
    } else if (type === 12) {
      if (!noMessage) {
        dispatch(setMessage(true, "保存成功", "success"));
      }
      console.log(iframeRef.current);
      iframeRef.current.contentWindow.postMessage(
        {
          eventName: "saveTable",
          data: token,
        },
        "*"
      );
    } else {
      let newTitle: any = targetNode.title;
      let newContent: any = content;
      if (title) {
        newTitle = title;
      }
      if (value) {
        newContent = value;
      }
      if (targetNode.type === 13) {
        newTitle = saveMarkDown();
      }
      if (targetNode.type !== 15) {
        let editTaskRes: any = await api.task.editTask({
          key: targetNode._key,
          content: newContent,
          title: newTitle,
        });
        if (editTaskRes.msg === "OK") {
          if (!noMessage) {
            dispatch(setMessage(true, "保存成功", "success"));
          }
          if (newTitle && reflashNode) {
            reflashNode("title", newTitle);
          }
          if (newContent && setNewContent) {
            setOriginContent(newContent);
            setNewContent(newContent);
          }
          setEditable(false);
        } else {
          dispatch(setMessage(true, editTaskRes.msg, "error"));
        }
      }
    }
    // if (setIsFatherEdit) {
    //   setIsFatherEdit(false);
    // }
  };
  const saveMarkDown = () => {
    // const imgReg = /<img.*?(?:>|\/>)/gi; // 匹配图片中的img标签
    // const srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
    // // let innerHtml;
    // let cover: any = "";
    let title: string = "";
    let dom = document.getElementById("editor-preview");
    if (dom) {
      // 获取title，既一个dom
      const firstNode: any = dom.childNodes[0];
      title = firstNode ? firstNode.innerHTML : "";

      // innerHtml = dom.innerHTML;
      // 筛选出所有的img
      // const arr = innerHtml.match(imgReg);
      // if (arr) {
      //   const srcMatch = arr[0].match(srcReg);
      //   if (srcMatch) {
      //     // 将第一个图片作为封面
      //     // eslint-disable-next-line prefer-destructuring
      //     cover = srcMatch[1];
      //   }
      // }

      // 获取摘要
      // innerHtml = dom.innerHTML;
      // // 去除标签
      // innerHtml = innerHtml.replace(/<\/?.+?>/g, "");
      // innerHtml = innerHtml.replace(/&nbsp;/g, "");
      // // 去除标题
      // innerHtml = innerHtml.replace(title, "");
      return title;
    }
  };
  const shareGroup = (url: string) => {
    copy(url);
    dispatch(setMessage(true, "复制分享链接成功", "success"));
  };
  const onOpenChange = async (checked) => {
    let editTaskRes: any = await api.task.editTask({
      key: targetNode._key,
      isOpenShare: checked,
    });
    if (editTaskRes.msg === "OK") {
      setIsOpenShare(checked);
      if (reflashNode) {
        reflashNode("isOpenShare", checked);
      }
    } else {
      dispatch(setMessage(true, editTaskRes.msg, "error"));
    }
  };
  // const getCommentList = async (page: number, taskInfo: any) => {
  //   let commentRes: any = await api.task.getTaskComment(
  //     taskInfo._key,
  //     page,
  //     10
  //   );

  //   if (commentRes.msg === "OK") {
  //     setTaskCommentArray((prevCommentArray) => {
  //       if (page === 1) {
  //         prevCommentArray = [];
  //       }
  //       return [...prevCommentArray, ...commentRes.result];
  //     });
  //     setTaskCommentTotal(commentRes.totalNumber);
  //   } else {
  //     dispatch(setMessage(true, commentRes.msg, "error"));
  //   }
  // };
  // const getHistoryList = async (page: number, taskInfo: any) => {
  //   let historyRes: any = await api.task.getTaskHistory(
  //     taskInfo._key,
  //     page,
  //     10
  //   );
  //   if (historyRes.msg === "OK") {
  //     setTaskHistoryArray((prevHistoryArray) => {
  //       if (page === 1) {
  //         prevHistoryArray = [];
  //       }
  //       return [...prevHistoryArray, ...historyRes.result];
  //     });
  //     setTaskHistoryTotal(historyRes.totalNumber);
  //   } else {
  //     dispatch(setMessage(true, historyRes.msg, "error"));
  //   }
  // };
  // const saveCommentMsg = async () => {
  //   let newCommentArray = _.cloneDeep(taskCommentArray);
  //   let newCommentTotal = taskCommentTotal;
  //   if (commentInput !== "") {
  //     //保存
  //     setButtonLoading(true);
  //     let saveRes: any = await api.task.addComment(
  //       targetNode._key,
  //       commentInput
  //     );
  //     if (saveRes.msg === "OK") {
  //       dispatch(setMessage(true, "评论成功", "success"));
  //       newCommentArray.push(saveRes.result);
  //       newCommentTotal = newCommentTotal + 1;
  //       setTaskCommentArray(newCommentArray);
  //       setTaskCommentTotal(newCommentTotal);
  //       setCommentInput("");
  //       setButtonLoading(false);
  //     } else {
  //       setButtonLoading(false);
  //       dispatch(setMessage(true, saveRes.msg, "error"));
  //     }
  //   }
  // };
  // const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
  //   let newCommentArray = _.cloneDeep(taskCommentArray);
  //   let newCommentTotal = taskCommentTotal;
  //   let deleteRes: any = await api.task.deleteComment(commentkey);
  //   if (deleteRes.msg === "OK") {
  //     dispatch(setMessage(true, "删除评论成功", "success"));
  //     newCommentArray.splice(commentIndex, 1);
  //     newCommentTotal = newCommentTotal - 1;
  //     setTaskCommentArray(newCommentArray);
  //     setTaskCommentTotal(newCommentTotal);
  //   } else {
  //     dispatch(setMessage(true, deleteRes.msg, "error"));
  //   }
  // };

  // const scrollCommentLoading = async (e: any) => {
  //   let page = taskCommentPage;
  //   //文档内容实际高度（包括超出视窗的溢出部分）
  //   let scrollHeight = e.target.scrollHeight;
  //   //滚动条滚动距离
  //   let scrollTop = e.target.scrollTop;
  //   //窗口可视范围高度
  //   let clientHeight = e.target.clientHeight;
  //   if (
  //     clientHeight + scrollTop >= scrollHeight &&
  //     taskCommentArray.length < taskCommentTotal
  //   ) {
  //     page = page + 1;
  //     setTaskCommentPage(page);
  //     getCommentList(page, targetNode);
  //   }
  // };
  // const scrollHistoryLoading = async (e: any) => {
  //   let page = taskHistoryPage;
  //   //文档内容实际高度（包括超出视窗的溢出部分）
  //   let scrollHeight = e.target.scrollHeight;
  //   //滚动条滚动距离
  //   let scrollTop = e.target.scrollTop;
  //   //窗口可视范围高度
  //   let height = e.target.clientHeight;
  //   if (
  //     height + scrollTop >= scrollHeight &&
  //     taskHistoryArray.length < taskHistoryTotal
  //   ) {
  //     page = page + 1;
  //     setTaskHistoryPage(page);
  //     getHistoryList(page, targetNode);
  //   }
  // };
  // const changeInput = (e: any) => {
  //   setCommentInput(e.target.value);
  //   // setEditState(true);
  // };
  return (
    <React.Fragment>
      {targetNode ? (
        <React.Fragment>
          {(targetNode.type === 11 && type !== "h5" && type !== "infoH5") ||
          targetNode.type !== 11 ? (
            <div className="groupTableTreeInfo-header">
              <div>{targetNode.title ? targetNode.title : ""}</div>
              <div className="groupTableTree-full-img">
                {(targetNode.type === 10 ||
                  targetNode.type === 12 ||
                  targetNode.type === 13 ||
                  targetNode.type === 14) &&
                canEdit ? (
                  <Tooltip title={editable ? "保存" : "编辑"}>
                    <div
                      onClick={() => {
                        if (!editable && targetNode.type !== 12) {
                          setEditable(true);
                        } else {
                          changeContent(targetNode.type);
                        }
                      }}
                      style={{ marginRight: "12px", marginTop: "3px" }}
                    >
                      {editable ? (
                        <SaveOutlined style={{ fontSize: "26px" }} />
                      ) : (
                        <EditOutlined style={{ fontSize: "26px" }} />
                      )}
                    </div>
                  </Tooltip>
                ) : null}
                {canEdit ? (
                  <Tooltip title="公开分享">
                    <div
                      onClick={() => {
                        setShareVisible(true);
                      }}
                      style={{ marginRight: "12px", marginTop: "3px" }}
                    >
                      <img
                        src={fileShareSvg}
                        alt=""
                        style={{ width: "25px", height: "25px" }}
                      />
                    </div>
                  </Tooltip>
                ) : null}
                {type !== "h5" && deviceType !== "mobile" ? (
                  <Tooltip title="跳转链接">
                    <div
                      onClick={() => {
                        if (targetNode.type === 14) {
                          let linkUrl = "";
                          let value = targetNode.extraData.url;
                          if (
                            value.includes("http://") ||
                            value.includes("https://")
                          ) {
                            linkUrl = value;
                          } else {
                            linkUrl = `https://${value}`;
                          }
                          //@ts-ignore
                          window.open(linkUrl);
                        } else {
                          //@ts-ignore
                          window.open(
                            //@ts-ignore
                            `${window.location.protocol}//${window.location.host}/home/file?fileKey=${targetNode._key}`
                          );
                          close();
                        }
                      }}
                      style={{ marginRight: "12px", marginTop: "3px" }}
                    >
                      <img
                        src={fileUrlSvg}
                        alt=""
                        style={{ width: "25px", height: "25px" }}
                      />
                    </div>
                  </Tooltip>
                ) : null}
              </div>
            </div>
          ) : null}
          <div
            className="groupTableTreeInfo-container"
            ref={containerRef}
            // onClick={() => {
            //   setCommentVisible(false);
            // }}
            style={{
              height:
                deviceType === "mobile" ||
                type === "doc" ||
                type === "h5" ||
                type === "infoH5"
                  ? "100%"
                  : "calc(100% - 54px)",
            }}
          >
            {loading ? (
              <Loading loadingHeight="90px" loadingWidth="90px" />
            ) : null}
            {targetNode.type === 10 ||
            targetNode.type === 2 ||
            targetNode.type === 6 ? (
              <React.Fragment>
                {editable && type !== "h5" ? (
                  <Editor
                    data={content}
                    height={
                      deviceType === "mobile"
                        ? document.documentElement.offsetHeight + 50
                        : document.documentElement.offsetHeight + 33
                    }
                    editorKey={targetNode?._key}
                    setContent={setContent}
                    cardKey={targetNode?._key}
                  />
                ) : (
                  // <div
                  //   style={{
                  //     height: "100%",
                  //     width: "100%",
                  //     overflow: "auto",
                  //     padding: "10px 17px",
                  //     boxSizing: "border-box",
                  //   }}
                  // >
                  //   <NewEditor />
                  // </div>
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
            {/* {targetNode.type === 11 ? (
              <iframe
                ref={iframeRef}
                // src={`http://localhost:3001/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${targetNode._key}"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${targetNode._key}"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=1`}
                src={
                  `https://draw.workfly.cn/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${
                    targetNode._key
                  }"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${
                    targetNode._key
                  }"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=${
                    type === "h5" ? 1 : canEdit ? 2 : 0
                  }${type === "h5" ? "&viewState=1" : ""}`
                  // ${type !== "h5" ? "&hideHead=1" : ""}`
                }
                className="groupTableTreeInfo-iframe"
                title="绘图"
                allow="clipboard-read; clipboard-write "
              />
            ) : null} */}
            {targetNode.type === 12 ? (
              <iframe
                ref={iframeRef}
                name="frame-container"
                className="web-view"
                title="时光表格"
                src={`${window.location.protocol}//${
                  window.location.host
                }/editor/sheet.html?key=${targetNode._key}${
                  deviceType === "mobile" ? "&deviceType='mobile'" : ""
                }${type === "h5" ? "&viewState='view'" : ""}`}
                frameBorder="0"
                width="100%"
                height="100%"
              ></iframe>
            ) : null}
            {targetNode.type === 13 ? (
              <Markdown
                targetData={targetNode}
                setContent={setContent}
                editable={editable}
              />
            ) : null}
            {targetNode.type === 14 ? (
              <Link targetData={targetNode} setContent={setContent} />
            ) : null}
            {targetNode.type === 15 ? (
              <Book
                targetData={targetNode}
                onChange={changeContent}
                fileType={type}
                viewState={type === "h5"}
              />
            ) : null}
            {targetNode.type === 16 ? (
              <iframe
                ref={iframeRef}
                // src={`http://localhost:3001/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${targetNode._key}"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${targetNode._key}"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=1`}
                src={`https://ppt.mindcute.com?token=${
                  token ? token : ""
                }&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"token":"${
                  token ? token : ""
                }","cardKey":"${
                  targetNode._key
                }"},"docDataName":"content","responseName":"result"}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${
                  targetNode._key
                }","token":"${token}"},"docDataName":"content"}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type":"2"}}`}
                className="groupTableTreeInfo-iframe"
                title="ppt"
              />
            ) : null}
            {targetNode.type === 17 ? (
              <iframe
                ref={iframeRef}
                // src={`http://localhost:3001/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${targetNode._key}"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${targetNode._key}"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=1`}
                src={`https://draw2.workfly.cn/?token=${token}&getDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card/cardDetail","params":{"cardKey":"${
                  targetNode._key
                }"}}&patchDataApi={"url":"https://workingdata.qingtime.cn/sgbh/card","params":{"key": "${
                  targetNode._key
                }"},"docDataName":["content","title"]}&getUptokenApi={"url":"https://workingdata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken","params":{"type": "2"}}&isEdit=${
                  type === "h5" ? 1 : canEdit ? 2 : 0
                }`}
                className="groupTableTreeInfo-iframe"
                title="绘图"
                allow="clipboard-read; clipboard-write "
              />
            ) : null}
            {/* {commentVisible ? (
              <div
                className="comment-info"
                // onClose={() => {
                //   setCommentVisible(false);
                // }}
                style={{
                  height: 500,
                  bottom: 0,
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
                    <div
                      className="taskInfo-comment-input"
                      style={{ position: "absolute", width: "100%" }}
                    >
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
                                <Avatar
                                  avatar={historyItem?.etc?.avatar}
                                  name={""}
                                  type={"person"}
                                  index={historyIndex}
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
            ) : null} */}
            {/* {deviceType !== "mobile" && type !== "list"  && type !== "doc"&& type !== "h5" ? (
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
                      setCommentVisible(commentVisible ? false : true);
                      if (commentVisible === false) {
                        getHistoryList(1, targetNode);
                        getCommentList(1, targetNode);
                      }
                    }}
                  />
                </Badge>
              </div>
            ) : null} */}
            {/* { */}
            {deviceType === "mobile" &&
            targetNode &&
            (targetNode.type === 2 || targetNode.type === 6) ? (
              <div className="comment-button">
                <Tooltip title={editable ? "保存" : "编辑"}>
                  <div
                    onClick={() => {
                      if (!editable) {
                        setEditable(true);
                      } else {
                        changeContent(targetNode.type);
                      }
                    }}
                    style={{ marginRight: "12px", marginTop: "3px" }}
                  >
                    {editable ? (
                      <SaveOutlined
                        style={{
                          fontSize: "24px",
                          color: "#1899ff",
                        }}
                      />
                    ) : (
                      <EditOutlined
                        style={{
                          fontSize: "24px",
                          color: "#1899ff",
                        }}
                      />
                    )}
                  </div>
                </Tooltip>
              </div>
            ) : null}
          </div>
          <Modal
            visible={shareVisible}
            onCancel={() => {
              setShareVisible(false);
            }}
            onOk={() => {}}
            footer={null}
            title={"分享项目"}
          >
            <div className="groupTableInfo-share-title">
              <div>开启后获得链接的人都可以访问</div>
              <Switch
                checked={isOpenShare}
                onChange={onOpenChange}
                style={{ marginLeft: "30px" }}
              ></Switch>
            </div>
            <div className="groupTableInfo-share-title">
              <Input
                //@ts-ignore
                value={`${window.location.protocol}//${window.location.host}/file?fileKey=${targetNode._key}`}
                disabled
                style={{ width: "70%", height: "40px" }}
              ></Input>
              <Button
                type="primary"
                onClick={() => {
                  shareGroup(
                    //@ts-ignore
                    `${window.location.protocol}//${window.location.host}/file?fileKey=${targetNode._key}`
                  );
                }}
                style={{ color: "#fff", height: "40px" }}
              >
                复制链接
              </Button>
            </div>
            <div className="groupTableInfo-code">
              <div
                style={{
                  width: "70%",
                }}
              >
                <Code
                  //@ts-ignore
                  url={`${window.location.protocol}//${window.location.host}/file?fileKey=${targetNode._key}`}
                  id={fileKey}
                />
              </div>
              <div
                style={{
                  width: "85px",
                }}
              >
                扫码分享
              </div>
            </div>
          </Modal>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
});
GroupTableTreeInfo.defaultProps = {};
export default GroupTableTreeInfo;
