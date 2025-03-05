export default {
  // 获取 tracks 是否正在加载的状态
  getTracksLoading: (state) => state.getTracksLoading,

  // 获取当前的访问令牌
  accessToken: (state) => state.accessToken,

  spotifyPlayer: (state) => state.spotifyPlayer,

  // 获取 tracks 的数据
  tracks: (state) => state.tracks,

  // 获取 tracks 数据是否加载失败
  getTracksFail: (state) => state.getTracksFail,

  // 获取当前页面的页码，用于分页控制，返回的是当前加载的页面编号
  lastPage: (state) => state.lastPage,

  // 返回当前状态中存储的 activeTrack，用于显示当前正在播放的歌曲信息
  activeTrack: (state) => state.activeTrack,

  isPlay: (state) => state.isPlay,

};
