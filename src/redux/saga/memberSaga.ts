import { call, put, takeLatest } from "redux-saga/effects";
import {
  actionTypes,
  getMemberSuccess,
  getGroupMemberSuccess,
  getCompanyMemberSuccess,
  getCompanyItemSuccess,
  getEnterpriseMemberSuccess,
} from "../actions/memberActions";
import { Failed } from "../actions/commonActions";
import { changeStartId } from "../actions/groupActions";
import _ from "lodash";
import api from "../../services/api";

function* getMember(action: any) {
  try {
    const res = yield call(
      api.member.getMember,
      action.groupId,
      action.sortType,
      action.simple
    );
    if (res.msg === "OK") {
      yield put(getMemberSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getGroupMember(action: any) {
  try {
    const res = yield call(
      api.member.getMember,
      action.groupId,
      action.sortType
    );
    if (res.msg === "OK") {
      yield put(getGroupMemberSuccess(res.result));
      let userIndex = _.findIndex(res.result, {
        userId: localStorage.getItem("userKey"),
      });
      let groupMemberItem = res.result[userIndex];
      console.log(groupMemberItem);
      console.log(groupMemberItem.config);
      if (groupMemberItem?.config?.treeStartId) {
        yield put(changeStartId(groupMemberItem.config.treeStartId));
      } else {
        yield put(changeStartId(""));
      }
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getCompanyMember(action: any) {
  try {
    const res = yield call(
      api.member.getMember,
      action.groupId,
      action.sortType
    );
    if (res.msg === "OK") {
      yield put(getCompanyMemberSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getCompanyItem(action: any) {
  try {
    const res = yield call(api.member.getConfig, action.groupKey);
    if (res.msg === "OK") {
      yield put(getCompanyItemSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getEnterpriseMember(action: any) {
  try {
    const res = yield call(
      api.company.getCompanyList,
      action.typeGroupOrOrg,
      action.enterpriseGroupOrOrganizationKey,
      action.curPage,
      action.perPage,
      action.searchCondition,
      action.batchNumber,
      action.currOrgKey,
      action.isEqualWith,
      action.sonGroupKey
    );
    if (res.msg === "OK") {
      yield put(getEnterpriseMemberSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
const memberSaga = [
  takeLatest(actionTypes.GET_MEMBER, getMember),
  takeLatest(actionTypes.GET_GROUP_MEMBER, getGroupMember),
  takeLatest(actionTypes.GET_COMPANY_MEMBER, getCompanyMember),
  takeLatest(actionTypes.GET_COMPANY_ITEM, getCompanyItem),
  takeLatest(actionTypes.GET_ENTERPRISE_MEMBER, getEnterpriseMember),
];
export default memberSaga;
