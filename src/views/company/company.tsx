import React from 'react';
import './company.css';
import { useHistory } from 'react-router-dom';
import Loadable from 'react-loadable';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { Route, Switch } from 'react-router-dom';
import { Menu, Tooltip, Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { useMount } from '../../hook/common';

import companyIcon1 from '../../assets/svg/companyIcon1.svg';
import companyIcon2 from '../../assets/svg/companyIcon2.svg';
import companyIcon3 from '../../assets/svg/companyIcon3.svg';
import companyRole1 from '../../assets/svg/companyRole1.svg';
import companyRole2 from '../../assets/svg/companyRole2.svg';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

const { SubMenu } = Menu;
const CompanyPerson = Loadable({
  loader: () => import('./companyPerson'),
  loading: () => null,
});
const CompanyDepartment = Loadable({
  loader: () => import('./companyDepartment'),
  loading: () => null,
});
const CompanyGroup = Loadable({
  loader: () => import('./companyGroup'),
  loading: () => null,
});
const CompanyAccount = Loadable({
  loader: () => import('./companyAccount'),
  loading: () => null,
});
interface CompanyProps {}

const Company: React.FC<CompanyProps> = () => {
  const history = useHistory();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  useMount(()=>{
    history.push('/home/company/companyPerson');
  })
  const handleClick = (url: string) => {
    history.push(url);
  };
  return (
    <div className="company">
      <div className="company-menu">
        <div className="company-menu-logo" style={{ borderRadius: '10px' }}>
          <img
            src={
              groupInfo && groupInfo.groupLogo
                ? groupInfo.groupLogo
                : defaultGroupPng
            }
            alt=""
          />
        </div>
        <div className="company-menu-name toLong">
          {groupInfo && groupInfo.groupName}
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item
            key="1"
            icon={
              <img
                src={companyIcon1}
                alt=""
                style={{ width: '15px', height: '17px', marginRight: '10px' }}
              />
            }
            onClick={() => {
              handleClick('/home/company/companyPerson');
            }}
          >
            人员管理
          </Menu.Item>
          <SubMenu
            key="sub1"
            icon={
              <img
                src={companyIcon2}
                alt=""
                style={{ width: '20px', height: '14px', marginRight: '5px' }}
              />
            }
            title="组织管理"
            onTitleClick={() => {
              handleClick('/home/company/companyDepartment/1');
            }}
          >
            <Menu.Item
              key="2"
              onClick={() => {
                handleClick('/home/company/companyDepartment/2');
              }}
            >
              组织成员
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => {
                handleClick('/home/company/companyDepartment/3');
              }}
            >
              组织项目
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            icon={
              <img
                src={companyIcon3}
                alt=""
                style={{ width: '16px', height: '16px', marginRight: '9px' }}
              />
            }
            title="授权管理"
            onTitleClick={() => {
              handleClick('/home/company/companyGroup/7');
            }}
          >
            <Menu.Item
              key="4"
              icon={
                <img
                  src={companyRole1}
                  alt=""
                  style={{ width: '16px', height: '16px', marginRight: '9px' }}
                />
              }
              onClick={() => {
                handleClick('/home/company/companyGroup/7');
              }}
            >
              人员授权
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={
                <img
                  src={companyRole2}
                  alt=""
                  style={{ width: '16px', height: '16px', marginRight: '9px' }}
                />
              }
              onClick={() => {
                handleClick('/home/company/companyGroup/8');
              }}
            >
              项目授权
            </Menu.Item>
          </SubMenu>
          {/* <Menu.Item
            key="6"
            icon={
              <img
                src={companyIcon4}
                alt=""
                style={{ width: '15px', height: '17px', marginRight: '10px' }}
              />
            }
            onClick={() => {
              handleClick('/home/company/companyAccount');
            }}
          >
            企业账户
          </Menu.Item> */}
        </Menu>
        <div
          className="company-menu-logout"
          onClick={() => {
            history.push('/home/basic/groupTable');
          }}
        >
          <Tooltip title="退出">
            <Button shape="circle" icon={<PoweroffOutlined />} size="large" />
          </Tooltip>
        </div>
      </div>
      <div className="company-container">
        <Switch>
          <Route
            exact
            path="/home/company/companyPerson"
            component={CompanyPerson}
          />
          <Route
            exact
            path="/home/company/companyDepartment/:id"
            component={CompanyDepartment}
          />
          <Route
            exact
            path="/home/company/companyGroup/:id"
            component={CompanyGroup}
          />
          <Route
            exact
            path="/home/company/companyAccount"
            component={CompanyAccount}
          />
        </Switch>
      </div>
    </div>
  );
};
Company.defaultProps = {};
export default Company;
