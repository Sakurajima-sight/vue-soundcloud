<template>
  <!-- 判断是否有激活的音轨，如果有则显示播放器 -->
  <div class="playerWrapper" v-if="!!activeTrack">
    <div class="mainButtons">
      <button @click="handleChangeTrack('previous')">
        <img :src="previousIcon" />
      </button>
      <!-- 播放/暂停按钮 -->
      <button @click="handlePlay" class="playButton">
        <img
          :src="isPlay ? pauseIcon : playIcon"
          :style="!isPlay && 'margin-left: 2px'"
        />
      </button>
      <button @click="handleChangeTrack('next')">
        <img :src="nextIcon" />
      </button>
    </div>
    <span class="pastTime" >{{secondsToTime(Math.round(position))}}</span>
    <span class="remainingTime">{{`- ${secondsToTime(Math.round(duration - position))}`}}</span>
    <el-slider
      v-if="playerPlay"
      class="seekBar"
      v-model="seekRange"
      :show-tooltip="false"
      @change="handleSeekChange"
      ref="sliderRef"
    />
  </div>
</template>

<script>
import { ref, computed, watchEffect, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import nextIcon from '../assets/icons/next.svg';
import previousIcon from '../assets/icons/previous.svg';
import SpotifyUserClient from '@/utils/SpotifyUserClient';
import secondsToTime from '@/utils/secondsToTime';

export default {
  setup() {
    const store = useStore();

    const activeTrack = computed(() => store.getters.activeTrack);  // 当前活动的 Track
    const errorMessage = ref(""); // 用于存储错误消息
    const player = computed(() => store.getters.spotifyPlayer);

    // 播放器状态
    const isPlay = ref(false); // 用于控制播放/暂停的状态
    const tempActiveTrack = ref(null);
    const playerPlay = ref(false); // 歌曲是否加载完成
    
    const seekRange = ref(0);  // 当前曲目的总时长（秒）
    const position = ref(0);  // 当前播放进度（秒）
    const duration = ref(0);  // 用于控制 seekBar 的进度

    let intervalId;

    const handleSeekChange = async (data) => {      
      if (startMouseDown.value) {
        const nextPosition = Math.min(Math.max(Math.round(data * (duration.value / 100)), 0), duration.value);
        try {
          await SpotifyUserClient.seekToPosition(nextPosition);
          if (!isPlay.value && nextPosition !== duration.value) {
            await player.value.resume();
            isPlay.value = true;
          }

        } catch (error) {
          console.error('发生错误:', error);
        } 
      }
    };

    const updatePlayerState = async () => {
      if (!startMouseDown.value && isPlay.value && player.value) {
        try {
          const state = await player.value.getCurrentState(); 
          const currentTrackUri = state.track_window.current_track.uri;

          if (!state) {
            console.log("无法获取播放器状态");
            return;
          }

          if (activeTrack.value.uri != currentTrackUri) {
            position.value = 0;
            duration.value = 0;
          } else {
            if (!state.paused) {
              playerPlay.value = true;
            } else {
              playerPlay.value = false;
              return
            }
            console.log("state.paused:", state.paused)
            // 获取当前播放位置和总时长
            position.value = state.position / 1000; // 以毫秒为单位
            duration.value = state.duration / 1000; // 以毫秒为单位
            seekRange.value = parseFloat((position.value / duration.value * 100).toFixed(1));
            if (Math.round(position.value) === Math.round(duration.value)) {
              position.value = 0;
              duration.value = 0;
              playerPlay.value = false;
              isPlay.value = false;
            }
          }
        } catch (error) {
          console.error("获取播放器状态时发生错误:", error);
        }
      }
    };
    
    onUnmounted(() => {
      // 清除定时器，防止内存泄漏
      clearInterval(intervalId);
    });

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
            SpotifyUserClient.startPlayback('play', activeTrack.value.uri);
            console.log("1")
            tempActiveTrack.value = activeTrack.value
            isPlay.value = true; // 设置播放状态
          }          
          else if (tempActiveTrack.value.uri != activeTrack.value.uri) {
            // 播放当前歌曲
            console.log("2")
            SpotifyUserClient.startPlayback('play', activeTrack.value.uri);
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

    // 切换曲目函数（上一曲或下一曲）
    const handleChangeTrack = async (direction) => {
      try {
        // 获取所有曲目列表
        const tracks = computed(() => store.getters.tracks).value;
        const currentIndex = tracks.findIndex(track => track.uri === activeTrack.value.uri);

        if (currentIndex === -1) {
          console.error("未找到当前播放的曲目");
          return;
        }

        let nextIndex = null;
        if (direction === 'next') {
          nextIndex = currentIndex + 1;
        } else if (direction === 'previous') {
          nextIndex = currentIndex - 1;
        }

        if (nextIndex >= 0 && nextIndex < tracks.length) {
          // 获取下一曲或者上一曲
          const nextTrack = tracks[nextIndex];
          await store.dispatch('setActiveTrack', nextTrack); // 更新 Vuex 中的 activeTrack
          await SpotifyUserClient.startPlayback('play', activeTrack.value.uri); // 播放选定的曲目
          // 清除之前的定时器
          clearInterval(intervalId);
          // 为新曲目设置定时器
          intervalId = setInterval(updatePlayerState, 200); 
          tempActiveTrack.value = activeTrack.value;
          isPlay.value = true; // 设置播放状态
        }
      } catch (error) {
        console.error("切换曲目失败:", error);
        errorMessage.value = "切换失败，请重试";
      }
    };

    watch(
      () => activeTrack.value,  // 监听 activeTrack 的变化
      async (newActiveTrack, oldActiveTrack) => {  // 使用 async 回调函数
        clearInterval(intervalId);
        tempActiveTrack.value = oldActiveTrack
        await player.value.pause();
        position.value = 0;
        duration.value = 0;
        seekRange.value = 0;
        isPlay.value = false;
        playerPlay.value = false;
        // 每次 activeTrack 变化时，清理之前的定时器，并重新开始
        if (!activeTrack.value || intervalId) {
          clearInterval(intervalId);
        }
        if (newActiveTrack) {
          intervalId = setInterval(updatePlayerState, 200); // 设置定时器
        }
      }
    );

    const sliderRef = ref(null);
    const startMouseDown = ref(false);

    watchEffect(() => {
      console.log("seekRange 变化为：", seekRange.value);

      // 使用 nextTick 确保 DOM 渲染完成
      const seekSliderButtonElement = sliderRef.value?.$el.querySelector('.el-slider__runway');
      // 如果按钮元素存在，则绑定鼠标按下和松开事件
      if (seekSliderButtonElement) {
        // 监听 mousedown 事件，表示鼠标按下
        seekSliderButtonElement.addEventListener('mousedown', () => {
          clearInterval(intervalId);
          player.value.pause();
          startMouseDown.value = true;
        });

        // 监听 mouseup 事件，表示鼠标松开
        window.addEventListener('mouseup', () => {
          if (startMouseDown.value) {
            handleSeekChange(seekRange.value);
            for (let i = 0; i < 10; i++) {
              player.value.resume();
            }
            startMouseDown.value = false;
          }
        });
      }
    });

    watch(startMouseDown, (newVal, oldVal) => {
      console.log('startMouseDown.value changed:', newVal, 'from:', oldVal);

      if (!newVal){
        setTimeout(() => {
        intervalId = setInterval(updatePlayerState, 200);}, 600);
      }
    });

    return {
      playerPlay,
      activeTrack,
      isPlay,
      handlePlay,
      handleChangeTrack,
      handleSeekChange,
      secondsToTime,
      position,
      duration,
      seekRange,
      playIcon,
      pauseIcon,
      nextIcon,
      previousIcon,
      sliderRef
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
    
