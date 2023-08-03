import React from 'react';
import { Button } from 'antd';
import ClickOutSide from './clickOutside';
import closePng from '../../assets/img/close.png';
import './dialog.css';
interface dialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK?: any;
  onClose?: any;
  title?: string;
  footer?: boolean;
  showMask?: boolean;
  closePngState?: boolean;
  unOut?: boolean;
  noAnimate?: boolean;
}

const Dialog: React.FC<dialogProp> = (prop) => {
  const {
    children,
    visible,
    dialogStyle,
    onClose,
    onOK,
    title,
    footer,
    showMask,
    closePngState,
    unOut,
    // noAnimate,
  } = prop;
  const dialog = () => {
    return (
      <div
        className='dialog'
        //     : 'dialog animate__animated animate__slideInRight'
        // }
        style={dialogStyle}
        id="dialog"
      >
        {title ? (
          <div className="dialog-title">
            {title}
            {!showMask && !closePngState ? (
              <img
                src={closePng}
                onClick={onClose}
                style={{ height: '25px', width: '25px', cursor: 'pointer' }}
                alt=""
              />
            ) : null}
          </div>
        ) : null}
        {showMask ? (
          <img
            src={closePng}
            className="dialog-close"
            onClick={onClose}
            style={title ? { top: '17px' } : {}}
            alt=""
          />
        ) : null}
        <div className="dialog-info" style={!title ? { height: '100%' } : {}}>
          <div
            className="dialog-container"
            style={
              !footer
                ? { height: '100%' }
                : {
                  overflow: 'auto',
                }
            }
          >
            {children}
          </div>
          {footer ? (
            <div className="dialog-button">
              <Button
                type="primary"
                onClick={onOK}
                style={{ marginRight: '10px' }}
              >
                确认
              </Button>
              <Button onClick={onClose}>取消</Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      {visible ? (
        showMask ? (
          <div className="mask">{dialog()}</div>
        ) : (
          <ClickOutSide
            onClickOutside={() => {
              if (unOut) {
                onClose();
              }
            }}
          >
            {dialog()}
          </ClickOutSide>
        )
      ) : null}
    </React.Fragment>
  );
};
Dialog.defaultProps = {
  children: null,
  visible: false,
  dialogStyle: null,
  onClose: null,
  onOK: null,
  title: '',
  footer: true,
  showMask: true,
  unOut: true,
};
export default Dialog;
