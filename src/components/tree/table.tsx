import { useAuth } from "../../context/auth";
declare var window: Window 
interface Props {
  node: any;
  bookid?: string;
  viewState?: boolean | string;
}

export default function Table({ node, viewState }: Props) {
  let path = "";
  let { deviceType } = useAuth();
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <iframe
        name="frame-container"
        className="web-view"
        title="时光表格"
        src={`${window.location.protocol}//${
          window.location.host
        }${path}/editor/sheet.html?key=${node._key}${
          deviceType === "mobile" ? "&deviceType='mobile'" : ""
        }${viewState ? "&viewState='view'" : ""}`}
        frameBorder="0"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}
