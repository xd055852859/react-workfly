interface Props {
  node: any;
  bookid?: string;
}

export default function Table({ node}: Props) {

  let path = "";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <iframe
        name="frame-container"
        className="web-view"
        title="时光表格"
        src={`${window.location.protocol}//${window.location.host}${path}/editor/sheet.html?key=${node._key}`}
        frameBorder="0"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}
