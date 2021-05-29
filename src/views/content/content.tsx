import React, { useState, useRef, useCallback } from "react";
import "./content.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { Tabs, Checkbox } from "antd";
import _ from "lodash";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";

import IconFont from "../../components/common/iconFont";
import DropMenu from "../../components/common/dropMenu";
import MemberBoard from "../board/memberBoard";
import MainBoard from "../board/mainBoard";
import FileList from "../../components/fileList/fileList";
import FileInfo from "../../components/fileInfo/fileInfo";
import ContentHeader from "./contentHeader";
import ContentTime from "./contentTime";

const { TabPane } = Tabs;

export interface ContentProps {}
const Content: React.FC<ContentProps> = (props) => {
  const dispatch = useDispatch();
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const fileVisible = useTypedSelector((state) => state.common.fileVisible);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [prompt, setPrompt] = useState();
  const [tabsetVisible, setTabsetVisible] = useState(false);
  const [contentConfig, setContentConfig] = useState<any>({
    mainCheck: true,
    lastCheck: true,
    fileCheck: true,
    memberCheck: true,
    groupCheck: true,
  });
  let unDistory = useRef<any>(true);

  const getPrompt = useCallback(async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (unDistory.current) {
      if (promptRes.msg === "OK") {
        setPrompt(promptRes.result.content);
      } else {
        dispatch(setMessage(true, promptRes.msg, "error"));
      }
    }
  }, [dispatch]);
  useMount(() => {
    if (localStorage.getItem("config")) {
      //@ts-ignore
      setContentConfig(JSON.parse(localStorage.getItem("config")));
    }
    getPrompt();
    return () => {
      unDistory.current = false;
    };
  });

  const changeConfig = (configType: string, checked: boolean) => {
    let newContentConfig = _.cloneDeep(contentConfig);
    newContentConfig[configType] = checked;
    setContentConfig(newContentConfig);
    localStorage.setItem("config", JSON.stringify(newContentConfig));
  };
  const contentMenu = (
    <div className="content-dot">
      <IconFont
        type="icon-dot"
        onClick={() => {
          setTabsetVisible(true);
        }}
      />
      <DropMenu
        visible={tabsetVisible}
        dropStyle={{
          width: "120px",
          height: "170px",
          top: "48px",
          left: "240px",
          padding: "10px 0px 10px 15px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        onClose={() => {
          setTabsetVisible(false);
        }}
        // title={'分配任务'}
      >
        <div className="content-dot-item">
          <Checkbox checked={contentConfig.mainCheck} disabled>
            今日
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.lastCheck}
            onChange={(e: any) => {
              changeConfig("lastCheck", e.target.checked);
            }}
          >
            最近
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.fileCheck}
            onChange={(e: any) => {
              changeConfig("fileCheck", e.target.checked);
            }}
          >
            收藏
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.memberCheck}
            onChange={(e: any) => {
              changeConfig("memberCheck", e.target.checked);
            }}
          >
            队友
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.groupCheck}
            onChange={(e: any) => {
              changeConfig("groupCheck", e.target.checked);
            }}
          >
            项目
          </Checkbox>
        </div>
      </DropMenu>
    </div>
  );
  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        <ContentTime>
          <div className="content-subTitle">{prompt}</div>
        </ContentTime>
        {/*tabBarExtraContent={operations}>*/}
        {fileVisible && fileInfo ? (
          <div className="content-fileContainer">
            <FileInfo />
          </div>
        ) : null}
        {/* tabBarExtraContent={contentMenu} */}
        <Tabs tabBarStyle={{ color: "#fff" }} >
          {contentConfig.mainCheck ? (
            <TabPane tab="今日" key="1">
              <div className="content-tabPane">
                <MainBoard />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.lastCheck ? (
            <TabPane tab="最近" key="2">
              <div className="content-tabPane">
                <FileList
                  groupKey={""}
                  type="最近"
                  fileItemWidth={"calc(100% - 270px)"}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.fileCheck ? (
            <TabPane tab="收藏" key="3">
              <div className="content-tabPane">
                <FileList
                  groupKey={mainGroupKey}
                  type="收藏"
                  fileItemWidth={"calc(100% - 270px)"}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.memberCheck ? (
            <TabPane tab="队友" key="4">
              <div className="content-tabPane">
                <MemberBoard boardIndex={0} />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.groupCheck ? (
            <TabPane tab="项目" key="5">
              <div className="content-tabPane">
                <MemberBoard boardIndex={1} />
              </div>
            </TabPane>
          ) : null}
        </Tabs>

        {/* <MainBoard /> : null} */}
        {/* {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null} */}
      </div>
    </div>
  );
};
export default Content;
