import React, { useState, useRef } from 'react';
import './tooltip.css';
interface TooltipProp {
  children: any;
  title: string;
}

const Tooltip: React.FC<TooltipProp> = (prop) => {
  const { children, title } = prop;
  const [titleVisible, setTitleVisible] = useState(false);
  const [pos, setPos] = useState<number[]>([0, 0]);
  const tooltipRef: React.RefObject<any> = useRef();
  const showTitle = () => {
    setPos([
      tooltipRef.current.offsetHeight + tooltipRef.current.offsetTop + 5,
      tooltipRef.current.offsetLeft - 2,
    ]);
    setTitleVisible(true);
  };
  return (
    <div
      onMouseEnter={() => {
        showTitle();
      }}
      onMouseLeave={() => {
        setTitleVisible(false);
      }}
      ref={tooltipRef}
    >
      {children}
      {titleVisible && title ? (
        <div
          className="tooltip-title"
          style={{
            top: pos[0] + 'px',
            left: pos[1] + 'px',
            // width: title.length * 16 + 'px',
          }}
        >
          {title}
        </div>
      ) : null}
    </div>
  );
};
Tooltip.defaultProps = {
  children: null,
  title: '',
};
export default Tooltip;
