import React from "react";
import "./../../views/groupTable/groupTableTree.css";
import "./fileInfo.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useLocation } from "react-router";

import GroupTableInfo from "../../views/groupTable/groupTableInfo";

interface FileInfoProps {
  type?: string;
  viewState?: string;
}

const FileInfo: React.FC<FileInfoProps> = (props) => {
  const location = useLocation();
  const fileKey = useTypedSelector((state) => state.common.fileKey);
  console.log(location.pathname);
  return (
    <React.Fragment>
      <GroupTableInfo
        fileKey={fileKey}
        type={location.pathname === "/home/file" ? "infoH5" : "h5"}
      />
      {/* {type && deviceType !== "mobile" ? (
            <img
              src={bigCloseSvg}
              alt=""
              className="bigClose"
              onClick={() => {
                if (editable) {
                  setCloseSaveVisible(true);
                } else {
                  dispatch(setFileInfo(null));
                  dispatch(setFileVisible(false));
                  dispatch(setFileKey(""));
                  setEditable(false);
                }
              }}
            />
          ) : null}
          {
            // (deviceType === 'mobile' && fileInfo && (fileInfo.type === 2 || fileInfo.type === 6)) ||
            deviceType !== "mobile" &&
            (fileInfo.type === 10 ||
              fileInfo.type === 2 ||
              fileInfo.type === 6 ||
              (fileInfo.type === 11 && !editable) ||
              fileInfo.type === 13) ? (
              <div className="fileInfo-button">
                <Button
                  type="primary"
                  size="large"
                  shape="circle"
                  ghost
                  icon={
                    editable ? (
                      <IconFont type="icon-baocun1" />
                    ) : (
                      <IconFont type="icon-edit" />
                    )
                  }
                  onClick={(e) => {
                    if (!editable) {
                      setEditable(true);
                    } else {
                      changeContent(0);
                    }
                  }}
                />
              </div>
            ) : null
          }
          <Modal
            visible={closeSaveVisible}
            title={"保存内容"}
            onOk={() => {
              changeContent(0);
            }}
            onCancel={() => {
              dispatch(setFileInfo(null));
              dispatch(setFileVisible(false));
              setEditable(false);
              setCloseSaveVisible(false);
            }}
          >
            是否保存内容
          </Modal> */}
    </React.Fragment>
  );
};
FileInfo.defaultProps = {};
export default FileInfo;
