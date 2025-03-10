<template>
  <div v-if="trackData" sticky-container>
    <el-row :style="`padding-bottom: ${currentTrack ? '70px' : '0'}`">
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16" class="container">
        <el-row :gutter="15">
          <el-col :span="18">
            <div class="mainTrackWrapper">
              <h4 v-if="getTrackLoading">Loading...</h4>
              <comment-item
                v-if="!getTrackLoading"
                :trackData="trackData"
                :onClickTrack="handleClickTrack"
                :activeTrack="currentTrack"
                :handlePlayPause="handleSongItemPlayPause"
                :isPlay="isPlay"
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
                  v-if="!getSimilarTrackLoading && !getTrackLoading && similarTrackData?.length"
                  v-for="(track, i) in similarTrackData"
                  :itemKey="i"
                  :trackData="track"
                  :onClickTrack="handleClickTrack"
                  :activeTrack="currentTrack"
                  :handlePlayPause="handleSongItemPlayPause"
                  :isPlay="isPlay"
                />
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <Player
      :tracks="similarTrackData"
      :currentTrack="currentTrack"
      :setCurrentTrack="handleSetCurrentTrack"
      :setCurrentTrackIsPlay="handleSetCurrentTrackIsPlay"
      :outsidePlayPause="currentTrackPlayPause"
    />
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
import SpotifyUserClient from '@/utils/SpotifyUserClient';


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
    const artistImage = ref(null)

    // **Vuex 状态**
    const getTrackLoading = computed(() => store.getters.getTrackLoading);
    const trackData = computed(() => store.getters.trackData);
    const getTrackFail = computed(() => store.getters.getTrackFail);
    const getSimilarTrackLoading = computed(() => store.getters.getSimilarTrackLoading);
    const similarTrackData = computed(() => store.getters.similarTrackData);
    const getSimilarTrackFail = computed(() => store.getters.getSimilarTrackFail);

    // **方法**
    const handleClickTrack = (trackData) => {
      if (currentTrack.value && trackData.id === currentTrack.value.id) {
        currentTrack.value = null;
      } else {
        currentTrack.value = trackData;
      }
    }

    const handleSetCurrentTrack = (newTrack) => {
      currentTrack.value = newTrack;
    };

    const handleSongItemPlayPause = () => {
      currentTrackPlayPause.value = !currentTrackPlayPause.value;
    };

    const handleSetCurrentTrackIsPlay = (isPlayStatus) => {
      isPlay.value = isPlayStatus;
    };


    const fetchTrackData = async (trackID) => {
      const trackResponse = await SpotifyUserClient.getInstance().get({
        url: `tracks/${trackID}`,
      });

      artistMessage.value = await SpotifyUserClient.getArtistInfo(trackResponse.artists[0].id);
      artistImage.value = artistMessage.value.images[0].url;

      // 发起 Vuex 的动作请求
      store.dispatch('getTrackInfo', { trackName: trackResponse.name, artistName: trackResponse.artists[0].name });
      store.dispatch('getSimilarTrackInfo', { trackName: trackResponse.name, artistName: trackResponse.artists[0].name });
    };

    // **初始化**
    onMounted(async() => {
      fetchTrackData(route.params.id);
    });

    // **监听路由变化**
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        store.dispatch('clearTrackInfo');
        store.dispatch('clearSimilarTrackInfo');
        fetchTrackData(newId);
      }
    });

    // **监听 trackData 变化**
    watch(trackData, (newTrackData, oldTrackData) => {
      if (newTrackData && newTrackData !== oldTrackData) {
        store.dispatch('getUserTracks', newTrackData.id);
      }
    });

    onUnmounted(async() => {
      store.dispatch('clearTrackInfo');
      store.dispatch('clearSimilarTrackInfo');
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
      handleClickTrack,
      handleSetCurrentTrack,
      handleSongItemPlayPause,
      handleSetCurrentTrackIsPlay,
    }
  }
}

</script>

<style scoped>
  .container {
    margin: 0 auto;
    float: none;
    height: calc(100vh - 100px);
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
