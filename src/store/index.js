import { createStore } from 'vuex'; // 引入 Vuex
import home from './modules/home'; // 导入 home 模块
import navbar from './modules/navbar'; // 导入 navbar 模块
import user from './modules/user'; // 导入 user 模块
import track from './modules/track';
import player from './modules/player';

const store = createStore({
  mode: 'history', // 使用 HTML5 History 模式，去掉 URL 中的 #
  modules: {
    home, // 注册 home 模块
    navbar, // 注册 navbar 模块
    user, // 注册 user 模块
    track,
    player
  },
});

export default store;
