import * as qiniu from 'qiniu-js';
import { guid } from './util';

export const uploadImage = (uptoken, file, overwrite, callback) => {
  const putExtra = {
    // 文件原文件名
    fname: '',
    // 自定义变量
    params: {},
    // 限制上传文件类型
    mimeType: ['image/png', 'image/jpeg', 'image/svg+xml', 'video/mp4'],
  };

  const qiniuConfig = {
    useCdnDomain: true,
    disableStatisticsReport: false,
    retryCount: 5,
    region: qiniu.region.z0,
  };

  const fileName = overwrite
    ? file.name
    : `${guid(8, 16)}${file.name ? file.name.substr(file.name.lastIndexOf('.')) : '.png'}`;

  let observer = {
    next() {},
    error(err) {
      alert('上传失败！');
      console.log('---上传失败---', err);
    },
    complete(res) {
      const domain = 'https://cdn-icare.qingtime.cn/';
      const url = domain + encodeURIComponent(res.key);
      callback(url);
    },
  };

  // 上传
  let observable = qiniu.upload(file, fileName, uptoken, putExtra, qiniuConfig);

  // 上传开始
  observable.subscribe(observer);
};

//将base64转换为文件
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function dataURItoBlob(dataURI) {
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  var byteString = atob(dataURI.split(',')[1]); //base64 解码
  var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  var intArray = new Uint8Array(arrayBuffer); //创建视图

  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: mimeString });
}

export const uploadImg = (uptoken, file, overwrite) => {
  const putExtra = {
    // 文件原文件名
    fname: '',
    // 自定义变量
    params: {},
    // 限制上传文件类型
    mimeType: ['image/png', 'image/jpeg', 'image/svg+xml', 'video/mp4'],
  };

  const qiniuConfig = {
    useCdnDomain: true,
    disableStatisticsReport: false,
    retryCount: 5,
    region: qiniu.region.z0,
  };

  const fileName = overwrite
    ? file.name
    : `${guid(8, 16)}${file.name ? file.name.substr(file.name.lastIndexOf('.')) : '.png'}`;

  return new Promise(async function (resolve, reject) {
    try {
      let observer = {
        next() {},
        error(err) {
          alert('上传失败！');
          console.log('---上传失败---', err);
        },
        complete(res) {
          const domain = 'https://cdn-icare.qingtime.cn/';
          const url = domain + encodeURIComponent(res.key);
          resolve(url);
        },
      };

      // 上传
      let observable = qiniu.upload(file, fileName, uptoken, putExtra, qiniuConfig);
      // 上传开始
      observable.subscribe(observer);
    } catch (error) {
      reject(error);
    }
  });
};
