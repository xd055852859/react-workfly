import {call, put, takeLatest} from 'redux-saga/effects';
import {actionTypes, getGroupSuccess, getGroupInfoSuccess,changeGroupInfoSuccess} from '../actions/groupActions';
import {Failed} from '../actions/commonActions';
import api from '../../services/api';

function * getGroup(action : any) {
  try {
    const res = yield call(api.group.getGroup, action.listType,action.simple,action.sortType);
    if (res.msg === 'OK') {
      yield put(getGroupSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function * getGroupInfo(action : any) {
  try {
    const res = yield call(api.group.getGroupInfo, action.key);
    if (res.msg === 'OK') {
      yield put(getGroupInfoSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function * changeGroupInfo(action : any) {
  try {
    const res = yield call(api.group.changeGroupInfo, action.key,action.patchData);
    if (res.msg === 'OK') {
      yield put(changeGroupInfoSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
const groupSaga = [
  takeLatest(actionTypes.GET_GROUP, getGroup),
  takeLatest(actionTypes.GET_GROUP_INFO, getGroupInfo),
  takeLatest(actionTypes.CHANGE_GROUP_INFO, changeGroupInfo)
];

export default groupSaga;
