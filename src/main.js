import { createApp } from 'vue';
import App from './App.vue';
import {
  ElRow,
  ElButton,
  ElLoading,
  ElMessageBox,
  ElNotification,
  ElMessage,
  ElInput,
  ElCol,
  ElMenu,
  ElIcon,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElButtonGroup,
  ElMenuItem,
  ElSlider,
  ElCard,
} from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式
import store from './store';
import router from './router';
// 引入 FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faFire, faHashtag, faClock, faUsers, faCoffee, faStopCircle, faPlayCircle, faMapMarkerAlt, faGlobe, faCompactDisc, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 创建 Vue 应用实例
const app = createApp(App);

// 将图标添加到库中
library.add(faPlay, faCompactDisc, faFire, faHashtag, faClock, faUsers, faCoffee, faStopCircle, faPlayCircle, faMapMarkerAlt, faGlobe, faStop);

// 全局注册 FontAwesomeIcon 组件
app.component('font-awesome-icon', FontAwesomeIcon);

// 注册 Element Plus 组件和服务
app
  .use(ElButton)
  .use(ElRow)
  .use(ElInput)
  .use(ElCol)
  .use(ElMenu)
  .use(store)
  .use(router)
  .use(ElIcon)
  .use(ElContainer)
  .use(ElHeader)
  .use(ElFooter)  
  .use(ElMain)
  .use(ElLoading)
  .use(ElButtonGroup)
  .use(ElMenuItem)
  .use(ElSlider)
  .use(ElCard);

// 设置全局属性
app.config.globalProperties.$loading = ElLoading.service;
app.config.globalProperties.$msgbox = ElMessageBox;
app.config.globalProperties.$alert = ElMessageBox.alert;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$prompt = ElMessageBox.prompt;
app.config.globalProperties.$notify = ElNotification;
app.config.globalProperties.$message = ElMessage;

app.mount('#app');
