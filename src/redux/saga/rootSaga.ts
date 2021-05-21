import { all } from 'redux-saga/effects';
import taskSaga from './taskSaga';
import memberSaga from './memberSaga';
import authSaga from './authSaga';
import groupSaga from './groupSaga';
function* rootSaga() {
  yield all([...taskSaga, ...memberSaga,...authSaga,...groupSaga]);
}

export default rootSaga;
