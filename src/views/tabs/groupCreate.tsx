import React, { useState, useEffect } from "react";
import "./tabs.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import _ from "lodash";
import api from "../../services/api";

import {
  setMessage,
  setCommonHeaderIndex,
  setCreateMemberState,
  changeAnimateState,
} from "../../redux/actions/commonActions";
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from "../../redux/actions/groupActions";
import { setHeaderIndex } from "../../redux/actions/memberActions";

import GroupSet from "./groupSet";
import GroupModel from "./groupModel";
import addGroup1Png from "../../assets/img/addGroup1.png";
import addGroup2Png from "../../assets/img/addGroup2.png";
import cloneGroupSvg from "../../assets/svg/cloneGroup.svg";

import { Dropdown, Menu, Modal } from "antd";
import Avatar from "../../components/common/avatar";
const { SubMenu } = Menu;
export interface GroupCreateProps {
  //onClose: Function
  groupStyle?: any;
  addPng: string;
}
const GroupCreate: React.FC<GroupCreateProps> = (props) => {
  const { groupStyle, addPng } = props;
  const dispatch = useDispatch();
  // const classes = useStyles();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [addVisible, setAddVisible] = useState(false);
  const [addModelVisible, setAddModelVisible] = useState(false);
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [createGroupArray, setCreateGroupArray] = useState<any>(null);
  const [groupCreateVisible, setGroupCreateVisible] = useState(false);
  const [templateKey, setTemplateKey] = useState<any>(null);
  const [taskCheck, setTaskCheck] = useState(true);
  const [groupObj, setGroupObj] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [cloneGroupKey, setCloneGroupKey] = useState("");
  const [cloneGroupName, setCloneGroupName] = useState("");
  const saveGroupSet = (obj: any) => {
    // if (!isNaN(templateKey)) {
    //   obj.templateKey = templateKey;
    //   obj.isContainTask = taskCheck;
    // }
    setGroupObj(obj);
  };
  useEffect(() => {
    if (groupArray) {
      setLoading(false);
      let newGroupArray: any = null;
      if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
        newGroupArray = groupArray.filter((item: any) => {
          return (
            (!item.isFile &&
              item.enterpriseGroupKey ===
                mainEnterpriseGroup.mainEnterpriseGroupKey) ||
            item._key === mainEnterpriseGroup.mainEnterpriseGroupKey
          );
        });
        setCreateGroupArray(newGroupArray);
      }
    }
  }, [groupArray, mainEnterpriseGroup]);
  const addGroup = async () => {
    let newGroupObj = _.cloneDeep(groupObj);
    setLoading(true);
    if (!newGroupObj || JSON.stringify(newGroupObj) === "{}") {
      newGroupObj = {
        groupName: "新项目",
        enterprise: false,
        groupDesc: "",
        groupLogo: "https://cdn-icare.qingtime.cn/1622592874328.svg",
        modelUrl: "",
        isOpen: false,
        joinType: 1,
        password: "",
        question: "",
        isHasPassword: false,
        isLinkJoin: false,
        defaultPower: 4,
      };
    }
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey) {
      newGroupObj.enterpriseGroupKey =
        mainEnterpriseGroup.mainEnterpriseGroupKey;
    }
    if (!isNaN(templateKey)) {
      newGroupObj.templateKey = templateKey;
      newGroupObj.isContainTask = taskCheck;
    }
    if (
      newGroupObj.isHasPassword &&
      (!newGroupObj.question || !newGroupObj.password)
    ) {
      dispatch(setMessage(true, "口令加入必须包含口令问题和口令", "error"));
      setLoading(false);
      return;
    }
    if (!newGroupObj.groupName || !newGroupObj.groupName.trim()) {
      dispatch(setMessage(true, "请输入项目名", "error"));
      setLoading(false);
      return;
    }
    let groupRes: any = await api.group.addGroup(newGroupObj);
    if (groupRes.msg === "OK") {
      setLoading(false);
      dispatch(setMessage(true, "创建项目成功", "success"));
      dispatch(setGroupKey(groupRes.result._key));
      // dispatch(getGroupInfo(groupRes.result._key));
      dispatch(setCommonHeaderIndex(3));
      dispatch(setHeaderIndex(0));
      dispatch(getGroup(3));
      dispatch(changeAnimateState(true));
      setAddVisible(false);
      setTemplateKey(null);
      dispatch(setCreateMemberState(true));
    } else {
      setLoading(false);
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      cloneGroupKey,
      cloneGroupName + "_副本"
    );
    if (cloneRes.msg === "OK") {
      dispatch(setMessage(true, "克隆项目成功", "success"));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3, null, 1));
      setCloneGroupVisible(false);
    } else {
      dispatch(setMessage(true, cloneRes.msg, "error"));
    }
  };
  return (
    <React.Fragment>
      <Dropdown
        visible={groupCreateVisible}
        trigger={["click"]}
        onVisibleChange={(visible) => {
          if (!visible) {
            setGroupCreateVisible(false);
            setAddGroupVisible(false);
          }
        }}
        // dropStyle={{
        //   width: "calc(100% - 20px)",
        //   // height: '255px',
        //   top: "40px",
        //   left: "10px",
        //   color: "#333",
        //   zIndex: "10",
        //   borderRadius: "8px",
        //   ...groupStyle
        // }}
        overlay={
          <div className="dropDown-box groupCreate-box">
            <Menu triggerSubMenuAction={"hover"}>
              <Menu.Item style={{ height: "60px" }}>
                <div
                  onClick={() => {
                    setAddVisible(true);
                    setGroupObj({});
                    setGroupCreateVisible(false);
                  }}
                  className="addGroup-item"
                >
                  <img
                    className="addGroup-item-img"
                    src={addGroup1Png}
                    alt=""
                  />
                  <div className="addGroup-item-title">
                    <div>自由创建</div>
                    <div>创建一个全新的项目。</div>
                  </div>
                </div>
              </Menu.Item>
              <SubMenu
                style={{ height: "60px" }}
                title={
                  <div className="addGroup-item">
                    <img
                      className="addGroup-item-img"
                      src={cloneGroupSvg}
                      alt=""
                    />
                    <div className="addGroup-item-title">
                      <div>克隆项目</div>
                      <div>会克隆项目、频道和成员等信息</div>
                    </div>
                  </div>
                }
              >
                {createGroupArray
                  ? createGroupArray.map((item, index) => {
                      return (
                        <Menu.Item key={"createItem" + index}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={() => {
                              setCloneGroupKey(item._key);
                              setCloneGroupName(item.groupName);
                              setCloneGroupVisible(true);
                            }}
                          >
                            <Avatar
                              avatar={item.groupLogo}
                              name={item.groupName}
                              type={"person"}
                              index={0}
                              size={22}
                              avatarStyle={{ marginRight: "8px" }}
                            />
                            {item.groupName}
                          </div>
                        </Menu.Item>
                      );
                    })
                  : null}
              </SubMenu>
              <Menu.Item style={{ height: "60px" }}>
                <div
                  onClick={() => {
                    setAddModelVisible(true);
                    setGroupObj({});
                    setGroupCreateVisible(false);
                  }}
                  className="addGroup-item"
                >
                  <img
                    className="addGroup-item-img"
                    src={addGroup2Png}
                    alt=""
                  />
                  <div className="addGroup-item-title">
                    <div>通过模板</div>
                    <div>通过模板创建一个项目。</div>
                  </div>
                </div>
              </Menu.Item>
            </Menu>

            {/* <Dropdown
              visible={addGroupVisible}
              trigger={["click"]}
              onVisibleChange={(visible) => {
                if (!visible) {
                  setAddGroupVisible(false);
                  setGroupCreateVisible(false);
                }
              }}
              overlay={<Contact contactIndex={0} contactType={"clone"} />}
            >
          
            </Dropdown> */}

            {/* <div><img src={addGroup3Png} alt=""/><div><div></div><div></div></div></div> */}
          </div>
        }
      >
        {/* {slot} */}
        {/* <div></div> */}
        <img
          src={addPng}
          alt=""
          className="add-icon"
          onClick={() => {
            setGroupCreateVisible(true);
          }}
        />
      </Dropdown>
      <Modal
        visible={addVisible}
        onCancel={() => {
          setAddVisible(false);
          // onClose();
        }}
        onOk={() => {
          addGroup();
          // onClose();
        }}
        title={"添加项目"}
        width={750}
        centered={true}
        bodyStyle={{ height: "80vh" }}
      >
        <GroupSet saveGroupSet={saveGroupSet} type={"创建"} />
      </Modal>
      <Modal
        visible={addModelVisible}
        onCancel={() => {
          setAddModelVisible(false);
          // onClose();
        }}
        title={"模板创项目"}
        width={"80vw"}
        centered={true}
        bodyStyle={{ height: "80vh", padding: "0px" }}
        footer={false}
      >
        <GroupModel
          toGroupSet={(key: string, taskCheck: boolean) => {
            setAddVisible(true);
            setAddModelVisible(false);
            setTemplateKey(key);
            setTaskCheck(taskCheck);
          }}
        />
      </Modal>
      <Modal
        visible={cloneGroupVisible}
        onCancel={() => {
          setCloneGroupVisible(false);
        }}
        onOk={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={"克隆群"}
        width={400}
        centered={true}
        bodyStyle={{ height: "120px" }}
      >
        是否克隆群:{cloneGroupName}
      </Modal>
    </React.Fragment>
  );
};
export default GroupCreate;
