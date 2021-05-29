import React, { useEffect } from "react";
import "./groupTable.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useMount } from "../../hook/common";

import { getGroupTask } from "../../redux/actions/taskActions";
import {
  getGroupMember,
  setHeaderIndex,
} from "../../redux/actions/memberActions";
import {getGroupInfo } from "../../redux/actions/groupActions";

import GroupTableHeader from "./groupTableHeader";
import GroupTableGroup from "./groupTableGroup";
import GroupTableData from "./groupTableData";
import WorkingReport from "../workingTable/workingReport";
import Grid from "../../components/grid/grid";
import GroupTableTree from "./groupTableTree";
import Vitality from "../../components/vitality/vitality";
import Calendar from "../../views/calendar/calendar";


interface GroupTableProps {}

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  useMount(() => {
    dispatch(setHeaderIndex(0));
  });

  useEffect(() => {
    if (groupKey) {
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
    }
  }, [groupKey, dispatch]);

  useEffect(() => {
    if (!groupInfo || groupKey !== groupInfo._key) {
      dispatch(getGroupInfo(groupKey));
      dispatch(getGroupMember(groupKey, 4));
    }
  }, [groupKey, groupInfo, dispatch]);


  return (
    <div className="groupTable">
      <GroupTableHeader />
      <div
        className="groupTableContent"
        // style={memberHeaderIndex !== 0 ? {  } : {}}
      >
        {memberHeaderIndex === 0 ? <GroupTableGroup /> : null}
        {memberHeaderIndex === 1 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 2 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 3 ? (
          <GroupTableTree groupKey={groupKey} />
        ) : null}
        {memberHeaderIndex === 4 ? <WorkingReport /> : null}
        {memberHeaderIndex === 5 ? <GroupTableData /> : null}
        {memberHeaderIndex === 6 ? (
          <Vitality vitalityType={headerIndex} vitalityKey={groupKey} />
        ) : null}

        {memberHeaderIndex === 7 ? (
          <Calendar targetGroupKey={groupKey} />
        ) : null}
      </div>
    </div>
  );
};
export default GroupTable;
