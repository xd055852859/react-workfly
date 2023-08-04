import React, { useState, useEffect, useRef, useCallback } from "react";
import "./showPage.css";
import {
  Checkbox,
  Button,
  Tooltip,
  Switch,
  Input,
  Avatar,
  Drawer,
  Modal,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";

import moment from "moment";
import _ from "lodash";
import api from "../../services/api";

import { getSelfTask } from "../../redux/actions/taskActions";
import { setTheme } from "../../redux/actions/authActions";
import {
  setMessage,
  setCommonHeaderIndex,
  changeContentVisible,
} from "../../redux/actions/commonActions";
import { getGroup } from "../../redux/actions/groupActions";

import MainBoard from "../board/mainBoard";

import HeaderBg from "../../components/headerSet/headerBg";
import HeaderCreate from "../../components/headerSet/headerCreate";
import DropMenu from "../../components/common/dropMenu";
import FileList from "../../components/fileList/fileList";
import FileInfo from "../../components/fileInfo/fileInfo";
import TimePoint from "./timePoint";

import infoPng from "../../assets/img/info.png";
import logoSvg from "../../assets/svg/logo.svg";
import rightArrowPng from "../../assets/img/rightArrow.png";
import radioCheckPng from "../../assets/img/radioCheck.png";
import unradioCheckPng from "../../assets/img/unradioCheck.png";
import search1Svg from "../../assets/svg/search1.svg";
import search2Svg from "../../assets/svg/search2.svg";
import search3Svg from "../../assets/svg/search3.svg";
import search4Svg from "../../assets/svg/search4.svg";
import showAddSvg from "../../assets/svg/showAdd.svg";
import linkIconSvg from "../../assets/svg/linkIcon.svg";
import { useMount } from "../../hook/common";
import axios from "axios";

interface ShowPageProps {
  changeShowType: any;
}
declare var window: Window;
const ShowPage: React.FC<ShowPageProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  // const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const fileVisible = useTypedSelector((state) => state.common.fileVisible);

  const [prompt, setPrompt] = useState();
  const [moveType, setMoveType] = useState(false);
  const [showPageState, setShowPageState] = useState(false);

  const [chooseWallKey, setChooseWallKey] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [urlVisible, setUrlVisible] = useState(false);
  const [bg, setBg] = useState<any>("");
  const [menuShow, setMenuShow] = useState(0);

  const [addVisible, setAddVisible] = useState(false);
  const [searchIconVisible, setSearchIconVisible] = useState(false);
  const [urlName, setUrlName] = useState<any>("");
  const [url, setUrl] = useState<any>("");

  const [weatherObj, setWeatherObj] = useState<any>({});
  const showPageRef: React.RefObject<any> = useRef();

  const searchImgArr = [search2Svg, search1Svg, search3Svg, search4Svg];

  let unDistory = useRef<any>(true);

  useMount(() => {
    let index: any = localStorage.getItem("searchIndex")
      ? localStorage.getItem("searchIndex")
      : "0";
    setSearchIndex(parseInt(index));
    if (localStorage.getItem("bg")) {
      setBg(localStorage.getItem("bg"));
    }
    localStorage.removeItem("showType");
    // getSocket();
    localStorage.setItem("headerIndex", "1");
    dispatch(changeContentVisible(false));
    return () => {
      unDistory.current = false;
    };
  });

  const getPrompt = async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (unDistory.current) {
      if (promptRes.msg === "OK") {
        setPrompt(promptRes.result.content);
      } else {
        dispatch(setMessage(true, promptRes.msg, "error"));
      }
    }
  };
  const getWeather = async () => {
    let newWeatherObj: any = {};
    // let weatherRes: any = await api.common.getWeather(
    //   user?.profile.lo,
    //   user?.profile.la
    // );
    // if (unDistory.current) {
    //   if (weatherRes.msg === "OK") {
    //     newWeatherObj = _.cloneDeep(weatherRes.result);
    //     setWeatherObj(newWeatherObj);
    //   } else {
    //     dispatch(setMessage(true, weatherRes.msg, "error"));
    //   }
    // }
    let weatherRes: any = await axios
      .get("https://api.vvhan.com/api/weather")
      .then((response) => {
        let data = response.data;
        if (data?.success) {
          setWeatherObj(data);
          console.log(data);
        }
      });
    console.log(weatherRes);
  };
  useEffect(() => {
    if (user) {
      getPrompt();
      dispatch(setCommonHeaderIndex(1));
      dispatch(getGroup(3));
      // if (
      //   parseInt(user.profile.lo) !== user.profile.lo &&
      //   parseInt(user.profile.la) !== user.profile.la &&
      //   user.profile.la &&
      //   user.profile.lo
      // ) {
      getWeather();
      // }
    }
  }, [user]);
  useEffect(() => {
    console.log(">>>>>");
    if (theme.backgroundImg) {
      localStorage.setItem("url", theme.backgroundImg);
      setBg(theme.backgroundImg);
    } else {
      setBg("");
      localStorage.removeItem("url");
    }
    if (!theme.taskShow) {
      setMenuShow(1);
    } else {
      setMenuShow(0);
    }
    if (!theme.fileShow) {
      setMenuShow(0);
    } else {
      setMenuShow(1);
    }
  }, [theme]);
  useEffect(() => {
    console.log(">>>>>");
    if (theme.backgroundImg) {
      localStorage.setItem("url", theme.backgroundImg);
      setBg(theme.backgroundImg);
    } else {
      setBg("");
      localStorage.removeItem("url");
    }
  }, [theme.backgroundImg]);
  useEffect(() => {
    if (theme.taskShow) {
      setMenuShow(0);
    } else if (!theme.taskShow && theme.fileShow) {
      setMenuShow(1);
    }
  }, [theme.fileShow, theme.taskShow]);
  // const changeFinishPercentArr = (e: any, type: string) => {
  //   let newTheme = _.cloneDeep(theme);
  //   if (e.target.checked) {
  //     newTheme.finishPercentArr.push(type);
  //   } else {
  //     let index = _.findIndex(newTheme.finishPercentArr, type);
  //     newTheme.finishPercentArr.splice(index, 1);
  //   }
  //   dispatch(setTheme(newTheme));
  //   dispatch(
  //     getSelfTask(
  //       1,
  //       user._key,
  //       "[0, 1]",
  //       1,
  //       moment().add(1, "days").startOf("day").valueOf(),
  //       1
  //     )
  //   );
  // };
  const changeBoard = (type: string, bool?: string) => {
    let newTheme = _.cloneDeep(theme);
    if (bool) {
      newTheme[type] = bool === "true" ? true : false;
    } else {
      newTheme[type] = newTheme[type] ? false : true;
    }

    dispatch(setTheme(newTheme));
  };

  const onKeyDownchange = (e: any) => {
    if (e.keyCode === 13) {
      //事件操作
      let str = "";
      switch (searchIndex) {
        case 0:
          str = "https://cn.bing.com/search?q=" + searchInput;
          break;
        case 1:
          str = "https://www.baidu.com/s?wd=" + searchInput;
          break;
        case 2:
          str = "https://www.sogou.com/web?query=" + searchInput;
          break;
        case 3:
          str = "https://www.google.com/search?q=" + searchInput;
          break;
      }
      window.open(str);
    }
  };
  const addUrl = async () => {
    let newTheme = _.cloneDeep(theme);
    let linkUrl = "";
    if (url.includes("http://") || url.includes("https://")) {
      linkUrl = url;
    } else {
      linkUrl = `https://${url}`;
    }
    if (_.findIndex(newTheme.urlArr, { url: linkUrl }) !== -1) {
      dispatch(setMessage(true, "已有该快捷方式", "error"));
      return;
    }
    newTheme.urlArr.push({
      url: linkUrl,
      urlName: urlName,
      icon: linkIconSvg,
    });
    dispatch(setMessage(true, "添加快捷方式成功", "success"));
    setUrlVisible(false);
    setUrlName("");
    setUrl("");
    dispatch(setTheme(newTheme));
    let urlRes: any = await api.auth.getUrlIcon(linkUrl);
    if (urlRes.msg === "OK") {
      let index = _.findIndex(newTheme.urlArr, { url: linkUrl });
      if (index !== -1) {
        newTheme.urlArr[index].icon = urlRes.icon;
      }
      // dispatch(setMessage(true, '添加快捷方式成功', 'success'));

      dispatch(setTheme(_.cloneDeep(newTheme)));
    } else {
      dispatch(setMessage(true, urlRes.msg, "error"));
    }
  };
  const delUrl = async (index: number) => {
    let newTheme = _.cloneDeep(theme);
    newTheme.urlArr.splice(index, 1);
    dispatch(setTheme(newTheme));
  };
  return (
    <div className="showPage-container" ref={showPageRef}>
      <div
        className="App-bg1"
        style={{
          background: "rgba(0,0,0," + theme.grayPencent + ")",
        }}
      ></div>
      <div
        className="App-bg2"
        style={
          bg
            ? {
                backgroundImage: "url(" + bg + ")",
                paddingRight: "365px",
              }
            : {
                backgroundColor: theme.backgroundColor
                  ? theme.backgroundColor
                  : "#3C3C3C",
                paddingRight: "365px",
              }
        }
      ></div>
      {theme.searchShow !== false ? (
        <React.Fragment>
          <div className="showPage-input">
            <div
              className="showPage-input-img"
              onClick={() => {
                setSearchIconVisible(true);
              }}
            >
              <Tooltip title="选择搜索引擎">
                <img src={searchImgArr[searchIndex]} alt="" />
              </Tooltip>
              <DropMenu
                visible={searchIconVisible}
                dropStyle={{
                  width: "35px",
                  height: "150px",
                  top: "35px",
                  left: "8px",
                  color: "#333",
                  zIndex: 5,
                }}
                onClose={() => {
                  setSearchIconVisible(false);
                }}
              >
                {searchImgArr.map((item: any, index: number) => {
                  return (
                    <div className="showPage-input-img" key={"icon" + index}>
                      <img
                        src={item}
                        alt=""
                        onClick={() => {
                          setSearchIndex(index);
                          localStorage.setItem("searchIndex", index + "");
                        }}
                      />
                    </div>
                  );
                })}
              </DropMenu>
            </div>
            <input
              type="text"
              placeholder="搜索"
              value={searchInput}
              onChange={(e: any) => {
                setSearchInput(e.target.value);
              }}
              onKeyDown={(e) => {
                onKeyDownchange(e);
              }}
            />
          </div>
        </React.Fragment>
      ) : null}

      <div
        className="showPage-weather"
        style={{ left: theme.searchShow !== false ? "320px" : "10px" }}
      >
        <div className="showPage-weather-item">
          <div className="showPage-weather-item-top">地址</div>
          <div className="showPage-weather-item-bottom">{weatherObj.city}</div>
        </div>
        <div className="showPage-weather-item">
          <div className="showPage-weather-item-top">天气</div>
          <div className="showPage-weather-item-bottom">
            {weatherObj?.info?.type}
          </div>
          {/* <div className="showPage-weather-item-img">
            <img
              src={
                weatherObj?.info?.type
                  ? require("../../assets/weather/w" +
                      weatherObj.now.condition.code +
                      "@3x.png").default
                  : null
              }
              alt=""
            />
          </div> */}
        </div>
        <div className="showPage-weather-item">
          <div className="showPage-weather-item-top">温度</div>
          <div className="showPage-weather-item-bottom">
            {weatherObj?.info?.low && weatherObj.info.low.replace("°C", "")}
            <div className="showPage-weather-icon">°C</div>~{" "}
            {weatherObj?.info?.high && weatherObj.info.high.replace("°C", "")}
            <div className="showPage-weather-icon">°C</div>
          </div>
        </div>
        {/* <div className="showPage-weather-item">
          <div className="showPage-weather-item-top">湿度</div>
          <div className="showPage-weather-item-bottom">
            {weatherObj.now && weatherObj.now.humidity}
            <div className="showPage-weather-icon">%</div>
          </div>
        </div> */}
        <div className="showPage-weather-item">
          <div className="showPage-weather-item-top">PM2.5</div>
          <div className="showPage-weather-item-bottom">
            {weatherObj?.info?.air && weatherObj.info.air["pm2.5"]}
          </div>
        </div>
      </div>
      {fileVisible && fileInfo ? (
        <div className="showPage-fileContainer">
          <FileInfo />
        </div>
      ) : null}
      <div className="showPage-clock">
        <div className="showPage-timepoint">
          <TimePoint />
        </div>
        <div className="showPage-button">
          <React.Fragment>
            {theme?.urlArr.map((item: any, index: number) => {
              return (
                <Tooltip title={item.urlName} key={"url" + index}>
                  <div className="showPage-button-item">
                    <div
                      className="showPage-button-close"
                      onClick={() => {
                        delUrl(index);
                      }}
                    >
                      <CloseOutlined color="primary" />
                    </div>
                    <Button
                      ghost
                      icon={<Avatar alt={item.urlName} src={item.icon} />}
                      onClick={() => {
                        window.open(item.url);
                      }}
                      style={{ border: "0px" }}
                    />
                  </div>
                </Tooltip>
              );
            })}
          </React.Fragment>
          <Tooltip title="快捷方式">
            <Button
              ghost
              icon={
                <PlusOutlined
                  style={{ width: "30px", height: "30px" }}
                  color="primary"
                />
              }
              onClick={() => {
                setUrlVisible(true);
              }}
              style={{ border: "0px" }}
            />
          </Tooltip>
        </div>
        <div className="showPage-time-prompt">{prompt}</div>
      </div>
      <div
        className="showPage"
        style={{
          backgroundColor:
            theme.taskShow || theme.fileShow
              ? "rgba(255, 255, 255, 0.1)"
              : "transparent",
        }}
      >
        <div className="showPage-task-title">
          <div
            className="showPage-bigLogo"
            onClick={(e: any) => {
              window.top.location.href = window.location.origin + "/home/basic";
              // changeShowType();
              localStorage.removeItem("showType");
              e.stopPropagation();
            }}
          >
            <img src={logoSvg} alt="" />
          </div>
        </div>
        <div className="showPage-task-menu">
          {theme.taskShow ? (
            <div
              className="showPage-task-menu-item"
              style={{
                borderBottom:
                  menuShow === 0
                    ? "2px solid #1890ff"
                    : "2px solid transparent",
              }}
              onClick={() => {
                setMenuShow(0);
              }}
            >
              今日事务
            </div>
          ) : null}
          {theme.fileShow ? (
            <div
              className="showPage-task-menu-item"
              style={{
                borderBottom:
                  menuShow === 1
                    ? "2px solid #1890ff"
                    : "2px solid transparent",
                marginLeft: "15px",
              }}
              onClick={() => {
                setMenuShow(1);
              }}
            >
              我的文件
            </div>
          ) : null}
          {/* <div
            className="showPage-task-menu-item"
            style={{
              borderBottom:
                menuShow === 2 ? "2px solid #1890ff" : "2px solid transparent",
              marginLeft: "15px",
            }}
            onClick={() => {
              setMenuShow(2);
            }}
          >
            收藏
          </div> */}
        </div>
        {menuShow === 0 && theme.taskShow !== false ? (
          <div className="showPage-task-container">
            <MainBoard showType="showPage" />
          </div>
        ) : null}
        {menuShow === 1 && theme.fileShow !== false ? (
          <div className="showPage-timeos-container">
            <FileList
              groupKey={""}
              type="文档"
              fileHeight={document.body.clientHeight - 85}
              fileItemWidth={"calc(100% - 365px)"}
            />
          </div>
        ) : null}
        {/* // ) : menuShow === 2 ? (
        //   <div className="showPage-timeos-container">
        //     <FileList
        //       groupKey={mainGroupKey}
        //       type="收藏"
        //       fileHeight={document.body.clientHeight - 85}
        //       fileItemWidth={"calc(100% - 365px)"}
        //     />
        //   </div>
         */}
        {theme.taskShow ? (
          <img
            src={showAddSvg}
            alt=""
            className="showPage-logo"
            style={{
              top: "24px",
              right: "45px",
              height: "20px",
              width: "20px",
            }}
            onClick={(e: any) => {
              setAddVisible(true);
            }}
          />
        ) : null}
        <img
          src={infoPng}
          alt=""
          className="showPage-logo"
          onClick={() => {
            setShowPageState(true);
          }}
        />
        <Drawer
          visible={addVisible}
          onClose={() => {
            setAddVisible(false);
          }}
          width={430}
          bodyStyle={{
            padding: "10px",
            boxSizing: "border-box",
          }}
          headerStyle={{
            padding: "10px",
            boxSizing: "border-box",
            border: "0px",
          }}
          destroyOnClose={true}
          getContainer={() => showPageRef.current}
          title={"新建任务"}
        >
          <HeaderCreate
            visible={addVisible}
            createType={"local"}
            onClose={() => {
              setAddVisible(false);
            }}
          />
        </Drawer>
      </div>
      <Drawer
        visible={showPageState}
        onClose={() => {
          setShowPageState(false);
        }}
        width={280}
        bodyStyle={{
          padding: "25px 10px 10px 10px",
          boxSizing: "border-box",
        }}
        headerStyle={{
          display: "none",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        destroyOnClose={true}
      >
        <div className="showPage-set-container">
          <div
            className="showPage-set-title"
            onClick={() => {
              setMoveType(true);
            }}
            style={{ height: "40px" }}
          >
            <div>壁纸设置</div>
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
                style={{ width: "7px", height: "11px", marginLeft: "5px" }}
              />
            </div>
          </div>
          {/* <div className="showPage-set-title" style={{ marginBottom: "10px" }}>
            任务设置
          </div>
          <div style={{ marginBottom: "25px", marginLeft: "10px" }}>
            <Checkbox
              checked={
                theme.finishPercentArr &&
                theme.finishPercentArr.indexOf("1") !== -1
              }
              onChange={(e) => {
                changeFinishPercentArr(e, "1");
              }}
            >
              今日已完成
            </Checkbox>
          </div> */}
          <div className="showPage-set-title">
            农历显示
            <Switch
              checked={theme.cDayShow !== false ? true : false}
              onChange={() => {
                changeBoard("cDayShow");
              }}
            />
          </div>

          <div className="showPage-set-title">
            时钟风格
            {/* <Switch
                checked={theme.timeShow ? true : false}
                onChange={() => {
                  changeBoard('timeShow');
                }}
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /> */}
            <div
              onClick={() => {
                changeBoard("timeShow", "true");
              }}
              className="showPage-set-time"
            >
              {theme.timeShow ? (
                <img src={radioCheckPng} alt="" />
              ) : (
                <img src={unradioCheckPng} alt="" />
              )}
              数字
            </div>
            <div
              onClick={() => {
                changeBoard("timeShow", "false");
              }}
              className="showPage-set-time"
            >
              {!theme.timeShow ? (
                <img src={radioCheckPng} alt="" />
              ) : (
                <img src={unradioCheckPng} alt="" />
              )}
              时钟
            </div>
          </div>
          <div className="showPage-set-title">
            搜索引擎
            <Switch
              checked={theme.searchShow !== false ? true : false}
              onChange={() => {
                changeBoard("searchShow");
              }}
            />
          </div>
          {parseInt(user?.profile.lo) !== user?.profile.lo &&
          parseInt(user?.profile.la) !== user?.profile.la &&
          user?.profile.la &&
          user?.profile.lo ? (
            <div className="showPage-set-title">
              天气情况
              <Switch
                checked={theme.weatherShow !== false ? true : false}
                onChange={() => {
                  changeBoard("weatherShow");
                }}
              />
            </div>
          ) : null}
          <div className="showPage-set-title">
            任务看板
            <Switch
              checked={theme.taskShow !== false ? true : false}
              onChange={() => {
                changeBoard("taskShow");
                // setMenuShow(1);
              }}
            />
          </div>
          <div className="showPage-set-title">
            文件看板
            <Switch
              checked={theme.fileShow !== false ? true : false}
              onChange={() => {
                changeBoard("fileShow");
                // setMenuShow(0);
              }}
            />
          </div>
        </div>
      </Drawer>
      <Drawer
        visible={moveType}
        onClose={() => {
          api.auth.chooseWallPapers(chooseWallKey);
          setMoveType(false);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={280}
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
        <HeaderBg setChooseWallKey={setChooseWallKey} />
      </Drawer>

      <Modal
        visible={urlVisible}
        onCancel={() => {
          setUrlVisible(false);
        }}
        onOk={() => {
          addUrl();
        }}
        title={"添加链接"}
      >
        <div>
          <Input
            value={url}
            placeholder="请输入链接"
            onChange={(e: any) => {
              setUrl(e.target.value);
            }}
            style={{ marginBottom: "10px" }}
          />
          <Input
            value={urlName}
            placeholder="请输入链接名称"
            onChange={(e: any) => {
              setUrlName(e.target.value);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
ShowPage.defaultProps = {};
export default ShowPage;
