<template>
  <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
    <div class="wrapper">
      <!-- 使用专辑的第一张图片作为背景图 --> 
      <div
        :style="{ backgroundImage: `url(${trackData.album.images[0].url})` }"
        :class="`artwork${(currentTrack && (currentTrack.id === trackData.id)) ? ' active' : ''}`"
        @click="onClickTrack(trackData)"
      >
        <div class="playOverlay">
          <img class="playing" src="../assets/playing.gif" v-if="isPlay" />
          <font-awesome-icon :icon="['fas', 'stop-circle']" class="stop" />
          <font-awesome-icon :icon="['fas', 'play-circle']" class="play" />
        </div>
      </div>
      <div class="bottomWrapper">
        <div class="avatarWrapper">
        <!-- 使用艺术家的头像作为图像 -->
          <img class="avatar" :src="artistImage" :alt="trackData.artists[0].name" />
        </div>
        <div class="titleWrappper">
          <!-- 使用歌曲标题，并链接到歌曲的Spotify页面 -->
          <a class="title trackTitle" :href="trackData.external_urls.spotify">{{ trackData.name }}</a>
          <!-- 使用艺术家的名字，并链接到艺术家的Spotify页面 -->
          <router-link class="title username" :to="`/users/${trackData.artists[0].id}`">
            {{trackData.artists[0].name}}
          </router-link>
        </div>
      </div>
    </div>
  </el-col>
</template>


<script>
import { ref, computed, onMounted } from 'vue';  // 引入 Vue 3 中需要的 API
import { useStore } from 'vuex';  // 引入 Vuex 的 useStore
import SpotifyUserClient from '@/utils/SpotifyUserClient';

export default {
  props: {
    trackData: {
      type: Object,
    },
    onClickTrack: {
      type: Function,
    },
    currentTrack: {
      type: Object,
    }
  },
  setup(props) {
    const artistImage = ref('');  // 使用 ref 来创建响应式数据

    // 从 Vuex 获取计算属性
    const store = useStore();
    
    // 使用 onMounted 生命周期钩子
    onMounted(async () => {
      try {
        const artistId = props.trackData.artists[0].id;  // 获取艺术家 ID
        const artistInfo = await SpotifyUserClient.getArtistInfo(artistId);  // 获取艺术家信息
        
        // 返回的 artistInfo 数据结构如下，找到第一个图片并设置为头像
        if (artistInfo.images && artistInfo.images.length > 0) {
          artistImage.value = artistInfo.images[0].url;  // 获取第一张图片作为头像
        } else {
          console.log('No artist images found'); // 如果没有图片则输出提示
        }
      } catch (error) {
        artistImage.value = '';  // 错误时处理，或使用默认头像
        console.log('Error fetching artist info:', error);
      }
    });
    const isPlay = computed(() => store.getters.isPlay);

    return {
      artistImage,
      isPlay
    };
  },
};
</script>

<style scoped>
  .el-col {
    margin: 10px 0; /* 设置列的上下边距 */
  }
  .wrapper {
    background: #fff; /* 设置背景颜色 */
    overflow: hidden;  /* 隐藏溢出的内容 */
    height: 170px; /* 设置容器高度 */
    padding: 8px; /* 设置内边距 */
    box-sizing: border-box; /* 包括边框和内边距 */
    border: 1px solid #e3e3e3; /* 设置边框 */
  }
  .artwork {
    width: 100%; /* 背景图宽度占满容器 */
    height: 100px; /* 背景图高度 */
    background-repeat: no-repeat; /* 不重复背景图 */
    background-size: cover; /* 背景图覆盖容器 */
    background-position: center center; /* 背景图居中 */
    cursor: pointer;
    position: relative;
    background-color: #e1e1e1;  /* 设置专辑封面的背景色 */
  }

  .artwork .playOverlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .8);
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all linear .2s;
  }

  .artwork .playOverlay > img {
    width: 40px;
    margin-top: -30px;
    opacity: 0;
    transition: all linear .2s;
  }

  .artwork .playOverlay > svg {
    font-size: 50px;
    color: #666666;
  }

  .artwork:hover .playOverlay, .artwork.active .playOverlay {
    opacity: 1;
    visibility: visible;
  }

  .artwork:hover .playOverlay > img, .artwork.active .playOverlay > img {
    margin-top: 0;
    opacity: 1;
  }

  .avatarWrapper {
    float: left; /* 向左浮动 */
  }

  .artwork .playOverlay .stop,
  .artwork .playOverlay .play,
  .artwork .playOverlay:hover .playing,
  .artwork.active .playOverlay:hover .play {
    display: none;
  }
  .artwork.active .playOverlay:hover .stop, .artwork .playOverlay:hover .play {
    display: block;
  }
  .bottomWrapper {
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .avatarWrapper .avatar {
    width: 40px; /* 设置头像宽度 */
    height: 40px; /* 设置头像高度 */
    border-radius: 20px; /* 设置圆形头像 */
    margin: 10px 10px 10px 0; /* 设置头像的外边距 */
  }
  .titleWrappper {
    float: left; /* 向左浮动 */
    width: 75%; /* 容器宽度为剩余的 75% */
  }
  .titleWrappper .title {
    text-overflow: ellipsis; /* 超出文本显示省略号 */
    overflow: hidden; /* 隐藏超出部分 */
    white-space: nowrap; /* 不换行 */
    text-align: left; /* 文本左对齐 */
    display: block; /* 使标题变成块级元素 */
  }
  .titleWrappper .title.trackTitle {
    margin: 13px 0 5px; /* 设置歌曲标题的外边距 */
    font-size: 13px; /* 设置歌曲标题的字体大小 */
  }
  .titleWrappper .title.trackTitle:hover {
    color: #777; /* 鼠标悬停时歌曲标题的颜色变化 */
  }
  .titleWrappper .title.username {
    color: #378dc7; /* 设置艺术家名称的颜色 */
    font-size: 12px; /* 设置艺术家名称的字体大小 */
  }
  .titleWrappper .title.username:hover {
    color: #204365; /* 鼠标悬停时艺术家名称的颜色变化 */
  }
</style>
  