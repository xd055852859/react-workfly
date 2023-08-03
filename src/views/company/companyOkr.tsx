import React, { useState, useEffect } from "react";
import "./companyOkr.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Button, Radio, Space, Switch } from "antd";
import moment from "moment";
import { setMessage } from "../../redux/actions/commonActions";
import api from "../../services/api";
interface CompanyOkrProps {}
const CompanyOkr: React.FC<CompanyOkrProps> = (props) => {
  const dispatch = useDispatch();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [long, setLong] = useState<number>(3);
  const [isOpenYear, setIsOpenYear] = useState<number>(1);
  const [monthStr, setMonthStr] = useState<string>("");
  useEffect(() => {
    console.log(moment().month());
    let month = moment().month() + 1;
    if (month === 1) {
      setMonthStr(`1月1日`);
    } else {
      switch (long) {
        case 1:
          setMonthStr(`${month}月1日`);
          break;
        case 2:
          if (month % 2 === 0) {
            setMonthStr(`${month - 1}月1日`);
          } else {
            setMonthStr(`${month}月1日`);
          }
          break;
        case 3:
          if (month % 3 === 0) {
            setMonthStr(`${month - 2}月1日`);
          } else if (month % 3 === 1) {
            setMonthStr(`${month}月1日`);
          } else if (month % 3 === 2) {
            if (month === 2) {
              setMonthStr(`1月1日`);
            } else {
              setMonthStr(`${month - 1}月1日`);
            }
          }
          break;
        case 4:
          if (month % 4 === 0) {
            setMonthStr(`${month - 3}月1日`);
          } else if (month % 4 === 1) {
            setMonthStr(`${month}月1日`);
          } else if (month % 4 === 2) {
            if (month === 2) {
              setMonthStr(`1月1日`);
            } else {
              setMonthStr(`${month - 1}月1日`);
            }
          } else if (month % 4 === 3) {
            if (month === 3) {
              setMonthStr(`1月1日`);
            } else {
              setMonthStr(`${month - 2}月1日`);
            }
          }
          break;
        case 6:
          if (month > 6) {
            setMonthStr(`6月1日`);
          } else {
            setMonthStr(`1月1日`);
          }
          break;
      }
    }
  }, [long]);
  useEffect(() => {
    if (groupInfo?.okrConfig) {
      setLong(groupInfo.okrConfig.monthLong);
      setIsOpenYear(groupInfo.okrConfig.isOpenYear);
    }
  }, [groupInfo]);
  const saveOkr = async () => {
    let saveOkrRes: any = await api.okr.setOkrConfig(
      mainEnterpriseGroup.mainEnterpriseGroupKey,
      long,
      isOpenYear
    );
    if (saveOkrRes.msg === "OK") {
      dispatch(setMessage(true, "修改企业okr属性成功", "success"));
    } else {
      dispatch(setMessage(true, saveOkrRes.msg, "error"));
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">OKR设置</div>
      </div>
      <div style={{ padding: "0px 27px 27px 27px", boxSizing: "border-box" }}>
        <div className="company-okr-title">OKR周期长度</div>
        <Radio.Group
          onChange={(e) => {
            console.log(e.target.value);
            setLong(e.target.value);
          }}
          value={long}
        >
          <Space direction="vertical">
            <Radio value={1}>1个月</Radio>
            <Radio value={2}>2个月</Radio>
            <Radio value={3}>3个月(季度)</Radio>
            <Radio value={4}>4个月</Radio>
            <Radio value={6}>半年</Radio>
          </Space>
        </Radio.Group>
        <div className="company-okr-title">首个生效周期</div>
        <div className="company-okr-month">{monthStr}</div>
        <div className="company-okr-title">开启年度OKR</div>
        <Switch
          checked={isOpenYear ? true : false}
          onChange={(checked) => {
            setIsOpenYear(checked ? 1 : 0);
          }}
        />
        <div>
          <Button
            type="primary"
            // className={classes.button}
            onClick={() => {
              saveOkr();
            }}
            style={{ marginTop: "15px" }}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
CompanyOkr.defaultProps = {};
export default CompanyOkr;
