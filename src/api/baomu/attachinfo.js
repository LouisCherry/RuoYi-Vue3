import request from '@/utils/request'

// 查询附件列表
export function listAttachinfo(query) {
  return request({
    url: '/baomu/attachinfo/list',
    method: 'get',
    params: query
  })
}

// 查询附件详细
export function getAttachinfo(ATTACHGUID) {
  return request({
    url: '/baomu/attachinfo/' + ATTACHGUID,
    method: 'get'
  })
}

// 新增附件
export function addAttachinfo(data) {
  return request({
    url: '/baomu/attachinfo',
    method: 'post',
    data: data
  })
}

// 修改附件
export function updateAttachinfo(data) {
  return request({
    url: '/baomu/attachinfo',
    method: 'put',
    data: data
  })
}

// 删除附件
export function delAttachinfo(ATTACHGUID) {
  return request({
    url: '/baomu/attachinfo/' + ATTACHGUID,
    method: 'delete'
  })
}
