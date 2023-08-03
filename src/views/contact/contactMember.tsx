import React, { useState, useEffect } from "react";
import "./contactMember.css";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import _, { divide } from "lodash";
import Avatar from "../../components/common/avatar";
import { Collapse, Input } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Panel } = Collapse;
const { Search } = Input;
interface ContactMemberProps {
  memberList: any;
  chooseMember: any;
  calendarFollowKey: any;
}
const ContactMember: React.FC<ContactMemberProps> = (props) => {
  const { memberList, chooseMember, calendarFollowKey } = props;
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const dispatch = useDispatch();
  const [memberArr, setMemberArr] = useState<any>([]);
  const [searchArr, setSearchArr] = useState<any>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [firstArr, setFirstArr] = useState<any>([]);
  const wordArr = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  useEffect(() => {
    if (memberList && memberList.length > 0) {
      console.log(memberList);
      let newArr = [];
      let newFirstArr = [];
      memberList.forEach((memberItem, memberIndex) => {
        let index = _.findIndex(memberArray, { userId: memberItem.userId });
        if (index !== -1) {
          if (!newArr[0]) {
            newArr[0] = [];
          }
          newArr[0].push(memberItem);
        } else {
          if (memberItem.firstLetter) {
            let newIndex = wordArr.indexOf(
              memberItem.firstLetter.toUpperCase()
            );
            memberItem.firstLetter = memberItem.firstLetter.toUpperCase();
            if (newIndex !== -1) {
              if (!newArr[newIndex + 1]) {
                newArr[newIndex + 1] = [];
              }
              newArr[newIndex + 1].push(memberItem);
            }
          }
        }
      });
      newArr[0] = _.sortBy(newArr[0], ["visitTime"]).reverse();
      newArr.forEach((item, index) => {
        if (index > 0 && item && item[0].firstLetter) {
          newFirstArr.push(item[0].firstLetter);
        }
      });
      console.log(newFirstArr);
      //取出队友
      newFirstArr.unshift("队友");
      setFirstArr(newFirstArr);
      setMemberArr(newArr);
      //firstLetter
    }
  }, [memberList]);
  useEffect(() => {
    if (searchInput === "") {
      setSearchArr([]);
    }
  }, [searchInput]);
  const searchMember = (value) => {
    let newSearchArr = memberList.filter((item: any, index: number) => {
      return (
        item.nickName &&
        item.nickName.toUpperCase().indexOf(value.toUpperCase()) !== -1
      );
    });
    setSearchArr(newSearchArr);
    setSearchInput(value);
  };
  return (
    <div className="contact-member">
      <Search
        placeholder="请输入参会者姓名"
        value={searchInput}
        onChange={(e) => searchMember(e.target.value)}
        style={{ margin: "10px", width: "calc(100% - 20px)" }}
      />
      <div className="contact-member-container">
        {memberArr && memberArr.length > 0 ? (
          <>
            {searchArr.length === 0 ? (
              <>
                <div className="contact-member-word" id="队友">
                  队友
                </div>
                <div className="contact-member-box">
                  {memberArr[0].map((item, index) => {
                    return (
                      <div
                        className="contact-member-item"
                        key={index + "member"}
                        onClick={() => {
                          chooseMember(item);
                        }}
                      >
                        <Avatar
                          name={item.nickName}
                          avatar={item.avatar}
                          type={"person"}
                          index={index}
                          size={34}
                          avatarStyle={{
                            marginRight: "10px",
                          }}
                        />
                        <div>{item.nickName}</div>
                        {calendarFollowKey &&
                        item.userId &&
                        calendarFollowKey.indexOf(item.userId) !== -1 ? (
                          <div className="contact-member-checked">
                            <CheckOutlined />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {memberArr.map((memberItem, memberIndex) => {
                  return (
                    <>
                      {memberIndex > 0 && memberItem ? (
                        <>
                          <div className="contact-member-word">
                            {memberItem[0]?.firstLetter}
                          </div>
                          <div
                            key={memberIndex + "wordmember"}
                            className="contact-member-box"
                            id={memberItem[0]?.firstLetter}
                          >
                            {memberItem.map((item, index) => {
                              return (
                                <div
                                  className="contact-member-item"
                                  onClick={() => {
                                    chooseMember(item);
                                  }}
                                >
                                  <Avatar
                                    name={item.nickName}
                                    avatar={item.avatar}
                                    type={"person"}
                                    index={index}
                                    size={34}
                                    avatarStyle={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  <div>{item.nickName}</div>
                                  {calendarFollowKey &&
                                  item.userId &&
                                  calendarFollowKey.indexOf(item.userId) !==
                                    -1 ? (
                                    <div className="contact-member-checked">
                                      <CheckOutlined />
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : null}
                    </>
                  );
                })}
              </>
            ) : (
              <div className="contact-member-box">
                {searchArr.map((item, index) => {
                  return (
                    <div
                      className="contact-member-item"
                      key={index + "member"}
                      onClick={() => {
                        chooseMember(item);
                      }}
                      style={{ padding: "10px", boxSizing: "border-box" }}
                    >
                      <Avatar
                        name={item.nickName}
                        avatar={item.avatar}
                        type={"person"}
                        index={index}
                        size={34}
                        avatarStyle={{
                          marginRight: "10px",
                        }}
                      />
                      <div>{item.nickName}</div>
                      {calendarFollowKey &&
                      item.userId &&
                      calendarFollowKey.indexOf(item.userId) !== -1 ? (
                        <div className="contact-member-checked">
                          <CheckOutlined />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="contact-member-bar">
        {firstArr.map((wordItem, wordIndex) => {
          return (
            <div className="contact-member-a">
              <a href={"#" + wordItem}>{wordItem}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
ContactMember.defaultProps = {};
export default ContactMember;
