import { Dropdown, Menu } from "antd";
import React, { useState, useCallback } from "react";
// import './userCenter.css';
// import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import boldSvg from "../../../assets/editor/bold.svg";
import italicSvg from "../../../assets/editor/italic.svg";
import strikeSvg from "../../../assets/editor/strike.svg";
import undoSvg from "../../../assets/editor/undo.svg";
import redoSvg from "../../../assets/editor/redo.svg";
interface MenuBarProps {
  editor: any;
}
declare var window: Window 
const MenuBar: React.FC<MenuBarProps> = (props) => {
  const { editor } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  if (!editor) {
    return null;
  }
  const Hmenu = (
    <Menu>
      {[1, 2, 3, 4, 5, 6].map((item, index) => {
        return (
          <Menu.Item key={"hmenu" + index}>
            <div
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: item }).run()
              }
              className={
                editor.isActive("heading", { level: item }) ? "is-active" : ""
              }
            >
              h{item}
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <div className="editor-bar">
      <div
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <img src={boldSvg} alt="" />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <img src={italicSvg} alt="" />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <img src={strikeSvg} alt="" />
      </div>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        paragraph
      </button>

      <Dropdown overlay={Hmenu} arrow>
        <div>H</div>
      </Dropdown>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      >
        justify
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <div onClick={() => editor.chain().focus().redo().run()}>
        <img src={redoSvg} alt="" />
      </div>
      <div onClick={() => editor.chain().focus().undo().run()}>
        <img src={undoSvg} alt="" />
      </div>

      {/* <button onClick={addImage}>setImage</button> */}
    </div>
  );
};
MenuBar.defaultProps = {};
export default MenuBar;
