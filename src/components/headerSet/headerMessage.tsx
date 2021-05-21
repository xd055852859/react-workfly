import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import './headerCreate.css';
import MessageBoard from '../../views/board/messageBoard';
import closePng from '../../assets/img/close.png';
// import minusCreateSvg from '../../assets/svg/minusCreate.svg';
interface HeaderMessageProps {
  visible: boolean;
  onClose?: any;
  messageStyle?: any;
}

const HeaderMessage: React.FC<HeaderMessageProps> = (props) => {
  const { visible, onClose, messageStyle } = props;
  return (
    <React.Fragment>
      {visible ? (
        <div className="headerCreate" style={messageStyle}>
          <div className="headerCreate-mainTitle">
            消息中心
            <img
              src={closePng}
              onClick={() => {
                onClose();
              }}
              style={{ height: '25px', width: '25px', cursor: 'pointer' }}
            />
          </div>
          <MessageBoard type={'header'} />
        </div>
      ) : null}
    </React.Fragment>
  );
};
HeaderMessage.defaultProps = {};
export default HeaderMessage;
