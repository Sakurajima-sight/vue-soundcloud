export default {
  SET_SPOTIFY_PLAYER: (state, player) => {
    state.spotifyPlayer = player;
  },
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token;
  },
  SET_PLAYER_CURRENT_TIME: (state, time) => {
    state.playerCurrentTime = time;
  },
  SET_PLAYER_DURATION: (state, time) => {
    state.playerDuration = time;
  },
  SET_PLAYER_TRACKS: (state, tracks) => {
    state.playerTracks = tracks;
  },
  SET_PLAYER_CURRENT_TRACK: (state, track) => {
    state.playerCurrentTrack = track;
  },
  IS_PLAYER_PLAY: (state, isPlay) => {
    state.isPlay = isPlay;
  }
};
