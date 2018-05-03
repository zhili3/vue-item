import request from '@/utils/request'

export function getUserList(data,params) {
  return request({
    url:'/user-list?'+params,
    method: 'post',
    data:data
  })
}


export function EditUser(data,params) {
  return request({
    url:'/add-user-list?'+params,
    method: 'post',
    data:data
  })
}

export function checkRoleList(data,params) {
  return request({
    url:'/check-user-dep-or-role?'+params,
    method: 'post',
    data:data
  })
}

export function checkAccessList(data,params) {
  return request({
    url:'/check-user-access-or-group?'+params,
    method: 'post',
    data:data
  })
}

export function editUserRoleList(data,params) {
  return request({
    url:'/edit-user-dep-or-role?'+params,
    method: 'post',
    data:data
  })
}

export function editUserAccessList(data,params) {
  return request({
    url:'/edit-user-access-or-group?'+params,
    method: 'post',
    data:data
  })
}

export function delUser(data,params) {
  return request({
    url:'/del-admin-user?'+params,
    method: 'post',
    data:data
  })
}













