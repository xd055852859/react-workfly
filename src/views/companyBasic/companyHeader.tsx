import React from 'react';
import './companyHeader.css';
import { useTypedSelector } from '../../redux/reducer/RootState';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
interface CompanyHeaderProps {}

const CompanyHeader: React.FC<CompanyHeaderProps> = (props) => {
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  return (
    <div className="companyHeader">
      <div className="companyHeader-logo">
        <img
          src={groupInfo?.groupLogo ? groupInfo.groupLogo : defaultGroupPng}
          alt=""
        />
      </div>
      <div className="companyHeader-name">
        {groupInfo?.groupName ? groupInfo.groupName : ''}
      </div>
    </div>
  );
};
CompanyHeader.defaultProps = {};
export default CompanyHeader;
