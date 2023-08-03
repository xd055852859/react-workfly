import React, { useState, useEffect, useRef, useCallback } from "react";
import "./book.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import Loadable from "react-loadable";
import { Button, Tooltip } from "antd";
import api from "../../services/api";
import IconFont from "../common/iconFont";

import { setMessage } from "../../redux/actions/commonActions";
import { useMount } from "../../hook/common";
// import { useAuth } from "../../context/auth";

const BookView = Loadable({
  loader: () => import("./book/bookView"),
  loading: () => null,
});
const BookEditor = Loadable({
  loader: () => import("./book/bookEditor"),
  loading: () => null,
});
interface BookProps {
  targetData: any;
  onChange: Function;
  fileType: string;
  viewState?: string | boolean;
}

const Book: React.FC<BookProps> = (props) => {
  const { targetData, onChange, viewState } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [editable, setEditable] = useState<any>(false);
  const [selectId, setSelectId] = useState<any>(null);
  let unDistory = useRef<any>(true);
  // let { deviceType } = useAuth();
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  console.log(targetData);
  const getBookData = useCallback(
    async (key: string) => {
      console.log(groupInfo?.taskTreeRootCardKey);

      let bookRes: any = await api.task.getTaskTreeList(
        groupInfo?.taskTreeRootCardKey ? groupInfo.taskTreeRootCardKey : null,
        key
      );
      if (unDistory.current) {
        if (bookRes.msg === "OK") {
          let newNodeObj: any = {};
          let newGridList: any = [];
          bookRes.result.forEach((taskItem: any, taskIndex: number) => {
            newGridList.push(taskItem);
            newNodeObj[taskItem._key] = {
              _key: taskItem._key,
              name: taskItem.title,
              type: taskItem.type,
              contract: taskItem.contract ? true : false,
              father: taskItem.parentCardKey ? taskItem.parentCardKey : "",
              sortList: taskItem.children ? taskItem.children : [],
              content: taskItem.content,
            };
          });
          // if (newNodeObj[key].content) {
          //   setContent(newNodeObj[key].content);
          // } else {
          //   setContent('<p>标题</p>');
          // }
          // setSelectedId(newNodeObj[key]._key);
          setGridList((prevGridList) => {
            return [...prevGridList, ...newGridList];
          });
          setNodeObj((prevGridList) => {
            return { ...prevGridList, ...newNodeObj };
          });
          setSelectId(key);
        } else {
          dispatch(setMessage(true, bookRes.msg, "error"));
        }
      }
    },
    [dispatch, groupInfo]
  );
  useEffect(() => {
    if (targetData) {
      getBookData(targetData._key);
    }
  }, [targetData, getBookData]);

  const changeSelect = (node: any) => {
    setSelectId(node._key);
    setEditable(true);
  };
  return (
    <React.Fragment>
      {editable && nodeObj && gridList && targetData ? (
        <BookEditor
          nodeObj={nodeObj}
          gridList={gridList}
          targetData={targetData}
          selectId={selectId}
          setSelectId={setSelectId}
          onChange={onChange}
          setGridList={setGridList}
          setNodeObj={setNodeObj}
          viewState={viewState}
        />
      ) : (
        <BookView
          nodeObj={nodeObj}
          gridList={gridList}
          targetData={targetData}
          changeSelect={changeSelect}
        />
      )}
      {/* {fileType === 'list' ?
        <div className="book-button" style={deviceType !== 'mobile' ? { position: 'absolute', top: '10px' } : { position: 'fixed', bottom: '50px' }}>
          <Button
            type="primary"
            size="large"
            shape="circle"
            ghost
            icon={editable ? (
              <Tooltip title="目录" placement="bottom">
                <IconFont type="icon-fengmian" style={{ fontSize: "14px" }} />
              </Tooltip>
            ) : (
              <Tooltip title="内页" placement="bottom">
                <IconFont type="icon-dir" style={{ fontSize: "14px" }} />
              </Tooltip>
            )}
            onClick={(e) => {
              setEditable(!editable);
            }}
          />
        </div> : */}
      {!viewState ? (
        <div
          className="book-button"
          style={{ position: "fixed", bottom: "105px", right: "35px" }}
        >
          <Button
            ghost
            icon={
              editable ? (
                <Tooltip title="目录">
                  <IconFont type="icon-fengmian" style={{ fontSize: "25px" }} />
                </Tooltip>
              ) : (
                <Tooltip title="内页">
                  <IconFont type="icon-dir" style={{ fontSize: "25px" }} />
                </Tooltip>
              )
            }
            type="primary"
            onClick={() => {
              setEditable(!editable);
            }}
            style={{ border: "0px" }}
          />
        </div>
      ) : null}
      {/* } */}
    </React.Fragment>
  );
};
Book.defaultProps = {};
export default Book;
