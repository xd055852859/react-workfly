import React, { useEffect, useRef, useState } from "react";
import "./file.css";
import { useDispatch } from "react-redux";
// import { useTypedSelector } from "../../redux/reducer/RootState";
import api from "../../services/api";
import moment from "moment";
import { Table, Tooltip, Drawer, Button } from "antd";
import {
  ReconciliationOutlined,
  EllipsisOutlined,
  SelectOutlined,
} from "@ant-design/icons";
// import FileInfo from "../../components/fileInfo/fileInfo";
import { useMount } from "../../hook/common";

import {
  setMessage,
  // setFileInfo,
  setFileKey,
} from "../../redux/actions/commonActions";
import FileHeader from "./fileHeader";
import linkBigIconSvg from "../../assets/svg/linkBigIcon.svg";
import pptBigIconSvg from "../../assets/img/ppt@1x.png";
import Avatar from "../../components/common/avatar";
import GroupTableInfo from "../groupTable/groupTableInfo";
import { useTypedSelector } from "../../redux/reducer/RootState";
interface FileProps {}
declare var window: Window 
const File: React.FC<FileProps> = () => {
  const dispatch = useDispatch();
  const fileKey = useTypedSelector((state) => state.common.fileKey);
  // const [filePage, setFilePage] = useState(1);
  const [fileType, setFileType] = useState(0);
  const [filePage, setFilePage] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileList, setFileList] = useState<any>([]);
  const [fileVisible, setFileVisible] = useState<boolean>(false);

  const iconArray = useRef<any>([
    "https://cdn-icare.qingtime.cn/FtkXwZ6IehLY3esnusB7zXbATj0N",
    "https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo",
    "https://cdn-icare.qingtime.cn/FgcSN1LlGW1F0L5njTuMCEVtorPw",
    "https://cdn-icare.qingtime.cn/Fnwl_g4Re1NHyeNYBzGAq0goIWso",
    linkBigIconSvg,
    "https://cdn-icare.qingtime.cn/FhTo1tbXwsX2toqGmd2NXy4XGA-g",
    pptBigIconSvg,
  ]);
  const iconName = useRef<any>([
    "时光文档",
    "时光绘图",
    "时光表格",
    "时光文本",
    "链接",
    "电子书",
    "ppt",
  ]);
  const columns1 = useRef<any>([
    {
      title: "图标",
      dataIndex: "type",
      key: "type",
      width: 60,
      align: "center",
      render: (type) => (
        <Tooltip title={iconName.current[type - 10]}>
          <img
            src={iconArray.current[type - 10]}
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </Tooltip>
      ),
    },
    {
      title: "文件名",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: 100,
      render: (title) => <div style={{ textAlign: "left" }}>{title}</div>,
    },
    {
      title: "所属项目",
      dataIndex: "groupName",
      key: "groupName",
      align: "center",
      width: 120,
      render: (groupName, record, index) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="toLong"
        >
          <Avatar
            avatar={record.groupLogo}
            name={groupName}
            type={"group"}
            index={0}
            size={18}
          />
          <div
            style={{
              width: "100px",
              flex: 1,
              textAlign: "left",
              marginLeft: "8px",
            }}
            className="toLong"
          >
            {groupName}
          </div>
        </div>
      ),
    },
    {
      title: "路径",
      dataIndex: "path1",
      key: "path1",
      align: "path1",
      width: 160,
      render: (path1, record) => (
        <div>
          {path1
            ? path1.map((pathItem: any, pathIndex: number) => {
                return (
                  <React.Fragment key={"path" + pathIndex}>
                    {pathIndex < path1.length - 1 ? (
                      <span>
                        {pathIndex === 0
                          ? ""
                          : pathIndex === 1
                          ? pathItem.title
                          : "/" + pathItem.title}
                      </span>
                    ) : null}
                  </React.Fragment>
                );
              })
            : null}
        </div>
      ),
    },

    {
      title: "创建者",
      dataIndex: "creatorName",
      key: "creatorName",
      align: "center",
      width: 60,
    },
    {
      title: "访问时间",
      dataIndex: "visitTime",
      key: "visitTime",
      align: "center",
      width: 100,
      render: (visitTime) => (
        <div>{moment(visitTime).format("MM-DD HH:mm")}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 80,
      render: (operation, record, index) => (
        <React.Fragment>
          <Tooltip title={record.isCollect ? "取消收藏" : "收藏"}>
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={
                <ReconciliationOutlined
                  style={{ color: record.isCollect ? "#1990ff" : "#999" }}
                />
              }
              onClick={() => {
                changeIsCollect(!record.isCollect, record, index);
              }}
            />
          </Tooltip>
          <Tooltip title="详情">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={<EllipsisOutlined />}
              onClick={() => {
                if (record.url) {
                  let linkUrl = "";
                  if (
                    record.url.includes("http://") ||
                    record.url.includes("https://")
                  ) {
                    linkUrl = record.url;
                  } else {
                    linkUrl = `https://${record.url}`;
                  }
                  window.open(linkUrl);
                } else {
                  setFileVisible(true);
                  dispatch(setFileKey(record._key));
                  // dispatch(setFileInfo(record, true));
                  // window.open(
                  //   `https://workfly.cn/home/file?fileKey=${record._key}`
                  // );
                }
              }}
            />
          </Tooltip>
          <Tooltip title="链接">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px" }}
              icon={<SelectOutlined />}
              onClick={() => {
                api.task.setVisitCardTime(record._key);
                window.open(
                  `https://workfly.cn/home/file?fileKey=${record._key}`
                );
              }}
            />
          </Tooltip>
        </React.Fragment>
      ),
      align: "center" as "center",
    },
  ]);
  const columns2 = useRef<any>([
    {
      title: "图标",
      dataIndex: "type",
      key: "type",
      width: 80,
      align: "center",
      render: (type) => (
        <Tooltip title={iconName.current[type - 10]}>
          <img
            src={iconArray.current[type - 10]}
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </Tooltip>
      ),
    },
    {
      title: "文件名",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (title) => <div style={{ textAlign: "left" }}>{title}</div>,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      render: (createTime) => (
        <div>{moment(createTime).format("MM-DD HH:mm")}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 160,
      render: (operation, record, index) => (
        <React.Fragment>
          <Tooltip title={record.isCollect ? "取消收藏" : "收藏"}>
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={
                <ReconciliationOutlined
                  style={{ color: record.isCollect ? "#1990ff" : "#999" }}
                />
              }
              onClick={() => {
                changeIsCollect(!record.isCollect, record, index);
              }}
            />
          </Tooltip>
          <Tooltip title="详情">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={<EllipsisOutlined />}
              onClick={() => {
                if (record.url) {
                  let linkUrl = "";
                  if (
                    record.url.includes("http://") ||
                    record.url.includes("https://")
                  ) {
                    linkUrl = record.url;
                  } else {
                    linkUrl = `https://${record.url}`;
                  }
                  window.open(linkUrl);
                } else {
                  setFileVisible(true);
                  dispatch(setFileKey(record._key));
                  // dispatch(setFileInfo(record, true));
                  // window.open(
                  //   `https://workfly.cn/home/file?fileKey=${record._key}`
                  // );
                }
              }}
            />
          </Tooltip>
          <Tooltip title="链接">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px" }}
              icon={<SelectOutlined />}
              onClick={() => {
                window.open(
                  `https://workfly.cn/home/file?fileKey=${record._key}`
                );
              }}
            />
          </Tooltip>
        </React.Fragment>
      ),
      align: "center" as "center",
    },
  ]);
  const columns3 = useRef<any>([
    {
      title: "图标",
      dataIndex: "type",
      key: "type",
      width: 60,
      align: "center",
      render: (type) => (
        <Tooltip title={iconName.current[type - 10]}>
          <img
            src={iconArray.current[type - 10]}
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </Tooltip>
      ),
    },
    {
      title: "文件名",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: 200,
      render: (title) => <div style={{ textAlign: "left" }}>{title}</div>,
    },
    {
      title: "所属项目",
      dataIndex: "groupName",
      key: "groupName",
      align: "center",
      width: 120,
      render: (groupName, record, index) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="toLong"
        >
          <Avatar
            avatar={record.groupLogo}
            name={groupName}
            type={"group"}
            index={0}
            size={18}
          />
          <div
            style={{
              width: "120px",
              flex: 1,
              textAlign: "left",
              marginLeft: "8px",
            }}
            className="toLong"
          >
            {groupName}
          </div>
        </div>
      ),
    },
    {
      title: "创建者",
      dataIndex: "creatorName",
      key: "creatorName",
      align: "center",
      width: 60,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 160,
      render: (visitTime) => (
        <div>{moment(visitTime).format("MM-DD HH:mm")}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 120,
      render: (operation, record, index) => (
        <React.Fragment>
          <Tooltip title="取消收藏">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={<ReconciliationOutlined style={{ color: "#1990ff" }} />}
              onClick={() => {
                changeIsCollect(false, record, index, 2);
              }}
            />
          </Tooltip>
          <Tooltip title="详情">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px", marginRight: "5px" }}
              icon={<EllipsisOutlined />}
              onClick={() => {
                if (record.url) {
                  let linkUrl = "";
                  if (
                    record.url.includes("http://") ||
                    record.url.includes("https://")
                  ) {
                    linkUrl = record.url;
                  } else {
                    linkUrl = `https://${record.url}`;
                  }
                  window.open(linkUrl);
                } else {
                  setFileVisible(true);
                  dispatch(setFileKey(record._key));
                  // dispatch(setFileInfo(record, true));
                  // window.open(
                  //   `https://workfly.cn/home/file?fileKey=${record._key}`
                  // );
                }
              }}
            />
          </Tooltip>
          <Tooltip title="链接">
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px" }}
              icon={<SelectOutlined />}
              onClick={() => {
                window.open(
                  `https://workfly.cn/home/file?fileKey=${record._key}`
                );
              }}
            />
          </Tooltip>
        </React.Fragment>
      ),
      align: "center" as "center",
    },
  ]);
  let unDistory = useRef<any>(true);
  useEffect(() => {
    return () => {
      if (unDistory.current) {
        unDistory.current = false;
      }
    };
  }, []);
  useMount(() => {
    getFileList(1, 0);
  });
  const handleChangePage = (page: number) => {
    setFilePage(page);
    getFileList(page, fileType);
  };
  const getFileList = async (page: number, type: number) => {
    setFilePage(page);
    let fileRes: any = null;
    if (type === 0) {
      fileRes = await api.task.getVisitCardTime("", "", page, 20);
    } else if (type === 1) {
      fileRes = await api.task.getTreeCollectDocList(page, 20);
    } else {
      fileRes = await api.task.getCollectDocList(page, 20);
    }

    if (unDistory.current) {
      if (fileRes.msg === "OK") {
        setFileList(() => {
          fileRes.result = fileRes.result.map((item) => {
            return {
              type: item.type,
              title: item.title,
              groupName: item.groupName,
              creatorName: item.creatorName,
              visitTime: item.visitTime,
              createTime: item.createTime,
              url:
                item.extraData && item.extraData.url ? item.extraData.url : "",
              _key: item._key,
              path1: item.path1,
              groupLogo: item.groupLogo,
              isCollect: item.isCollect ? item.isCollect : false,
              content: item.content,
            };
          });
          return [...fileRes.result];
        });
        setTotal(fileRes.totalNumber);
      } else {
        dispatch(setMessage(true, fileRes.msg, "error"));
      }
    }
  };
  const changeFileType = (fileType) => {
    setFileType(fileType);
    getFileList(1, fileType);
  };
  const changeIsCollect = async (value, record, index, fileType?: number) => {
    let collectRes: any = await api.task.collectTask(
      record._key,
      value ? 1 : 2
    );
    if (collectRes.msg === "OK") {
      await setFileList((prevFileList) => {
        if (value) {
          dispatch(setMessage(true, "收藏成功", "success"));
          prevFileList[index].isCollect = true;
        } else {
          dispatch(setMessage(true, "取消收藏成功", "success"));
          prevFileList[index].isCollect = false;
          if (fileType === 2) {
            prevFileList.splice(index, 1);
          }
        }
        return [...prevFileList];
      });
    } else {
      dispatch(setMessage(true, collectRes.msg, "error"));
    }
  };
  return (
    <div className="file">
      <FileHeader changeFileType={changeFileType} />
      {/* <div className="file-box">
          <div
            className="file-menu-item"
            onClick={() => {
              changeFileType(0);
            }}
            style={
              fileType === 0
                ? {
                    backgroundColor: "#999",
                  }
                : {}
            }
          >
            <img src={file1Svg} alt="" />
            最近文件
          </div>
          <div
            className="file-menu-item"
            onClick={() => {
              changeFileType(1);
            }}
            style={
              fileType === 1
                ? {
                    backgroundColor: "#999",
                  }
                : {}
            }
          >
            <img src={file2Svg} alt="" />
            我的网摘
          </div>
          <div
            className="file-menu-item"
            onClick={() => {
              changeFileType(2);
            }}
            style={
              fileType === 2
                ? {
                    backgroundColor: "#999",
                  }
                : {}
            }
          >
            <img src={file3Svg} alt="" />
            文档收藏
          </div>
        </div> */}
      <div className="file-info">
        <Table
          columns={
            fileType === 0
              ? columns1.current
              : fileType === 1
              ? columns2.current
              : columns3.current
          }
          dataSource={fileList}
          scroll={{ y: document.body.offsetHeight - 153 }}
          pagination={{
            current:filePage,
            pageSize: 20,
            onChange: handleChangePage,
            total: total,
            showSizeChanger: false,
          }}
          size={"small"}
        />
        <Drawer
          visible={fileVisible}
          onClose={() => {
            setFileVisible(false);
          }}
          width={750}
          bodyStyle={{
            padding: "0px 10px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
          headerStyle={{
            display:"none"
          }}
          maskStyle={{
            backgroundColor: "rgba(255,255,255,0)",
          }}
          destroyOnClose={true}
          push={false}
        >
          <GroupTableInfo fileKey={fileKey} type="tree" />
        </Drawer>
      </div>
    </div>
    // </div>
  );
};
File.defaultProps = {};
export default File;
