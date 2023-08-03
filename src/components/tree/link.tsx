import React, { useState, useEffect } from "react";
import "./link.css";
import { Input } from "antd";

import Iframeview from "../common/iframeview";
interface LinkProps {
  targetData: any;
  hideUrl?: boolean;
  onChange?: any;
  setContent?: any;
}

let timer: NodeJS.Timeout;
const Link: React.FC<LinkProps> = (props) => {
  const { targetData, setContent } = props;
  const [value, setValue] = useState("");
  const [url, seturl] = useState("");

  useEffect(() => {
    setValue(
      targetData.extraData && targetData.extraData.url
        ? targetData.extraData.url
        : ""
    );
    seturl(
      targetData.extraData && targetData.extraData.url
        ? targetData.extraData.url
        : ""
    );
  }, [targetData]);

  function handleChange(value: string) {
    clearTimeout(timer);
    setValue(value);
    timer = setTimeout(() => {
      seturl(value);
      setContent(value);
    }, 1000);
  }

  let linkUrl;
  if (url.includes("http://") || url.includes("https://")) {
    linkUrl = url;
  } else {
    linkUrl = `https://${url}`;
  }

  return (
    <div className="editLink">
      {/* {!hideUrl ? ( */}
      <div className="linkInfo">
        <Input
          placeholder="请输入链接地址"
          style={{ flex: 1, marginRight: "8px" }}
          value={value}
          onChange={(e: any) => handleChange(e.target.value)}
        />
      </div>
      {/* ) : null} */}

      <div className="iframeWrapper">
        <Iframeview uri={linkUrl} />
      </div>
    </div>
  );
};
Link.defaultProps = {};
export default Link;
