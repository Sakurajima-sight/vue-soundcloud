import axios from 'axios';
import qs from 'qs';

const methods = ['get', 'post', 'put', 'patch', 'del', 'head'];

class SpotifyUserClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = SpotifyUserClient.requestWrapper(method);
    });

    this.accessToken = null;  // 存储 Access Token
    this.refreshToken = null; // 存储 Refresh Token
    this.tokenExpiration = 0; // 存储 Token 过期时间
  }

  static clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Client ID
  static clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET; // Client Secret
  static redirectUri = "http://localhost:8080"; // 回调 URI
  static scope = "streaming user-read-email user-read-private"; // 权限范围

  // 统一获取 token 方法
  static async fetchToken({ code, refreshToken }) {
    const params = new URLSearchParams();
    params.append('client_id', SpotifyUserClient.clientId);
    params.append('client_secret', SpotifyUserClient.clientSecret);
    params.append('redirect_uri', SpotifyUserClient.redirectUri);

    if (code) {
      params.append('code', code);
      params.append('grant_type', 'authorization_code');
    } else if (refreshToken) {
      params.append('refresh_token', refreshToken);
      params.append('grant_type', 'refresh_token');
    }

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch token');
    }
  }

  // 获取有效的 Access Token（带缓存机制）
  async getValidAccessToken() {
    const currentTime = Date.now() / 1000; // 当前时间（秒）

    // 如果缓存存在且未过期，直接返回
    if (this.accessToken && this.tokenExpiration > currentTime) {
      return this.accessToken;
    }

    // 如果有 refreshToken，则通过刷新 token 获取新的 accessToken
    if (this.refreshToken) {
      const data = await SpotifyUserClient.fetchToken({ refreshToken: this.refreshToken });
      this.accessToken = data.access_token;
      this.tokenExpiration = Date.now() / 1000 + data.expires_in;
      return this.accessToken;
    }

    throw new Error("Access Token is missing and no refresh token available.");
  }

  // 请求包装器，处理具体的 API 请求
  static requestWrapper(method) {
    return async ({ url, data = null, query }) => {
      const access_token = SpotifyUserClient.getInstance().accessToken;  // 获取有效 Token
      const queryStrings = qs.stringify(query);  // 序列化查询参数

      const requestConfig = {
        method,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        data: JSON.stringify(data),
      };

      try {
        const response = await axios(`https://api.spotify.com/v1/${url}?${queryStrings}`, requestConfig);
        return response.data;  // 请求成功返回数据
      } catch (error) {
        throw new Error('Error fetching data from Spotify API');
      }
    };
  }

  // 获取艺术家信息
  static async getArtistInfo(artistId) {
    try {
      const response = await SpotifyUserClient.getInstance().get({
        url: `artists/${artistId}`,
      });
      return response;  // 返回艺术家信息
    } catch (error) {
      console.error('Error fetching artist info:', error);
      throw new Error('Unable to fetch artist information');
    }
  }

  // 控制播放器行为
  static async controlPlayback(action, trackUri) {
    try {
      // 根据不同的操作，选择 PUT 或 POST 方法
      const method = ['next', 'previous', 'queue'].includes(action) ? 'post' : 'put';

      // 使用 requestWrapper 发送请求
      const response = await SpotifyUserClient.getInstance()[method]({
        url: `me/player/${action}`,
        // query: { uri: trackUri }, // 如果有 trackUri 传递则包含在请求体中
        data: { uris: [trackUri] }
      });

      return response;  // 成功时返回响应数据
    } catch (error) {
      console.error('Error controlling playback:', error);
      throw new Error('Unable to control playback');
    }
  }


  // 获取 SpotifyUserClient 实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyUserClient();
    }
    return this.instance;
  }
}

export default SpotifyUserClient;
