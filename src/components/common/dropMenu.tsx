import React from 'react';
import ClickOutSide from './clickOutside';
import './dropMenu.css';
interface dropMenuProp {
  children: any;
  visible: boolean;
  dropStyle: any;
  onClose?: any;
  title?: string | null;
  closeType?: number;
  showCloseIcon?: boolean;
}

const DropMenu: React.FC<dropMenuProp> = (prop) => {
  const {
    children,
    visible,
    dropStyle,
    onClose,
    title,
    closeType,
    showCloseIcon,
  } = prop;
  return (
    <React.Fragment>
      {visible ? (
        <ClickOutSide onClickOutside={onClose ? onClose : () => {}}>
          <div
            className="dropMenu"
            style={dropStyle}
            onMouseLeave={() => {
              if (closeType === 1) {
                onClose();
              }
            }}
          >
            {title ? (
              <div className="dropMenu-title">
                {title}
                {showCloseIcon ? <div></div> : null}
              </div>
            ) : null}
            <div
              className="dropMenu-info"
              style={{ height: title ? 'calc(100% - 53px)' : '100%' }}
            >
              {children}
            </div>
          </div>
        </ClickOutSide>
      ) : null}
    </React.Fragment>
  );
};
DropMenu.defaultProps = {
  children: null,
  visible: false,
  dropStyle: null,
  onClose: null,
  title: null,
};
export default DropMenu;
