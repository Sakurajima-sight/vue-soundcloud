export default {
  // 获取 tracks 是否正在加载的状态
  getTracksLoading: (state) => state.getTracksLoading,

  // 获取 tracks 的数据
  tracks: (state) => state.tracks,

  // 获取 tracks 数据是否加载失败
  getTracksFail: (state) => state.getTracksFail,
};
