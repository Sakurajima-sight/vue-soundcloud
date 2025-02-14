import { createStore } from 'vuex'; // 引入 Vuex
import home from './modules/home'; // 导入 home 模块

const store = createStore({
  modules: {
    home, // 注册 home 模块
  },
});

export default store;
