import React, { useState, useEffect } from "react";
import './newEditor.css';
import { useTypedSelector } from "../../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import MenuBar from "./newEditorBar";
// import Image from "@tiptap/extension-image";
interface ModelProps {}
const Model: React.FC<ModelProps> = (props) => {
  // const {} = props;
  // const dispatch = useDispatch();
  // const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  // const [] = useState<number[]>([]);
  // const editor = useEditor(
  //   {
  //     extensions: [StarterKit, Image],
  //     editorProps: {
  //       // handleDrop: function (view: any, event: Event, slice: any, moved: boolean) {
  //       //   console.log('---handleDrop---');
  //       //   return false;
  //       // },
  //       // handlePaste: function (view: any, event: ClipboardEvent, slice: any) {
  //       //   console.log('---handlePaste---');
  //       //   return false;
  //       // },
  //       handleDOMEvents: {
  //         paste(view: any, event: ClipboardEvent) {
  //           if (event.clipboardData && event.clipboardData.files.length) {
  //             event.preventDefault();
  //             const { schema } = view.state;
  //             const files = event.clipboardData.files;
  //             for (let index = 0; index < files.length; index++) {
  //               const file = files[index];
  //               // uploadImg(qiniuToken, file).then((url) => {
  //               //   const node = schema.nodes.image.create({
  //               //     src: url,
  //               //   });
  //               //   const transaction = view.state.tr.replaceSelectionWith(node);
  //               //   view.dispatch(transaction);
  //               // });
  //             }
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         },
  //         drop(view: any, event: DragEvent) {
  //           if (event.dataTransfer && event.dataTransfer.files.length) {
  //             event.preventDefault();
  //             const { schema } = view.state;
  //             const files = event.dataTransfer.files;
  //             for (let index = 0; index < files.length; index++) {
  //               const file = files[index];
  //               // uploadImg(qiniuToken, file).then((url) => {
  //               //   const node = schema.nodes.image.create({
  //               //     src: url,
  //               //   });
  //               //   const transaction = view.state.tr.replaceSelectionWith(node);
  //               //   view.dispatch(transaction);
  //               // });
  //             }
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         },
  //       },
  //       // handleClick: function (view: any, pos: number, event: MouseEvent) {
  //       //   console.log('---handleClick---');
  //       //   return false;
  //       // },
  //     },
  //     onUpdate: ({ editor }) => {
  //       // const html = editor.getHTML();
  //       // send the content to an API here
  //       handleChange();
  //     },
  //   },
  //   [uploadToken]
  // );
  const handleChange = () => {};
  return (
    <div>
      {/* <MenuBar editor={editor} />
      <EditorContent editor={editor} /> */}
    </div>
  );
};
Model.defaultProps = {};
export default Model;
