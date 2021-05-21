import React, { useEffect, useRef } from "react";
import "./star.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import moveSvg from "../../assets/svg/move.svg";
import { useMount } from "../../hook/common";
interface StarProps {}

const Star: React.FC<StarProps> = (props) => {
  const finishPos = useTypedSelector((state) => state.auth.finishPos);
  let starRef = useRef<any>(null);
  const starDomRef: React.RefObject<any> = useRef();
  useMount(() => {
    clearTimeout(starRef.current);
    return () => {
      if (starRef.current) {
        clearTimeout(starRef.current);
      }
    };
  });
  useEffect(() => {
    if (finishPos.length > 0 && starDomRef?.current) {
      let style: any = document.styleSheets[8];
      if (style) {
        starDomRef.current.style.display = "block";
        starDomRef.current.style.top =
          document.documentElement.clientWidth - finishPos[1] - 20 + "px";
        starDomRef.current.style.right =
          document.documentElement.clientWidth - finishPos[0] - 20 + "px";
        starRef.current = setTimeout(() => {
          if (style) {
            style.deleteRule(0);
            style.deleteRule(1);
          }
          starDomRef.current.style.display = "none";
          clearTimeout(starRef.current);
        }, 2500);

        style.insertRule(
          `@keyframes run-right-top
            { 0% {top: ${finishPos[1] - 20}px}  
              30% {top: ${finishPos[1] - 20}px} 
              100% {top: 15px}}`,
          0
        );
        style.insertRule(
          `@keyframes run-right-right 
            { 0% { transform: scale(1)} 
              30% { right: ${
                document.documentElement.clientWidth - finishPos[0] - 20
              }px ; transform: scale(1.25);} 
              100% { right: 30px ; transform: scale(0.45);}`,
          1
        );
      }
    }
  }, [finishPos]);
  return (
    <div className="ball" ref={starDomRef}>
      <img src={moveSvg} alt="" style={{ width: 40, height: 40 }} />
    </div>
  );
};
Star.defaultProps = {};
export default Star;
