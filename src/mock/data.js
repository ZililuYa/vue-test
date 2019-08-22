import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const getSystemList = req => {
  let systemList = [
    {
      icon: 'icon-device',
      serviceInfoCode: 'dm',
      serviceInfoName: '百度',
      sort: 1,
      status: 1,
      url: 'https://www.baidu.com/'
    },
    {
      icon: 'icon-device',
      serviceInfoCode: 'mes',
      serviceInfoName: '谷歌',
      sort: 1,
      status: 1,
      url: 'https://www.google.com'
    },
    {
      icon: 'icon-user',
      serviceInfoCode: 'sp',
      serviceInfoName: '必应',
      sort: 2,
      status: 1,
      url: 'https://cn.bing.com'
    }
  ]
  return systemList
}
