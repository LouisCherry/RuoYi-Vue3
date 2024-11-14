// src/api/index.js
import axios from 'axios'
import { getData, getNewData } from '../mock/mock' // 引入 mock 数据

const useMock = window.Mock // 从环境变量中读取是否使用 mock

export function fetchData (url, data) {
  return new Promise((resolve, reject) => {
    if (useMock) {
      // 使用 mock 数据
      if (url === 'api/privateresumeinfo') {
        resolve(getData())
      } else if (url === 'api/publicresumeinfo') {
        resolve(getNewData())
      }
    } else {
      // 发起真实请求
      var newURL = window.serverUrl + url
      axios.defaults.headers.post['Content-Type'] = 'application/json'
      axios.post(newURL, data)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    }
  })
}
