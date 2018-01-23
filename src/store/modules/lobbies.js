import debug from 'debug';
import * as types from '@/store/types';

const log = debug('app:store/modules/lobbies');

const defaultState = {
  hasJoined: false,
};

const getters = {
};

const actions = {
  joinedLobby({ commit }) {
    return commit(types.DID_JOIN_LOBBY);
  },
};

const mutations = {
  [types.DID_JOIN_LOBBY](state) {
    log('hasJoined');
    state.hasJoined = true;
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
