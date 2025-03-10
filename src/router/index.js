import { createRouter, createWebHistory } from 'vue-router'; // 引入 Vue Router 中的函数
import Home from '@/views/Home.vue'; // 引入 Home 组件
import User from '@/views/User.vue';
import Track from '@/views/Track.vue';

// 定义路由配置
const routes = [
  {
    path: '/', // 路由的路径，当访问根路径时匹配此路由
    name: 'Home', // 路由的名称，用于路由的导航和跳转
    component: Home, // 该路由对应的组件是 Home
  },
  { 
    path: '/users/:id', // 访问 `/users/:id` 会触发 User 组件的加载
    component: User,  // 该路由对应的组件是 User
  },
  { 
    path: '/tracks/:id', // 访问 `/tracks/:id` 会触发 User 组件的加载
    component: Track,  // 该路由对应的组件是 Track
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用浏览器历史模式，路径不会带 `#`（哈希值）
  routes, // 路由配置
});

// 导出路由实例，以便在主应用中使用
export default router;
