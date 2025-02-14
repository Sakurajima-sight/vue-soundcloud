<template>
  <div>
    <h1>Home</h1> 
    <!-- 按钮点击后获取曲目 -->
    <button @click="getItems">Get Tracks</button>
     
    <!-- 如果获取曲目失败，显示错误信息 -->
    <p v-if="getTracksFail">Failed to get tracks</p>
    
    <!-- 如果正在加载，显示加载状态 -->
    <h1 v-if="getTracksLoading">Loading...</h1>

    <!-- 遍历曲目列表并显示每个曲目的标题 -->
    <h1 v-for="(track, i) in tracks" :key="i">{{ track.name }}</h1>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    // 访问 Vuex store
    const store = useStore();

    // 定义计算属性，获取 loading 状态、曲目和失败状态
    const getTracksLoading = computed(() => store.getters.getTracksLoading);
    const tracks = computed(() => store.getters.tracks);
    const getTracksFail = computed(() => store.getters.getTracksFail);

    // 定义获取曲目的方法
    const getItems = () => {
      store.dispatch('getTracks'); // 触发 action，获取数据
    };

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

<style>
/* 可以在这里添加自定义样式 */
</style>
