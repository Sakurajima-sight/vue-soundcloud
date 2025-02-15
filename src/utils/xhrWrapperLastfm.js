import axios from 'axios';
import qs from 'qs';

// 定义支持的HTTP请求方法
const methods = ['get', 'post', 'put', 'patch', 'del', 'head'];

class LastfmClient {
  constructor() {
    // 为每种请求方法创建对应的请求方法
    methods.forEach((method) => {
      this[method] = LastfmClient.requestWrapper(method);
    });
  }

  // 获取API请求的URL
  static buildRequestURL({ method, query }) {
    const apiKey = import.meta.env.VITE_LASTFM_API_KEY;  // 从环境变量获取 API Key
    const queryStrings = qs.stringify({ ...query, api_key: apiKey, format: 'json' });  // 添加 API Key 和格式

    return `https://ws.audioscrobbler.com/2.0/?method=${method}&${queryStrings}`;
  }

  // 请求包装器，处理具体的API请求
  static requestWrapper(method) {
    return async ({ query }) => {
      const requestURL = LastfmClient.buildRequestURL({ method, query });
      const response = await axios.get(requestURL);
      return response.data;  // 返回API响应数据
    };
  }

  // 获取特定tag的Top Tracks
  static async getTopTracksByTag(tag) {
    try {
      const response = await LastfmClient.getInstance().get({
        method: 'tag.getTopTracks',
        query: { tag },  // 传入tag查询参数
      });
      return response;  // 返回top tracks的数据
    } catch (error) {
      console.error('Error fetching top tracks by tag:', error);
      throw new Error('Unable to fetch top tracks by tag');
    }
  }

  // 获取LastfmClient实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new LastfmClient();
    }
    return this.instance;
  }
}

export default LastfmClient;
