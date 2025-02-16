<template>
  <div>  
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
      <el-col :xl="24">
        <h1 v-show="getTracksLoading">Loading...</h1>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import SongItem from '../components/SongItem.vue';

export default {
  components: {
    SongItem,
  },
  setup() {
    // 访问 Vuex store
    const store = useStore();

    // 定义当前页数
    const page = ref(1);

    // 定义计算属性，获取 loading 状态、曲目和失败状态
    const getTracksLoading = computed(() => store.getters.getTracksLoading);
    const tracks = computed(() => store.getters.tracks);
    const activeGenre = computed(() => store.getters.activeGenre);
    const lastPage = computed(() => store.getters.lastPage);

    // 定义获取曲目数据的函数
    const getItems = (genre, pageNum) => {
      store.dispatch('getTracks', { genre, page: pageNum });
    };
    
    onMounted(() => {
      getItems('house', page.value); // 初始加载 'house' 类别的曲目
      setupScrollListener(); // 设置滚动监听
    });

    // 设置滚动事件监听，判断是否滚动到页面底部并加载下一页数据
    const setupScrollListener = () => {
      const handleScroll = () => {
        // 判断是否滚动到底部，加入缓冲
        const bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.scrollHeight - 50;

        if (bottomOfWindow && !getTracksLoading.value) {
          const nextPage = lastPage.value ? lastPage.value + 1 : page.value + 1;
          // 当滚动到底部且当前没有加载数据时，触发下一页数据加载
          getItems(activeGenre.value || 'house', nextPage);
        }
      };

      window.addEventListener('scroll', handleScroll);

      // 清理事件监听
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
    };

    // 返回所有需要在模板中使用的数据和方法
    return { 
      getTracksLoading, 
      tracks, 
      getItems, 
      activeGenre, 
      page, 
      lastPage 
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
