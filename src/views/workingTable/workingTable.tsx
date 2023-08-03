import React, { useState, useEffect, useMemo } from "react";
import "./workingTable.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Modal, Input } from "antd";
import api from "../../services/api";
import {
  getWorkingTableTask,
  setFilterObject,
} from "../../redux/actions/taskActions";
import { setMessage } from "../../redux/actions/commonActions";
// import { setWorkHeaderIndex } from "../../redux/actions/memberActions";

import WorkingTableHeader from "./workingTableHeader";
import WorkingTableLabel from "./workingTableLabel";
import WorkingTableGroup from "./workingTableGroup";

import Loading from "../../components/common/loading";
import Vitality from "../../components/vitality/vitality";
import Calendar from "../calendar/calendar";
import GroupTableTree from "../groupTable/groupTableTree";
import Grid from "../../components/grid/grid";
import taskAddPng from "../../assets/img/taskAdd.png";
import WorkingReport from "./workingReport";
import WorkingTableSimple from "./workingTableSimple";
interface WorkingTableProps {}

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const workHeaderIndex = useTypedSelector(
    (state) => state.member.workHeaderIndex
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
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (userKey) {
      if (
        targetUserInfo &&
        targetUserInfo._key &&
        (headerIndex === 2 || clickType === "self")
      ) {
        setLoading(true);
        // dispatch(
        //   getWorkingTableTask(
        //     userKey === targetUserInfo._key ? 4 : 2,
        //     targetUserInfo._key,
        //     1,
        //     [0, 1, 2, 10],
        //     1
        //   )
        // );
        dispatch(
          getWorkingTableTask(
            userKey === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10],
            2
          )
        );
      } else if (headerIndex === 1 && clickType !== "self") {
        setLoading(true);
        // dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 1));
        dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 2));
      }
    }
  }, [userKey, targetUserInfo, clickType, headerIndex, dispatch]);

  // useEffect(() => {
  //   if (groupInfo && groupInfo.taskTreeRootCardKey) {
  //     dispatch(changeStartId(groupInfo.taskTreeRootCardKey));
  //   }
  // }, [groupInfo, dispatch]);

  useEffect(() => {
    dispatch(setFilterObject(theme.filterObject));
  }, [headerIndex, dispatch, theme?.filterObject, clickType]);

  // useEffect(() => {
  //   if (headerIndex === 1) {
  //     dispatch(setWorkHeaderIndex(0));
  //   } else {
  //     dispatch(setWorkHeaderIndex(1));
  //   }
  // }, [headerIndex, dispatch]);

  useMemo(() => {
    if (workingTaskArray) {
      setLoading(false);
    }
  }, [workingTaskArray]);

  const handleInputConfirm = async () => {
    if (inputValue !== "") {
      if (inputValue.indexOf("_") !== -1) {
        dispatch(setMessage(true, "请勿输入 _ 为特殊字符", "error"));
        return;
      }
      let addLabelRes: any = await api.task.addTaskLabel(
        mainGroupKey,
        inputValue,
        ""
      );
      if (addLabelRes.msg === "OK") {
        dispatch(setMessage(true, "添加私有频道成功", "success"));
        setInputValue("");
        setLabelVisible(false);
        if (headerIndex === 1 || clickType === "self") {
          setLoading(true);
          dispatch(
            getWorkingTableTask(
              clickType === "self" ? 4 : 1,
              user._key,
              1,
              [0, 1, 2, 10],
              2
            )
          );
        } else if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
          setLoading(true);
          dispatch(
            getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2, 10], 2)
          );
        }
      } else {
        dispatch(setMessage(true, addLabelRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "请输入频道名", "error"));
      return;
    }
  };

  return (
    <div className="workingTable">
      {loading ? <Loading /> : null}
      <WorkingTableHeader />
      <div
        className="workingTableContent"
        // onContextMenu={(e) => {
        //   e.preventDefault();
        // }}
      >
        {workHeaderIndex === 0 ? <WorkingTableLabel /> : null}
        {workHeaderIndex === 1 ? <WorkingTableSimple /> : null}
        {workHeaderIndex === 2 ? <WorkingTableGroup /> : null}
        {workHeaderIndex === 3 ? <Grid gridState={true} /> : null}
        {workHeaderIndex === 4 ? (
          <GroupTableTree groupKey={mainGroupKey} />
        ) : null}
        {workHeaderIndex === 5 ? <WorkingReport /> : null}
        {workHeaderIndex === 6 ? (
          <Vitality
            vitalityType={2}
            vitalityKey={headerIndex === 1 ? userKey : targetUserKey}
            showTargetDay={"today"}
          />
        ) : null}
        {workHeaderIndex === 7 ? (
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

      {(headerIndex === 1 &&
        (workHeaderIndex === 1 || workHeaderIndex === 2)) ||
      clickType === "self" ? (
        <React.Fragment>
          <div
            className="workingTable-addLabel"
            onClick={() => {
              setLabelVisible(true);
            }}
          >
            <img
              src={taskAddPng}
              alt=""
              style={{ height: "35px", color: "35px" }}
            />
          </div>
          <Modal
            visible={labelVisible}
            onCancel={() => {
              setLabelVisible(false);
            }}
            onOk={() => {
              handleInputConfirm();
            }}
            title={"添加频道"}
          >
            <Input
              placeholder="请添加频道"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Modal>
        </React.Fragment>
      ) : null}
    </div>
  );
};
export default WorkingTable;
