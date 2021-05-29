import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface ModelProps {
 
}

const Model: React.FC<ModelProps> = (props) => {
  const { } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div></div>
  );
};
Model.defaultProps = {
};
export default Model;