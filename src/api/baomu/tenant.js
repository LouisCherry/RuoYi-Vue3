import request from '@/utils/request'

// 查询租户清单列表
export function listTenant(query) {
  return request({
    url: '/baomu/tenant/list',
    method: 'get',
    params: query
  })
}

export function listnopermi(query){
  return request({
    url: '/baomu/tenant/listnopermi',
    method: 'get',
    params: query
  })
}

// 查询租户清单列表
export function tenantTree(query) {
  return request({
    url: '/baomu/tenant/tenantTree',
    method: 'get',
    params: query
  })
}

// 查询租户清单详细
export function getTenant(id) {
  return request({
    url: '/baomu/tenant/' + id,
    method: 'get'
  })
}

// 新增租户清单
export function addTenant(data) {
  return request({
    url: '/baomu/tenant',
    method: 'post',
    data: data
  })
}

// 修改租户清单
export function updateTenant(data) {
  return request({
    url: '/baomu/tenant',
    method: 'put',
    data: data
  })
}

// 删除租户清单
export function delTenant(id) {
  return request({
    url: '/baomu/tenant/' + id,
    method: 'delete'
  })
}
