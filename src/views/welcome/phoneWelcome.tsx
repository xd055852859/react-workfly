import React from "react";
import "./htmlWelcome.css";
import "./phoneWelcome.css";
import { Button, Dropdown } from "antd";

import Code from "../../components/qrCode/qrCode";

import iosSvg from "../../assets/svg/ios.svg";
import androidSvg from "../../assets/svg/android.svg";
import welcomeLogoSvg from "../../assets/svg/welcomeLogo.svg";
import welcomeSmallSvg from "../../assets/svg/welcomeSmall.svg";
import cloudSvg from "../../assets/svg/clouds.svg";
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
declare var window: Window 
interface PhoneWelcomeProps {
  toLogin: Function;
  version: string;
  clientWidth: number;
  clientHeight: number;
}

const PhoneWelcome: React.FC<PhoneWelcomeProps> = (props) => {
  const { toLogin, version } = props;

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
  return (
    <React.Fragment>
      <div className="phonewelcome">
        <div
          className="welcomePage-cloud"
          style={{ backgroundImage: `url(${cloudSvg})` }}
        ></div>
        <div className="phonewelcome-header">
          <img src={welcomeLogoSvg} alt="" />
        </div>
        <div className="phonewelcome-logo-box">
          <img className="phonewelcome-logo" src={welcomeSmallSvg} alt="" />
        </div>
        <div className="phonewelcome-button-box">
          <button
            // type="primary"
            className="phonewelcome-button btn btn-primary btn-ghost btn-shine"
            onClick={() => {
              toLogin();
            }}
          >
            开始
          </button>
        </div>
        <div className="phonewelcome-button-icon">
          <Dropdown
            overlay={
              <div className="dropDown-box">
                <Code
                  url={"https://itunes.apple.com/cn/app/id1516401175?ls=1&mt=8"}
                  id={"IOS"}
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
                padding: "0px",
                marginRight: "20px",
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
                  id={"Android"}
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
                padding: "0px",
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
        <div
          className="phonewelcome-footer"
          onClick={() => {
            window.open("http://beian.miit.gov.cn/");
          }}
        >
          Copyright © 2021 Workfly.苏ICP备15006448号
          {/* ©2020 江苏时光信息科技有限公司 Qingtime All Rights Reserved */}
        </div>
      </div>
      <div className="pages questionPage" style={{ height: "100%" }}>
        <div className="pages-title phoneWelcome-title">
          如何让自己和组织协作敏捷如飞？
        </div>
        <div className="questionPage-container  phoneWelcome-container">
          {questionImg.map((questionItem, questionIndex) => {
            return (
              <div
                className="questionPage-item"
                key={"question" + questionIndex}
              >
                <img
                  src={questionItem}
                  alt=""
                  style={{ width: "50px", height: "52px" }}
                />
                <div
                  className="questionPage-item-title"
                  style={{ fontSize: "16px" }}
                >
                  {questionTitle[questionIndex]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pages cooperationPage" style={{ height: "100%" }}>
        <div className="pages-title  phoneWelcome-title">
          workfly如何帮助你和你的团队更好的协作
        </div>
        <div className="cooperationPage-container phoneWelcome-container">
          <div className="cooperationPage-item  phoneWelcome-item">
            <img
              src={cooperation1Svg}
              alt=""
              className="cooperationPage-img"
              style={{ width: "50px", height: "52px" }}
            />
            <div className="cooperationPage-title" style={{ fontSize: "16px" }}>
              结构化的目标
            </div>
            <div
              className="cooperationPage-content"
              style={{ fontSize: "12px" }}
            >
              workfly独有的树形态任务发布方式。可以让你轻松的把目标变成结构化体系化的知识。从而变成团队的执行力。
            </div>
          </div>
          <div className="cooperationPage-item  phoneWelcome-item">
            <img
              src={cooperation2Svg}
              alt=""
              className="cooperationPage-img"
              style={{ width: "50px", height: "52px" }}
            />
            <div className="cooperationPage-title" style={{ fontSize: "16px" }}>
              靠谱的工作
            </div>
            <div
              className="cooperationPage-content"
              style={{ fontSize: "12px" }}
            >
              件件有回应，事事有着落。这就是靠谱团队的品质。也是workfly软件设计的核心思想。
            </div>
          </div>
          <div className="cooperationPage-item  phoneWelcome-item">
            <img
              src={cooperation3Svg}
              alt=""
              className="cooperationPage-img"
              style={{ width: "50px", height: "52px" }}
            />
            <div className="cooperationPage-title" style={{ fontSize: "16px" }}>
              及时的沟通
            </div>
            <div
              className="cooperationPage-content"
              style={{ fontSize: "12px" }}
            >
              workfly可以就某个项目甚至是某个任务直接找到相关责任人进行沟通。沟通有语义，就有了效率。
            </div>
          </div>
        </div>
      </div>
      <div className="pages  workPage" style={{ height: "100%" }}>
        <div className="pages-title  phoneWelcome-title">
          workfly帮助各种组织和企业迈向成功
        </div>
        <div className="workPage-container  phoneWelcome-container">
          {workImg.map((workItem, workIndex) => {
            return (
              <div className="workPage-item" key={"work" + workIndex}>
                <div className="workPage-item-logo">
                  <img src={workItem} alt="" />
                </div>
                <div
                  className="workPage-item-title"
                  style={{ fontSize: "10px" }}
                >
                  {workTitle[workIndex]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
PhoneWelcome.defaultProps = {};
export default PhoneWelcome;
