import React, { useState, useEffect } from "react";
import "./bookView.css";
import { Catalog } from "tree-graph-react";
import _ from "lodash";
import moment from "moment";
import Avatar from "../../common/avatar";

interface BookViewProps {
  nodeObj: any;
  gridList: any;
  targetData: any;
  changeSelect: Function;
}

const BookView: React.FC<BookViewProps> = (props) => {
  const { nodeObj, gridList, targetData, changeSelect } = props;
  const [info, setInfo] = useState<any>(null);
  const [infoMap, setInfoMap] = useState<any>({});

  useEffect(() => {
    if (nodeObj) {
      setInfoMap((prevInfoMap) => {
        for (let key in nodeObj) {
          let nodeIndex = _.findIndex(gridList, { _key: nodeObj[key]._key });
          prevInfoMap[key] = (
            <div className="">
              <span>
                {moment(gridList[nodeIndex].updateTime).format("YY-MM-DD")}
              </span>
            </div>
          );
        }
        return { ...prevInfoMap }
      });
    }
  }, [nodeObj, gridList,targetData]);
  useEffect(() => {
    if (nodeObj) {
      setInfo(
        <div className="bookView-person">
          <div className="bookView-person-name">{`作者：${targetData ? targetData.creatorName : ""
            // user.profile.nickName
            }`}</div>
          <div className="bookView-person-avatar">
            <Avatar
              avatar={
                targetData?.creatorAvatar
              }
              name={targetData?.creatorName}
              type={'person'}
              index={0}
              size={25}
            />
          </div>
        </div>
      );
    }
  }, [nodeObj, targetData]);
  return (
    <div>
      {nodeObj && targetData._key ? (
        <Catalog
          nodes={nodeObj}
          startId={targetData._key}
          info={info}
          itemInfoMap={infoMap}
          handleClickNode={changeSelect}
        />
      ) : null}
    </div>
  );
};
BookView.defaultProps = {};
export default BookView;
