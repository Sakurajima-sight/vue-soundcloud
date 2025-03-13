<template>
  <!-- 判断是否有激活的音轨，如果有则显示播放器 -->
  <div class="playerWrapper" v-if="spotifyPlayer && !!playerCurrentTrack">
    <div class="trackDetails">
      <img :src="playerCurrentTrack.album.images[0].url" alt="">
      <div class="titleWrapper">
        <router-link class="title" :to="`/tracks/${playerCurrentTrack.id}`">
          {{ playerCurrentTrack.name }}
        </router-link>
        <router-link class="user" :to="`/users/${playerCurrentTrack.artists[0].id}`">
          {{ playerCurrentTrack.artists[0].name }}
        </router-link>
      </div>
    </div> 
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
    <span class="pastTime" >{{secondsToTime(Math.round(playerCurrentTime))}}</span>
    <span class="remainingTime">{{`- ${secondsToTime(Math.round(playerDuration - playerCurrentTime))}`}}</span>
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
import _ from 'lodash';


export default {
  setup(props) {   
    const store = useStore();
    const spotifyPlayer = computed(() => store.getters.spotifyPlayer);
    const seekRange = ref(0);
    const isPlay = ref(null);
    const startMouseDown = ref(false);
    const showSlider = ref(false);

    // 使用 computed 映射 getters
    const playerCurrentTime = computed(() => store.getters.playerCurrentTime);
    const playerDuration = computed(() => store.getters.playerDuration);
    const playerTracks = computed(() => store.getters.playerTracks);
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);

    const handlePlayPause = async () => {
      if (spotifyPlayer && isPlay.value) {
        await spotifyPlayer.value.pause();
        isPlay.value = false;
        showSlider.value = true;
        store.dispatch('isPlayerPlay', isPlay.value);
      } else {        
        if (playerCurrentTime.value === playerDuration.value) {
          await SpotifyUserClient.seekToPosition(0);
          seekRange.value = 0;
          store.dispatch('setPlayerCurrentTime', 0);
        }
        showSlider.value = false;
        if (!tempTrack.value && playerCurrentTrack.value.uri) {
          SpotifyUserClient.startPlayback('play', playerCurrentTrack.value.uri);
          tempTrack.value = playerCurrentTrack.value
        }          
        else if (tempTrack.value.uri != playerCurrentTrack.value.uri) {
          SpotifyUserClient.startPlayback('play', playerCurrentTrack.value.uri);
          tempTrack.value = playerCurrentTrack.value
        }
        else if (tempTrack.value.uri == playerCurrentTrack.value.uri) {
          for (let i = 0; i < 5; i++) {
            await spotifyPlayer.value.resume();
          }
          showSlider.value = true;
        }
        isPlay.value = true; // 设置播放状态
        store.dispatch('isPlayerPlay', showSlider.value);
      }
    };

    const handleSeekChange = async (data) => {
      const nextSeek = Math.round(data * (playerDuration.value / 100));
      await SpotifyUserClient.seekToPosition(nextSeek);
      store.dispatch('setPlayerCurrentTime', nextSeek);
      seekRange.value = data;
    };

    const handleChangeTrackState = ref(false)
    const handleChangeTrack = async (direction) => {
      const currentIndex = playerTracks.value.findIndex(track => track.id === playerCurrentTrack.value.id);
      let nextIndex = 0;
      if (direction === 'next') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < playerTracks.value.length) {
          await store.dispatch('setPlayerCurrentTrack', playerTracks.value[nextIndex]);
        }
      } else if (direction === 'previous') {
        nextIndex = currentIndex - 1;
        if (nextIndex >= 0) {
          await store.dispatch('setPlayerCurrentTrack', playerTracks.value[nextIndex]);
        }
      }
      handleChangeTrackState.value = true;
    };

    const isTrackFinished = ref(false)
    const updatePlayerState = async () => {
      if (spotifyPlayer && isPlay.value) {
        const state = await spotifyPlayer.value.getCurrentState();
        if (!state.paused) {
          showSlider.value = true;
          await store.dispatch('isPlayerPlay', showSlider.value);
        } else {
          showSlider.value = false;
          return
        } 
        store.dispatch('setPlayerCurrentTime', state.position / 1000 || 0); // 以毫秒为单位
        store.dispatch('setPlayerDuration', state.duration / 1000 || 0); // 以毫秒为单位
        if (Math.round(playerCurrentTime.value) === Math.round(playerDuration.value)) {
          isTrackFinished.value = true;
        }
      }
    };

    watch(() => isPlay, (nextIsPlay, prevIsPlay) => {
      if (nextIsPlay !== prevIsPlay && spotifyPlayer) {
        handlePlayPause();
      }
    });

    watch(() => playerCurrentTrack, (nextCurrentTrack, prevCurrentTrack) => {
      if (nextCurrentTrack && !_.isEqual(nextCurrentTrack, prevCurrentTrack)) {
        if (!nextCurrentTrack && spotifyPlayer) {
          spotifyPlayer.value.pause();
          store.dispatch('setPlayerCurrentTime', 0);
          store.dispatch('setPlayerDuration', 0);
          seekRange.value = 0;
        }
        playerCurrentTrack.value = nextCurrentTrack;
      }
    });

    watch(playerCurrentTime, (nextPlayerCurrentTime, prevPlayerCurrentTime) => {
      if (
        nextPlayerCurrentTime &&
        prevPlayerCurrentTime > 0 &&
        nextPlayerCurrentTime !== prevPlayerCurrentTime
      ) {
        seekRange.value = parseFloat((playerCurrentTime.value / playerDuration.value * 100).toFixed(1));
      }
    });


    let intervalId;
    const tempTrack = ref(null);
    watch(playerCurrentTrack, async(nextCurrentTrack, prevCurrentTrack) => {
      clearInterval(intervalId);
      await spotifyPlayer.value.pause();
      seekRange.value = 0;
      store.dispatch('setPlayerCurrentTime', 0);
      store.dispatch('setPlayerDuration', 0);
      showSlider.value = false;
      isPlay.value = false;
      await store.dispatch('isPlayerPlay', showSlider.value);
      tempTrack.value = prevCurrentTrack
      // 每次 playerCurrentTrack 变化时，清理之前的定时器，并重新开始
      if (!playerCurrentTrack.value || intervalId) {
        clearInterval(intervalId);
      }
      if (handleChangeTrackState.value) {
        await SpotifyUserClient.startPlayback('play', nextCurrentTrack.uri); // 播放选定的曲目
        isPlay.value = true;
        handleChangeTrackState.value = false;
      }
      if (nextCurrentTrack) {
        intervalId = setInterval(updatePlayerState, 100); // 设置定时器
      }
    });


    watchEffect(() => {
      if (isTrackFinished.value) {
        if ((playerTracks.value.indexOf(playerCurrentTrack.value) + 1) < playerTracks.value.length) {
          handleChangeTrack('next');
        } else {
          store.dispatch('setPlayerCurrentTime', 0);
          seekRange.value = 0;
          spotifyPlayer.pause();
          if (props.setCurrentTrackIsPlay) {
            props.setCurrentTrackIsPlay(false);
          }
        }
        isTrackFinished.value = false;
      }
      if (props.setCurrentTrackIsPlay) {
        if (spotifyPlayer && isPlay.value) {
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
          await spotifyPlayer.value.pause();
          startMouseDown.value = true;
        });

        // 监听 mouseup 事件，表示鼠标松开
        window.addEventListener('mouseup', async() => {
          if (startMouseDown.value) {
            handleSeekChange(seekRange.value);
            for (let i = 0; i < 5; i++) {
              await spotifyPlayer.value.resume();
            }
            startMouseDown.value = false;
            setTimeout(() => {
              intervalId = setInterval(updatePlayerState, 200);}, 600);
            isPlay.value = true;    
          }
        });
      }
    });

    onUnmounted(() => {
      if (spotifyPlayer.value) {
        spotifyPlayer.value.pause();
        seekRange.value = 0;
        store.dispatch('setPlayerCurrentTime', 0);
        store.dispatch('setPlayerDuration', 0);
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
      spotifyPlayer,
      playerCurrentTrack,
      playerCurrentTime,
      playerDuration,
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
    background: #fff;
    display: flex;
    height: 85px;
  }
  .trackDetails {
    position: absolute;
    left: 15px;
    top: 0;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .trackDetails img {
    width: 60px;
    background: #eee;
    object-fit: cover;
  }
  .trackDetails .titleWrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: -10px;
    padding-top: 18px;
    margin-left: 10px;
    font-size: 12px;
    width: 200px;
    height: 60px;
    overflow: hidden;
    text-align: left;
  }
  .trackDetails .titleWrapper * {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  .trackDetails .titleWrapper .title {
    margin-top: -3px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .trackDetails .titleWrapper .user {
    font-weight: normal;
  }
  .mainButtons {
    margin: 5px auto 0;
    display: table;
    align-self: center;
  }
  .mainButtons button {
    float: left;
    border-radius: 20px;
    width: 35px;
    height: 35px;
    margin: 0 10px;
    padding: 5px;
    transition: all ease .1s;
    box-sizing: border-box;
  }
  .mainButtons button:disabled,
  .mainButtons button[disabled] {
    cursor: default;
    pointer-events: none;
  }
  .mainButtons button:disabled img,
  .mainButtons button[disabled] img {
    opacity: .2 !important;
  }
  .mainButtons button:hover img {
    opacity: .7;
  }
  .mainButtons button.playButton {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mainButtons button.playButton img {
    width: 20px;
  }
  .mainButtons button img {
    width: 14px;
    opacity: .4;
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
    margin-left: 10px;
    left: 5%;
    bottom: 15%;
  }
  .remainingTime {
    position: absolute;
    right: 5%;
    bottom: 15%;
  }
</style>
    
