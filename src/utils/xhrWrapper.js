import axios from 'axios';
import qs from 'qs';

// 定义支持的HTTP请求方法
const methods = ['get', 'post', 'put', 'patch', 'del', 'head'];

class Client {
  constructor() {
    // 为每种请求方法创建对应的请求方法
    methods.forEach((method) => {
      this[method] = Client.requestWrapper(method);
    });
  }

  // 获取Spotify的Access Token
  static async getAccessToken() {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;  // 获取client_id
    const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;  // 获取client_secret

    // Base64编码client_id和client_secret
    const auth = btoa(`${client_id}:${client_secret}`);

    try {
      // 发送请求获取Access Token
      const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
        grant_type: 'client_credentials',
      }), {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      return response.data.access_token;  // 返回Access Token
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Unable to fetch access token');
    }
  }

  // 请求包装器，处理具体的API请求
  static requestWrapper(method) {
    async function decorateRequest({ url, data, query }) {
      const access_token = await Client.getAccessToken();  // 获取Token

      const queryStrings = qs.stringify(query);  // 序列化查询参数

      return {
        request: {
          method,
          headers: { 
            'Authorization': `Bearer ${access_token}`,  // 使用Bearer Token
            'Content-Type': 'application/json; charset=UTF-8',
          },
          data: JSON.stringify(data),  // 请求数据
        },
        requestURL: `https://api.spotify.com/v1/${url}?${queryStrings}`,  // 完整请求URL
      };
    }

    // 发送请求并检查状态
    function checkStatus(response, resolve, reject) {
      const { status, data } = response;
      if (status >= 200 && status < 300) {
        resolve(data);  // 成功时返回数据
      } else {
        reject(data);  // 错误时抛出数据
      }
    }

    // 返回一个处理请求的函数
    return async ({ url, data = null, query }) => {
      const { requestURL, request } = await decorateRequest({
        method, url, data, query,
      });

      return new Promise((resolve, reject) => {
        axios(requestURL, request)  // 发送请求
          .then(response => checkStatus(response, resolve, reject))
          .catch(error => checkStatus(error, resolve, reject))
          .catch(reject);  // 处理错误
      });
    };
  }
}

export default new Client();  // 导出实例
