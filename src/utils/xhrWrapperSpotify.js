import axios from 'axios';
import qs from 'qs';

// 定义支持的HTTP请求方法
const methods = ['get', 'post', 'put', 'patch', 'del', 'head'];

class SpotifyClient {
  constructor() {
    // 为每种请求方法创建对应的请求方法
    methods.forEach((method) => {
      this[method] = SpotifyClient.requestWrapper(method);
    });
    this.accessToken = null;  // 存储Access Token
    this.tokenExpiration = 0; // 存储Token过期时间
  }

  // 获取Spotify的Access Token
  static async getAccessToken() {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    // Base64编码client_id和client_secret
    const auth = btoa(`${client_id}:${client_secret}`);

    try {
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
      throw new Error('Unable to fetch access token');
    }
  }

  // 获取有效的Access Token（带缓存机制）
  async getValidAccessToken() {
    const currentTime = Date.now() / 1000; // 当前时间（秒）

    // 如果Access Token缓存存在且未过期，则直接返回
    if (this.accessToken && this.tokenExpiration > currentTime) {
      return this.accessToken;
    }

    // 否则，重新获取Token并缓存
    const token = await SpotifyClient.getAccessToken();
    this.accessToken = token;
    this.tokenExpiration = currentTime + 3600; // Token有效期为1小时
    return token;
  }

  // 请求包装器，处理具体的API请求
  static requestWrapper(method) {
    async function decorateRequest({ url, data, query }) {
      const access_token = await SpotifyClient.getInstance().getValidAccessToken();  // 获取有效Token

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

  static async getArtistInfo(artistId) {
    try {
      const response = await SpotifyClient.getInstance().get({
        url: `artists/${artistId}`,  // Spotify API endpoint for artist info
      });
      return response;  // 返回整个艺术家信息
    } catch (error) {
      console.error('Error fetching artist info:', error);
      throw new Error('Unable to fetch artist information');
    }
  }

  // 获取SpotifyClient实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyClient();
    }
    return this.instance;
  }
}

export default SpotifyClient;   // 导出SpotifyClient实例
