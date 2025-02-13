<template>
  <div id="app">
    <h1>Spotify Track Search</h1>

    <!-- 搜索表单 -->
    <div class="search-container">
      <el-input 
        v-model="searchQuery" 
        placeholder="Search for a track..."
        @keyup.enter="searchTracks"
        clearable
        class="search-input"
      />
      <el-button @click="searchTracks" type="primary" class="search-button">Search</el-button>
    </div>

    <!-- 搜索结果展示 -->
    <div v-if="tracks.length > 0">
      <h2>Results:</h2>
      <el-row :gutter="20">
        <el-col v-for="track in tracks" :key="track.id" :span="6">
          <el-card :body-style="{ padding: '20px' }" class="track-card">
            <a :href="track.external_urls.spotify" target="_blank" class="track-link">
              <img :src="track.album.images[0].url" alt="track image" width="100%" />
              <h3>{{ track.name }}</h3>
              <p>{{ track.artists[0].name }}</p>
            </a>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div v-else-if="errorMessage" class="error-message">
      <el-alert title="Error" :description="errorMessage" type="error" show-icon />
    </div>

  </div>
</template>

<script>
// 导入客户端类
import client from './utils/xhrWrapper'; // 引入你创建的 Client 类
import { ElInput, ElButton, ElRow, ElCol, ElCard, ElAlert } from 'element-plus'; // 导入 Element Plus 组件

export default {
  name: 'App',
  components: {
    ElInput,
    ElButton,
    ElRow,
    ElCol,
    ElCard,
    ElAlert,
  },
  data() {
    return {
      searchQuery: '', // 搜索关键字
      tracks: [], // 存储搜索结果
      errorMessage: '', // 错误信息
    };
  },
  methods: {
    // 搜索 Spotify 曲目
    async searchTracks() {
      if (!this.searchQuery) {
        this.errorMessage = 'Please enter a search query';
        return;
      }

      try {
        this.errorMessage = ''; // 清空错误消息
        const response = await client.get({
          url: 'search',
          query: {
            q: this.searchQuery, // 搜索关键词
            type: 'track', // 搜索类型为歌曲
            limit: 10, // 限制返回10个结果
          },
        });
        
        // 更新界面的搜索结果
        this.tracks = response.tracks.items;
      } catch (error) {
        // 如果请求失败，显示错误信息
        this.errorMessage = 'Failed to fetch tracks';
      }
    },
  },
};
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  margin-right: 10px;
}

.search-button {
  padding: 10px;
}

.track-card {
  text-align: center;
}

.track-link {
  text-decoration: none;
  color: inherit;
}

.track-link h3 {
  margin-top: 10px;
  font-size: 16px;
}

.track-link p {
  color: #777;
}

.error-message {
  margin-top: 20px;
}
</style>
