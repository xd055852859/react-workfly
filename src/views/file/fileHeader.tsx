import React, { useState, useRef } from "react";
import "./fileHeader.css";
import { DownOutlined } from "@ant-design/icons";
import lineMagicSvg from "../../assets/svg/lineMagic.svg";
import DropMenu from "../../components/common/dropMenu";
// import calendarHomePng from '../../assets/img/calendarHome.png';
interface FileHeaderProps {
  changeFileType: any;
}

const FileHeader: React.FC<FileHeaderProps> = (props) => {
  const { changeFileType } = props;
  const [workVisible, setWorkVisible] = useState(false);
  const [workIndex, setWorkIndex] = useState(0);
  const workMenuRef = useRef<any>(["最近文件", "我的网摘", "文档收藏"]);
  const workMenu = (
    <React.Fragment>
      {workMenuRef.current.map((item, index) => {
        return (
          <div
            className="home-item"
            onClick={() => {
              changeFileType(index);
              setWorkIndex(index);
            }}
            key={"workMenu" + index}
          >
            {item}
          </div>
        );
      })}
    </React.Fragment>
  );
  return (
    <div className="fileHeader">
      {/* <img src={calendarHomePng} alt="" className="calendarHeader-logo" /> */}
      <div style={{ marginRight: "20px" }}>文档</div>
      <div
        className="dropMenu-upBox"
        onMouseEnter={() => {
          setWorkVisible(true);
        }}
        onMouseLeave={() => {
          setWorkVisible(false);
        }}
      >
        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <img
            src={lineMagicSvg}
            alt=""
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          <span style={{ marginRight: "5px" }}>
            {workMenuRef.current[workIndex]}
          </span>
          <DownOutlined />
          <DropMenu
            visible={workVisible}
            dropStyle={{
              width: "250px",
              height: "180px",
              top: "55px",
              left: "0px",
              color: "#333",
              overflow: "visible",
            }}
            onClose={() => {
              setWorkVisible(false);
            }}
            title={"筛选列表"}
          >
            {workMenu}
          </DropMenu>
        </div>
      </div>
    </div>
  );
};
FileHeader.defaultProps = {};
export default FileHeader;
