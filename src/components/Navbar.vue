<template>
  <el-row type="flex" class="navbarWrapper" justify="center">
    <el-col :span="20">
      <el-menu
        mode="horizontal"
        background-color="#3a3f41"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="navbar"
      >
        <img src="../assets/logo.png" class="navbarLogo" />
        <el-input
          size="default"
          placeholder="search music..."
          :prefix-icon="searchIcon"
          class="searchInput"
          v-model:modelValue="searchText"
          
        >
        </el-input>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
// 使用 Vue 3 中的 setup API
import { ref } from 'vue';
// 导入搜索图标
import { Search } from '@element-plus/icons-vue';

export default {
  setup() {
    // 定义响应式数据
    const searchText = ref(''); // 用于存储搜索框的输入内容
    const searchIcon = Search; // 将图标作为非响应式数据返回

    return {
      searchText, // 返回绑定的值
      searchIcon, // 返回图标
    };
  },
};
</script>

<style>
  .navbarWrapper {
    background: #3a3f41;
  }
  .navbarWrapper .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbarWrapper .navbarLogo {
    width: 170px;
    margin: 0 20px;
  }
  .navbarWrapper .searchInput {
    width: 280px;
    margin: 13px 0;
  }
  .navbarWrapper .searchInput .el-input__inner {
    background: #2b2b2b;
    border: none;
    outline: none;
    color: #fff;
  }
  .navbarWrapper .searchInput .el-input__prefix {
    background: #2b2b2b;
    border: none;
    outline: none;
    color: #fff;
  }
  .navbarWrapper .searchInput .el-input__wrapper {
    background: #2b2b2b;
    border: none;
    outline: none;
    box-shadow: none;
    color: #fff;
  }  


</style>
