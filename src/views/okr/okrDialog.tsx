import React, { useState, useEffect } from "react";
import "./okrDialog.css";
import "../calendar/calendar.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import Avatar from "../../components/common/avatar";
import api from "../../services/api";
import { Input, Radio } from "antd";
import { useMount } from "../../hook/common";
import { setMessage } from "../../redux/actions/commonActions";
const { Search } = Input;
interface OkrDialogProps {
  memberList: any;
  periodList: any;
  upLevelOKey: string;
  setUpLevelOKey: any;
  upLevelKRKey: string;
  setUpLevelKRKey: any;
  fatherOkey: string;
  periodIndex?:number
}
const OkrDialog: React.FC<OkrDialogProps> = (props) => {
  const {
    memberList,
    periodList,
    upLevelOKey,
    setUpLevelOKey,
    upLevelKRKey,
    setUpLevelKRKey,
    fatherOkey,
    periodIndex
  } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const dispatch = useDispatch();
  const [memberIndex, setMemberIndex] = useState<any>(0);
  const [memberKey, setMemberKey] = useState<any>(null);
  const [okrList, setOkrList] = useState<any>([]);
  const [upMemberList, setUpMemberList] = useState<any>([]);
  useMount(() => {
    setMemberKey(user._key);
  });
  useEffect(() => {
    if (memberKey) {
      getMemberOkrList();
    }
  }, [memberKey]);
  useEffect(() => {
    if (memberList) {
      let newUpMemberList = [];
      newUpMemberList = memberList.filter((item, index) => {
        console.log(item);
        console.log(item.oCount);
        return item.oCount > 0;
      });
      setUpMemberList(newUpMemberList);
    }
  }, [memberList]);
  const getMemberOkrList = async () => {
    let okrListRes: any = await api.okr.getOKRDetail(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodList[periodIndex]._key,
      memberKey,
      2,
      fatherOkey
    );
    if (okrListRes.msg === "OK") {
      console.log(okrListRes.result);
      setOkrList([...okrListRes.result]);
    } else {
      dispatch(setMessage(true, okrListRes.msg, "error"));
    }
  };
  const onSearch = () => {};
  return (
    <div className="oDialog-container">
      <div className="oDialog-left">
        <div className="oDialog-left-top">
          <Search placeholder="请输入用户名" onSearch={onSearch} />
        </div>
        {upMemberList
          ? upMemberList.map((memberItem: any, index: number) => {
              return (
                <div
                  className="oDialog-left-item"
                  onClick={() => {
                    setMemberIndex(index);
                    setMemberKey(memberItem.userKey);
                  }}
                  key={"member" + index}
                  style={
                    memberIndex === index ? { backgroundColor: "#f0f0f0" } : {}
                  }
                >
                  <div className="oDialog-left-logo">
                    <Avatar
                      name={memberItem.nickName}
                      avatar={memberItem.avatar}
                      type={"person"}
                      index={index}
                      size={35}
                    />
                  </div>
                  <div className="oDialog-left-title toLong">
                    {memberItem.nickName} ({memberItem.oCount})
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="oDialog-right">
        {okrList.map((item, index) => {
          return (
            <div key={"oItem" + index} className="oDialog-right-item">
              <div className="oDialog-right-o">
                <Radio
                  checked={upLevelOKey === item._key}
                  onChange={() => {
                    setUpLevelOKey(item._key);
                    setUpLevelKRKey(null);
                  }}
                >
                  {item.title}
                </Radio>
              </div>
              {item.krs.map((krItem, krIndex) => {
                return (
                  <div key={"oItem" + krIndex} className="oDialog-right-kr">
                    <Radio
                      checked={upLevelKRKey === krItem._key}
                      onChange={() => {
                        setUpLevelKRKey(krItem._key);
                        setUpLevelOKey(item._key);
                      }}
                    >
                      {krItem.title}
                    </Radio>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
OkrDialog.defaultProps = {};
export default OkrDialog;
