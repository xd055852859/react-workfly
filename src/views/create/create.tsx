import React from "react";
import { changeMusic } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import HeaderCreate from "../../components/headerSet/headerCreate";
import { useMount } from "../../hook/common";
interface CreateProps {}

const Create: React.FC<CreateProps> = () => {
  const dispatch = useDispatch();
  useMount(() => {
    localStorage.removeItem("createType");
    dispatch(changeMusic(0));
  });
  return (
    <HeaderCreate
      visible={true}
      createStyle={{
        width: "100%",
        overflow: "auto",
        padding: "0px 15px",
      }}
    />
  );
};
Create.defaultProps = {};
export default Create;
