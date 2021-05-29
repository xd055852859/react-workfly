import React, { useState, useEffect } from "react";
import "./headerSet.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Switch, Radio } from "antd";
import _ from "lodash";
import api from "../../services/api";

import { setTheme, getThemeBg } from "../../redux/actions/authActions";

import Loading from "../common/loading";
import { useMount } from "../../hook/common";

interface HeaderBgProps {
  setMoveState?: any;
  setChooseWallKey?: any;
  headerType?: string;
}

const HeaderBg: React.FC<HeaderBgProps> = (props) => {
  const { setChooseWallKey } = props;
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.auth.theme);
  const themeBg = useTypedSelector((state) => state.auth.themeBg);
  const themeBgTotal = useTypedSelector((state) => state.auth.themeBgTotal);
  const [bgPage, setBgPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const color1 = [
    "#3C3C3C",
    "#46558C",
    "#9C5D9E",
    "#C14C6B",
    "#C14F4B ",
    "#D19235",
    "#29835D",
    "#24807B",
    "#68767F",
  ];
  useMount(() => {
    if (!theme.randomVisible) {
      dispatch(getThemeBg(1));
    }
  });
  useEffect(() => {
    if (themeBg.length > 0) {
      setLoading(false);
    }
  }, [themeBg]);

  const changeBoard = (type: string, value: boolean) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = value;
    dispatch(setTheme(newTheme));
  };
  const changeRandomType = (value: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme.randomType = value;
    dispatch(setTheme(newTheme));
  };
  const changeBg = (type: string, value: any) => {
    let newTheme = _.cloneDeep(theme);
    if (type === "backgroundImg") {
      let img = new Image();
      img.src = value.url;
      // img.crossOrigin = 'anonymous';
      // 确定图片加载完成后再进行背景图片切换
      img.onload = function () {
        // format.formatColor(canvasRef.current, img);
        newTheme.backgroundImg = value.url;
        newTheme.backgroundColor = "";
        newTheme.grayPencent = value.color ? value.color / 900 : 0;
        // newTheme.grayPencent = 0;
        dispatch(setTheme(newTheme));
        api.auth.viewWallPapers(value._key);
      };
    } else {
      newTheme.backgroundImg = "";
      newTheme.backgroundColor = value;
      newTheme.grayPencent = 0;
      dispatch(setTheme(newTheme));
    }
  };
  return (
    <React.Fragment>
      <div
        className="contentHeader-set-item"
        style={{ marginTop: "0px", padding: "0px" }}
      >
        {/* <img
              src={set2Png}
              alt=""
              style={{
                width: '15px',
                height: '17px',
                marginRight: '10px',
              }}
            /> */}
        <div>自动更新</div>
        <Switch
          checked={theme.randomVisible ? true : false}
          onChange={() => {
            changeBoard("randomVisible", !_.cloneDeep(theme)["randomVisible"]);
          }}
        />
      </div>
      {theme.randomVisible ? (
        <div
          className="contentHeader-set-item"
          style={{ marginTop: "0px", padding: "0px" }}
        >
          <div>更新频率</div>
          <Radio.Group
            onChange={(e: any) => {
              changeRandomType(e.target.value);
            }}
            value={theme.randomType}
          >
            <Radio value="1">分钟</Radio>
            <Radio value="2">小时</Radio>
            <Radio value="3">日</Radio>
          </Radio.Group>
        </div>
      ) : (
        <React.Fragment>
          <div className="bg-title">颜色</div>
          <div className="bg-container">
            {color1.map((color1Item: any, color1Index: number) => {
              return (
                <div
                  style={{
                    backgroundColor: color1Item,
                    border:
                      theme.backgroundColor === color1Item
                        ? "3px solid #87B940"
                        : "transparent",
                  }}
                  key={"color1" + color1Index}
                  className="bg-item"
                  onClick={() => {
                    changeBg("backgroundColor", color1Item);
                  }}
                >
                  {theme.backgroundColor === color1Item ? (
                    <div className="bg-point"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="bg-title">壁纸</div>
          <div
            className="bg-container"
            style={{
              height: theme.randomVisible
                ? "calc(100% - 283px)"
                : "calc(100% - 255px)",
              overflow: "auto",
            }}
            // onScroll={scrollBgLoading}
          >
            {loading ? (
              <Loading loadingWidth="60px" loadingHeight="60px" />
            ) : null}
            {themeBg.map((imgBigArr2Item: any, imgBigArr2Index: number) => {
              return (
                <React.Fragment key={"imgBigArr2" + imgBigArr2Index}>
                  {imgBigArr2Item.url ? (
                    <div
                      style={{
                        backgroundImage:
                          "url(" +
                          imgBigArr2Item.url +
                          "?imageMogr2/auto-orient/thumbnail/90x)",
                        border:
                          theme.backgroundImg === imgBigArr2Item.url
                            ? "2px solid #87B940"
                            : "transparent",
                      }}
                      className="bg-item"
                      onClick={() => {
                        changeBg("backgroundImg", imgBigArr2Item);
                        if (setChooseWallKey) {
                          setChooseWallKey(imgBigArr2Item._key);
                        }
                      }}
                    >
                      {theme.backgroundImg === imgBigArr2Item.url ? (
                        <div className="bg-point"></div>
                      ) : null}
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
          {themeBg.length < themeBgTotal ? (
            <div
              className="bg-button"
              onClick={() => {
                let newPage = bgPage;
                newPage = newPage + 1;
                setLoading(true);
                dispatch(getThemeBg(newPage));
                setBgPage(newPage);
              }}
            >
              加载更多
            </div>
          ) : null}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
HeaderBg.defaultProps = {};
export default HeaderBg;
