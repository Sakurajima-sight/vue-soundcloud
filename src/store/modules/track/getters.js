export default {
  getTrackInfoLoading: state => state.getTrackLoading, // 获取曲目信息加载状态
  trackData: state => state.trackData, // 获取曲目信息
  getTrackInfoFail: state => state.getTrackFail, // 获取曲目失败信息

  getSimilarTrackLoading: state => state.getSimilarTrackLoading, // 获取曲目信息加载状态
  similarTrackData: state => state.similarTrackData, // 获取曲目信息
  getSimilarTrackFail: state => state.getSimilarTrackFail, // 获取曲目失败信息
};
