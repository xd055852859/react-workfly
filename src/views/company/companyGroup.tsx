import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuTree } from "tree-graph-react";
import "./companyDepartment.css";
import "./companyGroup.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Table, Modal, Button, Checkbox } from "antd";
import _ from "lodash";
import api from "../../services/api";

import defaultPersonSvg from "../../assets/svg/defaultPerson.svg";

import { CloseOutlined } from "@ant-design/icons";
import { setMessage } from "../../redux/actions/commonActions";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
import { useMount } from "../../hook/common";
interface CompanyGroupProps {}

const CompanyGroup: React.FC<CompanyGroupProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useTypedSelector((state) => state.auth.user);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [rows, setRows] = useState<any>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [targetGroupKey, setTargetGroupKey] = useState<any>("");
  const [selectedId, setSelectedId] = useState<any>(null);
  const [userId, setUserId] = useState<any>("");
  const [startId, setStartId] = useState<any>(null);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [departmentType, setDepartmentType] = useState(2);
  const [tabIndex, setTabIndex] = useState(0);
  const departmentRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const memberColumns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      align: "center" as "center",
      ellipsis: true,
    },
    {
      title: "图标",
      dataIndex: "logo",
      key: "logo",
      render: (logo, item) => (
        <React.Fragment>
          {item.orgType !== 1 ? (
            <div className="company-avatar-container ">
              <div className="company-avatar">
                <img src={logo ? logo : defaultGroupPng} alt="" />
              </div>
            </div>
          ) : null}
        </React.Fragment>
      ),
      width: 100,
      align: "center" as "center",
    },
    {
      title: "管理员",
      dataIndex: "targetRole2",
      key: "targetRole2",
      align: "center" as "center",
      width: 70,
      render: (value, item, index) => (
        <React.Fragment>
          {item.orgType !== 1 ? (
            <Checkbox
              checked={value ? true : false}
              disabled={item.role > item.checkIndex ? true : false}
              onChange={(e: any) => {
                if (departmentType === 7) {
                  changeMemberRole(e, item, 2);
                } else {
                  changeRole(e, item, 2);
                }
              }}
            />
          ) : null}
        </React.Fragment>
      ),
    },
    {
      title: "编辑",
      dataIndex: "targetRole3",
      key: "targetRole3",
      align: "center" as "center",
      width: 100,
      render: (value, item, index) => (
        <React.Fragment>
          {item.orgType !== 1 ? (
            <Checkbox
              checked={value ? true : false}
              disabled={item.role > item.checkIndex ? true : false}
              onChange={(e: any) => {
                if (departmentType === 7) {
                  changeMemberRole(e, item, 3);
                } else {
                  changeRole(e, item, 3);
                }
                // setMessageCheck(e.target.checked);
              }}
            />
          ) : null}
        </React.Fragment>
      ),
    },
    {
      title: "作者",
      dataIndex: "targetRole4",
      key: "targetRole4",
      align: "center" as "center",
      width: 70,
      render: (value, item, index) => (
        <React.Fragment>
          {item.orgType !== 1 ? (
            <Checkbox
              checked={value ? true : false}
              disabled={item.role > item.checkIndex ? true : false}
              onChange={(e: any) => {
                if (departmentType === 7) {
                  changeMemberRole(e, item, 4);
                } else {
                  changeRole(e, item, 4);
                }
                // setMessageCheck(e.target.checked);
              }}
            />
          ) : null}
        </React.Fragment>
      ),
    },
    {
      title: "成员",
      dataIndex: "targetRole5",
      key: "targetRole5",
      align: "center" as "center",
      width: 70,
      render: (value, item, index) => (
        <React.Fragment>
          {item.orgType !== 1 ? (
            <Checkbox
              checked={value ? true : false}
              disabled={item.role > item.checkIndex ? true : false}
              onChange={(e: any) => {
                if (departmentType === 7) {
                  changeMemberRole(e, item, 5);
                } else {
                  changeRole(e, item, 5);
                }
                // setMessageCheck(e.target.checked);
              }}
            />
          ) : null}
        </React.Fragment>
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center" as "center",
      width: 100,
      render: (value, item) => (
        <React.Fragment>
          {item.orgType !== 1 && item.targetRole ? (
            <Button
              shape="circle"
              type="primary"
              ghost
              style={{ border: "0px" }}
              icon={<CloseOutlined />}
              onClick={() => {
                setDeleteVisible(true);
                if (departmentType === 7) {
                  setUserId(companyObj.staffKey);
                  setTargetGroupKey(item.groupKey);
                } else {
                  setUserId(item.staffKey);
                  setTargetGroupKey(companyObj.groupKey);
                }
              }}
            />
          ) : null}
        </React.Fragment>
      ),
    },
  ];
  // const groupColumns = [
  //   {
  //     title: '头像',
  //     dataIndex: 'avatar',
  //     key: 'avatar',
  //     width: 100,
  //     align: 'center' as 'center',
  //     render: (avatar) => (
  //       <div className="company-avatar-container ">
  //         <div className="company-avatar">
  //           <img
  //             src={
  //               avatar
  //                 ? avatar + '?imageMogr2/auto-orient/thumbnail/80x'
  //                 : defaultPersonSvg
  //             }
  //             alt=""
  //             onError={(e: any) => {
  //               e.target.onerror = null;
  //               e.target.src = defaultPersonSvg;
  //             }}
  //           />
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: '姓名',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: 150,
  //     align: 'center' as 'center',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '管理员',
  //     dataIndex: 'targetRole2',
  //     key: 'targetRole2',
  //     width: 70,
  //     align: 'center' as 'center',
  //     render: (value, item, index) => (
  //       <Checkbox
  //         checked={value ? true : false}
  //         disabled={item.role > item.checkIndex ? true : false}
  //         onChange={(e: any) => {
  //           changeRole(e, index, 2);
  //           // setMessageCheck(e.target.checked);
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: '编辑',
  //     dataIndex: 'targetRole3',
  //     key: 'targetRole3',
  //     align: 'center' as 'center',
  //     width: 70,
  //     render: (value, item, index) => (
  //       <Checkbox
  //         checked={value ? true : false}
  //         disabled={item.role > item.checkIndex ? true : false}
  //         onChange={(e: any) => {
  //           changeRole(e, index, 3);
  //           // setMessageCheck(e.target.checked);
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: '作者',
  //     dataIndex: 'targetRole4',
  //     key: 'targetRole4',
  //     align: 'center' as 'center',
  //     width: 70,
  //     render: (value, item, index) => (
  //       <Checkbox
  //         checked={value ? true : false}
  //         disabled={item.role > item.checkIndex ? true : false}
  //         onChange={(e: any) => {
  //           changeRole(e, index, 4);
  //           // setMessageCheck(e.target.checked);
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: '成员',
  //     dataIndex: 'targetRole5',
  //     key: 'targetRole5',
  //     align: 'center' as 'center',
  //     width: 70,
  //     render: (value, item, index) => (
  //       <Checkbox
  //         checked={value ? true : false}
  //         disabled={item.role > item.checkIndex ? true : false}
  //         onChange={(e: any) => {
  //           changeRole(e, index, 5);
  //           // setMessageCheck(e.target.checked);
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     key: 'operation',
  //     align: 'center' as 'center',
  //     width: 100,
  //     render: (value, item) => (
  //       <Button
  //         shape="circle"
  //         type="primary"
  //         icon={<CloseOutlined />}
  //         disabled={item.userId === user._key}
  //         onClick={() => {
  //           setDeleteVisible(true);
  //           setUserId(item.userId);
  //         }}
  //       />
  //     ),
  //   },
  // ];
  const getGroupTree = useCallback(
    async (nodeId: any, type: number, info: any) => {
      let newCompanyData: any = {};
      let companyDepartmentRes: any = await api.company.getOrganizationTree({
        enterpriseGroupKey: groupKey,
        type: type,
      });
      if (unDistory.current) {
        if (companyDepartmentRes.msg === "OK") {
          let data = companyDepartmentRes.result;
          for (let key in data) {
            newCompanyData[key] = {
              _key: data[key]._key,
              contract: false,
              father: data[key].parentOrgKey,
              name: data[key].name,
              // data[key].orgType === 1
              //   ? data[key].name
              //   : data[key].name +
              //     ' (' +
              //     (data[key].post ? data[key].post : '无职务') +
              //     ' )',
              path: data[key].path1,
              sortList: data[key].children,
              enterpriseGroupKey: data[key].enterpriseGroupKey,
              groupMemberKey: data[key].groupMemberKey,
              orgType: data[key].orgType,
              staffKey: data[key].staffKey,
              // disabled: data[key].orgType === 2,
              childrenAll: data[key].childrenAll,
            };
            if (data[key].orgType === 2) {
              //?imageMogr2/auto-orient/thumbnail/80x
              newCompanyData[key].icon = data[key].avatar
                ? data[key].avatar + "?roundPic/radius/!50p"
                : defaultPersonSvg;
            }
            if (data[key].orgType === 3) {
              //?imageMogr2/auto-orient/thumbnail/80x
              newCompanyData[key].icon = data[key].groupLogo
                ? data[key].groupLogo + "?imageMogr2/auto-orient/thumbnail/80x"
                : defaultPersonSvg;
              newCompanyData[key].groupKey = data[key].groupKey;
            }
            if (!nodeId && !data[key].parentOrgKey) {
              nodeId = data[key]._key;
              newCompanyData[key].icon = info.groupLogo
                ? info.groupLogo
                : defaultGroupPng;
              setStartId(nodeId);
              // setSelectedPath(newCompanyData[nodeId].path);
            }
          }
          // setSelectedId(nodeId);
          setCompanyData(newCompanyData);
        } else {
          dispatch(setMessage(true, companyDepartmentRes.msg, "error"));
        }
      }
    },
    [groupKey, dispatch]
  );
  useEffect(() => {
    if (user && groupInfo) {
      let newDepartmentType = 0;
      let typeArray = location.pathname.split("/");
      newDepartmentType = parseInt(typeArray[typeArray.length - 1]);
      setDepartmentType(newDepartmentType);
      setCompanyObj(null);
      setRows([]);
      setTabIndex(0);
      getGroupTree("", newDepartmentType, groupInfo);
    }
  }, [user, groupInfo, location, getGroupTree]);
  const formatData = useCallback((nodeObj: any, nodeId: string) => {
    let obj: any = {
      ...nodeObj[nodeId],
    };
    if (nodeObj[nodeId].children.length > 0) {
      obj.children = [];
      nodeObj[nodeId].children.forEach((item: any) => {
        let nodeItem = formatData(nodeObj, item);
        obj.children.push(nodeItem);
      });
    } else {
      delete obj.children;
    }
    return obj;
  }, []);

  const getTargetGroup = useCallback(
    async (groupKey: string) => {
      let groupRes: any = await api.group.getGroupInfo(groupKey);
      if (groupRes.msg === "OK") {
        setTargetGroupKey(groupKey);
      } else {
        dispatch(setMessage(true, groupRes.msg, "error"));
      }
    },
    [dispatch]
  );
  const getGroup = useCallback(
    async (
      tabIndex: number,
      departmentType: number,
      nodeId: string,
      node?: any
    ) => {
      let newRow: any = [];
      let newRowData: any = {};
      if (tabIndex) {
        if (departmentType === 7) {
          let companyPersonRes: any = await api.company.getCompanyMemberList(
            node.enterpriseGroupKey,
            node.staffKey
          );
          if (companyPersonRes.msg === "OK") {
            companyPersonRes.result.forEach((item: any, index: number) => {
              newRow[index] = {
                key: item._key,
                groupKey: item.groupKey,
                name: item.groupName,
                role: item.myRole,
                logo: item.groupLogo,
                targetRole: item.targetRole,
              };
              newRow[index]["targetRole" + item.targetRole] = item.targetRole;
              newRow[index].checkIndex = item.targetRole;
            });
            console.log(node);
            setRows(newRow);
          } else {
            dispatch(setMessage(true, companyPersonRes.msg, "error"));
          }
        } else {
          getTargetGroup(node.groupKey);
          let chooseCompanyRes: any = await api.company.getCompanyList(
            3,
            groupKey,
            1,
            500,
            "",
            "",
            "",
            1,
            node.groupKey
          );
          if (chooseCompanyRes.msg === "OK") {
            chooseCompanyRes.result.forEach((item: any, index: number) => {
              newRow.push({
                key: item._key,
                name: item.nickName,
                logo: item.avatar,
                role: item.role,
                staffKey: item.userId,
                groupKey: node.groupKey,
                targetRole:item.role
              });
              newRow[newRow.length - 1]["targetRole" + item.role] = item.role;
              newRow[newRow.length - 1].checkIndex = item.role;
            });
            console.log(newRow);
            setRows(newRow);
            // setRows(newRow);
          } else {
            dispatch(setMessage(true, chooseCompanyRes.msg, "error"));
          }
        }
      } else {
        let obj: any = {
          enterpriseGroupKey: groupKey,
        };
        if (departmentType === 7) {
          obj.targetUKey = node.staffKey;
          obj.type = 8;
        } else {
          obj.targetGKey = node.groupKey;
          obj.type = 7;
        }
        let companyPersonRes: any = await api.company.getOrganizationTree(obj);
        if (unDistory.current) {
          if (companyPersonRes.msg === "OK") {
            let data = companyPersonRes.result;
            for (let key in data) {
              newRowData[key] = {
                key: data[key]._key,
                name: data[key].name,
                logo:
                  departmentType === 7 ? data[key].groupLogo : data[key].avatar,
                children: data[key].children,
                staffKey: data[key].staffKey,
                groupKey: data[key].groupKey,
                role: data[key].role,
                targetRole:data[key].role,
                ["targetRole" + data[key].role]: data[key].role,
                checkIndex: data[key].role,
                orgType: data[key].orgType,
              };
            }
            newRow = formatData(newRowData, nodeId);
            setRows([newRow]);
          } else {
            dispatch(setMessage(true, companyPersonRes.msg, "error"));
          }
        }
      }
    },
    [groupKey, dispatch, formatData, getTargetGroup]
  );
  useEffect(() => {
    if (companyObj) {
      getGroup(tabIndex, departmentType, startId, companyObj);
    }
  }, [tabIndex, companyObj, departmentType, startId, getGroup]);

  const chooseNode = (node: any) => {
    setSelectedId(node._key);
    setCompanyObj(node);
    getGroup(tabIndex, departmentType, startId, node);
  };

  const changeMemberRole = async (e: any, item: any, columnIndex: number) => {
    let newCompanyObj = _.cloneDeep(companyObj);
    let roleRes: any = null;
    if (!item.checkIndex) {
      roleRes = await api.group.addGroupMember(item.groupKey, [
        {
          userKey: newCompanyObj.staffKey,
          nickName: newCompanyObj.name,
          avatar: newCompanyObj.icon.replace("?roundPic/radius/!50p"),
          gender: 0,
          role: columnIndex,
        },
      ]);
    } else {
      roleRes = await api.auth.setRole(
        item.groupKey,
        companyObj.staffKey,
        columnIndex
      );
    }
    if (roleRes.msg === "OK") {
      dispatch(setMessage(true, "修改项目成员权限成功", "success"));
      chooseNode(newCompanyObj);
    } else {
      dispatch(setMessage(true, roleRes.msg, "error"));
    }
  };
  const changeRole = async (e: any, item: any, columnIndex: number) => {
    let roleRes: any = null;
    let newCompanyObj = _.cloneDeep(companyObj);
    if (!item.checkIndex) {
      roleRes = await api.group.addGroupMember(newCompanyObj.groupKey, [
        {
          userKey: item.staffKey,
          nickName: item.name,
          avatar: item.avatar
            ? item.avatar.replace("?roundPic/radius/!50p")
            : "",
          gender: 0,
          role: columnIndex,
        },
      ]);
    } else {
      roleRes = await api.auth.setRole(
        newCompanyObj.groupKey,
        item.staffKey,
        columnIndex
      );
    }
    if (roleRes.msg === "OK") {
      dispatch(setMessage(true, "修改项目成员权限成功", "success"));
      chooseNode(newCompanyObj);
    } else {
      dispatch(setMessage(true, roleRes.msg, "error"));
    }
  };
  const deleteGroup = async () => {
    setDeleteDialogShow(false);
    let newCompanyData = _.cloneDeep(companyData);
    let deleteRes: any = await api.group.deleteFSGroup(
      newCompanyData[selectedId].father,
      selectedId
    );
    if (deleteRes.msg === "OK") {
      let targetNodeIndex =
        newCompanyData[newCompanyData[selectedId].father].sortList.indexOf(
          selectedId
        );
      if (targetNodeIndex !== -1) {
        setSelectedId(newCompanyData[selectedId].father);
        newCompanyData[newCompanyData[selectedId].father].sortList.splice(
          targetNodeIndex,
          1
        );
        delete newCompanyData[selectedId];
      }
      setCompanyData(newCompanyData);
      dispatch(setMessage(true, "删除父子关系成功", "success"));
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
    //}
  };
  const deleteGroupMember = async () => {
    let memberRes: any = await api.group.deleteGroupMember(
      companyObj.groupKey,
      [userId]
    );
    if (memberRes.msg === "OK") {
      setDeleteVisible(false);
      dispatch(setMessage(true, "已将移除该成员", "success"));
      chooseNode(companyObj);
      // let userIndex = _.findIndex(newRow, { userId: userId });
      // if (userIndex !== -1) {
      //   newRow.splice(userIndex, 1);
      // }
      // setDeleteVisible(false);
      // setRows(newRow);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };

  // const saveGroupSet = (obj: any) => {
  //   setGroupObj(obj);
  // };
  // const handleChangeRowsPerPage = (event: any) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };
  // const editContract = (node: any) => {
  //   let newCompanyData = _.cloneDeep(companyData);
  //   newCompanyData[node._key].contract = !node.contract;
  //   setCompanyData(newCompanyData);
  // };
  const deleteMember = async () => {
    let memberRes: any = await api.group.deleteGroupMember(targetGroupKey, [
      userId,
    ]);
    if (memberRes.msg === "OK") {
      setDeleteVisible(false);
      dispatch(setMessage(true, "已移除该项目", "success"));
      chooseNode(companyObj);
    } else {
      dispatch(setMessage(true, memberRes.msg, "error"));
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">
          {departmentType === 7 ? "人员授权" : "项目授权"}
          <span style={{ fontSize: "14px", marginLeft: "10px" }}></span>
        </div>
      </div>
      <div
        className="company-info-container companyGroup-container"
        ref={departmentRef}
      >
        <div className="companyGroup-left">
          {companyData && startId ? (
            <MenuTree
              ref={targetTreeRef}
              nodes={companyData}
              uncontrolled={false}
              showMoreButton
              startId={startId}
              defaultSelectedId={selectedId}
              backgroundColor="#f5f5f5"
              color="#333"
              hoverColor="#595959"
              disabled
              handleClickNode={(node: any) => {
                if (node.orgType !== 1 && (node.staffKey || node.groupKey)) {
                  chooseNode(node);
                }
              }}
            />
          ) : null}
        </div>
        {companyObj ? (
          <div className="companyGroup-right">
            {/* {departmentType === 7 ? ( */}
            <div className="companyDepartment-right-tab">
              <div
                onClick={() => {
                  setTabIndex(0);
                }}
                className="companyDepartment-right-tab-item"
              >
                <span
                  style={
                    tabIndex === 0
                      ? { color: "#1890ff", borderBottom: "3px solid #1890ff" }
                      : {}
                  }
                >
                  树
                </span>
              </div>
              <div
                onClick={() => {
                  setTabIndex(1);
                }}
                className="companyDepartment-right-tab-item"
              >
                <span
                  style={
                    tabIndex === 1
                      ? { color: "#1890ff", borderBottom: "3px solid #1890ff" }
                      : {}
                  }
                >
                  列表
                </span>
              </div>
            </div>

            <Table
              columns={memberColumns}
              scroll={{ y: document.body.offsetHeight - 180 }}
              dataSource={rows}
              size="small"
              pagination={false}
              expandable={{ defaultExpandAllRows: true }}
            />

            {/* ) : (
            <Table
              columns={groupColumns}
              scroll={{ y: document.body.offsetHeight - 130 }}
              dataSource={rows}
              size="small"
              pagination={false}
            />
          )} */}
          </div>
        ) : null}
      </div>
      <Modal
        visible={deleteDialogShow}
        onCancel={() => {
          setDeleteDialogShow(false);
        }}
        onOk={() => {
          deleteGroup();
        }}
        title={"删除任务"}
      >
        是否删除父子项目关系
      </Modal>
      <Modal
        visible={deleteVisible}
        onCancel={() => {
          setDeleteVisible(false);
        }}
        onOk={() => {
          departmentType === 7 ? deleteMember() : deleteGroupMember();
        }}
        title={"删除项目成员"}
      >
        {departmentType === 7 ? "是否移除该项目" : "是否移除该项目成员"}
      </Modal>
      {/* <Dialog
        visible={setDialogShow}
        onClose={() => {
          setSetDialogShow(false);
          setTargetGroupInfo(null);
        }}
        onOK={() => {
          setGroup();
        }}
        title={'设置项目属性'}
        dialogStyle={{
          width: '850px',
          height: '700px',
        }}
      >
        <GroupSet
          saveGroupSet={saveGroupSet}
          type={'企业'}
          groupInfo={targetGroupInfo}
        />
      </Dialog> */}
    </div>
  );
};
CompanyGroup.defaultProps = {};
export default CompanyGroup;
