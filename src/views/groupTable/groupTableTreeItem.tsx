import React from "react";
import "./groupTableTreeItem.css";
interface GroupTableTreeItemProps {
  setTypeDialogShow: any;
  setTreeTypeVisible: any;
}

const GroupTableTreeItem: React.FC<GroupTableTreeItemProps> = (props) => {
  const { setTypeDialogShow, setTreeTypeVisible } = props;
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
      >
        <div className="groupTableTreeItem-title">打包节点</div>
      </div>
      {/* <div
        className="groupTableTreeItem-item"
        onMouseEnter={() => {
          setTypeDialogShow(0);
        }}
      >
        <EditOutlined />
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTypeDialogShow(0);
          }}
        >
          节点重命名
        </div>
      </div>
      <div className="groupTableTreeItem-item">
        <DeleteOutline />
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTypeDialogShow(0);
          }}
        >
          删除节点
        </div>
      </div> */}
    </div>
  );
};
GroupTableTreeItem.defaultProps = {};
export default GroupTableTreeItem;
