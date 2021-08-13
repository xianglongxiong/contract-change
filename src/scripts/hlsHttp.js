// 引入axios
import axios from 'axios'
import { hlsPopup } from 'hls-easy-ui'
import qs from 'qs'
import router from '../router/index'
let promiseArr = {}
let cancel = {}
const CancelToken = axios.CancelToken
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发起请求时，取消掉当前正在进行的相同请求
  config.cancelToken = new CancelToken(c => {
    cancel = c
  })
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  if ($config.debug) {
    let postName = 'post'
    console.log(postName + ' success')
    console.log(postName + ' response ' + JSON.stringify(response.data, '', 2))
    console.log(postName + ' End!')
  }
  if (response.data.result === 'E' || response.data.code === 'E') {
    hlsPopup.hideLoading()
    const err = {}
    err.message = response.data.message
    hlsPopup.showError(err.message)
    return Promise.resolve(err)
  } else {
    return response.data
  }
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '登录已失效，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '不支持的请求类型'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = '连接到服务器失败'
  }
  if (err.response && err.response.status === 401) {
    hlsPopup.hideLoading()
    hlsPopup.showPopup({
      title: '登录失效，重新登录',
      onConfirm: () => {
        router.push({name: 'Login'})
      },
    })
  } else {
    hlsPopup.hideLoading()
    hlsPopup.showError(err.message)
  }
  return Promise.resolve(err)
})
axios.defaults.baseURL = ''
axios.defaults.timeout = 15000
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, {arrayFormat: 'repeat'})
}
// get请求
export function get (url, param = {}) {
  let headers = {}
  if (window.localStorage.access_token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.access_token,
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    }
  }
  if ($config.debug) {
    let postName = 'GET'
    console.log(postName + ' Start!')
    console.log(postName + ' url ' + url)
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      headers: headers,
      params: param,
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// post请求
export function post (url, param) {
  param.user_id = window.localStorage.user_id
  param.access_token = window.localStorage.access_token
  let headers = {}
  if (window.localStorage.access_token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.access_token,
      'H-Request-Id': '68289083ed7e1b157634c73bb0b06dfd6e10c18488261',
      'H-Menu-Id': 1647,
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    }
  }
  if ($config.debug) {
    let postName = 'POST'
    console.log(postName + ' Start!')
    console.log(postName + ' url ' + url)
    console.log(postName + ' parameter ' + JSON.stringify(param, '', 2))
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      headers: headers,
      url,
      data: param,
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
