import React from "react";
// import './userCenter.css';
import { Empty as EmptyContainer } from "antd";
interface EmptyProps {
  description?: string;
}
const Empty: React.FC<EmptyProps> = (props) => {
  const { description } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyContainer description={description ? description : "暂无数据"} />
    </div>
  );
};
Empty.defaultProps = {};
export default Empty;
