import getters from './getters';
import actions from './actions';
import mutations from './mutations';

// 定义默认状态
const defaultState = {
  getTrackInfoLoading: false, // 是否正在获取曲目信息
  trackData: null, // 存储获取到的曲目数据
  getTrackInfoFail: null, // 存储获取曲目失败的信息

  getSimilarTrackLoading: false, // 是否正在获取曲目信息
  similarTrackData: null, // 存储获取到的曲目数据
  getSimilarTrackFail: null, // 存储获取曲目失败的信息
};

export default {
  state: defaultState, // 状态数据
  getters, // 计算属性
  actions, // 处理异步请求
  mutations, // 变更状态
};
