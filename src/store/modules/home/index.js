// 引入 getters、actions 和 mutations，模块化管理
import getters from './getters'; // 用于获取 state 中的状态
import actions from './actions'; // 用于执行异步操作或复杂的逻辑
import mutations from './mutations'; // 用于直接修改 state 的值

// 定义初始的 state 状态
const defaultState = {
  getTracksLoading: null, // 标识是否正在加载数据
  accessToken: null, // 初始值为 null，表示尚未获取 token
  spotifyPlayer: null,
  tracks: [], // 存储获取到的曲目数据，类型为数组，用于展示或处理
  getTracksFail: false, // 标识数据获取是否失败
  activeGenre: null, // 存储当前选择的音乐类型
  lastPage: null, // 存储当前页数，用于分页控制，确保每次加载正确的下一页数据
  activeTrack: null, // 存储当前播放的曲目信息，用于控制播放器的状态
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
