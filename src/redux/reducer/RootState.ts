import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { AuthType } from './auth';
import { Common } from './common';
import { TaskType } from './task';
import { MemberType } from './member';
import { GroupType } from './group';

interface RootState {
  auth: AuthType;
  common: Common;
  task: TaskType;
  member: MemberType;
  group: GroupType;
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
