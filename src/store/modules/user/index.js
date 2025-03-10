import getters from './getters';    // 导入 getters，用来获取 state 数据
import actions from './actions';    // 导入 actions，用来处理异步操作
import mutations from './mutations'; // 导入 mutations，用来修改 state

// 默认 state 数据
const defaultState = {
  getUserProfileLoading: false,  // 用户资料加载状态
  userProfileData: null,         // 存储用户资料
  getUserProfileFail: null,         // 存储失败信息

  getUserFollowingsLoading: false,  // 关注列表加载状态
  userFollowingsData: null,         // 存储关注列表
  getUserFollowingsFail: null,         // 存储失败信息

  getUserTracksLoading: false,      // 歌曲列表加载状态，表示歌曲列表是否正在加载
  userTracksData: null,             // 存储用户的歌曲列表，初始为空
  getUserTracksFail: null,          // 存储歌曲列表请求失败信息，初始为空

};

export default {
  state: defaultState,   // 应用状态
  getters,               // 获取状态数据
  actions,               // 异步操作
  mutations,             // 修改状态数据
};
