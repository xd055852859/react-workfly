import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface CreateTasksProps {}

const CreateTasks: React.FC<CreateTasksProps> = (props) => {
  const {} = props;
  const [] = useState<number[]>([]);
  return (
    <div>
      <div></div>
    </div>
  );
};
CreateTasks.defaultProps = {};
export default CreateTasks;
