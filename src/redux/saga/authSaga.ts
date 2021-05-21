import { call, put, takeLatest } from 'redux-saga/effects';
import {
  actionTypes,
  getUserInfoSuccess,
  getMainGroupKeySuccess,
  getTargetUserInfoSuccess,
  getThemeSuccess,
  setThemeSuccess,
  getThemeBgSuccess,
  getUploadTokenSuccess,
} from '../actions/authActions';
import { Failed } from '../actions/commonActions';
import api from '../../services/api';

function* getUser(action: any) {
  try {
    const res = yield call(api.auth.getUserInfo, action.token);
    if (res.msg === 'OK') {
      yield put(getUserInfoSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getMainGroupKey(action: any) {
  try {
    const res = yield call(api.auth.getMainGroupKey);

    if (res.msg === 'OK') {
      yield put(getMainGroupKeySuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getTargetUserInfo(action: any) {
  try {
    const res = yield call(api.auth.getTargetUserInfo, action.targetUserKey);
    if (res.msg === 'OK') {
      yield put(getTargetUserInfoSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getTheme(action: any) {
  try {
    const res = yield call(api.auth.getWorkingConfigInfo);
    if (res.msg === 'OK') {
      yield put(getThemeSuccess(res));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getThemeBg(action: any) {
  try {
    const res = yield call(api.auth.getWallPapers, action.page);
    if (res.msg === 'OK') {
      yield put(getThemeBgSuccess({ res: res, page: action.page }));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

function* setTheme(action: any) {
  try {
    const res = yield call(api.auth.setWorkingConfigInfo, action.configInfo);
    if (res.msg === 'OK') {
      yield put(setThemeSuccess(res.result, action));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getUploadToken(action: any) {
  try {
    const res = yield call(api.auth.getUptoken);
    if (res.msg === 'OK') {
      yield put(getUploadTokenSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
const authSaga = [
  takeLatest(actionTypes.GET_USERINFO, getUser),
  takeLatest(actionTypes.GET_MAIN_GROUP_KEY, getMainGroupKey),
  takeLatest(actionTypes.GET_TARGET_USERINFO, getTargetUserInfo),
  takeLatest(actionTypes.GET_THEME, getTheme),
  takeLatest(actionTypes.GET_THEME_BG, getThemeBg),
  takeLatest(actionTypes.SET_THEME, setTheme),
  takeLatest(actionTypes.GET_UPLOAD_TOKEN, getUploadToken),
];
export default authSaga;
