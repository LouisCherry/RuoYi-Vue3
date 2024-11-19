import axios from 'axios';
import { getPrivateresumeinfoData, getPublicresumeinfoData } from '../mock/mock'; // 引入 mock 数据
import { inject } from 'vue';



// 定义fetchData函数
function fetchData(url, data) {
  const useMock = inject('useMock');
  return new Promise((resolve, reject) => {
    if (useMock === undefined) {
      console.error('没有找到 useMock 变量，请确保在合适的组件层级提供了该变量');
      return;
    }
    if (useMock) {
      // 使用 mock 数据
      if (url === 'api/privateresumeinfo') {
        resolve(getPrivateresumeinfoData());
      } else if (url === 'api/publicresumeinfo') {
        resolve(getPublicresumeinfoData());
      }
    } else {
      // 发起真实请求
      const newURL = window.serverUrl + url;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      axios.post(newURL, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    }
  });
}

// 明确导出fetchData函数
export { fetchData };