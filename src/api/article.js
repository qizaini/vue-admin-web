import request from '@/utils/request'
// qs请求数据转表单格式
import qs from 'qs'
/* eslint-disable */

//url: 'v1/xxx'本地路径，url: 'xxx'nginx服务器路径
export function fetchList(query) {
  return request({
    url: 'v1/api-tx/tx/info',
    // url: 'api-tx/tx/info',
    method: 'post',
    data: query
  })
}

/*export function fetchTx(id) {
  return request({
    url: 'v1/api-tx/tx/device/' + id,
    // url: 'api-tx/tx/device/' + id,
    method: 'get'
  })
}*/

export function createArticle(data) {
  return request({
    url: 'v1/api-tx/tx/device',
    // url: 'api-tx/tx/device',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'v1/api-tx/tx/config/restart',
    // url: 'api-tx/tx/config/restart',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function restartArticle(data) {
  return request({
    url: 'v1/api-tx/tx/service/restart',
    // url: 'api-tx/tx/service/restart',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function stopArticle(data) {
  return request({
    url: 'v1/api-tx/tx/service/stop',
    // url: 'api-tx/tx/service/stop',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchMap() {
  return request({
    url: 'v1/api-tx/tx/mapInfo',
    // url: 'api-tx/tx/mapInfo',
    method: 'get'
  })
}
