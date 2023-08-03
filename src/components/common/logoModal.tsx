import React, { useState } from "react";
import "./logoModal.css";
import emojiList from "./emoji";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { Modal, Tabs, Tooltip } from "antd";
import api from "../../services/api";

import { setMessage } from "../../redux/actions/commonActions";
import { changeGroupInfo, getGroup } from "../../redux/actions/groupActions";
import { useMount } from "../../hook/common";

import iconunCheckSvg from "../../assets/svg/iconunCheck.svg";
const { TabPane } = Tabs;
interface LogoModelProps {
  setGroupLogo?: any;
  visible: boolean;
  changeVisible: any;
  type: string;
}

const LogoModel: React.FC<LogoModelProps> = (props) => {
  const { setGroupLogo, visible, changeVisible, type } = props;
  const dispatch = useDispatch();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [thirdPngPage, setThirdPngPage] = useState<number>(1);
  const [thirdPngTotal, setThirdPngTotal] = useState<number>(0);
  const [thirdPngList, setThirdPngList] = useState<any>([]);
  let keyword = "";
  // const [keyword, setkeyword] = useState("");

  useMount(() => {
    getloginModal(1);
  });
  const getloginModal = async (page) => {
    let res: any = await api.thirdApi.getThirdRandomPng(page);
    if (res.msg === "OK") {
      setThirdPngList((prevThirdPngList) => {
        if (page === 1) {
          prevThirdPngList = [];
        }
        return [...prevThirdPngList, ...res.data.reverse()];
      });
      setThirdPngTotal(res.totalNum);
    } else {
      dispatch(setMessage(true, "获取图片失败", "error"));
    }
  };
  const scrollloginModal = (e: any) => {
    let page = thirdPngPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      thirdPngList.length < thirdPngTotal
    ) {
      page = page + 1;
      setThirdPngPage(page);
      getloginModal(page);
    }
  };
  const saveGroupLogo = (url) => {
    changeVisible(false);
    if (type === "设置") {
      dispatch(changeGroupInfo(groupKey, { groupLogo: url }));
      dispatch(getGroup(3));
    }
    if (setGroupLogo) {
      setGroupLogo(url);
    }
  };
  return (
    <Modal
      visible={visible}
      title={"选择图标"}
      footer={null}
      onCancel={() => {
        changeVisible(false);
      }}
      centered={true}
      width="850px"
      bodyStyle={{
        height: "85vh",
        padding: "0px",
      }}
      destroyOnClose={true}
    >
      <div className="loginModal">
        {/* <div className="loginModal-button">
                    <Avatar name="图标" avatar={thirdPngUrl} type={'group'} index={0} size={40} />
                    <Button
                        size="large"
                        shape="circle"
                        style={{ border: "0px" }}
                        ghost
                        icon={<IconFont type="icon-baocun1" style={{ fontSize: "25px" }} />}
                        onClick={() => {
                            saveGroupLogo()
                        }}
                    />
                </div> */}
        <Tabs defaultActiveKey="1" tabPosition={"left"}>
          <TabPane tab="emoji" key="1">
            <div className="loginModal-container">
              {emojiList.map((emoji, index) =>
                emoji.label.includes(keyword) || !keyword ? (
                  <Tooltip
                    title={
                      emoji.label.match(/[\u4e00-\u9fa5]/g)?.join("") || ""
                    }
                    key={index}
                  >
                    <div
                      className="loginModal-container-item"
                      onClick={() => saveGroupLogo(emoji.emoji)}
                      style={{ fontSize: "50px" }}
                    >
                      {emoji.emoji}
                    </div>
                  </Tooltip>
                ) : null
              )}
            </div>
          </TabPane>
          <TabPane tab="图片" key="2">
            <div className="loginModal-container" onScroll={scrollloginModal}>
              {thirdPngList
                ? thirdPngList.map(
                    (thirdPngItem: any, thirdPngIndex: number) => {
                      return (
                        <div
                          className="loginModal-container-item"
                          key={"loginModal" + thirdPngIndex}
                        >
                          <div className="loginModal-container-mask">
                            <img
                              src={iconunCheckSvg}
                              alt=""
                              onClick={(e) => {
                                saveGroupLogo(thirdPngItem.url);
                                // setThirdPngUrl(thirdPngItem.url)
                                // if (setGroupLogo) {
                                //     setGroupLogo(thirdPngItem.url)
                                // }
                              }}
                            />
                          </div>
                          <img src={thirdPngItem.url} alt="" />
                        </div>
                        // <ImagePng
                        //   width={200}
                        //   src={thirdPngItem.urls.thumb}
                        //   preview={{
                        //     src: thirdPngItem.urls.full,
                        //   }}
                        // />
                      );
                    }
                  )
                : null}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};
LogoModel.defaultProps = {};
export default LogoModel;
