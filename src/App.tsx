import React, { useEffect, useRef } from "react";
import "./App.css";
import { useLocation, useHistory } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Route, Switch, Redirect } from "react-router-dom";
import { useTypedSelector } from "./redux/reducer/RootState";
import { getSearchParamValue } from "./services/util";
import { useDispatch } from "react-redux";
import Loadable from "react-loadable";
import zhCN from "antd/lib/locale/zh_CN";
import { useMount } from "./hook/common";

import { clearAuth, getTheme, setClickType } from "./redux/actions/authActions";

import { clearMember } from "./redux/actions/memberActions";
import { clearGroup } from "./redux/actions/groupActions";
import { clearTask } from "./redux/actions/taskActions";

import Common from "./views/common/common";
import Star from "./components/star/star";
import RandomBg from "./components/randomBg/randomBg";

const ShowPage = Loadable({
  loader: () => import("./views/showPage/showPage"),
  loading: () => null,
});
const Company = Loadable({
  loader: () => import("./views/company/company"),
  loading: () => null,
});
const Basic = Loadable({
  loader: () => import("./views/basic/basic"),
  loading: () => null,
});
const Download = Loadable({
  loader: () => import("./views/download/download"),
  loading: () => null,
});
const Create = Loadable({
  loader: () => import("./views/create/create"),
  loading: () => null,
});
const File = Loadable({
  loader: () => import("./views/file/file"),
  loading: () => null,
});

const App: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const pageRef: React.RefObject<any> = useRef();

  useMount(() => {
    if (
      getSearchParamValue(window.location.search, "token") ||
      localStorage.getItem("token")
    ) {
      if (localStorage.getItem("createType")) {
        history.push("/home/create");
      } else if (localStorage.getItem("showType")) {
        history.push("/home/showPage");
      }
      // else {
      //   history.push("/home/basic");
      // }
      dispatch(getTheme());
    } else {
      history.push("/");
    }
  });


  useEffect(() => {
    dispatch(clearTask(4));
    if (headerIndex !== 2) {
      dispatch(clearAuth());
      dispatch(setClickType("out"));
    }
    if (headerIndex !== 3) {
      dispatch(clearMember());
      dispatch(clearGroup());
    }
  }, [headerIndex, targetUserKey, groupKey, dispatch]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="App" ref={pageRef}>
        {!localStorage.getItem("createType") &&
        !getSearchParamValue(location.search, "createType") ? (
          <React.Fragment>
            <div
              className="App-bg1"
              style={{
                background: "rgba(0,0,0," + theme.grayPencent + ")",
              }}
            ></div>

            <div
              className="App-bg2"
              style={
                !theme.randomVisible
                  ? theme.backgroundImg
                    ? {
                        backgroundImage: "url(" + theme.backgroundImg + ")",
                      }
                    : {
                        backgroundColor: theme.backgroundColor
                          ? theme.backgroundColor
                          : "#3C3C3C",
                      }
                  : {}
              }
            >
              {theme.randomVisible ? <RandomBg /> : null}
            </div>
          </React.Fragment>
        ) : null}
        <Switch>
          <Route
            exact
            path="/home/"
            render={() => <Redirect to="/home/basic" />}
          />
          <Route path="/home/basic" component={Basic} />
          <Route exact path="/home/showPage" component={ShowPage} />
          <Route path="/home/company" component={Company} />
          <Route exact path="/home/download" component={Download} />
          <Route exact path="/home/create" component={Create} />
          <Route exact path="/home/file" component={File} />
        </Switch>
        <Common
          clientWidth={pageRef?.current?.offsetWidth}
          clientHeight={pageRef?.current?.offsetHeight}
        />
        <Star />
      </div>
    </ConfigProvider>
  );
};

export default App;
