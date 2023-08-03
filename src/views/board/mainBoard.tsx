import React, { useState, useEffect, useCallback } from "react";
import "./mainBoard.css";
import moment from "moment";
import _ from "lodash";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { useMount } from "../../hook/common";

import { getSelfTask } from "../../redux/actions/taskActions";

import Task from "../../components/task/task";
import Avatar from "../../components/common/avatar";
import Loading from "../../components/common/loading";

import nothingsSvg from "../../assets/svg/nothings.svg";


interface MainBoardItemProps {
  mainItem: any;
}
const MainBoardItem: React.FC<MainBoardItemProps> = (props) => {
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const { mainItem } = props;
  let myState = false;
  if (
    mainItem[0].groupName.indexOf("主项目") !== -1 &&
    mainItem[0].groupKey === mainGroupKey
  ) {
    mainItem[0].groupName = "个人事务";
    myState = true;
  }
  return (
    <React.Fragment>
      <div>
        <div className="mainBoard-title">
          {!myState ? (
            <div
              style={{
                width: "22px",
                height: "22px",
                marginRight: "5px",
                borderRadius: "5px",
                overflow: 'hidden'
              }}
            >
              <Avatar
                avatar={mainItem[0]?.groupLogo}
                name={mainItem[0]?.groupName}
                type={'group'}
                index={0}
              />
            </div>
          ) : null}
          {mainItem[0].groupName}
        </div>
      </div>

      {mainItem.map((taskItem: any, taskIndex: number) => {
        return <Task taskItem={taskItem} key={"task" + taskIndex} />;
      })}
    </React.Fragment>
  );
};
interface MainBoardProps {
  showType?: string;
}

const MainBoard: React.FC<MainBoardProps> = (props) => {
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [mainArray, setMainArray] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useMount(() => {
    setLoading(true);
    dispatch(
      getSelfTask(
        1,
        userKey,
        "[0, 1]",
        1,
        moment().add(1, "days").startOf("day").valueOf(),
        1
      )
    );
  });

  const formatDay = useCallback((item: any) => {
    let time = 0;
    item.percent = Math.floor(
      (item.hour * 3600000 - item.countDownTime) / (item.hour * 36000)
    );
    let countTime = item.hour * 3600000 - item.countDownTime;
    let hours = Math.floor(
      (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((countTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((countTime % (1000 * 60)) / 1000);
    item.countDownText =
      addZero(hours) + " : " + addZero(minutes) + " : " + addZero(seconds);
    if (item.taskEndDate) {
      time = Math.floor(
        (moment(item.taskEndDate).endOf("day").valueOf() -
          moment(new Date().getTime()).endOf("day").valueOf()) /
        86400000
      );
    }
    item.time = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
    item.endState = time < 0 ? false : true;
    return item;
  }, []);
  const getData = useCallback(
    (selfTaskArray: any, finishPercentArr: any) => {
      if (user) {
        let groupObj: any = {};
        let state = "";
        const startTime = moment().startOf("day").valueOf();
        const endTime = moment().endOf("day").valueOf();
        if (finishPercentArr && finishPercentArr.indexOf("0") !== -1) {
          state =
            state +
            "(item.finishPercent === 0 " +
            " && item.taskEndDate <= " +
            endTime +
            ")";
        }
        if (finishPercentArr && finishPercentArr.indexOf("1") !== -1) {
          state =
            state +
            (state
              ? "||(item.finishPercent === 1 && item.taskEndDate >= " +
              startTime +
              "  && item.taskEndDate <= " +
              endTime +
              ")"
              : "(item.finishPercent === 1 && item.taskEndDate >= " +
              startTime +
              "  && item.taskEndDate <= " +
              endTime +
              ")");
        }
        if (finishPercentArr && finishPercentArr.indexOf("2") !== -1) {
          state =
            state +
            (state
              ? "||(item.finishPercent === 0 && item.taskEndDate <= " +
              endTime +
              ")"
              : "(item.finishPercent === 0 && item.taskEndDate <=" +
              endTime +
              ")");
        }
        selfTaskArray.forEach((item: any, index: number) => {
          if (
            // eslint-disable-next-line
            eval(state) &&
            item.taskEndDate &&
            (item.type === 2 || item.type === 6) &&
            (item.executorKey === user._key || item.creatorKey === user._key)
          ) {
            if (item.executorKey === user._key) {
              if (!groupObj[item.groupKey]) {
                groupObj[item.groupKey] = [];
              }
              item = formatDay(item);
              groupObj[item.groupKey].push(item);
              groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
                "serialNumber",
              ]).reverse();
            }
          }
        });
        setMainArray(_.sortBy(_.values(groupObj), ["groupName"]));
      }
    },
    [user, formatDay]
  );
  useEffect(() => {
    if (selfTaskArray && theme?.finishPercentArr) {
      setLoading(false);
      getData(selfTaskArray, theme.finishPercentArr);
    }
  }, [selfTaskArray, theme?.finishPercentArr, getData]);
  useEffect(() => {
    if (taskInfo && selfTaskArray) {
      let newSelfTaskArray = _.cloneDeep(selfTaskArray);
      let mainIndex = _.findIndex(newSelfTaskArray, { _key: taskInfo._key });
      if (mainIndex !== -1) {
        newSelfTaskArray[mainIndex] = { ...taskInfo };
      }
      getData(newSelfTaskArray, theme?.finishPercentArr);
    }
    //eslint-disable-next-line
  }, [taskInfo]);
  const addZero = (num: number) => {
    return num > 9 ? num + "" : "0" + num;
  };
  return (
    <div className="mainBoard">
      {loading ? <Loading /> : null}
      {/* {!showType ? (
        <div className="mainBoard-maintitle">
          今日事务 ({allNum - finishNum} / {allNum})
        </div>
      ) : null} */}
      {mainArray.length > 0 ? (
        <div className="mainBoard-item">
          {mainArray.map((mainItem: any, mainIndex: number) => {
            return (
              <MainBoardItem mainItem={mainItem} key={"main" + mainIndex} />
            );
          })}
        </div>
      ) : (
        <img src={nothingsSvg} alt="" />
      )}
    </div>
  );
};
export default MainBoard;
