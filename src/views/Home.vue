<template>
  <div>
    <el-row :gutter="50" v-show="getTracksLoading">
      <el-col :span="24">
        <h1>Loading...</h1>
      </el-col>
    </el-row>     
    <el-row>
      <el-col
        :xs="24"
        :sm="22"
        :md="20"
        :lg="18"
        :xl="16"
        class="itemsWrapper"
      >
        <el-row :gutter="15">
          <song-item v-for="track in tracks" :key="track.id" :trackData="track" />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import SongItem from '../components/SongItem.vue';
import { onMounted } from 'vue';

export default {
  components: {
    SongItem,
  },
  setup() {
    // 访问 Vuex store
    const store = useStore();

    // 定义计算属性，获取 loading 状态、曲目和失败状态
    const getTracksLoading = computed(() => store.getters.getTracksLoading);
    const tracks = computed(() => store.getters.tracks);
    const getTracksFail = computed(() => store.getters.getTracksFail);

    // 定义获取曲目的方法
    const getItems = (genre) => {
      store.dispatch('getTracks', {genre}); // 触发 action，获取数据
    };
    
    onMounted(() => {
      getItems('home');  // 页面加载时获取 'house' 类别的 'track' 类型的歌曲
    });

    // 返回计算属性和方法
    return {
      getItems,
      getTracksLoading,
      tracks,
      getTracksFail,
    };
  },
};

</script>

<style scoped>
  .itemsWrapper {
    margin: 0 auto;
    float: none;
  }
</style>
