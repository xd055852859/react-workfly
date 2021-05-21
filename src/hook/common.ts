import { useEffect, useRef } from "react";
import _ from "lodash";
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //eslint-disable-next-line
  }, []);
};

//对象某个参数变化才会更新
export const useUpdate = (data: any, prevData: any, paramsArray: string[]) => {
  const updateRef = useRef<boolean | number>(false);
  paramsArray.forEach((item: string, index: number) => {
    if (data[item] !== prevData[item]) {
      updateRef.current = new Date().getTime();
    }
  });
  return updateRef.current;
};

//保存上次数据
export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = _.cloneDeep(value);
  }, [value]);
  return ref.current;
};

//
