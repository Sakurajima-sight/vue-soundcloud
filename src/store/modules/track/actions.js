import LastfmClient from '@/utils/xhrWrapperLastfm';
import SpotifyUserClient from '@/utils/SpotifyUserClient';

export default {
  async getTrackInfo({ commit }, { trackName, artistName, artistImageUrl }) {
    commit('GET_TRACK_INFO'); // 触发加载状态

    try {
      const responseSpotify = await SpotifyUserClient.getInstance().get({
        url: 'search',
        query: {
          q: `${trackName} ${artistName}`,       // 使用 Last.fm 中获取的歌曲名
          type: 'track',      // 搜索类型为 track
          limit: 1,           // 限制返回的结果数量为 1 条
          offset: 0,          // 不使用分页
        },
      });  

      const getInfoLastfm = await LastfmClient.getInstance().get({
        query: {
          method: 'track.getInfo', 
          track: trackName,
          artist: artistName
        },
      });

      // 提取 Last.fm 数据
      const lastfmData = getInfoLastfm?.track || {};
      const listeners = lastfmData.listeners || 0;
      const playcount = lastfmData.playcount || 0;
      const tag = lastfmData?.toptags?.tag || [];
      const summary = lastfmData?.wiki?.summary ?? 'Do you know any background info about this track?';   

      // 合并数据
      const enrichedResponse = {
        ...responseSpotify.tracks.items[0], // 获取 Spotify 返回的第一条 track 数据
        playcount: playcount,
        listeners: listeners,        
        summary: summary,
        tag: tag,
        album_image: responseSpotify.tracks.items[0]?.album?.images?.[0]?.url || '',
        artist_image: artistImageUrl || ''
      };

      
      // 请求成功，提交数据
      commit('GET_TRACK_INFO_SUCCESS', enrichedResponse);
    } catch (error) {
      // 请求失败，提交错误信息
      commit('GET_TRACK_INFO_FAIL', error);
    }
  },
  async getSimilarTrackInfo({ commit }, { trackName, artistName }) {
    commit('GET_SIMILAR_TRACK_INFO'); // 触发加载状态

    try {
      const getSimilarLastfm = await LastfmClient.getInstance().get({
        query: {
          method: 'track.getSimilar', 
          track: trackName,
          artist: artistName,
          limit: 5
        },
      });
      const similarTracks = getSimilarLastfm.similartracks.track.map(track => track.name);
      const similarTracksArtists = getSimilarLastfm.similartracks.track.map(track => track.artist.name);
      const trackListenersArray = await Promise.all(
        similarTracks.map(async (similarTracksName, index) => {
          const similarTrackArtist = similarTracksArtists[index]; 
          const response = await LastfmClient.getInstance().get({
            query: {
              method: 'track.getInfo', 
              track: similarTracksName,
              artist: similarTrackArtist
            },
          });
          return response.track.listeners;
        })
      );

      let maxListeners =  Math.max(...trackListenersArray);
      const responseSpotify = await Promise.all(
        similarTracks.map(async (similarTracksName, index) => {
          const similarTrackArtist = similarTracksArtists[index]; 
          const response = await SpotifyUserClient.getInstance().get({
            url: 'search',
            query: {
              q: `${similarTracksName} ${similarTrackArtist}`,       // 使用 Last.fm 中获取的歌曲名
              type: 'track',      // 搜索类型为 track
              limit: 1,           // 限制返回的结果数量为 1 条
              offset: 0,          // 不使用分页
            },
          });  
          // 查找 Last.fm 中该歌曲的 playcount 和 listeners
          const trackDetails = getSimilarLastfm.similartracks.track.find(
            (track) => track.name === similarTracksName
          );

          const artistResponse = await SpotifyUserClient.getArtistInfo(response.tracks.items[0].artists[0].id);  

          return {
            ...response.tracks.items[0],  // 获取 Spotify 返回的第一条结果
            playcount: trackDetails.playcount,  // Last.fm 中的 playcount
            album_image: response.tracks.items[0]?.album?.images?.[0]?.url || '',
            artist_image: artistResponse.images[0].url || '',
            listeners: trackListenersArray[index], 
            max_listeners: maxListeners,
          };
        })
      );

      // 请求成功，提交数据
      commit('GET_SIMILAR_TRACK_INFO_SUCCESS', responseSpotify);
    } catch (error) {
      // 请求失败，提交错误信息
      commit('GET_SIMILAR_TRACK_INFO_FAIL', error);
    }
  }
  
};
