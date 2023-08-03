import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import "./clockIn.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import moment from "moment";

import api from "../../services/api";
import {
  setMessage,
  setCommonHeaderIndex,
} from "../../redux/actions/commonActions";
import { setWorkHeaderIndex } from "../../redux/actions/memberActions";
import { changeMusic } from "../../redux/actions/authActions";

import Dialog from "../common/dialog";
import DropMenu from "../common/dropMenu";

import WorkingReport from "../../views/workingTable/workingReport";

import downArrowbPng from "../../assets/img/downArrowb.png";
import reportSvg from "../../assets/svg/report.svg";
import Avatar from "../common/avatar";
import { useAuth } from "../../context/auth";
const ClockIn = forwardRef((prop, ref) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);

  // const allTask = useTypedSelector((state) => state.auth.allTask);
  const [note, setNote] = useState("");
  const [positive, setPositive] = useState("");
  const [negative, setNegative] = useState("");
  const [nowTime, setNowTime] = useState(0);
  const [groupVisible, setGroupVisible] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [groupList, setGroupList] = useState<any>([]);
  const [clockInIndex, setClockInIndex] = useState(0);
  let unDistory = useRef<any>(true);
  const { clockState } = useAuth();

  const getClockIn = useCallback(async () => {
    let noteRes: any = await api.auth.getNote(
      user._key,
      moment().startOf("day").valueOf()
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
  }, [user, dispatch]);
  const getGroupList = useCallback(async () => {
    let newGroupList: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 4);
    if (unDistory.current) {
      if (groupRes.msg === "OK") {
        groupRes.result.forEach((groupItem: any, groupIndex: number) => {
          if (
            groupItem.groupName.indexOf("个人事务") === -1 &&
            groupItem._key !== mainGroupKey
          ) {
            newGroupList.push(groupItem);
          }
        });
        setGroupList(newGroupList);
      } else {
        dispatch(setMessage(true, groupRes.msg, "error"));
      }
    }
  }, [dispatch,mainGroupKey]);
  useEffect(() => {
    if (user && user._key) {
      getClockIn();
      getGroupList();
    }
  }, [user, getClockIn, getGroupList]);
  useEffect(() => {
    setNowTime(moment().hour() < 12 ? 0 : 1);
  }, []);
  useImperativeHandle(ref, () => ({
    saveClockIn: () => {
      saveNote();
    },
  }));

  const saveNote = async () => {
    let noteRes: any = await api.auth.setNote({
      startTime: moment().startOf("day").valueOf(),
      type: 2,
      positive: positive,
      negative: negative,
      note: note,
    });
    if (noteRes.msg === "OK") {
      // dispatch(setMessage(true, '随记保存成功', 'success'));
    } else {
      dispatch(setMessage(true, noteRes.msg, "error"));
    }
  };

  const clockIn = async () => {
    const startTime = moment().startOf("day").valueOf();
    const timeStr = moment().format("YYYY/MM/DD HH:mm:ss");
    saveNote();
    let obj: any = {
      startTime: startTime,
      type: nowTime ? 2 : 1,
      groupKey: groupList[clockInIndex]._key,
      clockInDateStr: timeStr,
      isAuto: 2,
    };
    if (nowTime) {
      obj.positive = positive;
      obj.negative = negative;
      obj.note = note;
    }
    let res: any = await api.auth.clockIn(obj);
    if (res.msg === "OK") {
      dispatch(setMessage(true, "打卡成功", "success"));
      localStorage.setItem("clockState", "true");
      // if (nowTime) {
      //   // https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=4&tex=试试这个。
      //   let url =
      //     "https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=4&tex=打卡成功,你已完成" +
      //     (allTask[0] - allTask[1]) +
      //     "条任务";
      //   let n = new Audio(url);
      //   n.src = url;
      //   n.play();
      // }
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  return (
    <React.Fragment>
      <div className="clockIn">
        {groupList.length > 0 ? (
          <div className="clockIn-button">
            <Button
              type="primary"
              onClick={() => {
                clockIn();
                if (moment().hour() > 15) {
                  dispatch(changeMusic(13));
                } else {
                  dispatch(changeMusic(12));
                }
              }}
              style={{ color: "#fff" }}
              // className={classes.clockInButton}
            >
              {moment().hour() > 15
                ? "下班打卡"
                : moment().hour() < 9 && clockState
                ? "上班打卡"
                : "晒一晒"}
            </Button>

            <div
              onClick={() => {
                // setShowReport(true);
                dispatch(setCommonHeaderIndex(1));
                dispatch(setWorkHeaderIndex(5));
              }}
              className="clockIn-report"
            >
              <img src={reportSvg} alt="" style={{ marginRight: "5px" }} />
              <div>日志</div>
            </div>
          </div>
        ) : null}
        {groupList.length > 0 ? (
          <div
            className="clockIn-title"
            onClick={() => {
              setGroupVisible(true);
            }}
          >
            晒一晒:
            <div className="clockIn-title-logo">
              <Avatar
                avatar={groupList[clockInIndex]?.groupLogo}
                name={groupList[clockInIndex]?.groupName}
                type={"group"}
                index={0}
              />
            </div>
            <div className="toLong" style={{ width: "123px" }}>
              {groupList[clockInIndex].groupName}
            </div>
            <img src={downArrowbPng} alt="" className="clockIn-logo" />
            <DropMenu
              visible={groupVisible}
              dropStyle={{
                width: "200px",
                height: "500px",
                top: "40px",
                left: "55px",
                color: "#333",
                overflow: "auto",
              }}
              onClose={() => {
                setGroupVisible(false);
              }}
            >
              <React.Fragment>
                {groupList.map((groupItem: any, groupIndex: number) => {
                  return (
                    <div
                      key={"clockInGroup" + groupIndex}
                      onClick={() => {
                        setClockInIndex(groupIndex);
                      }}
                      className="clockInGroup-item"
                    >
                      <div className="clockInGroup-item-logo">
                        <Avatar
                          avatar={groupItem?.groupLogo}
                          name={groupItem?.groupName}
                          type={"group"}
                          index={groupIndex}
                        />
                      </div>
                      {/* <Tooltip title={groupItem.groupName}> */}
                      <div className="clockInGroup-item-name">
                        {groupItem.groupName}
                      </div>
                      {/* </Tooltip> */}
                    </div>
                  );
                })}
              </React.Fragment>
            </DropMenu>
          </div>
        ) : null}
        <div className="clockIn-info-first">
          <div className="clockIn-info-title">随记</div>
          <textarea
            value={note}
            placeholder="随记"
            className="clockIn-textarea"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
        <div className="clockIn-info-second">
          <div className="clockIn-info-title">成就</div>
          <textarea
            value={positive}
            placeholder="成绩,收获,价值创造"
            className="clockIn-textarea"
            onChange={(e) => {
              setPositive(e.target.value);
            }}
          />
        </div>
        <div className="clockIn-info-third">
          <div className="clockIn-info-title">审视</div>
          <textarea
            value={negative}
            placeholder="困难，挑战，潜在问题"
            className="clockIn-textarea"
            onChange={(e) => {
              setNegative(e.target.value);
            }}
          />
        </div>
      </div>
      <Dialog
        visible={showReport}
        onClose={() => {
          setShowReport(false);
        }}
        footer={false}
        title={"日志"}
        dialogStyle={{
          position: "fixed",
          width: "90%",
          height: "90%",
          overflow: "auto",
        }}
      >
        <WorkingReport headerType={true} />
      </Dialog>
    </React.Fragment>
  );
});
export default ClockIn;
