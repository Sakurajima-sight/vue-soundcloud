export default {
  // 用户资料加载状态
  getUserProfileLoading: state => state.getUserProfileLoading,
  // 用户资料数据
  userProfileData: state => state.userProfileData,
  // 用户资料错误信息
  getUserProfileFail: state => state.getUserProfileFail,

  // 用户关注列表加载状态
  getUserFollowingsLoading: state => state.getUserFollowingsLoading,
  // 用户关注列表数据
  userFollowingsData: state => state.userFollowingsData,
  // 用户关注列表错误信息
  getUserFollowingsFail: state => state.getUserFollowingsFail,

  // 用户歌曲列表加载状态
  getUserTracksLoading: state => state.getUserTracksLoading,
  // 用户歌曲列表数据
  userTracksData: state => state.userTracksData,
  // 用户歌曲列表错误信息
  getUserTracksFail: state => state.getUserTracksFail,
};
