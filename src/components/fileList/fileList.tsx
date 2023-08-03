import React, { useState, useEffect, useCallback, useRef } from "react";
import "./fileList.css";
import "./../../views/groupTable/groupTableTree.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import moment from "moment";
import api from "../../services/api";
import _ from "lodash";

import { setMessage } from "../../redux/actions/commonActions";
import IconFont from "../../components/common/iconFont";

import linkBigIconSvg from "../../assets/svg/linkBigIcon.svg";
import pptBigIconSvg from "../../assets/img/ppt@1x.png";
declare var window: Window 
interface FileListProps {
  groupKey: string;
  type: string;
  fileHeight?: number;
  fileItemWidth?: string | number;
  tabKey?: string;
}

const FileList: React.FC<FileListProps> = (props) => {
  const { groupKey, type, fileHeight, tabKey } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  // const token = useTypedSelector((state) => state.auth.token);
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const [filePage, setFilePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [fileList, setFileList] = useState<any>([]);

  const limit = useRef<any>(30);
  const iconArray = useRef<string[]>([
    "https://cdn-icare.qingtime.cn/FtkXwZ6IehLY3esnusB7zXbATj0N",
    "https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo",
    "https://cdn-icare.qingtime.cn/FgcSN1LlGW1F0L5njTuMCEVtorPw",
    "https://cdn-icare.qingtime.cn/Fnwl_g4Re1NHyeNYBzGAq0goIWso",
    linkBigIconSvg,
    "https://cdn-icare.qingtime.cn/FhTo1tbXwsX2toqGmd2NXy4XGA-g",
    pptBigIconSvg,
  ]);
  let unDistory = useRef<any>(true);
  useEffect(() => {
    return () => {
      if (unDistory.current) {
        unDistory.current = false;
      }
    };
  }, []);
  const getFileList = useCallback(
    async (page: number, type: string, groupKey: string) => {
      let fileRes: any = null;
      if (type === "文档") {
        fileRes = await api.task.getVisitCardTime(
          groupKey,
          "",
          page,
          limit.current
        );
      } else if (type === "侧边文档") {
        fileRes = await api.task.getVisitCardTime(
          "",
          localStorage.getItem("mainEnterpriseGroupKey") as string,
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
      if (unDistory.current) {
        if (fileRes.msg === "OK") {
          setFileList((prevFileList) => {
            if (page === 1) {
              prevFileList = [];
            }
            return [...prevFileList, ...fileRes.result];
          });
          setTotal(fileRes.totalNumber);
        } else {
          dispatch(setMessage(true, fileRes.msg, "error"));
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (user) {
      getFileList(1, type, groupKey);
    }
  }, [user, type, getFileList, groupKey, tabKey]);
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
              // if (type === "侧边文档") {
              //   dispatch(setCommonHeaderIndex(20));
              //   dispatch(setFileInfo(item));
              //   dispatch(setFileVisible(false));
              //   history.push("/home/basic/fileBasic");
              // } else if (deviceState === "xl" || deviceState === "xxl") {
              //   dispatch(setFileInfo(item));
              //   dispatch(setFileVisible(true));
              // } else {
              e.stopPropagation();
              window.open(
                `https://workfly.cn/home/file?fileKey=${item._key}`,
                "new"
              );
              // }
              // dispatch(setFileKey(item._key));
              api.task.setVisitCardTime(item._key);
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
              {type === "文档" || type === "侧边文档"
                ? moment(
                    moment().valueOf() - item.visitTime > 0
                      ? item.visitTime
                      : moment().valueOf() - 3000
                  ).fromNow()
                : moment(
                    moment().valueOf() - item.createTime > 0
                      ? item.createTime
                      : moment().valueOf() - 3000
                  ).fromNow()}
            </div>
            <div
              className="file-container-icon"
              onClick={(e) => {
                e.stopPropagation();
                if (item?.extraData?.url) {
                  let linkUrl = "";
                  if (
                    item.extraData.url.includes("http://") ||
                    item.extraData.url.includes("https://")
                  ) {
                    linkUrl = item.extraData.url;
                  } else {
                    linkUrl = `https://${item.extraData.url}`;
                  }
                  window.open(linkUrl);
                } else {
                  window.open(
                    `https://workfly.cn/home/file?fileKey=${item._key}`
                  );
                }
              }}
            >
              <IconFont type="icon-tiaozhuan" style={{ fontSize: "25px" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
FileList.defaultProps = { fileItemWidth: 270 };
export default FileList;
