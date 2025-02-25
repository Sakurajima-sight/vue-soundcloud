export default {
  // 获取当前搜索请求是否处于加载状态
  searchTracksLoading: (state) => state.searchTracksLoading, 

  // 获取当前的搜索结果，从 Spotify API 返回的歌曲数据
  searchResults: (state) => state.searchResults, 

  // 获取搜索请求是否失败的状态，请求失败时为 true
  searchTracksFail: (state) => state.searchTracksFail, 

  // 获取最后一次搜索的页码，便于分页控制
  lastSearchPage: (state) => state.lastSearchPage, 

  // 获取当前的搜索关键词，便于在 UI 中显示或用于进一步的搜索
  searchQuery: (state) => state.searchQuery, 
};
