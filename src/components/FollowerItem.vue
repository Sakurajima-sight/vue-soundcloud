<template>
  <el-card shadow="never" class="userCard">
    <div class="cardWrapper">
      <div class="userDetails">
        <img :src="userData.images[1].url" :alt="userData.display_name" class="avatar" />
        <div class="usernameWrapper">
          <router-link class="username" :to="`/users/${userData.id}`">
            {{ userData.name }}
          </router-link>
          <p class="popularity"><i class="el-icon-popularity"></i>Popularity: {{userData.popularity || 'Privacy'}}</p>
        </div>
      </div>
      <div class="followers">
        <p>{{ numberSeparator(userData.followers.total) }}</p>
        <span>Followers</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
    numberSeparator: {
      type: Function,
    },
  },
  setup() {
    const store = useStore();
    
    // 如果需要获取 Vuex 中的状态
    const activeTrack = computed(() => store.getters.activeTrack);

    return {
      activeTrack,
    };
  },
};
</script>

<style scoped>
  .cardWrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  .userDetails {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .userDetails .avatar {
    width: 50px;
    border-radius: 30px;
  }
  .userDetails .usernameWrapper {
    margin-left: 10px;
    text-align: left;
  }
  .userDetails .usernameWrapper .username {
    margin: 0;
    font-size: 12px;
  }
  .userDetails .usernameWrapper .popularity {
    margin: 0;
    font-size: 12px;
    margin-top: 7px;
    color: #a1a1a1;
  }
  .followers {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 3px;
  }
  .followers > * {
    margin-left: 5px;
    margin-top: 0;
    font-size: 10px;
  }
  .followers > span {
    color: #a1a1a1;
    font-size: 12px;
  }
  .el-card {
    border: none;
    border-bottom: 1px solid #ebeef5;
  }
  .el-card:last-child {
    border: none;
  }
  .userCard .el-card__body {
    padding: 20px;
  }
</style>
  