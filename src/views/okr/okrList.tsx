import React from "react";
import "./okrList.css";
import { Progress, Divider, Timeline } from "antd";
import Task from "../../components/task/task";
interface OkrListProps {
  okrList: any;
}
const OkrList: React.FC<OkrListProps> = (props) => {
  const { okrList } = props;
  const ologoType = [
    { title: "普通", color: "#009fe0", bgColor: "#edf5ff" },
    { title: "中等", color: "#1cb75f", bgColor: "#eafdf2" },
    { title: "重要", color: "#f5a623", bgColor: "#fff9ef" },
    { title: "严重", color: "#ff3d3c", bgColor: "#ffe7e7" },
  ];
  return (
    <div className="okrList-box">
      {okrList.map((item, index) => {
        return (
          <div key={"okr" + index} className="okrList-item">
            <div className="okrList-item-title">
              <div className="okrList-item-title-top">
                <div
                  className="okrTable-oLogo"
                  style={{
                    color: ologoType[item.priority - 1]?.color,
                    backgroundColor: ologoType[item.priority - 1]?.bgColor,
                  }}
                >
                  O
                </div>
                {item.title}
              </div>
              <div className="okrList-item-title-bottom">
                <Progress
                  percent={isNaN(item.progress) ? 0 : item.progress}
                  status="active"
                />
              </div>
            </div>
            <div style={{ margin: "20px 0px" }}></div>
            <div className="okrList-item-table">
              <div className="okrList-item-th">
                <div>
                  <span
                    className="okrTable-oLogo"
                    style={{
                      color: ologoType[item.priority - 1]?.color,
                      backgroundColor: ologoType[item.priority - 1]?.bgColor,
                    }}
                  >
                    KR
                  </span>
                </div>
                <div>进度</div>
                <div>信心</div>
                <div>权重</div>
              </div>
              {item.krs.map((targetItem, krIndex) => {
                return (
                  <div className="okrList-item-tr" key={"krItem" + krIndex}>
                    <div className="toLong">{targetItem.title}</div>
                    <div>
                      {targetItem?.progress ? targetItem.progress + "%" : "0%"}
                    </div>
                    <div>
                      {targetItem?.confidence ? targetItem.confidence : 1}
                    </div>
                    <div>
                      {targetItem?.weight
                        ? parseInt(
                            (+targetItem.weight / +item.weightNum) * 100 + ""
                          )
                        : "100"}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ margin: "20px 0px" }}></div>
            <div>
              <div className="orkList-title">本周工作</div>
              {item?.currWeekTask
                ? item.currWeekTask.map((taskItem, taskIndex) => {
                    return (
                      <Task
                        key={"taskItem" + taskIndex}
                        taskItem={taskItem}
                        type="okr"
                      />
                    );
                  })
                : null}
            </div>
            <div style={{ margin: "20px 0px" }}></div>
            <div>
              <div className="orkList-title">未来四周工作</div>
              {item?.nextFourWeekTask
                ? item.nextFourWeekTask.map((weekItem, weekIndex) => {
                    return (
                      <Task
                        key={"weekItem" + weekIndex}
                        taskItem={weekItem}
                        type="okr"
                      />
                    );
                  })
                : null}
            </div>
            <div style={{ margin: "20px 0px" }}></div>
            <div>
              <div className="orkList-title orkList-log">OKR进度更新</div>
              <Timeline>
                {item.oLog.map((logItem, logIndex) => {
                  return (
                    <Timeline.Item key={"logItem" + logIndex}>
                      {logItem.nickName} {logItem.content}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
              ,
            </div>
          </div>
        );
      })}
    </div>
  );
};
OkrList.defaultProps = {};
export default OkrList;
