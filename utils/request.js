
import config from '../config/index';

const { version : VERSION, service : SERVICE } = config;

function getSystemInfo () {
  const fields = ['brand', 'model', 'version', 'system', 'platform', 'SDKVersion'];
  let systemInfo = wx.getSystemInfoSync();
  const Info = {}
  fields.forEach(key => Info[key] = systemInfo[key]);
  return Info;
}

const systemInfo = getSystemInfo();
const isIOS = /ios/i.test(systemInfo.platform);

const HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
  Accept: 'application/json, text/javascript',
  'x-source': 'wx_bizbox',
  'x-app-version': VERSION,
  'x-pid': isIOS ? '60039' : '80039',
  systemInfo: JSON.stringify(systemInfo),
};

function showToast (msg) {
  return wx.showToast({
    title: msg || '',
    icon: 'none'
  })
}

function getLoginPath () {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length-1];
  const routeArr = currentPage.route.split('/');

  return routeArr.reduceRight((loginRoute, path) => {
    if (path !== 'pages') {
      return '../' + loginRoute;
    }

    return loginRoute;
  }, 'pages/login/login');
}

function getHeaders (header) {
  const token = wx.getStorageSync('token');
  const deviceid = wx.getStorageSync('deviceID');
  if (token) {
    HEADERS.token = token;
  }

  if (deviceid) {
    HEADERS.deviceid = deviceid;
  }

  return ({
    ...HEADERS,
    ...header
  })
}

const fetchingMap = {};

function newFetch ({
  url,
  data = {},
  header = {},
  useLoading = false,
  useGeneralHandle = true,
  fetchOpt,
}) {
  if (fetchingMap[url]) {
    fetchingMap[url].abort()
  }
  const newHeaders = getHeaders(header);
  return new Promise((resolve, reject) => {
    useLoading && wx.showLoading({ mask: true });
    const requestTask = wx.request({
      url,
      data,
      header: {
        ...newHeaders,
      },
      ...fetchOpt,
      success: function (res) {
        if (useGeneralHandle) {
          // 使用通用处理
          if (res.data && (res.data.ret || res.data.status === 0)) {
            resolve(res.data.data);
          } else {
            if (res.statusCode === 401) {
              showToast('登录过期，请重新登录');

              try {
                wx.clearStorageSync();
              } catch (e) {
                console.log(e)
              }
              const loginUrl = getLoginPath();

              wx.redirectTo({
                url: loginUrl,
              })
            } else if (res.data) {
              if (res.data.msg) {
                showToast(res.data.msg);
              } else {
                status = typeof res.status !== 'undefined'
                  ? ` status: ${rejectData.status}` : '';
                showToast(`请求错误${status}`);
              }
            } else {
              let msg = '请求失败';
              if (res.statusCode >= 400) {
                msg = `${msg} ${res.statusCode}`
              }
              showToast('请求失败');
            }
          }
        } else {
          resolve(res);
        }
      },
      fail: function (err) {
        if (useGeneralHandle) {
          if (/timeout/g.test(err.errMsg)) {
            showToast('请求超时');
          } else if (/abort/g.test(err.errMsg)) {
            console.log(err);
          } else if (/url not in domain list/g.test(err.errMsg)) {
            showToast('合法域名校验出错');
          } else {
            showToast('请求失败');
          }
        } else {
          reject(err);
        }
      },
      complete: function () {
        delete fetchingMap[url];
        useLoading && wx.hideLoading();
      },
    });
    fetchingMap[url] = requestTask;
  })
}

function get (opts) {
  const fetchOpt = {
    method: 'GET',
  };
  return newFetch({
    ...opts,
    fetchOpt,
  })
}

function post (opts) {
  const fetchOpt = {
    method: 'POST',
  };
  return newFetch({
    ...opts,
    fetchOpt,
  })
}

function getApiAddress(key, path, version = 1) {
  const url = SERVICE.get(`API_${key}`);
  if (version === 'NO_VERSION') {
    return `${url}/${path}`;
  }
  return `${url}/${path}/v${version}`;
}

const Request = {
  get,
  post,
  getApiAddress,
};

export default Request;
