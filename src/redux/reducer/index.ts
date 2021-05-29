import { combineReducers } from 'redux';
import { auth } from './auth';
import { common } from './common';
import { task } from './task';
import { member } from './member';
import { group } from './group';

export const rootReducer = combineReducers({
  auth: auth,
  common: common,
  task: task,
  member: member,
  group:group
});

export type RootState = ReturnType<typeof rootReducer>;
