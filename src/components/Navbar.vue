<template>
  <!-- 布局容器，居中显示 -->
  <el-row type="flex" class="navbarWrapper" justify="center">
    <el-col
      :xs="24" :sm="22" :md="20" :lg="18" :xl="16"
      class="wrapper"
    >
      <!-- 水平菜单 -->
      <el-menu
        mode="horizontal"
        background-color="#3a3f41"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="navbar"
        :collapse="false"
      >
        <!-- 菜单项，显示 logo -->
        <el-menu-item>
          <img src="../assets/logo.png" class="logo" />
        </el-menu-item>
        <!-- 搜索框 -->
        <div class="searchContainer">
          <el-input
            size="default"
            placeholder="search music..."
            :prefix-icon="searchIcon"
            class="searchInput"
            v-model:modelValue="searchText"
          >
          </el-input>
        </div>
      </el-menu>
    </el-col>
    
  </el-row>
</template>

<script>
import { ref } from 'vue';  // 引入 ref 用于响应式数据
import { Search } from '@element-plus/icons-vue';  // 引入搜索图标

export default {
  setup() {
    const searchText = ref('');  // 定义搜索文本
    const searchIcon = Search;  // 设置搜索图标

    return {
      searchText,
      searchIcon,
    };
  },
};
</script>

<style scoped>
  .wrapper {
    margin: 0 auto;
    float: none;
  }
  .el-row {
    background: #3a3f41;  /* 设置背景颜色 */
    padding: 0 17px;
  }
  .el-menu {
    border: none;  /* 去除边框 */
    display: flex;  /* 使用 Flexbox 布局 */
    align-items: center;  /* 垂直居中 */
    justify-content: space-between;  /* 均匀分布 */
  }
  .el-menu.navbar {
    border-bottom: #3a3f41;  /* 设置底部边框颜色 */
  }
  .logo {
    width: 170px;
    margin-right: 20px;  /* logo 和搜索框的间距 */
  }
  .searchInput {
    width: 280px;
    margin: 13px 0;
  }
  .searchInput .el-input__inner {
    background: #2b2b2b;  /* 背景色 */
    border: none;  /* 去除边框 */
    outline: none;  /* 去除外边框 */
    color: #fff;  /* 文字颜色 */
  }
</style>
