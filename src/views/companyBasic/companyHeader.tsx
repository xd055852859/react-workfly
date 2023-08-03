import React from 'react';
import './companyHeader.css';
import { useTypedSelector } from '../../redux/reducer/RootState';

import Avatar from '../../components/common/avatar';
// import calendarHomePng from '../../assets/img/calendarHome.png';
interface CompanyHeaderProps {
  videoState: boolean
}

const CompanyHeader: React.FC<CompanyHeaderProps> = (props) => {
  const { videoState } = props
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  return (
    <div className="companyHeader">
      {videoState ?
        <React.Fragment>
          {/* <img src={calendarHomePng} alt="" className="calendarHeader-logo" /> */}
          <div style={{ marginRight: '20px',fontSize:'16px' }}>视频引导</div>
        </React.Fragment> :
        <React.Fragment>
          <div className="companyHeader-img">
            <Avatar
              avatar={
                groupInfo?.groupLogo
              }
              name={groupInfo?.groupName}
              type={"group"}
              index={0}
            />
          </div>
          <div className="companyHeader-name">
            {groupInfo?.groupName ? groupInfo.groupName : ''}
          </div>
        </React.Fragment>}
    </div>
  );
};
CompanyHeader.defaultProps = {};
export default CompanyHeader;
