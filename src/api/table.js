import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'v1/device',  //  /dev-api/v1/device
    method: 'get',
    params: params
  })
}
