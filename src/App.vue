<template>
  <div id="app">
    <!-- 授权按钮 -->
    <el-row v-if="!spotifyPlayer">
      <el-col :xs="24">
        <el-button @click="authorize" type="primary">Authorize Spotify</el-button>
      </el-col>
    </el-row>
    
    <!-- 已授权后显示应用内容 -->
    <div v-if="spotifyPlayer">
      <navbar />
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <player />
      </el-footer>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import SpotifyUserClient from '@/utils/SpotifyUserClient';
import { onMounted, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import Player from './components/Player.vue';

export default {
  components: {
    Navbar,
    Player
  },
  setup() {
    const store = useStore();

    // 从 Vuex 获取 accessToken
    const spotifyPlayer = computed(() => store.getters.spotifyPlayer);
    const code = ref(new URLSearchParams(window.location.search).get('code')); // 获取 URL 中的授权码
    const accessToken = computed(() => store.getters.accessToken);

    const authorize = () => {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SpotifyUserClient.clientId}&response_type=code&redirect_uri=${encodeURIComponent(SpotifyUserClient.redirectUri)}&scope=${encodeURIComponent(SpotifyUserClient.scope)}`;
      console.log('Spotify Authorization URL:', authUrl);
      window.location.href = authUrl;  // 重定向到 Spotify 授权页面
    };

    const getAccessToken = async (code) => {
      try {
        const tokenData = await SpotifyUserClient.fetchToken({ code });
        store.dispatch('setAccessToken', tokenData.access_token);
        SpotifyUserClient.getInstance().accessToken = accessToken.value; 
        console.log('Access Token:', SpotifyUserClient.getInstance().accessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    // 初始化 Spotify Web Playback SDK
    const initializeSpotifyPlayer = () => {
      const player = ref(null);
      const errorMessage = ref("");

      // 动态加载 Spotify Player SDK
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        if (accessToken.value && window.Spotify) {
          player.value = new Spotify.Player({
            name: 'vue-app',
            getOAuthToken: (cb) => { cb(accessToken.value); },
            volume: 1.0,
          });

          // 错误处理
          player.value.on('initialization_error', ({ message }) => {
            errorMessage.value = message;
          });
          player.value.on('authentication_error', ({ message }) => {
            errorMessage.value = message;
          });
          player.value.on('account_error', ({ message }) => {
            errorMessage.value = message;
          });
          player.value.on('playback_error', ({ message }) => {
            errorMessage.value = message;
          });

          // 播放器准备好时的回调
          player.value.on('ready', ({ device_id }) => {
            console.log('Spotify 播放器准备就绪，设备 ID:', device_id);
            // 将 player 存入 Vuex 以供全局使用
            store.dispatch('setSpotifyPlayer', player.value);
          });

          // 直接在播放器准备好后连接
          player.value.connect().then(success => {
            if (success) {
              console.log('Web Playback SDK 成功连接到 Spotify!');
            } else {
              console.error('无法连接到 Web Playback SDK');
            }
          });
        } else {
          errorMessage.value = 'Spotify Web SDK 加载失败，请检查网络连接。';
        }
      };
    };

    onMounted(() => {
      if (code && !accessToken.value) {
        getAccessToken(code.value);  // 获取 access_token
      }
    });
    
    // 监听 accessToken 的变化
    watch(
      () => accessToken.value,  // 监听 accessToken 的变化
      (newAccessToken, oldAccessToken) => {
        // 只有当 accessToken 从 null 或 undefined 变为有值时才初始化播放器
        if (newAccessToken && !oldAccessToken) {
          initializeSpotifyPlayer();  // 初始化播放器
        }
      }
    );

    return {
      authorize,
      accessToken,
      spotifyPlayer
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
