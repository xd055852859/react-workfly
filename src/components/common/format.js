import moment from "moment";
const format = {
  formatCard(taskType, cardArray, userKey) {
    let arr = [];
    switch (taskType) {
      case 0:
        //我的一天
        //起始时间
        const startTime = moment().startOf("day").valueOf();
        const endTime = moment().endOf("day").valueOf();
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            ((item.taskEndDate &&
              item.taskEndDate <= endTime &&
              item.finishPercent === 0) ||
              (item.taskEndDate <= endTime &&
                item.taskEndDate >= startTime &&
                item.finishPercent < 2)) &&
            (item.creatorKey !== userKey ||
              (item.creatorKey === userKey && item.executorKey === userKey))
          ) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 1:
        // arr = allCardArray.filter(item => item.taskType > 3);
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            item.importantStatus === 1 &&
            item.finishPercent === 0 &&
            (item.creatorKey !== userKey ||
              (item.creatorKey === userKey && item.executorKey === userKey))
          ) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 2:
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            item.taskEndDate &&
            (item.creatorKey === userKey || item.executorKey === userKey)
          ) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 3:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.executorKey === userKey && item.finishPercent === 0) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 4:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.creatorKey === userKey && item.finishPercent === 0) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 6:
        arr = cardArray.map((item) => {
          item.show = true;
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 10:
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.taskEndDate && item.executorKey === userKey) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      default:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.finishPercent === 10) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(allLabelArray);
        break;
    }
    return arr;
  },
  formatFilter(cardArray, filterObject) {
    let arr = [];
    let state = "";
    let str = "";
    let startTaskTime = moment(new Date())
      .add(1, "days")
      .startOf("day")
      .valueOf();
    let filterArray = filterObject.filterType;
    const startTime = moment().startOf("day").valueOf();
    const endTime = moment().endOf("day").valueOf();
    if (filterObject.groupKey) {
      state = "item.groupKey===filterObject.groupKey";
    }
    if (filterObject.executorKey) {
      state =
        state === ""
          ? "item.executorKey===filterObject.executorKey"
          : `${state} && item.executorKey===filterObject.executorKey`;
    }
    if (filterObject.creatorKey) {
      state =
        state === ""
          ? "item.creatorKey===filterObject.creatorKey"
          : `${state} && item.creatorKey===filterObject.creatorKey`;
    }
    if (filterArray.indexOf("过期") !== -1) {
      str =
        str === ""
          ? `(item.taskEndDate < ${startTime} && item.finishPercent===0)`
          : `${str} || (item.taskEndDate < ${startTime} && item.finishPercent===0)`;
    }
    if (filterArray.indexOf("今天") !== -1) {
      str =
        str === ""
          ? `(item.taskEndDate >= ${startTime} && item.taskEndDate <= ${endTime} && item.finishPercent<2)`
          : `${str} || (item.taskEndDate >= ${startTime} && item.taskEndDate <= ${endTime} && item.finishPercent<2)`;
    }
    if (filterArray.indexOf("已完成") !== -1) {
      str =
        str === ""
          ? "(item.taskEndDate && item.finishPercent===1)"
          : `${str} || (item.taskEndDate && item.finishPercent===1)`;
    }
    if (filterArray.indexOf("重要") !== -1) {
      str =
        str === "" ? "item.importantStatus" : `${str} || item.importantStatus`;
    }
    if (filterArray.indexOf("未来") !== -1) {
      str =
        str === ""
          ? "item.taskEndDate >= " + startTaskTime
          : `${str} || item.taskEndDate >= ${startTaskTime}`;
    }

    if (filterArray.indexOf("一般卡片") !== -1) {
      str =
        str === ""
          ? "item.finishPercent===10"
          : `${str} || item.finishPercent===10`;
    }
    if (filterArray.indexOf("已归档") !== -1) {
      str =
        str === ""
          ? "item.finishPercent===2"
          : `${str} || item.finishPercent===2`;
    }
    state =
      str !== "" ? (state !== "" ? state + "&& (" + str + ")" : str) : state;
    if (state === "" && str === "") {
      state = true;
    }
    cardArray.forEach((item, index) => {
      // item.show = false;
      //eslint-disable-next-line
      if (eval(state)) {
        // item.show = true;
        arr.push(item);
      }
    });
    return arr;
  },
  // formatColor(canvas, img) {
  //   canvas.width = img.width;
  //   canvas.height = img.height;

  //   let context = canvas.getContext('2d');

  //   context.drawImage(img, 0, 0);

  //   // 获取像素数据
  //   let data = context.getImageData(0, 0, img.width, img.height).data;
  //   let [r, g, b] = [0, 0, 0];
  //   // 取所有像素的平均值
  //   let index = 0;
  //   for (let row = 0; row < img.height; row++) {
  //     for (let col = 0; col < img.width; col++) {
  //       index++;
  //       r += data[(img.width * row + col) * 4];
  //       g += data[(img.width * row + col) * 4 + 1];
  //       b += data[(img.width * row + col) * 4 + 2];
  //     }
  //   }
  //   // 求取平均值
  //   r /= img.width * img.height;
  //   g /= img.width * img.height;
  //   b /= img.width * img.height;

  // 将最终的值取整
  // r = Math.round(r);
  // g = Math.round(g);
  // b = Math.round(b);
  // return 'rgb(' + r + ',' + g + ',' + b + ')';
  // },
  formatJq(year, month, day) {
    const sTermInfo = [
      0,
      21208,
      42467,
      63836,
      85337,
      107014,
      128867,
      150921,
      173149,
      195551,
      218072,
      240693,
      263343,
      285989,
      308563,
      331033,
      353350,
      375494,
      397447,
      419210,
      440795,
      462224,
      483532,
      504758,
    ];
    const solarTerm = [
      "小寒",
      "大寒",
      "立春",
      "雨水",
      "惊蛰",
      "春分",
      "清明",
      "谷雨",
      "立夏",
      "小满",
      "芒种",
      "夏至",
      "小暑",
      "大暑",
      "立秋",
      "处暑",
      "白露",
      "秋分",
      "寒露",
      "霜降",
      "立冬",
      "小雪",
      "大雪",
      "冬至",
    ];
    let solarTerms = "";
    //　　此方法是获取该日期是否为某节气
    //    let tmp1 = new Date((31556925974.7*(year-1900)+sTermInfo[month*2+1]*60000)+Date.UTC(1900,0,6,2,5));
    //    let tmp2 = tmp1.getUTCDate();
    //    if (tmp2==day)
    //        solarTerms = solarTerm[month*2+1];
    //    console.log(solarTerms);
    //    tmp1 = new Date((31556925974.7*(year-1900)+sTermInfo[month*2]*60000)+Date.UTC(1900,0,6,2,5));
    //    tmp2= tmp1.getUTCDate();
    //    if (tmp2==day)
    //        solarTerms = solarTerm[month*2];

    //　　此方法可以获取该日期处于某节气
    while (solarTerms === "") {
      let tmp1 = new Date(
        31556925974.7 * (year - 1900) +
          sTermInfo[month * 2 + 1] * 60000 +
          Date.UTC(1900, 0, 6, 2, 5)
      );
      let tmp2 = tmp1.getUTCDate();
      if (tmp2 === day) solarTerms = solarTerm[month * 2 + 1];
      tmp1 = new Date(
        31556925974.7 * (year - 1900) +
          sTermInfo[month * 2] * 60000 +
          Date.UTC(1900, 0, 6, 2, 5)
      );
      tmp2 = tmp1.getUTCDate();
      if (tmp2 === day) solarTerms = solarTerm[month * 2];
      if (day > 1) {
        day = day - 1;
      } else {
        month = month - 1;
        if (month < 0) {
          year = year - 1;
          month = 11;
        }
        day = 31;
      }
    }
    return solarTerms;
  },
  // formatImgUrl(arr, str) {
  //   arr.map((item, index) => {
  //     str = str.replace(/<img src=\"(blob:||data:)+.*?(?:>|\/>)/, item);
  //   });
  //   return str;
  // },
  formatBlob(src) {
    // let bstr = atob(bloburl);
    // let n = bstr.length;
    // let u8arr = new Uint8Array(n);
    // while (n--) {
    //   u8arr[n] = bstr.charCodeAt(n);
    // }
    // return new Blob([u8arr], { type: 'text/plain' });
  },
};
export default format;
