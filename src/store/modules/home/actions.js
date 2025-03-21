import SpotifyPublicClient from '@/utils/SpotifyPublicClient';
import LastfmAPI from '@/utils/xhrWrapperLastfm';

export default {
  // getTracks: 获取 tracks 数据的异步操作
  async getTracks({ commit }, { genre, page }) { 
    try {
      // 提交 mutation 通知正在加载 tracks 数据 
      commit('GET_TRACKS');  

      // 发起 API 请求获取 Last.fm 的 tag 相关歌曲数据
      const lastfmResponse = await LastfmAPI.getInstance().get({
        url: '2.0/',
        query: {
          method: 'tag.getTopTracks',
          tag: genre,        // 标签名，例：'house'
          api_key: import.meta.env.VITE_LASTFM_API_KEY,  // 使用 Last.fm API Key
          format: 'json',
          limit: 16,         // 每页返回16条歌曲数据
          page: page,        // 根据页数来设置分页
          linked_partitioning: 1,  // 启用 linked_partitioning（分页）
        },
      });

      // 从 Last.fm 返回的歌曲数据中提取歌曲名称
      const topTracks = lastfmResponse.tracks.track.map(track => track.name);
      
      // 使用 Spotify API 搜索每首曲目，获取相关的结果
      const spotifyResults = await Promise.all(
        topTracks.map(async (trackName) => {
          const response = await SpotifyPublicClient.getInstance().get({
            url: 'search',
            query: {
              q: trackName,       // 使用 Last.fm 中获取的歌曲名
              type: 'track',      // 搜索类型为 track
              limit: 1,           // 限制返回的结果数量为 1 条
              offset: 0,          // 不使用分页
            },
          });  

          return response.tracks.items[0];  // 获取第一条匹配的结果
        })
      );

      // 如果请求成功，提交 mutation 更新 tracks 数据
      commit('GET_TRACKS_SUCCESS', { tracks: spotifyResults, genre, page});  // 更新结果到 tracks
    } catch (error) { 
      // 如果请求失败，提交 mutation 处理错误 
      commit('GET_TRACKS_FAIL', error);  
    } 
  },
  // 用于重置或清除 tracks 数据的状态
  clearTracks: (context) => {
    context.commit('CLEAR_TRACKS');  // 提交 mutation 清空 tracks 数据
  },
  
  setSpotifyPlayer: (context, player) => {
    context.commit('SET_SPOTIFY_PLAYER', player);
  }
};
