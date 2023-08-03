import React, { useRef} from "react";
import "./company.css";
import { useHistory } from "react-router-dom";
import Loadable from "react-loadable";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Menu, Tooltip, Button } from "antd";
import { PoweroffOutlined, SettingOutlined } from "@ant-design/icons";
import { useMount } from "../../hook/common";

import api from "../../services/api";

import { setMessage } from "../../redux/actions/commonActions";
import {
  changeMainenterpriseGroup,
  changeEnterpriseGroupState,
} from "../../redux/actions/authActions";
import {
  getGroup,
  changeLocalGroupInfo,
} from "../../redux/actions/groupActions";

import companyIcon1 from "../../assets/svg/companyIcon1.svg";
import companyIcon2 from "../../assets/svg/companyIcon2.svg";
import companyIcon3 from "../../assets/svg/companyIcon3.svg";
import { useEffect } from "react";

import Dialog from "../../components/common/dialog";
import GroupConfig from "../tabs/groupConfig";
import CompanyOkr from "./companyOkr";
const { SubMenu } = Menu;
const CompanyPerson = Loadable({
  loader: () => import("./companyPerson"),
  loading: () => null,
});
const CompanyDepartment = Loadable({
  loader: () => import("./companyDepartment"),
  loading: () => null,
});
const CompanyGroup = Loadable({
  loader: () => import("./companyGroup"),
  loading: () => null,
});
const CompanyAccount = Loadable({
  loader: () => import("./companyAccount"),
  loading: () => null,
});
const CompanySubject = Loadable({
  loader: () => import("./companySubject"),
  loading: () => null,
});
interface CompanyProps {}

const Company: React.FC<CompanyProps> = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [addCompanyVisible, setAddCompanyVisible] = React.useState(false);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const childCreateRef = useRef<any>();
  useMount(() => {
    history.push("/home/company/companyPerson");
  });
  useEffect(() => {
    if (groupInfo) {
      document.title = groupInfo.groupName;
    }
  }, [groupInfo]);
  const handleClick = (url: string) => {
    history.push(url);
  };

  const saveGroupSet = (obj: any) => {
    // if (!isNaN(templateKey)) {
    //   obj.templateKey = templateKey;
    //   obj.isContainTask = taskCheck;
    // }
    setGroupObj(obj);
  };

  const updateGroup = async (groupObj) => {
    if (!groupObj.groupName || !groupObj.groupName.trim()) {
      dispatch(setMessage(true, "请输入企业名", "error"));
      return;
    }
    if (!groupObj.groupLogo || !groupObj.groupLogo.trim()) {
      dispatch(setMessage(true, "请选择企业图标", "error"));
      return;
    }
    let groupRes: any = await api.group.changeGroupInfo(groupKey, groupObj);
    if (groupRes.msg === "OK") {
      dispatch(changeLocalGroupInfo(groupRes.result));
      dispatch(getGroup(3));
      dispatch(setMessage(true, "修改企业属性成功", "success"));
      if (groupInfo.enterprise === 2) {
        dispatch(changeEnterpriseGroupState(true));
        if (mainEnterpriseGroup.mainEnterpriseGroupKey === groupInfo._key) {
          dispatch(
            changeMainenterpriseGroup(
              groupInfo._key,
              groupInfo.groupLogo,
              groupObj.groupName
            )
          );
        }
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  useEffect(() => {
    if (groupObj) {
      updateGroup(groupObj);
    }
    //eslint-disable-next-line
  }, [groupObj]);
  return (
    <div className="company">
      <div className="company-menu">
        <div className="company-menu-logo" style={{ borderRadius: "10px" }}>
          <img src={groupInfo?.groupLogo} alt="" />
        </div>
        <div className="company-menu-name toLong">
          {groupInfo && groupInfo.groupName}
          <Button
            ghost
            shape="circle"
            icon={<SettingOutlined />}
            onClick={(e: any) => {
              setAddCompanyVisible(true);
            }}
            style={{ border: "0px" }}
          />
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item
            key="1"
            icon={
              <img
                src={companyIcon1}
                alt=""
                style={{ width: "15px", height: "17px", marginRight: "10px" }}
              />
            }
            onClick={() => {
              handleClick("/home/company/companyPerson");
            }}
          >
            人员管理
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={
              <img
                src={companyIcon3}
                alt=""
                style={{ width: "15px", height: "17px", marginRight: "10px" }}
              />
            }
            onClick={() => {
              handleClick("/home/company/companySubject");
            }}
          >
            项目管理
          </Menu.Item>
          <SubMenu
            key="sub1"
            icon={
              <img
                src={companyIcon2}
                alt=""
                style={{ width: "20px", height: "14px", marginRight: "5px" }}
              />
            }
            title="组织管理"
            onTitleClick={() => {
              handleClick("/home/company/companyDepartment/1");
            }}
          >
            <Menu.Item
              key="2"
              onClick={() => {
                handleClick("/home/company/companyDepartment/2");
              }}
            >
              组织成员
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => {
                handleClick("/home/company/companyDepartment/3");
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
                style={{ width: "16px", height: "16px", marginRight: "9px" }}
              />
            }
            title="授权管理"
            onTitleClick={() => {
              handleClick("/home/company/companyGroup/7");
            }}
          >
            <Menu.Item
              key="4"
              // icon={
              //   <img
              //     src={companyRole1}
              //     alt=""
              //     style={{ width: '16px', height: '16px', marginRight: '9px' }}
              //   />
              // }
              onClick={() => {
                handleClick("/home/company/companyGroup/7");
              }}
            >
              人员授权
            </Menu.Item>
            <Menu.Item
              key="5"
              // icon={
              //   <img
              //     src={companyRole2}
              //     alt=""
              //     style={{ width: '16px', height: '16px', marginRight: '9px' }}
              //   />
              // }
              onClick={() => {
                handleClick("/home/company/companyGroup/8");
              }}
            >
              项目授权
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="7"
            icon={
              <img
                src={companyIcon3}
                alt=""
                style={{ width: '15px', height: '17px', marginRight: '10px' }}
              />
            }
            onClick={() => {
              handleClick('/home/company/companyOkr');
            }}
          >
            OKR设置
          </Menu.Item>
        </Menu>
        <div
          className="company-menu-logout"
          onClick={() => {
            history.push("/home/basic/groupTable");
            dispatch(changeEnterpriseGroupState(true));
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
          <Route
            exact
            path="/home/company/companySubject"
            component={CompanySubject}
          />
          <Route
            exact
            path="/home/company/companyOkr"
            component={CompanyOkr}
          />
        </Switch>
      </div>

      <Dialog
        visible={addCompanyVisible}
        onClose={() => {
          setAddCompanyVisible(false);
          // onClose();
        }}
        onOK={() => {
          if (childCreateRef?.current) {
            //@ts-ignore
            childCreateRef.current.changeCompanyConfig();
            setAddCompanyVisible(false);
          }
        }}
        title={"企业属性"}
        dialogStyle={{ width: "750px", height: "700px" }}
      >
        <GroupConfig
          type={"设置"}
          ref={childCreateRef}
          saveGroupSet={saveGroupSet}
        />
      </Dialog>
    </div>
  );
};
Company.defaultProps = {};
export default Company;
