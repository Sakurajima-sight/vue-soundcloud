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
  isPlay: false
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
