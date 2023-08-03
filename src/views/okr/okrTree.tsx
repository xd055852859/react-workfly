import React, { useRef } from "react";
// import './userCenter.css';
import { Mind } from "tree-graph-react";
import { Moveable } from "../../components/common/moveable";
import { useMount } from "../../hook/common";
import { useTypedSelector } from "../../redux/reducer/RootState";
interface OkrTreeProps {
  treeData: any;
}
const OkrTree: React.FC<OkrTreeProps> = (props) => {
  const { treeData } = props;
  let moveRef: any = useRef();
  let treeRef: any = useRef();
  const handleClickNode = (node: any) => {};
  return (
    <div>
      {treeData ? (
        <Moveable
          scrollable={true}
          style={{ display: "flex" }}
          rightClickToStart={true}
          ref={moveRef}
        >
          <Mind
            ref={treeRef}
            singleColumn={true}
            nodes={treeData}
            startId={"99999999"}
            uncontrolled={false}
            disabled={true}
            indent={52}
            itemHeight={45}
            blockHeight={30}
            defaultSelectedId={"99999999"}
            // defaultSelectedId={toSelectKey || undefined}
            handleClickNode={(node: any) => handleClickNode(node)}
            showAvatar={true}
          />
        </Moveable>
      ) : null}
    </div>
  );
};
OkrTree.defaultProps = {};
export default OkrTree;
