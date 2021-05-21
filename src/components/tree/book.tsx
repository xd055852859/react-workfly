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
  fullType?: string;
}

const Book: React.FC<BookProps> = (props) => {
  const { targetData, onChange } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [editable, setEditable] = useState<any>(false);
  const [selectId, setSelectId] = useState<any>(null);
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getBookData = useCallback(
    async (key: string) => {
      let bookRes: any = await api.task.getTaskTreeList(
        groupInfo.taskTreeRootCardKey,
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
        />
      ) : (
        <BookView
          nodeObj={nodeObj}
          gridList={gridList}
          targetData={targetData}
          changeSelect={changeSelect}
        />
      )}
      <div className="book-button" style={{ top: "68px", right: "55px" }}>
        <Button
          ghost
          icon={
            editable ? (
              <Tooltip title="目录">
                <IconFont type="icon-fengmian" />
              </Tooltip>
            ) : (
              <Tooltip title="内页">
                <IconFont type="icon-dir" />
              </Tooltip>
            )
          }
          type="primary"
          onClick={() => {
            setEditable(!editable);
          }}
          style={{ border: "0px", marginTop: "10px" }}
        />
      </div>
    </React.Fragment>
  );
};
Book.defaultProps = {};
export default Book;
