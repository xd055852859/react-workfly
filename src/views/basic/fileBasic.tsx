import React from 'react';
// import './userCenter.css';
import FileInfo from "../../components/fileInfo/fileInfo";
interface FileBasicProps {

}

const FileBasic: React.FC<FileBasicProps> = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '68px' }}></div>
            <div style={{ backgroundColor: '#fff', height: 'calc(100% - 68px)', width: '100%' }}>
                <FileInfo type={'侧边文档'} />
            </div>
        </div>
    );
};
FileBasic.defaultProps = {
};
export default FileBasic;