export default {
  // 开始获取曲目数据
  GET_TRACK_INFO: (state) => {
    state.getTrackInfoLoading = true; // 设置加载状态为 true
  },
  
  // 获取曲目数据成功
  GET_TRACK_INFO_SUCCESS: (state, data) => {
    state.getTrackInfoLoading = false; // 关闭加载状态
    state.trackData = data; // 保存获取到的曲目数据
  },
  
  // 获取曲目数据失败
  GET_TRACK_INFO_FAIL: (state, data) => {
    state.getTrackInfoLoading = false; // 关闭加载状态
    state.getTrackInfoFail = data; // 记录失败信息
  },

  GET_SIMILAR_TRACK_INFO: (state) => {
    state.getSimilarTrackLoading = true;
  },
  
  GET_SIMILAR_TRACK_INFO_SUCCESS: (state, data) => {
    state.getSimilarTrackLoading = false;
    state.similarTrackData = data;
  },
  
  GET_SIMILAR_TRACK_INFO_FAIL: (state, data) => {
    state.getSimilarTrackLoading = false;
    state.getSimilarTrackFail = data;
  }
};
