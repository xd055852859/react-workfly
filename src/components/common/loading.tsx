import React from 'react';
import './loading.css';
import loadingGif from '../../assets/svg/loading.gif';
interface LoadingProps {
  loadingWidth?: string;
  loadingHeight?: string;
}
const Loading: React.FC<LoadingProps> = (prop) => {
  const { loadingWidth, loadingHeight } = prop;
  return (
    <div className="loading-content">
      <div
        className="loading"
        style={{ width: loadingWidth, height: loadingHeight }}
      >
        <img
          src={loadingGif}
          alt=""
          style={{ width: '100%', height: '100%' }}
        />
        {/* <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div> */}
      </div>
    </div>
  );
};
Loading.defaultProps = {
  loadingWidth: '100px',
  loadingHeight: '100px',
};
export default Loading;
