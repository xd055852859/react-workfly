import React, { useState, useEffect, useRef, useCallback } from "react";
import "../workingTable/workingTableLabel.css";
import "./groupTableGroup.css";
import api from "../../services/api";
import _ from "lodash";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/auth";

import { getGroupTask, setChooseKey } from "../../redux/actions/taskActions";
import { changeMusic } from "../../redux/actions/authActions";
import { setMessage } from "../../redux/actions/commonActions";

import format from "../../components/common/format";
import Task from "../../components/task/task";
import TaskNav from "../../components/taskNav/taskNav";
const { TextArea } = Input;
interface GroupTablePersonProps {

}

const GroupTablePerson: React.FC<GroupTablePersonProps> = (props) => {
    const { deviceWidth } = useAuth();
    const taskArray = useTypedSelector((state) => state.task.taskArray);
    const groupKey = useTypedSelector((state) => state.group.groupKey);
    const groupInfo = useTypedSelector((state) => state.group.groupInfo);

    const [groupTaskArray, setGroupTaskArray] = useState<any>([]);
    // const [labelIndex, setLabelIndex] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [addTaskVisible, setAddTaskVisible] = useState(false);
    const [addInput, setAddInput] = useState("");
    const [chooseLabelKey, setChooseLabelKey] = useState("");
    const [moveState, setMoveState] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const filterObject = useTypedSelector((state) => state.task.filterObject);
    const dispatch = useDispatch();
    const containerRef: React.RefObject<any> = useRef();
    const getData = useCallback(
        (taskArray: any, filterObject: any) => {
            let executorObj: any = {};
            let newGroupTaskArray: any = []
            taskArray.forEach((item: any, index: any) => {
                if (item.executorKey) {
                    if (!executorObj[item.executorKey]) {
                        executorObj[item.executorKey] = []
                    }
                    executorObj[item.executorKey].push({ ...item })
                }
            });
            for (let key in executorObj) {
                let item = executorObj[key]
                item = _.cloneDeep(format.formatFilter(item, filterObject));
                item = _.sortBy(item, ['taskEndDate']);
                item = _.sortBy(item, ['finishPercent']);
                if (item.length > 0) {
                    newGroupTaskArray.push([...item])
                }
            }
            newGroupTaskArray = _.sortBy(newGroupTaskArray, ['length']).reverse()
            setGroupTaskArray(newGroupTaskArray)
        },
        []
    );
    useEffect(() => {
        if (taskArray && filterObject) {
            setLoading(false);
            getData(taskArray, filterObject);
        }
    }, [taskArray, getData, filterObject]);

    const addTask = async (groupInfo: any, labelkey: string, executorKey: string) => {
        let obj = {};
        if (addInput === "") {
            setAddTaskVisible(false);
            return;
        }
        if (urlInput) {
            obj = {
                url:
                    urlInput.indexOf("http://") !== -1 ||
                        urlInput.indexOf("https://") !== -1
                        ? urlInput
                        : "http://" + urlInput,
            };
        }
        setLoading(true);
        let addTaskRes: any = await api.task.addTask({
            groupKey: groupInfo._key,
            groupRole: groupInfo.groupRole,
            labelKey: labelkey,
            executorKey: executorKey,
            taskType: 1,
            title: addInput,
            extraData: obj,
        });
        if (addTaskRes.msg === "OK") {
            dispatch(setMessage(true, "新增任务成功", "success"));
            dispatch(changeMusic(5));
            dispatch(setChooseKey(addTaskRes.result._key));
            dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
            // setAddTaskVisible(false);
            setAddInput("");
            setUrlInput("");
            setLoading(false);
        } else {
            setLoading(false);
            dispatch(setMessage(true, addTaskRes.msg, "error"));
        }
    };
    // const scrollTask = (e: any, index: number) => {
    //     setTaskLoading(true);
    //     let newTaskLoadInfo = _.cloneDeep(taskLoadInfo);
    //     let taskLength = newTaskLoadInfo[index].length;
    //     let scrollHeight = e.target.scrollHeight;
    //     //滚动条滚动距离
    //     let scrollTop = e.target.scrollTop;
    //     //窗口可视范围高度
    //     let clientHeight = e.target.clientHeight;
    //     if (
    //         clientHeight + scrollTop + 1 >= scrollHeight &&
    //         taskLength < groupTaskArray[index].length
    //     ) {
    //         newTaskLoadInfo[index].push(
    //             ...groupTaskArray[index].slice(taskLength, taskLength + taskNumber)
    //         );
    //         setTaskLoadInfo(newTaskLoadInfo);
    //     } else {
    //         setTaskLoading(false);
    //     }
    // };

    return (
        <div className="task">
            {groupInfo ? (
                <div className="task-container-profile" ref={containerRef}>
                    <div className="task-container-taskName-container">
                        <div className="task-container-taskName">
                            {groupTaskArray.map((taskNameitem: any, taskNameindex: any) => {
                                return (
                                    <div className="task-container-taskName-item" key={"dragNav" + taskNameindex}>
                                        {groupInfo &&
                                            groupInfo.role > 0 &&
                                            groupInfo.role < 5 ? (
                                            <div
                                                className="taskNav-addLabel"
                                                style={{ right: '17px' }}
                                                onClick={() => {
                                                    setAddTaskVisible(true);
                                                    setChooseLabelKey(taskNameitem[0]?.executorKey);
                                                    document
                                                        .querySelectorAll(".task-item-info")
                                                    [taskNameindex].scrollTo(0, 0);
                                                }}
                                            ></div>
                                        ) : null}
                                        <div style={{ width: deviceWidth, marginRight: "5px", }}>
                                            <TaskNav
                                                avatar={taskNameitem[0]?.executorAvatar}
                                                executorKey={taskNameitem[0]?.executorKey}
                                                name={taskNameitem[0]?.executorName}
                                                role={groupInfo && groupInfo.role}
                                                colorIndex={taskNameindex}
                                                taskNavWidth={"350px"}
                                                type={'person'}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="task-container-task">
                        {groupTaskArray.map((taskInfoitem: any, taskInfoindex: any) => {
                            return (
                                <div
                                    className="task-item-info"
                                    style={{
                                        width: deviceWidth,
                                        marginRight: "5px",
                                    }}
                                    key={"taskInfoitem" + taskInfoindex}
                                    onScroll={(e) => {
                                        //   scrollTask(e, taskInfoindex);
                                    }}
                                >
                                    <React.Fragment>
                                        {(addTaskVisible && taskInfoitem
                                            && taskInfoitem[0].executorKey + "" === chooseLabelKey)
                                            ? (
                                                <div className="taskItem-plus-title taskNav-plus-title">
                                                    <div className="taskItem-plus-input">
                                                        <TextArea
                                                            autoSize={{ minRows: 1 }}
                                                            placeholder="任务标题"
                                                            value={addInput}
                                                            autoComplete="off"
                                                            onChange={(e: any) => {
                                                                setAddInput(e.target.value);
                                                            }}
                                                            style={{ width: "100%" }}
                                                            onKeyDown={(e: any) => {
                                                                if (e.shiftKey && e.keyCode === 13) {
                                                                    setAddInput(e.target.value + "\n");
                                                                } else if (e.keyCode === 13 && !loading) {
                                                                    e.preventDefault();
                                                                    addTask(
                                                                        groupInfo,
                                                                        taskInfoitem[0]?.labelKey ? taskInfoitem[0].labelKey : "",
                                                                        taskInfoitem[0]?.executorKey
                                                                    );
                                                                }

                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="taskItem-plus-button"
                                                        style={{ marginTop: "10px" }}
                                                    >
                                                        <div className="taskNav-url">
                                                            <Button
                                                                type="primary"
                                                                shape="circle"
                                                                icon={<GlobalOutlined />}
                                                                ghost
                                                                style={{ border: "0px", color: "#fff" }}
                                                                onClick={() => {
                                                                    setMoveState(true);
                                                                }}
                                                            />

                                                            <Input
                                                                className="taskNav-url-input"
                                                                value={urlInput}
                                                                onChange={(e: any) => {
                                                                    setUrlInput(e.target.value);
                                                                }}
                                                                placeholder="请输入链接地址"
                                                                style={
                                                                    moveState
                                                                        ? {
                                                                            animation: "urlOut 500ms",
                                                                            animationFillMode: "forwards",
                                                                        }
                                                                        : {}
                                                                }
                                                            />
                                                        </div>
                                                        <Button
                                                            ghost
                                                            onClick={() => {
                                                                setChooseLabelKey("");
                                                                setAddTaskVisible(false);
                                                                setAddInput("");
                                                                setMoveState(false);
                                                            }}
                                                            style={{
                                                                marginRight: "10px",
                                                                border: "0px",
                                                            }}
                                                        >
                                                            取消
                                                        </Button>

                                                        <Button
                                                            loading={loading}
                                                            type="primary"
                                                            onClick={() => {
                                                                addTask(
                                                                    groupInfo,
                                                                    taskInfoitem[0]?.labelKey ? taskInfoitem[0].labelKey : "",
                                                                    taskInfoitem[0]?.executorKey
                                                                );
                                                            }}
                                                            style={{
                                                                marginLeft: "10px",
                                                            }}
                                                        >
                                                            确定
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        {taskInfoitem.map((item: any, index: any) => (
                                            <div key={"task" + item._key} className="task-item-item">
                                                {item.show ? (<Task taskItem={item} />) : null}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
GroupTablePerson.defaultProps = {
};
export default GroupTablePerson;