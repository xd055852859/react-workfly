import React, { useState, useEffect } from "react";
import "./okrTable.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HolderOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Input, Button } from "antd";
import Avatar from "../../components/common/avatar";
import Empty from "../../components/common/empty";
import api from "../../services/api";
import _ from "lodash";
import OkrItem from "./okrItem";
import { setMessage } from "../../redux/actions/commonActions";
import Comment from "../../components/comment/comment";

const { TextArea } = Input;
interface OkrTableProps {
  okrList: any;
  changeOkrList: any;
  memberList: any;
  periodList: any;
  periodIndex: number;
  periodKey:string;
  flashOkr: any;
  nodeKey: string;
  memberKey: string;
  memberRole: number;
  targetRole: number;
}
const OkrTable: React.FC<OkrTableProps> = (props) => {
  const {
    okrList,
    memberList,
    periodList,
    periodIndex,
    periodKey,
    flashOkr,
    changeOkrList,
    nodeKey,
    memberKey,
    memberRole,
    targetRole,
  } = props;

  const user = useTypedSelector((state) => state.auth.user);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const dispatch = useDispatch();
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [commentInput, setCommentInput] = useState("");
  const [dragKey, setDragKey] = useState("");
  const [chooseOKey, setChooseOKey] = useState("");

  const [drawVisible, setDrawVisible] = useState(false);
  useEffect(() => {
    if (nodeKey) {
      getComment();
    }

    //eslint-disable-next-line
  }, [nodeKey]);
  const getComment = async () => {
    let commentRes: any = await api.task.getTaskComment(nodeKey, 1, 1000);
    if (commentRes.msg === "OK") {
      setTaskCommentArray([...commentRes.result]);
    } else {
      dispatch(setMessage(true, commentRes.msg, "error"));
    }
  };
  const saveCommentMsg = async () => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    if (commentInput !== "") {
      let saveRes: any = await api.task.addComment(nodeKey, commentInput);
      if (saveRes.msg === "OK") {
        dispatch(setMessage(true, "评论成功", "success"));
        newCommentArray.unshift(saveRes.result);
        setTaskCommentArray([...newCommentArray]);
        setCommentInput("");
      } else {
        dispatch(setMessage(true, saveRes.msg, "error"));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === "OK") {
      dispatch(setMessage(true, "删除评论成功", "success"));
      newCommentArray.splice(commentIndex, 1);
      setTaskCommentArray([...newCommentArray]);
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };
  const onDragEnd = async (result: any) => {
    let newOkrList = _.cloneDeep(okrList);
    let newchildren = [];
    let item = _.cloneDeep(newOkrList[result.source.index]);
    newOkrList.splice(result.source.index, 1);
    newOkrList.splice(result.destination.index, 0, item);
    changeOkrList(null, "", "", newOkrList);
    newOkrList.forEach((item) => {
      newchildren.push(item._key);
    });

    let dragRes: any = await api.okr.updateOOrKROrder({
      enterpriseGroupKey: mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey: periodKey,
      targetUKey: memberKey,
      newChildrenOrder: newchildren.reverse(),
    });
    if (dragRes.msg === "OK") {
      console.log(dragRes);
    } else {
      dispatch(setMessage(true, dragRes.msg, "error"));
    }
  };
  return (
    <>
      {okrList.length > 0 ? (
        <div
          className="okr-tableItem"
          style={{ width: drawVisible ? "calc(100% - 430px)" : "100%" }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={"droppable"}>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {okrList.map((item, index) => {
                    return (
                      <Draggable
                        key={"oDrag" + index}
                        draggableId={"oDrag" + index}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className="okrTable-drag"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            onMouseEnter={() => {
                              setDragKey("oDrag" + index);
                            }}
                            onMouseLeave={() => {
                              setDragKey("");
                            }}
                            onClick={() => {
                              setChooseOKey(item._key);
                            }}
                          >
                            {dragKey === "oDrag" + index ? (
                              <div
                                className="okrTable-drag-handle"
                                {...provided.dragHandleProps}
                              >
                                <HolderOutlined />
                              </div>
                            ) : null}
                            <OkrItem
                              item={item}
                              index={index}
                              {...props}
                              setDrawVisible={setDrawVisible}
                              chooseOKey={chooseOKey}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="comment-title">
            评论 ( {taskCommentArray.length} )
          </div>
          <div className="comment-input">
            <Avatar
              avatar={user?.profile?.avatar}
              name={user?.profile?.nickName}
              type={"person"}
              index={0}
              size={40}
            />
            <TextArea
              value={commentInput}
              onChange={(e) => {
                setCommentInput(e.target.value);
              }}
              placeholder="添加评论"
              autoSize={{ minRows: 3 }}
              style={{ width: "calc(100% - 50px)", borderRadius: "4px" }}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              type="primary"
              onClick={saveCommentMsg}
              disabled={commentInput ? false : true}
            >
              提交
            </Button>
          </div>
          <div
            style={{
              margin: "15px 0px",
              width: "100%",
              padding: "0px 10px",
              boxSizing: "border-box",
            }}
          >
            {taskCommentArray.map((commentItem: any, commentIndex: number) => {
              return (
                <Comment
                  commentItem={commentItem}
                  commentIndex={commentIndex}
                  key={"comment" + commentIndex}
                  commentClick={deleteCommentMsg}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <Empty description="暂无OKR" />
      )}
    </>
  );
};
OkrTable.defaultProps = {};
export default OkrTable;
