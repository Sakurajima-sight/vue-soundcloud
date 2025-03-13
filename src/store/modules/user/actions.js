import LastfmClient from '@/utils/xhrWrapperLastfm'; // 引入 Lastfm API 客户端
import SpotifyPublicClient from '@/utils/SpotifyPublicClient';

export default {
  // 获取用户资料
  async getUserProfile({ commit }, name) {
    try {
      commit('GET_USER_PROFILE'); // 提交请求开始的 mutation

      // 请求当前用户资料
      const response = await LastfmClient.getInstance().get({
        query: {
          method: 'artist.getinfo',
          artist: name,
        },
      });

      commit('GET_USER_PROFILE_SUCCESS', response); // 请求成功，提交成功的 mutation
    } catch (error) {
      commit('GET_USER_PROFILE_FAIL', error); // 请求失败，提交失败的 mutation
    }
  },

  // 获取用户的关注列表
  async getUserFollowings({ commit }, name) {
    try {
      commit('GET_USER_FOLLOWINGS'); // 提交请求开始的 mutation

      // 请求用户关注的艺术家列表
      const response = await LastfmClient.getInstance().get({
        query: {
          method: 'artist.getsimilar', 
          artist: name,
          limit: 6
        },
      });
      const similarArtists = response.similarartists.artist.map(artist => artist.name);
      // 去除包含传入 name 的艺术家名字（包括组合名、多个艺术家名的情况）
      const filteredArtists = similarArtists.filter(artistName => {
        // 判断艺术家名字是否完全与传入的 name 相同，或包含传入 name（如果是组合名等情况）
        return !artistName.toLowerCase().includes(name.toLowerCase());
      });

      const similarArtistsId = await Promise.all(
        filteredArtists.slice(0, 4).map(async (artistsName) => {
          const responseSpotify = await SpotifyPublicClient.getInstance().get({
            url: 'search',
            query: {
              q: artistsName,       // 使用 Last.fm 中获取的歌曲名
              type: 'track',      // 搜索类型为 track
              limit: 1,           // 限制返回的结果数量为 1 条
              offset: 0,          // 不使用分页
            },
          });  

          return responseSpotify.tracks.items[0].artists[0].id;  // 获取第一条匹配的结果
        })
      );

      const similarArtistsResults = await Promise.all(
        similarArtistsId.map(async (artistId) => {
          const responseSpotify = await SpotifyPublicClient.getArtistInfo(artistId);  

          return responseSpotify;  // 获取第一条匹配的结果
        })
      );

      commit('GET_USER_FOLLOWINGS_SUCCESS', similarArtistsResults); // 请求成功，提交成功的 mutation
    } catch (error) {
      commit('GET_USER_FOLLOWINGS_FAIL', error); // 请求失败，提交失败的 mutation
    }
  },

  async getUserTracks({ commit }, { name, artistImageUrl }) {
    commit('GET_USER_TRACKS');
  
    try {
      const responseLastfm = await LastfmClient.getInstance().get({
        query: {
          method: 'artist.getTopTracks', 
          artist: name,
          limit: 10
        },
      });
      const artistTopTracks = responseLastfm.toptracks.track.map(track => track.name);
      const listeners = responseLastfm.toptracks.track.map(track => track.listeners);
      let maxListeners = Math.max(...listeners);
      const responseSpotify = await Promise.all(
        artistTopTracks.map(async (artistTopTracksName) => {
          const response = await SpotifyPublicClient.getInstance().get({
            url: 'search',
            query: {
              q: `${artistTopTracksName} ${name}`,       // 使用 Last.fm 中获取的歌曲名
              type: 'track',      // 搜索类型为 track
              limit: 1,           // 限制返回的结果数量为 1 条
              offset: 0,          // 不使用分页
            },
          });  
          // 查找 Last.fm 中该歌曲的 playcount 和 listeners
          const trackDetails = responseLastfm.toptracks.track.find(
            (track) => track.name === artistTopTracksName
          );

          return {
            ...response.tracks.items[0],  // 获取 Spotify 返回的第一条结果
            playcount: trackDetails.playcount,  // Last.fm 中的 playcount
            listeners: trackDetails.listeners,  // Last.fm 中的 listeners
            max_listeners: maxListeners,
            album_image: response.tracks.items[0]?.album?.images?.[0]?.url || '',
            artist_image: artistImageUrl || ''
          };
        })
      );
      
      commit('GET_USER_TRACKS_SUCCESS', responseSpotify);
    } catch (error) {
      commit('GET_USER_TRACKS_FAIL', error);
    }
  }
};
