<template>
  <div id="app">
    <!-- 已授权后显示应用内容 -->
    <div>
      <navbar :showGenres="$route.path === '/'" />
      <el-main :style="`padding: ${!!playerCurrentTrack ? '20px 20px 90px' : '20px'}`">
        <router-view />
        <Player />
      </el-main>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Player from './components/Player.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  components: {
    Navbar,
    Player
  },
  setup() {
    const store = useStore();
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);

    return {
      playerCurrentTrack
    };
  }
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
  button {
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
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
  .el-slider__runway {
    height: 10px;
    border-radius: 0;
  }
  .el-slider__button {
    width: 12px;
    height: 10px;
    background-color: #43b883;
    border-radius: 0;
    border: none;
    margin-top: 4px;
  }
  .el-slider__bar {
    height: 10px;
    background-color: #afd6c8;
    border-radius: 0;
    transition: all linear .2s;
  }
  .el-slider__button-wrapper {
    transition: all linear .2s;
  }
</style>
