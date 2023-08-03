import React, { useState, useEffect, useRef, useCallback } from "react";
import "./groupModel.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { Button, Checkbox, Pagination } from "antd";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { useMount } from "../../hook/common";

import { setMessage } from "../../redux/actions/commonActions";
import unfinishbPng from "../../assets/img/unfinishb.png";
import leftArrowPng from "../../assets/img/leftArrow.png";
import modelDefaultPng from "../../assets/img/modelDefault.png";
import clickNumSvg from "../../assets/svg/clickNum.svg";
import useNumSvg from "../../assets/svg/useNum.svg";
import searchbSvg from "../../assets/svg/searchb.svg";
interface GroupModelProps {
  toGroupSet: any;
}
const GroupModel: React.FC<GroupModelProps> = (props) => {
  const { toGroupSet } = props;
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.auth.theme);
  const [modelTypeArr, setModelTypeArr] = useState<any>([]);
  const [modelTypeList, setModelTypeList] = useState<any>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);
  // const [modelType, setModelType] = useState<any>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [modelInfoIndex, setModelInfoIndex] = useState<any>(null);
  const [modelState, setModelState] = useState(false);

  const [taskCheck, setTaskCheck] = useState(true);
  const [modelTotal, setModelTotal] = useState(0);
  const [modelInput, setModelInput] = useState("");

  const BgColorArray = [
    "rgba(48,191,191,0.3)",
    "rgba(0,170,255,0.3)",
    "rgba(143,126,230,0.3)",
    "rgba(179,152,152,0.3)",
    "rgba(242,237,166,0.3)",
  ];
  let unDistory = useRef<any>(true);

  useMount(() => {
    return () => {
      unDistory.current = false;
    };
  });
  const getModelType = async () => {
    let res: any = await api.group.getTemplateTypeList();
    if (unDistory.current) {
      if (res.msg === "OK") {
        res.result.unshift("全部");
        setModelTypeArr(res.result);
        // setModelType(res.result[0]);
        getModelTypeList(1, null);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    }
  };
  const getModelTypeList = useCallback(
    async (page: number, type: any) => {
      type = type === "全部" ? null : type;
      let res: any = await api.group.getTemplateListAccordingType(page, type);
      if (res.msg === "OK") {
        setModelTypeList(res.result);
        setModelTotal(res.totalNumber);
      } else {
        dispatch(setMessage(true, res.msg, "error"));
      }
    },
    [dispatch]
  );
  useMount(() => {
    getModelType();
  });
  useEffect(() => {
    if (modelInput === "") {
      getModelTypeList(1, "全部");
    }
  }, [modelInput, getModelTypeList]);

  const searchModel = async (page: number) => {
    if (modelInput === "") {
      dispatch(setMessage(true, "请输入搜索内容", "error"));
      return;
    }

    setModelIndex(0);
    setModelState(false);
    setModelInfo(null);
    let res: any = await api.group.getTemplateList(modelInput, page);
    if (res.msg === "OK") {
      setModelTypeList(res.result);
      setModelTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, "error"));
    }
  };
  return (
    <div className="groupModel">
      <div className="groupModel-search">
        <input
          type="text"
          value={modelInput}
          placeholder="搜索..."
          onChange={(e: any) => {
            setModelInput(e.target.value);
          }}
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              searchModel(1);
            }
          }}
        />
        <img
          src={searchbSvg}
          alt=""
          style={{
            width: "18px",
            height: "18px",
            cursor: "pointer",
          }}
          onClick={() => {
            searchModel(1);
          }}
        />
      </div>
      <div className="groupModel-left">
        {modelTypeArr.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                // setModelType(item);
                getModelTypeList(1, item);

                setModelIndex(index);
                setModelState(false);
              }}
              className="groupModel-left-item"
              style={
                modelIndex === index
                  ? { background: "#ffffff", color: "#1890ff" }
                  : {}
              }
              key={"modelTypeArr" + index}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="groupModel-right">
        {!modelState ? (
          <React.Fragment>
            <div className="groupModel-right-box">
              {modelTypeList.map((item: any, index: number) => {
                return (
                  <div
                    className="groupModel-right-item"
                    onMouseEnter={() => {
                      setModelInfoIndex(index);
                    }}
                    onMouseLeave={() => {
                      setModelInfoIndex(null);
                    }}
                    onClick={() => {
                      setModelState(true);
                      setModelInfo(item);
                      api.group.clickPersonNumber(item._key);
                    }}
                    key={"modelType" + index}
                  >
                    <div className="groupModel-right-item-img">
                      <img
                        src={item.modelUrl ? item.modelUrl : modelDefaultPng}
                        alt=""
                      />
                      {modelInfoIndex === index ? (
                        <div className="groupModel-right-item-button">
                          {item.name}
                        </div>
                      ) : null}
                    </div>
                    <div className="groupModel-right-item-name">
                      {item.name}
                    </div>
                    <div className="groupModel-right-item-description">
                      {item.description
                        .replace(/<[^>]*>|<\/[^>]*>/gm, "")
                        .replace("Powered by Froala Editor", "")}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="groupModel-pagination">
              <Pagination
                total={modelTotal}
                onChange={(page: number) => {
                  if (modelInput) {
                    searchModel(page);
                  } else {
                    getModelTypeList(page, modelTypeArr[modelIndex]);
                  }
                }}
              />
            </div>
          </React.Fragment>
        ) : (
          <div className="groupModel-right-info">
            <div className="groupModel-right-info-title">
              <div className="groupModel-right-info-maintitle">
                <img
                  src={leftArrowPng}
                  alt=""
                  style={{ width: "7px", height: "11px", cursor: "pointer" }}
                  onClick={() => {
                    setModelState(false);
                    setModelInfo(null);
                  }}
                />
                <div className="groupModel-right-info-name">
                  {modelInfo.name}
                </div>
              </div>
              <div className="groupModel-right-info-button">
                <img src={useNumSvg} alt="" />
                <div>
                  {modelInfo.usePersonNumber ? modelInfo.usePersonNumber : 0}
                </div>
                <img src={clickNumSvg} alt="" />
                <div style={{ marginRight: "10px" }}>
                  {modelInfo.clickPersonNumber
                    ? modelInfo.clickPersonNumber + 1
                    : 1}
                </div>
                <Checkbox
                  checked={taskCheck}
                  onClick={(e) => {
                    setTaskCheck(!taskCheck);
                  }}
                  type="primary"
                  // className={classes.root}
                >
                  含卡片内容
                </Checkbox>
                <Button
                  type="primary"
                  style={{
                    width: "196px",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    toGroupSet(modelInfo._key, taskCheck);
                  }}
                >
                  使用此模板
                </Button>
              </div>
            </div>
            <div className="groupModel-right-container">
              <div
                className="groupModel-model"
                style={
                  theme.backgroundImg
                    ? {
                        backgroundImage: "url(" + theme.backgroundImg + ")",
                      }
                    : {
                        backgroundColor: theme.backgroundColor
                          ? theme.backgroundColor
                          : "#3C3C3C",
                      }
                }
              >
                {modelInfo.templateJson.map(
                  (templateItem: any, templateIndex: number) => {
                    return (
                      <div
                        key={"template" + templateIndex}
                        className="groupModel-model-container"
                      >
                        <div
                          className="groupModel-model-taskNav"
                          style={{
                            backgroundColor: BgColorArray[templateIndex % 5],
                          }}
                        >
                          {templateItem.name}
                        </div>
                        <div className="groupModel-model-taskContainer">
                          {templateItem.children.map(
                            (childItem: any, childIndex: number) => {
                              return (
                                <div
                                  key={"child" + childIndex}
                                  className="groupModel-model-task"
                                >
                                  <img
                                    src={unfinishbPng}
                                    className="groupModel-model-logo"
                                    alt=""
                                  />
                                  <div className="groupModel-model-task-title">
                                    {childItem.name}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: modelInfo.description }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
GroupModel.defaultProps = {};
export default GroupModel;
