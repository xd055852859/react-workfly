import React from "react";
import "./groupTableTreeItem.css";

interface GroupTableTreeItemProps {
  setTypeDialogShow: any;
  setTreeTypeVisible: any;
  targetNode: any;
  reflashNode: any;
}

const GroupTableTreeItem: React.FC<GroupTableTreeItemProps> = (props) => {
  const { setTypeDialogShow, setTreeTypeVisible, targetNode } = props;
  return (
    <div className="groupTableTreeItem">
      <div className="groupTableTreeItem-item">
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTreeTypeVisible(2);
          }}
        >
          新建节点
        </div>
      </div>
      <div className="groupTableTreeItem-item">
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTreeTypeVisible(1);
          }}
        >
          新建子节点
        </div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          setTypeDialogShow(1);
        }}
        onMouseEnter={() => {
          setTreeTypeVisible(0);
        }}
      >
        <div className="groupTableTreeItem-title">批量导入</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          setTypeDialogShow(2);
        }}
      >
        <div className="groupTableTreeItem-title">还原节点</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          setTypeDialogShow(3);
        }}
        onMouseEnter={() => {
          setTreeTypeVisible(0);
        }}
      >
        <div className="groupTableTreeItem-title">
          {targetNode?.extraData?.pack ? "解包" : "打包"}节点
        </div>
      </div>
      <div className="groupTableTreeItem-item">
        <div
          className="groupTableTreeItem-title"
          onClick={() => {
            setTypeDialogShow(4);
          }}
          onMouseEnter={() => {
            setTreeTypeVisible(0);
          }}
        >
          删除节点
        </div>
      </div>
    </div>
  );
};
GroupTableTreeItem.defaultProps = {};
export default GroupTableTreeItem;
