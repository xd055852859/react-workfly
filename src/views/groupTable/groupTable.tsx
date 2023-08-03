import React, { useState, useEffect } from "react";
import "./groupTable.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";

import { getGroupTask } from "../../redux/actions/taskActions";
import { getGroupMember } from "../../redux/actions/memberActions";
import { getGroupInfo } from "../../redux/actions/groupActions";
import {
  setCommonHeaderIndex,
  setMessage,
} from "../../redux/actions/commonActions";

import GroupTableHeader from "./groupTableHeader";
import GroupTableGroup from "./groupTableGroup";
import GroupTableData from "./groupTableData";
import WorkingReport from "../workingTable/workingReport";
import Grid from "../../components/grid/grid";
import GroupTableTree from "./groupTableTree";
import Vitality from "../../components/vitality/vitality";
import Calendar from "../calendar/calendar";
import GroupTablePerson from "./groupTablePerson";
import GroupTableChat from "./groupTableChat";

interface GroupTableProps {}

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  const [finishPercent, setFinishPercent] = useState(0);
  const [finishNumber, setFinishNumber] = useState(0);
  const [chatTabState, setChatTabState] = useState(false);
  useEffect(() => {
    if (groupKey) {
      dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      dispatch(getGroupInfo(groupKey));
      dispatch(getGroupMember(groupKey, 4));
    }
  }, [groupKey, dispatch]);
  useEffect(() => {
    if (groupInfo && groupInfo.frozenStatus === 1) {
      dispatch(setCommonHeaderIndex(1));
      dispatch(setMessage(true, "企业账号冻结，请联系平台客服。", "warning"));
    }
  }, [groupInfo, dispatch]);
  return (
    <div className="groupTable">
      <GroupTableHeader
        finishPercent={finishPercent}
        finishNumber={finishNumber}
        setChatTabState={setChatTabState}
      />
      <div
        className="groupTableContent"
        // style={memberHeaderIndex !== 0 ? {  } : {}}
      >
        {memberHeaderIndex === 0 ? (
          <GroupTableGroup
            setFinishPercent={setFinishPercent}
            setFinishNumber={setFinishNumber}
          />
        ) : null}
        {memberHeaderIndex === 1 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 2 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 3 ? (
          <GroupTableTree groupKey={groupKey} />
        ) : null}
        {memberHeaderIndex === 4 ? <WorkingReport /> : null}
        {memberHeaderIndex === 6 ? <GroupTableData /> : null}
        {memberHeaderIndex === 5 ? (
          <Vitality vitalityType={headerIndex} vitalityKey={groupKey} />
        ) : null}

        {memberHeaderIndex === 7 ? (
          <Calendar targetGroupKey={groupKey} />
        ) : null}
        {memberHeaderIndex === 8 ? <GroupTablePerson /> : null}
        {memberHeaderIndex === 9 ? (
          <GroupTableChat chatTabState={chatTabState} />
        ) : null}
      </div>
    </div>
  );
};
export default GroupTable;
