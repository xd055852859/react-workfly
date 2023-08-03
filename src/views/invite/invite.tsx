import React, { useState, useEffect } from "react";
// import './userCenter.css';
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Input, Button } from "antd";
import _ from "lodash";
import api from "../../services/api";

import { setMessage } from "../../redux/actions/commonActions";
import { getGroup } from "../../redux/actions/groupActions";
interface InviteProps {
  searchList?: any;
  searchIndex?: number;
  setSearchList?: any;
  groupKey: string;
  onClose: any;
}

const Invite: React.FC<InviteProps> = (props) => {
  const { searchList, searchIndex, setSearchList, groupKey, onClose } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isHasPassword, setIsHasPassword] = useState(false);
  const [question, setQuestion] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [joinType, setJoinType] = useState(0);
  useEffect(() => {
    if (user) {
      getJoinGroup();
    }
    //eslint-disable-next-line
  }, [user]);
  const getJoinGroup = async () => {
    let groupRes: any = await api.group.getGroupInfo(groupKey);
    if (groupRes.msg === "OK") {
      localStorage.removeItem("inviteKey");
      let newGroupInfo = groupRes.result;
      setJoinType(newGroupInfo.joinType);
      if (newGroupInfo.joinType) {
        if (searchList) {
          let newSearchList = _.cloneDeep(searchList);
          newSearchList.splice(searchIndex, 1);
          setSearchList(newSearchList);
        }
        setQuestion(newGroupInfo.question);
        setIsHasPassword(newGroupInfo.isHasPassword);
      } else {
        let groupMemberRes: any = await api.group.addGroupMember(groupKey, [
          {
            userKey: user?._key,
            nickName: user?.profile.nickName,
            avatar: user?.profile.avatar,
            gender: user?.profile.gender,
            role: newGroupInfo.defaultPower,
          },
        ]);
        if (groupMemberRes.msg === "OK") {
          dispatch(setMessage(true, "加入项目成功", "success"));
          dispatch(getGroup(3));
          onClose(false);
        } else {
          dispatch(setMessage(true, groupMemberRes.msg, "error"));
        }
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const applyJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.applyJoinGroup(groupKey);
    if (memberRes.msg === "OK") {
      dispatch(setMessage(true, "申请加项目成功", "success"));
      onClose(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  const passwordJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.passwordJoinGroup(
      groupKey,
      passwordInput
    );
    if (memberRes.msg === "OK") {
      if (searchList) {
        let newSearchList = _.cloneDeep(searchList);
        newSearchList.splice(searchIndex, 1);
        setSearchList(newSearchList);
      }
      dispatch(setMessage(true, "口令加项目成功", "success"));
      dispatch(getGroup(3));
      onClose(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  return (
    <div className="invite-container">
      {joinType ? (
        <React.Fragment>
          {isHasPassword ? (
            <div style={{ width: "100%" }}>
              {question ? <div>{question} :</div> : null}
              <Input
                placeholder="口令"
                style={{
                  marginTop: question ? "15px" : "5px",
                  width: "100%",
                }}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                }}
                value={passwordInput}
              />
            </div>
          ) : null}
          <div
            className="invite-button"
            style={
              isHasPassword
                ? { justifyContent: "space-between" }
                : { justifyContent: "center" }
            }
          >
            {isHasPassword ? (
              <Button
                type="primary"
                onClick={() => {
                  passwordJoinGroup(groupKey);
                }}
              >
                口令加项目
              </Button>
            ) : null}
            {joinType === 1 ? (
              <Button
                type="primary"
                onClick={() => {
                  applyJoinGroup(groupKey);
                }}
              >
                申请加项目
              </Button>
            ) : null}
          </div>
        </React.Fragment>
      ) : (
        <div>加入中...</div>
      )}
    </div>
  );
};
Invite.defaultProps = {};
export default Invite;
