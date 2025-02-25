import getters from './getters';  // 获取 state 中的状态
import actions from './actions';  // 处理异步操作，如 API 请求
import mutations from './mutations';  // 修改 state 的数据

// 默认的 state 状态
const defaultState = {
  searchTracksLoading: false,  // 是否正在加载
  searchResults: [],  // 搜索结果
  searchTracksFail: null,  // 错误信息
  lastSearchPage: null,  // 上一次搜索的页码
  searchQuery: null,  // 上一次搜索的关键词
};

export default {
  state: defaultState,  // 初始状态
  getters,  // 获取 state 中的状态
  actions,  // 处理异步操作
  mutations,  // 修改 state 的数据
};
