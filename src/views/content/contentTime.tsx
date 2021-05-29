import React, { useState, useRef, useCallback } from "react";
// import './userCenter.css';
import moment from "moment";
import { useMount } from "../../hook/common";
import { useTypedSelector } from "../../redux/reducer/RootState";
interface ContentTimeProps {}

const ContentTime: React.FC<ContentTimeProps> = (props) => {
  const { children } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const [nowTime, setNowTime] = useState<any>(new Date());
  let timerRef = useRef<any>(null);
  const formatTime = useCallback(() => {
    let hour = moment().hour();
    let nowTime: any = [];
    if (hour <= 9) {
      nowTime[0] = "早上";
    } else if (hour <= 12 && hour > 9) {
      nowTime[0] = "上午";
    } else if (hour <= 13 && hour > 12) {
      nowTime[0] = "中午";
    } else if (hour <= 18 && hour > 13) {
      nowTime[0] = "下午";
    } else {
      nowTime[0] = "晚上";
    }
    nowTime[1] = moment().format("HH:mm");
    setNowTime(nowTime);
  }, []);
  useMount(() => {
    formatTime();
    timerRef.current = setInterval(formatTime, 60000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  });
  return (
    <div className="content-title">
      <div className="content-mainTitle">
        {nowTime[0]}好,亲爱的{user && user.profile.nickName}
      </div>
      <div className="content-timeTitle">{nowTime[1]}</div>
      {children}
    </div>
  );
};
ContentTime.defaultProps = {};
export default ContentTime;
