export const actionTypes = {
  GET_GROUP: 'GET_GROUP',
  GET_GROUP_SUCCESS: 'GET_GROUP_SUCCESS',
  SET_GROUP_KEY: 'SET_GROUP_KEY',
  GET_GROUP_INFO: 'GET_GROUP_INFO',
  GET_GROUP_INFO_SUCCESS: 'GET_GROUP_INFO_SUCCESS',
  CHANGE_GROUP_INFO: 'CHANGE_GROUP_INFO',
  CHANGE_GROUP_INFO_SUCCESS: 'CHANGE_GROUP_INFO_SUCCESS',
  CHANGE_START_ID: 'CHANGE_START_ID',
  CLEAR_GROUP:'CLEAR_GROUP'
};

export function getGroup(
  listType: number,
  simple?: number | null,
  sortType?: number
) {
  return {
    type: actionTypes.GET_GROUP,
    listType: listType,
    simple: simple,
    sortType: sortType,
  };
}
export function getGroupSuccess(data: any) {
  return { type: actionTypes.GET_GROUP_SUCCESS, data };
}
export function setGroupKey(groupKey: string | number) {
  return { type: actionTypes.SET_GROUP_KEY, groupKey };
}
export function getGroupInfo(key: string | number) {
  return { type: actionTypes.GET_GROUP_INFO, key };
}
export function getGroupInfoSuccess(data: any) {
  return { type: actionTypes.GET_GROUP_INFO_SUCCESS, data };
}
export function changeGroupInfo(key: string | number, patchData: any) {
  return { type: actionTypes.CHANGE_GROUP_INFO, key, patchData };
}
export function changeGroupInfoSuccess(data: any) {
  return { type: actionTypes.CHANGE_GROUP_INFO_SUCCESS, data };
}
export function changeStartId(startId: string) {
  return { type: actionTypes.CHANGE_START_ID, startId };
}
export function clearGroup() {
  return { type: actionTypes.CLEAR_GROUP };
}