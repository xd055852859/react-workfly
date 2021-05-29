import React, { useState, useEffect } from "react";
import "./link.css";
import { Input, Button } from "antd";

import Iframeview from "../common/iframeview";
interface LinkProps {
  targetData: any;
  hideUrl?: boolean;
  onChange?: any;
}

let timer: NodeJS.Timeout;
const Link: React.FC<LinkProps> = (props) => {
  const { targetData, onChange } = props;
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
        <Button
          type="primary"
          style={{ color: "#fff" }}
          onClick={() => {
            onChange(url);
          }}
        >
          保存
        </Button>
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
