import { actionTypes } from "../actions/taskActions";
import _ from "lodash";
import moment from "moment";
export interface TaskType {
  labelArray: any;
  taskArray: any;
  teamTaskArray: any;
  projectTaskArray: any;
  selfTaskArray: any;
  workingGroupArray: any;
  workingTaskArray: any;
  taskKey: any;
  chooseKey: any;
  filterObject: any;
  taskInfoVisible: any;
  calendarList: any;
  taskActionArray: any;
  taskAction: any;
  taskInfo: any;
  deleteState: boolean;
  deleteKey: string;
  showComment: boolean;
}

const defaultState: TaskType = {
  labelArray: null,
  taskArray: null,
  teamTaskArray: null,
  projectTaskArray: null,
  selfTaskArray: null,
  workingGroupArray: null,
  workingTaskArray: null,
  taskKey: "",
  chooseKey: "",
  filterObject: null,
  taskInfoVisible: false,
  calendarList: null,
  taskActionArray: [],
  taskAction: {},
  taskInfo: null,
  deleteState: false,
  showComment: false,
  deleteKey: "",
};

export const task = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_GROUP_TASK_SUCCESS:
      let labelArray: any = [];
      let taskArray: any = [];
      // state.cardArray = payload.result.cardArray;
      taskArray = action.data.cardArray.map((item: any) => {
        item.show = true;
        return item;
      });
      taskArray.sort((a: any, b: any) => b.updateTime - a.updateTime);
      action.data.labelArray.forEach((item: any) => {
        if (!item.cardLabelName) {
          item.cardLabelName = "ToDo";
        }
        if (item._key) {
          labelArray.push(item);
        } else {
          labelArray.unshift(item);
        }
      });
      return {
        ...state,
        labelArray: labelArray,
        taskArray: taskArray,
      };
    case actionTypes.CHANGE_LABELARRAY:
      let newLabelArray = _.cloneDeep(action.labelArray);
      return {
        ...state,
        labelArray: newLabelArray,
      };
    case actionTypes.GET_TEAM_TASK_SUCCESS:
      return {
        ...state,
        teamTaskArray: action.data,
      };
    case actionTypes.GET_PROJECT_TASK_SUCCESS:
      return {
        ...state,
        projectTaskArray: action.data,
      };
    case actionTypes.GET_SELF_TASK_SUCCESS:
      return {
        ...state,
        selfTaskArray: action.data.cardArray,
      };
    case actionTypes.GET_WORKING_TABLE_TASK_SUCCESS:
      let cardIndex = _.findIndex(action.data.groupArray, {
        _key: localStorage.getItem("mainGroupKey"),
      });
      if (cardIndex !== -1) {
        action.data.groupArray[cardIndex].groupName = "个人事务";
        if (action.data.groupArray.length > 0) {
          action.data.groupArray.unshift(
            action.data.groupArray.splice(cardIndex, 1)[0]
          );
          action.data.cardArray.unshift(
            action.data.cardArray.splice(cardIndex, 1)[0]
          );
        }
      }
      action.data.cardArray = action.data.cardArray.map((item) => {
        item = item.filter((newItem) => {
          return !newItem.isKR && !newItem.isO;
        });
        return item;
      });
      return {
        ...state,
        workingGroupArray: action.data.groupArray,
        workingTaskArray: action.data.cardArray,
      };
    case actionTypes.SET_TASK_KEY:
      return {
        ...state,
        taskKey: action.taskKey,
      };
    case actionTypes.SET_CHOOSE_KEY:
      return {
        ...state,
        chooseKey: action.chooseKey,
      };
    case actionTypes.SET_TASK_INFO:
      return {
        ...state,
        taskInfo: action.taskInfo,
        chooseKey:
          action.taskInfo && action.taskInfo._key ? action.taskInfo._key : "",
      };
    case actionTypes.EDIT_TASK_SUCCESS:
      let taskInfo = _.cloneDeep(action.data[0]);
      let headerIndex = action.data[1];
      if (state.selfTaskArray) {
        state.selfTaskArray = state.selfTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            if (taskItem._key === taskInfo.key) {
              for (let key in taskInfo) {
                if (key !== "_key") {
                  taskItem[key] = _.cloneDeep(taskInfo[key]);
                }
              }
            }
            return taskItem;
          }
        );
      }
      if ((headerIndex === 1 || headerIndex === 2) && state.workingTaskArray) {
        state.workingTaskArray = state.workingTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            taskItem = taskItem.map((item: any, index: number) => {
              if (item._key === taskInfo.key) {
                for (let key in taskInfo) {
                  if (key !== "_key") {
                    item[key] = _.cloneDeep(taskInfo[key]);
                  }
                }
              }
              return item;
            });
            return taskItem;
          }
        );
      } else if (headerIndex === 3 && state.taskArray) {
        state.taskArray = state.taskArray.map(
          (taskItem: any, taskIndex: number) => {
            if (taskItem._key === taskInfo.key) {
              for (let key in taskInfo) {
                if (key !== "_key") {
                  taskItem[key] = _.cloneDeep(taskInfo[key]);
                }
              }
            }
            return taskItem;
          }
        );
      }
      return {
        ...state,
      };
    // case actionTypes.ADD_WORKING_TABLE_TASK_SUCCESS:
    // return {
    //   ...state,
    //   // taskKey: action.taskKey
    // };
    case actionTypes.SET_FILTER_OBJECT:
      let filterObject: any = {};
      if (state.filterObject) {
        filterObject = _.cloneDeep(state.filterObject);
      } else {
        filterObject = {
          groupKey: null,
          groupName: "",
          groupLogo: "",
          creatorKey: null,
          creatorAvatar: "",
          creatorName: "",
          executorKey: null,
          executorAvatar: "",
          executorName: "",
          filterType: ["过期", "今天", "未来", "未完成", "已完成"],
          headerIndex: 0,
          fileDay: "7",
        };
      }
      for (let key in action.filterObj) {
        filterObject[key] = action.filterObj[key];
      }
      if (!filterObject.headerIndex) {
        filterObject.headerIndex = 0;
      }
      if (!filterObject.fileDay) {
        filterObject.fileDay = "7";
      }
      return {
        ...state,
        filterObject: filterObject,
      };
    case actionTypes.CHANGE_TASKINFO_VISIBLE:
      return {
        ...state,
        taskInfoVisible: action.taskInfoVisible,
        showComment: action.showComment,
      };
    case actionTypes.SET_TASK_ACTION:
      return {
        ...state,
        taskAction: action.taskAction,
      };
    case actionTypes.GET_CALENDAR_LIST_SUCCESS:
      let taskActionArray: any = [];
      action.data.forEach((item: any) => {
        if (
          item.taskEndDate >= moment().startOf("day").valueOf() &&
          item.taskEndDate <= moment().endOf("day").valueOf() &&
          item.taskEndDate >= moment().valueOf()
        ) {
          taskActionArray.push(item);
        }
      });
      return {
        ...state,
        calendarList: action.data,
        taskActionArray: _.cloneDeep(taskActionArray),
      };
    case actionTypes.SET_NEW_TASK_ARRAY:
      let obj: any = {};
      obj = _.cloneDeep(state);
      obj[action.taskArrayType] = _.cloneDeep(action.taskArray);
      return {
        ...obj,
      };
    case actionTypes.CLEAR_TASK:
      switch (action.clearType) {
        case 0:
          state.labelArray = null;
          state.taskArray = null;
          state.workingGroupArray = null;
          state.workingTaskArray = null;
          break;
        case 1:
          state.labelArray = null;
          state.taskArray = null;
          state.teamTaskArray = null;
          state.projectTaskArray = null;
          state.selfTaskArray = null;
          break;
        case 3:
          state.teamTaskArray = null;
          state.projectTaskArray = null;
          state.selfTaskArray = null;
          state.workingGroupArray = null;
          state.workingTaskArray = null;
          break;
        case 4:
          state.labelArray = null;
          state.taskArray = null;
          state.teamTaskArray = null;
          state.projectTaskArray = null;
          state.selfTaskArray = null;
          state.workingGroupArray = null;
          state.workingTaskArray = null;
          break;
      }
      return {
        ...state,
      };
    case actionTypes.CHANGE_DELETE_STATE:
      return {
        ...state,
        deleteState: action.deleteState,
      };
    case actionTypes.CHANGE_DELETE_KEY:
      return {
        ...state,
        deleteKey: action.deleteKey,
      };
    default:
      return state;
  }
};
