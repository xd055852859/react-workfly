import React, { useState, useEffect, useRef } from "react";
import "./randomBg.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { getThemeBg } from "../../redux/actions/authActions";
import { useMount } from "../../hook/common";
interface RandomBgProps {}

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
    if (themeBg && themeBg.length > 0) {
      let step = 86400000;
      if (randomRef.current) {
        console.log("删除定时器");
        clearInterval(randomRef.current);
        randomRef.current = null;
        console.log(randomRef.current);
      }
      switch (theme?.randomType) {
        case "1":
          step = 60000;
          break;
        case "2":
          step = 3600000;
          break;
        case "3":
          step = 86400000;
          break;
      }
      console.log(step);
      randomRef.current = setInterval(() => {
        console.log("???????????????????");
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
  }, [theme?.randomType, themeBg]);
  return (
    <React.Fragment>
      {themeBg && themeBg.length > 0 ? (
        <div className="randomBg">
          <img src={themeBg[imgIndex]?.url} alt=""/>
          <img src={themeBg[imgIndex + 1]?.url}  alt=""/>
        </div>
      ) : null}
    </React.Fragment>
  );
};
RandomBg.defaultProps = {};
export default RandomBg;
