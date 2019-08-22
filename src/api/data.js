import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

// 在线设备统计
export const deviceOnlineStatus = () => {
  return axios.request({
    url: 'device/report/OnlineStatus',
    method: 'get'
  })
}

// 设备列表
export const getDeviceList = data => {
  return axios.request({
    url: '/device/pageList',
    data,
    method: 'post'
  })
}

export const getSystemList = () => {
  return axios.request({
    url: 'get_system_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
