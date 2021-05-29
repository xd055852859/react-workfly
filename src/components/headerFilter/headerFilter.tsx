import React, { useState, useEffect, useCallback } from "react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _ from "lodash";
import api from "../../services/api";

import { setFilterObject } from "../../redux/actions/taskActions";

import Filter from "../common/filter";
import { setMessage } from "../../redux/actions/commonActions";
import { setTheme } from "../../redux/actions/authActions";

import allSvg from "../../assets/svg/all.svg";
interface HeaderFilterProps {}

const HeaderFilter: React.FC<HeaderFilterProps> = (prop) => {
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const [groupFilterVisible, setGroupFilterVisible] = useState(false);
  const [executorfilterVisible, setExecutorFilterVisible] = useState(false);
  const [creatorFilterVisible, setCreatorFilterVisible] = useState(false);
  const [groupFilterArray, setGroupFilterArray] = useState<any>();
  const [executorfilterArray, setExecutorFilterArray] = useState<any>();
  const [creatorFilterArray, setCreatorFilterArray] = useState<any>();
  const [groupIndex, setGroupIndex] = useState(0);
  const [creatorIndex, setCreatorIndex] = useState(0);
  const [executorIndex, setExecutorIndex] = useState(0);

  const dispatch = useDispatch();
  const getData = useCallback((cardArray: any, filterObject: any) => {
    let groupFilterArray: any = [
      {
        name: "全部",
        key: null,
        avatar: allSvg,
      },
    ];
    let creatorFilterArray: any = [
      {
        name: "全部",
        key: null,
        avatar: allSvg,
      },
    ];
    let executorfilterArray: any = [
      {
        name: "全部",
        key: null,
        avatar: allSvg,
      },
    ];
    _.flatten(cardArray).forEach((item: any) => {
      let groupIndex = _.findIndex(groupFilterArray, { key: item.groupKey });
      if (groupIndex === -1 && item.groupKey) {
        groupFilterArray.push({
          key: item.groupKey,
          name: item.groupName,
          avatar: item.groupLogo,
        });
      }
      let creatorIndex = _.findIndex(creatorFilterArray, {
        key: item.creatorKey,
      });
      if (creatorIndex === -1 && item.creatorKey) {
        creatorFilterArray.push({
          key: item.creatorKey,
          name: item.creatorName,
          avatar: item.creatorAvatar,
        });
      }
      let executorIndex = _.findIndex(executorfilterArray, {
        key: item.executorKey,
      });
      if (executorIndex === -1 && item.executorKey) {
        executorfilterArray.push({
          key: item.executorKey,
          name: item.executorName,
          avatar: item.executorAvatar,
        });
      }
    });
    setGroupFilterArray(groupFilterArray);
    if (filterObject.groupKey) {
      let newGroupIndex = _.findIndex(groupFilterArray, {
        key: filterObject.groupKey,
      });
      if (newGroupIndex !== -1) {
        setGroupIndex(newGroupIndex);
      }
    } else {
      setGroupIndex(0);
    }
    setExecutorFilterArray(executorfilterArray);
    if (filterObject.executorKey) {
      let newExecutorIndex = _.findIndex(executorfilterArray, {
        key: filterObject.executorKey,
      });

      if (newExecutorIndex !== -1) {
        setExecutorIndex(newExecutorIndex);
      }
    } else {
      setExecutorIndex(0);
    }
    setCreatorFilterArray(creatorFilterArray);
    if (filterObject.creatorKey) {
      let newCreatorIndex = _.findIndex(creatorFilterArray, {
        key: filterObject.creatorKey,
      });
      if (newCreatorIndex !== -1) {
        setCreatorIndex(newCreatorIndex);
      }
    } else {
      setCreatorIndex(0);
    }
    // this.$set(this.filterObj, "type", this.stateStr);
    // this.$emit("update:taskObj", this.filterObj);
  }, []);
  useEffect(() => {
    // 用户已登录
    if (headerIndex !== 3 && workingTaskArray) {
      getData(workingTaskArray, theme.filterObject);
    }
  }, [workingTaskArray, headerIndex, getData, theme.filterObject]);
  useEffect(() => {
    // 用户已登录
    if (headerIndex === 3 && taskArray && filterObject) {
      getData(taskArray, filterObject);
    }
  }, [taskArray, headerIndex, groupKey, getData, filterObject]);

  const changeFilter = async (type: string, filterItem: any, index: number) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    let creatorFilterArray: any = [
      {
        name: "全部",
        key: null,
        avatar: allSvg,
      },
    ];
    let executorfilterArray: any = [
      {
        name: "全部",
        key: null,
        avatar: allSvg,
      },
    ];
    let arr = [];
    if (headerIndex === 3) {
      arr = _.cloneDeep(taskArray);
    } else {
      arr = _.cloneDeep(_.flatten(workingTaskArray));
    }
    switch (type) {
      case "groupKey":
        setGroupIndex(index);
        setGroupFilterVisible(false);
        newFilterObject.groupKey = filterItem.key;
        newFilterObject.groupLogo = filterItem.avatar;
        newFilterObject.groupName = filterItem.name;
        break;
      case "creatorKey":
        setCreatorIndex(index);
        setCreatorFilterVisible(false);
        newFilterObject.creatorKey = filterItem.key;
        newFilterObject.creatorAvatar = filterItem.avatar;
        newFilterObject.creatorName = filterItem.name;
        break;
      case "executorKey":
        setExecutorIndex(index);
        setExecutorFilterVisible(false);
        newFilterObject.executorKey = filterItem.key;
        newFilterObject.executorAvatar = filterItem.avatar;
        newFilterObject.executorName = filterItem.name;
    }
    if (type === "groupKey") {
      if (filterItem.key) {
        arr.forEach((item: any) => {
          if (item.groupKey === filterItem.key) {
            let creatorIndex = _.findIndex(creatorFilterArray, {
              key: item.creatorKey,
            });
            if (creatorIndex === -1 && item.creatorKey) {
              creatorFilterArray.push({
                key: item.creatorKey,
                name: item.creatorName,
                avatar: item.creatorAvatar,
              });
            }
            // this.creatorFindIndex = this._.findIndex(this.creatorArr, {
            //   key: this.user._key,
            // });
            // if (this.creatorFindIndex !== -1) {
            //   let creatorFindItem = this._.cloneDeep(
            //     this.creatorArr[this.creatorFindIndex]
            //   );
            //   this.creatorArr.splice(this.creatorFindIndex, 1);
            //   this.creatorArr.splice(1, 0, creatorFindItem);
            // }
            let executorIndex = _.findIndex(executorfilterArray, {
              key: item.executorKey,
            });
            if (executorIndex === -1 && item.executorKey) {
              executorfilterArray.push({
                key: item.executorKey,
                name: item.executorName,
                avatar: item.executorAvatar,
              });
            }
            // this.executorFindIndex = this._.findIndex(this.executorArr, {
            //   key: this.user._key,
            // });
            // if (this.executorFindIndex !== -1) {
            //   let executorFindItem = this._.cloneDeep(
            //     this.executorArr[this.executorFindIndex]
            //   );
            //   this.executorArr.splice(this.executorFindIndex, 1);
            //   this.executorArr.splice(1, 0, executorFindItem);
            // }
          }
        });
        setExecutorFilterArray(executorfilterArray);
        setCreatorFilterArray(creatorFilterArray);
      }
      //   else {
      //     getData(arr);
      //   }
    }
    if (headerIndex === 3) {
      let res: any = await api.member.setConfig(groupMemberItem._key, {
        ...groupMemberItem.config,
        ...newFilterObject,
      });
      if (res.msg === "OK") {
        console.log("设置成功");
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    } else {
      let newTheme = _.cloneDeep(theme);
      newTheme.filterObject = newFilterObject;
      dispatch(setTheme(newTheme));
    }
    dispatch(setFilterObject(newFilterObject));
    setGroupFilterVisible(false);
    setExecutorFilterVisible(false);
    setCreatorFilterVisible(false);
  };
  return (
    <React.Fragment>
      {headerIndex !== 3 ? (
        <Filter
          title={"项目"}
          visible={groupFilterVisible}
          filterType={"groupKey"}
          filterArray={groupFilterArray}
          filterItemStyle={{
            width: "228px",
            minHeight: "300px",
            top: "38px",
          }}
          filterStyle={{ padding: "0px 18px", marginTop: "10px" }}
          filterIndex={groupIndex}
          onOpen={() => {
            setGroupFilterVisible(true);
          }}
          onClose={() => {
            setGroupFilterVisible(false);
          }}
          onClick={changeFilter}
          filterItem={["name", "avatar", "key"]}
          defaultPngType={1}
        />
      ) : null}
      <Filter
        title={"执行人"}
        visible={executorfilterVisible}
        filterType={"executorKey"}
        filterArray={executorfilterArray}
        filterItemStyle={{
          width: "228px",
          minHeight: "300px",
          top: "38px",
        }}
        filterStyle={{ padding: "0px 18px" }}
        filterIndex={executorIndex}
        onOpen={() => {
          setExecutorFilterVisible(true);
        }}
        onClose={() => {
          setExecutorFilterVisible(false);
        }}
        onClick={changeFilter}
        filterItem={["name", "avatar", "key"]}
        defaultPngType={0}
      />
      <Filter
        title={"创建人"}
        visible={creatorFilterVisible}
        filterType={"creatorKey"}
        filterArray={creatorFilterArray}
        filterItemStyle={{
          width: "228px",
          minHeight: "300px",
          top: "38px",
        }}
        filterStyle={{ padding: "0px 18px" }}
        filterIndex={creatorIndex}
        onOpen={() => {
          setCreatorFilterVisible(true);
        }}
        onClose={() => {
          setCreatorFilterVisible(false);
        }}
        onClick={changeFilter}
        filterItem={["name", "avatar", "key"]}
        defaultPngType={0}
      />
    </React.Fragment>
  );
};
export default HeaderFilter;
