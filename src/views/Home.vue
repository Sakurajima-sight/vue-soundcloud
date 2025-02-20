<template>
  <div>  
    <el-col
      :xs="24"
      :sm="22"
      :md="20"
      :lg="18"
      :xl="16"
      class="itemsWrapper"
    >
      <el-row :gutter="15">
        <song-item 
          v-for="track in tracks" 
          :key="track.id" 
          :trackData="track"
          :onClickTrack="handleClickTrack"
        />
      </el-row>
    </el-col>

    <el-col :xl="24">
      <h1 v-show="getTracksLoading">Loading...</h1>
    </el-col>
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
    
    const getTracksLoading = computed(() => store.getters.getTracksLoading);
    const tracks = computed(() => store.getters.tracks);
    const activeGenre = computed(() => store.getters.activeGenre);
    const lastPage = computed(() => store.getters.lastPage);
    const activeTrack = computed(() => store.getters.activeTrack);

    onMounted(() => {
      setupScrollListener();  // 设置滚动监听
    });

    const getItems = (genre, pageNum) => {
      store.dispatch('getTracks', { genre, page: pageNum });
    };

    const handleClickTrack = (trackData) => {
      if (activeTrack.value && trackData.id === activeTrack.value.id) {
        store.dispatch('setActiveTrack', null);
      } else {
        store.dispatch('setActiveTrack', trackData);
        console.log("activeTrack: ", activeTrack.value.uri);
      }
    };

    const setupScrollListener = () => {
      const handleScroll = () => {
        const bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.scrollHeight - 50;

        if (bottomOfWindow && !getTracksLoading.value) {
          const nextPage = lastPage.value ? lastPage.value + 1 : page.value + 1;
          getItems(activeGenre.value || 'house', nextPage);
        }
      };

      window.addEventListener('scroll', handleScroll);

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
    };

    return {
      getTracksLoading,
      tracks,
      getItems,
      activeGenre,
      page,
      lastPage,
      handleClickTrack,
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
