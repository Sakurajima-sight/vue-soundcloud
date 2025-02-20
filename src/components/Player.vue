<template>
  <!-- 判断是否有激活的音轨，如果有则显示播放器 -->
  <div class="playerWrapper" v-if="!!activeTrack">
    <div class="mainButtons">
      <!-- 播放/暂停按钮 -->
      <button @click="handlePlay" class="playButton">
        <img
          :src="isPlay ? pauseIcon : playIcon"
          :style="!isPlay && 'margin-left: 2px'"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import SpotifyUserClient from '@/utils/SpotifyUserClient';

export default {
  setup() {
    const store = useStore();

    // 从 Vuex 中获取 access token
    const accessToken = computed(() => store.getters.accessToken);
    const activeTrack = computed(() => store.getters.activeTrack);  // 当前活动的 Track
    const errorMessage = ref(""); // 用于存储错误消息
    const player = computed(() => store.getters.spotifyPlayer);

    // 播放器状态
    const isPlay = ref(false); // 用于控制播放/暂停的状态
    const tempActiveTrack = ref(null);

    const handlePlay = async () => {
      if (!player.value) {
        console.error("无法获取播放状态");
        return;
      }
      try {
        if (isPlay.value) {
          // 暂停当前歌曲
          await player.value.pause();
          isPlay.value = false; // 设置暂停状态
        } else {
          if (!tempActiveTrack.value && activeTrack.value.uri) {
            SpotifyUserClient.controlPlayback('play', activeTrack.value.uri);
            console.log("1")
            tempActiveTrack.value = activeTrack.value
            isPlay.value = true; // 设置播放状态
          }          
          else if (tempActiveTrack.value.uri != activeTrack.value.uri) {
            // 播放当前歌曲
            console.log("2")
            SpotifyUserClient.controlPlayback('play', activeTrack.value.uri);
            isPlay.value = true; // 设置播放状态
            tempActiveTrack.value = activeTrack.value
          }
          else if (tempActiveTrack.value.uri == activeTrack.value.uri) {
            // 播放当前歌曲
            console.log("3")
            await player.value.resume();
            isPlay.value = true; // 设置播放状态
          }
        }
      } catch (error) {
        console.error("播放控制错误:", error);
        errorMessage.value = "操作失败，请重试";
      }
    };

    watch(
      () => activeTrack.value,  // 监听 activeTrack 的变化
      async (newActiveTrack, oldActiveTrack) => {  // 使用 async 回调函数
        tempActiveTrack.value = oldActiveTrack
        await player.value.pause();
        isPlay.value = false;
      }
    );


    return {
      accessToken,
      errorMessage,
      isPlay,
      handlePlay,
      playIcon,
      pauseIcon,
      activeTrack,
    };
  },
};
</script>


  
<style scoped>
  /* 播放器容器样式 */
  .playerWrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: 12px;
    background: #fff;
    display: flex;
    height: 65px;
  }
  .mainButtons {
    margin: 0 auto;
    display: table;
    align-self: center;
  }
  /* 按钮样式 */
  .mainButtons button {
    float: left;
    border-radius: 20px;
    width: 40px;
    height: 40px;
    margin: 10px;
    padding: 11px;
    transition: all ease .1s;
    box-sizing: border-box;
  }
  .mainButtons button:hover {
    transform: scale(1.1); /* 鼠标悬停时按钮放大 */
  }
  .mainButtons button.playButton {
    border: 1px solid #a5a7b0;
  }
  .mainButtons button img {
    width: 16px;
  }
  /* 播放进度条样式 */
  .seekBar {
    position: absolute;
    top: -16px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 90%;
    height: 8px;
  }
  .seekBar .el-slider__button {
    height: 10px;
    width: 10px;
    margin-top: 2px;
  }
  /* 显示时间的样式 */
  .pastTime {
    position: absolute;
    left: 5%;
    bottom: 15%;
  }
  .remainingTime {
    position: absolute;
    right: 5%;
    bottom: 15%;
  }
</style>
    
