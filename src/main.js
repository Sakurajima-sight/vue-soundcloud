// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {
    ElRow,
    ElButton,
    ElLoading,
    ElMessageBox,
    ElNotification,
    ElMessage,
} from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

// 创建 Vue 应用实例
const app = createApp(App)

// 使用 Element Plus 组件
app.use(ElButton)
app.use(ElRow)
app.use(router)
app.use(ElLoading.directive)
// 设置全局属性
app.config.globalProperties.$loading = ElLoading.service;
app.config.globalProperties.$msgbox = ElMessageBox;
app.config.globalProperties.$alert = ElMessageBox.alert;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$prompt = ElMessageBox.prompt;
app.config.globalProperties.$notify = ElNotification;
app.config.globalProperties.$message = ElMessage;
app.mount('#app')
