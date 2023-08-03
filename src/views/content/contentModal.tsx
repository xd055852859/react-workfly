import React, { useState, useEffect, useCallback, useRef } from "react";
import "./contentModal.css";
import { Button, Drawer } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import moment from "moment";
import api from "../../services/api";

import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import { setWorkHeaderIndex } from "../../redux/actions/memberActions";

import Avatar from "../../components/common/avatar";
// import GaugeChart from '../../components/common/chart/gaugeChart';
// import Task from '../../components/task/task';
import Loading from "../../components/common/loading";
import ClockIn from "../../components/clockIn/clockIn";

import companyTab2Svg from "../../assets/svg/companyTab2.svg";
interface ContentModalProps {}

const ContentModal: React.FC<ContentModalProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const allNumber = useTypedSelector((state) => state.auth.allNumber);
  // const [mainArray, setMainArray] = useState<any>([]);
  // const [percent, setPercent] = useState<any>([]);
  // const [energyValue, setEnergyValue] = useState<any>(0);
  const [loading, setLoading] = useState<any>(true);
  const [clockVisible, setClockVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const childRef = useRef<any>();
  const weekArray = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  let unDistory = useRef<any>(true);
  useEffect(() => {
    return () => {
      unDistory.current = false;
    };
  }, []);
  // const getTodayEnergyValue = useCallback(async () => {
  //     let energyRes: any = await api.common.todayEnergyValueRanking();
  //     if (energyRes.msg === "OK") {
  //         let percent = !isNaN(parseFloat(
  //             ((energyRes.result.groupMemberNumber - energyRes.result.overNumber)
  //                 / energyRes.result.groupMemberNumber).toFixed(2)
  //         )) ? parseFloat(
  //             ((energyRes.result.groupMemberNumber - energyRes.result.overNumber)
  //                 / energyRes.result.groupMemberNumber).toFixed(2)
  //         ) : 0
  //         setLoading(false)
  //         setPercent(percent)
  //         setEnergyValue(energyRes.result.myEnergyValue)
  //     } else {
  //         setLoading(false)
  //         dispatch(setMessage(true, energyRes.msg, "error"));
  //     }
  // }, [dispatch])
  const getPrompt = useCallback(async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (unDistory.current) {
      if (promptRes.msg === "OK") {
        setLoading(false);
        setPrompt(promptRes.result.content);
      } else {
        setLoading(false);
        dispatch(setMessage(true, promptRes.msg, "error"));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      // getTodayEnergyValue()
      getPrompt();
    }
  }, [user, getPrompt]);
  // const getData = useCallback(
  //     (selfTaskArray: any) => {
  //         let mainArray: any = [];
  //         const endTime = moment().endOf("day").valueOf();
  //         selfTaskArray.forEach((item: any, index: number) => {
  //             if (
  //                 // eslint-disable-next-line
  //                 item.taskEndDate && item.taskEndDate <= endTime && item.finishPercent === 0 &&
  //                 (item.type === 2 || item.type === 6) &&
  //                 (item.executorKey === user._key || item.creatorKey === user._key)
  //             ) {
  //                 mainArray.push(item)
  //             }
  //         });
  //         setMainArray(mainArray);
  //     },
  //     [user]
  // );
  // useEffect(() => {
  //     if (selfTaskArray) {
  //         getData(selfTaskArray);
  //     }
  // }, [selfTaskArray, getData]);
  const toVitality = () => {
    dispatch(setCommonHeaderIndex(1));
    dispatch(setWorkHeaderIndex(5));
  };
  return (
    <div className="contentModal">
      {loading ? <Loading /> : null}
      <div className="contentModal-title">
        <div className="contentModal-title-left">
          <Avatar
            avatar={user?.profile.avatar}
            name={user?.profile.nickName}
            type={"person"}
            index={0}
            size={30}
          />
          <div className="contentModal-title-left-title">
            {user?.profile.nickName},
            {moment().hour() < 12 ? "早上好" : "下午好"} 欢迎回来工作
          </div>
        </div>
      </div>
      <div className="contentModal-content">
        <div className="contentModal-content-left">
          <div>
            {moment().format("YYYY-MM-DD")} {weekArray[moment().days()]}
          </div>
          <div className="contentModal-content-left-hour">
            {moment().format("HH:mm")}
          </div>
          <div>{prompt}</div>
          <div className="contentModal-title-right">
            <Button
              type="primary"
              onClick={() => {
                setClockVisible(true);
              }}
            >
              {moment().hour() > 15
                ? "下班打卡"
                : moment().hour() < 9
                ? "上班打卡"
                : "晒一晒"}
            </Button>
            {/* <CloseOutlined onClick={() => {
                        dispatch(changeContentVisible(false))
                    }} /> */}
          </div>
        </div>
        <div className="contentModal-content-right">
          <div
            className="contentModal-content-left-chart"
            onClick={() => {
              toVitality();
            }}
          >
            {/* {!isNaN(percent) && !loading ? <GaugeChart
                            percent={percent}
                            zoom={0.5}
                            gaugeId={"liquidcontent"} /> : null} */}
            <div
              className="contentModal-content-icon"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setCommonHeaderIndex(1));
                dispatch(setWorkHeaderIndex(5));
              }}
            >
              <img
                src={companyTab2Svg}
                alt=""
                style={{
                  width: "300px",
                  height: "150px",
                  marginBottom: "15px",
                }}
              />
              <div className="contentModal-content-icon-text">
                <span>
                  {!isNaN(allNumber[1])
                    ? parseFloat(allNumber[1].toFixed(1))
                    : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="contentModal-content-left-title">
            今日活力
            {/* {energyValue > 0 ? ("+ " + parseInt(energyValue)) : energyValue < 0 ? ("- " + parseInt(energyValue)) : 0} */}
          </div>
          {/* <div className="contentModal-content-right-title">待办 ({mainArray.length})</div>
                    <div className="contentModal-content-right-task"> {mainArray.map((taskItem: any, taskIndex: number) => {
                        return <Task taskItem={taskItem} key={"task" + taskIndex} />;
                    })}</div> */}
        </div>
      </div>
      <Drawer
        visible={clockVisible}
        onClose={() => {
          if (childRef?.current) {
            //@ts-ignore
            childRef.current.saveClockIn();
          }
          setClockVisible(false);
        }}
        width={280}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        title={"打卡"}
      >
        <ClockIn ref={childRef} />
      </Drawer>
    </div>
  );
};
ContentModal.defaultProps = {};
export default ContentModal;
