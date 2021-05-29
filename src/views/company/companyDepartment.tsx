import React, { useState, useEffect, useRef, useCallback } from "react";
import "./companyDepartment.css";
import { Tree } from "tree-graph-react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Button, Modal, Drawer, Tooltip } from "antd";
import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import _ from "lodash";
import api from "../../services/api";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";

import { Moveable } from "../../components/common/moveable";
import CompanySearchList from "./companySearchList";
import IconFont from "../../components/common/iconFont";
import Dialog from "../../components/common/dialog";

import defaultPersonPng from "../../assets/svg/defaultPerson.svg";
import defaultGroupPng from "../../assets/img/defaultGroup.png";


interface CompanyDepartmentProps {}

const CompanyDepartment: React.FC<CompanyDepartmentProps> = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [rows, setRows] = useState<any>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  // const [moreTop, setMoreTop] = useState<any>("");
  const [searchDialogShow, setSearchDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [departmentType, setDepartmentType] = useState(1);
  const [departmentId, setDepartmentId] = useState<any>(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const departmentRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let moveRef: any = useRef();
  let unDistory = useRef<any>(true);
  
  useMount(()=>{
    return () => {
      unDistory.current = false;
    };
  })
  const getCompanyTree = useCallback(
    async (nodeId: any, type: number, info: any) => {
      let newCompanyData: any = {};
      let companyDepartmentRes: any = await api.company.getOrganizationTree({
        enterpriseGroupKey: groupKey,
        type: type,
      });
      if (unDistory.current) {
        if (companyDepartmentRes.msg === "OK") {
          let data = companyDepartmentRes.result;
          if (JSON.stringify(data) !== "{}") {
            for (let key in data) {
              newCompanyData[key] = {
                _key: data[key]._key,
                contract: false,
                father: data[key].parentOrgKey,
                name: data[key].name,
                path: data[key].path1,
                sortList: data[key].children,
                enterpriseGroupKey: data[key].enterpriseGroupKey,
                groupMemberKey: data[key].groupMemberKey,
                orgType: data[key].orgType,
                staffKey: data[key].staffKey,
                childrenAll: data[key].childrenAll,
              };
              if (data[key].orgType === 2) {
                //?imageMogr2/auto-orient/thumbnail/80x
                newCompanyData[key].avatarUri = data[key].avatar
                  ? data[key].avatar + "?imageMogr2/auto-orient/thumbnail/80x"
                  : defaultPersonPng;
              }
              if (data[key].orgType === 3) {
                //?imageMogr2/auto-orient/thumbnail/80x
                newCompanyData[key].icon = data[key].groupLogo
                  ? data[key].groupLogo
                  : defaultGroupPng;
              }
              if (!nodeId && !data[key].parentOrgKey) {
                nodeId = data[key]._key;
                newCompanyData[key].icon = info.groupLogo
                  ? info.groupLogo
                  : defaultGroupPng;
                setStartId(nodeId);
                setSelectedPath(newCompanyData[nodeId].path);
              }
            }
            chooseNode(newCompanyData[nodeId]);
            setSelectedId(nodeId);
            setCompanyData(newCompanyData);
          }
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
      getCompanyTree("", newDepartmentType, groupInfo);
      setSearchDialogShow(false);
      moveRef.current.reset();
    }
  }, [user, location, groupInfo, getCompanyTree]);
  const chooseNode = async (node: any) => {
    setSelectedId(node._key);
    setDepartmentId(node._key);
    setCompanyObj(node);
    setRows([]);
  };
  const clickDot = (node: any) => {
    setStartId(node._key);
    setSelectedPath(companyData[node._key].path);
    getCompanyTree(node._key, departmentType, groupInfo);
    moveRef.current.reset();
  };
  const addCompany = async (selectedNode: any, type: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    let addCompanyRes: any = await api.company.addSonOrganization(
      type === "child" ? selectedNode : newCompanyData[selectedNode].father,
      "",
      newCompanyData[selectedNode].enterpriseGroupKey
    );
    if (addCompanyRes.msg === "OK") {
      newCompanyData[addCompanyRes.result._key] = {
        _key: addCompanyRes.result._key,
        contract: false,
        father: addCompanyRes.result.parentOrgKey,
        name: addCompanyRes.result.name,
        sortList: addCompanyRes.result.children,
        enterpriseGroupKey: addCompanyRes.result.enterpriseGroupKey,
        groupMemberKey: addCompanyRes.result.groupMemberKey,
        orgType: 1,
        childrenAll: [],
      };
      if (type === "child") {
        newCompanyData[selectedNode].sortList.push(addCompanyRes.result._key);
      } else {
        newCompanyData[newCompanyData[selectedNode].father].sortList.push(
          addCompanyRes.result._key
        );
      }
      setSelectedId(addCompanyRes.result._key);
      setCompanyData(newCompanyData);
      targetTreeRef.current.rename();
    } else {
      dispatch(setMessage(true, addCompanyRes.msg, "error"));
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    if (newCompanyData[nodeId].orgType === 1) {
      let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
        1,
        nodeId,
        { name: text }
      );
      if (updateCompanyRes.msg === "OK") {
        newCompanyData[nodeId].name = text;
        setCompanyData(newCompanyData);
      } else {
        dispatch(setMessage(true, updateCompanyRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, "组织机构才能修改名称", "error"));
    }
  };
  const editContract = (node: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    newCompanyData[node._key].contract = !node.contract;
    setCompanyData(newCompanyData);
  };
  const deleteDepartment = async (departmentId: string) => {
    setDeleteDialogShow(false);
    let newCompanyData = _.cloneDeep(companyData);
    let newRow = _.cloneDeep(rows);
    let deleteRes: any = await api.company.deleteOrgOrStaff(departmentId);
    if (deleteRes.msg === "OK") {
      let rowIndex = _.findIndex(newRow, { staffKey: departmentId });
      if (rowIndex !== -1) {
        newRow.splice(rowIndex, 1);
        setRows(newRow);
      }
      let targetNodeIndex = newCompanyData[
        newCompanyData[departmentId].father
      ].sortList.indexOf(departmentId);
      if (targetNodeIndex !== -1) {
        chooseNode(newCompanyData[newCompanyData[departmentId].father]);
        delete newCompanyData[departmentId];
        setCompanyData(newCompanyData);
      }
      dispatch(setMessage(true, "删除成功", "success"));
    } else {
      dispatch(setMessage(true, deleteRes.msg, "error"));
    }
  };

  const addMember = async (node: any) => {
    const newCompanyObj = _.cloneDeep(companyObj);
    let newCompanyKey = "";
    let addMemberRes: any = null;
    if (newCompanyObj.orgType === 1) {
      newCompanyKey = newCompanyObj._key;
    } else {
      newCompanyKey = newCompanyObj.father;
    }
    if (departmentType === 2) {
      addMemberRes = await api.company.batchAddOrgStaff(
        newCompanyKey,
        [node._key],
        newCompanyObj.enterpriseGroupKey
      );
    } else {
      addMemberRes = await api.company.batchAddOrgGroup(
        newCompanyKey,
        [node._key],
        newCompanyObj.enterpriseGroupKey
      );
    }
    if (addMemberRes.msg === "OK") {
      if (addMemberRes.result.length > 0) {
        dispatch(setMessage(true, "添加到组织成功", "success"));
        getCompanyTree(newCompanyKey, departmentType, groupInfo);
      } else if (addMemberRes.result.length === 0) {
        dispatch(setMessage(true, "该节点已经被添加", "error"));
      }
    } else {
      dispatch(setMessage(true, addMemberRes.msg, "error"));
    }
  };
  const dragNode = async (dragInfo: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    let newTargetNode = _.cloneDeep(newCompanyData[dragInfo.dragNodeId]);
    let obj = {};

    let fatherKey = newCompanyData[dragInfo.dropNodeId].father;
    let targetFatherKey = newCompanyData[dragInfo.dragNodeId].father;

    let sortIndex = newCompanyData[targetFatherKey].sortList.indexOf(
      dragInfo.dragNodeId
    );
    let childrenAllIndex = newCompanyData[targetFatherKey].childrenAll.indexOf(
      dragInfo.dragNodeId
    );

    if (dragInfo.placement === "in") {
      if (newCompanyData[dragInfo.dropNodeId].orgType === 1) {
        newCompanyData[dragInfo.dropNodeId].sortList.push(dragInfo.dragNodeId);
        newCompanyData[dragInfo.dropNodeId].childrenAll.push(
          dragInfo.dragNodeId
        );
        newCompanyData[dragInfo.dragNodeId].father = dragInfo.dropNodeId;
        obj = {
          oldFatherOrgKey: targetFatherKey,
          sonOrgKey: dragInfo.dragNodeId,
          newFatherOrgKey: dragInfo.dropNodeId,
          childrenIndex:
            newCompanyData[dragInfo.dropNodeId].childrenAll.length - 1,
        };
      } else {
        dispatch(setMessage(true, "组织机构下才能添加子节点", "error"));
        return;
      }
    } else if (fatherKey) {
      let nodeIndex = newCompanyData[fatherKey].childrenAll.indexOf(
        dragInfo.dropNodeId
      );
      //删除原父亲的children
      //增加原父亲的children
      newCompanyData[fatherKey].sortList.splice(
        dragInfo.placement === "up" ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      newCompanyData[fatherKey].childrenAll.splice(
        dragInfo.placement === "up" ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      //改变父亲
      newTargetNode.father = fatherKey;
      newCompanyData[dragInfo.dragNodeId].father = fatherKey;

      obj = {
        oldFatherOrgKey: targetFatherKey,
        sonOrgKey: dragInfo.dragNodeId,
        newFatherOrgKey: fatherKey,
        childrenIndex: dragInfo.placement === "up" ? nodeIndex : nodeIndex + 1,
      };

      if (fatherKey === targetFatherKey) {
        sortIndex = dragInfo.placement === "up" ? sortIndex + 1 : sortIndex;
        childrenAllIndex =
          dragInfo.placement === "up" ? sortIndex + 1 : sortIndex;
      }
    }
    newCompanyData[targetFatherKey].sortList.splice(sortIndex, 1);
    newCompanyData[targetFatherKey].childrenAll.splice(childrenAllIndex, 1);
    let treeRelationRes: any = await api.company.changeTreeCompanyRelation(obj);
    if (treeRelationRes.msg === "OK") {
      setCompanyData(newCompanyData);
      // setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, "error"));
    }
  };
  const editSortList = async (id: string, sortList: any, type: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    let fatherKey = newCompanyData[id].father;
    let obj = {};
    let sortIndex = sortList.indexOf(id);
    let targetIndex = newCompanyData[fatherKey].childrenAll.indexOf(id) + 1;
    let nodeIndex = 0;
    if (sortIndex !== 0) {
      nodeIndex =
        newCompanyData[fatherKey].childrenAll.indexOf(sortList[sortIndex - 1]) +
        1;
    }
    obj = {
      oldFatherOrgKey: fatherKey,
      sonOrgKey: id,
      newFatherOrgKey: fatherKey,
      childrenIndex: nodeIndex,
    };
    newCompanyData[fatherKey].childrenAll.splice(targetIndex, 1);
    newCompanyData[fatherKey].childrenAll.splice(nodeIndex, 0, id);
    newCompanyData[fatherKey].sortList = sortList;
    let treeRelationRes: any = await api.company.changeTreeCompanyRelation(obj);
    if (treeRelationRes.msg === "OK") {
      setCompanyData(newCompanyData);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, "error"));
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">组织结构</div>
        <div className="company-header-right">
          {departmentType === 2 ? (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setSearchDialogShow(true);
              }}
            >
              人员设置
            </Button>
          ) : null}
          {departmentType === 3 ? (
            <Button
              type="primary"
              icon={<UsergroupAddOutlined />}
              onClick={() => {
                setSearchDialogShow(true);
              }}
            >
              项目管理
            </Button>
          ) : null}
        </div>
      </div>

      <div
        className="company-info-container companyDepartment"
        ref={departmentRef}
      >
        <div className="companyDepartment-top">
          <div className="companyDepartment-path">
            {selectedPath
              ? selectedPath.map((pathItem: any, pathIndex: number) => {
                  return (
                    <React.Fragment key={"path" + pathIndex}>
                      <div
                        onClick={() => {
                          setStartId(pathItem._key);
                          setSelectedPath(companyData[pathItem._key].path);
                        }}
                        style={{
                          fontWeight:
                            startId === pathItem._key ? "bold" : "normal",
                        }}
                        className="companyDepartment-path-item"
                      >
                        {pathItem.name}
                        <div className="companyDepartment-path-icon">
                          <div className="companyDepartment-path-icon-top"></div>
                          <div className="companyDepartment-path-icon-bottom"></div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              : null}
          </div>
        </div>
        <div className="companyDepartment-left">
          <Moveable
            scrollable={true}
            style={{ display: "flex" }}
            rightClickToStart={true}
            ref={moveRef}
          >
            {companyData && startId ? (
              <Tree
                // disabled
                // handleClickMoreButton={(node: any) => {
                //   if (companyData[node._key].orgType === 1) {
                //     setMoreTop(node.y);
                //     setInfoDialogShow(true);
                //   }
                // }}
                ref={targetTreeRef}
                nodes={companyData}
                uncontrolled={false}
                showIcon={true}
                showAvatar={true}
                showMoreButton
                startId={startId}
                // selectedBackgroundColor="#E3E3E3"
                defaultSelectedId={selectedId}
                handleClickNode={(node: any) => {
                  chooseNode(node);
                }}
                handleAddChild={(selectedNode: any) => {
                  addCompany(selectedNode, "child");
                }}
                handleAddNext={(selectedNode: any) => {
                  addCompany(selectedNode, "next");
                }}
                handleChangeNodeText={(nodeId: string, text: string) => {
                  editTaskText(nodeId, text);
                }}
                handleClickExpand={editContract}
                handleDeleteNode={() => {
                  setDeleteDialogShow(true);
                }}
                handleDrag={dragNode}
                handleClickDot={clickDot}
                handleShiftUpDown={editSortList}
              />
            ) : null}
          </Moveable>
        </div>
        <div className="help-container">
          <Tooltip title="快捷键">
            <Button
              size="large"
              shape="circle"
              style={{ border: "0px" }}
              ghost
              icon={<IconFont type="icon-keyboard" />}
              onClick={() => {
                setHelpVisible(true);
              }}
            />
          </Tooltip>
        </div>
        {/* <DropMenu
          visible={infoDialogShow}
          onClose={() => {
            setInfoDialogShow(false);
          }}
          title={"节点详情"}
          dropStyle={{
            top: moreTop - 20,
            left: "240px",
            width: "200px",
            height: "180px",
          }}
        >
          <div
            className="company-choose-info"
            onClick={() => {
              addCompany(selectedId, "child");
            }}
          >
            新增子节点
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              addCompany(selectedId, "next");
            }}
          >
            新增节点
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              setDeleteDialogShow(true);
            }}
          >
            删除节点
          </div>
        </DropMenu>*/}
      </div>
      <Modal
        visible={deleteDialogShow}
        onCancel={() => {
          setDeleteDialogShow(false);
        }}
        onOk={() => {
          deleteDepartment(departmentId);
        }}
        title={"删除节点"}
      >
        是否删除该{departmentType === 2 ? "成员关联" : "项目关联"}
      </Modal>
      <Drawer
        visible={searchDialogShow}
        onClose={() => {
          setSearchDialogShow(false);
        }}
        title={"新增关联"}
        mask={false}
        width={400}
        bodyStyle={{
          padding: "12px",
        }}
      >
        <CompanySearchList
          addMember={addMember}
          targetGroupKey={companyObj && companyObj.enterpriseGroupKey}
          searchType={departmentType}
          companyObj={companyObj}
          startId={startId}
          deleteDepartment={deleteDepartment}
        />
      </Drawer>
      <Dialog
        visible={helpVisible}
        onClose={() => {
          setHelpVisible(false);
        }}
        title={"快捷键"}
        dialogStyle={{
          position: "fixed",
          top: "175px",
          right: "10px",
          // right: '60px',
          width: "300px",
          height: "calc(100% - 225px)",
          // overflow: 'visible',
        }}
        showMask={false}
        footer={false}
        closePngState={true}
      >
        <div className="help-item">
          <span>创建同级节点</span> <span>Enter</span>
        </div>
        <div className="help-item">
          <span>创建下级节点</span> <span>Tab</span>
        </div>
        <div className="help-item">
          <span>拖动视图</span> <span>按住鼠标右键并拖动</span>
        </div>
        <div className="help-item">
          <span>选中节点</span> <span>鼠标单击</span>
        </div>
        <div className="help-item">
          <span>编辑节点名</span> <span>鼠标双击</span>
        </div>

        {/* <div className="help-item">
          <span>复制节点</span> <span>Ctrl + C</span>
        </div>
        <div className="help-item">
          <span>剪切节点</span> <span>Ctrl + X</span>
        </div>
        <div className="help-item">
          <span>粘贴节点</span> <span>Ctrl + V</span>
        </div> */}
        <div className="help-item">
          <span>删除节点</span> <span>Delete</span>
        </div>
        <div className="help-item">
          <span>向上调整</span> <span>shift + ↑</span>
        </div>
        <div className="help-item">
          <span>向下调整</span> <span>shift + ↓</span>
        </div>
      </Dialog>
    </div>
  );
};
CompanyDepartment.defaultProps = {};
export default CompanyDepartment;
