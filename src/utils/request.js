/* eslint-disable */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getTokenType, getToken, getIdentity } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: "/", // url = base url + request url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['authorization'] = getToken()
      config.headers['authorization'] = getTokenType() + " " + getToken()
    }
    // if (store.getters.identity) {
    //   config.headers['identity'] = getIdentity()
    // }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 如果要获取http信息（例如标题或状态）
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = res.code
    const status = response.status
    if (status === 200) {
      return res
    }

    // 如果自定义代码不是20000，则将其判断为错误.
    if (code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      //不同权限不同操作，如果response=401给出提示弹框 没有权限，不允许对此进行操作。


      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (code === 50008 || code === 50012 || code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
