import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'v1/device',
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
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: 'v1/device',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'v1/device',
    method: 'post',
    data
  })
}
