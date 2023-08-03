import React, { useState } from "react";
import "./phoneHome.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMount } from "../../hook/common";
import { useAuth } from "../../context/auth";
import { is_mobile } from "../../services/util";
import { useTypedSelector } from "../../redux/reducer/RootState";

import { setFilterObject } from "../../redux/actions/taskActions";
import { getGroupMember } from "../../redux/actions/memberActions";
import { changeMusic } from "../../redux/actions/authActions";
import {
  changeContentVisible,
  setMessage,
} from "../../redux/actions/commonActions";
import { setGroupKey, getGroupInfo } from "../../redux/actions/groupActions";

import Create from "../create/create";
import Contact from "../contact/contact";
import HeaderContent from "../../components/headerSet/headerContent";
import PhoneContent from "./phoneContent";
import PhoneTree from "./phoneTree";
import { useEffect } from "react";

interface PhoneHomeProps {}

const PhoneHome: React.FC<PhoneHomeProps> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.auth.theme);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const [homeIndex, setHomeIndex] = useState(0);
  const [phoneKey, setPhoneKey] = useState("");

  const { deviceState } = useAuth();

  useMount(() => {
    if (!is_mobile() && deviceState !== "xxs") {
      history.push("/home/basic");
    }
    let homeIndex = 0;
    let contactKey = "";
    localStorage.removeItem("createType");
    dispatch(changeMusic(0));
    dispatch(changeContentVisible(false));
    if (localStorage.getItem("homeIndex")) {
      homeIndex = +(localStorage.getItem("homeIndex") as string);
      contactKey = localStorage.getItem("contactKey") as string;
      switch (homeIndex) {
        case 5:
          changeHomeIndex(1, contactKey, 2);
          break;
        case 6:
          changeHomeIndex(0, contactKey, 2);
          break;
        case 7:
          dispatch(setGroupKey(contactKey));
          dispatch(getGroupInfo(contactKey));
          setHomeIndex(7);
          break;
        default:
          setHomeIndex(homeIndex);
      }
    }
  });
  useEffect(() => {
    if (theme) {
      dispatch(setFilterObject(theme.filterObject));
    }
    //eslint-disable-next-line
  }, [theme?.filterObject, dispatch]);
  useEffect(() => {
    localStorage.setItem("homeIndex", homeIndex + "");
    //eslint-disable-next-line
  }, [homeIndex]);
  const changeHomeIndex = (type: number, key: string, frozenStatus: number) => {
    if (frozenStatus === 1) {
      dispatch(setMessage(true, "企业账号冻结，请联系平台客服。", "warning"));
    } else {
      setPhoneKey(key);
      localStorage.setItem("contactKey", key);
      if (type) {
        dispatch(setFilterObject(theme.filterObject));
        setHomeIndex(5);
      } else {
        dispatch(getGroupMember(key, 4));
        setHomeIndex(6);
      }
    }
  };
  useEffect(() => {
    if (groupMemberItem) {
      dispatch(setFilterObject(groupMemberItem.config));
    }
  }, [groupMemberItem, dispatch]);
  return (
    <div className="phoneHome">
      <div className="phoneHome-top">
        {homeIndex === 0 ? <Create type="phone" /> : null}
        {homeIndex === 1 ? (
          <Contact
            contactIndex={0}
            type="phone"
            changeHomeIndex={changeHomeIndex}
          />
        ) : null}
        {homeIndex === 2 ? (
          <Contact
            contactIndex={1}
            type="phone"
            changeHomeIndex={changeHomeIndex}
          />
        ) : null}
        {homeIndex === 3 ? (
          <PhoneContent contactKey={userKey} type={"owner"} />
        ) : null}
        {homeIndex === 4 ? <HeaderContent type="phone" /> : null}
        {homeIndex === 5 ? (
          <PhoneContent contactKey={phoneKey} type={"person"} />
        ) : null}
        {homeIndex === 6 ? (
          <PhoneContent
            contactKey={phoneKey}
            type={"group"}
            setHomeIndex={setHomeIndex}
          />
        ) : null}
        {homeIndex === 7 ? (
          <PhoneTree setHomeIndex={setHomeIndex}/>
        ) : null}
      </div>
      <div className="phoneHome-bottom">
        <div
          className="phoneHome-bottom-item"
          onClick={() => {
            setHomeIndex(0);
          }}
          style={{ color: homeIndex === 0 ? "#1899ff" : "#fff" }}
        >
          首页
        </div>
        <div
          className="phoneHome-bottom-item"
          onClick={() => {
            setHomeIndex(1);
          }}
          style={{
            color:
              homeIndex === 1 || homeIndex === 6 || homeIndex === 7
                ? "#1899ff"
                : "#fff",
          }}
        >
          项目
        </div>
        <div
          className="phoneHome-bottom-item"
          onClick={() => {
            setHomeIndex(2);
          }}
          style={{
            color: homeIndex === 2 || homeIndex === 5 ? "#1899ff" : "#fff",
          }}
        >
          队友
        </div>
        <div
          className="phoneHome-bottom-item"
          onClick={() => {
            setHomeIndex(3);
          }}
          style={{ color: homeIndex === 3 ? "#1899ff" : "#fff" }}
        >
          任务
        </div>
        <div
          className="phoneHome-bottom-item"
          onClick={() => {
            setHomeIndex(4);
          }}
          style={{ color: homeIndex === 4 ? "#1899ff" : "#fff" }}
        >
          我
        </div>
      </div>
    </div>
  );
};
PhoneHome.defaultProps = {};
export default PhoneHome;
