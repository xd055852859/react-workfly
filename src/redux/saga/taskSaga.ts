import { call, put, takeLatest } from 'redux-saga/effects';
import {
  actionTypes,
  getGroupTaskSuccess,
  getTeamTaskSuccess,
  getProjectTaskSuccess,
  getSelfTaskSuccess,
  getWorkingTableSuccess,
  editTaskSuccess,
  // addWorkingTableTaskSuccess,
  getCalendarListSuccess,
} from '../actions/taskActions';
import { Failed, Loading } from '../actions/commonActions';
import api from '../../services/api';

function* getGroupTask(action: any) {
  try {
    Loading(true);
    const res = yield call(
      api.task.getTaskListNew,
      action.typeBoard1,
      action.targetUGKey,
      action.finishPercentArray,
      action.fileDay
      // action.fileDay,
    );
    if (res.msg === 'OK') {
      yield Loading(false);
      yield put(getGroupTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getTeamTask(action: any) {
  try {
    const res = yield call(
      api.task.getTeamTask,
      action.finishPercentArray,
      action.groupKey,
      action.startTime,
      action.endTime
    );
    if (res.msg === 'OK') {
      yield put(getTeamTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getProjectTask(action: any) {
  try {
    const res = yield call(api.task.getProjectTask, action.finishPercentArray);
    if (res.msg === 'OK') {
      yield put(getProjectTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

function* getSelfTask(action: any) {
  try {
    const res = yield call(
      api.task.getTaskList,
      action.typeBoard1,
      action.targetUGKey,
      action.finishPercentArray,
      action.fileDay,
      action.endTime,
      action.isAddTodayFinish
    );
    if (res.msg === 'OK') {
      yield put(getSelfTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

function* getWorkingTableTask(action: any) {
  try {
    const res = yield call(
      api.task.getGroupTask,
      action.type1,
      action.targetUKey,
      action.type2,
      action.finishPercentArray,
      action.fileDay
    );
    if (res.msg === 'OK') {
      yield put(getWorkingTableSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* editTask(action: any) {
  try {
    const res = yield call(api.task.editTask, action.data);
    if (res.msg === 'OK') {
      yield put(editTaskSuccess([action.data, action.headerIndex]));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
// function* addWorkingTableTask(action: any) {
//   try {
//     const res = yield call(api.task.addTask, action.params);
//     if (res.msg === 'OK') {
//       yield put(addWorkingTableTaskSuccess(res.result));
//     } else {
//       yield put(Failed(res));
//     }
//   } catch (e) {
//     yield put(Failed(e));
//   }
// }
function* getCalendarList(action: any) {
  try {
    const res = yield call(
      api.task.getCalendarList,
      action.targetUKey,
      action.startTime,
      action.endTime
    );
    if (res.msg === 'OK') {
      yield put(getCalendarListSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

const taskSaga = [
  takeLatest(actionTypes.GET_GROUP_TASK, getGroupTask),
  takeLatest(actionTypes.GET_TEAM_TASK, getTeamTask),
  takeLatest(actionTypes.GET_PROJECT_TASK, getProjectTask),
  takeLatest(actionTypes.GET_SELF_TASK, getSelfTask),
  takeLatest(actionTypes.GET_WORKING_TABLE_TASK, getWorkingTableTask),
  takeLatest(actionTypes.EDIT_TASK, editTask),
  // takeLatest(actionTypes.ADD_WORKING_TABLE_TASK, addWorkingTableTask),
  takeLatest(actionTypes.GET_CALENDAR_LIST, getCalendarList),
];

export default taskSaga;
