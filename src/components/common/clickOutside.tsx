import React, { useState, useRef } from 'react';
import { useMount } from '../../hook/common';

export interface Props {
  onClickOutside: Function;
  children: React.ReactNode;
  style?: any;
}
const ClickOutside: React.FC<Props> = (props) => {
  const { style, onClickOutside, children } = props;
  const [isTouch, setisTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handle(e: MouseEvent | TouchEvent) {
    if (e.type === 'touchend') setisTouch(true);
    if (e.type === 'click' && isTouch) return;

    const el: any = containerRef.current;
    if (el && !el.contains(e.target)) onClickOutside();
  }

  useMount(() => {
    document.addEventListener('touchend', handle, true);
    document.addEventListener('click', handle, true);
    document.addEventListener('contextmenu', handle, true);

    return () => {
      document.removeEventListener('touchend', handle, true);
      document.removeEventListener('click', handle, true);
      document.removeEventListener('contextmenu', handle, true);
    };
  });

  const propsStyle = style || {};

  return (
    <div
      ref={containerRef}
      // style={{ ...{ width: 'fit-content' }, ...propsStyle }}
      style={{ ...propsStyle }}
    >
      {children}
    </div>
  );
};
export default ClickOutside;
