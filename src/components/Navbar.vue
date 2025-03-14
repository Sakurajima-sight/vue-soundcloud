<template>
  <!-- 布局容器，居中显示 -->
  <el-row type="flex" class="navbarWrapper" justify="center">
    <el-col
      :xs="24" :sm="22" :md="20" :lg="18" :xl="16"
      class="wrapper"
    >
      <!-- 水平菜单 -->
      <el-menu
        background-color="#3a3f41"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="navbar"
        :collapse="false"
      >
        <!-- 菜单项，显示 logo -->
        <router-link to="/">
          <img src="../assets/logo.png" class="logo" />
        </router-link>
        <!-- 搜索框 -->
        <div class="searchContainer">
          <form @submit.prevent="handleSearch">
            <el-input
              size="default"
              placeholder="search music..."
              :prefix-icon="searchQuery && searchTracksLoading ? loadIcon : searchIcon"
              class="searchInput"
              tabindex="-1"
              v-model="query"
              ref="searchRef"
              clearable
            />
          </form>
          <el-button @click="authorize" type="primary" class="signUp" v-if="!spotifyPlayer"> SIGN UP </el-button>
          <img v-if="spotifyPlayer" :src="userInfo.images[0].url" alt="User Image" class="userImage" />
        </div>
      </el-menu>
    </el-col>
    <div class="genresMenu" v-if="route.path === '/'">
      <el-col
        :xs="24"
        :sm="22"
        :md="20"
        :lg="18"
        :xl="16"
        class="genresWrapper"
        v-if="!searchQuery"
      >
        <el-button-group size="small">
          <el-button
            v-for="(genre, i) in genres"
            :key="i"
            @click="getGenreItems(genre)"
            v-bind:class="{active: activeGenre === genre, preActive: getTracksLoading === genre}"
          >
            {{genre}}
          </el-button>
        </el-button-group>
      </el-col>
      <el-col
        :xs="24"
        :sm="22"
        :md="20"
        :lg="18"
        :xl="16"
        class="searchQueryWrapper"
        v-if="searchQuery"
      >
        <h3>{{ searchTracksLoading ? 'Loading...' : `Results of searched '${searchQuery}'`}}</h3>
         <el-button
           @click="handleClearSearch"
           class="clearSearchButton"
           icon="el-icon-close"
           v-if="!searchTracksLoading"
           circle
         />
      </el-col>
    </div>
  </el-row>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';  // 引入 Vue 3 的响应式工具
import { useStore } from 'vuex';  // 引入 Vuex 的 useStore
import { Search, Loading } from '@element-plus/icons-vue';  // 引入搜索图标
import { useRoute, useRouter } from 'vue-router';
import SpotifyUserClient from '@/utils/SpotifyUserClient';

export default {
  props: {
    showGenres: {
      type: Boolean,
      required: true,  // 表示这个 prop 是必需的
    },
  },
  setup() {
    const store = useStore();  // 获取 Vuex store
    const route = useRoute();
    const router = useRouter();

    // 响应式数据
    const query = ref('');  // 搜索文本
    const genres = ref([         // 可供选择的音乐类型
      'house', 'chill', 'deep', 'dubstep', 'classical', 'electronic',
      'trance', 'pop', 'rock',
    ]);
    const searchIcon = Search;   // 设置搜索图标
    const loadIcon = Loading;
    const userInfo = ref(null);

    // 从 Vuex 获取计算属性
    const activeGenre = computed(() => store.getters.activeGenre);  // 当前活动的 genre
    const getTracksLoading = computed(() => store.getters.getTracksLoading);  // 获取加载状态
    const searchQuery = computed(() => store.getters.searchQuery);
    const searchTracksLoading = computed(() => store.getters.searchTracksLoading);

    // 从 Vuex 获取 accessToken
    const spotifyPlayer = computed(() => store.getters.spotifyPlayer);
    const code = ref(new URLSearchParams(window.location.search).get('code')); // 获取 URL 中的授权码
    const accessToken = computed(() => store.getters.accessToken);
  
    const currentUrl = computed(() => store.getters.currentUrl);

    // 获取指定类别的曲目
    const getGenreItems = (genre) => {
      store.dispatch('clearTracks');  // 清除之前的曲目数据
      store.dispatch('getTracks', { genre, page: 1 });  // 获取新的曲目数据，从第 1 页开始
    };

    const handleSearch = async() => {
      if (query && (!searchQuery || searchQuery !== query)) {  
        store.dispatch('search', {
          page: 1,
          query: query.value,
        });
      }
    };

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
        userInfo.value = await SpotifyUserClient.getUserInfo();
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
          player.value.on('ready', async({ device_id }) => {
            console.log('Spotify 播放器准备就绪，设备 ID:', device_id);
            // 调用 PUT 请求
            await SpotifyUserClient.getInstance().put({
              url: 'me/player',  // API 端点
              data: { device_ids: [device_id] },  // 请求数据
            });
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

    const handleClearSearch = () => { 
      store.dispatch('clearSearch');
    }

    // 监听 accessToken 的变化
    watch(
      () => accessToken.value,  // 监听 accessToken 的变化
      (newAccessToken, oldAccessToken) => {
        // 只有当 accessToken 从 null 或 undefined 变为有值时才初始化播放器
        if (newAccessToken && !oldAccessToken) {
          initializeSpotifyPlayer();  // 初始化播放器
          const parsedUrl = new URL(currentUrl.value);
          const routerPath = parsedUrl.pathname; // 获取路径部分
          router.push(routerPath)
        }
      }
    );

    // 观察 `query` 变化，如果 `query` 清空，则清除搜索
    watch([query, searchQuery], ([newQuery, newSearchQuery]) => {
      if (!newQuery && newSearchQuery) {
        handleClearSearch();
      }
    });

    const searchRef = ref(null);
    // 在页面挂载时执行一次获取 'house' 类型的曲目
    onMounted(() => {
      if (code && !accessToken.value) {
        getAccessToken(code.value);  // 获取 access_token
      }
      getGenreItems('house');
    });

    // 返回要在模板中使用的数据
    return {
      query,
      searchIcon,
      loadIcon,
      genres,
      activeGenre,
      getTracksLoading,
      searchTracksLoading,
      searchQuery,
      handleClearSearch,
      getGenreItems,
      searchRef,
      handleSearch,
      route,
      authorize,
      spotifyPlayer,
      userInfo
    };
  },
};
</script>


<style scoped>
  .wrapper {
    margin: 0 auto;
    float: none;
  }
  .el-row {
    background: #3a3f41;  /* 设置背景颜色 */
    padding: 0;
  }
  .el-menu {
    border: none;  /* 去除边框 */
    display: flex;  /* 使用 Flexbox 布局 */
    align-items: center;  /* 垂直居中 */
    justify-content: space-between;  /* 均匀分布 */
  }
  .el-menu.navbar {
    border-bottom: #3a3f41;  /* 设置底部边框颜色 */
  }
  .logo {
    width: 170px;
    margin-right: 20px;  /* logo 和搜索框的间距 */
  }
  .searchContainer {
    padding-right: 20px;
    display: flex;
    
  }
  .searchInput {
    width: 280px;
    margin: 13px 0;
  }
  .searchInput .el-input__inner {
    background: #2b2b2b;  /* 背景色 */
    border: none;  /* 去除边框 */
    outline: none;  /* 去除外边框 */
    color: #fff;  /* 文字颜色 */
  }

  .signUp {
    margin-top: 13px;
    margin-left: 10px;
    width: 70px;   /* 设置按钮的宽度 */
    height: 32px;  /* 设置按钮的高度 */
    border: none;  /* 去掉默认的边框 */
    background-color: #f1f1f1; /* 按钮的背景色，可以根据需求更改 */
    color: #2b2b2b;
    font-weight: bold;
  }
  
  .userImage {
    width: 40px;  /* 设置宽度 */
    height: 40px; /* 设置高度，确保宽高相等 */
    border-radius: 50%;  /* 设置为圆形 */
    object-fit: cover;  /* 确保图片内容不变形，裁剪并填充 */
    border: 2px solid #fff;  /* 可选：给图片添加一个白色边框 */
    margin-top: 8px;
    margin-left: 10px;
  }

  .genresMenu {
    width: 100%;
    background: #fff;
  }
  .genresWrapper {
    margin: 0 auto;
    float: none;
    background: #fff;
    display: block;
  }
  .genresWrapper .el-button {
    padding: 15px 35px;
    border: none;
    border-radius: 0;
    background: #fff;
    color: #999;
    border-bottom: 3px solid #fff;
  }
  .genresWrapper .el-button.active {
    background: #f1f1f1;
    color: #444;
    border-bottom: 3px solid #43b883;
  }
  .genresWrapper .el-button.preActive {
    background: #f1f1f1;
    color: #444;
    border-bottom: 3px solid #f1f1f1;
  }
  .genresWrapper .el-button:hover {
    background: #f1f1f1;
    color: #444;
    border-bottom: 3px solid #f1f1f1;
  }
  .el-button > span {
    font-size: 16px;
  }
  .searchQueryWrapper {
    margin: 0 auto;
    float: none;
    background: #fff;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .searchQueryWrapper h3 {
    margin: 0;
  }
  .searchQueryWrapper .clearSearchButton {
    margin-left: 20px;
  }
  .searchQueryWrapper .clearSearchButton:hover {
    border-color: #43b883;
    color: #fff;
    background: #43b883;
  }
  @media (max-width: 768px) {
    .el-button-group {
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      width: 100%;
    }
    .genresWrapper .el-button {
      float: none;
    }
    .logo {
      float: none;
    }
    .searchInput {
      width: calc(100% - 20px);
      margin: 0 10px 20px;
      box-sizing: border-box;
    }
  }
</style>
