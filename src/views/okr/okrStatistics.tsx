import React, { useState, useEffect } from "react";
import "./okrStatistics.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { setMessage } from "../../redux/actions/commonActions";
import { useMount } from "../../hook/common";
import Avatar from "../../components/common/avatar";
import { Progress, Table } from "antd";
interface OkrStatisticsProps {
  memberList: any;
  periodList: any;
  periodIndex: number;
  periodKey:string
}

const Model: React.FC<OkrStatisticsProps> = (props) => {
  const { memberList, periodList, periodIndex,periodKey} = props;
  const dispatch = useDispatch();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [memberIndex, setMemberIndex] = useState<any>(0);
  const [okrStatisticsList, setOkrStatisticsList] = useState<any>(0);
  const columns: any = [
    {
      title: "O目标",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "KR",
      width: "80px",
      dataIndex: "krCount",
      key: "krCount",
      align: "center",
    },
    {
      title: "KR完成度",
      width: "180px",
      dataIndex: "progress",
      key: "progress",
      align: "center",
      render: (progress) => <Progress percent={progress} showInfo={false} />,
    },
    {
      title: "子任务",
      width: "80px",
      dataIndex: "taskNumber",
      key: "taskNumber",
      align: "center",
    },
    {
      title: "子任务完成度",
      width: "180px",
      dataIndex: "taskProgress",
      key: "taskProgress",
      align: "center",
      render: (progress) => <Progress percent={progress} showInfo={false} />,
    },
  ];
  useMount(() => {
    getOkrStatistics();
  });
  useEffect(() => {
    getOkrStatistics();
    //eslint-disable-next-line
  }, [memberIndex]);
  const getOkrStatistics = async () => {
    let okrStatisticsRes: any = await api.okr.getOKRUserStatistics(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      periodKey,
      memberList[memberIndex].userKey
    );
    if (okrStatisticsRes.msg === "OK") {
      let newOkrStatisticsList = okrStatisticsRes.result.map((item) => {
        return {
          title: item.title,
          krCount: item.krCount,
          progress: item.progress,
          taskNumber: item.taskNumber,
          taskProgress: item.taskProgress,
        };
      });
      setOkrStatisticsList(newOkrStatisticsList);
    } else {
      dispatch(setMessage(true, okrStatisticsRes.msg, "error"));
    }
  };
  return (
    <div className="okrStatistics dp-space-center">
      <div className="okrStatistics-left">
        {memberList
          ? memberList.map((memberItem: any, index: number) => {
              return (
                <div
                  className="okr-dropmenu-name"
                  onClick={() => {
                    setMemberIndex(index);
                  }}
                  key={"member" + index}
                  style={
                    memberIndex === index ? { backgroundColor: "#f0f0f0" } : {}
                  }
                >
                  <div className="calendar-logo">
                    <Avatar
                      name={memberItem.nickName}
                      avatar={memberItem.avatar}
                      type={"person"}
                      index={memberIndex}
                      size={27}
                    />
                  </div>
                  <div
                    className="calendar-name-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {memberItem.nickName}
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="okrStatistics-right">
        <Table columns={columns} dataSource={okrStatisticsList} />
      </div>
    </div>
  );
};
Model.defaultProps = {};
export default Model;
