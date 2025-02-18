<template>
  <div id="app">
    <!-- 授权按钮 -->
    <el-row v-if="!accessToken">
      <el-col :xs="24">
        <el-button @click="authorize" type="primary">Authorize Spotify</el-button>
      </el-col>
    </el-row>
    
    <!-- 已授权后显示应用内容 -->
    <div v-if="accessToken">
      <navbar />
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
      </el-footer>
    </div>
  </div>
</template>

<script>
// 在 Vue 3 中使用 'import' 来引入组件
import Navbar from './components/Navbar.vue';
import SpotifyUserClient from '@/utils/SpotifyUserClient';
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';


export default {
  // 在 Vue 3 中，直接在组件中定义哪些子组件需要被注册
  components: {
    // 注册 Navbar 组件
    Navbar,
    // 注册 Player 组件

  },
  setup(){
    // 访问 Vuex store
    const store = useStore();

    // 从 Vuex 获取 accessToken
    const accessToken = computed(() => store.getters.accessToken);
    
    // 创建一个响应式的 accessToken，初始为空
    const code = ref(new URLSearchParams(window.location.search).get('code')); // 获取 URL 中的授权码

    const authorize = () => {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SpotifyUserClient.clientId}&response_type=code&redirect_uri=${encodeURIComponent(SpotifyUserClient.redirectUri)}&scope=${encodeURIComponent(SpotifyUserClient.scope)}`;
      console.log('Spotify Authorization URL:', authUrl);  // 在控制台打印 authUrl
      window.location.href = authUrl; // 重定向到 Spotify 授权页面
    };

    const getAccessToken = async (code) => {
      try {
        const tokenData = await SpotifyUserClient.fetchToken({ code });  // 直接通过类来调用静态方法
        store.dispatch('setAccessToken', tokenData.access_token);
        SpotifyUserClient.getInstance().accessToken = accessToken.value; 
        console.log('Access Token:', SpotifyUserClient.getInstance().accessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    onMounted(() => {
      if (code && !accessToken.value) {
        getAccessToken(code.value);  // 获取 access_token
      }
    });

    return{
      authorize,
      accessToken
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
