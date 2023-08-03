import React, { useState, useEffect, useRef, useCallback } from "react";
import "./headerSet.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Input, Tooltip, Badge, Drawer, Checkbox } from "antd";
// , Select
import { useDispatch } from "react-redux";
import _ from "lodash";
import api from "../../services/api";

import {
  setMessage,
  setUnMessageNum,
  setChatState,
} from "../../redux/actions/commonActions";

import ClockIn from "../clockIn/clockIn";
import MessageBoard from "../../views/board/messageBoard";
import Chat from "../../views/chat/chat";
import Task from "../task/task";
import HeaderCreate from "./headerCreate";
import HeaderContent from "./headerContent";

import searchPng from "../../assets/img/headerSearch.png";
import addPng from "../../assets/img/taskAdd.png";
import messagePng from "../../assets/img/headerMessage.png";
import chatPng from "../../assets/img/headerChat.png";
import clockInPng from "../../assets/img/clockIn.png";
import Avatar from "../common/avatar";
const { Search } = Input;
// const { Option } = Select;
interface HeaderSetProps {}

const HeaderSet: React.FC<HeaderSetProps> = (prop) => {
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const user = useTypedSelector((state) => state.auth.user);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [pathChecked, setPathChecked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTaskList, setSearchTaskList] = useState<any>([]);
  const [lastPage, setLastPage] = useState(1);
  const [lastTaskList, setLastTaskList] = useState<any>([]);
  const [lastTotal, setLastTotal] = useState(0);

  const [avatar, setAvatar] = useState<any>(null);
  const [nickName, setNickName] = useState<any>(null);
  const [chooseKey, setChooseKey] = useState<string>("");
  // const [checkValue, setCheckValue] = useState<any>([]);

  const childRef = useRef<any>();
  const childCreateRef = useRef<any>();
  const setRef: React.RefObject<any> = useRef();

  const limit = 20;
  useEffect(() => {
    if (user) {
      setAvatar(user.profile.avatar);
      setNickName(user.profile.nickName);
    }
  }, [user]);
  useEffect(() => {
    if (taskInfo) {
      let newLastTaskList = _.cloneDeep(lastTaskList);
      newLastTaskList = newLastTaskList.map((item) => {
        if (item._key === taskInfo._key) {
          item = taskInfo;
        }
        return item;
      });
      setLastTaskList(newLastTaskList);
      let newSearchTaskList = _.cloneDeep(searchTaskList);
      newSearchTaskList = newSearchTaskList.map((item) => {
        if (item._key === taskInfo._key) {
          item = taskInfo;
        }
        return item;
      });
      setSearchTaskList(newSearchTaskList);
    }
    //eslint-disable-next-line
  }, [taskInfo]);
  useEffect(() => {
    setPage(1);
    setSearchTaskList([]);
    setSearchInput("");
  }, [groupKey, headerIndex]);
  useEffect(() => {
    setPage(1);
    searchTask(1);
    //eslint-disable-next-line
  }, [pathChecked]);
  useEffect(() => {
    if (searchInput === "") {
      setSearchTaskList([]);
      setPage(1);
    }
  }, [searchInput]);
  const getTaskLast = useCallback(
    async (page: number) => {
      let obj: any = {
        curPage: 1,
        perPage: limit * page,
        groupKey: "",
        typeArray: [2, 6],
      };
      let res: any = await api.task.getCardLast(obj);
      if (res.msg === "OK") {
        setLastTaskList([...res.result]);
        setLastTotal(res.totalNumber);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (searchVisible) {
      getTaskLast(1);
    }
  }, [searchVisible, getTaskLast]);
  const searchTask = (page) => {
    if (searchInput !== "") {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getTaskSearch(page);
    }
  };
  const getTaskSearch = async (page: number) => {
    let newSearchTaskList: any = [];
    if (searchInput === "") {
      return;
    }
    if (page === 1) {
      setSearchTaskList([]);
    } else {
      newSearchTaskList = _.cloneDeep(searchTaskList);
    }
    let obj: any = {
      curPage: 1,
      perPage: limit * page,
      searchCondition: searchInput,
      searchType: 1,
      isPath: pathChecked ? 2 : 1,
    };
    // if (checkArr.indexOf("已归档") !== -1) {
    obj.finishPercentStr = "0,1,2";
    // }
    // if (checkArr.indexOf("当前项目") !== -1) {
    //   obj.groupKey = groupKey;
    //   obj.searchType = 3;
    // }
    // if (checkArr.indexOf("与我有关") !== -1) {
    //   obj.searchType = 2;
    // }
    // if (
    //   checkArr.indexOf("当前项目") !== -1 &&
    //   checkArr.indexOf("与我有关") !== -1
    // ) {
    // obj.searchType = 4;
    // }
    let res: any = await api.task.getCardSearch(obj);
    if (res.msg === "OK") {
      newSearchTaskList = _.cloneDeep(res.result);
      setSearchTaskList(newSearchTaskList);
      setTotal(res.totalNumber);
      if (res.totalNumber === 0) {
        dispatch(setMessage(true, "无搜索结果", "warning"));
      }
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };

  const scrollSearchLoading = (e: any) => {
    if (searchInput === "") {
      let newPage = lastPage;
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight - 1 &&
        lastTaskList.length < lastTotal
      ) {
        newPage = newPage + 1;
        setLastPage(newPage);
        getTaskLast(newPage);
      }
    } else {
      let newPage = page;
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight - 1 &&
        searchTaskList.length < total
      ) {
        newPage = newPage + 1;
        setPage(newPage);
        getTaskSearch(newPage);
      }
    }
  };
  // const handleChange = (value: string) => {
  //   setCheckValue(value);
  //   getTaskSearch(1, value);
  //   setPage(1);
  // };
  return (
    <div
      ref={setRef}
      style={{ position: "fixed", top: "0px", right: "10px", zIndex: 5 }}
    >
      <div className="contentHeader-set">
        <React.Fragment>
          <Tooltip title="新建任务" getPopupContainer={() => setRef.current}>
            <img
              src={addPng}
              alt=""
              style={{
                width: "35px",
                height: "35px",
                marginRight: "5px",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => {
                setAddVisible(true);
              }}
              onTouchStart={() => {
                setAddVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="搜索" getPopupContainer={() => setRef.current}>
            <img
              src={searchPng}
              alt=""
              style={{
                width: "35px",
                height: "35px",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSearchVisible(true);
              }}
              onTouchStart={() => {
                setSearchVisible(true);
              }}
            />
          </Tooltip>

          <Tooltip title="消息" getPopupContainer={() => setRef.current}>
            <Badge count={unMessageNum} offset={[-10, 5]}>
              <img
                src={messagePng}
                alt=""
                style={{
                  width: "35px",
                  height: "35px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setMessageVisible(true);
                  dispatch(setUnMessageNum(0));
                  // dispatch(setSocketObj(null));
                }}
                onTouchStart={() => {
                  setMessageVisible(true);
                  dispatch(setUnMessageNum(0));
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="聊天" getPopupContainer={() => setRef.current}>
            <Badge count={unChatNum ? unChatNum : 0} offset={[-10, 5]}>
              <img
                src={chatPng}
                alt=""
                style={{
                  width: "35px",
                  height: "35px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  dispatch(setChatState(!chatState));
                }}
                onTouchStart={() => {
                  dispatch(setChatState(!chatState));
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="打卡" getPopupContainer={() => setRef.current}>
            <img
              src={clockInPng}
              alt=""
              style={{
                width: "35px",
                height: "35px",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                setClockVisible(true);
              }}
              onTouchStart={() => {
                setClockVisible(true);
              }}
            />
          </Tooltip>
        </React.Fragment>
        {/* <Tooltip title="用户"> */}
        <div
          className="contentHeader-avatar"
          onClick={() => {
            setContentSetVisilble(true);
          }}
        >
          <Avatar avatar={avatar} name={nickName} index={0} type={"group"} />
        </div>
        {/* </Tooltip> */}
      </div>

      <Drawer
        visible={addVisible}
        onClose={() => {
          if (childCreateRef?.current) {
            //@ts-ignore
            childCreateRef.current.changeSave();
          } else {
            setAddVisible(false);
          }
        }}
        width={430}
        bodyStyle={{
          padding: "3px 10px",
          boxSizing: "border-box",
        }}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
          border: "0px",
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        title={"新建任务"}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
      >
        <HeaderCreate
          createType={"local"}
          onClose={() => {
            setAddVisible(false);
          }}
          visible={addVisible}
          ref={childCreateRef}
        />
      </Drawer>
      <Drawer
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
          setSearchInput("");
          // setCheckValue([]);
        }}
        width={430}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        destroyOnClose={true}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        getContainer={() => setRef.current}
        title={"搜索任务"}
        push={false}
      >
        <div className="headerSet-search-subTitle">
          <Search
            placeholder="请输入搜索内容"
            value={searchInput}
            autoComplete="off"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onSearch={() => searchTask(1)}
            allowClear={false}
            style={{ width: "100%", height: "32px" }}
          />
          {/* headerIndex === 3 ? "calc(100% - 290px)" : "calc(100% - 200px)" */}
          {/* <Select
            mode="multiple"
            allowClear={false}
            style={{ width: headerIndex === 3 ? "285px" : "196px" }}
            placeholder="请选择"
            defaultValue={""}
            value={checkValue}
            showArrow
            onChange={handleChange}
          >
            <Option value={"已归档"} key={"checkValue0"}>
              已归档
            </Option>
            <Option value={"与我有关"} key={"checkValue1"}>
              与我有关
            </Option>
            {headerIndex === 3 ? (
              <Option value={"当前项目"} key={"checkValue2"}>
                当前项目
              </Option>
            ) : null}
          </Select> */}
        </div>
        {searchInput === "" ? (
          lastTaskList.length > 0 ? (
            <React.Fragment>
              <div className="headerSet-last-title">最近访问：</div>
              <div
                className="headerSet-search-info"
                onScroll={scrollSearchLoading}
              >
                {lastTaskList.map((taskItem: any, taskIndex: number) => {
                  return (
                    <Task
                      key={"last" + taskIndex}
                      taskItem={taskItem}
                      showGroupName={true}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          ) : null
        ) : searchTaskList.length > 0 ? (
          <React.Fragment>
            <div className="headerSet-last-title">搜索结果：</div>
            <div
              className="headerSet-search-info"
              onScroll={scrollSearchLoading}
            >
              {searchTaskList.map((taskItem: any, taskIndex: number) => {
                return (
                  <Task
                    key={"search" + taskIndex}
                    taskItem={taskItem}
                    showGroupName={true}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ) : null}
        {searchInput !== "" ? (
          <div className="search-checkbox">
            <Checkbox
              checked={pathChecked}
              onChange={() => {
                setPathChecked(!pathChecked);
              }}
            >
              显示路径
            </Checkbox>
          </div>
        ) : null}
      </Drawer>
      <Drawer
        visible={messageVisible}
        onClose={() => {
          setMessageVisible(false);
        }}
        width={430}
        bodyStyle={{
          padding: "0px 10px",
          boxSizing: "border-box",
          overflow:'visible'
        }}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        title={"消息"}
        push={false}
      >
        <MessageBoard type={"header"} />
      </Drawer>
      <Drawer
        visible={clockVisible}
        onClose={() => {
          if (childRef?.current) {
            //@ts-ignore
            childRef.current.saveClockIn();
          }
          setClockVisible(false);
        }}
        width={430}
        bodyStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: "10px",
          boxSizing: "border-box",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        title={"打卡"}
      >
        <ClockIn ref={childRef} />
      </Drawer>
      <Drawer
        visible={contentSetVisilble}
        onClose={() => {
          setContentSetVisilble(false);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
          if (chooseKey) {
            api.auth.chooseWallPapers(chooseKey);
          }
        }}
        width={280}
        bodyStyle={{
          padding: "0px",
          boxSizing: "border-box",
        }}
        headerStyle={{
          display: "none",
        }}
        maskStyle={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        destroyOnClose={true}
        // getContainer={() => setRef.current}
        push={false}
      >
        <HeaderContent setChooseKey={setChooseKey} />
      </Drawer>
      <Chat />
    </div>
  );
};
export default HeaderSet;
