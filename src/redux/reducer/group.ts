import { actionTypes } from '../actions/groupActions';

export interface GroupType {
  groupArray: any;
  groupKey: string;
  groupInfo: any;
  groupRole: any;
  startId: any;
}

const defaultState: GroupType = {
  groupArray: null,
  // groupKey: '1283921566',
  groupKey: '',
  groupInfo: null,
  groupRole: null,
  startId: null,
};

export const group = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_GROUP_SUCCESS:
      let groupArray = action.data.filter((item: any, index: number) => {
        if (item.groupLogo && item.groupLogo.indexOf('https') === -1) {
          item.groupLogo = item.groupLogo.replace('http', 'https');
        }
        return item.groupName.indexOf('主项目') === -1;
      });
      return {
        ...state,
        groupArray: groupArray,
      };
    case actionTypes.SET_GROUP_KEY:
      localStorage.setItem('groupKey', action.groupKey);
      return {
        ...state,
        groupKey: action.groupKey,
      };
    case actionTypes.GET_GROUP_INFO_SUCCESS:
      return {
        ...state,
        groupInfo: action.data,
        groupRole: action.data.role,
      };
    case actionTypes.CHANGE_GROUP_INFO_SUCCESS:
      return {
        ...state,
        groupInfo: action.data,
      };
    case actionTypes.CHANGE_START_ID:
      return {
        ...state,
        startId: action.startId,
      };
    case actionTypes.CLEAR_GROUP:
      state.groupInfo = null;
      return {
        ...state,
      };
    default:
      return state;
  }
};
