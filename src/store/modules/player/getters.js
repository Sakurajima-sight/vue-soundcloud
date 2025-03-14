export default {
  spotifyPlayer: (state) => state.spotifyPlayer,
  accessToken: (state) => state.accessToken,
  playerCurrentTime: state => state.playerCurrentTime,
  playerDuration: state => state.playerDuration,
  playerTracks: state => state.playerTracks,
  playerCurrentTrack: state => state.playerCurrentTrack,
  isPlay: (state) => state.isPlay,
  currentUrl: (state) => state.currentUrl
};
