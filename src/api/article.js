import request from '@/utils/request'
// qs请求数据转表单格式
import qs from 'qs'

//url: 'v1/xxx'本地路径，url: 'xxx'nginx服务器路径
//查询激励器列表
export function fetchList(query) {
  return request({
    url: 'v1/api-tx/tx/info',
    // url: 'api-tx/tx/info',
    method: 'post',
    data: query
  })
}

//根据{txId}(9999,123456789,1570758003)查询单个或多个激励器信息
export function fetchTx(id) {
  return request({
    url: 'v1/api-tx/tx/info/batch/' + id,
    // url: 'api-tx/tx/info/batch/' + id,
    method: 'get'
  })
}

//查看日志
export function fetchLogs(id) {
  return request({
    url: 'v1/api-tx/tx/logs/' + id,
    // url: 'api-tx/tx/logs/' + id,
    method: 'get'
  })
}

/*export function createArticle(data) {
  return request({
    url: 'v1/api-tx/tx/device',
    // url: 'api-tx/tx/device',
    method: 'post',
    data
  })
}*/

//修改激励器信息
export function updateArticle(data) {
  return request({
    url: 'v1/api-tx/tx/config/restart',
    // url: 'api-tx/tx/config/restart',
    method: 'post',
    data: qs.stringify(data)
  })
}

//重启激励器服务
export function restartArticle(data) {
  return request({
    url: 'v1/api-tx/tx/service/restart',
    // url: 'api-tx/tx/service/restart',
    method: 'post',
    data: qs.stringify(data)
  })
}

//停止激励器服务
export function stopArticle(data) {
  return request({
    url: 'v1/api-tx/tx/service/stop',
    // url: 'api-tx/tx/service/stop',
    method: 'post',
    data: qs.stringify(data)
  })
}

//地图统计信息
export function fetchMap() {
  return request({
    url: 'v1/api-tx/tx/mapInfo',
    // url: 'api-tx/tx/mapInfo',
    method: 'get'
  })
}

