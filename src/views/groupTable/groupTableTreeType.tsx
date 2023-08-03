import React from "react";
import "./groupTableTreeItem.css";

interface GroupTableTreeTypeProps {
  targetNodeKey?: any;
  addChildrenTask?: any;
  typeshow?: number;
  setTreeTypeVisible?: any;
}

const GroupTableTreeType: React.FC<GroupTableTreeTypeProps> = (props) => {
  const { targetNodeKey, addChildrenTask, typeshow, setTreeTypeVisible } =
    props;
  return (
    <div
      className="groupTableTreeType"
      onMouseLeave={() => {
        setTreeTypeVisible(false);
      }}
    >
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 1);
        }}
      >
        <div className="groupTableTreeItem-title">新建节点</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 6);
        }}
      >
        <div className="groupTableTreeItem-title">新建任务</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 10);
        }}
      >
        <div className="groupTableTreeItem-title">新建文档</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 11);
        }}
      >
        <div className="groupTableTreeItem-title">新建绘图</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 12);
        }}
      >
        <div className="groupTableTreeItem-title">新建表格</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 13);
        }}
      >
        <div className="groupTableTreeItem-title">新建MD</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 14);
        }}
      >
        <div className="groupTableTreeItem-title">新建链接</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 15);
        }}
      >
        <div className="groupTableTreeItem-title">新建电子书</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? "child" : "next", 16);
        }}
      >
        <div className="groupTableTreeItem-title">新建PPT</div>
      </div>
    </div>
  );
};
GroupTableTreeType.defaultProps = {};
export default GroupTableTreeType;
