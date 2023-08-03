import React, { useEffect, useRef, useState } from "react";
import "./editor.css";
import { Image} from "antd";
// import { useDispatch } from "react-redux";
import { usePrevious } from "../../../hook/common";
import { useTypedSelector } from "../../../redux/reducer/RootState";
import E from "wangeditor";
import uploadFile from "../../common/upload";
import api from "../../../services/api";
import { useMount } from "../../../hook/common";
import { useAuth } from "../../../context/auth";


// import { getUploadToken } from "../../../redux/actions/authActions";
interface EditorProps {
  onChange?: any;
  data: any;
  setContent?: Function;
  height?: number;
  zIndex?: number;
  editorKey: string;
  setImgFileList?: any;
  cardKey?: string;
}

const Editor: React.FC<EditorProps> = (props) => {
  const {
    onChange,
    setContent,
    height,
    data,
    editorKey,
    setImgFileList,
    cardKey,
  } = props;

  const user = useTypedSelector((state) => state.auth.user);
  // const dispatch = useDispatch();
  let ref = useRef<any>(null);
  const editorRef: React.RefObject<any> = useRef();
  const imgType = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoType = ["mp4", "avi", "mpeg", "rm", "mp3"];
  let { deviceType } = useAuth();
  const [imgSrc, setImgSrc] = useState("");

  const [visible, setVisible] = useState(false);
  useMount(() => {
    // dispatch(getUploadToken());
    // 注：class写法需要在componentDidMount 创建编辑器
    if (!ref.current) {
      ref.current = new E("#editor");
    }

    ref.current.config.placeholder = "";
    ref.current.config.excludeMenus = [
      "fontName",
      "link",
      "quote",
      "emoticon",
      "code",
      "splitLine",
    ];
    ref.current.config.showFullScreen = false;
    ref.current.config.uploadImgAccept = imgType;
    ref.current.config.uploadVideoAccept = videoType;
    ref.current.config.uploadImgMaxLength = 5;
    ref.current.config.zIndex = 1;
    ref.current.config.menuTooltipPosition = "down";
    ref.current.config.pasteFilterStyle = false;
    ref.current.config.customUploadImg = function (
      resultFiles: any,
      insertImgFn: any
    ) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      // 上传图片，返回结果，将图片插入到编辑器中
      resultFiles.forEach((item: any, index: number) => {
        uploadFile.uploadImg(item, imgType, (imgUrl) => {
          insertImgFn(imgUrl);
          if (cardKey) {
            api.task.batchAddPicUrl(cardKey, {
              type: "详情",
              url: imgUrl,
              userKey: user._key,
              userName: user.profile.nickName,
            });
          }
          if (setImgFileList && deviceType !== "mobile") {
            setImgFileList((prevFileList) => {
              prevFileList = [...prevFileList, imgUrl];
              return [...prevFileList];
            });
          }
        });
      });
    };
    ref.current.config.customUploadVideo = function (
      resultFiles,
      insertVideoFn
    ) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      // 上传视频，返回结果，将视频地址插入到编辑器中
      uploadFile.uploadImg(resultFiles[0], videoType, (videoUrl) => {
        // 往编辑器插入 html 内容
        ref.current.cmd.do(
          "insertHTML",
          `<video style="width:80%" src="${videoUrl}" controls controlsList="nodownload" poster="${videoUrl}?vframe/jpg/offset/5">您的浏览器不支持 video 标签。</video>`
        );
      });
    };
    ref.current.config.onchange = (newHtml: any) => {
      if (setContent) {
        setContent(newHtml);
      } else {
        onChange(newHtml);
      }
    };
    ref.current.config.height = height
      ? height - 175 > 20
        ? height - 175
        : 400
      : 400;
    console.log(height);
    ref.current.txt.eventHooks.imgClickEvents.push(clickImg);
    /**一定要创建 */
    ref.current.create();
    if (data) {
      ref.current.txt.html(data);
    }
    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      ref.current.destroy();
    };
  });
  const clickImg = (e) => {
    setImgSrc(e.elems[0].src);
    setVisible(true);
  };
  // useEffect(() => {
  //   if (!uptoken) {
  //     dispatch(getUploadToken());
  //   }
  // }, [uptoken, dispatch])
  const prevEditorKey = usePrevious(editorKey);
  useEffect(() => {
    if (ref.current && prevEditorKey !== editorKey) {
      ref.current.txt.html(data);
    }
  }, [editorKey, data, prevEditorKey]);
  return (
    <React.Fragment>
      <div id="editor" ref={editorRef}></div>

      <Image
        width={200}
        style={{ display: "none" }}
        src={imgSrc}
        preview={{
          visible,
          src: imgSrc,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </React.Fragment>
  );
};
Editor.defaultProps = {};
export default Editor;
