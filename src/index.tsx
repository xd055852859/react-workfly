// import './wdyr'
import ReactDOM from "react-dom";
// import './index.less';
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import Views from "./view";
import { AuthProvider } from "./context/auth";
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
      <Views />
    </AuthProvider>
  </Provider>,
  document.getElementById("root")
);
