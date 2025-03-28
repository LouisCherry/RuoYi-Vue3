import request from '@/utils/request'

// 查询保姆个人信息列表
export function listPersoninfo(query) {
  return request({
    url: '/baomu/personinfo/list',
    method: 'get',
    params: query
  })
}

// 查询保姆个人信息详细
export function getPersoninfo(id) {
  return request({
    url: '/baomu/personinfo/' + id,
    method: 'get'
  })
}

// 新增保姆个人信息
export function addPersoninfo(data) {
  return request({
    url: '/baomu/personinfo',
    method: 'post',
    data: data
  })
}

// 修改保姆个人信息
export function updatePersoninfo(data) {
  return request({
    url: '/baomu/personinfo',
    method: 'put',
    data: data
  })
}

// 删除保姆个人信息
export function delPersoninfo(id) {
  return request({
    url: '/baomu/personinfo/' + id,
    method: 'delete'
  })
}
