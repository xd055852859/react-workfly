import React, { useState, useRef } from "react";
import "./okrHeader.css";
import "../workingTable/workingTableHeader.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _ from "lodash";

import tabb0Svg from "../../assets/svg/tab0.svg";
import tabb2Svg from "../../assets/svg/tab5.svg";
import tabb1Svg from "../../assets/svg/tab1.svg";
import okraddbSvg from "../../assets/svg/okraddb.svg";
import okrawwbSvg from "../../assets/svg/okrawwb.svg";
import okrStatisticsSvg from "../../assets/svg/okrStatistics.svg";
import tab0Svg from "../../assets/svg/tabw0.svg";
import tab2Svg from "../../assets/svg/tabw5.svg";
import tab1Svg from "../../assets/svg/tabw1.svg";

import DropMenu from "../../components/common/dropMenu";
import { Button, Divider, Drawer, Menu, Modal, Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import OInfo from "./oInfo";
import { setMessage } from "../../redux/actions/commonActions";
import api from "../../services/api";

const { Option } = Select;
interface OkrHeaderProps {
  slot: any;
  changeOkrHeader: any;
  periodList: any;
  historyPeriodList: any;
  setPeriodIndex: any;
  setHistoryPeriodIndex: any;
  periodIndex: number;
  ownerUKey: string;
  flashOkr: any;
  periodTitle: string;
  periodKey: string;
  createPeriod: any;
  memberRole: number;
  targetRole: number;
}
const OkrHeader: React.FC<OkrHeaderProps> = (props) => {
  const {
    slot,
    changeOkrHeader,
    historyPeriodList,
    periodList,
    setPeriodIndex,
    periodIndex,
    ownerUKey,
    periodTitle,
    flashOkr,
    periodKey,
    createPeriod,
    memberRole,
    targetRole,
    setHistoryPeriodIndex,
  } = props;
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [modelChooseVisible, setModelChooseVisible] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [okrList, setOkrList] = useState<any>([]);
  const [okrObj, setOkrObj] = useState<any>({});
  const [okrObjArr, setOkrObjArr] = useState<any>([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [chooseIndex, setChooseIndex] = useState<any>(null);
  const [title, setTitle] = useState<string>("请选择历史okr");
  let tabArrayRef = useRef<any>([
    { name: "目标", id: 0 },
    { name: "对齐", id: 1 },
    { name: "四象限", id: 2 },
  ]);
  let tabImgRef = useRef<any>([
    // tab7Svg,
    tab0Svg,
    tab2Svg,
    tab1Svg,
  ]);
  let tabbImgRef = useRef<any>([
    // tabb7Svg,
    tabb0Svg,
    tabb2Svg,
    tabb1Svg,
  ]);
  const saveOkr = async () => {
    let obj: any = {
      enterpriseGroupKey: mainEnterpriseGroup.mainEnterpriseGroupKey,
      ownerUKey: ownerUKey,
      periodKey: periodKey,
      krTitles: [{ title: "" }, { title: "" }, { title: "" }],
      oTitle: "",
    };
    let saveOkrRes: any = await api.okr.createOKR({ ...obj });
    if (saveOkrRes.msg === "OK") {
      dispatch(setMessage(true, "创建Okr成功", "success"));
      flashOkr();
    } else {
      dispatch(setMessage(true, saveOkrRes.msg, "error"));
    }
  };
  const saveModalOkr = async () => {
    let krTitles = [];
    okrObjArr[chooseIndex].children.forEach((item) => {
      krTitles.push({
        title: item.title,
      });
    });

    let obj: any = {
      enterpriseGroupKey: mainEnterpriseGroup.mainEnterpriseGroupKey,
      ownerUKey: ownerUKey,
      periodKey: periodKey,
      krTitles: krTitles,
      upLevelOKey: "",
      priority: 1,
      oTitle: okrObjArr[chooseIndex].title,
    };
    let saveOkrRes: any = await api.okr.createOKR({ ...obj });
    if (saveOkrRes.msg === "OK") {
      console.log(saveOkrRes.result);
      dispatch(setMessage(true, "模板创建Okr成功", "success"));
      setChooseIndex(null);
      setModelChooseVisible(false);
      // setModelVisible(false);
      flashOkr();
    } else {
      dispatch(setMessage(true, saveOkrRes.msg, "error"));
    }
  };
  const getOkrModelTree = async () => {
    let gridRes: any = await api.task.getTaskTreeList(
      "1318711563",
      "2362328396"
    );
    if (gridRes.msg === "OK") {
      let obj: any = {};
      let arr: any = [];
      gridRes.result.map((item, index) => {
        obj[item._key] = {
          ...item,
        };
      });
      obj["2362328396"].children.forEach((item, index) => {
        arr.push(obj[item]);
      });
      arr.unshift({ title: "全部", _key: "" });
      setOkrObj({ ...obj });
      setOkrList([...arr]);
      chooseModel(obj, "", arr);
      setModalIndex(0);
    } else {
      dispatch(setMessage(true, gridRes.msg, "error"));
    }
  };
  const chooseModel = async (okrObj, modelKey, okrList?: any) => {
    let arr = [];
    console.log(okrObj);
    if (modelKey) {
      okrObj[modelKey].children.forEach((item, index) => {
        let newArr = [];
        okrObj[item].children.forEach((okrItem, okrIndex) => {
          console.log(okrObj[okrItem]);
          if (okrObj[okrItem]) {
            newArr.push({
              _key: okrObj[okrItem]._key,
              title: okrObj[okrItem].title,
            });
          }
        });
        arr.push({
          title: okrObj[item].title,
          _key: okrObj[item]._key,
          children: newArr,
        });
      });
    } else {
      okrList.forEach((listItem) => {
        if (listItem._key) {
          okrObj[listItem._key].children.forEach((item) => {
            let newArr = [];
            okrObj[item].children.forEach((okrItem) => {
              console.log(okrObj[okrItem]);
              if (okrObj[okrItem]) {
                newArr.push({
                  _key: okrObj[okrItem]._key,
                  title: okrObj[okrItem].title,
                });
              }
            });
            arr.push({
              title: okrObj[item].title,
              _key: okrObj[item]._key,
              children: newArr,
            });
          });
        }
      });
    }

    setOkrObjArr(arr);
  };

  const handleChange = (value: string) => {
    console.log(+value);
    setHistoryPeriodIndex(+value);
    setTitle(historyPeriodList[+value].title);
  };
  const menu = (
    <React.Fragment>
      <Menu>
        {tabArrayRef.current.map((tabItem: any, index: number) => {
          return (
            <React.Fragment key={"tabTable" + index}>
              <Menu.Item
                className="viewTableHeader-tab"
                onClick={() => {
                  setTabIndex(index);
                  changeOkrHeader(index);
                }}
              >
                <img
                  src={tabbImgRef.current[index]}
                  alt=""
                  className="viewTableHeader-tab-logo"
                />
                <span style={{ marginLeft: "10px" }}>{tabItem.name}</span>
              </Menu.Item>
            </React.Fragment>
          );
        })}
      </Menu>
    </React.Fragment>
  );
  return (
    <div className="okrHeader">
      {/* <img src={calendarHomePng} alt="" className="calendarHeader-logo" /> */}
      {slot}
      <div
        style={{ height: "100%", display: "flex", alignItems: "center" }}
        onMouseEnter={() => {
          setMenuVisible(true);
          setTimeVisible(false);
          setCreateVisible(false);
        }}
        onMouseLeave={() => {
          setMenuVisible(false);
        }}
      >
        <div
          className="workingTableHeader-tag okrHeader-tag"
          onClick={() => {
            setMenuVisible(true);
            setTimeVisible(false);
            setCreateVisible(false);
          }}
        >
          <img
            src={tabImgRef.current[tabIndex]}
            alt=""
            style={{ width: "15px" }}
          />
          {tabArrayRef.current[tabIndex]?.name}
          <DropMenu
            visible={menuVisible}
            dropStyle={{
              width: "140px",
              height: "220px",
              top: "35px",
              left: "0px",
              color: "#333",
              overflow: "visible",
            }}
            onClose={() => {
              // setMenuVisible(false);
            }}
            title={"视图列表"}
          >
            {menu}
          </DropMenu>
        </div>
      </div>
      <div
        style={{ height: "100%", display: "flex", alignItems: "center" }}
        onMouseEnter={() => {
          setMenuVisible(false);
          setTimeVisible(true);
          setCreateVisible(false);
        }}
        onMouseLeave={() => {
          setTimeVisible(false);
        }}
      >
        <div
          className="workingTableHeader-tag  okrHeader-tag"
          onClick={() => {
            setMenuVisible(false);
            setTimeVisible(true);
            setCreateVisible(false);
          }}
        >
          {periodTitle}
          <img src={okrawwbSvg} alt="" style={{ marginLeft: "10px" }} />
          <DropMenu
            visible={timeVisible}
            dropStyle={{
              width: "220px",
              top: "35px",
              left: "0px",
              color: "#333",
              overflow: "visible",
              padding: "10px 15px",
              boxSizing: "border-box",
            }}
            onClose={() => {
              // setMenuVisible(false);
            }}
          >
            <>
              <div className="okr-time-title">当前周期</div>
              <div
                className="okr-time-item"
                onClick={() => {
                  setPeriodIndex(0);
                  localStorage.setItem("periodKey", periodList[0]._key);
                }}
                style={periodKey === periodList[0]?._key  ? { color: "#1890ff" } : {}}
              >
                {periodList[0]?.title}
              </div>
              <div
                className="okr-time-item"
                onClick={() => {
                  setPeriodIndex(1);
                  localStorage.setItem("periodKey", periodList[1]._key);
                }}
                style={periodKey === periodList[1]?._key ? { color: "#1890ff" } : {}}
              >
                {periodList[1]?.title}
              </div>

              <Divider className="okr-time-line" />
              <div className="okr-time-title">即将开始</div>
              <div
                onClick={() => {
                  setPeriodIndex(2);
                  localStorage.setItem("periodKey", periodList[2]._key);
                }}
              >
                {periodList[2]?.title}
              </div>
              {!periodList[2]?._key ? (
                <Button onClick={createPeriod}>创建未来周期</Button>
              ) : null}
              <Divider className="okr-time-line" />
              <div className="okr-time-item">
                <div>历史周期</div>
              </div>

              <Select
                value={title}
                placeholder="请选择历史周期"
                style={{ width: "100%" }}
                onChange={handleChange}
              >
                {historyPeriodList.map((item, index) => {
                  return <Option value={index}>{item.title}</Option>;
                })}
              </Select>
            </>
          </DropMenu>
        </div>
      </div>
      {targetRole < 5 ? (
        <div
          style={{ height: "100%", display: "flex", alignItems: "center" }}
          onMouseEnter={() => {
            setMenuVisible(false);
            setTimeVisible(false);
            setCreateVisible(true);
          }}
          onMouseLeave={() => {
            setCreateVisible(false);
          }}
        >
          <div
            className="workingTableHeader-tag  okrHeader-tag"
            onClick={() => {
              setMenuVisible(false);
              setTimeVisible(false);
              setCreateVisible(true);
            }}
          >
            <img src={okraddbSvg} alt="" style={{ marginLeft: "10px" }} />
            创建OKR
            <DropMenu
              visible={createVisible}
              dropStyle={{
                width: "150px",
                top: "35px",
                left: "0px",
                color: "#333",
                overflow: "visible",
                padding: "10px 15px",
                boxSizing: "border-box",
              }}
              onClose={() => {
                // setMenuVisible(false);
              }}
            >
              <>
                <div
                  className="okr-time-item"
                  onClick={() => {
                    setMenuVisible(false);
                    setTimeVisible(false);
                    saveOkr();
                  }}
                >
                  快速创建
                </div>
                <div
                  className="okr-time-item"
                  onClick={() => {
                    setModelVisible(true);
                    getOkrModelTree();
                  }}
                >
                  模板创建
                </div>
              </>
            </DropMenu>
          </div>
        </div>
      ) : null}
      <div
        className="dp-center-center"
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={() => {
          changeOkrHeader(3);
        }}
      >
        <img src={okrStatisticsSvg} alt="" />
      </div>
      <Drawer
        title="OKR模板库"
        width={414}
        onClose={() => {
          setModelVisible(false);
        }}
        visible={modelVisible}
        bodyStyle={{ padding: "15px 20px" }}
        destroyOnClose={true}
      >
        <div className="okr-modal-header">
          {okrList.map((item, index) => {
            return (
              <div
                className="okr-modal-tab"
                key={"okrItem" + index}
                style={
                  modalIndex === index
                    ? { backgroundColor: "#479eff", color: "#fff" }
                    : {}
                }
                onClick={() => {
                  setModalIndex(index);
                  chooseModel(okrObj, item._key);
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div>
          {okrObjArr.map((modelItem, modelIndex) => {
            return (
              <div
                className="okr-modal-tab-index"
                key={"modelItem" + modelIndex}
                onClick={() => {
                  setChooseIndex(modelIndex);
                  setModelChooseVisible(true);
                }}
              >
                <div className="okr-modal-tab-o">
                  <div className="okr-modal-o-title">O</div>
                  {modelItem.title}
                </div>
                {modelItem.children.map((modelKrItem, modelKrIndex) => {
                  return (
                    <div
                      key={"modelKrItem" + modelKrIndex}
                      className="okr-modal-tab-kr"
                    >
                      <div className="okr-modal-kr-title">KR</div>{" "}
                      {modelKrItem.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Drawer>
      <Modal
        visible={modelChooseVisible}
        onCancel={() => {
          setModelChooseVisible(false);
        }}
        onOk={() => {
          saveModalOkr();
        }}
        destroyOnClose={true}
        centered={true}
        title={"提示"}
        width={500}
        bodyStyle={{ height: "100px" }}
      >
        是否使用该模板创建OKR
      </Modal>
    </div>
  );
};
OkrHeader.defaultProps = {};
export default OkrHeader;
