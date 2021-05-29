import React, { useState, useEffect, useRef, useCallback } from "react";
import "./groupTableData.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Radio } from "antd";
import { useDispatch } from "react-redux";
import moment from "moment";
import _ from "lodash";
import api from "../../services/api";

import { setMessage } from "../../redux/actions/commonActions";

import Loading from "../../components/common/loading";
import emptyData from "../../assets/svg/emptyData.svg";
import ColumnChart from "../../components/common/chart/columnChart";
import ChordChart from "../../components/common/chart/chordChart";
import { useMount } from "../../hook/common";

interface GroupTableDataProps {}

const GroupTableData: React.FC<GroupTableDataProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  const [groupData, setGroupData] = useState<any>(null);
  const [taskState, setTaskState] = useState(0);
  const [columnData, setColumnData] = useState<any>(null);
  const [chordData, setChordData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [clientHeight, setClientHeight] = useState(0);
  const [pointIndex, setPointIndex] = useState(0);
  const taskTitleArr = ["昨日", "今日", "计划中", "已完成"];
  const dataRef: React.RefObject<any> = useRef();
  const chartRef = useRef<HTMLDivElement>(null);
  let unDistory = useRef<any>(true);
  
  useMount(() => {
    setClientHeight(document.body.clientHeight - 68);
    return () => {
      unDistory.current = false;
    };
  });
  const formatDay = useCallback((item: any) => {
    let time = 0;
    item.percent = parseInt(
      (
        (item.hour * 3600000 - item.countDownTime) /
        (item.hour * 36000)
      ).toFixed(1)
    );

    let countTime = item.hour * 3600000 - item.countDownTime;
    let hours = parseInt(
      ((countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(1)
    );

    let minutes = parseInt(
      ((countTime % (1000 * 60 * 60)) / (1000 * 60)).toFixed(1)
    );
    let seconds = parseInt(((countTime % (1000 * 60)) / 1000).toFixed(1));
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
  const getTeamData = useCallback(
    (arr: any, taskState: number) => {
      const startTime = moment(new Date()).startOf("day").valueOf();
      const endTime = moment(new Date()).endOf("day").valueOf();
      const startTaskTime = moment(new Date())
        .subtract(1, "days")
        .startOf("day")
        .valueOf();
      const endTaskTime = moment(new Date())
        .subtract(1, "days")
        .endOf("day")
        .valueOf();
      let newPersonObj: any = {};
      let state = false;
      arr.forEach((item: any, index: number) => {
        // item.finishPercent == 1
        switch (taskState) {
          case 0:
            state =
              item.taskEndDate >= startTaskTime &&
              item.taskEndDate <= endTaskTime &&
              item.finishPercent === 1;
            break;
          case 1:
            state =
              item.taskEndDate >= startTime &&
              item.taskEndDate <= endTime &&
              item.finishPercent === 0;
            break;
          case 2:
            state = item.finishPercent === 0;
            break;
          case 3:
            state = item.finishPercent === 1;
            break;
        }
        if (
          item.groupName &&
          item.groupName.indexOf("个人事务") === -1 &&
          item.title !== "" &&
          state &&
          item.taskEndDate
        ) {
          if (!newPersonObj[item.executorKey]) {
            newPersonObj[item.executorKey] = [];
          }
          item = formatDay(item);
          newPersonObj[item.executorKey].push(item);
          newPersonObj[item.executorKey] = _.sortBy(
            newPersonObj[item.executorKey],
            ["taskEndDate"]
          ).reverse();
          // this.showTabObj[item.executorKey] = true;
        }
      });
      // for (let key in newPersonObj) {
      //   if (key !== "position") {
      //     newPersonGroupObj[key] = {};
      //     newPersonObj[key].forEach((personItem: any, personIndex: number) => {
      //       if (!newPersonGroupObj[key][personItem.groupKey]) {
      //         newPersonGroupObj[key][personItem.groupKey] = [];
      //       }
      //       newPersonGroupObj[key][personItem.groupKey].push(personItem);
      //     });
      //   }
      // }
      // setPersonObj(newPersonObj);
      // setPersonGroupObj(newPersonGroupObj);
    },
    [formatDay]
  );
  const handleChart = useCallback((taskState: number, groupData: any) => {
    const startTime = moment(new Date()).startOf("day").valueOf();
    const endTime = moment(new Date()).endOf("day").valueOf();
    const startTaskTime = moment(new Date())
      .subtract(1, "days")
      .startOf("day")
      .valueOf();
    const endTaskTime = moment(new Date())
      .subtract(1, "days")
      .endOf("day")
      .valueOf();
    let data: any = [];
    let newData: any = {};
    let XYLeftData: any = {};
    let XYRightData: any = {};
    let columnData: any = [];
    let state = false;
    groupData.forEach((item: any) => {
      switch (taskState) {
        case 0:
          state =
            item.taskEndDate >= startTaskTime &&
            item.taskEndDate <= endTaskTime &&
            item.finishPercent === 1;
          break;
        case 1:
          state = item.taskEndDate >= startTime && item.taskEndDate <= endTime;
          break;
        case 2:
          state = item.finishPercent === 0;
          break;
        case 3:
          state = item.finishPercent === 1;
          break;
      }
      if (
        item.groupName &&
        item.groupName.indexOf("个人事务") === -1 &&
        item.title !== "" &&
        state &&
        item.taskEndDate
      ) {
        if (!newData[item.creatorName + "-" + item.executorName]) {
          newData[item.creatorName + "-" + item.executorName] = 1;
        } else {
          newData[item.creatorName + "-" + item.executorName] =
            newData[item.creatorName + "-" + item.executorName] + 1;
        }
        if (!XYLeftData[item.executorName]) {
          XYLeftData[item.executorName] = {
            num: 1,
            item: item,
          };
        } else {
          XYLeftData[item.executorName].num =
            XYLeftData[item.executorName].num + 1;
        }
        if (!XYRightData[item.creatorName]) {
          XYRightData[item.creatorName] = {
            num: 1,
            item: item,
          };
        } else {
          XYRightData[item.creatorName].num =
            XYRightData[item.creatorName].num + 1;
        }
      }
    });
    for (let key in newData) {
      let keyArr = key.split("-");
      data.push({ from: keyArr[0], to: keyArr[1], value: newData[key] });
    }
    for (let key in XYLeftData) {
      columnData.push({
        type: "执行力",
        number: XYLeftData[key].num,
        name: XYLeftData[key].item.executorName,
      });
    }
    for (let key in XYRightData) {
      columnData.push({
        type: "创造力",
        number: XYRightData[key].num,
        name: XYRightData[key].item.creatorName,
      });
    }
    columnData = _.sortBy(columnData, ["number"]).reverse();
    setChordData(data);
    setColumnData(columnData);
  }, []);
  const getGroupData = useCallback(
    async (taskState: number) => {
      setLoading(true);
      let dataRes: any = await api.task.getGroupDataTask(
        groupKey,
        [0, 1],
        null,
        moment().add(1, "days").startOf("day").valueOf()
      );
      if (unDistory.current) {
        if (dataRes.msg === "OK") {
          setLoading(false);
          setGroupData(dataRes.result);
          handleChart(taskState, dataRes.result);
          getTeamData(dataRes.result, taskState);
        } else {
          dispatch(setMessage(true, dataRes.msg, "error"));
        }
      }
    },
    [groupKey, getTeamData, handleChart, dispatch]
  );
  useEffect(() => {
    if (user && user._key) {
      setColumnData(null);
      setChordData(null);
      getGroupData(taskState);
    }
  }, [user, groupKey, getGroupData, taskState]);

  const onChange = (e: any) => {
    setTaskState(parseInt(e.target.value));
    handleChart(parseInt(e.target.value), groupData);
    getTeamData(groupData, parseInt(e.target.value));
  };

  const addZero = (num: number) => {
    return num > 9 ? num + "" : "0" + num;
  };
  //   let obj = {
  //     left: 0,
  //     top: 700,
  //   };
  //   let dom: any = document.getElementById("groupData" + item);
  //   if (dom) {
  //     let height = dom.clientHeight;
  //     let width = dom.offsetWidth;
  //     let ratio = width / height;
  //     let colIndex = index % colNumbers.current;
  //     obj.left = colIndex * colWidth;
  //     // //首行 top为 0，记录每列的高度
  //     if (index < colNumbers.current) {
  //       obj.top = 0;
  //       colHeight[colIndex] = colWidth / ratio + 5;
  //     } else {
  //       //获取高度的最小值
  //       let minHeight = Math.min.apply(null, colHeight);
  //       let minIndex = colHeight.indexOf(minHeight);
  //       //此图片的 top 为上面图片的高度，left 相等
  //       obj.top = parseInt(minHeight + "");
  //       obj.left = parseInt(minIndex * colWidth + "");
  //       //     //把高度加上去
  //       colHeight[minIndex] += parseInt(colWidth / ratio + "");
  //     }
  //     return obj;
  //     // this.$set(this.positionObj, item,obj);
  //     // this.$set(this.personObj, item, this.personObj[item]);
  //   }
  // };
  // const getGroupDom = (groupItem: any) => {
  //   let dom: any = [];
  //   for (let personIndex in groupItem) {
  //     let personItem = groupItem[personIndex];
  //     dom.push(
  //       <React.Fragment key={"personItem" + personIndex}>
  //         <div className="countdown-right-group" style={{ marginTop: "5px" }}>
  //           <React.Fragment>
  //             <div
  //               className="countdown-right-group-logo"
  //               style={{ borderRadius: "5px" }}
  //             >
  //               <img
  //                 src={
  //                   personItem[0].groupLogo
  //                     ? personItem[0].groupLogo
  //                     : defaultGroupPng
  //                 }
  //                 alt=""
  //               />
  //             </div>
  //             {personItem[0].groupName}
  //           </React.Fragment>
  //         </div>
  //         <div className="countdown-right-info">
  //           {personItem.map((taskItem: any, taskIndex: number) => {
  //             return (
  //               <div
  //                 className="countdown-right-task"
  //                 key={"taskItem" + taskIndex}
  //               >
  //                 <Task taskItem={taskItem} />
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </React.Fragment>
  //     );
  //   }
  //   return dom;
  //   // {personGroupObj[key].map(
  //   //   (personItem: any, personIndex: number) => {
  //   //     return (

  //   //     );
  //   //   }
  //   // )}
  // };
  // const getDom = () => {
  //   let dom: any = [];
  //   for (let key in personObj) {
  //     let item: any = personObj[key];
  //     dom.push(
  //       <div key={"person" + key} className="countdown-right-person-item">
  //         {key !== "position" ? (
  //           <React.Fragment>
  //             <div>
  //               <img
  //                 src={
  //                   item[0].executorAvatar
  //                     ? item[0].executorAvatar +
  //                       "?imageMogr2/auto-orient/thumbnail/80x"
  //                     : defaultPersonPng
  //                 }
  //                 alt=""
  //                 className="countdown-right-person-avatar"
  //                 onError={(e: any) => {
  //                   e.target.onerror = null;
  //                   e.target.src = defaultPersonPng;
  //                 }}
  //               />
  //               {item[0].executorName}
  //             </div>
  //             {getGroupDom(personGroupObj[key])}
  //           </React.Fragment>
  //         ) : null}
  //       </div>
  //     );
  //   }
  //   return dom;
  // };
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        position: "relative",
        background: "#f9f9f9",
      }}
      ref={dataRef}
    >
      {loading ? <Loading /> : null}
      <div
        className="choose-point"
        style={{ top: clientHeight / 2 - 60 + "px" }}
      >
        {[0, 1].map((item: any, index: number) => {
          return (
            <div
              style={
                pointIndex === index
                  ? { background: "#fff", border: "3px solid #333" }
                  : {}
              }
              onClick={() => {
                setPointIndex(index);
                dataRef.current.scrollTo(0, index * clientHeight);
              }}
              key={"point" + index}
            ></div>
          );
        })}
      </div>
      <div className="choose-container">
        <Radio.Group onChange={onChange} value={taskState}>
          {taskTitleArr.map((item: any, index: number) => {
            return (
              <Radio value={index} key={"radio" + index} style={radioStyle}>
                {item}
              </Radio>
            );
          })}
        </Radio.Group>
      </div>
      <div className="choose-container-item">
        <div className="choose-container-halfItem" ref={chartRef}>
          <div className="choose-container-item-title">
            {groupInfo ? groupInfo.groupName : ""} 执行力 / 创造力排行榜
          </div>
          {columnData && chartRef?.current ? (
            columnData.length > 0 ? (
              <ColumnChart
                data={columnData}
                height={chartRef.current.offsetHeight - 80}
                width={chartRef.current.offsetWidth - 80}
                columnId={"column" + groupKey}
              />
            ) : (
              <div
                style={{
                  height: chartRef.current.offsetHeight - 40,
                  width: chartRef.current.offsetWidth - 40,
                }}
                className="box-center"
              >
                <img src={emptyData} alt="" />
              </div>
            )
          ) : null}
        </div>
      </div>
      <div className="choose-container-item">
        <div className="choose-container-item-title">
          {groupInfo ? groupInfo.groupName : ""} 任务排行榜
        </div>
        {/* <div className="chart-div" id="chartdiv"></div> */}
        {chordData && chartRef?.current ? (
          chordData.length > 0 ? (
            <ChordChart
              data={chordData}
              height={chartRef.current.offsetHeight - 40}
              width={chartRef.current.offsetWidth - 40}
              chordId={"chord" + groupKey}
            />
          ) : (
            <div
              style={{
                height: chartRef.current.offsetHeight - 40,
                width: chartRef.current.offsetWidth - 40,
              }}
              className="box-center"
            >
              <img src={emptyData} alt="" />
            </div>
          )
        ) : null}
      </div>
      {/* <div className="countdown-right-item" ref={groupDataRef}>
        {getDom()}
      </div> */}
    </div>
  );
};
export default GroupTableData;
