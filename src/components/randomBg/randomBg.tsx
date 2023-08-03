import React, { useState, useEffect, useRef } from "react";
import "./randomBg.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { getThemeBg } from "../../redux/actions/authActions";
import { useMount } from "../../hook/common";
import moment from "moment";
interface RandomBgProps { }

const RandomBg: React.FC<RandomBgProps> = (props) => {
  const themeBg = useTypedSelector((state) => state.auth.themeBg);
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const [imgIndex, setImgIndex] = useState<number>(0);
  let randomRef = useRef<any>(null);
  useMount(() => {
    if (localStorage.getItem("imgIndex")) {
      //@ts-ignore
      setImgIndex(parseInt(localStorage.getItem("imgIndex")));
    }
    if (themeBg.length === 0) {
      dispatch(getThemeBg(1));
    }
    return () => {
      if (randomRef.current) {
        clearInterval(randomRef.current);
        randomRef.current = null;
      }
    };
  });

  useEffect(() => {
    if (themeBg && themeBg.length > 0 && theme.randomType) {
      let todayTime: any = moment().startOf('days').valueOf();
      let randomIndex = Math.floor(Math.random() * (themeBg.length - 1));
      //eslint-disable-next-line
      if (localStorage.getItem('todayTime')) {
        todayTime = localStorage.getItem('todayTime')
        todayTime = parseInt(todayTime);
      }
      let step = 3600000;
      if (randomRef.current) {
        clearInterval(randomRef.current);
        randomRef.current = null;
      }
      if (theme.randomType === '1' || theme.randomType === '2') {
        if (theme.randomType === '1') {
          step = 60000;
        }
        randomRef.current = setInterval(() => {
          setImgIndex((prevIndex) => {
            if (prevIndex === themeBg.length - 1) {
              prevIndex = 0;
            } else {
              prevIndex = prevIndex + 1;
            }
            localStorage.setItem("imgIndex", prevIndex + "");
            return prevIndex;
          });
        }, step);
      }
      if (theme.randomType === '3') {
        if (moment().startOf('day').valueOf() !== todayTime) {
          setImgIndex(randomIndex)
          localStorage.setItem("randomIndex", randomIndex + "");
        }
      }
      if (theme.randomType === '4') {
        if (moment().startOf('week').valueOf() !== moment(todayTime).startOf('week').valueOf()) {
          setImgIndex(randomIndex)
          localStorage.setItem("randomIndex", randomIndex + "");
        }
      }
      if (theme.randomType === '5') {
        if (moment().startOf('month').valueOf() !== moment(todayTime).startOf('month').valueOf()) {
          setImgIndex(randomIndex)
          localStorage.setItem("randomIndex", randomIndex + "");
        }
      }
    }
    //eslint-disable-next-line
  }, [themeBg]);
  useEffect(() => {
    if (themeBg && themeBg.length > 0 && theme.randomType) {
      let randomIndex = Math.floor(Math.random() * themeBg.length);
      let step = 3600000;
      if (randomRef.current) {
        clearInterval(randomRef.current);
        randomRef.current = null;
      }
      if (theme.randomType === '1' || theme.randomType === '2') {
        if (theme.randomType === 1) {
          step = 60000;
        }
        setImgIndex(randomIndex)
        localStorage.setItem("randomIndex", randomIndex + "");
        randomRef.current = setInterval(() => {
          setImgIndex((prevIndex) => {
            if (prevIndex === themeBg.length - 1) {
              prevIndex = 0;
            } else {
              prevIndex = prevIndex + 1;
            }
            localStorage.setItem("imgIndex", prevIndex + "");
            return prevIndex;
          });
        }, step);
      }
      if (theme.randomType === '3' || theme.randomType === '4' || theme.randomType === '5') {
        setImgIndex(randomIndex)
        localStorage.setItem("randomIndex", randomIndex + "");
      }
    }
    //eslint-disable-next-line
  }, [theme?.randomType]);

  return (
    <React.Fragment>
      {themeBg && themeBg.length > 0 ? (
        <div className="randomBg">
          <img src={themeBg[imgIndex]?.url} alt="" />
          <img src={themeBg[imgIndex + 1]?.url} alt="" />
        </div>
      ) : null}
    </React.Fragment>
  );
};
RandomBg.defaultProps = {};
export default RandomBg;
