import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './bootpage.css';
import bootpage from '../../assets/img/bootpage.png';
import bootlogo from '../../assets/svg/bootlogo.svg';
import boottitle from '../../assets/img/boottitle.png';
import { Button } from 'antd';
import _ from 'lodash';
declare var window: Window 
const Bootpage: React.FC = () => {
  const history = useHistory();
  const bootpageRef: React.RefObject<any> = useRef();
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/home/basic');
    }
  }, []);
  useEffect(() => {
    if (bootpageRef.current) {
      setClientWidth(bootpageRef.current.clientWidth);
      let clientHeight = bootpageRef.current.clientHeight;
      setClientHeight(clientHeight);
    }
  }, [bootpageRef]);
  useEffect(() => {
    function handle(e: any) {
      if (
        e.origin === 'https://account.qingtime.cn' &&
        e.data.eventName === 'redirect'
      ) {
        window.location.href = e.data.data;
      }
    }
    window.addEventListener('message', handle, false);
    return () => {
      window.removeEventListener('message', handle);
    };
  }, []);
  const toUrl = () => {
    window.open('http://beian.miit.gov.cn/');
  };
  const toLogin = () => {
    if (localStorage.getItem('token')) {
      history.push('/home/basic');
    } else {
      const redirect = `${window.location.protocol}//${window.location.host}/home/basic`;
      // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
      window.open(
        `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`,
        'new',
        `width=360, height=420, resizable=false, toolbar=no, menubar=no, location=no, status=no, top=${
          (clientHeight - 420) / 2
        }, left=${(clientWidth - 360) / 2}`
      );
    }
  };
  window.onresize = _.debounce(function () {
    setClientWidth(bootpageRef.current.clientWidth);
    let clientHeight = bootpageRef.current.clientHeight;
    setClientHeight(clientHeight);
  }, 500);
  return (
    <div className="bootpage" ref={bootpageRef}>
      <div className="bootpage-logo">
        <img src={bootlogo} alt="" style={{ width: '50px', height: '42px' }} />
        <a href="https://bbs.working.vip" style={{ marginLeft: '8px' }}>
          官网
        </a>
      </div>
      <div className="bootpage-content">
        <div className="bootpage-image">
          <img src={bootpage} alt="" />
        </div>
        <div className="bootpage-title">
          <img src={boottitle} alt="" />
        </div>
        <Button
          className="bootpage-button"
          onClick={() => {
            toLogin();
          }}
        >
          开始工作
        </Button>
      </div>
      {/* v-show="videoState"  */}
      {/* <div
        className="bootpage-video"
        style={{
          width: clientHeight + 'px',
          left: clientWidth - clientHeight / 2 + 'px',
          height: clientHeight - 1 + 'px',
          overflow: 'hidden',
        }}
      >
        <video
          src="https://cdn-icare.qingtime.cn/714228E0.mp4"
          autoPlay
          muted
          loop
          style={{ height: '100%', position: 'absolute', right: '-35%' }}
        >
          您的浏览器不支持 video 标签。
        </video>
      </div> */}
      <div
        onClick={() => {
          toUrl();
        }}
        className="bootpage-footer"
      >
        ©2019 江苏时光信息科技有限公司 Qingtime All Rights Reserved
        苏ICP备15006448号
      </div>
    </div>
  );
};
export default Bootpage;
