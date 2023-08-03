import React, { useState, useEffect } from 'react';
import './vitalityIcon.css';
import crownPng from '../../assets/img/crown.png';
import sunPng from '../../assets/img/sun.png';
import moonPng from '../../assets/img/moon.png';
import starPng from '../../assets/img/star.png';
import crowngPng from '../../assets/img/crowng.png';
import sungPng from '../../assets/img/sung.png';
import moongPng from '../../assets/img/moong.png';
import stargPng from '../../assets/img/starg.png';
import crySvg from '../../assets/svg/cry.svg';
// import { useDispatch } from 'react-redux';

interface VitalityProps {
  vitalityDirection: string;
  vitalityNum: number;
  vitalityStyle?: any;
  vitalityIconType?: number;
}

const VitalityIcon: React.FC<VitalityProps> = (props) => {
  const {
    vitalityDirection,
    vitalityNum,
    vitalityStyle,
    vitalityIconType,
  } = props;
  const [vitalityArray, setvitalityArray] = useState<number[]>([]);
  useEffect(() => {
    const crown = Math.floor(vitalityNum / 10000);
    const sun = Math.floor((vitalityNum - crown * 10000) / 1000);
    const moon = Math.floor((vitalityNum - crown * 10000 - sun * 1000) / 100);
    const star = Math.floor(
      (vitalityNum - crown * 10000 - sun * 1000 - moon * 100) / 10
    );
    setvitalityArray([crown, sun, moon, star]);
  }, [vitalityNum]);
  const vitalityImg = (
    num: number,
    src: any,
    width: string,
    height: string
  ) => {
    let dom: any = [];
    if (vitalityDirection === 'vertical') {
      if (num > 0) {
        dom.push(
          <span
            style={{
              height: height,
              display: 'flex',
              alignContent: 'flex-end',
            }}
            key={'vertical' + num}
          >
            <span
              className="vitalityIcon-img"
              style={{ width: width, height: height }}
            >
              <img src={src} alt="" />
            </span>
            <span className="vitalityIcon-title">{num}</span>
          </span>
        );
      }
    } else {
      for (var i = 0; i < num; i++) {
        dom.push(
          <span
            className="vitalityIcon-img"
            style={{ width: width, height: height }}
            key={'horizontal' + i}
          >
            <img src={src} alt="" />
          </span>
        );
      }
    }
    return dom;
  };
  return (
    <React.Fragment>
      {vitalityNum > 0 ? (
        <span className="vitalityIcon-info" style={vitalityStyle}>
          {vitalityImg(
            vitalityArray[0],
            vitalityIconType ? crowngPng : crownPng,
            '20px',
            '17px'
          )}
          {vitalityImg(
            vitalityArray[1],
            vitalityIconType ? sungPng : sunPng,
            '19px',
            '19px'
          )}
          {vitalityImg(
            vitalityArray[2],
            vitalityIconType ? moongPng : moonPng,
            '16px',
            '16px'
          )}
          {vitalityImg(
            vitalityArray[3],
            vitalityIconType ? stargPng : starPng,
            '16px',
            '16px'
          )}
        </span>
      ) : (
        <span className="vitalityIcon-info">
          <span
            className="vitalityIcon-img"
            style={{ width: '20px', height: '20px' }}
          >
            <img src={crySvg} alt="" />
          </span>
        </span>
      )}
    </React.Fragment>
  );
};
VitalityIcon.defaultProps = {
  vitalityDirection: 'horizontal',
  vitalityNum: 0,
};
export default VitalityIcon;
