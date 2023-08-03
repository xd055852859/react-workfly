import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeContentVisible } from "../../redux/actions/commonActions";
interface HelpProps { }
declare var window: Window 
const Help: React.FC<HelpProps> = () => {
  const [url, setUrl] = useState<any>("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.location) {
      let urlType: any = window.location.pathname.split("/");
      if (urlType[urlType.length - 1] === "1") {
        setUrl(
          "https://mindcute.com/home/base/knowledgebase?baseid=2147370150"
        );
      } else if (urlType[urlType.length - 1] === "2") {
        setUrl(
          "https://baoku.qingtime.cn/OHPRQG_1585745644894/article?key=1249218647"
        );
      }
    }
    dispatch(changeContentVisible(false))
    //eslint-disable-next-line
  }, []);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <iframe
        src={url}
        frameBorder="0"
        style={{ width: "100%", height: "100%" }}
        title=" "
      ></iframe>
    </div>
  );
};
Help.defaultProps = {};
export default Help;
