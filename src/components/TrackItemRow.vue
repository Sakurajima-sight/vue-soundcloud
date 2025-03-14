<template>
  <el-col :xl="24"  class="itemWrapper">
    <div
      :style="{ backgroundImage: `url(${trackData.album_image})` }"
      class="artwork"
      v-if="!spotifyPlayer"
    >
      <div
        :class="`playOverlay${(!isPlay && playerCurrentTrack && playerCurrentTrack.id === trackData.id) ? ' active' : ''}`" 
        @click="authorize"
      >
        <font-awesome-icon :icon="['fas', 'play']" />
      </div>
    </div>
    <div
      :style="{ backgroundImage: `url(${trackData.album_image})` }"
      class="artwork"
      v-if="spotifyPlayer"
    >
      <div
        :class="`playOverlay${(!isPlay && playerCurrentTrack && playerCurrentTrack.id === trackData.id) ? ' active' : ''}`" 
        @click="onPlayTrack(trackData)"
      >
        <font-awesome-icon :icon="['fas', 'play']" />
      </div>
      <div
        class="pauseOverlay active"
        v-if="isPlay && playerCurrentTrack && playerCurrentTrack.id === trackData.id"
        @click="onPlayTrack(trackData)"
      >
        <font-awesome-icon :icon="['fas', 'stop']" />
      </div>
    </div>
    <div class="detailsWrapper">
      <div class="avatarWrapper">
        <router-link class="title" :to="`/tracks/${trackData.id}`" @click="handleClickTrack()">
          {{trackData.name}}
        </router-link>
        <router-link :to="`/users/${trackData.artists[0].id}`">
          <img class="avatar" :src="trackData.artist_image" alt="Artist Image" />
        </router-link>
      </div>
      <div class="userWrapper">
        <div class="otherDetails">
          <span><font-awesome-icon :icon="['fas', 'play']" /> {{ numberSeparator(trackData.playcount ?? 0) }}</span>
          <span><font-awesome-icon :icon="['fas', 'clock']" /> {{ Math.floor((trackData.duration_ms ?? 0) / 60000) }}:{{ Math.floor(((trackData.duration_ms ?? 0) % 60000) / 1000).toString().padStart(2, '0') }}</span>
          <span class="albumName"><font-awesome-icon :icon="['fas', 'compact-disc']" /> {{ trackData.album.name ?? 'Unknown Album' }}</span>
        </div>
      </div>
    </div>
    <div class="waveformWrapper">
      <span class="chartlist-count-bar">
        <span class="chartlist-count-bar-link">
          <span :data-max-stat-value=trackData.max_listeners :data-stat-value=trackData.listeners class="chartlist-count-bar-slug" :style="{ width: ((trackData.listeners / trackData.max_listeners) * 100) + '%' }"></span>
          <span class="chartlist-count-bar-value"> {{ numberSeparator(trackData.listeners) }} 
            <span class="stat-name" v-if="itemKey === 0"> Listeners </span>
          </span>
        </span>
      </span>
    </div>
  </el-col>
</template>

<script>
import { useStore } from 'vuex';
import { computed,  } from 'vue';
import { numberSeparator } from '@/utils/number';
import SpotifyUserClient from '@/utils/SpotifyUserClient';

export default {
  props: {
    itemKey: {
      type: Number,
    }, 
    trackData: {
      type: Object,
    },
    onPlayTrack: {
      type: Function,
    },
  },

  setup() {
    const store = useStore();  // 使用 Vuex 的 useStore hook
    const spotifyPlayer = computed(() => store.getters.spotifyPlayer);
    const isPlay = computed(() => store.getters.isPlay);
    const playerCurrentTrack = computed(() => store.getters.playerCurrentTrack);

    const handleClickTrack = () => { 
      store.dispatch('setPlayerTracks', []);
      store.dispatch('setPlayerCurrentTrack', null);
    }

    const authorize = () => {
      let currentUrl = window.location.href;
      store.dispatch("setCurrentUrl", currentUrl);
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SpotifyUserClient.clientId}&response_type=code&redirect_uri=${encodeURIComponent(SpotifyUserClient.redirectUri)}&scope=${encodeURIComponent(SpotifyUserClient.scope)}`;
      console.log('Spotify Authorization URL:', authUrl);
      window.location.href = authUrl;  // 重定向到 Spotify 授权页面
    };

    return {
      spotifyPlayer,
      playerCurrentTrack,
      isPlay,
      numberSeparator,
      handleClickTrack,
      authorize
    }
  },
};
</script>

<style scoped>
  .itemWrapper {
    background: #fff;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: 7.5px;
    padding-right: 7.5px;
    display: flex;
    align-items: center;
    height: 80px;
    position: relative;
    border-color: #e0e0e0;
    border-width: 0 1px 1px 1px;
    border-style: solid;
  }
  .artwork {
    width: 60px;
    height: 60px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    background-color: #e1e1e1;
    float: left;
    cursor: pointer;
  }
  .artwork > .playOverlay, .artwork > .pauseOverlay {
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .6);
  }
  .artwork > .playOverlay > svg, .artwork > .pauseOverlay > svg {
    color: #fff;
    font-size: 20px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .artwork:hover > .playOverlay,
  .artwork > .playOverlay.active,
  .artwork > .pauseOverlay.active {
    display: block;
  }
  .artwork > .playOverlay.palying {
    display: none !important;
  }
  .detailsWrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: flex-start;
    justify-content: center;
    position: relative;
  }
  .userWrapper {
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 13px;
  }
  .avatarWrapper {
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    margin-top: -5px;
  }
  .avatar {
    width: 25px;
    height: 25px;
    border-radius: 20px;
    margin: 0 10px 0 10px;
    margin-top: -5px;
  }
  .title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    display: block;
    margin: 0 0 6px 20px;
    font-size: 15px;
    max-width: 400px; /* 设置最大宽度，超出会被截断 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
  }
  .title:hover {
    color: #505155;
  }
  .username {
    color: #909297;
    font-size: 16px;
  }
  .username:hover {
    color: #6c6d71;
  }
  .otherDetails {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
  }
  .otherDetails > span {
    margin: 0 8px;
    font-size: 12px;
    color: #909297;
  }
  .otherDetails > span > svg {
    color: #b6b9bf;
    margin-right: 3px;
  }
  .albumName {
    display: block; /* 必须设置为块级元素 */
    max-width: 250px; /* 设置最大宽度，超出会被截断 */
    overflow: hidden; /* 超出容器的部分隐藏 */
    white-space: nowrap; /* 防止文本换行 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
  }
  .waveformWrapper {
    width: 350px;
    height: 50%;
    position: absolute;
    right: 15px;
    top: 25%;
    background: #fff;
    cursor: pointer;
  }
  .chartlist-bar {
    height: 100%;
    width: 350px;
  }
  .chartlist-count-bar {
    display: block;
    top: 0px;
    font-size: 15px;
    line-height: 31px;
    position: relative;
    text-align: left;
  }
  .chartlist-count-bar-link {
    color: inherit;
    display: inline-block;
    max-width: 100%;
    padding: 3px 5px;
    vertical-align: bottom;
  }
  .chartlist-count-bar-slug {
    background-color: #fae3e2;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
  }
  .chartlist-count-bar-value {
    display: block;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
</style>
