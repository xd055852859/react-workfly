import React, { useState, useEffect, useRef, useCallback } from "react";
import "./companyPerson.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import moment from "moment";
import XLSX from "xlsx";
import { setGroupKey, getGroupInfo } from "../../redux/actions/groupActions";
import { setMessage } from "../../redux/actions/commonActions";
import Loading from "../../components/common/loading";
import defaultPersonPng from "../../assets/img/defaultPerson.png";
import {
  Table,
  Modal,
  Button,
  Breadcrumb,
  Tag,
  Tree,
  Dropdown,
  Input,
  Select,
} from "antd";

import {
  EditOutlined,
  UserAddOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import _ from "lodash";
import api from "../../services/api";

import CompanyEdit from "./companyEdit";
import { useMount } from "../../hook/common";
const { Search } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;
interface CompanyPersonProps {}

const CompanyPerson: React.FC<CompanyPersonProps> = () => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [batchVisible, setBatchVisible] = useState(false);
  const [batchArray, setBatchArray] = useState<any>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [nodeData, setNodeData] = useState<any>(null);

  const [selectedId, setSelectedId] = useState<any>(null);
  const [treeVisible, setTreeVisible] = useState<any>(false);
  const [treeDialogShow, setTreeDialogShow] = useState<any>(false);
  const [searchInput, setSearchInput] = useState<any>("");
  const [personIndex, setPersonIndex] = useState<any>(null);
  const [userVisible, setUserVisible] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [changeState, setChangeState] = useState<any>(false);
  const [clearState, setClearState] = useState<any>(false);
  const [isQuit, setIsQuit] = useState<any>(false);
  const personRef: React.RefObject<any> = useRef();
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const columns = [
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      fixed: "left" as "left",
      render: (operation, item, index) => (
        <React.Fragment key={'operationArr'+index}>
          <Button
            onClick={() => {
              setClearState(false);
              setTargetUser(item);
              setUserVisible(true);
              setPersonIndex(index);
            }}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            ghost
            style={{ marginRight: "5px", border: "0px" }}
          />
        </React.Fragment>
      ),

      width: 100,
      align: "center" as "center",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      fixed: true,
      render: (avatar, item, index) => (
        <div
          className="company-avatar-container "
          onClick={() => {
            setClearState(false);
            setTargetUser(item);
            setUserVisible(true);
            setPersonIndex(index);
          }}
          key={'avatarArr'+index}
        >
          <div className="company-avatar">
            <img
              src={
                avatar
                  ? avatar.indexOf("data:") === -1
                    ? avatar + "?imageMogr2/auto-orient/thumbnail/80x"
                    : avatar
                  : defaultPersonPng
              }
              alt=""
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = defaultPersonPng;
              }}
            />
            <div
              className="companyPerson-online"
              style={{
                backgroundColor: item.online ? "#7ED321" : "#B3B3B3",
              }}
            ></div>
          </div>
        </div>
      ),
      width: 60,
      align: "center" as "center",
    },
    {
      title: "姓名",
      dataIndex: "nickName",
      key: "nickName",
      fixed: true,
      width: 150,
      align: "center" as "center",
    },
    {
      title: "批次号",
      dataIndex: "batchNumber",
      key: "batchNumber",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "loginTime",
      title: "最近上线时间",
      dataIndex: "loginTime",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "mobileArea",
      title: "手机区号",
      dataIndex: "mobileArea",
      width: 140,
      align: "center" as "center",
    },
    {
      key: "mobile",
      title: "手机号",
      dataIndex: "mobile",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "post",
      title: "职位",
      dataIndex: "post",
      render: (post, row, index) => (
        <React.Fragment key={"postArr" + index}>
          {row?.organizationInfo?.length > 0 ? (
            row.organizationInfo.map((item: any, index: number) => {
              return (
                <div className="company-choose-info" key={"post" + index}>
                  {item.path1.map((pathItem: any, pathIndex: number) => {
                    return (
                      <span key={"postItem" + pathIndex}>
                        {pathIndex === 0 ? pathItem : " / " + pathItem}
                      </span>
                    );
                  })}
                  {" / " + (item.post ? item.post : "暂无职位")}
                </div>
              );
            })
          ) : (
            <div className="company-choose-info">
              {row.post ? row.post : "暂无职位"}
            </div>
          )}
        </React.Fragment>
      ),
      width: 400,
      align: "center" as "center",
    },
    {
      key: "email",
      title: "电子邮箱",
      dataIndex: "email",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "birthday",
      title: "生日",
      dataIndex: "birthday",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "lunarBirthday",
      title: "农历生日",
      dataIndex: "lunarBirthday",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "gender",
      title: "性别",
      dataIndex: "gender",
      width: 100,
      align: "center" as "center",
    },
    {
      key: "emergencyContact",
      title: "紧急联系人",
      dataIndex: "emergencyContact",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "emergencyContactTel",
      title: "联系人电话",
      dataIndex: "emergencyContactTel",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "address",
      title: "住址",
      dataIndex: "address",
      width: 200,
      align: "center" as "center",
    },
    {
      key: "status",
      title: "状态",
      dataIndex: "status",
      render: (status,row,index) => (
        <React.Fragment  key={"statusArr" + index}>{status !== 0 ? "在职" : "离职"}</React.Fragment>
      ),
      width: 100,
      align: "center" as "center",
    },
    {
      key: "notActive",
      title: "账户已激活",
      dataIndex: "notActive",
      width: 150,
      align: "center" as "center",
    },
    {
      key: "disable",
      title: "禁用",
      dataIndex: "notActive",
      width: 150,
      align: "center" as "center",
    },
  ];
  useEffect(() => {
    if (user) {
      let newGroupKey = localStorage.getItem("companyKey");
      if (newGroupKey) {
        dispatch(setGroupKey(newGroupKey));
        dispatch(getGroupInfo(newGroupKey));
      }
    }
  }, [user, dispatch]);
  const getBatchArray = useCallback(async () => {
    let newBatchArray: any = [];
    let batchRes: any = await api.company.getBatchList(groupKey);
    if (unDistory.current) {
      if (batchRes.msg === "OK") {
        newBatchArray = ["全部", ...batchRes.results];
        setBatchArray(newBatchArray);
      } else {
        dispatch(setMessage(true, batchRes.msg, "error"));
      }
    }
  }, [groupKey, dispatch]);
  const getCompanyRow = useCallback(
    async (
      page: number,
      limit: number,
      searchInput: string,
      isQuit: number,
      node?: any,
      batchNumber?: string
    ) => {
      let newRow: any = [];
      let companyPersonRes: any = "";
      setLoading(true);
      if (node) {
        companyPersonRes = await api.company.getCompanyList(
          2,
          node.key,
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
          batchNumber,
          null,
          isQuit ? 2 : 1
        );
      }

      if (unDistory.current) {
        if (companyPersonRes.msg === "OK") {
          setLoading(false);
          companyPersonRes.result.forEach((item: any, index: number) => {
            newRow[index] = {
              ...item,
            };
            newRow[index].gender = item.gender ? "女" : "男";
            newRow[index].birthday = moment(parseInt(item.birthday)).format(
              "YYYY/MM/DD"
            );
            newRow[index].mobileArea =
              (item.mobileArea + "").indexOf("+") === -1
                ? "+" + item.mobileArea
                : item.mobileArea;
            newRow[index].notActive = item.notActive ? "未激活" : "已激活";
            // newRow[index].online = item.online ? '在线' : '下线';
            newRow[index].birthday = moment(parseInt(item.birthday)).format(
              "YYYY/MM/DD"
            );
            if (item.loginTime) {
              newRow[index].loginTime = moment(parseInt(item.loginTime)).format(
                "YYYY/MM/DD HH:mm:ss"
              );
            }
          });

          setRows(newRow);
          setTotal(companyPersonRes.totalNumber);
        } else {
          setLoading(false);
          dispatch(setMessage(true, companyPersonRes.msg, "error"));
        }
      }
    },
    [groupKey, dispatch]
  );
  useEffect(() => {
    if (groupInfo) {
      getBatchArray();
    }
  }, [groupInfo, getBatchArray]);
  const formatData = useCallback((nodeObj: any, nodeId: string) => {
    let obj: any = {
      key: nodeId,
      title: nodeObj[nodeId].title,
      children: [],
    };

    if (nodeObj[nodeId].children.length > 0) {
      nodeObj[nodeId].children.forEach((item: any) => {
        let nodeItem = formatData(nodeObj, item);
        obj.children.push(nodeItem);
      });
    }
    return obj;
  }, []);

  const getCompanyTree = useCallback(
    async (nodeId: any, type: number) => {
      let newCompanyData: any = {};
      let newNodeData: any = {};
      // if (nodeId) {
      //   setSelectedId(nodeId);
      // }
      setLoading(true);
      let companyDepartmentRes: any = await api.company.getOrganizationTree({
        enterpriseGroupKey: groupKey,
        type: type,
      });
      if (unDistory.current) {
        if (companyDepartmentRes.msg === "OK") {
          setLoading(false);
          let data = companyDepartmentRes.result;
          for (let key in data) {
            newCompanyData[key] = {
              key: data[key]._key,
              title: data[key].name,
              path: data[key].path1,
              children: data[key].children,
            };
            if (!nodeId && !data[key].parentOrgKey) {
              nodeId = data[key]._key;
            }
          }
          // newCompanyData = addPath(newCompanyData, nodeId);
          newNodeData = formatData(newCompanyData, nodeId);
          setNodeData([newNodeData]);
          chooseNode(newCompanyData[nodeId]);
          setCompanyData(newCompanyData);
        } else {
          setLoading(false);
          dispatch(setMessage(true, companyDepartmentRes.msg, "error"));
        }
      }
    },
    [groupKey, dispatch, formatData]
  );
  useEffect(() => {
    if (treeVisible) {
      getCompanyTree("", 1);
    }
  }, [treeVisible, getCompanyTree]);

  useEffect(() => {
    if (selectedId) {
      chooseNode(companyData[selectedId]);
    }
  }, [selectedId, companyData]);
  useEffect(() => {
    if (groupInfo) {
      if (treeVisible && companyData && selectedId && companyData[selectedId]) {
        getCompanyRow(
          page,
          pageSize,
          searchInput,
          isQuit,
          companyData[selectedId]
        );
      } else {
        getCompanyRow(page, pageSize, searchInput, isQuit);
      }
    }
  }, [
    groupInfo,
    page,
    pageSize,
    searchInput,
    isQuit,
    selectedId,
    companyData,
    treeVisible,
    getCompanyRow,
  ]);

  const chooseNode = async (node: any) => {
    setPage(0);
    setCompanyObj(node);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
    getCompanyRow(page, pageSize, searchInput, isQuit);
  };

  const handleChangePageSize = (current, size) => {
    setPageSize(size);
    getCompanyRow(page, size, searchInput, isQuit);
  };
  // const [updateValue, setUpdateValue] = useState<any>('');
  const uploadData = (e: any, num: number) => {
    let obj = e.target;
    if (obj.files.length === 0) {
      return;
    }
    let file = obj.files[0];
    //文件类型
    let arr = file.name.split(".");
    let fileType = arr[arr.length - 1];
    //如果是excel文件
    if (fileType === "xls" || fileType === "xlsx") {
      excelUpload(file, num);
    } else {
      dispatch(setMessage(true, "请上传正确的文件格式", "error"));
      return;
    }
    //如果是xml文件
    // else if (fileType === 'xml') {
    //   this.xmlUpload(file);
    // } else {
    //   message.error('请上传正确的文件格式');
    //   return;
    // }
  };
  const excelUpload = (file: any, num: number) => {
    let [rABS, reader] = [false, new FileReader()];
    let wb: any = "";
    //postData 请求参数 wb 读取完成的数据 rABS 是否将文件读取为二进制字符串
    setLoading(true);
    reader.onload = async function (e: any) {
      var data = e.target.result;
      if (rABS) {
        wb = XLSX.read(btoa(fixdata(data)), {
          //手动转化
          type: "base64",
        });
      } else {
        wb = XLSX.read(data, {
          type: "binary",
        });
      }

      //解码方式1 纵向和横向混杂
      let newRow: any = _.cloneDeep(rows);
      let newsheetArr: any = [];
      wb.SheetNames.forEach((item: any, index: number) => {
        var sheetArr = XLSX.utils.sheet_to_json(
          wb.Sheets[wb.SheetNames[index]]
        );
        sheetArr.forEach((item: any, index: number) => {
          let obj = {
            department1: item["部门1"],
            department2: item["部门2"],
            department3: item["部门3"],
            department4: item["部门4"],
            department5: item["部门5"],
            name: item["姓名"],
            mobileArea:
              (item["手机区号"] + "").indexOf("+") === -1
                ? "+" + item["手机区号"]
                : "" + item["手机区号"],
            mobile: item["手机号"] + "",
            post: item["职位"],
            email: item["电子邮箱"],
            lunarBirthday: item["农历生日"],
            emergencyContact: item["紧急联系人"],
            emergencyContactTel: item["联系人电话"],
            address: item["住址"],
          };
          newsheetArr[index] = {
            ...obj,
            gender: item["性别"] === "男" ? 0 : 1,
            birthday: moment(item["生日"]).valueOf(),
          };
          if (item["手机号"]) {
            newRow.push({
              ...obj,
              gender: item["性别"],
              birthday: moment(item["生日"]).format("YYYY/MM/DD"),
              role: groupInfo.defaultPower,
              notActive: "未激活",
              organizationInfo: [],
            });
          } else {
            dispatch(setMessage(true, "有人员无手机号", "error"));
          }
        });
      });
      // setRows(newRow);
      let res: any = await api.company.addCompanyUser(groupKey, newsheetArr);
      if (res.msg === "OK") {
        setLoading(false);
        getCompanyRow(0, pageSize, "", isQuit);
        getBatchArray();
        dispatch(setMessage(true, "导入人员成功", "success"));
      } else {
        setLoading(false);
        dispatch(setMessage(true, res.msg, "error"));
      }
    };
    if (rABS) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };
  const fixdata = (data: any) => {
    //文件流转BinaryString
    var o: any = "",
      l: any = 0,
      w: any = 10240;
    for (; l < data.byteLength / w; ++l)
      o += String.fromCharCode.apply(
        null,
        Array.from(new Uint8Array(data.slice(l * w, l * w + w)))
      );
    o += String.fromCharCode.apply(
      null,
      Array.from(new Uint8Array(data.slice(l * w)))
    );
    return o;
  };

  const deleteBatch = async () => {
    setDeleteVisible(false);
    let newBatchArray: any = _.cloneDeep(batchArray);
    let deletePersonRes: any = await api.company.deleteBatch(
      groupKey,
      batchArray[batchIndex]
    );
    if (deletePersonRes.msg === "OK") {
      dispatch(setMessage(true, "删除批次成功", "success"));
      newBatchArray.splice(batchIndex, 1);
      setBatchIndex(0);
      setBatchArray(newBatchArray);
      getCompanyRow(0, pageSize, "", isQuit);
    } else {
      dispatch(setMessage(true, deletePersonRes.msg, "error"));
    }
  };

  const editPerson = async (type: string) => {
    let newRow: any = _.cloneDeep(rows);
    let newTargetUser = _.cloneDeep(targetUser);
    if (!newTargetUser.nickName) {
      dispatch(setMessage(true, "昵称不能为空", "error"));
      return;
    }
    let reg1 = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    if (!reg1.test(newTargetUser.mobile)) {
      dispatch(setMessage(true, "手机号码输入错误", "error"));
      return;
    }
    let reg2 = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if (!reg2.test(newTargetUser.email)) {
      dispatch(setMessage(true, "邮箱输入错误", "error"));
      return;
    }
    setClearState(false);
    if (targetUser._key) {
      let updatePersonRes: any = await api.company.updatePerson({
        groupMemberKey: newTargetUser._key,
        nickName: newTargetUser.nickName,
        trueName: newTargetUser.trueName,
        avatar: newTargetUser.avatar,
        email: newTargetUser.email,
        birthday: moment(newTargetUser.birthday).valueOf(),
        lunarBirthday: newTargetUser.lunarBirthday,
        emergencyContact: newTargetUser.emergencyContact,
        emergencyContactTel: newTargetUser.emergencyContactTel,
        address: newTargetUser.address,
        gender: newTargetUser.gender,
      });
      if (updatePersonRes.msg === "OK") {
        dispatch(setMessage(true, "编辑人员成功", "success"));
        let rowIndex = _.findIndex(newRow, { _key: newTargetUser._key });
        for (let key in newRow[rowIndex]) {
          if (newTargetUser[key] && key !== "key") {
            if (key === "birthday") {
              newRow[rowIndex].birthday = moment(newTargetUser.birthday).format(
                "YYYY/MM/DD"
              );
            } else if (key === "gender") {
              newRow[rowIndex].gender =
                newTargetUser.gender === 1 ? "女" : "男";
            } else {
              newRow[rowIndex][key] = newTargetUser[key];
            }
          }
        }
        // newRow.splice(personIndex, 1);
        if (type === "退出") {
          setUserVisible(false);
        }
        setRows(newRow);
      } else {
        dispatch(setMessage(true, updatePersonRes.msg, "error"));
      }
    } else {
      // if (!newTargetUser || !newTargetUser.mobile) {
      //   dispatch(setMessage(true, '请输入手机号', 'error'));
      //   return;
      // }
      if (newTargetUser.birthday) {
        newTargetUser.birthday = moment(newTargetUser.birthday).valueOf();
      }
      if (newTargetUser.nickName) {
        newTargetUser.name = newTargetUser.nickName;
      }
      newTargetUser.gender = parseInt(newTargetUser.gender);
      let res: any = await api.company.addCompanyUser(groupKey, [
        {
          ...newTargetUser,
        },
      ]);
      if (res.msg === "OK") {
        dispatch(setMessage(true, "添加人员成功", "success"));
        getCompanyRow(0, pageSize, "", isQuit);
        setTargetUser(null);
        setClearState(true);
        if (type === "退出") {
          setUserVisible(false);
        }
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  };
  return (
    <div className="company-info">
      {loading ? <Loading /> : null}
      <div className="company-header">
        <div className="company-header-title">
          <span style={{ fontSize: "18px" }}>通讯录（{total}人）</span>
        </div>
        <div className="company-header-button">
          <Button
            type="primary"
            // className={classes.button}
            icon={<UserAddOutlined />}
            onClick={() => {
              setTargetUser(null);
              setUserVisible(true);
            }}
          >
            新增成员
          </Button>
          {groupInfo && groupInfo.role === 1 ? (
            <div className="company-button" style={{ marginRight: "5px" }}>
              <Button type="primary" icon={<CloudUploadOutlined />}>
                上传通讯录
              </Button>
              <input
                type="file"
                className="file-button"
                value={""}
                onChange={(e) => {
                  uploadData(e, 0);
                }}
                id="companyPerson-upload"
              />
            </div>
          ) : null}
          <a
            href="https://cdn-icare.qingtime.cn/花名册示例.xlsx"
            download="花名册（例子）.xlsx"
            style={{ marginRight: "8px", padding: "15px 10px" }}
          >
            下载模板
          </a>
        </div>
      </div>
      <div className="company-info-container" ref={personRef}>
        <div className="company-info-left">
          <div className="company-info-title">
            <div
              className="companySearch-container"
              style={{ margin: "0px 10px" }}
            >
              <Search
                placeholder="请输入成员名"
                value={searchInput}
                onSearch={() => getCompanyRow(0, pageSize, searchInput, isQuit)}
                onChange={(e: any) => {
                  if (e.target.value === "") {
                    setPage(0);
                    getCompanyRow(0, pageSize, "", isQuit);
                  }
                  setSearchInput(e.target.value);
                }}
              />
            </div>
            {batchVisible ? (
              <Select
                defaultValue={0}
                style={{ width: "250px" }}
                onChange={(value: number) => {
                  setBatchIndex(value);
                  if (value === 0) {
                    getCompanyRow(0, pageSize, searchInput, isQuit);
                  } else {
                    getCompanyRow(
                      0,
                      pageSize,
                      "",
                      isQuit,
                      null,
                      batchArray[value]
                    );
                  }
                }}
              >
                {batchArray.map((item: any, index: number) => {
                  return (
                    <Option key={"batch" + index} value={index}>
                      {item}
                      {/* {batchMoveIndex === index && index !== 0 ? (
                        <Button
                          shape="circle"
                          onClick={() => {
                            setDeleteVisible(false);
                          }}
                          icon={<CloseOutlined />}
                          size="small"
                        />
                      ) : null} */}
                    </Option>
                  );
                })}
              </Select>
            ) : null}

            {companyObj && companyObj.path && treeVisible ? (
              <Dropdown
                overlay={
                  <div className="dropDown-box">
                    {nodeData ? (
                      <Tree
                        treeData={nodeData}
                        onSelect={(selectedKeys: React.Key[]) => {
                          setTreeDialogShow(false);
                          setSelectedId(selectedKeys[0]);
                        }}
                      />
                    ) : null}
                  </div>
                }
                onVisibleChange={() => {
                  setTreeDialogShow(true);
                }}
                visible={treeDialogShow}
              >
                <div className="company-path-tree">
                  <Breadcrumb separator=">">
                    {companyObj.path.map((pathItem: any, pathIndex: number) => {
                      return (
                        <Breadcrumb.Item
                          onClick={() => {
                            setTreeDialogShow(true);
                          }}
                          key={"path" + pathIndex}
                        >
                          {pathItem.name}
                        </Breadcrumb.Item>
                      );
                    })}
                  </Breadcrumb>
                </div>
              </Dropdown>
            ) : null}
          </div>
          <div className="company-info-right">
            <CheckableTag
              checked={batchVisible}
              onChange={(checked) => setBatchVisible(checked)}
            >
              批次
            </CheckableTag>
            <CheckableTag
              checked={treeVisible}
              onChange={(checked) => {
                if (!checked) {
                  getCompanyRow(0, pageSize, searchInput, isQuit);
                }
                setTreeVisible(checked);
              }}
            >
              组织树
            </CheckableTag>
            <CheckableTag
              checked={isQuit}
              onChange={(checked) => {
                if (checked) {
                  setPage(0);
                }
                setIsQuit(checked);
              }}
            >
              离职
            </CheckableTag>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={rows}
          size="small"
          scroll={{ x: 2600, y: document.body.offsetHeight - 230 }}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            onChange: handleChangePage,
            onShowSizeChange: handleChangePageSize,
            total: total,
          }}
        />
      </div>
      <Modal
        visible={deleteVisible}
        onCancel={() => {
          setDeleteVisible(false);
        }}
        onOk={() => {
          deleteBatch();
        }}
        title={"删除批次"}
      >
        是否将该批次下所有人员删除
      </Modal>
      <Modal
        visible={userVisible}
        onOk={() => {
          if (changeState) {
            editPerson("继续");
          }
          setChangeState(false);
        }}
        onCancel={() => {
          if (changeState) {
            editPerson("退出");
          } else {
            setUserVisible(false);
          }
          setChangeState(false);
        }}
        okText={"保存并继续"}
        cancelText={"保存并退出"}
        title={"用户设置"}
        centered={true}
        destroyOnClose={true}
      >
        <CompanyEdit
          targetUser={targetUser}
          setTargetUser={setTargetUser}
          setChangeState={setChangeState}
          clearState={clearState}
          rows={rows}
          setRows={setRows}
          personIndex={personIndex}
          setUserVisible={setUserVisible}
        />
      </Modal>
    </div>
  );
};
CompanyPerson.defaultProps = {};
export default CompanyPerson;
