import React, { useState, useEffect, useRef } from "react";
import "./groupTableChat.css";
import {
  Table,
  Tabs,
  Checkbox,
  Tooltip,
  Button,
  Rate,
  Input,
  Select,
} from "antd";
import {
  CopyOutlined,
  ShareAltOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import _ from "lodash";
import moment from "moment";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import Avatar from "../../components/common/avatar";
import copy from "copy-to-clipboard";

import { setMessage } from "../../redux/actions/commonActions";
import { useMount } from "../../hook/common";
import customer1Svg from "../../assets/svg/customer1.svg";
import customer2Svg from "../../assets/svg/customer2.svg";
import customer3Svg from "../../assets/svg/customer3.svg";
import customer4Svg from "../../assets/svg/customer4.svg";
import customer5Svg from "../../assets/svg/customer5.svg";
import customer6Svg from "../../assets/svg/customer6.svg";
import customer7Svg from "../../assets/svg/customer7.svg";
import customer8Svg from "../../assets/svg/customer8.svg";
import customer9Svg from "../../assets/svg/customer9.svg";
import customer10Svg from "../../assets/svg/customer10.svg";
import customer11Svg from "../../assets/svg/customer11.svg";
import customer12Svg from "../../assets/svg/customer12.svg";
import customer13Svg from "../../assets/svg/customer13.svg";
import IconFont from "../../components/common/iconFont";
import Empty from "../../components/common/empty";
import Task from "../../components/task/task";
import Chat from "../chat/chat";

const { TabPane } = Tabs;
const { Option } = Select;
interface GroupTableChatProps {
  chatTabState: boolean;
}
declare var window: Window;
const GroupTableChat: React.FC<GroupTableChatProps> = (props) => {
  const { chatTabState } = props;
  const dispatch = useDispatch();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const token = useTypedSelector((state) => state.auth.token);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [serviceList, setServiceList] = useState<any>([]);
  const [customerList, setCustomerList] = useState<any>([]);
  const [customerTaskList, setCustomerTaskList] = useState<any>([]);

  const [activeKey, setActiveKey] = useState<string>("1");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [customerDetail, setCustomerDetail] = useState<any>({});
  const [customerKey, setCustomerKey] = useState<string>("");
  const [customerIndex, setCustomerIndex] = useState<number>(0);
  const [weixin, setWeixin] = useState<string>("");
  const [qq, setQq] = useState<string>("");
  const [color, setColor] = useState<string>("596bef");

  const columns = useRef<any>([
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 60,
      align: "center",
      render: (avatar, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Avatar
            avatar={avatar}
            name={record.nickName}
            type={"person"}
            index={0}
            size={24}
          />
        </div>
      ),
    },
    {
      title: "用户名",
      dataIndex: "nickName",
      key: "nickName",
      align: "center",
      width: 100,
    },

    {
      title: "是否客服",
      dataIndex: "isCustomService",
      key: "isCustomService",
      align: "center",
      width: 120,
      render: (isCustomService, record, index) => (
        <Checkbox
          checked={isCustomService}
          onChange={(e) => {
            changeIsCustomService(e.target.checked, record._key, page);
          }}
          disabled={groupInfo.role > 1}
        />
      ),
    },
    {
      title: "客户数",
      dataIndex: "customerNumber",
      key: "customerNumber",
      align: "center",
      width: 60,
    },
    {
      title: "满意度",
      dataIndex: "satisfaction",
      key: "satisfaction",
      align: "center",
      width: 100,
      render: (satisfaction, record, index) => (
        <span>
          {parseInt(
            (isNaN(
              record.thumbsUpNumber /
                (record.thumbsUpNumber + record.thumbsDownNumber)
            )
              ? 0
              : record.thumbsUpNumber /
                (record.thumbsUpNumber + record.thumbsDownNumber)) *
              100 +
              ""
          ) + "%"}
        </span>
      ),
    },
    {
      title: "完成工单",
      dataIndex: "finishWorkOrderNumber",
      key: "finishWorkOrderNumber",
      align: "center",
      width: 100,
    },
    {
      title: "进行工单",
      dataIndex: "notFinishWorkOrderNumber",
      key: "notFinishWorkOrderNumber",
      align: "center",
      width: 100,
    },
    {
      title: "创建工单",
      dataIndex: "creatorWorkOrderNumber",
      key: "creatorWorkOrderNumber",
      align: "center",
      width: 100,
    },
    // {
    //   title: "操作",
    //   dataIndex: "operation",
    //   key: "operation",
    //   width: 80,
    //   render: (operation, record, index) => (
    //     <React.Fragment>
    //       <Tooltip title="详情">
    //         <Button
    //           shape="circle"
    //           type="primary"
    //           ghost
    //           style={{ border: "0px", marginRight: "5px" }}
    //           // icon={<EllipsisOutlined />}
    //           onClick={() => {}}
    //         />
    //       </Tooltip>
    //     </React.Fragment>
    //   ),
    //   align: "center" as "center",
    // },
  ]);
  const colors = useRef<any>([
    { color: "ff7575", name: "红色" },
    { color: "FFAF60", name: "橙色" },
    { color: "FFD306", name: "黄色" },
    { color: "9AFF02", name: "绿色" },
    { color: "9999CC", name: "青色" },
    { color: "596bef", name: "蓝色" },
    { color: "B766AD", name: "紫色" },
  ]);
  useMount(() => {
    getCustomer();
    getServiceList(1);
  });
  useEffect(() => {
    if (groupInfo) {
      setQq(groupInfo.qq ? groupInfo.qq : "");
      setWeixin(groupInfo.weixin ? groupInfo.weixin : "");
      setColor(groupInfo.color ? groupInfo.color : "");
    }
  }, [groupInfo]);
  useEffect(() => {
    if (activeKey === "1") {
      getServiceList(1);
    } else if (activeKey === "2") {
      getCustomerList(1);
    } else if (activeKey === "3") {
      getCustomerTaskList(1);
    }
    //eslint-disable-next-line
  }, [activeKey]);
  useEffect(() => {
    if (chatTabState) {
      setActiveKey("4");
    }
  }, [chatTabState]);
  const getCustomer = async () => {
    let res: any = await api.group.getCSGroupStatisticsInfo(groupKey);
    if (res.msg === "OK") {
      setCustomerInfo(res.result);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getServiceList = async (page: number) => {
    let res: any = await api.group.getCustomServiceList(groupKey, page, 20);
    if (res.msg === "OK") {
      setPage(page);
      setServiceList((prevServiceList) => {
        if (page === 1) {
          prevServiceList = [];
        }
        res.result = res.result.map((item, index) => {
          let num = parseInt(
            item.thumbsUpNumber /
              (item.thumbsDownNumber + item.thumbsUpNumber) +
              ""
          );
          item.satisfaction = !isNaN(num) ? num : 0;
          return item;
        });
        return [...prevServiceList, ...res.result];
      });
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getCustomerList = async (page: number) => {
    let res: any = await api.group.getCustomList(groupKey, page, 20);
    if (res.msg === "OK") {
      setPage(page);
      setTotal(res.totalNumber);
      setCustomerList((prevCustomerList) => {
        if (page === 1) {
          prevCustomerList = [];
        }
        res.result = res.result.map((item, index) => {
          return item;
        });
        return [...prevCustomerList, ...res.result];
      });
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getCustomerTaskList = async (page: number) => {
    let res: any = await api.group.getWorkOrderList(groupKey, page, 20);
    if (res.msg === "OK") {
      setPage(page);
      setTotal(res.totalNumber);
      setCustomerTaskList((prevCustomerTaskList) => {
        if (page === 1) {
          prevCustomerTaskList = [];
        }
        res.result = res.result.map((item, index) => {
          return item;
        });
        return [...prevCustomerTaskList, ...res.result];
      });
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const changeIsCustomService = async (
    checked: boolean,
    userKey: string,
    page: number
  ) => {
    let res: any = await api.group.setCustomService(groupKey, userKey, checked);
    if (res.msg === "OK") {
      dispatch(setMessage(true, "设置客服成功", "success"));
      getServiceList(page);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const toTargetGroup = async (
    chatId: string,
    groupUUID: string,
    targetUserKey: string,
    index: number
  ) => {
    let res: any = await api.group.joinChatRoom(chatId);
    if (res.msg === "OK") {
      const dom: any = document.querySelector("#chat");
      dom.contentWindow.postMessage(
        {
          externalCommand: "go",
          path: "/group/" + groupUUID,
        },
        "*"
      );
      setCustomerIndex(index);
      getCustomerDetail(targetUserKey);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const getCustomerDetail = async (targetUserKey: string) => {
    setCustomerKey(targetUserKey);
    let res: any = await api.group.getCustomInfo(groupKey, targetUserKey);
    if (res.msg === "OK") {
      setCustomerDetail(res.result);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const changeCustomerDetail = async (key: string, value: string) => {
    let newCustomerDetail = _.cloneDeep(customerDetail);
    newCustomerDetail.propertyData[key] = value;
    setCustomerDetail(newCustomerDetail);
  };
  const toTargetUrl = async () => {
    // 2165229978;
    let tokenRes: any = await api.auth.switchToken();
    if (tokenRes.msg === "OK") {
      let urlRes: any = await api.common.createWorkingTreeNode(
        tokenRes.result.token,
        groupInfo.groupName + "知识库",
        groupKey
      );
      if (urlRes.msg === "OK") {
        window.open(
          `https://mindcute.com/login?token=${tokenRes.result.token}&redirect-router=/home/base/knowledgebase?baseid=${groupInfo.treeNode}`
        );
        // urlRes.result._key
        // 2165229978;
      } else {
        dispatch(setMessage(true, urlRes.msg, "error"));
      }
    } else {
      dispatch(setMessage(true, tokenRes.msg, "error"));
    }
  };
  const changeWeixin = (e: any) => {
    setWeixin(e.target.value);
  };
  const changeQq = (e: any) => {
    setQq(e.target.value);
  };
  const changeGroupSet = async (key: string, value: string) => {
    let groupRes: any = await api.group.changeGroupInfo(groupKey, {
      [key]: value,
    });
    if (groupRes.msg === "OK") {
      console.log("ok");
    } else {
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  // const testCustomerDetail = async (key: string, value: string) => {
  //   if (value) {
  //     if (key === "mobile") {
  //       let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;

  //       if (!reg.test(value)) {
  //         dispatch(setMessage(true, "手机号码输入错误", "error"));
  //         return;
  //       }
  //     } else if (key === "email") {
  //       let reg =
  //         / ^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  //       if (!reg.test(value)) {
  //         dispatch(setMessage(true, "邮箱输入错误", "error"));
  //         return;
  //       }
  //     } else if (value.length > 20) {
  //       dispatch(setMessage(true, "请输入20字符以内的内容", "error"));
  //       return;
  //     }
  //   }
  // };
  const saveCustomerDetail = async () => {
    for (let key in customerDetail.propertyData) {
      let value = customerDetail.propertyData[key];
      if (value) {
        if (key === "mobile") {
          let reg =
            /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
          if (!reg.test(value)) {
            dispatch(setMessage(true, "手机号码输入错误", "error"));
            return;
          }
        } else if (key === "email") {
          let reg = /^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/;
          if (!reg.test(value)) {
            dispatch(setMessage(true, "邮箱输入错误", "error"));
            return;
          }
        } else if (value.length > 20) {
          dispatch(setMessage(true, "请输入20字符以内的内容", "error"));
          return;
        }
      }
    }
    let res: any = await api.group.setCustomProperty(
      groupKey,
      customerKey,
      customerDetail.propertyData
    );
    if (res.msg === "OK") {
      dispatch(setMessage(true, "保存成功", "success"));
      let newCustomerList = _.cloneDeep(customerList);
      for (let key in customerDetail.propertyData) {
        if (newCustomerList[customerIndex].propertyData[key]) {
          newCustomerList[customerIndex].propertyData[key] =
            customerDetail.propertyData[key];
        }
      }
      setCustomerList(newCustomerList);
      // setCustomerDetail(res.result);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  const scrollCustomLoading = (e: any) => {
    let newPage = page;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      customerList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getCustomerList(newPage);
    }
  };
  const scrollTaskLoading = (e: any) => {
    let newPage = page;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      customerTaskList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getCustomerTaskList(newPage);
    }
  };
  const shareGroup = (url: string) => {
    copy(url);
    dispatch(setMessage(true, "复制分享链接成功", "success"));
  };
  return (
    <div className="groupChat">
      <div className="groupChat-header">
        <div className="groupChat-header-left">
          <div className="groupChat-header-left-item">
            <div>{customerInfo.csNumber}</div>
            <div>客服</div>
          </div>
          <div className="groupChat-header-left-item">
            <div>{customerInfo.customNumber}</div>
            <div>客户</div>
          </div>
          <div className="groupChat-header-left-item">
            <div>{customerInfo.finishWorkOrderNumber}</div>
            <div>完成工单</div>
          </div>
          <div className="groupChat-header-left-item">
            <div>{customerInfo.notFinishWorkOrderNumber}</div>
            <div>进行工单</div>
          </div>
        </div>
        <div className="groupChat-header-right">
          <div className="groupChat-header-left-item" style={{ width: "100%" }}>
            <div>
              {parseInt(
                (isNaN(
                  customerInfo.thumbsUpNumber /
                    (customerInfo.thumbsUpNumber +
                      customerInfo.thumbsDownNumber)
                )
                  ? 0
                  : customerInfo.thumbsUpNumber /
                    (customerInfo.thumbsUpNumber +
                      customerInfo.thumbsDownNumber)) *
                  100 +
                  ""
              ) + "%"}
            </div>
            <div>满意度</div>
          </div>
        </div>
      </div>
      <div className="groupChat-container">
        <Tabs
          activeKey={activeKey}
          onChange={(activeKey) => {
            setActiveKey(activeKey);
          }}
        >
          <TabPane tab="客服" key="1">
            <Table
              columns={columns.current}
              dataSource={serviceList}
              scroll={{ y: document.body.offsetHeight - 453 }}
              pagination={{
                pageSize: 1000,
                showSizeChanger: false,
              }}
              size={"small"}
            />
          </TabPane>
          <TabPane tab="客户" key="2">
            <div className="customer-container">
              <div className="customer-left" onScroll={scrollCustomLoading}>
                {customerList.map((customerItem, customerIndex) => {
                  return (
                    <div
                      className="customer-item"
                      onClick={() => {
                        toTargetGroup(
                          customerItem.rocketChatGroupId,
                          customerItem.groupUUID,
                          customerItem._key,
                          customerIndex
                        );
                      }}
                      key={"customer" + customerIndex}
                    >
                      <div className="customer-item-avatar">
                        <Avatar
                          avatar={customerItem.avatar}
                          name={customerItem.nickName}
                          type={"person"}
                          index={0}
                          size={35}
                        />
                      </div>
                      <div className="customer-item-box">
                        <div>{customerItem.nickName}</div>
                        <div>
                          <Rate
                            value={
                              customerItem.propertyData?.important
                                ? customerItem?.propertyData?.important
                                : 0
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <Tooltip
                        title={`当前客服:${customerItem.csUser.nickName}`}
                      >
                        <div className="customer-item-right">
                          <Avatar
                            avatar={customerItem.csUser.avatar}
                            name={customerItem.csUser.nickName}
                            type={"person"}
                            index={0}
                            size={25}
                          />
                          <div className="customer-item-title toLong">
                            {customerItem.thumbsUpStatus === 1
                              ? "满意"
                              : customerItem.thumbsUpStatus === 0
                              ? "未评价"
                              : "不满意"}
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
              <div className="customer-center"></div>

              <div className="customer-right">
                {customerKey ? (
                  <React.Fragment>
                    <div>
                      <div className="customer-img">
                        <img src={customer1Svg} alt="" />
                      </div>
                      当前客服
                    </div>
                    <div>
                      <Avatar
                        avatar={customerDetail?.currCSUser?.avatar}
                        name={customerDetail?.currCSUser?.nickName}
                        type={"person"}
                        index={0}
                        size={35}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {customerDetail?.currCSUser?.nickName}
                      </div>
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer2Svg} alt="" />
                      </div>
                      是否满意
                    </div>
                    <div>
                      {customerDetail.thumbsUpStatus === 1
                        ? "满意"
                        : customerDetail.thumbsUpStatus === 0
                        ? "未评价"
                        : "不满意"}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer3Svg} alt="" />
                      </div>
                      工单数
                    </div>
                    <div>{customerDetail.workOrderNumber}</div>
                    <div>
                      <div className="customer-img">
                        <img src={customer4Svg} alt="" />
                      </div>
                      加入时间
                    </div>
                    <div>
                      {moment(customerDetail.createTime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer4Svg} alt="" />
                      </div>
                      更新时间
                    </div>
                    <div>
                      {moment(customerDetail.updateTime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer5Svg} alt="" />
                      </div>
                      访问次数
                    </div>
                    <div>{customerDetail.visitFrequency}</div>
                    <div>
                      <div className="customer-img">
                        <img src={customer6Svg} alt="" />
                      </div>
                      重要程度
                    </div>
                    <div>
                      <Rate
                        value={
                          customerDetail?.propertyData?.important
                            ? parseInt(customerDetail.propertyData.important)
                            : 0
                        }
                        onChange={(number) => {
                          changeCustomerDetail("important", number + "");
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer7Svg} alt="" />
                      </div>
                      手机号
                    </div>
                    <div>
                      <Input
                        placeholder="请输入手机号"
                        value={customerDetail?.propertyData?.mobile}
                        onChange={(e) => {
                          changeCustomerDetail("mobile", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("mobile", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer8Svg} alt="" />
                      </div>
                      地址
                    </div>
                    <div>
                      <Input
                        placeholder="请输入地址"
                        value={customerDetail?.propertyData?.address}
                        onChange={(e) => {
                          changeCustomerDetail("address", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("address", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer9Svg} alt="" />
                      </div>
                      单位
                    </div>
                    <div>
                      <Input
                        placeholder="请输入单位"
                        value={customerDetail?.propertyData?.company}
                        onChange={(e) => {
                          changeCustomerDetail("company", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("company", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer10Svg} alt="" />
                      </div>
                      职务
                    </div>
                    <div>
                      <Input
                        placeholder="请输入职务"
                        value={customerDetail?.propertyData?.post}
                        onChange={(e) => {
                          changeCustomerDetail("post", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("post", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer11Svg} alt="" />
                      </div>
                      email
                    </div>
                    <div>
                      <Input
                        placeholder="请输入email"
                        value={customerDetail?.propertyData?.email}
                        onChange={(e) => {
                          changeCustomerDetail("email", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("email", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer12Svg} alt="" />
                      </div>
                      qq
                    </div>
                    <div>
                      <Input
                        placeholder="请输入qq"
                        value={customerDetail?.propertyData?.qq}
                        onChange={(e) => {
                          changeCustomerDetail("qq", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("qq", e.target.value);
                        // }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer13Svg} alt="" />
                      </div>
                      备注
                    </div>
                    <div>
                      <Input
                        placeholder="请输入备注"
                        value={customerDetail?.propertyData?.content}
                        onChange={(e) => {
                          changeCustomerDetail("content", e.target.value);
                        }}
                        // onBlur={(e) => {
                        //   testCustomerDetail("content", e.target.value);
                        // }}
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <div
                    style={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <Empty />
                  </div>
                )}
              </div>
              {customerKey ? (
                <Tooltip title="保存">
                  <Button
                    size="large"
                    shape="circle"
                    className="customer-right-button"
                    style={{ border: "0px" }}
                    ghost
                    icon={
                      <IconFont
                        type="icon-baocun1"
                        style={{ fontSize: "25px" }}
                      />
                    }
                    onClick={() => {
                      saveCustomerDetail();
                    }}
                  />
                </Tooltip>
              ) : null}
            </div>
          </TabPane>
          <TabPane tab="工单" key="3">
            <div className="customer-container">
              <div className="customer-left" onScroll={scrollTaskLoading}>
                {customerTaskList.map((customerTaskItem, customerTaskIndex) => {
                  return (
                    <div
                      className="customerTask-item"
                      onClick={() => {
                        toTargetGroup(
                          customerTaskItem.rocketChatGroupId,
                          customerTaskItem.groupUUID,
                          customerTaskItem.customUKey,
                          customerTaskIndex
                        );
                      }}
                      key={"customer" + customerTaskIndex}
                    >
                      <div className="customerTask-item-avatar">
                        <Avatar
                          avatar={customerTaskItem?.customAvatar}
                          name={customerTaskItem?.customNickName}
                          type={"person"}
                          index={0}
                          size={35}
                        />
                        <div>{customerTaskItem?.customNickName}</div>
                      </div>
                      <div className="customerTask-item-box">
                        <Task taskItem={customerTaskItem} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="customer-center"></div>

              <div className="customer-right">
                {customerKey ? (
                  <React.Fragment>
                    <div>
                      <div className="customer-img">
                        <img src={customer1Svg} alt="" />
                      </div>
                      当前客服
                    </div>
                    <div>
                      <Avatar
                        avatar={customerDetail?.currCSUser?.avatar}
                        name={customerDetail?.currCSUser?.nickName}
                        type={"person"}
                        index={0}
                        size={35}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {customerDetail?.currCSUser?.nickName}
                      </div>
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer2Svg} alt="" />
                      </div>
                      是否满意
                    </div>
                    <div>
                      {customerDetail.thumbsUpStatus === 1
                        ? "满意"
                        : customerDetail.thumbsUpStatus === 0
                        ? "未评价"
                        : "不满意"}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer3Svg} alt="" />
                      </div>
                      工单数
                    </div>
                    <div> {customerDetail.workOrderNumber}</div>
                    <div>
                      <div className="customer-img">
                        <img src={customer4Svg} alt="" />
                      </div>
                      加入时间
                    </div>
                    <div>
                      {moment(customerDetail.createTime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer4Svg} alt="" />
                      </div>
                      更新时间
                    </div>
                    <div>
                      {moment(customerDetail.updateTime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer5Svg} alt="" />
                      </div>
                      访问次数
                    </div>
                    <div>{customerDetail.visitFrequency}</div>
                    <div>
                      <div className="customer-img">
                        <img src={customer6Svg} alt="" />
                      </div>
                      重要程度
                    </div>
                    <div>
                      <Rate
                        value={
                          customerDetail?.propertyData?.important
                            ? parseInt(customerDetail.propertyData.important)
                            : 0
                        }
                        onChange={(number) => {
                          changeCustomerDetail("important", number + "");
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer7Svg} alt="" />
                      </div>
                      手机号
                    </div>
                    <div>
                      <Input
                        placeholder="请输入手机号"
                        value={customerDetail?.propertyData?.mobile}
                        onChange={(e) => {
                          changeCustomerDetail("mobile", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer8Svg} alt="" />
                      </div>
                      地址
                    </div>
                    <div>
                      <Input
                        placeholder="请输入地址"
                        value={customerDetail?.propertyData?.address}
                        onChange={(e) => {
                          changeCustomerDetail("address", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer9Svg} alt="" />
                      </div>
                      单位
                    </div>
                    <div>
                      <Input
                        placeholder="请输入单位"
                        value={customerDetail?.propertyData?.company}
                        onChange={(e) => {
                          changeCustomerDetail("company", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer10Svg} alt="" />
                      </div>
                      职务
                    </div>
                    <div>
                      <Input
                        placeholder="请输入职务"
                        value={customerDetail?.propertyData?.post}
                        onChange={(e) => {
                          changeCustomerDetail("post", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer11Svg} alt="" />
                      </div>
                      email
                    </div>
                    <div>
                      <Input
                        placeholder="请输入email"
                        value={customerDetail?.propertyData?.email}
                        onChange={(e) => {
                          changeCustomerDetail("email", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer12Svg} alt="" />
                      </div>
                      qq
                    </div>
                    <div>
                      <Input
                        placeholder="请输入qq"
                        value={customerDetail?.propertyData?.qq}
                        onChange={(e) => {
                          changeCustomerDetail("qq", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="customer-img">
                        <img src={customer13Svg} alt="" />
                      </div>
                      备注
                    </div>
                    <div>
                      <Input
                        placeholder="请输入备注"
                        value={customerDetail?.propertyData?.content}
                        onChange={(e) => {
                          changeCustomerDetail("content", e.target.value);
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <Tooltip title="保存">
                <Button
                  size="large"
                  shape="circle"
                  className="customer-right-button"
                  style={{ border: "0px" }}
                  ghost
                  icon={
                    <IconFont
                      type="icon-baocun1"
                      style={{ fontSize: "25px" }}
                    />
                  }
                  onClick={() => {
                    saveCustomerDetail();
                  }}
                />
              </Tooltip>
            </div>
          </TabPane>
          <TabPane tab="属性" key="4">
            <div className="set-container">
              <div className="set-box">
                <div className="set-left">客服链接</div>
                <div className="set-right">
                  <Input
                    placeholder="客服链接"
                    style={{ width: "55vw", marginLeft: "30px" }}
                    value={`https://agent.workfly.cn/?token= 用户token &groupKey=${groupKey}${
                      groupInfo.treeNode ? "&treeKey=" + groupInfo.treeNode : ""
                    }&color=${color}&device=computer`}
                    disabled
                  />
                </div>
                <Tooltip title="复制客服链接">
                  <div
                    onClick={() => {
                      shareGroup(
                        `https://agent.workfly.cn/?token= 用户token &groupKey=${groupKey}${
                          groupInfo.treeNode
                            ? "&treeKey=" + groupInfo.treeNode
                            : ""
                        }&color=${color}&device=computer`
                      );
                    }}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    <CopyOutlined style={{ fontSize: "20px" }} />
                  </div>
                </Tooltip>
                <Tooltip title="编辑知识库">
                  <div
                    onClick={() => {
                      toTargetUrl();
                    }}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    <ShareAltOutlined style={{ fontSize: "20px" }} />
                  </div>
                </Tooltip>
              </div>
              <div className="set-box">
                <div className="set-left">客服测试</div>
                <div className="set-right">
                  <Input
                    placeholder="客服测试"
                    style={{ width: "55vw", marginLeft: "30px" }}
                    value={`https://agenttest.workfly.cn/?token= 用户token&groupKey=${groupKey}${
                      groupInfo.treeNode ? "&treeKey=" + groupInfo.treeNode : ""
                    }&color=${color}&device=computer`}
                    disabled
                  />
                </div>
                <Tooltip title="客服测试网址">
                  <div
                    onClick={() => {
                      window.open(
                        `https://agenttest.workfly.cn/?token=${token}&groupKey=${groupKey}${
                          groupInfo.treeNode
                            ? "&treeKey=" + groupInfo.treeNode
                            : ""
                        }&color=${color}&device=computer`
                      );
                    }}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    <LinkOutlined style={{ fontSize: "20px" }} />
                  </div>
                </Tooltip>
              </div>
              <div className="set-box">
                <div className="set-left">客服背景</div>
                <div className="set-right">
                  <Select
                    style={{ width: "55vw", marginLeft: "30px" }}
                    value={
                      colors.current[
                        _.findIndex(colors.current, { color: color })
                      ]?.name
                    }
                    onChange={(value) => {
                      setColor(value);
                      changeGroupSet("color", value);
                    }}
                  >
                    {colors.current.map((item) => {
                      return (
                        <Option value={item.color} key={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="set-box">
                <div className="set-left">微信客服号 </div>
                <div className="set-right">
                  <Input
                    placeholder="请输入微信客服号"
                    style={{ width: "55vw", marginLeft: "15px" }}
                    value={weixin}
                    onChange={changeWeixin}
                    onBlur={() => {
                      changeGroupSet("weixin", weixin);
                    }}
                  />
                </div>
              </div>
              <div className="set-box">
                <div className="set-left">qq客服号 </div>
                <div className="set-right">
                  <Input
                    placeholder="请输入qq客服号"
                    style={{ width: "55vw", marginLeft: "26px" }}
                    value={qq}
                    onChange={changeQq}
                    onBlur={() => {
                      changeGroupSet("qq", qq);
                    }}
                  />
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        {activeKey === "2" || activeKey === "3" ? (
          <div className="customer-chat-center">
            <Chat chatType="custom" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
GroupTableChat.defaultProps = {};
export default GroupTableChat;
