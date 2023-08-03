import React from 'react';
import './calendarHeader.css';
// import calendarHomePng from '../../assets/img/calendarHome.png';
interface CalendarProps {
  slot: any;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  let { slot } = props;
  return (
    <div
      className="calendarHeader"
    >
      {/* <img src={calendarHomePng} alt="" className="calendarHeader-logo" /> */}
      <div style={{ marginRight: '20px' }}>日程</div>
      {slot}
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
