import React, { useState, useEffect, useRef } from "react";
import "./companyEdit.css";
import "cropperjs/dist/cropper.css";
import { useDispatch } from "react-redux";
import { Input, Radio, DatePicker, Modal, Badge, Button, Tooltip } from "antd";
import { useTypedSelector } from "../../redux/reducer/RootState";
import moment from "moment";
import _ from "lodash";
import Cropper from "react-cropper";
import api from "../../services/api";
import { useMount } from "../../hook/common";

import { getUploadToken } from "../../redux/actions/authActions";
import { setMessage } from "../../redux/actions/commonActions";

import uploadFile from "../../components/common/upload";
import IconFont from "../../components/common/iconFont";

import defaultPersonPng from "../../assets/img/defaultPerson.png";

interface CompanyEditProps {
  targetUser: any;
  setTargetUser: any;
  setChangeState: Function;
  clearState: boolean;
  rows?: any;
  setRows?: any;
  personIndex?: Number;
  setUserVisible?: any;
}

const CompanyEdit: React.FC<CompanyEditProps> = (props) => {
  const {
    targetUser,
    setTargetUser,
    setChangeState,
    clearState,
    rows,
    setRows,
    personIndex,
    setUserVisible,
  } = props;
  const dispatch = useDispatch();
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [targetUserInfo, setTargetUserInfo] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(defaultPersonPng);
  const [upImg, setUpImg] = useState<any>(null);
  const [photoVisible, setPhotoVisible] = useState<any>(false);
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("0");
  const [birthday, setBirthday] = useState<any>(moment());
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [lunarBirthday, setLunarBirthday] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactTel, setEmergencyContactTel] = useState("");
  const [post, setPost] = useState("");
  const [department1, setDepartment1] = useState("");
  const [department2, setDepartment2] = useState("");
  const [department3, setDepartment3] = useState("");
  const [department4, setDepartment4] = useState("");
  const [department5, setDepartment5] = useState("");
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const cropperRef = useRef<HTMLImageElement>(null);
  useMount(() => {
    dispatch(getUploadToken());
    if (targetUser) {
      setAvatar(targetUser.avatar ? targetUser.avatar : defaultPersonPng);
      setNickName(targetUser.nickName ? targetUser.nickName : "");
      setGender(
        targetUser.gender === "男" || targetUser.gender === "0" ? "0" : "1"
      );
      setBirthday(moment(targetUser.birthday));
      setEmail(targetUser.email ? targetUser.email : "");
      setAddress(targetUser.address ? targetUser.address : "");
      setEmergencyContact(
        targetUser.emergencyContact ? targetUser.emergencyContact : ""
      );
      setEmergencyContactTel(
        targetUser.emergencyContactTel ? targetUser.emergencyContactTel : ""
      );
      setLunarBirthday(
        targetUser.lunarBirthday ? targetUser.lunarBirthday : ""
      );
      setTargetUserInfo(targetUser);
    } else {
      setTargetUserInfo({
        department1: "",
        department2: "",
        department3: "",
        department4: "",
        department5: "",
        nickName: "",
        mobileArea: "+86",
        mobile: "",
        post: "",
        email: "",
        lunarBirthday: "",
        emergencyContact: "",
        emergencyContactTel: "",
        address: "",
        gender: "0",
        birthday: moment().valueOf(),
        avatar: defaultPersonPng,
      });
    }
  });

  useEffect(() => {
    if (clearState) {
      setAvatar(defaultPersonPng);
      setNickName("");
      setGender("0");
      setBirthday(moment());
      setEmail("");
      setMobile("");
      setAddress("");
      setEmergencyContact("");
      setEmergencyContactTel("");
      setLunarBirthday("");
      setPost("");
      setDepartment1("");
      setDepartment2("");
      setDepartment3("");
      setDepartment4("");
      setDepartment5("");
      setTargetUserInfo({
        department1: "",
        department2: "",
        department3: "",
        department4: "",
        department5: "",
        nickName: "",
        mobileArea: "+86",
        mobile: "",
        post: "",
        email: "",
        lunarBirthday: "",
        emergencyContact: "",
        emergencyContactTel: "",
        address: "",
        gender: "0",
        birthday: moment().valueOf(),
        avatar: defaultPersonPng,
      });
    }
  }, [clearState]);
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
      uploadToken,
      mimeType,
      function (url: string) {
        dispatch(setMessage(true, "图片上传成功", "success"));
        setAvatar(url);
        changeTargetUser(url, "avatar");
      }
    );
  };
  const handleDateChange = (date: any) => {
    setBirthday(date);
    changeTargetUser(date, "birthday");
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
  const chooseImg = (e: any) => {
    const fileReader = new FileReader();
    setPhotoVisible(true);
    fileReader.onload = (e: any) => {
      const dataURL = e.target.result;
      setUpImg(dataURL);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
  const changeTargetUser = (value: any, type: string) => {
    setChangeState(true);
    let newTargetUser: any = _.cloneDeep(targetUserInfo);
    newTargetUser[type] = value;
    setTargetUserInfo(newTargetUser);
    setTargetUser(newTargetUser);
  };
  const deletePerson = async () => {
    setDeleteDialogShow(false);
    let newRow: any = _.cloneDeep(rows);
    let deletePersonRes: any = await api.company.deletePerson(
      targetUser.userId,
      groupKey
    );
    if (deletePersonRes.msg === "OK") {
      dispatch(setMessage(true, "删除人员成功", "success"));
      newRow.splice(personIndex, 1);
      setRows(newRow);
      setUserVisible(false);
    } else {
      dispatch(setMessage(true, deletePersonRes.msg, "error"));
    }
  };
  return (
    <div className="companyEdit-home-content">
      {targetUser && targetUser._key ? (
        <div className="companyEdit-home-avatar">
          <div className="companyEdit-input-title">头像</div>
          <div className="companyEdit-home-avatar-img">
            <input
              type="file"
              accept="image/*"
              onChange={chooseImg}
              className="upload-img"
            />
            <img src={avatar} alt="" />
          </div>
        </div>
      ) : null}

      <div className="companyEdit-input">
        <div className="companyEdit-input-title">
          <Badge dot offset={[10, 0]}>
            <span style={{ fontSize: "12px" }}>昵称</span>
          </Badge>
        </div>

        <Input
          value={nickName}
          onChange={(e: any) => {
            setNickName(e.target.value);
            changeTargetUser(e.target.value, "nickName");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      {!targetUser || !targetUser._key ? (
        <React.Fragment>
          <div className="companyEdit-input">
            <div className="companyEdit-input-title">部门1</div>
            <Input
              value={department1}
              onChange={(e: any) => {
                setDepartment1(e.target.value);
                changeTargetUser(e.target.value, "department1");
              }}
              style={{ width: "calc(100% - 85px)" }}
              allowClear={true}
            />
          </div>
          {department1 ? (
            <div className="companyEdit-input">
              <div className="companyEdit-input-title">部门2</div>
              <Input
                value={department2}
                onChange={(e: any) => {
                  setDepartment2(e.target.value);
                  changeTargetUser(e.target.value, "department2");
                }}
                style={{ width: "calc(100% - 85px)" }}
                allowClear={true}
              />
            </div>
          ) : null}
          {department2 ? (
            <div className="companyEdit-input">
              <div className="companyEdit-input-title">部门3</div>
              <Input
                value={department3}
                onChange={(e: any) => {
                  setDepartment3(e.target.value);
                  changeTargetUser(e.target.value, "department3");
                }}
                style={{ width: "calc(100% - 85px)" }}
                allowClear={true}
              />
            </div>
          ) : null}
          {department3 ? (
            <div className="companyEdit-input">
              <div className="companyEdit-input-title">部门4</div>
              <Input
                value={department4}
                onChange={(e: any) => {
                  setDepartment4(e.target.value);
                  changeTargetUser(e.target.value, "department4");
                }}
                style={{ width: "calc(100% - 85px)" }}
                allowClear={true}
              />
            </div>
          ) : null}
          {department4 ? (
            <div className="companyEdit-input">
              <div className="companyEdit-input-title">部门5</div>
              <Input
                value={department5}
                onChange={(e: any) => {
                  setDepartment5(e.target.value);
                  changeTargetUser(e.target.value, "department5");
                }}
                style={{ width: "calc(100% - 85px)" }}
                allowClear={true}
              />
            </div>
          ) : null}
          <div className="companyEdit-input">
            <div className="companyEdit-input-title">职位</div>
            <Input
              value={post}
              onChange={(e: any) => {
                setPost(e.target.value);
                changeTargetUser(e.target.value, "post");
              }}
              style={{ width: "calc(100% - 85px)" }}
              allowClear={true}
            />
          </div>
        </React.Fragment>
      ) : null}
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">性别</div>
        <Radio.Group
          onChange={(e: any) => {
            setGender(e.target.value);
            changeTargetUser(parseInt(e.target.value), "gender");
          }}
          value={gender + ""}
        >
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
        </Radio.Group>
      </div>
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">
          <Badge dot offset={[10, 0]}>
            <span style={{ fontSize: "12px" }}>电子邮箱</span>
          </Badge>
        </div>
        <Input
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
            changeTargetUser(e.target.value, "email");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      <div className="companyEdit-input">
        {/* <div className="user-title">生日</div> */}
        <div className="companyEdit-input-title">生日</div>
        <DatePicker value={birthday} onChange={handleDateChange} />
      </div>
      {!targetUser || !targetUser._key ? (
        <div className="companyEdit-input">
          <div className="companyEdit-input-title">
            <Badge dot offset={[10, 0]}>
              <span style={{ fontSize: "12px" }}>手机</span>
            </Badge>
          </div>
          <Input
            value={mobile}
            onChange={(e: any) => {
              setMobile(e.target.value);
              changeTargetUser(e.target.value, "mobile");
            }}
            style={{ width: "calc(100% - 85px)" }}
            allowClear={true}
          />
        </div>
      ) : null}
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">地址</div>
        <Input
          value={address}
          onChange={(e: any) => {
            setAddress(e.target.value);
            changeTargetUser(e.target.value, "address");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">农历生日</div>
        <Input
          value={lunarBirthday}
          onChange={(e: any) => {
            setLunarBirthday(e.target.value);
            changeTargetUser(e.target.value, "lunarBirthday");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">紧急联系人</div>
        <Input
          value={emergencyContact}
          onChange={(e: any) => {
            setEmergencyContact(e.target.value);
            changeTargetUser(e.target.value, "emergencyContact");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      <div className="companyEdit-input">
        <div className="companyEdit-input-title">紧急电话</div>
        <Input
          value={emergencyContactTel}
          onChange={(e: any) => {
            setEmergencyContactTel(e.target.value);
            changeTargetUser(e.target.value, "emergencyContactTel");
          }}
          style={{ width: "calc(100% - 85px)" }}
          allowClear={true}
        />
      </div>
      {targetUser?._key && groupRole && groupRole < targetUser?.role ? (
        <Tooltip title={"移除成员"}>
          <Button
            onClick={() => {
              setDeleteDialogShow(true);
            }}
            type="primary"
            ghost
            shape="circle"
            icon={<IconFont type="icon-tiren" style={{ fontSize: "25px" }} />}
            style={{ border: "0px" }}
            className="companyEdit-delete-button"
          />
        </Tooltip>
      ) : null}
      <Modal
        visible={photoVisible}
        onCancel={() => {
          setPhotoVisible(false);
        }}
        onOk={() => {
          uploadImg();
          setPhotoVisible(false);
        }}
        title={"选择图片"}
      >
        <Cropper
          style={{ width: "100%", height: "95%" }}
          guides={true}
          src={upImg}
          ref={cropperRef}
          preview=".img-preview"
        />
      </Modal>
      <Modal
        visible={deleteDialogShow}
        onCancel={() => {
          setDeleteDialogShow(false);
        }}
        onOk={() => {
          deletePerson();
        }}
        title={"删除人员"}
      >
        是否将该人员从所有项目和组织中删除
      </Modal>
    </div>
  );
};
CompanyEdit.defaultProps = {};
export default CompanyEdit;
