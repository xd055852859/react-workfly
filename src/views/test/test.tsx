import React from "react";
import "./test.css";

interface TestProps {
  percent: number;
  scale: number;
}

const Test: React.FC<TestProps> = () => {
  return <div></div>;
};
Test.defaultProps = {};
export default Test;
