<template>
  <div>  
    <el-row :style="`padding-bottom: ${currentTrack ? '70px' : '0'}`">
      <el-col
        :xs="24"
        :sm="22"
        :md="20"
        :lg="18"
        :xl="16"
        class="itemsWrapper"
      >
        <el-row :gutter="15" v-if="searchResults.length === 0">
          <track-item-grid
            v-for="track in (searchResults.length > 0 ? searchResults : tracks)"
            :key="track.id" 
            :trackData="track"
            :onClickTrack="handleClickTrack"
          />
        </el-row>
        <el-row :gutter="15" v-if="searchResults.length > 0">
          <track-item-grid
            v-for="(track, i) in searchResults"
            :key="i"
            :trackData="track"
            :onClickTrack="handleClickTrack"
          />
        </el-row>
      </el-col>

      <el-col :xl="24">
        <h1 v-if="getTracksLoading || searchTracksLoading">Loading...</h1>
      </el-col>
    </el-row>  
  </div>
</template>



<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref, onUnmounted, watch } from 'vue';
import TrackItemGrid from '../components/TrackItemGrid.vue';
import Player from '../components/Player.vue';
import _ from 'lodash';

export default {
  components: {
    TrackItemGrid,
    Player,
  },
  setup() {
    // 访问 Vuex store
    const store = useStore();    

    // 定义当前页数
    const page = ref(1);
    const currentTrack = ref(null);
    
    const getTracksLoading = computed(() => store.getters.getTracksLoading);
    const tracks = computed(() => store.getters.tracks);
    const activeGenre = computed(() => store.getters.activeGenre);
    const lastPage = computed(() => store.getters.lastPage);

    const searchTracksLoading = computed(() => store.getters.searchTracksLoading);
    const searchResults = computed(() => store.getters.searchResults);
    const lastSearchPage = computed(() => store.getters.lastSearchPage);
    const searchQuery = computed(() => store.getters.searchQuery);     
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);     

    onMounted(() => {
      setupScrollListener();  // 设置滚动监听
    });

    const getItems = (genre, pageNum) => {
      store.dispatch('getTracks', { genre, page: pageNum });
    };

    const handleClickTrack = (trackData) => {
      if (playerCurrentTrack.value && playerCurrentTrack.value.id === trackData.id) {
        store.dispatch('setPlayerCurrentTrack', null);
      } else {
        store.dispatch('setPlayerCurrentTrack', trackData);
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

        if (bottomOfWindow && searchQuery.value && !searchTracksLoading.value) {
          store.dispatch('search', {
            page: lastSearchPage.value + 1,
            query: searchQuery.value,
          });
        }
      }

      window.addEventListener('scroll', handleScroll);

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
    };

    watch(tracks, (nextTracks, prevTracks) => {
      if (nextTracks && nextTracks.length > 0 && !_.isEqual(nextTracks, prevTracks)) {
        store.dispatch('setPlayerTracks', nextTracks);   
      }
    });

    watch(searchResults, (nextSearchResults, prevSearchResults) => {
      if (nextSearchResults.length > 0 && !_.isEqual(nextSearchResults, prevSearchResults)) {
        store.dispatch('setPlayerTracks', nextSearchResults);
      } else if (prevSearchResults.length > 0 && nextSearchResults.length === 0) {
        store.dispatch('setPlayerTracks', tracks.value);
      }
    });

    onUnmounted(() => {
      store.dispatch('pause');
      store.dispatch('setPlayerTracks', []);
      store.dispatch('setPlayerCurrentTrack', null);
    });

    return {
      searchTracksLoading,
      searchResults,
      lastSearchPage,
      searchQuery,
      getTracksLoading,
      tracks,
      getItems,
      activeGenre,
      page,
      lastPage,
      handleClickTrack,
      currentTrack,
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
