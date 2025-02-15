<template>
  <!-- 根组件，包含 Navbar 和动态路由 -->
  <div id="app">
    <!-- 导入 Navbar 组件并渲染 -->
    <Navbar />
    <!-- 动态路由视图，会根据路由的变化来显示不同的组件 -->
    <router-view />
  </div>
</template>

<script>
// 在 Vue 3 中使用 'import' 来引入组件
import Navbar from './components/Navbar.vue';

export default {
  // 在 Vue 3 中，直接在组件中定义哪些子组件需要被注册
  components: {
    // 注册 Navbar 组件
    Navbar,
  },
};
</script>

<style>
  /* 全局样式 */
  body {
    margin: 0; /* 去除页面边距 */
    background: #f1f1f1;
  }
  a {
    text-decoration: none;
    color: #000;
  }
  /* app 根元素的样式 */
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center; /* 文本居中对齐 */
    color: #2c3e50; /* 设置文字颜色 */
    margin: 0; /* 去除页面默认的 margin */
    padding: 0; /* 去除页面默认的 padding */
  }
  .el-header {
    padding: 0;
    height: auto !important; /* 使得 div 高度自动根据内容变化，并强制应用 */
  }
</style>
