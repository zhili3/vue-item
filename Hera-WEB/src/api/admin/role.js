import request from '@/utils/request'

export function RoleList(data,params) {
  return request({
    url:'/user-dep-list?'+params,
    method: 'post',
    data:data
  })
}


export function EditAccessToDep(data,params) {
  return request({
    url:'/add-access-to-dep-role?'+params,
    method: 'post',
    data:data
  })
}


export function CheckDepAccess(params) {
  return request({
    url:'/check-dep-access-or-group?'+params,
    method: 'get'
  })
}


export function AddDepOrRole(data,params) {
  return request({
    url:'/add-dep-or-role?'+params,
    method: 'post',
    data:data
  })
}

export function DelDepOrRole(data,params) {
  return request({
    url:'/del-dep-or-role?'+params,
    method: 'post',
    data:data
  })
}

export function DelsDepOrRole(data,params) {
  return request({
    url:'/dels-dep-or-role?'+params,
    method: 'post',
    data:data
  })
}








