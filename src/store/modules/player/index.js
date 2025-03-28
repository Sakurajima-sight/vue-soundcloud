import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const defaultState = {
  spotifyPlayer: null,
  accessToken: null,
  playerCurrentTime: 0,
  playerDuration: 0,
  playerTracks: [],
  playerCurrentTrack: null,
  isPlay: false,
  currentUrl: localStorage.getItem('currentUrl') || null
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
