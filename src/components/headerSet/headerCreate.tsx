import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./headerSet.css";
import "./headerCreate.css";
import { Button, Input, Modal, Tabs, Dropdown, Checkbox } from "antd";
import {
  CloseOutlined,
  GlobalOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import moment from "moment";
import _ from "lodash";

import {
  setMessage,
  setFileInfo,
  setFileVisible,
} from "../../redux/actions/commonActions";
import { changeMusic } from "../../redux/actions/authActions";
import {
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
} from "../../redux/actions/taskActions";

import CreateMoreTask from "../createMoreTask/createMoreTask";
import Task from "../task/task";
import IconFont from "../../components/common/iconFont";
import FileList from "../../components/fileList/fileList";

import { useMount } from "../../hook/common";
import Avatar from "../common/avatar";

const { TabPane } = Tabs;
const { TextArea } = Input;

interface HeaderCreateProps {
  visible: boolean;
  createStyle?: any;
  createType?: string;
  onClose?: any;
  type?: string;
}

const HeaderCreate = forwardRef((props: HeaderCreateProps, ref) => {
  const { createStyle, createType, onClose, type } = props;
  const dispatch = useDispatch();
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const deleteKey = useTypedSelector((state) => state.task.deleteKey);
  const [addInput, setAddInput] = useState("");
  const [groupVisible, setGroupVisible] = useState(false);
  const [createTaskList, setCreateTaskList] = useState<any>([]);
  const [createPage, setCreatePage] = useState(1);
  const [createTotal, setCreateTotal] = useState(0);
  const [groupAllArray, setGroupAllArray] = useState<any>([]);
  const [labelAllArray, setLabelAllArray] = useState<any>([]);
  const [groupChooseArray, setGroupChooseArray] = useState<any>([]);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([]);
  const [chooseIndex, setChooseIndex] = useState<any>(0);
  const [closeVisible, setCloseVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [moveState, setMoveState] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [filterType, setFilterType] = useState(0);
  const [moreTaskCheck, setMoreTaskCheck] = useState(false);
  const [moreTaskVisible, setMoreTaskVisible] = useState(false);
  const limit = 20;
  const createRef: React.RefObject<any> = useRef();
  const searchRef: React.RefObject<any> = useRef();
  const createDivRef: React.RefObject<any> = useRef();

  const searchRefInput: React.RefObject<any> = useRef();
  const filterArray = ["全部", "未完成", "指派他人", "已完成", "已归档"];
  useMount(() => {
    dispatch(setFileInfo(null));
    dispatch(setFileVisible(false));
    searchRefInput.current.focus();
    getGroupArray();
  });
  useImperativeHandle(ref, () => ({
    changeSave: () => {
      if (addInput !== "") {
        setCloseVisible(true);
      } else {
        onClose();
      }
    },
  }));
  useEffect(() => {
    if (deleteKey) {
      setCreateTaskList((prevCreateTaskList) => {
        let taskIndex = _.findIndex(prevCreateTaskList, { _key: deleteKey });
        if (taskIndex !== -1) {
          prevCreateTaskList.splice(taskIndex, 1);
        }
        return prevCreateTaskList;
      });
    }
  }, [deleteKey]);

  const getGroupArray = useCallback(async () => {
    let groupRes: any = await api.group.getGroup(3, 3);
    if (groupRes.msg === "OK") {
      let groupArray = groupRes.result;
      let newGroupAllArray: any = [];
      let newLabelAllArray: any = [];
      let newGroupChooseArray: any = [];
      let newLabelChooseArray: any = [];
      let createGroupIndex = 0;
      let createGroupItem: any = null;
      let createLabelIndex = 0;
      let createLabelArrayItem: any = null;
      let createLabelItem: any = null;
      groupArray.forEach((item: any, index: number) => {
        if (item.role && item.role < 5 && item.frozenStatus !== 1) {
          newGroupAllArray.push(_.cloneDeep(item));
          newLabelAllArray.push(_.cloneDeep(item.labelInfo));
        }
      });
      newLabelChooseArray[0] = [];
      if (localStorage.getItem("createGroupKey")) {
        createGroupIndex = _.findIndex(newGroupAllArray, {
          _key: localStorage.getItem("createGroupKey"),
        });
        if (createGroupIndex !== -1) {
          createGroupItem = _.cloneDeep(newGroupAllArray[createGroupIndex]);
          newGroupAllArray.splice(createGroupIndex, 1);
          newGroupAllArray.unshift(createGroupItem);
          createLabelArrayItem = _.cloneDeep(
            newLabelAllArray[createGroupIndex]
          );
          newLabelAllArray.splice(createGroupIndex, 1);
          newLabelAllArray.unshift(createLabelArrayItem);
        }
      }
      if (localStorage.getItem("createLabelKey")) {
        createLabelIndex = _.findIndex(newLabelAllArray[0], {
          labelKey: localStorage.getItem("createLabelKey"),
        });
        if (createLabelIndex !== -1) {
          createLabelItem = _.cloneDeep(newLabelAllArray[0][createLabelIndex]);
          newLabelAllArray[0].splice(createLabelIndex, 1);
          newLabelAllArray[0].unshift(createLabelItem);
        }
      }
      newGroupChooseArray.push(_.cloneDeep(newGroupAllArray[0]));
      newLabelChooseArray[0].push(_.cloneDeep(newLabelAllArray[0][0]));
      newGroupChooseArray[0].index = 0;
      newLabelChooseArray[0][0].index = 0;
      setGroupChooseArray(newGroupChooseArray);
      setLabelChooseArray(newLabelChooseArray);
      setGroupAllArray(newGroupAllArray);
      setLabelAllArray(newLabelAllArray);
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  }, [dispatch]);

  const getTaskCreate = useCallback(
    async (page: number, createTaskList: any, filterType: number) => {
      let newCreateTaskList: any = _.cloneDeep(createTaskList);
      let res: any = await api.task.getCardCreate(page, limit, filterType);
      if (res.msg === "OK") {
        newCreateTaskList.push(...res.result);
        setCreateTaskList(newCreateTaskList);
        setCreateTotal(res.totalNumber);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    getTaskCreate(1, [], filterType);
  }, [filterType, getTaskCreate]);

  useEffect(() => {
    if (taskInfo) {
      setCreateTaskList((prevCreateTaskList) => {
        prevCreateTaskList[
          _.findIndex(prevCreateTaskList, { _key: taskInfo._key })
        ] = _.cloneDeep(taskInfo);
        return prevCreateTaskList;
      });
    }
  }, [taskInfo]);

  const scrollCreateLoading = (e: any) => {
    let newPage = createPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      createTaskList.length < createTotal
    ) {
      newPage = newPage + 1;
      setCreatePage(newPage);
      getTaskCreate(newPage, createTaskList, filterType);
    }
  };

  const addMoreTask = async () => {
    let groupArr: any = [];
    let labelArr: any = [];
    let obj: any = {};
    let newAddInput = addInput;
    if (!newAddInput) {
      dispatch(setMessage(true, "请输入任务内容", "error"));
      return;
    }
    _.cloneDeep(labelChooseArray).forEach((item: any, index: number) => {
      groupArr.push(groupChooseArray[index]._key);
      labelArr[index] = [];
      item.forEach((labelItem: any, labelIndex: number) => {
        if (labelArr[index].indexOf(labelItem.labelKey)) {
          // labelArr[index].push(labelItem.labelKey?labelItem.labelKey:'null');
          labelArr[index].push(labelItem.labelKey);
        }
      });
    });
    obj = {
      title: newAddInput,
      groupKeyArray: groupArr,
      labelKey2Array: labelArr,
      hour: 1,
      multiple: moreTaskCheck,
    };
    if (urlInput) {
      obj.extraData = {
        url:
          urlInput.indexOf("http://") !== -1 ||
          urlInput.indexOf("https://") !== -1
            ? urlInput
            : "http://" + urlInput,
      };
    }
    setLoading(true);
    let addTaskRes: any = await api.task.togetherCreateCard(obj);
    if (addTaskRes.msg === "OK") {
      setLoading(false);
      // if (addTaskRes.result.length === 0) {
      //   dispatch(setMessage(true, "请输入任务内容", "error"));
      //   return;
      // }
      dispatch(setMessage(true, "新增对应项目任务成功", "success"));
      dispatch(changeMusic(5));
      if (createTaskList) {
        let newCreateTaskList = _.cloneDeep(createTaskList);
        // let newGroupChooseArray = _.cloneDeep(groupChooseArray);
        // let newLabelChooseArray = _.cloneDeep(labelChooseArray);
        // let groupChooseItem = _.cloneDeep(newGroupChooseArray)[0];
        // let labelChooseItem = _.cloneDeep(newLabelChooseArray)[0];
        newCreateTaskList.unshift(...addTaskRes.result);
        setCreateTaskList(newCreateTaskList);
        // newGroupChooseArray = [groupChooseItem];
        // newLabelChooseArray = [labelChooseItem];
        // setGroupChooseArray(newGroupChooseArray);
        // setLabelChooseArray(newLabelChooseArray);
      }
      setAddInput("");
      setUrlInput("");
      setGroupVisible(false);
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, userKey, "[0, 1]"));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, userKey, 1, [0, 1, 2, 10], 2));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            userKey === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10],
            2
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, "[0,1,2,10]"));
      }
      // await api.group.visitGroupOrFriend(2, groupChooseArray[0]._key);
      // dispatch(getGroup(3));filterType
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, "error"));
    }
  };
  const changeGroupArray = (groupArray: any, labelArray: any) => {
    if (labelArray.length > 0) {
      let newGroupChooseArray = _.cloneDeep(groupChooseArray);
      let newLabelChooseArray = _.cloneDeep(labelChooseArray);
      newGroupChooseArray[chooseIndex] = groupArray;
      newLabelChooseArray[chooseIndex] = labelArray;
      setGroupChooseArray(newGroupChooseArray);
      setLabelChooseArray(newLabelChooseArray);
    }
  };
  const minusGroupArray = (index: number) => {
    let newGroupChooseArray = _.cloneDeep(groupChooseArray);
    let newLabelChooseArray = _.cloneDeep(labelChooseArray);
    newGroupChooseArray.splice(index, 1);
    newLabelChooseArray.splice(index, 1);
    setGroupChooseArray(newGroupChooseArray);
    setLabelChooseArray(newLabelChooseArray);
  };
  const downMenu = (
    <div className="dropDown-box headerCreate-filter-box">
      {filterArray.map((filterItem, filterIndex) => {
        return (
          <div
            onClick={() => {
              setFilterType(filterIndex);
            }}
            key={"createFilter" + filterIndex}
          >
            {filterItem}
          </div>
        );
      })}
    </div>
  );
  const filterMenu = (
    <Dropdown
      overlay={downMenu}
      placement="bottomRight"
      getPopupContainer={() => createDivRef.current}
      trigger={["click"]}
      overlayStyle={{ left: "300px" }}
    >
      <div className="headerCreate-filter-title">
        <IconFont
          type="icon-guolv"
          style={{ fontSize: "25px", marginRight: "5px" }}
        />
        {filterArray[filterType]} ( {createTotal} )
      </div>
    </Dropdown>
  );
  return (
    <div
      className={createType ? "headerCreate" : "create"}
      style={createStyle}
      onClick={() => {
        setGroupVisible(false);
      }}
      ref={createDivRef}
    >
      {!createType ? (
        <div className="headerCreate-mainTitle">新建任务</div>
      ) : null}
      <div
        className="headerSet-container"
        style={createType === "work" ? { height: "100%" } : {}}
      >
        <div className="headerSet-search-title" ref={searchRef}>
          <TextArea
            autoSize={{ minRows: 3 }}
            placeholder="任务名"
            style={{ width: "100%", fontSize: "16px" }}
            value={addInput}
            onChange={(e) => {
              if (e.target.value.indexOf("\n") !== -1) {
                setMoreTaskVisible(true);
                setMoreTaskCheck(true);
              } else {
                setMoreTaskVisible(false);
                setMoreTaskCheck(false);
              }
              setAddInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setMoreTaskVisible(true);
              }
            }}
            ref={searchRefInput}
          />
        </div>
        <div className="headerCreate-title-content" ref={createRef}>
          {groupChooseArray.map((item: any, index: number) => {
            return (
              <div className="headerCreate-title" key={"groupChoose" + index}>
                <div
                  className="headerCreate-title-left"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setGroupVisible(true);
                    setChooseIndex(index);
                  }}
                >
                  <div
                    className="headerCreate-title-avatar"
                    style={{ borderRadius: "5px" }}
                  >
                    <Avatar
                      avatar={item?.groupLogo}
                      name={item?.groupName}
                      type={"group"}
                      index={index}
                    />
                  </div>
                  <div className="headerCreate-title-left-left toLong">
                    {item.groupName}
                  </div>
                  <div className="headerCreate-title-left-right toLong">
                    {labelChooseArray[index] ? (
                      <div className="headerCreate-title-left-title">
                        /{" "}
                        {labelChooseArray[index][0].labelName
                          ? labelChooseArray[index][0].labelName
                          : labelChooseArray[index][0].labelKey
                          ? ""
                          : "ToDo"}
                        (
                        {labelChooseArray[index][0].executorName
                          ? labelChooseArray[index][0].executorName
                          : "无默认执行人"}
                        )
                      </div>
                    ) : null}
                  </div>
                  {index > 0 ? (
                    <div className="headerCreate-delete">
                      <Button
                        ghost
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          minusGroupArray(index);
                        }}
                        style={{ border: "0px", color: "#333" }}
                      />
                    </div>
                  ) : null}
                </div>

                {/*  */}
              </div>
            );
          })}
          {/* <div style={{ position: 'relative' }}> */}
          {/* <div
            className="headerCreate-choose-title"
            onClick={() => {
              setGroupVisible(true);
            }}
          >
            请选择项目/频道
            <img
              src={downArrowbPng}
              alt=""
              style={{ width: '11px', height: '7px', marginLeft: '8px' }}
            />
          </div> */}
          <CreateMoreTask
            visible={groupVisible}
            createStyle={{
              position: "absolute",
              top:
                55 +
                (searchRef.current ? searchRef.current.offsetHeight : 0) +
                chooseIndex * 47 +
                "px",
              left: "0px",
              height:
                type === "phone"
                  ? "calc(100vh - 188px)"
                  : "calc(100vh - 300px)",
              minHeight: "260px",
              color: "#333",
              width: type === "phone" ? "calc(100vw - 1px)" : "428px",
            }}
            changeGroupArray={changeGroupArray}
            onClose={() => {
              setGroupVisible(false);
            }}
            groupIndex={
              chooseIndex < groupChooseArray.length &&
              groupChooseArray[chooseIndex]
                ? groupChooseArray[chooseIndex].index
                : 0
            }
            labelIndex={
              chooseIndex < groupChooseArray.length &&
              labelChooseArray[chooseIndex]
                ? labelChooseArray[chooseIndex][0].index
                : 0
            }
            labelArray={labelAllArray}
            groupArray={groupAllArray}
          />
          {/* </div> */}
        </div>

        <div className="create-button">
          <Button
            type="primary"
            ghost
            shape="circle"
            icon={<PlusCircleOutlined style={{ fontSize: "18px" }} />}
            onClick={(e) => {
              e.stopPropagation();
              setGroupVisible(true);
              setChooseIndex(groupChooseArray.length);
            }}
            style={{ border: "0px" }}
          />
          <div className="headerCreate-url">
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<GlobalOutlined />}
              onClick={() => {
                setMoveState(true);
              }}
              style={{ border: "0px" }}
            />

            <Input
              className="headerCreate-url-input"
              value={urlInput}
              onChange={(e: any) => {
                setUrlInput(e.target.value);
              }}
              placeholder="请输入链接地址"
              style={
                moveState
                  ? {
                      animation: "urlInputOut 500ms",
                      animationFillMode: "forwards",
                    }
                  : {}
              }
            />
          </div>
          {moreTaskVisible ? (
            <Checkbox
              checked={moreTaskCheck}
              onChange={(e) => {
                setMoreTaskCheck(e.target.checked);
              }}
            >
              多任务
            </Checkbox>
          ) : null}

          <Button
            type="primary"
            onClick={() => {
              addMoreTask();
            }}
            loading={loading}
            style={{ marginLeft: "10px", color: "#fff" }}
          >
            保存
          </Button>
        </div>

        {createType !== "work" ? (
          <Tabs
            tabBarExtraContent={tabKey === "1" ? filterMenu : null}
            activeKey={tabKey}
            onChange={(activeKey) => {
              setTabKey(activeKey);
            }}
            style={{ color: type === "phone" ? "#fff" : "#000" }}
          >
            <TabPane tab={"任务"} key="1">
              <div
                className="headerSet-search-info"
                onScroll={scrollCreateLoading}
                style={{
                  height:
                    type === "phone"
                      ? document.body.offsetHeight - 333
                      : document.body.offsetHeight - 310,
                }}
              >
                {createTaskList.length > 0 && createRef?.current
                  ? createTaskList.map((taskItem: any, taskIndex: number) => {
                      return (
                        <Task
                          key={"create" + taskIndex}
                          taskItem={taskItem}
                          showGroupName={true}
                          createTime={moment(
                            moment().valueOf() - taskItem.createTime > 0
                              ? taskItem.createTime
                              : moment().valueOf() - 3000
                          ).fromNow()}
                          bottomtype={createType ? "" : "create"}
                        />
                      );
                    })
                  : null}
              </div>
            </TabPane>
            <TabPane tab={"文件"} key="2">
              <div
                className="headerSet-search-info"
                // onScroll={scrollCreateLoading}
                style={{
                  height:
                    type === "phone"
                      ? document.body.offsetHeight - 333
                      : document.body.offsetHeight - 310,
                }}
              >
                <FileList
                  groupKey={""}
                  type="文档"
                  // fileItemWidth={'calc(100% - 270px)'}
                />
              </div>
            </TabPane>
            {/* <TabPane tab={"收藏"} key="3">
            <div
              className="headerSet-search-info"
              // onScroll={scrollCreateLoading}
              style={{
                height:
                  document.body.offsetHeight -
                  ((createRef.current ? createRef.current.offsetHeight : 0) +
                    (createType ? 270 : 300)),
              }}
            >
              <FileList
                groupKey={mainGroupKey}
                type="收藏"
              // fileItemWidth={'calc(100% - 270px)'}
              />
            </div>
          </TabPane> */}
          </Tabs>
        ) : null}
      </div>
      <Modal
        visible={closeVisible}
        onCancel={() => {
          setCloseVisible(false);
          onClose();
        }}
        onOk={() => {
          addMoreTask();
          setCloseVisible(false);
        }}
        title={"保存任务"}
      >
        是否需要保存任务
      </Modal>
    </div>
    //
  );
});
HeaderCreate.defaultProps = {};
export default HeaderCreate;
