import React, { useState, useEffect } from "react";
import "./okrItem.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import okraddSvg from "../../assets/svg/okradd.svg";
import addKrSvg from "../../assets/svg/addKr.svg";
import { useDispatch } from "react-redux";
import { Button, Divider, Input, Menu } from "antd";
import _ from "lodash";
import { setMessage } from "../../redux/actions/commonActions";
import api from "../../services/api";
interface OInfoProps {
  ownerUKey: string;
  periodKey: string;
  oKey?: string;
  flashOkr: any;
  onClose: any;
}
const OInfo: React.FC<OInfoProps> = (props) => {
  const { ownerUKey, periodKey, oKey, flashOkr, onClose } = props;
  const dispatch = useDispatch();
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [oTitle, setOTitle] = useState<string>("");
  const [krTitles, setKrTitles] = useState<string[]>([]);
  const [upLevelOKey, setUpLevelOKey] = useState<string | null>(null);
  const [upLevelKRKey, setUpLevelKRKey] = useState<string | null>(null);
  
  const [priority, setPriority] = useState<number>(0);
  const addKr = () => {
    setKrTitles([...krTitles, ""]);
  };
  const saveOkr = async () => {
    if (!oTitle) {
      dispatch(setMessage(true, "请输入objective内容", "error"));
      return;
    }
    let obj: any = {
      enterpriseGroupKey: mainEnterpriseGroup.mainEnterpriseGroupKey,
      ownerUKey: ownerUKey,
      periodKey: periodKey,
      krTitles: krTitles,
      upLevelOKey: upLevelOKey,
      priority: priority,
      oTitle: oTitle,
    };
    if (oKey) {
      obj.oKey = oKey;
    }
    let saveOkrRes: any = await api.okr.createOKR({ ...obj });
    if (saveOkrRes.msg === "OK") {
      console.log(saveOkrRes.result);
      dispatch(setMessage(true, "创建Okr成功", "success"));
      flashOkr();
      onClose();
    } else {
      dispatch(setMessage(true, saveOkrRes.msg, "error"));
    }
  };
  return (
    <div className="okrTable">
      <div className="okrTable-header">
        <div className="okrTable-left">
          <img
            src={okraddSvg}
            alt=""
            style={{ marginRight: "10px", width: "12px", height: "12px" }}
          />
          对齐父目标
        </div>
      </div>
      <div className="okrTable-o">
        <div className="okrTable-o-left">
          <div
            className="okrTable-oLogo"
            style={{ backgroundColor: "#edf5ff", color: "#479eff" }}
          >
            O
          </div>
        </div>
        <Input
          placeholder="添加 Objecive"
          bordered={false}
          value={oTitle}
          onChange={(e) => {
            setOTitle(e.target.value);
          }}
        />
      </div>
      {krTitles.map((item, index) => {
        return (
          <div className="okrTable-kr" key={"kr" + index}>
            <div>
              <span className="okrTable-krLogo">KR</span>
            </div>
            <Input
              placeholder="添加 Key Result"
              style={{
                borderTop: "0px",
                borderLeft: "0px",
                borderRight: "0px",
              }}
              value={item}
              onChange={(e) => {
                let newKrTitles = _.cloneDeep(krTitles);
                newKrTitles[index] = e.target.value;
                setKrTitles([...newKrTitles]);
              }}
            />
          </div>
        );
      })}
      <div className="okrTable-kr">
        <div className="okrHeader-kr-button" onClick={addKr}>
          <img
            src={addKrSvg}
            alt=""
            style={{ marginRight: "10px", width: "14px", height: "14px" }}
          />
          添加 Key Result
        </div>
      </div>
      <div className="okrTable-footer">
        <div>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={saveOkr}
          >
            发布
          </Button>
        </div>
      </div>
    </div>
  );
};
OInfo.defaultProps = {};
export default OInfo;
