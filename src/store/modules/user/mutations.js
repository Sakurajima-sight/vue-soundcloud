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
    state.userProfileFail = data; // 存储错误信息
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
    state.userFollowingsFail = data; // 存储错误信息
  },
};
