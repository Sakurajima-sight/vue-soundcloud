import SpotifyPublicClient from '@/utils/SpotifyPublicClient';  // 引入 Spotify API 客户端

export default {
  // 使用 async/await 处理异步操作
  async search({ commit }, { page, query }) {
    commit('SEARCH_TRACKS');  // 发起搜索请求前，设置加载状态

    try {
      // 调用 Spotify API 获取搜索结果
      const response = await SpotifyPublicClient.getInstance().get({
        url: 'search',  // 修改为 Spotify 的搜索 API 路径
        query: {
          q: query,  // 用户搜索的关键词
          type: 'track',  // 只搜索 tracks
          limit: 16,  // 每次返回的结果数量
          offset: 16 * (page - 1),  // 计算偏移量，用于分页
        },
      });

      // 搜索成功后，提交 mutation 更新状态
      commit('SEARCH_TRACKS_SUCCESS', {
        searchResults: response.tracks.items, // 搜索结果
        page,
        query,
      });
    } catch (error) {
      commit('SEARCH_TRACKS_FAIL', error); // 如果请求失败，提交失败的 mutation
    }
  },

  // 清除搜索数据
  clearSearch({ commit }) {
    commit('CLEAR_SEARCH');  // 清除搜索数据
  },
};
