<template>
  <div v-if="trackData" sticky-container>
    <el-row>
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16" class="container">
        <el-row :gutter="15">
          <el-col :span="18">
            <div class="mainTrackWrapper">
              <h4 v-if="getTrackLoading">Loading...</h4>
              <comment-item
                v-if="!getTrackLoading"
                :trackData="trackData"
                :onClickTrack="handlePlayTrack"
              />
            </div>
            <el-row :gutter="15" class="userMusicsWrapper">
              <el-card class="similar-tracks-card">
                <h4 v-if="getSimilarTrackLoading">Loading...</h4>
                <template #header>
                  <h3 class="similar-tracks-title" v-if="similarTrackData?.length !== 0">Similar Tracks</h3>
                  <h3 class="similar-tracks-title" v-if="similarTrackData?.length === 0">No Similar Tracks</h3>
                </template>
                <track-item-row
                  v-if="!getSimilarTrackLoading && (similarTrackData && similarTrackData?.length > 0)"
                  v-for="(track, i) in similarTrackData"
                  :itemKey="i"
                  :trackData="track"
                  :onPlayTrack="handlePlayTrack"
                />
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Sticky from 'vue-sticky-directive';
import CommentItem from '@/components/CommentItem.vue';
import TrackItemRow from '@/components/TrackItemRow.vue';
import Player from '@/components/Player.vue';
import SpotifyPublicClient from '@/utils/SpotifyPublicClient';
import _ from 'lodash';


export default {
  components: {
    CommentItem,
    TrackItemRow,
    Player,
  },
  directives: {
    Sticky,  // 注册 Sticky 指令
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    // **响应式状态**
    const currentTrack = ref(null);
    const currentTrackPlayPause = ref(false);
    const isPlay = ref(false);
    const artistMessage = ref(null)

    // **Vuex 状态**
    const getTrackLoading = computed(() => store.getters.getTrackLoading);
    const trackData = computed(() => store.getters.trackData);
    const getTrackFail = computed(() => store.getters.getTrackFail);
    const getSimilarTrackLoading = computed(() => store.getters.getSimilarTrackLoading);
    const similarTrackData = computed(() => store.getters.similarTrackData);
    const getSimilarTrackFail = computed(() => store.getters.getSimilarTrackFail);
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);

    // **方法**
    const handlePlayTrack = (trackData) => { 
      console.log(trackData)
      if (playerCurrentTrack.value && playerCurrentTrack.value.id === trackData.id) {
        store.dispatch('setPlayerCurrentTrack', null);
      } else {
        store.dispatch('setPlayerCurrentTrack', trackData);
      }
    }

    const fetchTrackData = async (trackID) => {
      const trackResponse = await SpotifyPublicClient.getInstance().get({
        url: `tracks/${trackID}`,
      });

      artistMessage.value = await SpotifyPublicClient.getArtistInfo(trackResponse.artists[0].id);

      // 发起 Vuex 的动作请求
      store.dispatch(
        'getTrackInfo', 
        { trackName: trackResponse.name, artistName: trackResponse.artists[0].name, artistImageUrl: artistMessage.value.images[0].url }
      );
      store.dispatch(
        'getSimilarTrackInfo', 
        { trackName: trackResponse.name, artistName: trackResponse.artists[0].name }
      );
    };

    // **初始化**
    onMounted(async() => {
      fetchTrackData(route.params.id);
    });

    // **监听路由变化**
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        store.dispatch('setPlayerTracks', []);
        store.dispatch('setPlayerCurrentTrack', null);
        fetchTrackData(newId);
      }
    });

    // **监听 trackData 变化**
    watch(trackData, (nextTrackData, prevTrackData) => {
      if (nextTrackData && !_.isEqual(nextTrackData, prevTrackData)) {
        store.dispatch('getUserTracks', nextTrackData.id);
      }
    });

    // 监视 similarTrackData 的变化
    watch(similarTrackData, (nextSimilarTrackData, prevSimilarTrackData) => {
      if (nextSimilarTrackData && nextSimilarTrackData.length > 0 && !_.isEqual(nextSimilarTrackData, prevSimilarTrackData)) {
        store.dispatch('setPlayerTracks', nextSimilarTrackData);
      }
    });

    onUnmounted(async() => {
      store.dispatch('setPlayerTracks', []);
      store.dispatch('setPlayerCurrentTrack', null);
    });

    return {
      currentTrack,
      currentTrackPlayPause,
      isPlay,
      getTrackLoading,
      trackData,
      getTrackFail,
      getSimilarTrackLoading,
      similarTrackData,
      getSimilarTrackFail,
      handlePlayTrack,
    }
  }
}

</script>

<style scoped>
  .container {
    margin: 0 auto;
    float: none;
  }
  .mainTrackWrapper {
    margin: 0 0 20px;
    width: 1050px;
    height: 400px;
    display: flex;
  }
  .userMusicsWrapper {
    width: 1050px;
    margin: 0 !important;
  }
  .stickyWrapper.top-sticky > div {
    height: calc(100vh - 20px);
  }
  .stickyWrapper.playerOpened.top-sticky > div {
    height: calc(100vh - 90px);
  }

  .similar-tracks-card {
    width: 1050px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .similar-tracks-title {
    font-size: 18px;
    font-weight: bold;
  }
</style>
