// import './wdyr'
import ReactDOM from "react-dom";
// import './index.less';
import "./index.css";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import zhCN from "antd/lib/locale/zh_CN";
import store from "./redux/store";
import Views from "./view";
import { AuthProvider } from "./context/auth";
declare var window: Window 
//@ts-ignore
let url = window.location.href;
// 自动切换为https
if (
  url.indexOf("http://localhost") === -1 &&
  url.indexOf("https") < 0 &&
  url.indexOf("192.168.127.209") === -1
) {
  url = url.replace("http:", "https:");
  window.location.replace(url);
}

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <ConfigProvider locale={zhCN}>
        <Views />
      </ConfigProvider>
    </AuthProvider>
  </Provider>
  ,
  document.getElementById("root")
);
