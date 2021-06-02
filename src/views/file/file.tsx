import React from 'react';
import './file.css';

import FileInfo from '../../components/fileInfo/fileInfo';
import { useMount } from '../../hook/common';

interface FileProps {
 
}
const File: React.FC<FileProps> = () => {
  useMount(()=>{
    
  })
  return (
    <div className="file"><FileInfo type={'single'}/></div>
  );
};
File.defaultProps = {
};
export default File;