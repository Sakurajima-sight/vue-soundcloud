<template>
  <div sticky-container>
    <el-row>
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16" class="container">
        <el-row :gutter="15">
          <el-col :span="18">
            <el-card shadow="always" class="mainUserCardWrapper">
              <h4 v-if="getUserProfileLoading">Loading...</h4>
              <div v-if="userMessage && userProfileData && !getUserProfileLoading">
                <img
                  :src="userMessage.images[2].url"
                  :alt="userMessage.name"
                  class="avatar"
                />
                <h4>{{userMessage.name}}</h4>
                <div class="otherDetailsWrapper">
                  <p>
                    <font-awesome-icon :icon="['fas', 'fire']" />
                    Popularity: {{ userMessage.popularity || 'Privacy' }}
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'users']" />
                    {{ numberSeparator(userMessage.followers.total) }} Followers
                  </p>
                  <a target="_blank" :href="userProfileData.artist.url">
                    <font-awesome-icon :icon="['fas', 'globe']" />
                    {{ userProfileData.artist.name }} Summary
                  </a>
                </div>
                <p class="description" v-html="cleanedSummary" ></p>
              </div>
            </el-card>
            <el-row :gutter="15" class="userMusicsWrapper">
              <el-card class="similar-tracks-card">
                <h4 v-if="getUserTracksLoading">Loading...</h4>
                <template #header>
                  <h3 class="similar-tracks-title" v-if="userTracksData?.length !== 0">Top Tracks</h3>
                  <h3 class="similar-tracks-title" v-if="userTracksData?.length === 0">No Top Tracks</h3>
                </template>
                <track-item-row
                  v-if="!getUserTracksLoading && (userTracksData && userTracksData.length > 0)"
                  v-for="(track, i) in userTracksData"
                  :itemKey="i"
                  :trackData="track"
                  :onPlayTrack="handlePlayTrack"
                />
              </el-card>
            </el-row>
          </el-col>
          <div
            v-sticky="true"
            sticky-side="both"
            :class="`stickyWrapper${playerCurrentTrack ? ' playerOpened' : ''}`"
          >
            <el-col :span="6" class="followingWrapper">
              <h4 v-if="getUserFollowingsLoading">Loading...</h4>
              <h4 class="custom-heading" v-if="!getUserFollowingsLoading">
                Similar To
              </h4>
              <follower-item
                v-if="!getUserFollowingsLoading"
                v-for="(user, i) in userFollowingsData"
                :key="i"
                :userData="user"
                :numberSeparator="numberSeparator"
              />
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, watch, computed, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; // 引入 Vue Router 中的 useRoute
import FollowerItem from '../components/FollowerItem.vue';
import Sticky from 'vue-sticky-directive';
import SpotifyUserClient from '@/utils/SpotifyUserClient'; // 引入 Spotify API 客户端
import TrackItemRow from '@/components/TrackItemRow.vue';
import Player from '@/components/Player.vue';
import { numberSeparator } from '@/utils/number';
import _ from 'lodash'; // 导入 lodash 库，作为工具函数集合，通常使用 "_" 作为别名
export default {
  directives: {
    Sticky,  // 注册 Sticky 指令
  },
  components: {
    FollowerItem,
    TrackItemRow,
    Player
  },
  setup() {
    const store = useStore();  // 使用 Vuex 的 useStore hook
    const route = useRoute(); // 使用 useRoute 获取当前的路由对象
    const getUserProfileLoading = computed(() => store.getters.getUserProfileLoading);
    const userProfileData = computed(() => store.getters.userProfileData);
    const getUserProfileFail = computed(() => store.getters.getUserProfileFail);
    const getUserFollowingsLoading = computed(() => store.getters.getUserFollowingsLoading);
    const userFollowingsData = computed(() => store.getters.userFollowingsData);
    const getUserFollowingsFail = computed(() => store.getters.getUserFollowingsFail);
    const getUserTracksLoading = computed(() => store.getters.getUserTracksLoading);
    const userTracksData = computed(() => store.getters.userTracksData);
    const getUserTracksFail = computed(() => store.getters.getUserTracksFail);
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);

    const userMessage = ref(null)
    const artistImage = ref(null)

    // 获取用户资料和关注列表
    const fetchUserData = async(userID) => {
      userMessage.value = await SpotifyUserClient.getArtistInfo(userID);
      store.dispatch('getUserProfile', userMessage.value.name);
      store.dispatch('getUserFollowings', userMessage.value.name);
      artistImage.value = userMessage.value.images[0].url
      store.dispatch('getUserTracks', {name: userMessage.value.name, artistImageUrl: artistImage.value});
    };

    // 在组件挂载时请求数据
    onMounted(() => {
      const userID = route.params.id;
      fetchUserData(userID);
    });

    // 监听路由变化
    watch(
      () => route.params.id,
      (newUserID, oldUserID) => {
        userMessage.value = null;
        if (newUserID !== oldUserID) {
          fetchUserData(newUserID);
        }
      }
    );

    // 监视 userTracksData 的变化
    watch(userTracksData, (nextUserTracksData, prevUserTracksData) => {
      if (nextUserTracksData.length > 0 && !_.isEqual(nextUserTracksData, prevUserTracksData)) {
        store.dispatch('setPlayerTracks', nextUserTracksData);
      }
    });

    const cleanedSummary = computed(() => {
      const summary = userProfileData.value.artist.bio.summary;
      const filteredSummary = summary.replace(/<a href="https:\/\/www\..*/g, "");
      return filteredSummary
    })

    // 处理播放音轨的方法
    const handlePlayTrack = (trackData) => {
      setTimeout(() => {
        if (playerCurrentTrack.value && playerCurrentTrack.value.id === trackData.id) {
          store.dispatch('setPlayerCurrentTrack', null);
        } else {
          store.dispatch('setPlayerCurrentTrack', trackData);
        }
      }, 100);
    };

    onUnmounted(async() => {
      store.dispatch('setPlayerTracks', []);
      store.dispatch('setPlayerCurrentTrack', null);
    });

    return {
      getUserProfileLoading,
      userProfileData,
      getUserProfileFail,
      getUserFollowingsLoading,
      userFollowingsData,
      getUserFollowingsFail,
      userMessage,
      cleanedSummary,
      getUserTracksLoading,
      userTracksData,
      getUserTracksFail,
      numberSeparator,
      handlePlayTrack,
      playerCurrentTrack
    };
  },
};
</script>

<style scoped>
  .container {
    margin: 0 auto;
    float: none;
  }
  .followingWrapper {
    background: #fff;
    overflow-y: scroll;
    height: 53vh;
    position: absolute;
    right: 15px;
    width: 260px;
    border-radius: 5px;
  }
  .mainUserCardWrapper {
    height: 53vh;
  }
  .mainUserCardWrapper .avatar {
    border-radius: 50px;
    width: 160px;
    height: 160px;
  }
  .mainUserCardWrapper .otherDetailsWrapper {
    text-align: center;
  }
  .mainUserCardWrapper .otherDetailsWrapper > * {
    display: inline-block;
    margin: 0 20px;
    color: #a1a1a1;
  }
  .mainUserCardWrapper .otherDetailsWrapper > * > svg {
    margin-right: 5px;
  }
  .userMusicsWrapper {
    width: 1050px;
    margin: 20px 0 0 !important;
  }
  .description {
    padding: 5px;
    font-family: "Roboto Condensed", sans-serif;
    font-style: italic;
    font-size: 14px;
    line-height: 1.2; /* 增加行间距，提高可读性 */
  }

  .stickyWrapper.top-sticky > div {
    height: calc(100vh - 20px);
  }
  .stickyWrapper.playerOpened.top-sticky > div {
    height: calc(100vh - 90px);
  }
  .custom-heading {
    font-size: 20px; /* 设置字体大小 */
    margin-top: 20px; /* 可以调整外边距来让盒子更紧凑 */
    margin-bottom: -3px; /* 可以调整外边距来让盒子更紧凑 */
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
  