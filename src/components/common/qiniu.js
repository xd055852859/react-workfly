import * as qiniu from "qiniu-js";
import uploadFile from './upload';

export const qiniuUpload = (uptoken, target, file, isVideo) => {
  const putExtra = {
    // 文件原文件名
    fname: "",
    // 自定义变量
    params: {},
    // 限制上传文件类型
    mimeType: ["image/png", "image/jpeg", "image/svg+xml", "video/mp4"],
  };

  const qiniuConfig = {
    useCdnDomain: true,
    disableStatisticsReport: false,
    retryCount: 5,
    region: qiniu.region.z0,
  };

  let observer = {
    next(res) {},
    error(err) {
      alert("上传失败！");
    },
    complete(res) {
      const domain = "https://cdn-icare.qingtime.cn/";
      const url = domain + encodeURIComponent(res.key);
      if (isVideo) {
        target.innerHTML = `<video src="${url}" style="width: 600px;" controls="" class="fr-draggable">您的浏览器不支持 HTML5 视频。</video>`;
      } else {
        target.src = url;
      }
    },
  };

  // 上传
  let observable = qiniu.upload(
    file,
    `${uploadFile.guid(8, 16)}${
      file.name ? file.name.substr(file.name.lastIndexOf(".")) : ".jpg"
    }`,
    uptoken,
    putExtra,
    qiniuConfig
  );

  // 上传开始
  observable.subscribe(observer);
};
