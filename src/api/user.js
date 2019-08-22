import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    // url: '/user/doLogin', // 线上
    url: 'login', // 模拟
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (userName) => {
  return axios.request({
    // url: '/user/doLogout', // 线上
    url: 'logout', // 模拟
    method: 'get'
  })
}
