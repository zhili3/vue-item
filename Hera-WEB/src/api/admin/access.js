import request from '@/utils/request'

export function getList(data,params) {
  return request({
    url:'/access-list?'+params,
    method: 'post',
    data:data
  })
}
