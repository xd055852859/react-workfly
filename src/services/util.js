// 生成标识符
export const guid = (len, radix) => {
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

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

// 获取url中search的值
export const getSearchParamValue = (search, paramName) => {
  const QUERY_PARAMS = new URLSearchParams(search).get(paramName);
  if (QUERY_PARAMS) {
    localStorage.setItem(paramName, QUERY_PARAMS);
    return QUERY_PARAMS;
  } else {
    return null;
  }
};
export const is_mobile = () => {
  let regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220|Mobile|ipad)/i;
  let u = navigator.userAgent;
  if (null == u) {
    return true;
  }
  let result = regex_match.exec(u);

  if (null == result) {
    return false;
  } else {
    return true;
  }
};

export const checkWebSiteOnline = (config) => {
  let img = new Image();
  img.onload = function () {
    if (typeof config.success == "function") config.success(config.url);
  };

  img.onerror = function () {
    if (typeof config.error == "function") config.error(config.url);
  };

  img.src = config.url + "?" + Math.random();
};
