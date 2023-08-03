import React from "react";
// import './userCenter.css';
import FileInfo from "../../components/fileInfo/fileInfo";
interface FileFullInfoProps {}

const FileFullInfo: React.FC<FileFullInfoProps> = (props) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <FileInfo/>
    </div>
  );
};
FileFullInfo.defaultProps = {};
export default FileFullInfo;
