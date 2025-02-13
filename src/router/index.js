import { createRouter, createWebHistory } from 'vue-router'; // 引入 Vue Router 中的函数
import Home from '@/views/Home.vue'; // 引入 Home 组件

// 定义路由配置
const routes = [
  {
    path: '/', // 路由的路径，当访问根路径时匹配此路由
    name: 'Home', // 路由的名称，用于路由的导航和跳转
    component: Home, // 该路由对应的组件是 Home
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用浏览器历史模式，路径不会带 `#`（哈希值）
  routes, // 路由配置
});

// 导出路由实例，以便在主应用中使用
export default router;
