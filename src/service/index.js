import axios from 'axios'
import {
  message
} from 'antd'
axios.defaults.headers.post['Content-Type'] = 'application/json';
const service = axios.create({
  // baseURL: '/ledger-dispatcher-service',
  timeout: 20000
})
// return config
service.interceptors.request.use((r) => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    r.headers.common['Authorization'] = 'basic '+auth
  }
  return r
})
//添加响应拦截器
service.interceptors.response.use(function (response) {
  if (response.data.status === 'unregistered') {
    window.location.href = '#/login'
    return response.data
  }
  if (response.data.status === 'fail') {
    message.error(response.data.msg)
    return response.data
  }
  return response.data
}, function (error) {
  message.error(error)
  if(error.request.status == 401) {
    window.location.href = '#/login'
  }
  return Promise.reject(error)
})
export default service
