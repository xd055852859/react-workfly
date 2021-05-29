import React, { useState, useEffect, useCallback, useRef } from "react";
import "./fileList.css";
import "./../../views/groupTable/groupTableTree.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import moment from "moment";
import api from "../../services/api";
import _ from "lodash";
import { useAuth } from "../../context/auth";

import { setMessage, setFileInfo } from "../../redux/actions/commonActions";
import IconFont from "../../components/common/iconFont";

import linkIconSvg from "../../assets/svg/linkIcon.svg";

interface FileListProps {
  groupKey: string;
  type: string;
  fileHeight?: number;
  fileItemWidth?: string | number;
}

const FileList: React.FC<FileListProps> = (props) => {
  const { groupKey, type, fileHeight } = props;
  const dispatch = useDispatch();
  const { deviceState } = useAuth();
  const user = useTypedSelector((state) => state.auth.user);
  const token = useTypedSelector((state) => state.auth.token);
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const [filePage, setFilePage] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileList, setFileList] = useState<any>([]);

  const limit = useRef<any>(30);
  const iconArray = useRef<any>([
    "https://cdn-icare.qingtime.cn/FpCB_dxjQGMt0lBUP-PwBXAVkNHN",
    "https://cdn-icare.qingtime.cn/FgKrqQB-8wqIouNRWzTzCe2A12FK",
    "https://cdn-icare.qingtime.cn/FjFqTs8ZmMtsL1X8LGZEVSV9WSRW",
    "https://cdn-icare.qingtime.cn/FjO6YNYHntTHrgS_3hR2kZiID8rd",
    linkIconSvg,
    "https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y",
  ]);

  const getFileList = useCallback(
    async (page: number, type: string, groupKey: string) => {
      let fileRes: any = null;
      if (type === "最近") {
        fileRes = await api.task.getVisitCardTime(
          groupKey,
          page,
          limit.current
        );
      } else if (type === "收藏") {
        fileRes = await api.task.getCreateCardTime(
          groupKey,
          page,
          limit.current
        );
      }
      if (fileRes.msg === "OK") {
        setFileList((prevFileList) => {
          if (page === 0) {
            prevFileList = [];
          }
          return [...prevFileList, ...fileRes.result];
        });
        setTotal(fileRes.totalNumber);
      } else {
        dispatch(setMessage(true, fileRes.msg, "error"));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (user) {
      getFileList(0, type, groupKey);
    }
  }, [user, type, getFileList, groupKey]);
  useEffect(() => {
    if (fileInfo) {
      setFileList((prevFileList) => {
        let index = _.findIndex(prevFileList, { _key: fileInfo._key });
        if (index !== -1) {
          prevFileList[index] = fileInfo;
        }
        return prevFileList;
      });
    }
  }, [fileInfo]);

  const scrollFileListLoading = async (e: any) => {
    let page = filePage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (height + scrollTop >= scrollHeight && fileList.length < total) {
      page = page + 1;
      setFilePage(page);
      getFileList(page, type, groupKey);
    }
  };

  return (
    <div
      className="fileList"
      onScroll={scrollFileListLoading}
      style={fileHeight ? { height: fileHeight } : {}}
    >
      {fileList.map((item: any, index: number) => {
        return (
          <div
            className="file-container"
            key={"file" + index}
            onClick={(e) => {
              if (deviceState === "xl" || deviceState === "xxl") {
                dispatch(setFileInfo(item, true));
              } else {
                e.stopPropagation();
                window.open(
                  `http://workfly.cn/home/file?token=${token}&fileKey=${item._key}`,
                  "new"
                );
              }
            }}
          >
            <div className="file-container-img">
              <img src={iconArray.current[item.type - 10]} alt="" />
            </div>
            <div className="file-container-title">
              <div>{item.title}</div>
              {!groupKey ? <div>{item.groupName}</div> : null}
            </div>
            <div className="file-container-time">
              {type === "最近"
                ? moment(parseInt(item.visitTime)).fromNow()
                : moment(parseInt(item.createTime)).fromNow()}
            </div>
            <div
              className="file-container-icon"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `http://workfly.cn/home/file?token=${token}&fileKey=${item._key}`
                );
              }}
            >
              <IconFont
                type="icon-iconzhengli_tiaozhuan"
                style={{ fontSize: "25px" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
FileList.defaultProps = { fileItemWidth: 270 };
export default FileList;
