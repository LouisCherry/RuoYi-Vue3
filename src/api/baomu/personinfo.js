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
    url: '/baomu/personinfo/full',
    method: 'put',
    data: data
  })
}

// 修改保姆个人信息/单字段修改
export function updatePersoninfoSingle(data) {
  return request({
    url: '/baomu/personinfo/single',
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

// 删除保姆个人信息
export function publicresumeinfo(id) {
  return request({
    url: '/baomu/personinfo/publicresumeinfo/' + id,
    method: 'get'
  })
}
