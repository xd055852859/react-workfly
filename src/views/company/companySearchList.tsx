import React, { useState, useEffect, useRef, useCallback } from "react";
import "./companySearch.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Button, Input, Tooltip, Tabs, Table, Modal, Checkbox } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useMount, usePrevious } from "../../hook/common";

// import addPng from '../../assets/img/contact-plus.png';
import { setMessage } from "../../redux/actions/commonActions";

import _ from "lodash";
import api from "../../services/api";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import defaultGroupPng from "../../assets/img/defaultGroup.png";
const { Search } = Input;
const { TabPane } = Tabs;
interface CompanySearchListProps {
  addMember?: any;
  targetGroupKey: string;
  searchType: number;
  companyObj: any;
  // nodeData: any;
  startId: string;
  deleteDepartment: Function;
}

const CompanySearchList: React.FC<CompanySearchListProps> = (props) => {
  const {
    addMember,
    // targetGroupKey,
    searchType,
    // companyData,
    // nodeData,
    companyObj,
    deleteDepartment,
  } = props;
  const dispatch = useDispatch();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [searchInput, setSearchInput] = useState<any>("");
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = useState<any>([]);
  const [nodeRows, setNodeRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [postStr, setPostStr] = React.useState("");
  const [postIndex, setPostIndex] = React.useState<any>(null);

  const [pageSize, setPageSize] = React.useState(80);

  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [departmentId, setDepartmentId] = useState<any>(null);

  const personRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  let memberColumns = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 20,
      align: "center" as "center",
      render: (avatar) => (
        <div className="company-avatar-container ">
          <div className="company-avatar">
            <img
              src={
                avatar
                  ? avatar + "?imageMogr2/auto-orient/thumbnail/80x"
                  : defaultPersonPng
              }
              alt=""
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = defaultPersonPng;
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "姓名",
      dataIndex: "nickName",
      key: "nickName",
      width: 20,
      align: "center" as "center",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (operation, item, index) => (
        <Tooltip title="添加成员">
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              addMember(item);
            }}
          />
        </Tooltip>
      ),
      width: 20,
      align: "center" as "center",
    },
  ];
  let groupColumns = [
    {
      title: "图标",
      dataIndex: "groupLogo",
      key: "groupLogo",
      width: 20,
      align: "center" as "center",
      render: (groupLogo) => (
        <div className="company-avatar-container ">
          <div className="company-avatar">
            <img
              src={
                groupLogo
                  ? groupLogo + "?imageMogr2/auto-orient/thumbnail/80x"
                  : defaultGroupPng
              }
              alt=""
            />
          </div>
        </div>
      ),
    },
    {
      title: "项目名",
      dataIndex: "groupName",
      key: "groupName",
      width: 20,
      align: "center" as "center",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (operation, item, index) => (
        <Tooltip title="添加项目">
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              addMember(item);
            }}
          />
        </Tooltip>
      ),
      width: 20,
      align: "center" as "center",
    },
  ];
  const memberInfoColumns = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 10,
      align: "center" as "center",
      render: (avatar) => (
        <div className="company-avatar-container ">
          <div className="company-avatar">
            <img
              src={
                avatar
                  ? avatar + "?imageMogr2/auto-orient/thumbnail/80x"
                  : defaultPersonPng
              }
              alt=""
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = defaultPersonPng;
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "姓名",
      dataIndex: "nickName",
      key: "nickName",
      width: 20,
      align: "center" as "center",
      ellipsis: true,
    },
    {
      title: "职位",
      dataIndex: "post",
      key: "post",
      width: 15,
      align: "center" as "center",
      editable: true,
      render: (post, item, index) => (
        <React.Fragment>
          {index !== postIndex ? (
            <span
              onClick={() => {
                setPostIndex(index);
                setPostStr(post === "无职位" ? "" : post);
              }}
            >
              {post}
            </span>
          ) : (
            <Input
              value={postStr}
              onChange={(e: any) => {
                setPostStr(e.target.value);
              }}
              onBlur={() => {
                changePost(index, postStr);
                setPostIndex(null);
              }}
            />
          )}
        </React.Fragment>
      ),
    },
    {
      title: "领导",
      dataIndex: "isLeader",
      key: "isLeader",
      width: 20,
      align: "center" as "center",
      render: (isLeader, item, index) => (
        <Checkbox
          checked={isLeader ? true : false}
          onChange={(e: any) => {
            changeLeader(index);
          }}
        />
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center" as "center",
      width: 15,
      render: (operation, item, index) => (
        <Button
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => {
            setDeleteDialogShow(true);
            setDepartmentId(item.staffKey);
          }}
        />
      ),
    },
  ];
  const groupInfoColumns = [
    {
      title: "图标",
      dataIndex: "groupLogo",
      key: "groupLogo",
      width: 20,
      align: "center" as "center",
      render: (groupLogo) => (
        <div className="company-avatar-container">
          <div className="company-avatar">
            <img
              src={
                groupLogo
                  ? groupLogo + "?imageMogr2/auto-orient/thumbnail/80x"
                  : defaultGroupPng
              }
              alt=""
            />
          </div>
        </div>
      ),
    },
    {
      title: "项目名",
      dataIndex: "groupName",
      key: "groupName",
      width: 40,
      align: "center" as "center",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center" as "center",
      width: 15,
      render: (operation, item, index) => (
        <Button
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => {
            setDeleteDialogShow(true);
            setDepartmentId(item.staffKey);
          }}
        />
      ),
    },
  ];

  const getCompanyRow = useCallback(
    async (
      page: number,
      limit: number,
      searchInput: string,
      nodeId: string,
      searchType: number,
      searchIndex: number
    ) => {
      let newRow: any = [];
      let companyPersonRes: any = null;
      if (searchType === 2) {
        if (searchIndex) {
          companyPersonRes = await api.company.getCompanyList(
            2,
            nodeId,
            page,
            limit
          );
        } else {
          companyPersonRes = await api.company.getCompanyList(
            1,
            groupKey,
            page,
            limit,
            searchInput,
            "",
            nodeId
          );
        }
      } else if (searchType === 3) {
        if (searchIndex) {
          companyPersonRes = await api.group.getGroup(9);
        } else {
          companyPersonRes = await api.company.getCompanyGroupList(
            groupKey,
            page,
            limit,
            searchInput,
            nodeId
          );
        }
      }
      if (unDistory.current) {
        if (companyPersonRes.msg === "OK") {
          companyPersonRes.result.forEach((item: any, index: number) => {
            newRow[index] = {
              ...item,
            };
          });

          setRows(newRow);
          if (searchType === 2) {
            setTotal(companyPersonRes.totalNumber);
          } else if (searchType === 3) {
            setTotal(companyPersonRes.result.length);
          }
        } else {
          dispatch(setMessage(true, companyPersonRes.msg, "error"));
        }
      }
    },
    [groupKey, dispatch]
  );
  const getCompanyNodeRow = useCallback(
    async (page: number, limit: number, node: any, searchType: number) => {
      let newRow: any = [];
      if (searchType === 2) {
        let companyPersonRes: any = await api.company.getCompanyList(
          2,
          node._key,
          page,
          limit
        );
        if (unDistory.current) {
          if (companyPersonRes.msg === "OK") {
            companyPersonRes.result.forEach((item: any, index: number) => {
              newRow.push({
                ...item,
                post: item.post ? item.post : "无职位",
              });
            });
            setNodeRows(newRow);
          } else {
            dispatch(setMessage(true, companyPersonRes.msg, "error"));
          }
        }
      } else {
        let companyPersonRes: any = await api.company.getOrgGroupList(
          node._key,
          page,
          limit
        );
        if (unDistory.current) {
          if (companyPersonRes.msg === "OK") {
            companyPersonRes.result.forEach((item: any, index: number) => {
              newRow[index] = {
                ...item,
              };
            });
            setNodeRows(newRow);
          } else {
            dispatch(setMessage(true, companyPersonRes.msg, "error"));
          }
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (companyObj) {
      getCompanyRow(
        page,
        pageSize,
        "",
        companyObj._key,
        searchType,
        searchIndex
      );
    }
  }, [companyObj, page, pageSize, searchType, searchIndex, getCompanyRow]);

  useEffect(() => {
    if (companyObj) {
      getCompanyNodeRow(1, 100, companyObj, searchType);
    }
  }, [companyObj, searchType, getCompanyNodeRow]);

  const prevSearchInput = usePrevious(searchInput);
  useEffect(() => {
    if (prevSearchInput !== searchInput && companyObj) {
      setPage(0);
      getCompanyRow(
        0,
        pageSize,
        searchInput,
        companyObj._key,
        searchType,
        searchIndex
      );
    }
  }, [
    searchInput,
    prevSearchInput,
    pageSize,
    companyObj,
    searchType,
    searchIndex,
    getCompanyRow,
  ]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangePageSize = (current, size) => {
    setPageSize(size);
  };
  const searchGroup = () => {
    let newRow: any = _.cloneDeep(rows);
    newRow = newRow.filter((groupItem: any) => {
      return groupItem.groupName.indexOf(searchInput) !== -1;
    });
    setRows(newRow);
    setTotal(newRow.length);
  };

  const changeLeader = async (index: number) => {
    let newNodeRows = _.cloneDeep(nodeRows);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newNodeRows[index].staffKey,
      { isLeader: !newNodeRows[index].isLeader ? 1 : 2 }
    );
    if (updateCompanyRes.msg === "OK") {
      newNodeRows[index].isLeader = !newNodeRows[index].isLeader;
      setNodeRows(newNodeRows);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, "error"));
    }
  };
  const changePost = async (index: number, post: string) => {
    let newNodeRows = _.cloneDeep(nodeRows);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newNodeRows[index].staffKey,
      { post: post }
    );
    if (updateCompanyRes.msg === "OK") {
      newNodeRows[index].post = post;
      setNodeRows(newNodeRows);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, "error"));
    }
  };
  // const [updateValue, setUpdateValue] = useState<any>('');
  return (
    <div className="companySearch">
      <div className="companySearch-container companySearch-listSearch">
        <Search
          placeholder="请输入名称"
          value={searchInput}
          onSearch={() => {
            if (searchIndex === 1 && searchType === 3) {
              searchGroup();
            } else {
              getCompanyRow(
                0,
                pageSize,
                searchInput,
                companyObj._key,
                searchType,
                searchIndex
              );
            }
          }}
          onChange={(e: any) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div
        className="companySearch-info-container"
        ref={personRef}
        style={{
          height: companyObj.orgType === 1 ? "calc(100% - 205px)" : "100%",
        }}
      >
        {searchType === 3 ? (
          <Tabs
            activeKey={searchIndex + ""}
            onChange={(activeKey) => {
              setSearchIndex(parseInt(activeKey));
            }}
          >
            <TabPane tab="企业项目" key={"0"}>
              <Table
                columns={groupColumns}
                scroll={{ y: document.body.offsetHeight - 430 }}
                dataSource={rows}
                size="small"
                pagination={{
                  pageSize: pageSize,
                  onChange: handleChangePage,
                  onShowSizeChange: handleChangePageSize,
                  total: total,
                }}
              />
            </TabPane>
            <TabPane tab="我的项目" key={"1"}>
              <Table
                columns={groupColumns}
                scroll={{ y: document.body.offsetHeight - 430 }}
                dataSource={rows}
                size="small"
                pagination={{
                  pageSize: pageSize,
                  onChange: handleChangePage,
                  onShowSizeChange: handleChangePageSize,
                  total: total,
                }}
              />
            </TabPane>
          </Tabs>
        ) : (
          <Table
            columns={memberColumns}
            scroll={{ y: document.body.offsetHeight - 380 }}
            dataSource={rows}
            size="small"
            pagination={{
              pageSize: pageSize,
              onChange: handleChangePage,
              onShowSizeChange: handleChangePageSize,
              total: total,
            }}
          />
        )}
      </div>
      {companyObj.orgType === 1 ? (
        <React.Fragment>
          <div className="companySearch-info-title">
            {companyObj?.name}:现有{searchType === 2 ? "成员" : "项目"} ({" "}
            {nodeRows.length}人 )
          </div>
          <div className="companySearch-info-container">
            {searchType === 2 ? (
              <Table
                columns={memberInfoColumns}
                scroll={{ y: 120 }}
                dataSource={nodeRows}
                size="small"
                pagination={false}
              />
            ) : (
              <Table
                columns={groupInfoColumns}
                scroll={{ y: 120 }}
                dataSource={nodeRows}
                size="small"
                pagination={false}
              />
            )}
            <Modal
              visible={deleteDialogShow}
              onCancel={() => {
                setDeleteDialogShow(false);
              }}
              onOk={() => {
                setDeleteDialogShow(false);
                deleteDepartment(departmentId);
              }}
              title={"删除" + (searchType === 2 ? "成员" : "项目")}
            >
              是否删除该{searchType === 2 ? "成员" : "项目"}
            </Modal>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
CompanySearchList.defaultProps = {};
export default CompanySearchList;
