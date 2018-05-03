import request from '@/utils/request'

// 全部订单
export function allOrder(params) {
  return request({
    url: '/admin/sales/order/list',
    method: 'post',
    data: params
  })
}

// 订单详情
export function orderInfo(params) {
  return request({
    url: '/admin/sales/order/view',
    method: 'get',
    params: params
  })
}

// 订单地址修改
export function orderAddressEdit(params) {
  return request({
    url: '/admin/sales/order/changeAddress',
    method: 'post',
    params: params
  })
}
