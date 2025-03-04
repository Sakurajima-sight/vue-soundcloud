<template>
  <!-- 判断是否有激活的音轨，如果有则显示播放器 -->
  <div class="playerWrapper" v-if="!!activeTrack">
    <div class="mainButtons">
      <button @click="handleChangeTrack('previous')">
        <img :src="previousIcon" />
      </button>
      <!-- 播放/暂停按钮 -->
      <button @click="handlePlayPause" class="playButton">
        <img
          :src="isPlay ? pauseIcon : playIcon"
          :style="!isPlay && 'margin-left: 2px'"
        />
      </button>
      <button @click="handleChangeTrack('next')">
        <img :src="nextIcon" />
      </button>
    </div>
    <span class="pastTime" >{{secondsToTime(Math.round(pastTime))}}</span>
    <span class="remainingTime">{{`- ${secondsToTime(Math.round(duration - pastTime))}`}}</span>
    <el-slider
      v-if="showSlider"
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
  props: {
    tracks: {
      type: Array,
    },
    currentTrack: {
      type: Object,
    },
    setCurrentTrack: {
      type: Function,
    },
    setCurrentTrackIsPlay: {
      type: Function,
    },
    outsideSeek: {
      type: Number,
    },
    outsidePlayPause: {
      type: Boolean,
    },
  },
  setup(props) {   
    const store = useStore();
    const player = computed(() => store.getters.spotifyPlayer);
    const pastTime = ref(0);
    const duration = ref(0);
    const seekRange = ref(0);
    const activeTrack = ref(null);
    const isPlay = ref(null);
    const startMouseDown = ref(false);
    const showSlider = ref(false);


    const handlePlayPause = async () => {
      if (player && isPlay.value) {
        await player.value.pause();
        isPlay.value = false;
        showSlider.value = true;
        store.dispatch('isPlayerPlay', isPlay.value);
      } else {        
        if (pastTime.value === duration.value) {
          await SpotifyUserClient.seekToPosition(0);
          seekRange.value = 0;
          pastTime.value = 0;
        }
        showSlider.value = false;
        if (!tempActiveTrack.value && activeTrack.value.uri) {
          SpotifyUserClient.startPlayback('play', activeTrack.value.uri);
          tempActiveTrack.value = activeTrack.value
        }          
        else if (tempActiveTrack.value.uri != activeTrack.value.uri) {
          SpotifyUserClient.startPlayback('play', activeTrack.value.uri);
          tempActiveTrack.value = activeTrack.value
        }
        else if (tempActiveTrack.value.uri == activeTrack.value.uri) {
          await player.value.resume();
          showSlider.value = true;
        }
        isPlay.value = true; // 设置播放状态
        store.dispatch('isPlayerPlay', showSlider.value);
      }
    };

    const handleSeekChange = async (data) => {
      const nextSeek = Math.round(data * (duration.value / 100));
      await SpotifyUserClient.seekToPosition(nextSeek);
      pastTime.value = nextSeek;
      seekRange.value = data;
    };

    const handleChangeTrackState = ref(false)
    const handleChangeTrack = async (direction) => {
      const currentIndex = props.tracks.findIndex(track => track.uri === props.currentTrack.uri);
      let nextIndex = 0;
      if (direction === 'next') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < props.tracks.length) {
          await props.setCurrentTrack(props.tracks[nextIndex]);
        }
      } else if (direction === 'previous') {
        nextIndex = currentIndex - 1;
        if (nextIndex >= 0) {
          await props.setCurrentTrack(props.tracks[nextIndex]);
        }
      }
      handleChangeTrackState.value = true;
    };

    const isTrackFinished = ref(false)
    const updatePlayerState = async () => {
      if (player && isPlay.value) {
        const state = await player.value.getCurrentState();
        if (!state.paused) {
          showSlider.value = true;
          await store.dispatch('isPlayerPlay', showSlider.value);
        } else {
          showSlider.value = false;
          return
        } 
        pastTime.value = state.position / 1000 || 0; // 以毫秒为单位
        duration.value = state.duration / 1000 || 0; // 以毫秒为单位
        if (Math.round(pastTime.value) === Math.round(duration.value)) {
          isTrackFinished.value = true;
        }
      }
    };

    watch(() => props.outsidePlayPause, (nextPlayPause, prevPlayPause) => {
      if (nextPlayPause !== prevPlayPause && player) {
        handlePlayPause();
      }
    });
    
    watch(() => props.outsideSeek, (nextSeek, prevSeek) => {
      if (
        (nextSeek || nextSeek === 0) &&
        (nextSeek !== prevSeek) &&
        player.value
      ) {
        pastTime.value = nextSeek;
        seekRange.value = nextSeek / (duration.value / 100);
        handleSeekChange(seekRange.value);
      }
    });

    watch(() => props.currentTrack, (nextCurrentTrack, prevCurrentTrack) => {
      if (
        (prevCurrentTrack && nextCurrentTrack && prevCurrentTrack.id !== nextCurrentTrack.id) ||
        (nextCurrentTrack && nextCurrentTrack.id && !prevCurrentTrack) ||
        (prevCurrentTrack && !nextCurrentTrack)
      ) {
        if (!nextCurrentTrack && player) {
          player.value.pause();
          seekRange.value = 0;
          pastTime.value = 0;
          duration.value = 0;
        }
        activeTrack.value = nextCurrentTrack;
      }
    });

    watch(pastTime, (nextPastTime, prevPastTime) => {
      if (
        nextPastTime &&
        nextPastTime > 0 &&
        nextPastTime !== prevPastTime
      ) {
        seekRange.value = parseFloat((pastTime.value / duration.value * 100).toFixed(1));
      }
    });


    let intervalId;
    const tempActiveTrack = ref(null);
    watch(activeTrack, async(nextActiveTrack, prevActiveTrack) => {
      clearInterval(intervalId);
      await player.value.pause();
      seekRange.value = 0;
      pastTime.value = 0;
      duration.value = 0;
      showSlider.value = false;
      isPlay.value = false;
      await store.dispatch('isPlayerPlay', showSlider.value);
      tempActiveTrack.value = prevActiveTrack
      // 每次 activeTrack 变化时，清理之前的定时器，并重新开始
      if (!activeTrack.value || intervalId) {
        clearInterval(intervalId);
      }
      if (handleChangeTrackState.value) {
        await SpotifyUserClient.startPlayback('play', nextActiveTrack.uri); // 播放选定的曲目
        isPlay.value = true;
        handleChangeTrackState.value = false;
      }
      if (nextActiveTrack) {
        intervalId = setInterval(updatePlayerState, 100); // 设置定时器
      }
    });


    watchEffect(() => {
      if (isTrackFinished.value) {
        if ((props.tracks.indexOf(activeTrack) + 1) < props.tracks.length) {
          handleChangeTrack('next');
        } else {
          pastTime.value = 0;
          seekRange.value = 0;
          player.pause();
          if (props.setCurrentTrackIsPlay) {
            props.setCurrentTrackIsPlay(false);
          }
        }
        isTrackFinished.value = false;
      }
      if (props.setCurrentTrackIsPlay) {
        if (player && isPlay.value) {
          props.setCurrentTrackIsPlay(true);
        } else {
          props.setCurrentTrackIsPlay(false);
        }
      }
    });

    const sliderRef = ref(null);
    watchEffect(() => {
      const seekSliderButtonElement = sliderRef.value?.$el.querySelector('.el-slider__runway');
      // 如果按钮元素存在，则绑定鼠标按下和松开事件
      if (seekSliderButtonElement) {
        // 监听 mousedown 事件，表示鼠标按下
        seekSliderButtonElement.addEventListener('mousedown', async() => {
          clearInterval(intervalId);
          await player.value.pause();
          startMouseDown.value = true;
        });

        // 监听 mouseup 事件，表示鼠标松开
        window.addEventListener('mouseup', async() => {
          if (startMouseDown.value) {
            handleSeekChange(seekRange.value);
            await player.value.resume();
            startMouseDown.value = false;
            setTimeout(() => {
              intervalId = setInterval(updatePlayerState, 100);}, 500);
          }
        });
      }
    });

    onUnmounted(() => {
      if (player.value) {
        player.value.pause();
        seekRange.value = 0;
        pastTime.value = 0;
        duration.value = 0;
      }
      clearInterval(intervalId);
    });


    return {
      handlePlayPause,
      handleSeekChange,
      handleChangeTrack,
      playIcon,
      pauseIcon,
      nextIcon,
      previousIcon,
      secondsToTime,
      activeTrack,
      player,
      pastTime,
      duration,
      seekRange,
      isPlay,
      sliderRef,
      showSlider
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
    
