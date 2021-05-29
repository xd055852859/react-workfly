import React, { useEffect, useRef } from "react";
import "./htmlWelcome.css";
import { Button, Carousel, BackTop, Dropdown } from "antd";
import Code from "../../components/qrCode/qrCode";

import welcomeLogoSvg from "../../assets/svg/welcomeLogo.svg";
import bgWSvg from "../../assets/svg/bg-white.svg";
import cloudSvg from "../../assets/svg/clouds.svg";
import welcomeSvg from "../../assets/svg/welcome.svg";

import phonePng from "../../assets/img/phone.png";
import computerPng from "../../assets/img/computer.png";
import googPng from "../../assets/img/goog.png";
import googlePng from "../../assets/img/google.png";
import iosSvg from "../../assets/svg/ios.svg";
import androidSvg from "../../assets/svg/android.svg";
import localSvg from "../../assets/svg/local.svg";
import winSvg from "../../assets/svg/win.svg";
import question1Svg from "../../assets/svg/question1.svg";
import question2Svg from "../../assets/svg/question2.svg";
import question3Svg from "../../assets/svg/question3.svg";
import question4Svg from "../../assets/svg/question4.svg";
import question5Svg from "../../assets/svg/question5.svg";
import question6Svg from "../../assets/svg/question6.svg";
import question7Svg from "../../assets/svg/question7.svg";
import question8Svg from "../../assets/svg/question8.svg";
import question9Svg from "../../assets/svg/question9.svg";
import cooperation1Svg from "../../assets/svg/cooperation1.svg";
import cooperation2Svg from "../../assets/svg/cooperation2.svg";
import cooperation3Svg from "../../assets/svg/cooperation3.svg";
import person1Png from "../../assets/img/person1.png";
import person2Png from "../../assets/img/person2.png";
import person3Png from "../../assets/img/person3.png";
import work1Png from "../../assets/img/work1.png";
import work2Png from "../../assets/img/work2.png";
import work3Png from "../../assets/img/work3.png";
import work4Png from "../../assets/img/work4.png";
import work5Png from "../../assets/img/work5.png";
import work6Png from "../../assets/img/work6.png";
import work7Png from "../../assets/img/work7.png";
import work8Png from "../../assets/img/work8.png";
import work9Png from "../../assets/img/work9.png";
import work10Png from "../../assets/img/work10.png";
import leftSvg from "../../assets/svg/left.svg";
import rightSvg from "../../assets/svg/right.svg";
interface HtmlWelcomeProps {
  toLogin: Function;
  version: string;
  clientWidth: number;
  clientHeight: number;
}
const HtmlWelcome: React.FC<HtmlWelcomeProps> = (props) => {
  const { toLogin, version, clientWidth, clientHeight } = props;
  const carouselRef: React.RefObject<any> = useRef();
  const questionImg = [
    question1Svg,
    question2Svg,
    question3Svg,
    question4Svg,
    question5Svg,
    question6Svg,
    question7Svg,
    question8Svg,
    question9Svg,
  ];
  const questionTitle = [
    "超级看板",
    "智慧树",
    "敏捷协同",
    "企业级架构",
    "业务架构",
    "无缝沟通",
    "智能日志",
    "任务魔法",
    "安全保障",
  ];
  const workImg = [
    work1Png,
    work2Png,
    work3Png,
    work4Png,
    work5Png,
    work6Png,
    work7Png,
    work8Png,
    work9Png,
    work10Png,
  ];
  const workTitle = [
    "中国邮政",
    "EMS",
    "丰巢",
    "中国电信",
    "中国移动",
    "中国国家图书馆",
    "上海图书馆",
    "美国犹太家谱协会",
    "农道集团",
    "中国文保基金会",
  ];
  useEffect(() => {
    // setClientWidth(bootpageRef.current.clientWidth);
    let scrollFunc = function (e) {
      e = e || window.event;
      if (e.wheelDelta) {
        //第一步：先判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) {
          //当滑轮向上滚动时
          carouselRef.current.prev();
        }
        if (e.wheelDelta < 0) {
          //当滑轮向下滚动时
          carouselRef.current.next();
        }
      }
    };
    document.addEventListener("mousewheel", scrollFunc, false);
    return () => {
      document.removeEventListener("mousewheel", scrollFunc,false);
    };
  }, []);
  return (
    <div
      className="begin"
      style={{
        backgroundSize: clientWidth > 500 ? "contain" : "400px 300px",
        backgroundImage: `url(${bgWSvg})`,
      }}
    >
      <div className="pages-header">
        <div>
          <img src={welcomeLogoSvg} alt="" />
        </div>
        <div className="pages-link">
          <div
            className="pages-link-item"
            onClick={() => {
              carouselRef.current.goTo(0);
            }}
          >
            产品
          </div>
          <div
            className="pages-link-item"
            onClick={() => {
              carouselRef.current.goTo(1);
            }}
          >
            下载
          </div>
          <div
            className="pages-link-item"
            onClick={() => {
              window.open("https://workfly.cn/help/1");
            }}
          >
            学习
          </div>
          <button
            // type="primary"
            className="welcomePage-button btn btn-primary btn-ghost btn-shine"
            onClick={() => {
              toLogin();
            }}
          >
            开始
          </button>
        </div>
      </div>
      <div
        className="welcomePage-cloud"
        style={{ backgroundImage: `url(${cloudSvg})` }}
      ></div>

      <Carousel
        infinite={false}
        dotPosition="right"
        dots={{ className: "pageDot" }}
        ref={carouselRef}
      >
        <div>
          <div className="pages welcomePage" style={{ height: clientHeight }}>
            <div
              className="welcomePage-logo"
              style={{
                backgroundImage: "url(" + welcomeSvg + ")",
              }}
            ></div>
          </div>
        </div>
        <div>
          <div className="pages  downloadPage" style={{ height: clientHeight }}>
            <div className="downloadPage-container pages-container">
              <div className="downloadPage-item">
                <div className="downloadPage-title">手机端</div>
                <img src={phonePng} alt="" className="downloadPage-phone" />
                <div className="downloadPage-icon">
                  <Dropdown
                    overlay={
                      <div className="dropDown-box">
                        <Code
                          url={
                            "https://itunes.apple.com/cn/app/id1516401175?ls=1&mt=8"
                          }
                          id={"ios"}
                        />
                      </div>
                    }
                    placement="bottomCenter"
                  >
                    <Button
                      style={{
                        border: "0px",
                        width: "60px",
                        height: "60px",
                        background: "transparent",
                      }}
                      icon={
                        <img
                          src={iosSvg}
                          style={{ width: "60px", height: "60px" }}
                          alt=""
                        />
                      }
                    >
                      <a
                        href="https://itunes.apple.com/cn/app/id1516401175?ls=1&mt=8"
                        target="_blank"
                        download=""
                        className="pages-local"
                        rel="noreferrer"
                      >
                        {" "}
                      </a>
                    </Button>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <div className="dropDown-box">
                        <Code
                          url={"https://workingdownload.qingtime.cn/"}
                          id={"android"}
                        />
                      </div>
                    }
                    placement="bottomCenter"
                  >
                    <Button
                      style={{
                        border: "0px",
                        width: "60px",
                        height: "60px",
                        background: "transparent",
                      }}
                      icon={
                        <img
                          src={androidSvg}
                          style={{ width: "60px", height: "60px" }}
                          alt=""
                        />
                      }
                    >
                      <a
                        href={version}
                        target="_blank"
                        download=""
                        className="pages-local"
                        rel="noreferrer"
                      >
                        {" "}
                      </a>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="downloadPage-item">
                <div className="downloadPage-title">桌面端</div>
                <img
                  src={computerPng}
                  alt=""
                  className="downloadPage-computer"
                />
                <div className="downloadPage-icon" style={{ width: "204px" }}>
                  <Button
                    style={{
                      border: "0px",
                      width: "60px",
                      height: "60px",
                      background: "transparent",
                    }}
                    icon={
                      <img
                        src={iosSvg}
                        style={{ width: "60px", height: "60px" }}
                        alt=""
                      />
                    }
                  >
                    <a
                      href="https://ttdazidata.qingtime.cn/cheerchat/cheerchat-2.23.2.dmg"
                      target="_blank"
                      download=""
                      className="pages-local"
                      rel="noreferrer"
                    >
                      {" "}
                    </a>
                  </Button>
                  <Button
                    style={{
                      border: "0px",
                      width: "60px",
                      height: "60px",
                      background: "transparent",
                    }}
                    icon={
                      <img
                        src={winSvg}
                        style={{ width: "60px", height: "60px" }}
                        alt=""
                      />
                    }
                  >
                    <a
                      href="https://ttdazidata.qingtime.cn/cheerchat/cheerchat-setup-2.23.3.exe"
                      target="_blank"
                      download=""
                      className="pages-local"
                      rel="noreferrer"
                    >
                      {" "}
                    </a>
                  </Button>
                </div>
              </div>
              <div className="downloadPage-item">
                <div className="downloadPage-title">Google插件</div>
                <img src={googPng} alt="" className="downloadPage-google" />
                <div className="downloadPage-icon" style={{ width: "204px" }}>
                  <Button
                    style={{
                      border: "0px",
                      width: "60px",
                      height: "60px",
                      background: "transparent",
                    }}
                    icon={
                      <img
                        src={googlePng}
                        style={{ width: "60px", height: "60px" }}
                        alt=""
                      />
                    }
                  >
                    <a
                      href="https://chrome.google.com/webstore/detail/workfly/hbbdkhcbgemlcmnjmplhpekmohfdobde"
                      target="_blank"
                      className="pages-local"
                      rel="noreferrer"
                    >
                      {" "}
                    </a>
                  </Button>
                  <Button
                    style={{
                      border: "0px",
                      width: "60px",
                      height: "60px",
                      background: "transparent",
                    }}
                    icon={
                      <img
                        src={localSvg}
                        style={{ width: "60px", height: "60px" }}
                        alt=""
                      />
                    }
                  >
                    <a
                      href="https://workingdata.qingtime.cn/workingExtensions.zip"
                      target="_blank"
                      download=""
                      className="pages-local"
                      rel="noreferrer"
                    >
                      {" "}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="pages questionPage" style={{ height: clientHeight }}>
            <div className="pages-title">如何让自己和组织协作敏捷如飞？</div>
            <div className="questionPage-container  pages-container">
              {questionImg.map((questionItem, questionIndex) => {
                return (
                  <div
                    className="questionPage-item"
                    key={"question" + questionIndex}
                  >
                    <img src={questionItem} alt="" />
                    <div className="questionPage-item-title">
                      {questionTitle[questionIndex]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="pages personPage" style={{ height: clientHeight }}>
            <div className="pages-title">喜欢用workfly</div>
            <div className="personPage-container">
              <div className="personPage-icon">
                <img src={leftSvg} alt="" />
              </div>
              <div className="personPage-item">
                <div className="personPage-item-img">
                  <img src={person1Png} alt="" />
                </div>
                <div className="personPage-item-content">
                  文字案例能手机越来越普及，我们这老一代人基本都不太会用那么多复杂的软件，亲信这款简洁易用APP，特别适合我们。
                </div>
                <div className="personPage-item-nickName">司恒</div>
                <div className="personPage-item-post">一名来自安徽的志愿者</div>
              </div>
              <div className="personPage-item" style={{ margin: "0px 3%" }}>
                <div className="personPage-item-img">
                  <img src={person2Png} alt="" />
                </div>
                <div className="personPage-item-content">
                  我中文不是太好，对于只需要沟通的软件，我喜欢简洁的，并且不会加陌生人，只与可信关系链沟通。
                </div>
                <div className="personPage-item-nickName">Nina</div>
                <div className="personPage-item-post">
                  美国科技公司驻中国办事处职员
                </div>
              </div>
              <div className="personPage-item">
                <div className="personPage-item-img">
                  <img src={person3Png} alt="" />
                </div>
                <div className="personPage-item-content">
                  时光科技用开发的软件、办公和项目管理系统，我们一直很赞赏和崇拜。
                </div>
                <div className="personPage-item-nickName">思琪</div>
                <div className="personPage-item-post">航旅科技</div>
              </div>
              <div className="personPage-icon">
                <img src={rightSvg} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className="pages  cooperationPage"
            style={{ height: clientHeight }}
          >
            <div className="pages-title">
              workfly如何帮助你和你的团队更好的协作
            </div>
            <div className="cooperationPage-container  pages-container">
              <div className="cooperationPage-item">
                <img
                  src={cooperation1Svg}
                  alt=""
                  className="cooperationPage-img"
                />
                <div className="cooperationPage-title">结构化的目标</div>
                <div className="cooperationPage-content">
                  workfly独有的树形态任务发布方式。可以让你轻松的把目标变成结构化体系化的知识。从而变成团队的执行力。
                </div>
              </div>
              <div
                className="cooperationPage-item"
                style={{ margin: "0px 5%" }}
              >
                <img
                  src={cooperation2Svg}
                  alt=""
                  className="cooperationPage-img"
                />
                <div className="cooperationPage-title">靠谱的工作</div>
                <div className="cooperationPage-content">
                  件件有回应，事事有着落。这就是靠谱团队的品质。也是workfly软件设计的核心思想。
                </div>
              </div>
              <div className="cooperationPage-item">
                <img
                  src={cooperation3Svg}
                  alt=""
                  className="cooperationPage-img"
                />
                <div className="cooperationPage-title">及时的沟通</div>
                <div className="cooperationPage-content">
                  workfly可以就某个项目甚至是某个任务直接找到相关责任人进行沟通。沟通有语义，就有了效率。
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="pages  workPage" style={{ height: clientHeight }}>
            <div className="pages-title">workfly帮助各种组织和企业迈向成功</div>
            <div className="workPage-container  pages-container">
              {workImg.map((workItem, workIndex) => {
                return (
                  <div className="workPage-item" key={"work" + workIndex}>
                    <img src={workItem} alt="" />
                    <div className="workPage-item-title">
                      {workTitle[workIndex]}
                    </div>
                  </div>
                );
              })}
            </div>
            <span
              className="welcomePage-ICPLicensing"
              onClick={() => {
                window.open("http://beian.miit.gov.cn/");
              }}
              style={{ cursor: "pointer" }}
            >
              Copyright © 2021 Workfly.苏ICP备15006448号
              {/* ©2020 江苏时光信息科技有限公司 Qingtime All Rights Reserved */}
            </span>
          </div>
        </div>
      </Carousel>
      <BackTop visibilityHeight={clientHeight} />
    </div>
  );
};
export default HtmlWelcome;
