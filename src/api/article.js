import request from '@/utils/request'
// qs请求数据转表单格式
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: 'v1/tx/info',
    // url: 'tx/info',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchTx(id) {
  return request({
    url: 'v1/device/' + id,
    // url: 'device/' + id,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: 'v1/device',
    // url: 'device',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'v1/tx/config/restart',
    // url: 'tx/config/restart',
    method: 'post',
    data: qs.stringify(data)
  })
}
