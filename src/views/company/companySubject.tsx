import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from 'react-router-dom';
import "./companyPerson.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Table, Modal, Button, Input, Tooltip } from "antd";
import { useMount } from "../../hook/common";

import api from "../../services/api";

import { setCommonHeaderIndex, setMessage } from "../../redux/actions/commonActions";
import { setGroupKey} from "../../redux/actions/groupActions";
import { changeEnterpriseGroupState } from "../../redux/actions/authActions";

import Loading from "../../components/common/loading";
import Avatar from "../../components/common/avatar";

import fileGroupSvg from "../../assets/svg/fileGroup.svg";
import unfileGroupSvg from "../../assets/svg/unfileGroup.svg";
import groupSet4Png from "../../assets/img/groupSet4.png";

const { Search } = Input;

interface CompanySubjectProps { }

const CompanySubject: React.FC<CompanySubjectProps> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useTypedSelector((state) => state.auth.user);
    const groupKey = useTypedSelector((state) => state.group.groupKey);
    const groupInfo = useTypedSelector((state) => state.group.groupInfo);
    const [rows, setRows] = useState<any>([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [fileVisible, setFileVisible] = useState(false);
    const [searchInput, setSearchInput] = useState<any>("");
    const [targetGroup, setTargetGroup] = useState<any>(null);
    // const [strongManagement, setStrongManagement] = useState<any>(false);

    const subjectRef: React.RefObject<any> = useRef();
    let unDistory = useRef<any>(true);

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
            render: (operation, item, index) => (
                <React.Fragment key={'operationArr' + index}>
                    {item.status ?
                        <Tooltip title={item.isFile ? "还原项目" : "归档项目"}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFileVisible(true);
                                    setTargetGroup(item);
                                }}
                                type="primary"
                                shape="circle"
                                icon={<img src={item.isFile ? unfileGroupSvg : fileGroupSvg} alt="" style={{ width: '16px', height: '16px' }} />}
                                ghost
                                style={{ marginRight: "5px", border: "0px" }}
                            />
                        </Tooltip> : null}
                    {groupInfo && groupInfo.role === 1 && item.status ?
                        <Tooltip title={"解散项目"}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteVisible(true)
                                    setTargetGroup(item);
                                }}
                                type="primary"
                                shape="circle"
                                icon={<img src={groupSet4Png} alt="" />}
                                ghost
                                style={{ marginRight: "5px", border: "0px" }}
                            />
                        </Tooltip>
                        : null}
                </React.Fragment>
            ),
            width: 30,
            align: "center" as "center",
        },
        {
            title: "图标",
            dataIndex: "groupLogo",
            key: "groupLogo",
            render: (groupLogo, item, index) => (
                <div
                    className="company-avatar-container "
                    onClick={() => {

                    }}
                    key={'avatarArr' + index}
                >
                    <div className="company-avatar">
                        <Avatar
                            avatar={
                                groupLogo
                            }
                            name={""}
                            type="group"
                            index={index}
                        />
                    </div>
                </div>
            ),
            width: 30,
            align: "center" as "center",
        },
        {
            title: "名字",
            dataIndex: "groupName",
            key: "groupName",
            width: 40,
            align: "center" as "center",
        },
        {
            title: "创建人",
            dataIndex: "creatorName",
            key: "creatorName",
            width: 30,
            align: "center" as "center",
        },
        {
            title: "创建时间",
            key: "createTime",
            dataIndex: "createTime",
            width: 40,
            align: "center" as "center",
        },
        {
            title: "人员数",
            key: "gmNumber",
            dataIndex: "gmNumber",
            width: 30,
            align: "center" as "center",
        },
        {
            title: "任务数",
            key: "taskNumber",
            dataIndex: "taskNumber",
            width: 30,
            align: "center" as "center",
        },
        {
            title: "状态",
            key: "status",
            dataIndex: "status",
            render: (status, row, index) => (
                <React.Fragment key={"statusArr" + index}>{status !== 0 ? "正常" : "已解散"}</React.Fragment>
            ),
            width: 20,
            align: "center" as "center",
        },
    ];
    const getCompanyRow = useCallback(
        async (
            page: number,
            limit: number,
            searchInput: string,
        ) => {
            let newRow: any = [];
            let companySubjectRes: any = "";
            companySubjectRes = await api.company.getCompanyGroupList(
                groupKey,
                page,
                limit,
                1,
                searchInput,
                ""
            );
            if (unDistory.current) {
                if (companySubjectRes.msg === "OK") {
                    setLoading(false);
                    companySubjectRes.result.forEach((item: any, index: number) => {
                        item.createTime = moment(parseInt(item.createTime)).format(
                            "YYYY/MM/DD"
                        );
                        newRow[index] = {
                            ...item,
                        };
                    });

                    setRows(newRow);
                    setTotal(companySubjectRes.totalNumber);
                } else {
                    setLoading(false);
                    dispatch(setMessage(true, companySubjectRes.msg, "error"));
                }
            }
        },
        [groupKey, dispatch]
    );
    useEffect(() => {
        if (user) {
            getCompanyRow(1, pageSize, searchInput)
        }
    }, [user, pageSize, searchInput, getCompanyRow]);

    const handleChangePage = (page: number) => {
        setPage(page);
        getCompanyRow(page, pageSize, searchInput);
    };

    const handleChangePageSize = (current, size) => {
        setPageSize(size);
        getCompanyRow(page, size, searchInput);
    };
    const foldGroup = async (groupKey: string) => {
        let foldRes: any = await api.group.changeGroupInfo(
            groupKey, { isFile: targetGroup.isFile ? false : true }
        );
        if (foldRes.msg === "OK") {
            dispatch(setMessage(true, (targetGroup.isFile ? '还原群组' : '归档群组') + '成功', "success"));
            getCompanyRow(page, pageSize, searchInput);
            setFileVisible(false);
        } else {
            dispatch(setMessage(true, foldRes.msg, "error"));
        }
    }
    const dismissGroup = async (groupKey: string) => {
        let groupRes: any = await api.group.dismissGroup(groupKey);
        if (groupRes.msg === "OK") {
            dispatch(setMessage(true, "解散项目成功", "success"));
            getCompanyRow(page, pageSize, searchInput);
            setDeleteVisible(false)
        } else {
            dispatch(setMessage(true, groupRes.msg, "error"));
        }
    };
    const toTargetGroup = async (groupKey: string) => {
        dispatch(setGroupKey(groupKey));
        dispatch(setCommonHeaderIndex(3));
        dispatch(changeEnterpriseGroupState(true));
        await api.group.visitGroupOrFriend(2, groupKey);
        // dispatch(getGroup(3, null, 1));
    };
    return (
        <div className="company-info">
            {loading ? <Loading /> : null}
            <div className="company-header">
                <div className="company-header-title">
                    <span style={{ fontSize: "18px" }}>项目管理（{total}）</span>
                </div>
            </div>
            <div className="company-info-container" ref={subjectRef}>
                <div className="company-info-left">
                    <div className="company-info-title">
                        <div
                            className="companySearch-container"
                            style={{ margin: "0px 10px" }}
                        >
                            <Search
                                placeholder="请输入项目名"
                                value={searchInput}
                                onSearch={() => getCompanyRow(0, pageSize, searchInput)}
                                onChange={(e: any) => {
                                    if (e.target.value === "") {
                                        setPage(0);
                                        getCompanyRow(0, pageSize, "");
                                    }
                                    setSearchInput(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Table
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                if (record.status) {
                                    history.push('/home/basic/groupTable');
                                    toTargetGroup(record._key)
                                }
                            }, // 点击行

                        };
                    }}
                    columns={columns}
                    dataSource={rows}
                    size="small"
                    scroll={{ x: 1200, y: document.body.offsetHeight - 230 }}
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
                visible={fileVisible}
                onCancel={() => {
                    setFileVisible(false);
                }}
                onOk={() => {
                    foldGroup(targetGroup._key)
                }}
                title={targetGroup?.isFile ? '还原群组' : '归档群组'}
            >
                是否{targetGroup?.isFile ? '还原群组' : '归档群组'}
            </Modal>
            <Modal
                visible={deleteVisible}
                onCancel={() => {
                    setDeleteVisible(false);
                }}
                onOk={() => {
                    dismissGroup(targetGroup._key)
                }}
                title={"解散群组"}
            >
                是否解散群组
            </Modal>
        </div>
    );
};
CompanySubject.defaultProps = {};
export default CompanySubject;
