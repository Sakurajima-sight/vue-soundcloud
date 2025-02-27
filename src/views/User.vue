<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16" class="pageWrapper">
        <el-row :gutter="15">
          <el-col :span="18">
            <el-card shadow="always" class="mainUserCardWrapper">
              <h1 v-if="getUserProfileLoading">Loading...</h1>
              <div v-if="userMessage && userProfileData && !getUserProfileLoading">
                <img
                  :src="userMessage.images[2].url"
                  :alt="userMessage.name"
                  class="avatar"
                />
                <h3>{{userMessage.name}}</h3>
                <div class="otherDetailsWrapper">
                  <p><i class="el-icon-location"></i> Popularity: {{userMessage.popularity || 'Privacy'}}</p>
                  <p>{{userMessage.followers.total}} Followers</p>
                  <el-tooltip
                    effect="dark"
                    :content="userProfileData.artist.name"
                    placement="top"
                  >
                    <a target="_blank" :href="userProfileData.artist.url">Website</a>
                  </el-tooltip>
                </div>
                <p class="description" v-html="cleanedSummary" ></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" class="followingWrapper">
            <h3 v-if="getUserFollowingsLoading">Loading...</h3>
            <h3 v-if="!getUserFollowingsLoading">
              Similar To
            </h3>
            <user-item
              v-if="!getUserFollowingsLoading"
              v-for="(user, i) in userFollowingsData"
              :key="i"
              :userData="user"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router'; // 引入 Vue Router 中的 useRoute
import UserItem from '../components/Userltem.vue';
import SpotifyUserClient from '@/utils/SpotifyUserClient'; // 引入 Spotify API 客户端

export default {
  components: {
    UserItem,
  },
  setup() {
    const store = useStore();  // 使用 Vuex 的 useStore hook
    const route = useRoute(); // 使用 useRoute 获取当前的路由对象
    const getUserProfileLoading = computed(() => store.getters.getUserProfileLoading);
    const userProfileData = computed(() => store.getters.userProfileData);
    const userProfileFail = computed(() => store.getters.userProfileFail);
    const getUserFollowingsLoading = computed(() => store.getters.getUserFollowingsLoading);
    const userFollowingsData = computed(() => store.getters.userFollowingsData);
    const userFollowingsFail = computed(() => store.getters.userFollowingsFail);
    const userMessage = ref(null)


    // 获取用户资料和关注列表
    const fetchUserData = async(userID) => {
      userMessage.value = await SpotifyUserClient.getArtistInfo(userID);
      store.dispatch('getUserProfile', userMessage.value.name);
      store.dispatch('getUserFollowings', userMessage.value.name);
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

    const cleanedSummary = computed(() => {
      const summary = userProfileData.value.artist.bio.summary;
      const filteredSummary = summary.replace(/<a href="https:\/\/www\..*/g, "");
      return filteredSummary
    })
    
    return {
      getUserProfileLoading,
      userProfileData,
      userProfileFail,
      getUserFollowingsLoading,
      userFollowingsData,
      userFollowingsFail,
      userMessage,
      cleanedSummary
    };
  },
};
</script>

<style scoped>
  .pageWrapper {
    margin: 0 auto;
    float: none;
  }
  .followingWrapper {
    background: #fff;
  }
  .mainUserCardWrapper .avatar {
    border-radius: 50px;
  }
  .mainUserCardWrapper .otherDetailsWrapper {
    text-align: center;
  }
  .mainUserCardWrapper .otherDetailsWrapper > * {
    display: inline-block;
    margin: 0 20px;
    color: #a1a1a1;
  }
</style>
  