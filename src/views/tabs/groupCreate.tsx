import React from "react";
import "./tabs.css";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../redux/reducer/RootState";
import _ from "lodash";
import api from "../../services/api";

import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
} from "../../redux/actions/commonActions";
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from "../../redux/actions/groupActions";
import Dialog from "../../components/common/dialog";
import DropMenu from "../../components/common/dropMenu";
import Loading from "../../components/common/loading";
import Contact from "../contact/contact";
import GroupSet from "./groupSet";
import GroupModel from "./groupModel";
import addGroup1Png from "../../assets/img/addGroup1.png";
import addGroup2Png from "../../assets/img/addGroup2.png";
import cloneGroupSvg from "../../assets/svg/cloneGroup.svg";
export interface GroupCreateProps {
  //onClose: Function;
  groupCreateVisible:boolean;
  setGroupCreateVisible:any
}
const GroupCreate: React.FC<GroupCreateProps> = (props) => {
  const { groupCreateVisible,setGroupCreateVisible } = props;
  const dispatch = useDispatch();
  // const classes = useStyles();
  const theme = useTypedSelector((state) => state.auth.theme);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [addVisible, setAddVisible] = React.useState(false);
  const [addModelVisible, setAddModelVisible] = React.useState(false);
  const [addGroupVisible, setAddGroupVisible] = React.useState(false);

  const [templateKey, setTemplateKey] = React.useState<any>(null);
  const [taskCheck, setTaskCheck] = React.useState(true);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const saveGroupSet = (obj: any) => {
    if (!isNaN(templateKey)) {
      obj.templateKey = templateKey;
      obj.isContainTask = taskCheck;
    }
    setGroupObj(obj);
  };
  const addGroup = async () => {
    let newGroupObj = _.cloneDeep(groupObj);
    if (mainEnterpriseGroup?.mainEnterpriseGroupKey) {
      newGroupObj.enterpriseGroupKey =
        mainEnterpriseGroup.mainEnterpriseGroupKey;
    }
    setLoading(true);
    if (
      !newGroupObj ||
      !newGroupObj.groupName ||
      !newGroupObj.groupName.trim()
    ) {
      dispatch(setMessage(true, "请输入项目名", "error"));
      setLoading(false);
      return;
    }
    let groupRes: any = await api.group.addGroup(newGroupObj);
    if (groupRes.msg === "OK") {
      setLoading(false);
      dispatch(setMessage(true, "创建项目成功", "success"));
      dispatch(setGroupKey(groupRes.result._key));
      dispatch(getGroupInfo(groupRes.result._key));
      dispatch(setCommonHeaderIndex(3));
      if (!theme.moveState) {
        dispatch(setMoveState("in"));
      }
      dispatch(getGroup(3));
      setAddVisible(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, groupRes.msg, "error"));
    }
  };
  return (
    <React.Fragment>
      <DropMenu
        visible={groupCreateVisible}
        onClose={() => {
          setGroupCreateVisible(false);
        }}
        dropStyle={{
          width: "calc(100% - 20px)",
          // height: '255px',
          top: "40px",
          left: "10px",
          color: "#333",
          zIndex: "10",
          borderRadius: "8px",
        }}
        title={"新建项目"}
      >
        <div
          className="addGroup-container dropDown-box"
          style={
            addGroupVisible
              ? { height: "397px", borderRadius: "0px" }
              : { borderRadius: "0px" }
          }
        >
          <div
            onClick={() => {
              setAddVisible(true);
              setGroupObj({});
              setGroupCreateVisible(false);
            }}
            className="addGroup-item"
          >
            <img className="addGroup-item-img" src={addGroup1Png} alt="" />
            <div className="addGroup-item-title">
              <div>自由创建</div>
              <div>创建一个全新的项目。</div>
            </div>
          </div>
          <div
            onClick={() => {
              setAddGroupVisible(true);
              setGroupCreateVisible(false);
            }}
            className="addGroup-item"
          >
            <img className="addGroup-item-img" src={cloneGroupSvg} alt="" />
            <div className="addGroup-item-title">
              <div>克隆项目</div>
              <div>会克隆项目、频道和成员等信息</div>
            </div>
          </div>
          <DropMenu
            visible={addGroupVisible}
            onClose={() => {
              setAddGroupVisible(false);
              setGroupCreateVisible(false);
            }}
            title={"克隆项目"}
            dropStyle={{
              width: "100%",
              height: "450px",
              top: "0px",
              left: "0px",
              color: "#333",
              overflow: "visible",
            }}
          >
            <Contact contactIndex={0} contactType={"create"} />
          </DropMenu>
          <div
            onClick={() => {
              setAddModelVisible(true);
              setGroupObj({});
              setGroupCreateVisible(false);
            }}
            className="addGroup-item"
          >
            <img className="addGroup-item-img" src={addGroup2Png} alt="" />
            <div className="addGroup-item-title">
              <div>通过模板</div>
              <div>通过模板创建一个项目。</div>
            </div>
          </div>
          {/* <div><img src={addGroup3Png} alt=""/><div><div></div><div></div></div></div> */}
        </div>
      </DropMenu>
      <Dialog
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
          // onClose();
        }}
        onOK={() => {
          addGroup();
          // onClose();
        }}
        title={"添加项目"}
        dialogStyle={{ width: "750px", height: "700px" }}
      >
        {loading ? <Loading></Loading> : null}
        <GroupSet saveGroupSet={saveGroupSet} type={"创建"} />
      </Dialog>
      <Dialog
        visible={addModelVisible}
        onClose={() => {
          setAddModelVisible(false);
          // onClose();
        }}
        title={"模板创项目"}
        dialogStyle={{ width: "80%", height: "80%" }}
        footer={false}
      >
        <GroupModel
          toGroupSet={(key: string, taskCheck: boolean) => {
            setAddVisible(true);
            setAddModelVisible(false);
            setTemplateKey(key);
            setTaskCheck(taskCheck);
          }}
        />
      </Dialog>
    </React.Fragment>
  );
};
export default GroupCreate;
