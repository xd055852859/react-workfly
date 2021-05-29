import React, { useState, useRef } from "react";
// import './userCenter.css';
import moment from "moment";
import { useMount } from "../../hook/common";
import { useTypedSelector } from "../../redux/reducer/RootState";
import format from "../../components/common/format";
import traditionalDate from "../../components/common/date";

import ClockNew from "../../components/clock/clockNew";
interface TimePointProps {}

const TimePoint: React.FC<TimePointProps> = (props) => {
  const theme = useTypedSelector((state) => state.auth.theme);
  const [nowTime, setNowTime] = useState<any>(new Date());
  const [showPoint, setShowPoint] = useState(true);
  let timerRef = useRef<any>(null);
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  const week = moment().day();
  const weekStr = ["日", "一", "二", "三", "四", "五", "六"];
  useMount(() => {
    let newShowPoint = true;
    setShowPoint(!newShowPoint);
    newShowPoint = !newShowPoint;
    timerRef.current = setInterval(() => {
      setNowTime(new Date());
      setShowPoint(newShowPoint);
      newShowPoint = !newShowPoint;
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  });
  return (
    <div className="showPage-time">
      {theme.timeShow !== false ? (
        <div className="showPage-time-title">
          {moment(nowTime).format("HH")}
          <span
            style={{
              width: "50px",
              marginTop: "-24px",
              marginLeft: "10px",
            }}
          >
            {showPoint ? ":" : ""}
          </span>
          {moment(nowTime).format("mm")}
        </div>
      ) : (
        <ClockNew nowTime={nowTime} />
      )}

      <div className="showPage-time-subtitle">
        <div className="showPage-time-subtitle-top">
          {year + "." + (month + 1) + "." + day + " 星期" + weekStr[week] + " "}
          {!theme.timeShow !== false ? moment(nowTime).format("HH:mm") : ""}
        </div>
        {theme.cDayShow !== false ? (
          <div>
            {" 农历 " +
              format.formatJq(year, month, day) +
              " " +
              traditionalDate.GetLunarDay(moment())[1] +
              traditionalDate.GetLunarDay(moment())[2]}
          </div>
        ) : null}
      </div>

      {/* <Button
      color="primary"
      onClick={(e: any) => {
        window.location.href = window.location.origin + '/';
        // changeShowType();
        e.stopPropagation();
      }}
      style={{ color: '#fff' }}
      variant="contained"
    >
      Working / Today
    </Button> */}
    </div>
  );
};
TimePoint.defaultProps = {};
export default TimePoint;
