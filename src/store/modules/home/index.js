// 引入 getters、actions 和 mutations，模块化管理
import getters from './getters'; // 用于获取 state 中的状态
import actions from './actions'; // 用于执行异步操作或复杂的逻辑
import mutations from './mutations'; // 用于直接修改 state 的值

// 定义初始的 state 状态
const defaultState = {
  getTracksLoading: false, // 标识是否正在加载数据
  tracks: null, // 存储获取到的 tracks 数据
  getTracksFail: false, // 标识数据获取是否失败
};

// Vuex 模块配置
export default {
  // 定义 state
  state: defaultState,
  // 定义 getters
  getters,
  // 定义 actions
  actions,
  // 定义 mutations
  mutations,
};
