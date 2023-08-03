import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./download.css";
import { useDispatch } from "react-redux";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";
import { setMessage } from "../../redux/actions/commonActions";
import Code from "../../components/qrCode/qrCode";
import { useMount } from "../../hook/common";

import logoPng from "./img/logo.png";
import workingPng from "./img/working.png";
import iphone0Svg from "./img/iphone0.svg";
import iphone1Svg from "./img/iphone1.svg";
import googlePng from "../../assets/img/google.png";
import downPng from "../../assets/img/down.png";
import learnSvg from "../../assets/svg/learn.svg";

import mac0Png from "./img/mac0.png";
import mac1Png from "./img/mac1.png";
import mac2Png from "./img/mac2.png";
import mac3Png from "./img/mac3.png";
import icon0Png from "./img/icon0.png";
import icon1Png from "./img/icon1.png";
import icon2Png from "./img/icon2.png";
import icon3Png from "./img/icon3.png";
import icon4Png from "./img/icon4.png";
import icon5Png from "./img/icon5.png";
import icon0Svg from "./img/icon0.svg";
import icon1Svg from "./img/icon1.svg";
import icon2Svg from "./img/icon2.svg";
import icon3Svg from "./img/icon3.svg";
import icon4Svg from "./img/icon4.svg";
import icon5Svg from "./img/icon5.svg";
import { useAuth } from "../../context/auth";
interface DownloadProps {}

const Download: React.FC<DownloadProps> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const year = moment().year();
  const { deviceType } = useAuth();
  const [codeShow, setCodeshow] = useState<any>(3);
  const [download, setDownload] = useState<any>([
    { t: "IOS", u: "https://itunes.apple.com/cn/app/id1516401175?ls=1&mt=8" },
    { t: "Android", u: "" },
    {
      t: "Google",
      u: "https://chrome.google.com/webstore/detail/workfly/hbbdkhcbgemlcmnjmplhpekmohfdobde",
    },
    {
      t: "本地下载",
      u: "https://workingdata.qingtime.cn/workingExtensions.zip",
    },
    // {
    //   t: "桌面端",
    //   u: "https://ttdazidata.qingtime.cn/cheerchat/cheerchat-2.23.2.dmg",
    // },
    // {
    //   t: "桌面端",
    //   u: "  https://ttdazidata.qingtime.cn/cheerchat/cheerchat-setup-2.23.3.exe",
    // },
  ]);
  const titles = [
    {
      t: "清晰计划",
      d: "每一天",
      url: "https://cdn-icare.qingtime.cn/9BC7B314.jpg",
    },
    {
      t: "掌控项目",
      d: "关注团队",
      url: "https://cdn-icare.qingtime.cn/7E749D8A.jpg",
    },
    {
      t: "随时随地",
      d: "发布任务",
      url: "https://cdn-icare.qingtime.cn/80A21213.jpg",
    },
    {
      t: "关于团队的一切",
      d: "相互激励",
      url: "https://cdn-icare.qingtime.cn/5CBD8C46.jpg",
    },
    {
      t: "时间去哪儿了",
      d: "我的动态",
      url: "https://cdn-icare.qingtime.cn/7A6C1C71.jpg",
    },
    {
      t: "现在开始",
      d: "美好工作",
      url: "https://cdn-icare.qingtime.cn/091AA4A8.jpg",
    },
  ];
  const iphoneArray = [iphone0Svg, iphone1Svg, googlePng, downPng];
  const macArray = [mac0Png, mac1Png, mac2Png, mac3Png];
  const iconObj = {
    pngArray: [icon0Png, icon1Png, icon2Png, icon3Png, icon4Png, icon5Png],
    svgArray: [icon0Svg, icon1Svg, icon2Svg, icon3Svg, icon4Svg, icon5Svg],
  };
  useMount(() => {
    getVersion();
  });
  const getVersion = async () => {
    let newDownload = _.cloneDeep(download);
    let versionRes: any = await api.common.getVersion(7);
    if (versionRes.msg === "OK") {
      newDownload[1]["u"] =
        "https://workingversion.qingtime.cn/Working_QingTime_" +
        versionRes.result.versionName +
        ".apk";
      setDownload(newDownload);
    } else {
      dispatch(setMessage(true, versionRes.msg, "error"));
    }
  };
  return (
    <div id="adai">
      <div className="h1080 home_wrap">
        <div className="nav_wrap">
          <div className="nav-left">
            <img
              src={logoPng}
              alt="logo"
              onClick={() => {
                history.push("/home/basic/content");
              }}
            />
            {/* <a
              href="http://extension.workfly.cn"
              target="_blank"
              rel="noreferrer"
            >
              雁行插件
            </a>
            <a
              href="https://cheerchat.qingtime.cn"
              target="_blank"
              rel="noreferrer"
            >
              洽洽官网
            </a> */}
          </div>
        </div>
        <div className="home_box">
          <img src={workingPng} alt="logo_t" />
          <div className="icon_wrap">
            {download[1].u
              ? download.map((item: any, index: number) => {
                  return (
                    <React.Fragment>
                      {(deviceType === "mobel" && index < 2) ||
                      deviceType !== "mobel" ? (
                        <a
                          key={"icon" + index}
                          href={item.u}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            className="phone_icon"
                            src={iphoneArray[index]}
                            alt=""
                            onClick={() => {
                              setCodeshow(index);
                            }}
                            onMouseEnter={() => {
                              setCodeshow(index);
                            }}
                          />
                          <p>{item.t}</p>
                          {index < 2 && index === codeShow ? (
                            <div className="qrcode" id={"qrcode" + index}>
                              <Code url={item.u} id={item.t} />
                            </div>
                          ) : null}
                        </a>
                      ) : null}
                    </React.Fragment>
                  );
                })
              : null}
          </div>
        </div>
        <p className="copy_right">
          ©{year} 江苏时光信息科技有限公司 Qingtime All Rights Reserved
          苏ICP备15006448号-6
        </p>
        <div
          className="learn_button"
          onClick={() => {
            window.open(
              "https://working.cn/home/qdoc/docEditor?key=2103298859&tag 《如何手工安装workfly插件》"
            );
          }}
        >
          <img src={learnSvg} alt="" /> 如何手工安装workfly插件
        </div>
      </div>
      <div className="h1080 multiple_devices_wrap">
        <p>适配多种设备</p>
        {[0, 1, 2, 3].map((item: any, index: number) => {
          return <img key={"devices" + index} src={macArray[index]} alt="" />;
        })}
      </div>
      <ul className="img_wrap">
        {titles.map((item: any, index: number) => {
          return (
            <li
              key={"img2" + index}
              style={{
                backgroundImage: "url(" + item.url + ")",
              }}
              className="h1080"
            >
              <div className="desc_wrap">
                <img src={iconObj.svgArray[index]} alt="" />
                <p>{item.t}</p>
                <span>{item.d}</span>
              </div>
              <img
                src={iconObj.pngArray[index]}
                className="desc_img lozad"
                alt=""
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
Download.defaultProps = {};
export default Download;
