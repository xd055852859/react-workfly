import React, { useState, useEffect, useRef } from "react";
import "./workingReport.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, Tooltip } from "antd";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";

import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/actions/commonActions";
import { getWorkingTableTask } from "../../redux/actions/taskActions";
import { changeMusic } from "../../redux/actions/authActions";
import Task from "../../components/task/task";

import memberSvg from "../../assets/svg/member.svg";
import deletePng from "../../assets/img/deleteDiary.png";
import commentPng from "../../assets/img/comment.png";
import reportIcon from "../../assets/svg/reportIcon.svg";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import { useMount } from "../../hook/common";
import Avatar from "../../components/common/avatar";
export interface WorkingReportProps {
  headerType?: boolean;
}

const WorkingReport: React.FC<WorkingReportProps> = (props) => {
  const { headerType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const [diaryIndex, setDiaryIndex] = useState("");
  const [diaryKey, setDiaryKey] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [positive, setPositive] = useState("");
  const [negative, setNegative] = useState("");
  const [note, setNote] = useState("");
  const [commentList, setCommentList] = useState<any>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotal, setCommentTotal] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const [personObj, setPersonObj] = useState<any>(null);
  const [personArray, setPersonArray] = useState<any>([{}]);

  const [moveState, setMoveState] = useState<any>(null);

  const commentLimit = 10;
  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  useEffect(() => {
    if (user && user._key) {
      if (headerIndex === 3 && taskArray && !headerType) {
        setDiaryKey("全部");
        getData(taskArray, "全部");
      } else if (
        workingTaskArray &&
        (headerType ||
          headerIndex === 1 ||
          (headerIndex === 2 && targetUserInfo))
      ) {
        if (headerIndex === 2 && !headerType) {
          setDiaryKey(targetUserInfo._key);
          getData(_.flatten(workingTaskArray), targetUserInfo._key);
        } else {
          setDiaryKey(user._key);
          getData(_.flatten(workingTaskArray), user._key);
        }
      }
    }
    //eslint-disable-next-line
  }, [user, targetUserInfo, taskArray, workingTaskArray, headerIndex, headerType]);

  useEffect(() => {
    if (user && user._key && headerType) {
      dispatch(
        getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10], 2)
      );
    }
  }, [headerType, dispatch, theme.fileDay, user]);

  useEffect(() => {
    if (taskInfo) {
      setPersonObj((prevPersonObj) => {
        if (prevPersonObj) {
          if (
            prevPersonObj[
            moment(taskInfo.taskEndDate).endOf("day").valueOf()
            ] &&
            prevPersonObj[moment(taskInfo.taskEndDate).endOf("day").valueOf()][
            taskInfo.executorKey
            ]
          ) {
            prevPersonObj[moment(taskInfo.taskEndDate).endOf("day").valueOf()][
              taskInfo.executorKey
            ].executorArray = prevPersonObj[
              moment(taskInfo.taskEndDate).endOf("day").valueOf()
            ][taskInfo.executorKey].executorArray.map((item: any) => {
              if (item._key === taskInfo._key) {
                item = _.cloneDeep(taskInfo);
              }
              return item;
            });
          }
          if (
            prevPersonObj[moment(taskInfo.createTime).endOf("day").valueOf()] &&
            prevPersonObj[moment(taskInfo.createTime).endOf("day").valueOf()][
            taskInfo.creatorKey
            ]
          ) {
            prevPersonObj[moment(taskInfo.createTime).endOf("day").valueOf()][
              taskInfo.creatorKey
            ].creatorArray = prevPersonObj[
              moment(taskInfo.createTime).endOf("day").valueOf()
            ][taskInfo.creatorKey].creatorArray.map((item: any) => {
              if (item._key === taskInfo._key) {
                item = _.cloneDeep(taskInfo);
              }
              return item;
            });
          }
        }
        return prevPersonObj;
      });
    }
  }, [taskInfo]);

  const chooseDiary = async (item: string) => {
    setDiaryIndex(item);
    getDiaryList(
      moment(parseInt(item)).startOf("day").valueOf(),
      moment(parseInt(item)).endOf("day").valueOf()
    );
    setPositive("");
    setNegative("");
    setNote("");
    setCommentPage(1);
    setCommentList([]);
    setComment("");
    if (headerIndex !== 3) {
      getDiaryNote(moment(parseInt(item)).startOf("day").valueOf());
    }
  };
  const choosePerson = (key: string) => {
    setDiaryKey(key);
    getData(taskArray, key);
  };
  const getData = async (taskArray: any, personKey: string) => {
    let newPersonObj: any = {};
    let targetPersonObj: any = {};
    let newPersonArray: any = [];
    let newCreateObj: any = {};
    let newExecObj: any = {};

    taskArray.forEach((taskItem: any, taskIndex: number) => {
      if (
        taskItem.taskEndDate &&
        taskItem.taskEndDate !== 99999999999999 &&
        (taskItem.type === 2 || taskItem.type === 6) &&
        taskItem.finishPercent !== 10
      ) {
        if (!newExecObj[moment(taskItem.taskEndDate).endOf("day").valueOf()]) {
          newExecObj[moment(taskItem.taskEndDate).endOf("day").valueOf()] = [];
        }
        newExecObj[moment(taskItem.taskEndDate).endOf("day").valueOf()].push(
          taskItem
        );
      }
      if (
        taskItem.taskEndDate &&
        taskItem.createTime &&
        (taskItem.type === 2 || taskItem.type === 6) &&
        taskItem.finishPercent !== 10
      ) {
        if (!newCreateObj[moment(taskItem.createTime).endOf("day").valueOf()]) {
          newCreateObj[moment(taskItem.createTime).endOf("day").valueOf()] = [];
        }
        newCreateObj[moment(taskItem.createTime).endOf("day").valueOf()].push(
          taskItem
        );
      }
    });
    for (let key in newExecObj) {
      newExecObj[key].forEach((item: any, index: number) => {
        let state = personKey === "全部" || item.executorKey === personKey;
        if (state) {
          if (!newPersonObj[key]) {
            newPersonObj[key] = {
              executorNum: 0,
              creatorNum: 0,
              allexecutorNum: 0,
              allcreatorNum: 0,
            };
          }
          if (!newPersonObj[key][item.executorKey]) {
            newPersonObj[key][item.executorKey] = {
              executorArray: [],
              creatorArray: [],
            };
            if (personKey === "全部") {
              let personIndex = _.findIndex(newPersonArray, {
                key: item.executorKey,
              });
              if (personIndex === -1) {
                newPersonArray.push({
                  key: item.executorKey,
                  avatar: item.executorAvatar,
                  name: item.executorName,
                });
              }
            }
          }
          newPersonObj[key][item.executorKey].executorArray.push(item);
          if (item.finishPercent > 0) {
            newPersonObj[key].executorNum = newPersonObj[key].executorNum + 1;
          }
          newPersonObj[key].allexecutorNum =
            newPersonObj[key].allexecutorNum + 1;
        }
      });
    }
    for (let key in newCreateObj) {
      newCreateObj[key].forEach((item: any, index: number) => {
        let state = personKey === "全部" || item.creatorKey === personKey;
        if (state) {
          if (!newPersonObj[key]) {
            newPersonObj[key] = {
              executorNum: 0,
              creatorNum: 0,
              allexecutorNum: 0,
              allcreatorNum: 0,
            };
          }
          if (!newPersonObj[key][item.creatorKey]) {
            newPersonObj[key][item.creatorKey] = {
              executorArray: [],
              creatorArray: [],
            };
            if (personKey === "全部") {
              let personIndex = _.findIndex(newPersonArray, {
                key: item.creatorKey,
              });
              if (personIndex === -1) {
                newPersonArray.push({
                  key: item.creatorKey,
                  avatar: item.creatorAvatar,
                  name: item.creatorName,
                });
              }
            }
          }
          newPersonObj[key][item.creatorKey].creatorArray.push(item);
          if (item.finishPercent > 0) {
            newPersonObj[key].creatorNum = newPersonObj[key].creatorNum + 1;
          }
          newPersonObj[key].allcreatorNum = newPersonObj[key].allcreatorNum + 1;
        }
      });
    }
    Object.keys(newPersonObj)
      .sort()
      .reverse()
      .forEach((item, index) => {
        if (index === 0) {
          setDiaryIndex(item);
        }
        if (
          item <= moment().endOf("day").valueOf() + "" &&
          item > moment().startOf("day").valueOf() + ""
        ) {
          setDiaryIndex(item);
        }
        targetPersonObj[item] = _.cloneDeep(newPersonObj[item]);
      });

    newPersonArray.unshift({ key: "全部", avatar: "", name: "全部" });
    setPersonObj(targetPersonObj);
    if (personKey === "全部") {
      setPersonArray(newPersonArray);
    }
  };
  const getDiaryNote = async (startTime: number) => {
    if (diaryKey) {
      let noteRes: any = await api.auth.getNote(
        headerIndex === 1 || headerType ? user._key : targetUserInfo._key,
        startTime
      );
      if (unDistory.current) {
        if (noteRes.msg === "OK") {
          setPositive(noteRes.result.positive);
          setNegative(noteRes.result.negative);
          setNote(noteRes.result.note);
        } else {
          if (noteRes.msg === "无该成就/风险/随记") {
            await api.auth.setNote({
              startTime: moment().startOf("day").valueOf(),
              type: 2,
              positive: "",
              negative: "",
              note: "",
              positiveClose: "",
              negativeClose: "",
              noteClose: "",
            });
          } else {
            dispatch(setMessage(true, noteRes.msg, "error"));
          }
        }
      }
    }
  };
  const getDiaryList = async (startTime: number, endTime: number) => {
    let res: any = await api.auth.getDiaryList(
      headerIndex === 1 || headerType ? user._key : targetUserInfo._key,
      startTime,
      endTime
    );
    if (unDistory.current) {
      if (res.msg === "OK") {
        if (res.result.length > 0) {
          if (res.result[0]._key) {
            setContentKey(res.result[0]._key);
            getCommentList(1, res.result[0]._key);
          }
        }
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  };
  const getCommentList = async (page: number, contentKey: number | string) => {
    let newCommentList = _.cloneDeep(commentList);
    setCommentPage(page);
    if (page === 1) {
      newCommentList = [];
    }
    let res: any = await api.auth.getClockInCommentList(
      contentKey,
      page,
      commentLimit
    );
    if (unDistory.current) {
      if (res.msg === "OK") {
        newCommentList.push(...res.result);
        setCommentList(newCommentList);
        setCommentTotal(res.totalNumber);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  };
  const scrollCommentLoading = (e: any) => {
    let newCommentPage = commentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      commentList.length < commentTotal
    ) {
      newCommentPage = newCommentPage + 1;
      getCommentList(newCommentPage, contentKey);
    }
  };
  const getAllReport = (personItem: any, personIndex: number) => {
    let dom: any = [];
    for (let personKey in personItem) {
      if (
        personKey !== "executorNum" &&
        personKey !== "creatorNum" &&
        personKey !== "allcreatorNum" &&
        personKey !== "allexecutorNum"
      ) {
        let executorNum = 0;
        let avatar =
          personItem[personKey].executorArray.length > 0
            ? personItem[personKey].executorArray[0].executorAvatar
              ? personItem[personKey].executorArray[0].executorAvatar +
              "?imageMogr2/auto-orient/thumbnail/80x"
              : defaultPersonPng
            : personItem[personKey].creatorArray.length > 0
              ? personItem[personKey].creatorArray[0].creatorAvatar +
              "?imageMogr2/auto-orient/thumbnail/80x"
              : defaultPersonPng;
        let name =
          personItem[personKey].executorArray.length > 0
            ? personItem[personKey].executorArray[0].executorName
              ? personItem[personKey].executorArray[0].executorName
              : ""
            : personItem[personKey].creatorArray.length > 0
              ? personItem[personKey].creatorArray[0].creatorName
              : "";
        personItem[personKey].executorArray.forEach((item: any) => {
          if (item.finishPercent > 0) {
            executorNum++;
          }
        });
        dom.push(
          <React.Fragment key={"day" + personKey}>
            <div className="diaryall-subtitle">
              <div className="diaryall-subtitle-img">
                <img src={avatar} alt="" />
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>{name}</span>{" "}
                <span>
                  ( 新建完成 {personItem[personKey].creatorArray.length} 条
                  计划完成 {executorNum} 条 )
                </span>
              </div>
            </div>
            <div className="diary-container-title">1. 计划任务</div>
            {personItem[personKey].executorArray.map(
              (taskItem: any, taskIndex: number) => {
                return (
                  <div
                    key={"date" + taskIndex}
                    className="diary-container-item"
                  // onClick={() => {
                  //   setDiaryIndex(diaryIndex);
                  // }}
                  >
                    <Task taskItem={taskItem} reportState={true} />
                  </div>
                );
              }
            )}
            <div className="diary-container-title">2. 新建任务</div>
            {personItem[personKey].creatorArray.map(
              (taskItem: any, taskIndex: number) => {
                return (
                  <div
                    key={"date" + taskIndex}
                    className="diary-container-item"
                  // onClick={() => {
                  //   setDiaryIndex(diaryIndex);
                  // }}
                  >
                    <Task taskItem={taskItem} reportState={true} />
                  </div>
                );
              }
            )}
          </React.Fragment>
        );
      }
    }
    return dom;
  };
  const saveNote = async () => {
    let noteRes: any = await api.auth.setNote({
      startTime: moment(parseInt(diaryIndex)).startOf("day").valueOf(),
      type: 2,
      positive: positive,
      negative: negative,
      note: note,
    });
    if (noteRes.msg === "OK") {
      dispatch(setMessage(true, "随记保存成功", "success"));
    } else {
      dispatch(setMessage(true, noteRes.msg, "error"));
    }
  };

  const addComment = async () => {
    let newCommentList = _.cloneDeep(commentList);
    let res: any = await api.auth.addClockInComment(contentKey, comment);
    if (res.msg === "OK") {
      dispatch(setMessage(true, "评论成功", "success"));
      setComment("");
      newCommentList.unshift(res.result);
      setCommentList(newCommentList);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const deleteComment = async (item: any, index: number) => {
    let newCommentList = _.cloneDeep(commentList);
    let res: any = await api.auth.deleteClockInComment(item._key);
    if (res.msg === "OK") {
      dispatch(setMessage(true, "删除成功", "success"));
      newCommentList.splice(index, 1);
      setCommentList(newCommentList);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const formatTime = (time: number) => {
    return [
      moment(time).format("dd"),
      moment(time).year() === moment().year()
        ? moment(time).format("MM.DD")
        : moment(time).format("YY.MM.DD"),
    ];
  };
  const addTask = async () => {
    let newPersonObj = _.cloneDeep(personObj);
    let addTaskRes: any = await api.task.addTask({
      groupKey: mainGroupKey,
      groupRole: 1,
      executorKey: user._key,
      taskEndDate: parseInt(diaryIndex),
    });
    if (addTaskRes.msg === "OK") {
      dispatch(setMessage(true, "新增任务成功", "success"));
      dispatch(changeMusic(5));
      newPersonObj[diaryIndex][diaryKey].executorArray.unshift(
        addTaskRes.result
      );
      newPersonObj[diaryIndex][diaryKey].creatorArray.unshift(
        addTaskRes.result
      );
      setPersonObj(newPersonObj);
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  return (
    <div className="diary">
      {/* {loading ? <Loading /> : null} */}
      {personObj && personObj[diaryIndex] ? (
        <div className="diary-bg">
          <div className="diary-menu">
            <div className="diary-menu-title">
              <span>日期</span>
              <span>星期</span>
              <span>完成/新建</span>
              <span>完成/计划</span>
            </div>
            <div className="diary-menu-container">
              {personObj
                ? Object.keys(_.cloneDeep(personObj)).map(
                  (item: any, index: number) => {
                    return (
                      <React.Fragment key={"date" + index}>
                        {diaryKey !== "全部" ? (
                          <div
                            className="diary-menu-item"
                            onClick={() => {
                              chooseDiary(item);
                            }}
                            style={{
                              backgroundColor:
                                diaryIndex === item
                                  ? "rgb(229, 231, 234)"
                                  : "",
                              fontWeight:
                                moment(parseInt(item))
                                  .startOf("day")
                                  .valueOf() ===
                                  moment().startOf("day").valueOf()
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            <span>{formatTime(parseInt(item))[1]}</span>
                            <span> {formatTime(parseInt(item))[0]}</span>
                            <span>
                              {personObj[item].allcreatorNum === 0
                                ? ""
                                : personObj[item].creatorNum +
                                " / " +
                                personObj[item].allcreatorNum}
                            </span>
                            <span>
                              {personObj[item].allexecutorNum === 0
                                ? ""
                                : personObj[item].executorNum +
                                " / " +
                                personObj[item].allexecutorNum}
                            </span>
                          </div>
                        ) : (
                          <a
                            href={"#diaryall" + index}
                            className="diary-menu-item"
                            style={{
                              fontWeight:
                                moment(parseInt(item))
                                  .startOf("day")
                                  .valueOf() ===
                                  moment().startOf("day").valueOf()
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            <span>{formatTime(parseInt(item))[1]}</span>
                            <span>{formatTime(parseInt(item))[0]}</span>
                            <span>
                              {personObj[item].allcreatorNum === 0
                                ? ""
                                : personObj[item].creatorNum +
                                " / " +
                                personObj[item].allcreatorNum}
                            </span>
                            <span>
                              {personObj[item].allexecutorNum === 0
                                ? ""
                                : personObj[item].executorNum +
                                " / " +
                                personObj[item].allexecutorNum}
                            </span>
                          </a>
                        )}
                      </React.Fragment>
                    );
                  }
                )
                : null}
            </div>
          </div>
          {personObj ? (
            <div className="diary-container">
              {headerIndex !== 3 ? <h2>一、任务看板</h2> : null}
              {diaryKey !== "全部" ? (
                <React.Fragment>
                  <div className="diary-container-mainTitle">
                    <div>
                      <img
                        src={reportIcon}
                        style={{
                          marginRight: "5px",
                          height: "16px",
                          width: "19px",
                        }}
                        alt=""
                      />
                      <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                        {formatTime(parseInt(diaryIndex))[1]}
                      </span>
                      <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                        {" " + formatTime(parseInt(diaryIndex))[0] + " "}
                      </span>
                      <span>
                        ( 新建完成 {personObj[diaryIndex].creatorNum} 条
                        计划完成 {personObj[diaryIndex].executorNum} 条 )
                      </span>
                    </div>
                    <div>
                      {headerIndex === 1 || headerType ? (
                        <React.Fragment>
                          {parseInt(diaryIndex) <
                            moment().startOf("day").valueOf() ? (
                            <Button
                              type="primary"
                              onClick={() => {
                                saveNote();
                              }}
                              className="save-button"
                            >
                              保存
                            </Button>
                          ) : null}
                          <Button
                            type="primary"
                            onClick={() => {
                              addTask();
                            }}
                            className="save-button"
                          >
                            添加任务
                          </Button>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </div>
                  <div className="diary-container-title">1. 计划任务</div>
                  {personObj[diaryIndex][diaryKey].executorArray.map(
                    (taskItem: any, taskIndex: number) => {
                      return (
                        <div
                          key={"date" + taskIndex}
                          className="diary-container-item"
                        // onClick={() => {
                        //   setDiaryIndex(diaryIndex);
                        // }}
                        >
                          <Task taskItem={taskItem} reportState={true} />
                        </div>
                      );
                    }
                  )}
                  <div className="diary-container-title">2. 新建任务</div>
                  {personObj[diaryIndex][diaryKey].creatorArray.map(
                    (taskItem: any, taskIndex: number) => {
                      return (
                        <div
                          key={"date" + taskIndex}
                          className="diary-container-item"
                        // onClick={() => {
                        //   setDiaryIndex(diaryIndex);
                        // }}
                        >
                          <Task taskItem={taskItem} reportState={true} />
                        </div>
                      );
                    }
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {Object.values(_.cloneDeep(personObj)).map(
                    (personItem: any, personIndex: number) => {
                      return (
                        <div key={"dayCanlendar" + personIndex}>
                          <a
                            id={"diaryall" + personIndex}
                            className="diaryall-a"
                            key={"dayCanlendar" + personIndex}
                            href={"#diaryall" + personIndex}
                          >
                            {" "}
                          </a>
                          <div className="diary-container-mainTitle">
                            <div>
                              <img
                                src={reportIcon}
                                style={{
                                  marginRight: "5px",
                                  height: "16px",
                                  width: "19px",
                                }}
                                alt=""
                              />
                              <span
                                style={{
                                  marginRight: "10px",
                                  fontWeight: "bold",
                                }}
                              >
                                {
                                  formatTime(
                                    parseInt(
                                      Object.keys(_.cloneDeep(personObj))[
                                      personIndex
                                      ]
                                    )
                                  )[1]
                                }
                              </span>
                              <span
                                style={{
                                  marginRight: "10px",
                                  fontWeight: "bold",
                                }}
                              >
                                {" " +
                                  formatTime(
                                    parseInt(
                                      Object.keys(_.cloneDeep(personObj))[
                                      personIndex
                                      ]
                                    )
                                  )[0] +
                                  " "}
                              </span>
                              <span>
                                ( 新建完成 {personItem.creatorNum} 条 计划完成{" "}
                                {personItem.executorNum} 条 )
                              </span>
                            </div>
                          </div>
                          {getAllReport(personItem, personIndex)}
                        </div>
                      );
                    }
                  )}
                </React.Fragment>
              )}

              {(headerIndex !== 3 || headerType) &&
                parseInt(diaryIndex) < moment().startOf("day").valueOf() ? (
                <React.Fragment>
                  <h2>二、工作日志</h2>
                  <div className="diary-content-pn">
                    <div className="diary-content-tab">
                      <div>成绩</div>
                      <div>审视</div>
                    </div>
                    <div className="diary-content-info">
                      {headerIndex === 1 || headerType ? (
                        <textarea
                          value={positive}
                          placeholder="成绩,收获,价值创造"
                          className="diary-content-textarea"
                          onChange={(e) => {
                            setPositive(e.target.value);
                          }}
                        />
                      ) : (
                        <div className="diary-content-textarea">{positive}</div>
                      )}
                      {headerIndex === 1 || headerType ? (
                        <textarea
                          value={negative}
                          placeholder="困难，挑战，潜在问题"
                          className="diary-content-textarea"
                          onChange={(e) => {
                            setNegative(e.target.value);
                          }}
                        />
                      ) : (
                        <div className="diary-content-textarea">{negative}</div>
                      )}
                    </div>
                  </div>
                  <h2>三、随记</h2>
                  {headerIndex === 1 || headerType ? (
                    <textarea
                      value={note}
                      placeholder="随记"
                      className="diary-textarea"
                      onChange={(e) => {
                        setNote(e.target.value);
                      }}
                    />
                  ) : (
                    <div className="diary-textarea">{note}</div>
                  )}
                  {/* 可能不存在打卡key */}
                  {contentKey ? (
                    <React.Fragment>
                      <div className="diary-comment">
                        <div className="diary-comment-title">
                          <div className="diary-comment-icon">
                            <img src={commentPng} alt="" />
                            评论
                          </div>
                          {/* <div className="diary-comment-like">
                      {contentItem.isLike ? (
                        <img
                          src={likePng}
                          alt=""
                          onClick={() => {
                            likeDiary(-1);
                          }}
                        />
                      ) : (
                        <img
                          src={unlikePng}
                          alt=""
                          onClick={() => {
                            likeDiary(1);
                          }}
                        />
                      )}
                      点赞 {contentItem.likeNumber}
                    </div> */}
                        </div>
                        {commentList.length > 0 ? (
                          <div
                            className="diary-comment-info"
                            onScroll={scrollCommentLoading}
                          >
                            {commentList.map(
                              (commentItem: any, commentIndex: number) => {
                                return (
                                  <div
                                    className="diary-comment-item"
                                    key={commentIndex}
                                  >
                                    <div className="diary-comment-item-avatar">
                                      <img src={commentItem.avatar} alt="" />
                                    </div>
                                    <div className="diary-comment-item-info">
                                      <div className="diary-comment-item-nickName">
                                        {commentItem.nickName}
                                      </div>
                                      <div className="diary-comment-item-content">
                                        {commentItem.content}
                                      </div>
                                    </div>
                                    {commentItem.userKey === user._key ? (
                                      <div
                                        className="diary-comment-item-reply"
                                        onClick={() => {
                                          deleteComment(
                                            commentItem,
                                            commentIndex
                                          );
                                        }}
                                      >
                                        <div className="diary-comment-delete-icon">
                                          <img src={deletePng} alt="" />
                                        </div>
                                        <div className="diary-comment-reply-title">
                                          删除
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : null}
                      </div>

                      <div className="diary-comment-button">
                        <Input
                          placeholder="我要评论......"
                          style={{ width: "90%" }}
                          onChange={(e: any) => {
                            setComment(e.target.value);
                          }}
                          value={comment}
                          onKeyDown={(e: any) => {
                            if (e.keyCode === 13) {
                              addComment();
                            }
                          }}
                        />
                        <Button
                          style={{
                            marginRight: "10px",
                            backgroundColor: "#1890ff",
                            color: "#fff",
                          }}
                          onClick={() => {
                            addComment();
                          }}
                        >
                          发送
                        </Button>
                      </div>
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <React.Fragment>
        {headerIndex === 3 && !headerType ? (
          <div
            className="diary-member"
            style={
              moveState === "top"
                ? {
                  animation: "rightTop 500ms",
                  // animationFillMode: 'forwards',
                  height: "40px",
                }
                : moveState === "bottom"
                  ? {
                    animation: "rightBottom 500ms",
                    height: "100%",
                    // animationFillMode: 'forwards',
                  }
                  : { height: "100%" }
            }
          >
            <Tooltip title="选择项目成员">
              <img
                src={memberSvg}
                alt=""
                className="diary-logo"
                onClick={() => {
                  setMoveState(moveState === "top" ? "bottom" : "top");
                }}
              />
            </Tooltip>
            {personArray.length > 0
              ? personArray.map((item: any, index: number) => {
                return (
                  <React.Fragment key={"person" + index}>
                    {index === 0 ? (
                      <div
                        className="diary-avatar"
                        onClick={() => {
                          choosePerson(item.key);
                        }}
                        style={
                          item.key === diaryKey
                            ? {
                              backgroundColor: "#1890ff",
                              color: "#fff",
                            }
                            : {}
                        }
                      >
                        全部
                      </div>
                    ) : (
                      <div
                        className="diary-avatar"
                        onClick={() => {
                          choosePerson(item.key);
                        }}
                        style={
                          item.key === diaryKey
                            ? {
                              border: "2px solid #1890ff",
                            }
                            : {}
                        }
                      >
                        <Avatar
                          avatar={
                            item?.avatar
                          }
                          name={item?.nickName}
                          index={0}
                          type={'person'}

                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })
              : null}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
};
export default WorkingReport;
