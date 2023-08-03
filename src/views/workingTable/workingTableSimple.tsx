import React, { useState, useEffect, useCallback } from "react";
import "./workingTableSimple.css";
import { useTypedSelector } from "../../redux/reducer/RootState";

import TaskSimple from "../../components/task/taskSimple";
import _ from "lodash";
import format from "../../components/common/format";

// import work1Svg from "../../assets/svg/work1.svg";
// import work2Svg from "../../assets/svg/work2.svg";
// import work3Svg from "../../assets/svg/work3.svg";
// import work4Svg from "../../assets/svg/work4.svg";
// import work5Svg from "../../assets/svg/work5.svg";
// import work6Svg from "../../assets/svg/work6.svg";
// import work7Svg from "../../assets/svg/work7.svg";
// import work8Svg from "../../assets/svg/work8.svg";

interface WorkingTableSimpleProps {}

const WorkingTableSimple: React.FC<WorkingTableSimpleProps> = (props) => {
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const filterObject = useTypedSelector((state) => state.task.filterObject);

  const [mainLabelArray, setMainLabelArray] = useState<any>([]);
  // const [workType, setWorkType] = useState<any>(1);

  const getData = useCallback(
    (taskArray: any) => {
      // let newTaskArray = taskArray.filter((taskItem,taskIndex)=>{

      // })
      setMainLabelArray(
        format.formatFilter(_.cloneDeep(_.flatten(taskArray)), filterObject)
      );
    },
    [filterObject]
  );
  // useEffect(() => {
  //   if (workType === 9) {
  //     setMainLabelArray((prevMainLabelArray) => {
  //       let newMainLabelArray: any = prevMainLabelArray.filter((item: any) => {
  //         return item.groupKey === mainGroupKey;
  //       });
  //       return [...newMainLabelArray];
  //     });
  //   }
  // }, [mainGroupKey, mainLabelArray, workType]);
  useEffect(() => {
    if (workingTaskArray) {
      getData(workingTaskArray);
    }
  }, [workingTaskArray, getData]);

  return (
    <div className="simple">
      {/* <div className="simple-menu">
        <DropMenu
          visible={addVisible}
          dropStyle={{
            width: "430px",
            // minHeight: "300px",
            height: "100%",
            top: "0px",
            left: "220px",
            color: "#333",
            // overflow: "visible",
            padding: "20px 10px 10px 10px",
            boxSizing: "border-box",
          }}
          onClose={() => {
            if (childCreateRef?.current) {
              //@ts-ignore
              childCreateRef.current.changeSave();
            } else {
              setAddVisible(false);
            }
          }}
        >
          <HeaderCreate
            createType={"work"}
            onClose={() => {
              setAddVisible(false);
            }}
            visible={addVisible}
            ref={childCreateRef}
            createStyle={{
              overflowY: "auto",
              height: "100%",
            }}
          />
        </DropMenu>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(1);
          }}
          style={
            workType === 1
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[0]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          今日
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(2);
          }}
          style={
            workType === 2
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[0]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          过期
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(3);
          }}
          style={
            workType === 3
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[1]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          未来
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(4);
          }}
          style={
            workType === 4
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[2]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          完成
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(5);
          }}
          style={
            workType === 5
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[3]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          指派
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(6);
          }}
          style={
            workType === 6
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[4]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          指派(已完成)
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(7);
          }}
          style={
            workType === 7
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[5]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          指派(未完成)
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(8);
          }}
          style={
            workType === 8
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[6]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          指派(已过期)
        </div>
        <div
          className="simple-menu-item"
          onClick={() => {
            changeWorkType(9);
          }}
          style={
            workType === 9
              ? {
                  backgroundColor: "#f0f0f0",
                }
              : {}
          }
        >
          <img
            src={workImgRef.current[7]}
            alt=""
            style={{ marginRight: "5px" }}
          />
          私有
        </div>
      </div> */}
      <div className="simple-container">
        {mainLabelArray.map((item, index) => {
          return <TaskSimple taskItem={item} key={"taskSimple" + index} />;
        })}
      </div>
    </div>
  );
};
WorkingTableSimple.defaultProps = {};
export default WorkingTableSimple;
