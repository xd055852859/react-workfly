// /* eslint-disable no-undef */
const AUTH_URL = 'https://baokudata.qingtime.cn/sgbh';
const HOME_URL = 'https://workingdata.qingtime.cn/sgbh';
const request = {
  get: function (url, params) {
    return $.ajax({
      url: url,
      data: params,
      type: 'GET',
      headers: {
        token: localStorage.getItem('auth_token') || '',
      },
    }).then(
      function (res) {
        return res;
      },
      function () {
        alert('服务出错！');
      }
    );
  },
  post: function (url, params) {
    return $.ajax({
      url: url,
      timeout: 900 * 1000,
      data: JSON.stringify(params),
      type: 'POST',
      contentType: 'application/json',
      headers: {
        token: localStorage.getItem('auth_token') || '',
      },
    }).then(
      function (res) {
        return res;
      },
      function () {
        alert('服务出错！');
      }
    );
  },
  delete: function (url, params) {
    return $.ajax({
      url: url,
      type: 'DELETE',
      data: JSON.stringify(params),
      contentType: 'application/json',
      headers: {
        token: localStorage.getItem('auth_token') || '',
      },
    }).then(
      function (res) {
        return res;
      },
      function () {
        alert('服务出错！');
      }
    );
  },
  patch: function (url, params) {
    return $.ajax({
      url: url,
      type: 'PATCH',
      data: JSON.stringify(params),
      contentType: 'application/json',
      headers: {
        token: localStorage.getItem('auth_token') || '',
      },
    }).then(
      function (res) {
        return res;
      },
      function () {
        alert('服务出错！');
      }
    );
  },
};

const api = {
  loginByToken: function (token) {
    return request.get(AUTH_URL + '/account/userinfo', { token: token });
  },
  updateNode: function (token, key, name, detail) {
    return request.patch(HOME_URL + '/card', {
      token: token,
      key: key,
      title: name,
      content: detail,
    });
  },
  getTaskInfo(token, cardKey) {
    return request.get(HOME_URL + '/card/cardDetail', {
      token: token,
      cardKey: cardKey,
    });
  },
};
export default api;
