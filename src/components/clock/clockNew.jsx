import React from 'react';
import Clock from 'react-clock';
import './clockNew.css';

const ClockNew = (props) => {
  let { nowTime } = props



  return (
    <div className="react-clock-container">
      <Clock value={nowTime} size={600} renderMinuteMarks={false} />
      <div className="react-clock-center"></div>
    </div>
  )
}
ClockNew.defaultProps = {};
export default ClockNew;
