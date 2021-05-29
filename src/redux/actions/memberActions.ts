export const actionTypes = {
  GET_MEMBER: 'GET_MEMBER',
  GET_MEMBER_SUCCESS: 'GET_MEMBER_SUCCESS',
  SET_MEMBER_HEADERINDEX: 'SET_MEMBER_HEADERINDEX',
  GET_GROUP_MEMBER: 'GET_GROUP_MEMBER',
  GET_GROUP_MEMBER_SUCCESS: 'GET_GROUP_MEMBER_SUCCESS',
  CHANGE_GROUP_MEMBER_ITEM: 'CHANGE_GROUP_MEMBER_ITEM',
  CLEAR_MEMBER: 'CLEAR_MEMBER',
  GET_COMPANY_MEMBER: 'GET_COMPANY_MEMBER',
  GET_COMPANY_MEMBER_SUCCESS: 'GET_COMPANY_MEMBER_SUCCESS',
  GET_COMPANY_ITEM: 'GET_COMPANY_ITEM',
  GET_COMPANY_ITEM_SUCCESS: 'GET_COMPANY_ITEM_SUCCESS',
  CHANGE_MEMBER_STARTID: 'CHANGE_MEMBER_STARTID',
  CHANGE_COMPANY_ITEM:'CHANGE_COMPANY_ITEM'
};

export function getMember(
  groupId: string | null,
  sortType?: number,
  simple?: number
) {
  return {
    type: actionTypes.GET_MEMBER,
    groupId: groupId,
    simple: simple,
    sortType: sortType,
  };
}
export function getMemberSuccess(data: any) {
  return { type: actionTypes.GET_MEMBER_SUCCESS, data };
}
export function setHeaderIndex(memberHeaderIndex: number) {
  return { type: actionTypes.SET_MEMBER_HEADERINDEX, memberHeaderIndex };
}
export function getGroupMember(groupId: string | null, sortType?: number) {
  return {
    type: actionTypes.GET_GROUP_MEMBER,
    groupId: groupId,
    sortType: sortType,
  };
}
export function changeGroupMemberItem(config: any) {
  return {
    type: actionTypes.GET_GROUP_MEMBER,
    config: config,
  };
}
export function getGroupMemberSuccess(data: any) {
  return { type: actionTypes.GET_GROUP_MEMBER_SUCCESS, data };
}
export function clearMember() {
  return { type: actionTypes.CLEAR_MEMBER };
}
export function getCompanyMember(groupId: string | null, sortType?: number) {
  return {
    type: actionTypes.GET_COMPANY_MEMBER,
    groupId: groupId,
    sortType: sortType,
  };
}
export function getCompanyMemberSuccess(data: any) {
  return { type: actionTypes.GET_COMPANY_MEMBER_SUCCESS, data };
}
export function getCompanyItem(groupKey: string) {
  return {
    type: actionTypes.GET_COMPANY_ITEM,
    groupKey: groupKey,
  };
}
export function getCompanyItemSuccess(data: any) {
  return { type: actionTypes.GET_COMPANY_ITEM_SUCCESS, data };
}
export function changeCompanyItem(companyItem: any) {
  return { type: actionTypes.CHANGE_COMPANY_ITEM, companyItem };
}
