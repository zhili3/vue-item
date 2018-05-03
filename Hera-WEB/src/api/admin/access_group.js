import request from '@/utils/request'

export function AccessGroupList(data,params) {
  return request({
    url:'/access-group-list?'+params,
    method: 'post',
    data:data
  })
}
export function AccessGroups(data,params) {
  return request({
    url:'/access-groups?'+params,
    method: 'post',
    data:data
  })
}
export function getAccessList(data,params) {
  return request({
    url:'/get-access-list?'+params,
    method: 'post',
    data:data
  })
}

export function addAccess(data,params) {
  return request({
    url:'/add-access-list?'+params,
    method: 'post',
    data:data
  })
}


export function addAccessGroup(data,params) {
  return request({
    url:'/add-access-group-list?'+params,
    method: 'post',
    data:data
  })
}


export function editAccess(data,params) {
  return request({
    url:'/edit-access-list?'+params,
    method: 'post',
    data:data
  })
}


export function editAccessGroup(data,params) {
  return request({
    url:'/edit-access-group-list?'+params,
    method: 'post',
    data:data
  })
}

export function delAccess(data,params) {
  return request({
    url:'/del-access-list?'+params,
    method: 'post',
    data:data
  })
}

export function delAccessGroup(data,params) {
  return request({
    url:'/del-access-group-list?'+params,
    method: 'post',
    data:data
  })
}









