import React from "react";
import moment from "moment";
import "./comment.css";
import Avatar from "../common/avatar";
interface CommentProps {
  commentItem: any;
  commentClick: any;
  commentIndex: number;
}

const Comment: React.FC<CommentProps> = (prop) => {
  const { commentItem, commentClick, commentIndex } = prop;

  const time = moment(commentItem.createTime).format("YYYY-MM-DD HH:mm");
  return (
    <div className="commentItem">
      <div className="commentItem-avatar">
        <Avatar
          name={commentItem.etc.name}
          avatar={commentItem.etc.avatar}
          type={"person"}
          index={commentIndex}
          size={34}
        />
      </div>
      <div className="commentItem-content">
        <div className="commentItem-content-title">
          <div className="commentItem-content-name">{commentItem.etc.name}</div>
          <div className="commentItem-content-time">{time}</div>
        </div>
        <div className="commentItem-content-info">{commentItem.content}</div>
      </div>
      <div
        className="commentItem-content-button"
        onClick={() => {
          commentClick(commentIndex, commentItem._key);
        }}
      >
        删除
      </div>
    </div>
  );
};
export default Comment;
