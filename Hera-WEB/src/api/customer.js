import request from '@/utils/request'

// 用户列表
export function customerForm(params) {
  return request({
    url: '/admin/customer',
    method: 'post',
    data: params
  })
}

// 用户信息
export function customerInfo(userId) {
  return request({
    url: '/admin/customer/'+userId,
    method: 'post'
  })
}
