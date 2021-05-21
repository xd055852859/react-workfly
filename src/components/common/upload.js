import * as qiniu from "qiniu-js";
const uploadFile = {
  reloadNum: 0,
  uploadImg: async (file, uptoken, mimeType, callback) => {
    //let res = await api.upload.getUptoken(window.localStorage.getItem("TOKEN"));
    if (!uptoken || !file) {
      return;
    }
    const domain = "https://cdn-icare.qingtime.cn/";
    console.log(file.size);
    if (file.size > 20000000) {
      alert("文件不能大于20M,请重新选择");
      return;
    }
    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: mimeType,
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region: qiniu.region.z0,
      forceDirect: true,
    };
    let observer = {
      next(res) {},
      error(err) {
        console.log(err);
        alert(err.message);
      },
      complete(res) {
        // content = content.replace(/(data:image\/){1}(jpeg|gif|png){1}(;){1}.*?\"/, "http://cdn-icare.qingtime.cn/" + res.key + "\"");
        console.log("domain + res.key", domain + res.key);
        callback(domain + res.key);
        //return domain + res.key;
      },
    };
    // 上传
    let observable = qiniu.upload(
      file,
      new Date().getTime() + "_workingVip",
      uptoken,
      putExtra,
      config
    );
    // 上传开始
    observable.subscribe(observer);
  },
  // qiniuUpload(uptoken, target, file, isVideo, callback = null) {
  //   // const dispatch = useDispatch();
  //   let that = this;
  //   let mimeType = ['image/png', 'image/jpeg', 'image/svg+xml', 'video/mp4'];
  //   let putExtra = {
  //     // 文件原文件名
  //     fname: '',
  //     // 自定义变量
  //     params: {},
  //     // 限制上传文件类型
  //     mimeType: mimeType,
  //   };
  //   let config = {
  //     useCdnDomain: true,
  //     disableStatisticsReport: false,
  //     retryCount: 5,
  //     region: qiniu.region.z0,
  //   };
  //   let observer = {
  //     next(res) {},
  //     async error(err) {
  //       // async complete(res) {
  //       that.reloadNum++;
  //       if (that.reloadNum > 2) {
  //         alert('上传失败！请检查网络或重新尝试上传');
  //       } else {
  //         alert('上传失败！重新上传中');
  //         let uploadRes = await api.auth.getUptoken();
  //         if (uploadRes.msg === 'OK') {
  //           // dispatch(setUploadToken(uploadRes.result));
  //           that.qiniuUpload(uploadRes.result, target, file, isVideo, callback);
  //         }
  //       }
  //     },
  //     complete(res) {
  //       const domain = 'https://cdn-icare.qingtime.cn/';
  //       const url = domain + encodeURIComponent(res.key);
  //       console.log(url, callback);
  //       if (callback) {
  //         callback(url);
  //       } else {
  //         if (isVideo) {
  //           target.innerHTML = `<video src="${url}" style="width: 600px;" controls="" class="fr-draggable">您的浏览器不支持 HTML5 视频。</video>`;
  //         } else {
  //           console.log('target', target);
  //           target.src = url;
  //         }
  //       }
  //     },
  //   };
  //   // 上传
  //   let observable = qiniu.upload(
  //     file,
  //     `${this.guid(8, 16)}${
  //       file.name ? file.name.substr(file.name.lastIndexOf('.')) : '.jpg'
  //     }`,
  //     uptoken,
  //     putExtra,
  //     config
  //   );
  //   // 上传开始
  //   observable.subscribe(observer);
  // },
  qiniuUpload(uptoken, target, file, isVideo, callBack) {
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
      `${this.guid(8, 16)}${
        file.name ? file.name.substr(file.name.lastIndexOf(".")) : ".jpg"
      }`,
      uptoken,
      putExtra,
      qiniuConfig
    );

    // 上传开始
    observable.subscribe(observer);
  },
  guid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
      ""
    );
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";

      // Fill in random data.  At i===19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join("");
  },
  getBase64FromImageURL(url, callback) {
    let canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      img = new Image();
    // img.crossOrigin = 'Anonymous';
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      let base64URL = canvas.toDataURL("image/png");
      callback(base64URL);
      canvas = null;
    };
    img.src = url;
  },
  getImageBase64(img) {
    let canvas = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
    let dataURL = canvas.toDataURL("image/png"); //返回的是一串Base64编码的URL并指定格式
    canvas = null; //释放
    return dataURL;
  },
  dataURLtoFile(dataurl, filename) {
    //将base64转换为文件
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },
};

export default uploadFile;
