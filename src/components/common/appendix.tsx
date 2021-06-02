import React, { useState } from "react";
import "./appendix.css";
import { Upload, Modal, Button } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";

import moment from "moment";
import _ from "lodash";
import FileViewer from "react-file-viewer";

import { setMessage } from "../../redux/actions/commonActions";

import uploadFile from "../common/upload";
import Iframeview from "../common/iframeview";

// import pdfSvg from "../../assets/svg/pdf.svg";
// import wordSvg from "../../assets/svg/word.svg";
// import zipSvg from "../../assets/svg/zip.svg";
interface AppendixProps {
  fileList: any;
  changeFileList: any;
}
const Appendix: React.FC<AppendixProps> = (props) => {
  const { fileList, changeFileList } = props;
  const dispatch = useDispatch();
  const uptoken = useTypedSelector((state) => state.auth.uploadToken);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [appendixFile, setAppendixFile] = useState<any>({});
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<any>(0);
  const handlePreview = async (file) => {
    if (file.fileType === "zip") {
      dispatch(setMessage(true, "压缩文件无法预览", "error"));
    } else if (file.fileType === "doc") {
      dispatch(setMessage(true, "doc文件无法预览", "error"));
    } else {
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
      let url = window.URL.createObjectURL(x.response);
      let a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
    };
    x.send();
    // console.log(file);
    // const elt = document.createElement("a");
    // elt.setAttribute("href", file.url);
    // alert(file.name);
    // elt.setAttribute("download", file.name);
    // elt.style.display = "none";
    // document.body.appendChild(elt);
    // elt.click();
    // document.body.removeChild(elt);
  };
  const handleUpload = (e: any) => {
    const newFileList = [...fileList];
    const newIndex = newFileList.length;
    const docTypeArr = ["pdf", "docx", "zip", "doc"];
    const imgTypeArr = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    newFileList[newIndex] = {
      uid: e.file.name + moment().valueOf(), // 注意，这个uid一定不能少，否则上传失败
      name: e.file.name,
      url: "",
      status: "uploading",
    };

    if (
      e.file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      if (e.file.size === 0) {
        dispatch(setMessage(true, "请上传有内容的docx文件", "error"));
        return;
      }
      newFileList[newIndex].fileType = "docx";
    } else if (e.file.type === "application/pdf") {
      newFileList[newIndex].fileType = "pdf";
    } else if (e.file.type === "application/msword") {
      newFileList[newIndex].fileType = "doc";
    } else if (e.file.type === "application/x-zip-compressed") {
      newFileList[newIndex].fileType = "zip";
    } else if (e.file.type.indexOf("image") !== -1) {
      newFileList[newIndex].fileType = "image";
    } else {
      dispatch(setMessage(true, "仅支持pdf,docx,zip和图片格式", "error"));
      return;
    }
    uploadFile.uploadImg(
      e.file,
      uptoken,
      [...imgTypeArr, ...docTypeArr],
      (url) => {
        newFileList[newIndex].url = url;
        newFileList[newIndex].status = "done";
        changeFileList(newFileList);
      },
      newFileList[newIndex].fileType === "image"
        ? null
        : newFileList[newIndex].fileType
    );
    // set_fileList([imgItem])
    // qiniu(e.file).then(res => {
    //     // console.log(res)
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
  const handleError = (e) => {
    console.log(e);
  };

  const uploadContent = (appendixFile) => {
    let dom: any = null;
    switch (appendixFile.fileType) {
      case "pdf":
        dom = <Iframeview uri={appendixFile.url} />;
        break;
      case "docx":
        dom = (
          <FileViewer
            fileType={appendixFile.fileType}
            filePath={appendixFile.url}
            errorComponent={<div></div>}
            onError={handleError}
          />
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
              style={{ height: "100%" }}
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
      <Upload
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
        <Button icon={<UploadOutlined />}>上传附件</Button>
      </Upload>
      <Modal
        visible={infoVisible}
        title={appendixFile.name}
        footer={null}
        onCancel={() => {
          setInfoVisible(false);
          setAppendixFile({});
        }}
        centered={true}
        width="70%"
        bodyStyle={{
          height: "85vh",
          overflow: "auto",
          padding: "0px",
        }}
        destroyOnClose={true}
      >
        {uploadContent(appendixFile)}
      </Modal>
      <Modal
        visible={deleteVisible}
        title={"删除附件"}
        onOk={() => {
          const newFileList = [...fileList];
          newFileList.splice(deleteIndex, 1);
          changeFileList(newFileList);
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
