import API from '@/utils/xhrWrapper';

export default {
  // getTracks: 获取 tracks 数据的异步操作
  async getTracks({ commit }) {
    try {
      // 提交 mutation 通知正在加载 tracks 数据 
      commit('GET_TRACKS');  

      // 发起 API 请求获取 tracks 数据（使用 Spotify 的 search API）
      const response = await API.getInstance().get({  
        url: 'search',  
        query: {
          q: 'house',          // 搜索的关键词，这里是 house 标签的音乐
          type: 'track',       // 搜索类型为 track
          limit: 50,           // 限制返回的结果数量为 50
          offset: 0,           // 数据的起始位置（分页）
        },
      });

      // 如果请求成功，提交 mutation 更新 tracks 数据 
      commit('GET_TRACKS_SUCCESS', response.tracks.items);  // 获取搜索结果中的歌曲项
    } catch (error) { 
      // 如果请求失败，提交 mutation 处理错误 
      commit('GET_TRACKS_FAIL', error);  
    } 
  },
};
