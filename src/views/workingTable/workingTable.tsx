import React, { useState, useEffect, useRef, useMemo } from "react";
import "./workingTable.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { setHeaderIndex } from "../../redux/actions/memberActions";
import {
  getWorkingTableTask,
  setFilterObject,
} from "../../redux/actions/taskActions";
import { changeStartId } from "../../redux/actions/groupActions";
import { setMessage } from "../../redux/actions/commonActions";

import WorkingTableHeader from "./workingTableHeader";
import WorkingTableLabel from "./workingTableLabel";
import WorkingTableGroup from "./workingTableGroup";
import WorkingReport from "./workingReport";
import Loading from "../../components/common/loading";
import Vitality from "../../components/vitality/vitality";
import Calendar from "../../views/calendar/calendar";
import GroupTableTree from "../groupTable/groupTableTree";

import taskAddPng from "../../assets/img/taskAdd.png";
interface WorkingTableProps { }

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const clickType = useTypedSelector((state) => state.auth.clickType);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [addLabelInputState, setAddLabelInputState] = useState<any>(null);
  const addLabelRef: React.RefObject<any> = useRef();
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (userKey) {
      if (headerIndex === 1) {
        setLoading(true);
        dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10]));
      } else if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
        setLoading(true);
        dispatch(
          getWorkingTableTask(
            userKey === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      }
    }
  }, [userKey, targetUserInfo, headerIndex, dispatch]);

  useMemo(() => {
    if (groupInfo && groupInfo.taskTreeRootCardKey) {
      dispatch(changeStartId(groupInfo.taskTreeRootCardKey));
    }
  }, [groupInfo, dispatch]);

  useEffect(() => {
    dispatch(setFilterObject(theme.filterObject));
  }, [headerIndex, dispatch, theme?.filterObject, clickType]);

  useEffect(() => {
    dispatch(setHeaderIndex(headerIndex === 2 && clickType !== "self" ? 3 : 0));
  }, [headerIndex, dispatch, clickType]);

  useMemo(() => {
    if (workingTaskArray) {
      setLoading(false);
    }
  }, [workingTaskArray]);

  const handleInputConfirm = async () => {
    if (addLabelInputState === "out") {
      setAddLabelInputState("in");
      if (inputValue !== "") {
        let addLabelRes: any = await api.task.addTaskLabel(
          mainGroupKey,
          inputValue
        );
        if (addLabelRes.msg === "OK") {
          dispatch(setMessage(true, "添加私有频道成功", "success"));
          setInputValue("");
          if (headerIndex === 1 || clickType === "self") {
            setLoading(true);
            dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
          } else if (
            targetUserInfo &&
            targetUserInfo._key &&
            headerIndex === 2
          ) {
            setLoading(true);
            dispatch(
              getWorkingTableTask(
                user._key === targetUserInfo._key ? 4 : 2,
                targetUserInfo._key,
                1,
                [0, 1, 2, 10]
              )
            );
          }
        } else {
          dispatch(setMessage(true, addLabelRes.msg, "error"));
        }
      }
    }
  };

  return (
    <div className="workingTable">
      {loading ? <Loading /> : null}
      <WorkingTableHeader />
      <div
        className="workingTableContent"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {memberHeaderIndex === 0 ? <WorkingTableLabel /> : null}
        {memberHeaderIndex === 1 ? <WorkingTableGroup /> : null}
        {memberHeaderIndex === 2 ? (
          <GroupTableTree groupKey={mainGroupKey} />
        ) : null}
        {memberHeaderIndex === 3 ? <WorkingReport /> : null}
        {memberHeaderIndex === 4 ? (
          <Vitality
            vitalityType={2}
            vitalityKey={headerIndex === 1 ? userKey : targetUserKey}
          />
        ) : null}
        {memberHeaderIndex === 5 ? (
          <Calendar
            targetGroupKey={
              headerIndex === 1
                ? mainGroupKey
                : headerIndex === 2
                  ? targetUserInfo?._key
                  : null
            }
          />
        ) : null}

      </div>

      {(headerIndex === 1 ||
        (headerIndex === 2 &&
          targetUserKey &&
          userKey &&
          userKey === targetUserKey)) &&
        (memberHeaderIndex === 0 ||
          memberHeaderIndex === 5 ||
          memberHeaderIndex === 1 ||
          memberHeaderIndex === 3) ? (
          <React.Fragment>
            <input
              className="workingTable-addLabel-input"
              onChange={handleInputChange}
              onBlur={() => {
                handleInputConfirm();
              }}
              value={inputValue}
              ref={addLabelRef}
              placeholder="输入标签名"
              style={
                addLabelInputState === "in"
                  ? {
                    animation: "addLabelInputIn 500ms",
                    width: "0px",
                    padding: "0px",
                  }
                  : addLabelInputState === "out"
                    ? {
                      animation: "addLabelInputOut 500ms",
                      width: "250px",
                      padding: "0px 8px",
                    }
                    : { width: "0px", opacity: 0, padding: "0px" }
              }
            />
            <div
              className="workingTable-addLabel"
              onClick={() => {
                addLabelRef.current.focus();
                setAddLabelInputState("out");
              }}
            >
              <img
                src={taskAddPng}
                alt=""
                style={{ height: "35px", color: "35px" }}
              />
            </div>
          </React.Fragment>
        ) : null}
    </div>
  );
};
export default WorkingTable;
