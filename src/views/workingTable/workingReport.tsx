import React, { useState, useEffect, useRef } from "react";
import "./workingReport.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button, Tooltip, DatePicker } from "antd";
import _ from "lodash";
import api from "../../services/api";
import moment from "moment";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";
import { changeMusic } from "../../redux/actions/authActions";
import { changeDeleteState } from "../../redux/actions/taskActions";

import Task from "../../components/task/task";

import memberSvg from "../../assets/svg/member.svg";
import noReportSvg from "../../assets/svg/noReport.svg";
import deletePng from "../../assets/img/deleteDiary.png";
import commentPng from "../../assets/img/comment.png";
import reportIcon from "../../assets/svg/reportIcon.svg";
import Avatar from "../../components/common/avatar";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface WorkingReportProps {
  headerType?: boolean;
}

const WorkingReport: React.FC<WorkingReportProps> = (props) => {
  const { headerType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);

  const deleteState = useTypedSelector((state) => state.task.deleteState);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [reportDateList, setReportDateList] = useState<any>([]);
  const [reportObj, setReportObj] = useState<any>(null);
  const [reportIndex, setReportIndex] = useState<any>(
    moment().endOf("day").valueOf()
  );
  const [reportInfoIndex, setReportInfoIndex] = useState<any>(0);
  const [comment, setComment] = useState("");
  const [positive, setPositive] = useState("");
  const [negative, setNegative] = useState("");
  const [note, setNote] = useState("");
  const [commentList, setCommentList] = useState<any>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotal, setCommentTotal] = useState(0);
  const [contentKey, setContentKey] = useState(0);

  const [memberKey, setMemberKey] = useState<any>(null);
  const [memberArray, setMemberArray] = useState<any>([]);
  const [moveState, setMoveState] = useState<any>(null);
  const [startMonthDate, setStartMonthDate] = useState<any>(
    moment().subtract(35, "days").startOf("day").valueOf()
  );
  const [endMonthDate, setEndMonthDate] = useState<any>(
    moment().endOf("day").valueOf()
  );
  const commentLimit = 10;
  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getData = async (
    targetUKey: string,
    targetGKey: string,
    type: number,
    startDate: number,
    endDate: number,
    startType?: string
  ) => {
    let reportDateRes: any = null;
    switch (type) {
      case 1:
        reportDateRes = await api.auth.getReportList(
          targetUKey,
          startDate,
          endDate + 1
        );
        break;
      case 2:
        reportDateRes = await api.auth.getGroupReportList(
          targetGKey,
          startDate,
          endDate + 1
        );
        break;
      case 3:
        reportDateRes = await api.auth.getMemberReportList(
          targetUKey,
          targetGKey,
          startDate,
          endDate + 1
        );
        break;
    }
    if (reportDateRes.msg === "OK") {
      reportDateRes.result = reportDateRes.result.filter((item) => {
        return item.myCreateCardNumber || item.myPlanCardNumber;
      });
      console.log(reportDateRes.result);
      //@ts-ignore
      setReportDateList(_.orderBy(reportDateRes.result, ["st"], ["desc"]));
      if (!startType) {
        chooseReport(startDate, 0, targetUKey);
      }
    } else {
      dispatch(setMessage(true, reportDateRes.msg, "error"));
    }
  };
  useEffect(() => {
    if (
      (user?._key && headerIndex === 1) ||
      (targetUserInfo?._key && headerIndex === 2) ||
      (groupKey && headerIndex === 3) ||
      headerType
    ) {
      if (headerIndex === 1 || headerType) {
        getData(user._key, "", 1, startMonthDate, endMonthDate, "start");
      } else if (headerIndex === 2) {
        getData(
          targetUserInfo._key,
          "",
          1,
          startMonthDate,
          endMonthDate,
          "start"
        );
      } else if (headerIndex === 3) {
        getData("", groupKey, 2, startMonthDate, endMonthDate, "start");
      }
      chooseReport(moment().startOf("day").valueOf(), 0);
    }
    //eslint-disable-next-line
  }, [
    headerIndex,
    targetUserInfo,
    groupKey,
    startMonthDate,
    endMonthDate,
    headerType,
  ]);
  useEffect(() => {
    setStartMonthDate(moment().subtract(35, "days").startOf("day").valueOf());
    setEndMonthDate(moment().endOf("day").valueOf());
  }, [headerIndex]);
  useEffect(() => {
    if (deleteState) {
      changeDeleteState(false);
      chooseReport(reportIndex, reportInfoIndex);
    }
    //eslint-disable-next-line
  }, [deleteState]);

  const chooseReport = async (
    item: number,
    index: number,
    newMemberKey?: string
  ) => {
    setReportIndex(item);
    setReportInfoIndex(index);
    console.log(index);
    let key = newMemberKey ? newMemberKey : memberKey;
    if (key) {
      getReportData(key, groupKey, item, 3);
    } else {
      if (headerType) {
        getReportData(user._key, "", item, 1);
      } else {
        switch (headerIndex) {
          case 1:
            getReportData(user._key, "", item, 1);
            break;
          case 2:
            getReportData(targetUserInfo._key, "", item, 1);
            break;
          case 3:
            getReportData("", groupKey, item, 2);
            break;
        }
      }
    }
    if (headerIndex !== 3) {
      setPositive("");
      setNegative("");
      setNote("");
      setCommentPage(1);
      setCommentList([]);
      setComment("");
      getDiaryNote(item);
      // getDiaryList(item, moment(item).endOf("day").valueOf());
    }
  };
  const choosePerson = (key: string) => {
    setMemberKey(key);
    getData(key, groupKey, 3, startMonthDate, endMonthDate);
    console.log(key, groupKey, moment().startOf("day").valueOf(), 3);
    // getReportData(key, groupKey, moment().startOf("day").valueOf(), 3);
  };

  const getDiaryNote = async (startTime: number) => {
    let noteRes: any = await api.auth.getNote(
      headerIndex === 1 || headerType ? user._key : targetUserInfo._key,
      startTime
    );
    if (unDistory.current) {
      if (noteRes.msg === "OK") {
        setPositive(noteRes.result.positive);
        setNegative(noteRes.result.negative);
        setNote(noteRes.result.note);
        setContentKey(noteRes.result._key);
        getCommentList(1, noteRes.result._key);
      } else {
        dispatch(setMessage(true, noteRes.msg, "error"));
      }
    }
  };
  // const getDiaryList = async (startTime: number, endTime: number) => {
  //   let res: any = await api.auth.getDiaryList(
  //     headerIndex === 1 || headerType ? user._key : targetUserInfo._key,
  //     startTime,
  //     endTime
  //   );
  //   if (res.msg === "OK") {
  //     if (res.result.length > 0) {
  //       if (res.result[0]._key) {
  //         getCommentList(1, res.result[0]._key);
  //       }
  //     }
  //   } else {
  //     dispatch(setMessage(true, res.msg, "error"));
  //   }
  // };
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
  const getReportData = async (
    targetUKey: string,
    targetGKey: string,
    reportDate: number,
    type: number
  ) => {
    let reportInfoRes: any = null;
    switch (type) {
      case 1:
        reportInfoRes = await api.auth.getReportInfo(targetUKey, reportDate);
        break;
      case 2:
        reportInfoRes = await api.auth.getGroupReportInfo(
          targetGKey,
          reportDate
        );
        break;
      case 3:
        reportInfoRes = await api.auth.getMemberReportInfo(
          targetUKey,
          targetGKey,
          reportDate
        );
        break;
    }
    if (reportInfoRes.msg === "OK") {
      console.log(reportInfoRes.result);
      setReportObj(reportInfoRes.result);
      if (type === 2) {
        setMemberArray(reportInfoRes.result.userArray);
      }
    } else {
      dispatch(setMessage(true, reportInfoRes.msg, "error"));
    }
  };
  const saveNote = async () => {
    let noteRes: any = await api.auth.setNote({
      startTime: moment(parseInt(reportIndex)).startOf("day").valueOf(),
      type: 2,
      positive: positive,
      negative: negative,
      note: note,
    });
    if (noteRes.msg === "OK") {
      dispatch(setMessage(true, "保存成功", "success"));
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
        : moment(time).format("YYYY.MM.DD"),
    ];
  };
  const addTask = async () => {
    let addTaskRes: any = await api.task.addTask({
      groupKey: mainGroupKey,
      groupRole: 1,
      executorKey: user._key,
      taskEndDate: reportIndex,
    });
    if (addTaskRes.msg === "OK") {
      dispatch(setMessage(true, "新增任务成功", "success"));
      dispatch(changeMusic(5));
      getReportData(user._key, "", reportIndex, 1);
    } else {
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  //修改日程日期
  const changeDate = (dates) => {
    console.log(dates);
    setStartMonthDate(dates[0].startOf("day").valueOf());
    setEndMonthDate(dates[1].endOf("day").valueOf());
  };
  return (
    <div className="diary">
      {/* {loading ? <Loading /> : null} */}
      <div className="diary-bg">
        <div className="diary-menu">
          <div className="diary-menu-title">
            <span>日期</span>
            <span>星期</span>
            <span>完成/新建</span>
            <span>完成/计划</span>
          </div>
          <div className="diary-menu-container">
            {reportDateList.map((item: any, index: number) => {
              return (
                <React.Fragment key={"date" + index}>
                  <div
                    className="diary-menu-item"
                    onClick={() => {
                      chooseReport(item.st, index);
                    }}
                    style={{
                      backgroundColor:
                        reportIndex === item.st ? "rgb(229, 231, 234)" : "",
                      fontWeight:
                        moment(item.st).startOf("day").valueOf() ===
                        moment().startOf("day").valueOf()
                          ? "bold"
                          : "normal",
                    }}
                  >
                    <span>{formatTime(item.st)[1]}</span>
                    <span> {formatTime(item.st)[0]}</span>
                    <span>
                      {item.myCreateCardNumber === 0
                        ? ""
                        : item.myCreateFinishCardNumber +
                          " / " +
                          item.myCreateCardNumber}
                    </span>
                    <span>
                      {item.myPlanCardNumber === 0
                        ? ""
                        : item.myPlanFinishCardNumber +
                          " / " +
                          item.myPlanCardNumber}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="diary-container">
          <div className="diary-month">
            <RangePicker
              value={[moment(startMonthDate), moment(endMonthDate)]}
              onChange={(dates) => {
                changeDate(dates);
              }}
              allowClear={false}
            />
          </div>

          {reportObj ? (
            <div className="diary-container-box">
              {reportDateList[reportInfoIndex] ? (
                <React.Fragment>
                  {headerIndex !== 3 || headerType ? (
                    <h2>一、任务看板</h2>
                  ) : null}
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
                        {formatTime(reportDateList[reportInfoIndex].st)[1]}
                      </span>
                      <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                        {" " +
                          formatTime(reportDateList[reportInfoIndex].st)[0] +
                          " "}
                      </span>
                      {headerIndex !== 3 ? (
                        <span>
                          ( 新建完成{" "}
                          {
                            reportDateList[reportInfoIndex]
                              .myCreateFinishCardNumber
                          }{" "}
                          条 计划完成{" "}
                          {
                            reportDateList[reportInfoIndex]
                              .myPlanFinishCardNumber
                          }{" "}
                          条 )
                        </span>
                      ) : null}
                    </div>
                    <div>
                      {headerIndex === 1 ? (
                        <React.Fragment>
                          {parseInt(reportIndex) <
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
                </React.Fragment>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={noReportSvg} alt=""></img>
                </div>
              )}
              {reportObj.userArray.map((item, index) => {
                return (
                  <React.Fragment key={"report" + index}>
                    {reportObj.cardObject[item.userKey].myPlanCardList.length >
                      0 ||
                    reportObj.cardObject[item.userKey].myCreateCardList.length >
                      0 ? (
                      <React.Fragment>
                        {headerIndex === 3 ? (
                          <div className="diaryall-subtitle">
                            <div className="diaryall-subtitle-img">
                              <Avatar
                                avatar={item?.avatar}
                                name={item?.nickName}
                                index={index}
                                type={"person"}
                              />
                            </div>
                            <span style={{ fontWeight: "bold" }}>
                              {item.nickName}
                            </span>{" "}
                            {/* <span>
                  ( 新建完成 {personItem[personKey].creatorArray.length} 条
                  计划完成 {executorNum} 条 )
                </span> */}
                          </div>
                        ) : null}

                        <div className="diary-container-title">1. 计划任务</div>
                        {reportObj.cardObject[item.userKey].myPlanCardList.map(
                          (taskItem: any, taskIndex: number) => {
                            return (
                              <div
                                key={"date" + taskIndex}
                                className="diary-container-item"
                                // onClick={() => {
                                //   setDiaryIndex(reportIndex);
                                // }}
                              >
                                <Task taskItem={taskItem} reportState={true} />
                              </div>
                            );
                          }
                        )}
                        <div className="diary-container-title">2. 新建任务</div>
                        {reportObj.cardObject[
                          item.userKey
                        ].myCreateCardList.map(
                          (taskItem: any, taskIndex: number) => {
                            return (
                              <div
                                key={"date" + taskIndex}
                                className="diary-container-item"
                                style={
                                  headerIndex === 3 && moveState !== "top"
                                    ? { paddingRight: "35px" }
                                    : {}
                                }
                                // onClick={() => {
                                //   setDiaryIndex(reportIndex);
                                // }}
                              >
                                <Task taskItem={taskItem} reportState={true} />
                              </div>
                            );
                          }
                        )}
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                );
              })}

              {/* ) : (
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
            )} */}

              {(headerIndex !== 3 || headerType) &&
              parseInt(reportIndex) < moment().startOf("day").valueOf() ? (
                <React.Fragment>
                  <h2>二、工作日志</h2>
                  <div className="diary-content-pn">
                    <div className="diary-content-tab">
                      <div>成绩</div>
                      <div>审视</div>
                    </div>
                    <div className="diary-content-info">
                      {headerIndex === 1 || headerType ? (
                        <TextArea
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
                        <TextArea
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
                    <TextArea
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
      </div>
      <React.Fragment>
        {headerIndex === 3 && reportObj?.userArray && !headerType ? (
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
            <div
              className="diary-avatar"
              onClick={() => {
                getData("", groupKey, 2, startMonthDate, endMonthDate);
                chooseReport(moment().startOf("day").valueOf(), 0);
                setMemberKey(null);
              }}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
              }}
            >
              全部
            </div>
            {memberArray.length > 0
              ? memberArray.map((item: any, index: number) => {
                  return (
                    <React.Fragment key={"person" + index}>
                      <div
                        className="diary-avatar"
                        onClick={() => {
                          choosePerson(item.userKey);
                        }}
                        style={
                          item.key === memberKey
                            ? {
                                border: "2px solid #1890ff",
                              }
                            : {}
                        }
                      >
                        <Avatar
                          avatar={item?.avatar}
                          name={item?.nickName}
                          index={index}
                          type={"person"}
                        />
                      </div>
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
