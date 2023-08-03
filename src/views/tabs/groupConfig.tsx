import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./groupSet.css";
import { useDispatch } from "react-redux";
import { Input, Select } from "antd";
import { useMount } from "../../hook/common";

import Cropper from "react-cropper";

import { setMessage } from "../../redux/actions/commonActions";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { getUploadToken } from "../../redux/actions/authActions";

import uploadFile from "../../components/common/upload";
import Dialog from "../../components/common/dialog";

import plusPng from "../../assets/img/contact-plus.png";
import editImgPng from "../../assets/img/editImg.png";
import LogoModel from "../../components/common/logoModal";
const { Option } = Select;
interface GroupConfigProps {
  type: string;
  saveGroupSet: any;
}

const GroupConfig = forwardRef((props: GroupConfigProps, ref) => {
  const { type, saveGroupSet } = props;
  const dispatch = useDispatch();

  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [groupName, setGroupName] = useState("新企业");
  const [groupLogo, setGroupLogo] = useState(
    "https://cdn-icare.qingtime.cn/1622592874328.svg"
  );
  const [groupType, setGroupType] = useState("企业");
  const [groupCity, setGroupCity] = useState("");
  const [groupAddress, setGroupAddress] = useState("");
  const [groupManager, setGroupManager] = useState("");
  const [groupPhone, setGroupPhone] = useState("");
  const [groupEmail, setGroupEmail] = useState("");
  const [groupUrl, setGroupUrl] = useState("");
  const [groupCompanyType, setGroupCompanyType] = useState("互联网IT");
  const [groupMemberNum, setGroupMemberNum] = useState("1～49人");
  const [defaultPngVisible, setDefaultPngVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState<any>(false);
  const [upImg, setUpImg] = useState<any>(null);
  const groupCompanyTypeArray = [
    "互联网IT",
    "金融",
    "房地产/建筑",
    "贸易/零售/物流",
    "教育/传媒/广告",
    "服务业",
    "市场/销售",
    "人事/财务/行政",
    "其他类型",
  ];
  const groupMemberNumArray = [
    "1~49人",
    "50人～200人",
    "200人～500人",
    "500人～2000人",
    "2000人～以上",
  ];
  const setRef: React.RefObject<any> = useRef();
  const cropperRef = useRef<HTMLImageElement>(null);

  useImperativeHandle(ref, () => ({
    changeCompanyConfig: () => {
      if (groupName === "") {
        dispatch(setMessage(true, "请输入企业名", "error"));
      }
      if (groupLogo === "") {
        dispatch(setMessage(true, "请上传图片", "error"));
      }
      let obj: any = {
        groupName: groupName,
        groupLogo: groupLogo,
        groupType: groupType,
        groupCity: groupCity,
        groupAddress: groupAddress,
        groupManager: groupManager,
        groupPhone: groupPhone,
        groupEmail: groupEmail,
        groupUrl: groupUrl,
        groupCompanyType: groupCompanyType,
        groupMemberNum: groupMemberNum,
      };
      saveGroupSet(obj, "group");
    },
  }));

  useMount(() => {
    dispatch(getUploadToken());
  });
  useEffect(() => {
    if (type === "设置" && groupInfo) {
      setGroupName(groupInfo.groupName ? groupInfo.groupName : "");
      setGroupLogo(groupInfo.groupLogo ? groupInfo.groupLogo : "");
      setGroupType(groupInfo.groupType ? groupInfo.groupType : "企业");
      setGroupCity(groupInfo.groupCity ? groupInfo.groupCity : "");
      setGroupAddress(groupInfo.groupAddress ? groupInfo.groupAddress : "");
      setGroupManager(groupInfo.groupManager ? groupInfo.groupManager : "");
      setGroupPhone(groupInfo.groupPhone ? groupInfo.groupPhone : "");
      setGroupEmail(groupInfo.groupEmail ? groupInfo.groupEmail : "");
      setGroupUrl(groupInfo.groupUrl ? groupInfo.groupUrl : "");
      setGroupCompanyType(
        groupInfo.groupCompanyType ? groupInfo.groupCompanyType : "互联网IT"
      );
      setGroupMemberNum(
        groupInfo.groupMemberNum ? groupInfo.groupMemberNum : "1~49人"
      );
    }
  }, [type, groupInfo]);
  const changeGroupName = (e: any) => {
    let newGroupName = e.target.value;
    if (newGroupName.indexOf("___") !== -1) {
      return;
    }
    setGroupName(newGroupName);
    // setGroupSet("groupName", newGroupName);
  };

  const changeGroupInput = (
    value: string | number,
    calc: any,
    type: string
  ) => {
    calc(value);
    // setGroupSet(type, value);
  };

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
        // setGroupSet("groupLogo", url);
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
  // const setGroupSet = (type: string, value: any) => {
  //   let obj: any = {
  //     groupName: groupName,
  //     groupLogo: groupLogo,
  //     groupType: groupType,
  //     groupCity: groupCity,
  //     groupAddress: groupAddress,
  //     groupManager: groupManager,
  //     groupPhone: groupPhone,
  //     groupEmail: groupEmail,
  //     groupUrl: groupUrl,
  //     groupCompanyType: groupCompanyType,
  //     groupMemberNum: groupMemberNum,
  //   };
  //   obj[type] = value;
  //   saveGroupSet(obj);
  // };

  return (
    <React.Fragment>
      <div className="contact-dialog-content" ref={setRef}>
        <div className="contact-dialog-info">
          <div className="contact-dialog-container">
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">企业图标</div>
              <div
                className="contact-dialog-logo"
                onClick={() => {
                  if (
                    (groupRole === 1 && type === "设置") ||
                    type === "创建" ||
                    type === "创建企业"
                  ) {
                    setDefaultPngVisible(true);
                  }
                }}
                style={{ border: groupLogo ? 0 : "1px solid #d9d9d9" }}
              >
                <img src={plusPng} className="contact-dialog-add" alt="" />
                <img src={editImgPng} className="contact-dialog-icon" alt="" />
                {groupLogo ? (
                  <img
                    src={groupLogo}
                    className="contact-dialog-groupLogo"
                    alt=""
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={chooseImg}
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                  className="upload-img"
                  disabled={groupRole !== 1 && type === "设置"}
                />
              </div>
            </div>

            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">企业名称</div>
              <Input
                // required
                placeholder="请输入项目名称"
                style={{ width: "calc(100% - 120px)" }}
                value={groupName}
                onChange={changeGroupName}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">主体类型</div>
              <Select
                style={{ width: "calc(100% - 120px)" }}
                onChange={(value) => {
                  changeGroupInput(value, setGroupType, "groupType");
                }}
                value={groupType}
                getPopupContainer={() => setRef.current}
              >
                <Option value="企业">企业</Option>
                <Option value="机构">机构</Option>
                <Option value="组织">组织</Option>
                <Option value="学校">学校</Option>
              </Select>
            </div>

            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">所在城市</div>
              <Input
                // required
                placeholder="请输入所在城市"
                style={{ width: "calc(100% - 120px)" }}
                value={groupCity}
                onChange={(e) => {
                  changeGroupInput(e.target.value, setGroupCity, "groupCity");
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">企业地址</div>
              <Input
                // required
                placeholder="请输入企业地址"
                style={{ width: "calc(100% - 120px)" }}
                value={groupAddress}
                onChange={(e) => {
                  changeGroupInput(
                    e.target.value,
                    setGroupAddress,
                    "groupAddress"
                  );
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">企业负责人</div>
              <Input
                // required
                placeholder="请输入企业负责人"
                style={{ width: "calc(100% - 120px)" }}
                value={groupManager}
                onChange={(e) => {
                  changeGroupInput(
                    e.target.value,
                    setGroupManager,
                    "groupManager"
                  );
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">联系电话</div>
              <Input
                // required
                placeholder="请输入联系电话"
                style={{ width: "calc(100% - 120px)" }}
                value={groupPhone}
                onChange={(e) => {
                  changeGroupInput(e.target.value, setGroupPhone, "groupPhone");
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">邮箱</div>
              <Input
                // required
                placeholder="请输入邮箱"
                style={{ width: "calc(100% - 120px)" }}
                value={groupEmail}
                onChange={(e) => {
                  changeGroupInput(e.target.value, setGroupEmail, "groupEmail");
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div
              className="contact-name-content"
              style={{ marginBottom: "5px" }}
            >
              <div className="contact-name-title">官网域名</div>
              <Input
                // required
                placeholder="请输入官网域名"
                style={{ width: "calc(100% - 120px)" }}
                value={groupUrl}
                onChange={(e) => {
                  changeGroupInput(e.target.value, setGroupUrl, "groupUrl");
                }}
                disabled={groupRole !== 1 && type === "设置"}
              />
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">行业类型</div>
              <Select
                style={{ width: "calc(100% - 120px)" }}
                onChange={(value) => {
                  changeGroupInput(
                    value,
                    setGroupCompanyType,
                    "groupCompanyType"
                  );
                }}
                value={groupCompanyType}
                getPopupContainer={() => setRef.current}
              >
                {groupCompanyTypeArray.map(
                  (typeItem: any, typeIndex: number) => {
                    return (
                      <Option value={typeItem} key={"companyType" + typeIndex}>
                        {typeItem}
                      </Option>
                    );
                  }
                )}
              </Select>
            </div>
            <div className="contact-name-content">
              <div className="contact-name-title">员工规模</div>
              <Select
                style={{ width: "calc(100% - 120px)" }}
                onChange={(value) => {
                  changeGroupInput(value, setGroupMemberNum, "groupMemberNum");
                }}
                value={groupMemberNum}
                getPopupContainer={() => setRef.current}
              >
                {groupMemberNumArray.map(
                  (memberNumItem: any, memberNumIndex: number) => {
                    return (
                      <Option
                        value={memberNumItem}
                        key={"memberNum" + memberNumIndex}
                      >
                        {memberNumItem}
                      </Option>
                    );
                  }
                )}
              </Select>
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
});
export default GroupConfig;
