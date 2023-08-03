import React, { useState, useEffect, useRef } from "react";
import "./groupSet.css";
import { useDispatch } from "react-redux";
import { Checkbox, Input, Radio, Select } from "antd";

import { useMount } from "../../hook/common";

import Cropper from "react-cropper";

import { setMessage } from "../../redux/actions/commonActions";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { getUploadToken } from "../../redux/actions/authActions";

import uploadFile from "../../components/common/upload";
import DropMenu from "../../components/common/dropMenu";
import Dialog from "../../components/common/dialog";

import plusPng from "../../assets/img/contact-plus.png";
import editImgPng from "../../assets/img/editImg.png";
import LogoModel from "../../components/common/logoModal";
const { TextArea } = Input;
const { Option } = Select;
interface GroupSetProps {
  saveGroupSet: any;
  type: string;
  groupInfo?: any;
}

const GroupSet: React.FC<GroupSetProps> = (props) => {
  const { saveGroupSet, type, groupInfo } = props;
  const dispatch = useDispatch();

  // const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [groupName, setGroupName] = useState("新项目");
  const [statisticsSonGroupEnergy, setStatisticsSonGroupEnergy] =
    useState(false);
  const [groupDesc, setGroupDesc] = useState("");
  const [groupLogo, setGroupLogo] = useState(
    "https://cdn-icare.qingtime.cn/1622592874328.svg"
  );
  const [modelUrl, setModelUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [joinType, setJoinType] = useState("1");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [isHasPassword, setIsHasPassword] = useState(false);
  const [isLinkJoin, setIsLinkJoin] = useState(false);
  const [defaultPower, setDefaultPower] = useState(4);
  const [defaultPowerVisible, setDefaultPowerVisible] = useState(false);
  const [defaultPngVisible, setDefaultPngVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState<any>(false);

  const [upImg, setUpImg] = useState<any>(null);

  const [isCustomService, setIsCustomService] = useState<boolean>(false);
  const setRef: React.RefObject<any> = useRef();
  const cropperRef = useRef<HTMLImageElement>(null);
  const roleArray = [
    // {
    //   name: '管理员',
    //   role: 2,
    // },
    {
      name: "编辑",
      role: 3,
    },
    {
      name: "作者",
      role: 4,
    },
    {
      name: "成员(只读)",
      role: 5,
    },
  ];
  useMount(() => {
    dispatch(getUploadToken());
  });
  useEffect(() => {
    if ((type === "设置" || type === "企业") && groupInfo) {
      setGroupName(groupInfo.groupName ? groupInfo.groupName : "");
      setGroupDesc(groupInfo.groupDesc ? groupInfo.groupDesc : "");
      setGroupLogo(groupInfo.groupLogo ? groupInfo.groupLogo : "");
      setModelUrl(groupInfo.modelUrl ? groupInfo.modelUrl : "");
      setStatisticsSonGroupEnergy(
        groupInfo.statisticsSonGroupEnergy
          ? groupInfo.statisticsSonGroupEnergy
          : false
      );
      setIsOpen(groupInfo.isOpen ? groupInfo.isOpen : false);
      setJoinType(
        groupInfo.joinType || groupInfo.joinType === 0
          ? groupInfo.joinType + ""
          : "1"
      );
      setPassword(groupInfo.password ? groupInfo.password : "");
      setQuestion(groupInfo.question ? groupInfo.question : "");
      setIsHasPassword(
        groupInfo.isHasPassword ? groupInfo.isHasPassword : false
      );
      setIsLinkJoin(groupInfo.isLinkJoin ? groupInfo.isLinkJoin : false);
      setDefaultPower(groupInfo.defaultPower ? groupInfo.defaultPower : 5);
      setIsCustomService(
        groupInfo.isCustomService ? groupInfo.isCustomService : false
      );
    }
  }, [type, groupInfo]);
  const changeGroupName = (e: any) => {
    let newGroupName = e.target.value;
    if (newGroupName.indexOf("___") !== -1) {
      return;
    }
    setGroupName(newGroupName);
    setGroupSet("groupName", newGroupName);
  };
  const changeGroupDesc = (e: any) => {
    let newGroupDesc = e.target.value;
    setGroupDesc(newGroupDesc);
    setGroupSet("groupDesc", newGroupDesc);
  };
  const changeOpen = (e: any) => {
    let newIsOpen = e.target.checked;
    // let newJoinType = joinType;
    // if (!newIsOpen) {
    //   newJoinType = "1";
    // } else {
    //   newJoinType = "0";
    // }
    setIsOpen(newIsOpen);
    setGroupSet("isOpen", newIsOpen);
    // setGroupSet("joinType", parseInt(newJoinType));
  };
  const changeJoinType = (e: any) => {
    let newJoinType = e.target.value;
    setJoinType(newJoinType);
    setGroupSet("joinType", parseInt(newJoinType));
  };
  const changeIsPassword = (e: any) => {
    let newIsHasPassword = e.target.checked;
    setIsHasPassword(newIsHasPassword);
    setGroupSet("isHasPassword", newIsHasPassword);
  };
  const changePassword = (e: any) => {
    let newPassword = e.target.value;
    setPassword(newPassword);
    setGroupSet("password", newPassword);
  };
  const changeQuestion = (e: any) => {
    let newQuestion = e.target.value;
    setQuestion(newQuestion);
    setGroupSet("question", newQuestion);
  };

  const changeRole = (value: any) => {
    let newDefaultPower = value;
    setDefaultPower(newDefaultPower);
    setGroupSet("defaultPower", newDefaultPower);
    setDefaultPowerVisible(false);
  };

  // const uploadImg = (e: any) => {
  //   let mimeType = ['image/png', 'image/jpeg'];
  //   let item = {};
  //   let file = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function (theFile: any) {
  //     let image = new Image();
  //     image.src = theFile.target.result;
  //     image.onload = function () {
  //       uploadFile.uploadImg(file, uploadToken, mimeType, function (url: any) {
  //         setGroupLogo(url);
  //         setGroupSet('groupLogo', url);
  //       });
  //     };
  //   };
  // };
  const chooseImg = (e: any) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      setPhotoVisible(true);
      fileReader.onload = (e: any) => {
        const dataURL = e.target.result;
        setUpImg(dataURL);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    } else {
      dispatch(setMessage(true, "请选择文件", "error"));
    }
  };
  const dataURLtoFile = (dataurl: string, filename = "file") => {
    let arr: any = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split("/")[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  };
  const uploadImg = () => {
    let mimeType = ["image/png", "image/jpeg"];
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      minWidth: 100,
      minHeight: 200,
      width: 400,
      height: 800,
      maxWidth: 800,
      maxHeight: 800,
    });
    let dataURL = croppedCanvas.toDataURL("image/png");
    let imgFile = dataURLtoFile(dataURL);

    uploadFile.uploadImg(
      imgFile,
      mimeType,
      function (url: string) {
        dispatch(setMessage(true, "图片上传成功", "success"));
        setGroupLogo(url);
        setGroupSet("groupLogo", url);
      }
    );
  };
  // const uploadModelImg = (e: any) => {
  //   let mimeType = ["image/png", "image/jpeg"];
  //   let item = {};
  //   let file = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function (theFile: any) {
  //     let image = new Image();
  //     image.src = theFile.target.result;
  //     image.onload = function () {
  //       uploadFile.uploadImg(file, uploadToken, mimeType, function (url: any) {
  //         setModelUrl(url);
  //         setGroupSet("modelUrl", url);
  //       });
  //     };
  //   };
  // };

  const setGroupSet = (type: string, value: any) => {
    let obj: any = {
      groupName: groupName,
      groupDesc: groupDesc,
      groupLogo: groupLogo,
      modelUrl: modelUrl,
      isOpen: isOpen,
      joinType: parseInt(joinType),
      password: password,
      question: question,
      isHasPassword: isHasPassword,
      isLinkJoin: isLinkJoin,
      defaultPower: defaultPower,
      statisticsSonGroupEnergy: statisticsSonGroupEnergy,
      isCustomService: isCustomService,
    };
    obj[type] = value;
    saveGroupSet(obj);
  };

  return (
    <React.Fragment>
      <div className="contact-dialog-content" ref={setRef}>
        <div className="contact-dialog-info">
          <div className="contact-dialog-container">
            {type !== "企业" ? (
              <React.Fragment>
                <div
                  className="contact-name-content"
                  style={{ marginBottom: "5px" }}
                >
                  <div className="contact-name-title">项目图标</div>
                  <div
                    className="contact-dialog-logo"
                    onClick={() => {
                      if (
                        ((groupRole === 1 || groupRole === 2) &&
                          type === "设置") ||
                        type === "创建"
                      ) {
                        setDefaultPngVisible(true);
                      }
                    }}
                    style={{ border: groupLogo ? 0 : "1px solid #d9d9d9" }}
                  >
                    <img
                      src={editImgPng}
                      className="contact-dialog-icon"
                      alt=""
                    />
                    {groupLogo ? (
                      groupLogo.indexOf("https") !== -1 ? (
                        <img
                          src={groupLogo}
                          className="contact-dialog-groupLogo"
                          alt=""
                        />
                      ) : (
                        <div style={{ fontSize: "50px" }}>{groupLogo}</div>
                      )
                    ) : (
                      <img
                        src={plusPng}
                        className="contact-dialog-add"
                        alt=""
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={chooseImg}
                      onClick={(e: any) => {
                        e.stopPropagation();
                      }}
                      className="upload-img"
                      disabled={
                        groupRole !== 1 && groupRole !== 2 && type === "设置"
                      }
                    />
                  </div>
                </div>

                <div
                  className="contact-name-content"
                  style={{ marginBottom: "5px" }}
                >
                  <div className="contact-name-title">项目名称</div>
                  <Input
                    // required
                    placeholder="请输入项目名称"
                    style={{ width: "calc(100% - 90px)" }}
                    value={groupName}
                    onChange={changeGroupName}
                    disabled={
                      groupRole !== 1 && groupRole !== 2 && type === "设置"
                    }
                  />
                </div>
              </React.Fragment>
            ) : null}

            <div className="contact-name-content">
              <div className="contact-name-title">项目属性</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={isOpen}
                  onChange={changeOpen}
                  disabled={
                    groupRole !== 1 && groupRole !== 2 && type === "设置"
                  }
                >
                  全平台可见
                </Checkbox>
              </div>
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">项目简介</div>
              <TextArea
                autoSize={{ minRows: 3 }}
                placeholder="请输入项目描述"
                style={{ width: "calc(100% - 90px)", fontSize: "12px" }}
                value={groupDesc}
                onChange={changeGroupDesc}
                disabled={groupRole !== 1 && groupRole !== 2 && type === "设置"}
              />
            </div>
            {/* <div className="contact-name-content" style={{ height: '250px' }}>
            <div className="contact-name-title">项目概念图</div>
            <div className="contact-model">
              <img
                src={plusPng}
                className="contact-dialog-add"
                style={{ zIndex: 2 }}
              />
              {modelUrl ? (
                <img
                  src={modelUrl}
                  className="contact-dialog-groupLogo"
                  style={{ borderRadius: '0px' }}
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={uploadModelImg}
                className="upload-img"
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
                style={{
                  width: '100%',
                  height: '100%',
                  top: '0px',
                  left: '0px',
                }}
              />
            </div>
          </div> */}
            <div className="contact-name-content">
              <div className="contact-name-title">新群成员默认权限</div>
              <Select
                style={{ width: 120 }}
                onChange={(value: number) => {
                  changeRole(value);
                }}
                value={defaultPower}
                getPopupContainer={() => setRef.current}
                disabled={groupRole !== 1 && groupRole !== 2 && type === "设置"}
              >
                {roleArray.map((roleItem: any, roleIndex: number) => {
                  return (
                    <Option value={roleItem.role} key={"role" + roleIndex}>
                      {roleItem.name}
                    </Option>
                  );
                })}
              </Select>
              <DropMenu
                visible={defaultPowerVisible}
                dropStyle={{
                  width: "300px",
                  height: "100px",
                  top: "40px",
                  left: "100px",
                }}
                onClose={() => {
                  setDefaultPowerVisible(false);
                }}
              >
                <div className="contact-role"></div>
              </DropMenu>
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">项目特性</div>
              <Radio.Group onChange={changeJoinType} value={joinType}>
                {isOpen ? (
                  <Radio
                    value="0"
                    disabled={
                      groupRole !== 1 && groupRole !== 2 && type === "设置"
                    }
                  >
                    开放加入
                  </Radio>
                ) : null}
                <Radio
                  value="1"
                  disabled={
                    groupRole !== 1 && groupRole !== 2 && type === "设置"
                  }
                >
                  审核加入
                </Radio>
              </Radio.Group>
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">加入方式</div>

              <Checkbox
                checked={isHasPassword}
                onChange={changeIsPassword}
                disabled={groupRole !== 1 && groupRole !== 2 && type === "设置"}
              >
                口令加入
              </Checkbox>
              {isHasPassword ? (
                <React.Fragment>
                  <Input
                    placeholder="请输入口令问题"
                    style={{ margin: "0px 10px", width: "180px" }}
                    value={question}
                    onChange={changeQuestion}
                    disabled={
                      groupRole !== 1 && groupRole !== 2 && type === "设置"
                    }
                  />
                  <Input
                    placeholder="请输入口令"
                    style={{ width: "150px" }}
                    value={password}
                    onChange={changePassword}
                    disabled={
                      groupRole !== 1 && groupRole !== 2 && type === "设置"
                    }
                  />
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </div>
        <Dialog
          visible={photoVisible}
          onClose={() => {
            setPhotoVisible(false);
          }}
          onOK={() => {
            uploadImg();
            setPhotoVisible(false);
          }}
          title={"选择图片"}
          dialogStyle={{
            width: "500px",
            height: "95vh",
          }}
        >
          <Cropper
            style={{ width: "100%", height: "75vh" }}
            // preview=".uploadCrop"
            guides={true}
            src={upImg}
            ref={cropperRef}
            // aspectRatio={16 / 9}
            preview=".img-preview"
          />
        </Dialog>
      </div>
      <LogoModel
        setGroupLogo={setGroupLogo}
        visible={defaultPngVisible}
        changeVisible={setDefaultPngVisible}
        type={type}
      />
    </React.Fragment>
  );
};
export default GroupSet;
