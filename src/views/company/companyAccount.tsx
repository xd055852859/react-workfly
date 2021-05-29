import React, { useRef } from 'react';
import './companyDepartment.css';
import './companyAccount.css';
import {Tabs } from 'antd';
const { TabPane } = Tabs;
interface CompanyAccountProps {}

// const columns = [
//   {
//     id: 'groupName',
//     label: '订单编号',
//     minWidth: 100,
//   },
//   {
//     id: 'department',
//     label: '充值时间',
//     minWidth: 100,
//   },
//   {
//     id: 'trueName',
//     label: '充值金额（¥）',
//     minWidth: 100,
//   },
//   {
//     id: 'member',
//     label: '充值账户',
//     minWidth: 100,
//   },
//   {
//     id: 'birthday',
//     label: '充值人',
//     minWidth: 100,
//   },
// ];
const CompanyAccount: React.FC<CompanyAccountProps> = () => {
  const [value, setValue] = React.useState<any>('');
  const departmentRef: React.RefObject<any> = useRef();
  const handleChange = (activeKey) => {
    setValue(activeKey);
  };

  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">企业账户</div>
      </div>
      <div
        className="company-info-container companyAccount"
        ref={departmentRef}
      >
        <div className="companyAccount-top">
          <div className="companyAccount-title">当前余额：1049</div>
          <div className="company-button companyAccount-button">充值</div>
        </div>
        <div className="companyAccount-bottom">
          <Tabs defaultActiveKey="1" activeKey={value} onChange={handleChange}>
            <TabPane tab="充值记录" key="1"></TabPane>
            <TabPane tab="消费记录" key="2"></TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
CompanyAccount.defaultProps = {};
export default CompanyAccount;
