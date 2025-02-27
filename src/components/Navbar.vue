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
        </div>
      </el-menu>
    </el-col>
    <div class="genresMenu" v-if="showGenres">
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

export default {
  props: {
    showGenres: {
      type: Boolean,
      required: true,  // 表示这个 prop 是必需的
    },
  },
  setup() {
    const store = useStore();  // 获取 Vuex store

    // 响应式数据
    const query = ref('');  // 搜索文本
    const genres = ref([         // 可供选择的音乐类型
      'house', 'chill', 'deep', 'dubstep', 'classical', 'electronic',
      'trance', 'pop', 'rock',
    ]);
    const searchIcon = Search;   // 设置搜索图标
    const loadIcon = Loading;

    // 从 Vuex 获取计算属性
    const activeGenre = computed(() => store.getters.activeGenre);  // 当前活动的 genre
    const getTracksLoading = computed(() => store.getters.getTracksLoading);  // 获取加载状态
    const searchQuery = computed(() => store.getters.searchQuery);
    const searchTracksLoading = computed(() => store.getters.searchTracksLoading);

    // 获取指定类别的曲目
    const getGenreItems = (genre) => {
      store.dispatch('clearTracks');  // 清除之前的曲目数据
      store.dispatch('getTracks', { genre, page: 1 });  // 获取新的曲目数据，从第 1 页开始
      store.dispatch('setActiveTrack', null);  // 调用 Vuex 中的 'setActiveTrack' action，设置活动曲目为 null
    };

    const handleSearch = async() => {
      if (query && (!searchQuery || searchQuery !== query)) {  
        store.dispatch('search', {
          page: 1,
          query: query.value,
        });
      }
    };

    const handleClearSearch = () => { 
      store.dispatch('setActiveTrack', null); 
      store.dispatch('clearSearch');
    }

    // 观察 `query` 变化，如果 `query` 清空，则清除搜索
    watch([query, searchQuery], ([newQuery, newSearchQuery]) => {
      if (!newQuery && newSearchQuery) {
        handleClearSearch();
      }
    });

    const searchRef = ref(null);
    // 在页面挂载时执行一次获取 'house' 类型的曲目
    onMounted(() => {
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
      handleSearch
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
