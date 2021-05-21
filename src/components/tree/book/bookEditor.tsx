import React, { useState, useRef } from "react";
import "./bookEditor.css";
import { useTypedSelector } from "../../../redux/reducer/RootState";
import { MenuTree } from "tree-graph-react";
import { Button } from "antd";
import api from "../../../services/api";
import _ from "lodash";

import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/actions/commonActions";
import { editTask } from "../../../redux/actions/taskActions";

import Dialog from "../../common/dialog";
import Editor from "../../common/editor/editor";
import Loading from "../../common/loading";
import IconFont from "../../common/iconFont";

interface BookEditorProps {
  nodeObj: any;
  gridList: any;
  targetData: any;
  selectId: string;
  onChange: Function;
  setNodeObj: Function;
  setGridList: Function;
  setSelectId: Function;
}

const BookEditor: React.FC<BookEditorProps> = (props) => {
  const {
    nodeObj,
    gridList,
    targetData,
    selectId,
    setNodeObj,
    setGridList,
    setSelectId,
  } = props;
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const dispatch = useDispatch();
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [content, setContent] = useState<any>("");
  const [editable, setEditable] = useState<any>(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const targetTreeRef: React.RefObject<any> = useRef();
  const bookRef: React.RefObject<any> = useRef();

  const chooseNode = async (node: any) => {
    let newGridList = _.cloneDeep(gridList);
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    if (nodeIndex !== -1) {
      setTargetIndex(nodeIndex);
    }
    setLoading(true);
    let taskItemRes: any = await api.task.getTaskInfo(node._key);
    if (taskItemRes.msg === "OK") {
      let taskInfo = _.cloneDeep(taskItemRes.result);
      setLoading(false);
      if (taskInfo.content) {
        setContent(taskInfo.content);
      } else {
        setContent("<p>标题:</p>");
      }
      setTargetNode(taskInfo);
      setSelectId(node._key);
    } else {
      setLoading(false);
      dispatch(setMessage(true, taskItemRes.msg, "error"));
    }
  };
  const addChildrenTask = async (selectedNode: any, type: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.role,
      parentCardKey:
        type === "child"
          ? selectedNode
          : type === "next"
          ? newNodeObj[selectedNode].father
          : "",
      type: 15,
    });
    if (addTaskRes.msg === "OK") {
      let result = addTaskRes.result;
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      let newNode: any = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        type: 15,
        contract: false,
        father: result.parentCardKey,
        sortList: result.children,
        content: "<p>标题</p>",
      };
      newNodeObj[newNode._key] = newNode;
      if (type === "child") {
        newNodeObj[selectedNode].sortList.push(newNode._key);
      } else if (type === "next") {
        newNodeObj[newNodeObj[selectedNode].father].sortList.push(newNode._key);
      }
      setContent("<p>标题</p>");
      setSelectId(newNode._key);
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      targetTreeRef.current.rename();
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const editTaskText = async (nodeId: string, text: string, type?: number) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    if (type) {
      newNodeObj[nodeId].content = text;
    } else {
      newNodeObj[nodeId].name = text;
    }
    let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    if (type) {
      newGridList[nodeIndex].content = text;
      dispatch(editTask({ key: nodeId, content: text }, 3));
    } else {
      newGridList[nodeIndex].title = text;
      dispatch(editTask({ key: nodeId, title: text }, 3));
    }
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const changeTaskContent = (value: string) => {
    value = value ? value : "<p>标题</p>";
    setContent(value);
  };
  const editTaskContent = async () => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(targetNode);
    newNodeObj[newTargetNode._key].content = content;
    let nodeIndex = _.findIndex(newGridList, { _key: newTargetNode._key });
    newGridList[nodeIndex].content = content;
    dispatch(editTask({ key: newTargetNode._key, content: content }, 3));
    dispatch(setMessage(true, "保存成功", "success"));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
    // onChange(content);
  };

  const editContract = (node: any) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    node.contract = node.contract ? false : true;
    newNodeObj[node._key].contract = !newNodeObj[node._key].contract;
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].contract = node.contract;
    dispatch(
      editTask({ key: node._key, contract: newGridList[nodeIndex].contract }, 3)
    );
    // getBookData(node._key);
    // setTargetNode(newTargetNode);
    // setNodeObj(newNodeObj);
    // setGridList(newGridList);
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    // if (taskItem.creatorGroupRole <= taskItem.groupRole) {
    let targetNodeIndex = newNodeObj[targetNode.father].sortList.indexOf(
      targetNode._key
    );
    let deleteRes: any = await api.task.deleteTask(
      targetNode._key,
      groupInfo._key
    );
    if (deleteRes.msg === "OK") {
      newNodeObj[targetNode.father].sortList.splice(targetNodeIndex, 1);
      delete newNodeObj[targetNode._key];
      newGridList.splice(targetIndex, 1);
      setSelectId(targetNode.father);
      setTargetNode(newNodeObj[targetNode.father]);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
      dispatch(setMessage(true, "删除成功", "success"));
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
    //}
  };
  return (
    <div className="book" ref={bookRef}>
      {loading ? <Loading /> : null}
      <div className="book-left">
        <div className="book-left-title">
          目录
          <Button
            size="large"
            shape="circle"
            style={{ border: "0px" }}
            ghost
            icon={
              editable ? (
                <IconFont type="icon-baocun1" />
              ) : (
                <IconFont type="icon-edit" />
              )
            }
            onClick={() => {
              setEditable(!editable);
            }}
          />
        </div>
        {nodeObj && targetData && targetData._key ? (
          <MenuTree
            disabled={!editable}
            ref={targetTreeRef}
            nodes={nodeObj}
            uncontrolled={false}
            startId={targetData._key}
            backgroundColor="#f5f5f5"
            color="#333"
            hoverColor="#595959"
            defaultSelectedId={selectId}
            handleClickNode={(node: any) => {
              chooseNode(node);
            }}
            handleAddChild={(selectedNode: any) => {
              addChildrenTask(selectedNode, "child");
            }}
            handleAddNext={(selectedNode: any) => {
              addChildrenTask(selectedNode, "next");
            }}
            handleChangeNodeText={(nodeId: string, text: string) => {
              editTaskText(nodeId, text);
            }}
            handleClickExpand={editContract}
            handleDeleteNode={(nodeId: any) => {
              setDeleteDialogShow(true);
            }}
            // itemHeight={32}
            // blockHeight={
            //   departmentRef.current ? departmentRef.current.offsetHeight : 0
            // }
          />
        ) : null}
      </div>
      <div className="book-right">
        {editable ? (
          <React.Fragment>
            <Editor
              data={content}
              height={500}
              onChange={changeTaskContent}
              editorKey={targetNode?._key}
            />
            <Button
              type="primary"
              onClick={() => {
                editTaskContent();
              }}
              className="book-editor-button"
              style={{ color: "#fff" }}
            >
              保存
            </Button>
          </React.Fragment>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          ></div>
        )}
      </div>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deleteTask();
        }}
        title={"删除任务"}
        dialogStyle={{ width: "400px", height: "200px" }}
      >
        <div className="dialog-onlyTitle">是否删除该节点</div>
      </Dialog>
    </div>
  );
};
BookEditor.defaultProps = {};
export default BookEditor;
