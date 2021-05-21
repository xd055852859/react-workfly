import React, { useState, useEffect, useRef, useCallback } from "react";
import "./../../views/groupTable/groupTableTree.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Tooltip, Button } from "antd";
import _ from "lodash";
import api from "../../services/api";

import { setMessage, setFileInfo } from "../../redux/actions/commonActions";
import { editTask } from "../../redux/actions/taskActions";

import Loading from "../common/loading";
import IconFont from "../../components/common/iconFont";

import GroupTableInfo from "../../views/groupTable/groupTableInfo";
import bigCloseSvg from "../../assets/svg/bigClose.svg";

interface FileInfoProps {
  type?: string;
}

const FileInfo: React.FC<FileInfoProps> = (props) => {
  const { type } = props;
  const dispatch = useDispatch();

  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const fileKey = useTypedSelector((state) => state.common.fileKey);
  
  const [editable, setEditable] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>("");
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useEffect(() => {
    setEditable(false);
    if (fileInfo) {
      setContent(fileInfo.content);
    }
  }, [fileInfo]);
  // useEffect(() => {
  //   dispatch(setFileInfo(null, false));
  // }, [headerIndex,dispatch]);

  const getFileInfo = useCallback(
    async (fileKey: string) => {
      setLoading(true);
      let taskItemRes: any = await api.task.getTaskInfo(fileKey);
      if (unDistory.current) {
        if (taskItemRes.msg === "OK") {
          setLoading(false);
          dispatch(setFileInfo(taskItemRes.result, true));
          setContent(taskItemRes.result.content);
        } else {
          setLoading(false);
          dispatch(setMessage(true, taskItemRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    setEditable(false);
    if (fileKey) {
      getFileInfo(fileKey);
    }
  }, [fileKey, getFileInfo]);

  const changeContent = async (value?: string, title?: string) => {
    let newTargetItem = _.cloneDeep(fileInfo);
    let newContent: any = _.cloneDeep(content);
    let linkUrl = "";
    if (newTargetItem.type === 14 && value) {
      if (value.includes("http://") || value.includes("https://")) {
        linkUrl = value;
      } else {
        linkUrl = `https://${value}`;
      }
      dispatch(
        editTask(
          {
            key: newTargetItem._key,
            extraData: { url: value },
          },
          3
        )
      );
      dispatch(setMessage(true, "保存成功", "success"));
      dispatch(setFileInfo(newTargetItem, true));
      // setFileList(newFileList);
      newTargetItem.extraData = { url: value, icon: "" };
      let urlRes: any = await api.auth.getUrlIcon(linkUrl);
      if (urlRes.msg === "OK") {
        if (urlRes.icon) {
          newTargetItem.extraData = { url: value, icon: urlRes.icon };
          dispatch(
            editTask(
              {
                key: newTargetItem._key,
                extraData: { url: value, icon: urlRes.icon },
              },
              3
            )
          );
        }
        dispatch(setFileInfo(newTargetItem, true));
      } else {
        dispatch(setMessage(true, urlRes.msg, "error"));
      }
    } else {
      let newTitle: any = newTargetItem.title;
      if (title) {
        newTitle = title;
      }
      if (value) {
        newContent = value;
      }
      if (newTargetItem.type === 13) {
        newTitle = saveMarkDown();
      }
      if (newTargetItem.type !== 15) {
        dispatch(
          editTask(
            {
              key: newTargetItem._key,
              content: newContent,
              title: newTitle,
            },
            3
          )
        );
        dispatch(setMessage(true, "保存成功", "success"));
      }
      newTargetItem.content = newContent;
      newTargetItem.title = newTitle;
      setFileInfo(newTargetItem, true);
      // setFileList(newFileList);
    }
    if (newTargetItem.type !== 11) {
      setEditable(false);
    }
  };
  const saveMarkDown = () => {
    // const imgReg = /<img.*?(?:>|\/>)/gi; // 匹配图片中的img标签
    // const srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
    // let innerHtml;
    // let cover: any = "";
    let title: string = "";
    let dom = document.getElementById("editor-preview");
    if (dom) {
      // 获取title，既一个dom
      const firstNode: any = dom.childNodes[0];
      title = firstNode ? firstNode.innerHTML : "";

      // innerHtml = dom.innerHTML;
      // // 筛选出所有的img
      // const arr = innerHtml.match(imgReg);
      // if (arr) {
      //   const srcMatch = arr[0].match(srcReg);
      //   if (srcMatch) {
      //     // 将第一个图片作为封面
      //     // eslint-disable-next-line prefer-destructuring
      //     cover = srcMatch[1];
      //   }
      // }

      // // 获取摘要
      // innerHtml = dom.innerHTML;
      // // 去除标签
      // innerHtml = innerHtml.replace(/<\/?.+?>/g, "");
      // innerHtml = innerHtml.replace(/&nbsp;/g, "");
      // // 去除标题
      // innerHtml = innerHtml.replace(title, "");
      return title;
    }
  };
  return (
    <React.Fragment>
      {fileInfo ? (
        <React.Fragment>
          {fileInfo.type !== 11 ? (
            <div className="groupTableTree-full-title">
              <div>{fileInfo.title ? fileInfo.title : ""}</div>
              <div className="groupTableTree-full-img">
                {fileInfo.type === 10 ||
                (fileInfo.type === 11 && !editable) ||
                fileInfo.type === 13 ? (
                  <Tooltip title={editable ? "保存" : "编辑"}>
                    <Button
                      size="large"
                      shape="circle"
                      style={{ border: "0px" }}
                      ghost
                      icon={
                        editable ? (
                          <IconFont type="icon-baocun1" />
                        ) : (
                          <IconFont type="icon-edit" />
                        )
                      }
                      onClick={() => {
                        if (!editable) {
                          setEditable(true);
                        } else {
                          changeContent();
                        }
                      }}
                    />
                  </Tooltip>
                ) : null}
                {fileInfo.type === 14 && fileInfo.extraData?.url ? (
                  <Tooltip title="跳转外部链接">
                    <Button
                      size="large"
                      shape="circle"
                      style={{ border: "0px" }}
                      ghost
                      icon={<IconFont type="icon-iconzhengli_tiaozhuan" />}
                      onClick={() => {
                        let linkUrl = "";
                        let value = fileInfo.extraData.url;
                        if (
                          value.includes("http://") ||
                          value.includes("https://")
                        ) {
                          linkUrl = value;
                        } else {
                          linkUrl = `https://${value}`;
                        }
                        window.open(linkUrl);
                      }}
                    />
                  </Tooltip>
                ) : null}
              </div>
            </div>
          ) : null}
          {loading ? (
            <Loading loadingHeight="90px" loadingWidth="90px" />
          ) : null}
          <GroupTableInfo
            targetItem={fileInfo}
            fullType={"big"}
            editable={editable}
            changeContent={changeContent}
            changeTargetContent={setContent}
            changeEditable={setEditable}
          />
          {!type ? (
            <img
              src={bigCloseSvg}
              alt=""
              className="bigClose"
              onClick={() => {
                dispatch(setFileInfo(null, false));
                setEditable(false);
              }}
            />
          ) : null}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
FileInfo.defaultProps = {};
export default FileInfo;
