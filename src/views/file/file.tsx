import React from 'react';
import './file.css';

import FileInfo from '../../components/fileInfo/fileInfo';

interface FileProps {
 
}

const File: React.FC<FileProps> = () => {
  return (
    <div className="file"><FileInfo type={'single'}/></div>
  );
};
File.defaultProps = {
};
export default File;