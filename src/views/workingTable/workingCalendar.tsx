import React, { useState, useEffect, useRef } from 'react';
import './workingCalendar.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import moment from 'moment';
import _ from 'lodash';

import format from '../../components/common/format';
import Task from '../../components/task/task';

import defaultPersonPng from '../../assets/img/defaultPerson.png';

interface WorkingCanlendarProps {}

const WorkingCanlendar: React.FC<WorkingCanlendarProps> = (prop) => {
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);

  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const [dayCanlendarArray, setDayCanlendarArray] = useState<any>([]);
  const [dateArray, setDateArray] = useState<any>([]);
  const [colNumbers, setColNumbers] = useState(5);
  const [colWidth, setColWidth] = useState(0);
  const canlendarRef: React.RefObject<any> = useRef();

  useEffect(() => {
    if (workingTaskArray && headerIndex !== 3 && filterObject) {
      getData(workingTaskArray, filterObject);
    }
  }, [workingTaskArray, filterObject]);
  useEffect(() => {
    if (taskArray && headerIndex === 3) {
      getData(taskArray, filterObject);
    }
  }, [taskArray, filterObject]);
  useEffect(() => {
    if (canlendarRef.current) {
      let clientWidth = canlendarRef.current.clientWidth;
      let colWidth = 0;
      let size = 13;
      if (clientWidth <= 900) {
        setColNumbers(1);
        size = 15;
      } else if (clientWidth > 900 && clientWidth <= 1440) {
        setColNumbers(3);
        size = 14;
      } else {
        setColNumbers(5);
      }
      colWidth = Math.floor(clientWidth / colNumbers);
      setColWidth(colWidth);
      canlendarRef.current.scrollTo(colWidth * size, 0);
    }
  }, [canlendarRef.current]);
  const getData = (taskArray: any, filterObject: any) => {
    let dateArray: any = [];
    let dayCanlendarArray: any = [];
    let arr1: any = [];
    let arr2: any = [];
    let arr3: any = [];
    for (let i = 15; i > 0; i--) {
      arr1.push({
        start: moment(new Date()).subtract(i, 'days').startOf('day').valueOf(),
        end: moment(new Date()).subtract(i, 'days').endOf('day').valueOf(),
      });
    }
    for (let i = 0; i < 15; i++) {
      arr2.push({
        start: moment(new Date()).add(i, 'days').startOf('day').valueOf(),
        end: moment(new Date()).add(i, 'days').endOf('day').valueOf(),
      });
    }
    arr3 = arr1.concat(arr2);
    arr3.forEach((item, index) => {
      dateArray[index] = {
        arr: [],
        date: formatTime(item.start),
      };
      taskArray = _.cloneDeep(
        format.formatFilter(_.flatten(taskArray), filterObject)
      );
      _.flatten(taskArray).forEach((taskItem: any) => {
        if (
          taskItem.taskEndDate >= item.start &&
          taskItem.taskEndDate <= item.end
        ) {
          dateArray[index].arr.push(taskItem);
        }
      });
    });
    dateArray.forEach((item: any, index: number) => {
      dayCanlendarArray[index] = {};
      item.arr.forEach((taskItem: any) => {
        if (taskItem.executorKey) {
          if (!dayCanlendarArray[index][taskItem.executorKey]) {
            dayCanlendarArray[index][taskItem.executorKey] = [];
          }
          dayCanlendarArray[index][taskItem.executorKey].push(taskItem);
        }
      });
    });
    setDayCanlendarArray(dayCanlendarArray);
    setDateArray(dateArray);
  };
  const formatTime = (time: any) => {
    let week = moment(time).day();
    let timeStr = '';
    switch (week) {
      case 1:
        timeStr = '周一 ';
        break;
      case 2:
        timeStr = '周二 ';
        break;
      case 3:
        timeStr = '周三 ';
        break;
      case 4:
        timeStr = '周四 ';
        break;
      case 5:
        timeStr = '周五 ';
        break;
      case 6:
        timeStr = '周六 ';
        break;
      case 0:
        timeStr = '周日 ';
        break;
    }
    return [timeStr, moment(time).format('M.DD')];
  };
  const canlendarItem = (item: any) => {
    let dom: any = [];
    let newDom: any = null;
    if (item !== JSON.stringify('{}')) {
      for (let key in item) {
        dom.push(
          <React.Fragment key={'canlendarItem' + key}>
            <div className="dayCanlendar-title">
              <div className="dayCanlendar-img">
                <img
                  src={
                    item[key][0].executorAvatar
                      ? item[key][0].executorAvatar +
                        '?imageMogr2/auto-orient/thumbnail/80x'
                      : defaultPersonPng
                  }
                  alt=""
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = defaultPersonPng;
                  }}
                />
              </div>
              <div className="dayCanlendar-name">
                {item[key][0] ? item[key][0].executorName : ''}
              </div>
            </div>
            {item[key].map((taskItem: any, taskIndex: number) => {
              return (
                <div
                  className="dayCanlendar-info-item"
                  key={'taskItem' + taskIndex}
                >
                  {taskItem.show ? (
                    <Task
                      taskItem={taskItem}
                      timeSetStatus={taskIndex > item[key].length - 3}
                    />
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        );
      }
      newDom = <div className="dayCanlendar-info">{dom}</div>;
    }
    return newDom;
  };
  return (
    <div className="dayCanlendar" ref={canlendarRef}>
      <div
        className="dayCanlendar-container"
        style={{ width: colWidth * 30 + 'px' }}
      >
        {dayCanlendarArray.map((item: any, index: number) => {
          return (
            <div
              key={'dayCanlendar' + index}
              className="dayCanlendar-box"
              style={{ width: colWidth + 'px' }}
            >
              <div className="dayCanlendar-date">
                <span style={{ marginRight: '10px' }}>
                  {dateArray[index].date[0]}
                </span>
                <span>{dateArray[index].date[1]}</span>
              </div>
              {canlendarItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WorkingCanlendar;
