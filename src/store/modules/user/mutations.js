export default {
  // 用户资料请求开始
  GET_USER_PROFILE: (state) => {
    state.getUserProfileLoading = true; // 设置为加载中
  },

  // 用户资料请求成功
  GET_USER_PROFILE_SUCCESS: (state, data) => {
    state.getUserProfileLoading = false; // 设置为加载完成
    state.userProfileData = data; // 存储用户资料
  },

  // 用户资料请求失败
  GET_USER_PROFILE_FAIL: (state, data) => {
    state.getUserProfileLoading = false; // 设置为加载完成
    state.getUserProfileFail = data; // 存储错误信息
  },

  // 用户关注列表请求开始
  GET_USER_FOLLOWINGS: (state) => {
    state.getUserFollowingsLoading = true; // 设置为加载中
  },

  // 用户关注列表请求成功
  GET_USER_FOLLOWINGS_SUCCESS: (state, data) => {
    state.getUserFollowingsLoading = false; // 设置为加载完成
    state.userFollowingsData = data; // 存储关注列表
  },

  // 用户关注列表请求失败
  GET_USER_FOLLOWINGS_FAIL: (state, data) => {
    state.getUserFollowingsLoading = false; // 设置为加载完成
    state.getUserFollowingsFail = data; // 存储错误信息
  },

  // 用户歌曲列表请求开始
  GET_USER_TRACKS: (state) => {
    state.getUserTracksLoading = true; // 设置为加载中，表示正在请求用户的歌曲列表
  },

  // 用户歌曲列表请求成功
  GET_USER_TRACKS_SUCCESS: (state, data) => {
    state.getUserTracksLoading = false; // 设置为加载完成，表示请求已成功完成
    state.userTracksData = data.response; // 存储用户的歌曲列表，返回的数据为用户喜爱的歌曲或上传的歌曲
    state.maxListeners = data.maxListeners; // 存储用户的歌曲列表，返回的数据为用户喜爱的歌曲或上传的歌曲
  },

  // 用户歌曲列表请求失败
  GET_USER_TRACKS_FAIL: (state, data) => {
    state.getUserTracksLoading = false; // 设置为加载完成，表示请求已失败
    state.getUserTracksFail = data; // 存储错误信息，用于展示失败提示
  },
};
