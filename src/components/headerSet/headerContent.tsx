import React, { useState, useRef, useCallback } from "react";
import "./headerSet.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Switch, Drawer, Modal } from "antd";
import api from "../../services/api";
import _ from "lodash";
import { useMount } from "../../hook/common";

import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import { setTheme } from "../../redux/actions/authActions";
import { setWorkHeaderIndex } from "../../redux/actions/memberActions";

import UserCenter from "../userCenter/userCenter";
import Vitality from "../vitality/vitality";
import HeaderBg from "./headerBg";

import set5Svg from "../../assets/svg/set5.svg";
import set6Svg from "../../assets/svg/set6.svg";
import set8Svg from "../../assets/svg/set8.svg";
import set9Svg from "../../assets/svg/set9.svg";
// import set11Svg from "../../assets/svg/set11.svg";
import rightArrowPng from "../../assets/img/rightArrow.png";
import logoutPng from "../../assets/img/logout.png";
import fireBlueSvg from "../../assets/svg/fireBlue.svg";
import bgImg from "../../assets/img/bgImg.png";
import { useAuth } from "../../context/auth";
declare var window: Window 
interface HeaderContentProps {
  type?: string;
  setChooseKey?:any
}

const HeaderContent: React.FC<HeaderContentProps> = (prop) => {
  const { type,setChooseKey } = prop;
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useTypedSelector((state) => state.auth.user);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const socket = useTypedSelector((state) => state.auth.socket);
  const [moveType, setMoveType] = useState(0);
  const [showVitality, setShowVitality] = useState(false);
  const [targetInfo, setTargetInfo] = useState<any>(null);
  let unDistory = useRef<any>(true);
  let { deviceType } = useAuth();
  const getVitalityInfo = useCallback(async () => {
    let res: any = await api.auth.getTargetUserInfo(userKey);
    if (unDistory.current) {
      if (res.msg === "OK") {
        setTargetInfo(res.result);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  }, [userKey, dispatch]);
  useMount(() => {
    getVitalityInfo();
    return () => {
      unDistory.current = false;
    };
  });

  const changeBoard = (type: string, checked: boolean) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = checked;
    dispatch(setTheme(newTheme));
    localStorage.setItem(type, checked + "");
  };

  const logout = async () => {
    localStorage.clear();
    socket.emit("logout", user._key);
    dispatch(setMessage(true, "退出登录成功", "success"));
    history.push("/");
  };

  return (
    <React.Fragment>
      {/* <Tabs defaultActiveKey="1">
        <TabPane tab="设置" key="1"> */}
      {type === "phone" ? (
        <div className="contentHeader-set-phone">
          <div
            className="contentHeader-phone-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setMoveType(1);
            }}
          >
            {user ? <img src={user.profile.avatar} alt="" /> : null}
          </div>
          <div
            className="contentHeader-phone-title"
            onClick={() => {
              // setShowVitality(true);
              if (type !== "phone") {
                dispatch(setCommonHeaderIndex(1));
                dispatch(setWorkHeaderIndex(5));
              }
            }}
          >
            <div className="contentHeader-set-item-bg-info">
              <img
                src={set6Svg}
                alt=""
                style={{
                  width: "15px",
                  height: "17px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMoveType(1);
                }}
              />
              <div>{user?.profile?.nickName}</div>
            </div>
            <div className="bg-item-right">
              <img
                src={fireBlueSvg}
                alt=""
                className="contentHeader-set-numImg"
              />
              <div style={{ color: "#1890ff" }}>
                活力 {targetInfo && targetInfo.energyValueTotal}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="contentHeader-set-title">
          <div
            className="contentHeader-set-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setMoveType(1);
            }}
          >
            {user ? <img src={user.profile.avatar} alt="" /> : null}
          </div>
          <div
            className="contentHeader-set-item contentHeader-set-vitality"
            onClick={() => {
              // setShowVitality(true);
              if (type !== "phone") {
                dispatch(setCommonHeaderIndex(1));
                dispatch(setWorkHeaderIndex(6));
              }
            }}
          >
            <div className="contentHeader-set-item-bg-info">
              <img
                src={set6Svg}
                alt=""
                style={{
                  width: "15px",
                  height: "17px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMoveType(1);
                }}
              />
              <div>{user?.profile?.nickName}</div>
            </div>
            <div className="bg-item-right">
              <img
                src={fireBlueSvg}
                alt=""
                className="contentHeader-set-numImg"
              />
              <div style={{ color: "#1890ff", fontSize: "12px" }}>
                活力 {targetInfo && targetInfo.energyValueTotal}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="contentHeader-set-item"
        onClick={() => {
          setMoveType(2);
        }}
        style={{ color: type === "phone" ? "#fff" : "#000" }}
      >
        <div className="contentHeader-set-item-bg-info">
          <img
            src={bgImg}
            alt=""
            style={{
              width: "15px",
              height: "17px",
              marginRight: "10px",
            }}
          />
          <div>壁纸设置</div>
        </div>
        <div className="bg-item-right">
          <div
            className="bg-item"
            style={{
              backgroundImage: theme.backgroundImg
                ? "url(" +
                  theme.backgroundImg +
                  "?imageMogr2/auto-orient/thumbnail/80x)"
                : "",
              backgroundColor: !theme.backgroundImg
                ? theme.backgroundColor
                : "",
              marginBottom: "0px",
              width: "44px",
              height: "25px",
            }}
          ></div>
          <img
            src={rightArrowPng}
            alt=""
            style={{
              width: "7px",
              height: "11px",
              marginLeft: "5px",
            }}
          />
        </div>
      </div>

      {/* <div
        className="contentHeader-set-item"
        onClick={() => {
          setMoveType(5);
        }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set11Svg}
            alt=""
            style={{
              width: '20px',
              height: '15px',
              marginRight: '5px',
            }}
          />
          <div>首页设置</div>
        </div>
        <img
          src={rightArrowPng}
          alt=""
          style={{
            width: '7px',
            height: '11px',
            marginLeft: '5px',
          }}
        />
      </div> */}
      {/* <div className="contentHeader-set-item">
        <div className="contentHeader-set-item-title">
          <img
            src={set4Png}
            alt=""
            style={{
              width: "20px",
              height: "15px",
              marginRight: "5px",
            }}
          />
          <div>日程</div>
        </div>
        <div>
          <Switch
            checked={theme.calendarVisible ? true : false}
            onChange={(checked) => {
              changeBoard("calendarVisible", checked);
            }}
          />
        </div>
      </div> */}
      <div
        className="contentHeader-set-item"
        style={{ color: type === "phone" ? "#fff" : "#000" }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set5Svg}
            alt=""
            style={{
              width: "19px",
              height: "18px",
              marginRight: "6px",
            }}
          />
          <div>任务时长</div>
        </div>
        <div>
          <Switch
            checked={theme.hourVisible ? true : false}
            onChange={(checked) => {
              changeBoard("hourVisible", checked);
            }}
          />
        </div>
      </div>
      {/* <div className="contentHeader-set-item">
        <div className="contentHeader-set-item-title">
          <img
            src={set11Svg}
            alt=""
            style={{
              width: "20px",
              height: "15px",
              marginRight: "5px",
            }}
          />
          <div>语音消息</div>
        </div>
        <div>
          <Switch
            checked={theme.soundVisible ? true : false}
            onChange={(checked) => {
              changeBoard("soundVisible", checked);
            }}
          />
        </div> 
      </div>*/}
      <div
        className="contentHeader-set-item"
        onClick={() => {
          window.open("https://workfly.cn/help/1");
        }}
        style={{ color: type === "phone" ? "#fff" : "#000" }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set9Svg}
            alt=""
            style={{
              width: "17px",
              height: "20px",
              marginRight: "8px",
            }}
          />
          <div>帮助</div>
        </div>
      </div>
      <div
        className="contentHeader-set-item"
        onClick={() => {
          window.open("https://workfly.cn/home/download");
        }}
        style={{ color: type === "phone" ? "#fff" : "#000" }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set8Svg}
            alt=""
            style={{
              width: "17px",
              height: "20px",
              marginRight: "8px",
            }}
          />
          <div>下载</div>
        </div>
      </div>
      {deviceType !== "tool" ? (
        <div
          className="contentHeader-set-item"
          style={{ color: type === "phone" ? "#fff" : "#000" }}
        >
          <div
            className="contentHeader-set-item-title"
            onClick={() => {
              logout();
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={logoutPng}
              alt=""
              style={{
                width: "16px",
                height: "15px",
                marginRight: "5px",
              }}
            />
            <div>退出登录</div>
          </div>
        </div>
      ) : null}
      {/* </TabPane> */}
      {/* <TabPane tab="文件" key="2">
          <FileList
            groupKey={''}
            type="最近"
            fileHeight={document.body.clientHeight - 70}
            fileItemWidth={'calc(100% - 270px)'}
          />
        </TabPane>
        <TabPane tab="收藏" key="3">
          <FileList
            groupKey={mainGroupKey}
            type="收藏"
            fileHeight={document.body.clientHeight - 70}
            fileItemWidth={'calc(100% - 270px)'}
          />
        </TabPane>       
      </Tabs> */}
      <Drawer
        visible={moveType === 1}
        onClose={() => {
          setMoveType(0);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={deviceType !== "tool" ? 280 : 400}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        title={"用户设置"}
      >
        <UserCenter
          onClose={() => {
            setMoveType(0);
          }}
        />
      </Drawer>
      <Drawer
        visible={moveType === 2}
        onClose={() => {
          setMoveType(0);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={deviceType !== "tool" ? 280 : 400}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        destroyOnClose={true}
        title={"壁纸设置"}
      >
        <HeaderBg setChooseWallKey={setChooseKey}/>
      </Drawer>

      <Modal
        visible={showVitality}
        onCancel={() => {
          setShowVitality(false);
        }}
        footer={null}
        title={"活力值"}
        centered={true}
        width="90%"
        wrapClassName="modal-box"
        bodyStyle={{
          height: "85vh",
          overflow: "auto",
        }}
      >
        <Vitality
          vitalityType={1}
          vitalityKey={user._key}
          fatherVitalityInfo={targetInfo}
        />
      </Modal>
    </React.Fragment>
  );
};
HeaderContent.defaultProps = {};
export default HeaderContent;
