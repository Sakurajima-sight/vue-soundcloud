<template>
  <el-row type="flex" class="navbarWrapper" justify="center">
    <el-col
      :xs="24"
      :sm="22"
      :md="20"
      :lg="18"
      :xl="16"
      class="wrapper"
    >
      <el-menu
        mode="horizontal"
        background-color="#3a3f41"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="navbar"
        :collapse="false"
      >
        <el-menu-item>
          <img src="../assets/logo.png" class="logo" />
        </el-menu-item>
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
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

export default {
  setup() {
    const searchText = ref('');
    const searchIcon = Search;
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
    background: #3a3f41;
    padding: 0 17px;
  }
  .el-menu {
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-menu.navbar {
    border-bottom: #3a3f41;  /* 设置底部边框颜色 */
  }
  .logo {
    width: 170px;
    margin-right: 20px;
  }
  .searchInput {
    width: 280px;
    margin: 13px 0;
  }
  .searchInput .el-input__inner {
    background: #2b2b2b;
    border: none;
    outline: none;
    color: #fff;
  }
</style>
