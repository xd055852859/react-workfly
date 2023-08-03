import React, { useState } from "react";
import "./appendix.css";
import { Upload, Modal, Button } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";

import moment from "moment";
import _ from "lodash";
// import FileViewer from "react-file-viewer";
import api from "../../services/api";
import { setMessage } from "../../redux/actions/commonActions";

import uploadFile from "../common/upload";
import Iframeview from "../common/iframeview";
import Dialog from "./dialog";
// import { useMount } from "../../hook/common";
const { Dragger } = Upload;
// import pdfSvg from "../../assets/svg/pdf.svg";
// import wordSvg from "../../assets/svg/word.svg";
// import zipSvg from "../../assets/svg/zip.svg";
interface AppendixProps {
  fileList: any;
  setFileList: any;
  cardKey: string;
  groupKey: string;
}
const Appendix: React.FC<AppendixProps> = (props) => {
  const { fileList, setFileList, cardKey, groupKey } = props;
  const dispatch = useDispatch();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const user = useTypedSelector((state) => state.auth.user);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [appendixFile, setAppendixFile] = useState<any>({});
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<any>(0);
  const handlePreview = async (file) => {
    if (file.fileType === "zip") {
      dispatch(setMessage(true, "压缩文件无法预览", "error"));
    } else if (file.fileType === "rar") {
      dispatch(setMessage(true, "rar文件无法预览", "error"));
    } else if (file.fileType === "doc") {
      dispatch(setMessage(true, "doc文件无法预览", "error"));
    } else if (file.fileType === "xlsx") {
      dispatch(setMessage(true, "xlsx文件无法预览", "error"));
    }
    // else if (file.fileType === "ppt") {
    //   dispatch(setMessage(true, "ppt文件无法预览", "error"));
    // }
    else {
      setInfoVisible(true);
      setAppendixFile(file);
    }
  };
  const handleRemove = (file) => {
    const fileIndex = _.findIndex(fileList, { uid: file.uid });
    setDeleteIndex(fileIndex);
    setDeleteVisible(true);
  };

  const handleChange = ({ fileList }) => {};
  const handleDownload = (file) => {
    let x = new XMLHttpRequest();
    x.open("GET", file.url, true);
    x.responseType = "blob";
    x.onload = function (e) {
      //会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
      //@ts-ignore
      let url = window.URL.createObjectURL(x.response);
      let a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
    };
    x.send();
    // const elt = document.createElement("a");
    // elt.setAttribute("href", file.url);
    // alert(file.name);
    // elt.setAttribute("download", file.name);
    // elt.style.display = "none";
    // document.body.appendChild(elt);
    // elt.click();
    // document.body.removeChild(elt);
  };
  const handleUpload = async (e: any) => {
    // const newFileList = [...fileList];
    const newFileList: any = [];
    const docTypeArr = ["pdf", "docx", "zip", "doc", "pptx"];
    const imgTypeArr = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    newFileList.push({
      uid: e.file.name + moment().valueOf(), // 注意，这个uid一定不能少，否则上传失败
      name: e.file.name,
      url: "",
      status: "uploading",
    });
    if (
      e.file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      e.file.name.split(".")[1].indexOf("docx") !== -1 ||
      e.file.name.split(".")[1].indexOf("doc") !== -1
    ) {
      if (e.file.size === 0) {
        dispatch(setMessage(true, "请上传有内容的docx文件", "error"));
        return;
      }
      newFileList[0].fileType = "docx";
    } else if (e.file.type === "application/pdf") {
      newFileList[0].fileType = "pdf";
    } else if (e.file.type === "application/msword") {
      newFileList[0].fileType = "doc";
    } else if (
      e.file.type === "application/x-zip-compressed" ||
      e.file.type === "application/zip"
    ) {
      newFileList[0].fileType = "zip";
    } else if (
      e.file.type === "application/x-rar" ||
      e.file.name.indexOf("rar") !== -1
    ) {
      newFileList[0].fileType = "rar";
    } else if (e.file.type === "audio/mpeg") {
      newFileList[0].fileType = "mp3";
    } else if (e.file.type === "video/mp4") {
      newFileList[0].fileType = "mp4";
    } else if (
      e.file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      newFileList[0].fileType = "xlsx";
    } else if (
      e.file.type === "application/vnd.ms-powerpoint" ||
      e.file.name.indexOf("pptx") !== -1 ||
      e.file.name.split(".")[1].indexOf("ppt") !== -1
    ) {
      newFileList[0].fileType = "pptx";
    } else if (e.file.type.indexOf("image") !== -1) {
      newFileList[0].fileType = "image";
    } else {
      dispatch(
        setMessage(
          true,
          "仅支持pdf,docx,xlsx,zip,rar,mp3,mp4,ppt和图片格式",
          "error"
        )
      );
      return;
    }
    let res: any = await api.task.judgeUploadSpaceSize(groupKey, e.file.size);
    if (res.msg === "OK") {
      dispatch(
        setMessage(
          true,
          `项目剩余空间:${(
            (res.result.groupObject.scSize -
              res.result.groupObject.groupUsedSize) /
            1024 /
            1024
          ).toFixed(2)} MB,个人剩余空间:${(
            (res.result.userObject.scSize -
              res.result.userObject.userUsedSize) /
            1024 /
            1024
          ).toFixed(2)} MB,`,
          "success"
        )
      );
      uploadFile.uploadImg(
        e.file,
        [...imgTypeArr, ...docTypeArr],
        (url) => {
          newFileList[0].url = url;
          newFileList[0].status = "done";
          api.task.batchAddPicUrl(
            {
              cardKey: cardKey,
              type: "附件",
              userKey: user._key,
              userName: user.profile.nickName,
              fileType: newFileList[0].fileType,
              groupKey: groupKey,
              enterpriseGroupKey: mainEnterpriseGroup
                ? mainEnterpriseGroup.mainEnterpriseGroupKey
                : "",
            },
            [{ url: url, size: e.file.size }]
          );
          setFileList((prevFileList) => {
            prevFileList = [...prevFileList, ...newFileList];
            return prevFileList;
          });
        },
        newFileList[0].fileType === "image" ? null : newFileList[0].fileType
      );
    } else {
      let str: string = "";
      if (
        res.result.groupObject &&
        res.result.groupObject.scSize -
          res.result.groupObject.groupUsedSize -
          e.file.size <=
          0
      ) {
        str = `项目空间不足,剩余${(
          (res.result.groupObject.scSize -
            res.result.groupObject.groupUsedSize) /
          1024 /
          1024
        ).toFixed(2)} MB,当前文件${(e.file.size / 1024 / 1024).toFixed(2)} MB`;
      }
      if (
        res.result.userObject.scSize &&
        res.result.userObject.scSize -
          res.result.userObject.userUsedSize -
          e.file.size <=
          0
      ) {
        str = `个人空间不足,剩余${(
          (res.result.userObject.scSize - res.result.userObject.userUsedSize) /
          1024 /
          1024
        ).toFixed(2)} MB,当前文件${(e.file.size / 1024 / 1024).toFixed(2)} MB`;
      }
      dispatch(setMessage(true, str, "error"));
    }

    // set_fileList([imgItem])
    // qiniu(e.file).then(res => {
    //     const imgItem = {
    //         uid: '1', // 注意，这个uid一定不能少，否则上传失败
    //         name: 'hehe.png',
    //         status: 'done',
    //         url: res, // url 是展示在页面上的绝对链接
    //     };
    //     set_fileList(() => {
    //         return [imgItem]
    //     })
    //     set_imageUrl(res)
    // })
    // },
  };
  // const handleError = (e) => {};

  const uploadContent = (appendixFile) => {
    let dom: any = null;
    switch (appendixFile.fileType) {
      case "pdf":
        dom = (
          <Iframeview
            // uri={`https://view.officeapps.live.com/op/view.aspx?src=${appendixFile.url}`}
            uri={appendixFile.url}
          />
        );
        break;
      case "pptx":
      // dom = (
      //   <Iframeview
      //     uri={`https://view.officeapps.live.com/op/view.aspx?src=${appendixFile.url}`}
      //     // uri={appendixFile.url}
      //   />
      // );
      // break;
      //eslint-disable-next-line
      case "docx":
        dom = (
          <Iframeview
            uri={`https://view.officeapps.live.com/op/view.aspx?src=${appendixFile.url}`}
            // uri={appendixFile.url}
          />
        );
        // dom = (
        //   <FileViewer
        //     fileType={appendixFile.fileType}
        //     filePath={appendixFile.url}
        //     errorComponent={<div></div>}
        //     onError={handleError}
        //   />
        // );
        break;
      case "mp3":
        dom = (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <audio src={appendixFile.url} controls loop={false}>
              {" "}
              您的浏览器不支持 audio 标签。
            </audio>
          </div>
        );
        break;
      case "mp4":
        dom = (
          <div
            style={{
              // width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              src={appendixFile.url}
              controls
              loop={false}
              style={{ height: "95%" }}
            >
              {" "}
              您的浏览器不支持 video 标签。
            </video>
          </div>
        );
        break;
      default:
        dom = (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="example"
              style={{ maxHeight: "100%" }}
              src={appendixFile.url}
            />
          </div>
        );
        break;
    }
    return dom;
  };
  return (
    <React.Fragment>
      <Dragger
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        onDownload={handleDownload}
        customRequest={handleUpload}
        showUploadList={{
          showDownloadIcon: true,
          downloadIcon: <DownloadOutlined />,
          showRemoveIcon: true,
          removeIcon: <DeleteOutlined />,
        }}
      >
        {/* <Button icon={ */}
        {/* <UploadOutlined /> */}
        {/* }>上传附件</Button> */}
        <p className="ant-upload-drag-icon" style={{marginBottom:'5px'}}>
          <InboxOutlined />
        </p>
        <div className="ant-upload-text">上传附件</div>
      </Dragger>
      <Dialog
        visible={infoVisible}
        title={appendixFile.name}
        footer={null}
        onClose={() => {
          setInfoVisible(false);
          setAppendixFile({});
        }}
        dialogStyle={{
          width: "100vw",
          height: "100vh",
          overflow: "auto",
          padding: "0px",
          borderRadius: "0px",
        }}
      >
        {uploadContent(appendixFile)}
      </Dialog>
      <Modal
        visible={deleteVisible}
        title={"删除附件"}
        onOk={() => {
          let newFileList = _.cloneDeep(fileList);
          newFileList.splice(deleteIndex, 1);
          setFileList(newFileList);
          // changeFileList(newFileList);
          setDeleteVisible(false);
        }}
        onCancel={() => {
          setDeleteVisible(false);
        }}
      >
        是否删除该附件
      </Modal>
    </React.Fragment>
  );
};
Appendix.defaultProps = {};
export default Appendix;
