export default {
  // GET_TRACKS：触发此 mutation 时，表示正在获取 tracks 数据，设置加载状态为 true
  GET_TRACKS: (state) => {
    state.getTracksLoading = true;  // 设置加载状态为 true
  },

  // GET_TRACKS_SUCCESS：请求成功时触发此 mutation，保存获取到的数据并设置加载状态为 false
  GET_TRACKS_SUCCESS: (state, data) => {
    state.getTracksLoading = false;  // 设置加载状态为 false
    state.tracks = [...state.tracks, ...data.tracks];  // 将新获取的曲目数据追加到已有的 tracks 数组中
    state.activeGenre = data.genre;  // 保存请求成功时返回的音乐类型（genre）
    state.lastPage = data.page;  // 保存当前页数，用于后续分页请求
  },

  // GET_TRACKS_FAIL：请求失败时触发此 mutation，记录失败的状态并设置加载状态为 false
  GET_TRACKS_FAIL: (state, error) => {
    state.getTracksLoading = false;  // 设置加载状态为 false
    state.getTracksFail = error;  // 保存错误信息或状态
  },

  // CLEAR_TRACKS：清除 tracks 数据和加载状态
  CLEAR_TRACKS: (state) => {
    state.getTracksLoading = false;  // 重置加载状态
    state.tracks = [];  // 清空曲目数据
  },
};
