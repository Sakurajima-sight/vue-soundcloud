export default {
    // 设置搜索加载状态为 true，表示正在进行搜索请求
    SEARCH_TRACKS: (state) => {
      state.searchTracksLoading = true;
    },
  
    // 成功获取搜索结果，更新搜索状态
    SEARCH_TRACKS_SUCCESS: (state, data) => {
      state.searchTracksLoading = false;  // 停止加载状态
      // 根据当前页数来拼接搜索结果，避免重复数据
      state.searchResults = data.page > 1
        ? [...state.searchResults, ...data.searchResults]
        : data.searchResults;
  
      // 更新最后一次搜索的页码和查询条件
      state.lastSearchPage = data.page;
      state.searchQuery = data.query;
    },
  
    // 搜索失败时，更新失败状态
    SEARCH_TRACKS_FAIL: (state, data) => {
      state.searchTracksLoading = false;  // 停止加载状态
      state.searchTracksFail = data;  // 将错误信息存储到 state 中
    },
  
    // 清除搜索状态，恢复初始值
    CLEAR_SEARCH: (state) => {
      state.searchTracksLoading = false;  // 停止加载状态
      state.searchTracksFail = null;  // 清除失败信息
      state.searchResults = [];  // 清空搜索结果
      state.searchQuery = null;  // 清空搜索查询
      state.lastSearchPage = null;  // 清空页码
    },
  };
  