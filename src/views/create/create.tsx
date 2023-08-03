import React from "react";
import { changeMusic } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import HeaderCreate from "../../components/headerSet/headerCreate";
import { useMount } from "../../hook/common";
import { changeContentVisible } from "../../redux/actions/commonActions";
interface CreateProps {
  type?: string
}

const Create: React.FC<CreateProps> = (prop) => {
  const { type } = prop
  const dispatch = useDispatch();
  useMount(() => {
    localStorage.removeItem("createType");
    dispatch(changeMusic(0));
    dispatch(changeContentVisible(false))
  });
  return (
    <HeaderCreate
      visible={true}
      createStyle={{
        width: "100%",
        overflow: "auto",
        padding: "0px 15px",
        color: type === "phone" ? "#fff" : "#333",
        background: type === "phone" ? "transparent" : "#fff"
      }}
      type={type}
    />
  );
};
Create.defaultProps = {};
export default Create;
