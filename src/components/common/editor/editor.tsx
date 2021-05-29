import React, { useEffect, useRef } from "react";
// import './userCenter.css';
import { useDispatch } from "react-redux";
import { usePrevious } from "../../../hook/common";
import { useTypedSelector } from "../../../redux/reducer/RootState";
import E from "wangeditor";
import uploadFile from "../../common/upload";
import { useMount } from "../../../hook/common";

import { getUploadToken } from "../../../redux/actions/authActions";
interface EditorProps {
  data: any;
  onChange: Function;
  height?: number;
  zIndex?: number;
  editorKey: string;
}

const Editor: React.FC<EditorProps> = (props) => {
  const { onChange, height, data, editorKey } = props;
  const uptoken = useTypedSelector((state) => state.auth.uploadToken);
  const dispatch = useDispatch();
  let ref = useRef<any>(null);
  const editorRef: React.RefObject<any> = useRef();
  const imgType = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoType = ["mp4", "avi", "mpeg", "rm", "mp3"];
  useMount(() => {
    dispatch(getUploadToken());
    // 注：class写法需要在componentDidMount 创建编辑器
    if (!ref.current) {
      ref.current = new E("#editor");
    }

    ref.current.config.placeholder = "";
    ref.current.config.excludeMenus = [
      "fontName",
      "link",
      "todo",
      "quote",
      "emoticon",
      "code",
      "splitLine",
    ];
    ref.current.config.uploadImgAccept = imgType;
    ref.current.config.uploadVideoAccept = videoType;
    ref.current.config.zIndex = 3;
    ref.current.config.menuTooltipPosition = "down";
    ref.current.config.customUploadImg = function (
      resultFiles: any,
      insertImgFn: any
    ) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法

      // 上传图片，返回结果，将图片插入到编辑器中
      uploadFile.uploadImg(resultFiles[0], uptoken, imgType, insertImgFn);
      // insertImgFn(imgUrl);
      // editor.fullScreen();
    };
    ref.current.config.customUploadVideo = function (
      resultFiles,
      insertVideoFn
    ) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      // 上传视频，返回结果，将视频地址插入到编辑器中
      uploadFile.uploadImg(resultFiles[0], uptoken, videoType, insertVideoFn);
    };
    ref.current.config.onchange = (newHtml: any) => {
      onChange(newHtml);
    };
    ref.current.config.height = height;

    /**一定要创建 */
    ref.current.create();
    if (data) {
      ref.current.txt.html(data);
    }
    // console.log(data);
    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      ref.current.destroy();
    };
  });
  const prevEditorKey = usePrevious(editorKey);
  useEffect(() => {
    if (ref.current && prevEditorKey !== editorKey) {
      ref.current.txt.html(data);
    }
  }, [editorKey, data, prevEditorKey]);
  return <div id="editor" ref={editorRef}></div>;
};
Editor.defaultProps = {};
export default Editor;
