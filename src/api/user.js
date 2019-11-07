import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    // url: 'v1/api-oauth2/oauth/token',
    url: 'v1/api-oauth2/oauth/token',
    method: 'post',
    data: qs.stringify(data)
  })
}
// http://localhost:9528/v1/api-oauth2/oauth/token?username=test&password=123456&client_id=client2&client_secret=123456&grant_type=password&scope=app
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
