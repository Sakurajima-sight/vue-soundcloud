<template>
  <el-card shadow="never" class="userCommentCard">
    <div class="upper-section">
      <div class="left-side">
        <router-link :to="`/users/${trackData.artists[0].id}`" class="router-link">
          <!-- 歌手名字 -->
          <div class="artist-name">{{ trackData.artists[0].name }}</div>
        </router-link>
        <!-- 歌曲名称 -->
        <div class="track-name">{{ trackData.name }}</div>
        <!-- Play Track 按钮和数量 -->
        <div class="play-btn-container">
          <el-button class="play-btn" @click="onClickTrack(trackData)">
            <font-awesome-icon :icon="['fas', 'play']" />
            <span class="play-text">Play Track</span>
          </el-button>
          <div class="track-stat">
            <div class="listeners">
              <div class="label">Listeners</div>
              <div class="icon-and-count">
                <div class="icon">
                  <font-awesome-icon :icon="['fas', 'headphones']" />
                </div>
                <div class="count">{{ numberSeparator(trackData.listeners) }}</div>
              </div>
            </div>
          </div>
          <div class="track-stat">
            <div class="scrobbles">
              <div class="label">Playcount</div>
              <div class="icon-and-count">
                <div class="icon">
                  <font-awesome-icon :icon="['fas', 'music']" />
                </div>
                <div class="count">{{ numberSeparator(trackData.playcount) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 插入图片部分 -->
    <div class="image-section">
      <img :src="trackData.album_image" alt="Track Image" />
    </div>
    <div class="lower-section">
      <div class="left-side">
        <div class="track-info">
          <!-- 第一个模块：简介部分，左对齐 -->
          <div class="description-text">{{ cleanedText }}</div>


          <!-- 第二个模块：Length 和 Popular 放在同一行，右对齐 -->
          <div class="details">
            <div class="detail-item">
              <div class="whiteLabel">Length: </div>
              <div class="icon-and-value">
                <font-awesome-icon :icon="['fas', 'clock']" class="icon" />
              </div>
              <div class="value">{{ Math.floor((trackData.duration_ms ?? 0) / 60000) }}:{{ Math.floor(((trackData.duration_ms ?? 0) % 60000) / 1000).toString().padStart(2, '0') }}</div>


            </div>
            <div class="detail-item">
              <div class="whiteLabel">Popular: </div>
              <div class="icon-and-value">
                <font-awesome-icon :icon="['fas', 'fire']" class="icon" />
              </div>
              <div class="value" width="40px">{{ trackData.popularity }}</div>
            </div>
          </div>
        </div>
        <div v-if="urls[0]" class="read-more-container">
          <a :href="urls[0]" class="read-more" target="_blank">Read more</a>
        </div>

        <!-- 标签部分 -->
        <div class="tags">
          <el-tag
            v-for="(tag, index) in trackData.tag"
            :key="index"
            class="tag"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>


<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { numberSeparator } from '@/utils/number';

export default {
  props: {
    trackData: {
      type: Object,
    },
    activeTrack: {
      type: Object,
    },
    onClickTrack: {
      type: Function,
    },
    isPlay: {
      type: Boolean,
    },
    handlePlayPause: {
      type: Function,
    },  
  },
  setup(props) {
    const store = useStore();
    const activeTrack = computed(() => store.getters.activeTrack);
    
    // Step 1: 提取所有的URL
    const urlRegex = /<a href="(.*?)">.*?<\/a>/g;
    let urls = [];
    let match;
    
    // 提取URL并保存到urls数组
    while ((match = urlRegex.exec(props.trackData.summary)) !== null) {
      urls.push(match[1]);  // match[1] 是捕获的 URL
    }

    // Step 2: 清洗文本，去掉<a>标签
    const cleanedText = props.trackData.summary.replace(urlRegex, '');
    
    return {
      activeTrack,
      numberSeparator,
      urls,
      cleanedText
    };
  },
};
</script>

<style scoped>
.userCommentCard {
  width: 1050px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative; 
}

.upper-section {
  display: flex;
  height: 50%;
  background-color: #ff66b2; /* 粉红色背景 */
  padding: 20px;
  color: #fff;
  align-items: center;
  justify-content: space-between;
}

.left-side {
  width: 70%;
}

.artist-name {
  font-size: 18px;
  font-weight: bold;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  display: block;  /* 设置为块级元素 */
  text-align: left;  /* 确保文本左对齐 */
}

.track-name {
  font-size: 30px;
  margin-bottom: 15px;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  display: block;  /* 设置为块级元素 */
  text-align: left;  /* 确保文本左对齐 */
  white-space: nowrap;  /* 防止换行 */
  width: 600px;
  overflow: hidden;  /* 超出部分隐藏 */
  text-overflow: ellipsis;  /* 超出部分显示省略号 */
}

.play-btn-container {
  display: flex;
  align-items: center;
}

.play-btn {
  background-color: #ff3399;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-right: 100px;
  display: flex;
  align-items: center;
}

.play-btn:hover {
  background-color: #e60073;
}


.play font-awesome-icon {
  margin-right: 5px;
}


.track-info {
  display: flex;
  align-items: center;
}

.track-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 100px; /* 可以调整右边的间距 */
}

.scrobbles
.listeners {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
}

.label {
  font-size: 13px;
  font-weight: bold;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  padding-left: 25px;
  color: #555;
  margin-bottom: 5px; /* 给文字和图标之间留点空间 */
  display: flex;
  align-items: flex-start;
}

.icon-and-count {
  display: flex;
  width: 100%; /* 让符号和数字各自占一半宽度 */
  justify-content: space-between; /* 符号左对齐，数字右对齐 */
  align-items: center; /* 垂直居中 */
}

.icon {
  display: flex;
  align-items: flex-start; /* 确保图标垂直居中 */
  width: 16px;
  padding-right: 5px;
}

.count {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: right; /* 使数字右对齐 */
  padding-top: 4px;
  padding-left: 2px;
}

.lower-section {
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}

.description-text {
  padding-top: 10px;
  font-size: 13px;
  font-weight: bold;
  width: 370px;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  color: #666;
  line-height: 1.5;
  /* 使用CSS的line-clamp来限制显示的行数 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 4; /* 设置为3行 */
  line-clamp: 4;
  text-align: left;
}

.read-more-container {
  display: flex;
  justify-content: space-between; /* 分隔左右对齐 */
  align-items: center; /* 垂直居中对齐 */
  width: 100%;
}

.read-more {
  font-size: 12px;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  color: #005399;
  padding-bottom: 5px;
  text-align: left;
}

.details {
  padding-left: 20px;
  padding-top: 20px;
}


.detail-item {
  display: flex;  /* 使用flex布局 */
  align-items: center;  /* 垂直居中对齐 */
  margin-bottom: 15px;  /* 给每行之间添加间隔 */
  padding-top: 10px;
}

.whiteLabel {
  width: 55px;
  font-size: 13px;
  font-weight: bold;
  font-family: "Roboto Condensed", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  color: #555;
  padding-left: 20px;
  display: flex;
  align-items: flex-start;
}

.icon-and-value {
  display: flex;  /* 使用flex布局将图标和数值并排 */
  align-items: flex-end; 
  padding-left: 10px;
  width: 26px;
  display: flex;
}

.value {
  font-size: 16px;
  padding-left: -10px;
  color: #333;
  width: 30px;
  display: flex;
  align-items: flex-start; /* 左对齐 */
}

.tags {
  display: flex;
  gap: 10px;  /* 标签之间的间隔 */
  flex-wrap: wrap;  /* 如果标签超过容器宽度，自动换行 */
}

.tag {
  margin-top: 5px;
}

.image-section {
  position: absolute;
  top: 15%;
  left: 65%;
  width: 250px;  /* 控制图片的大小 */
  height: 250px; 
  border-radius: 10px;
}
.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 保持图片比例填充容器 */
}

.play-btn .play-text {
  margin-left: 10px; /* 右移10px */
}

.router-link {
  color: white;
  text-decoration: none; /* 去掉下划线（可选） */
}

</style>
