import debug from 'debug';

import axios from '../axios';
import * as types from '../types';

const log = debug('app:store/modules/players');

const localPlayer = {
  encode(player) {
    if (!player) { return; }
    window.localStorage.player = JSON.stringify(player);
  },

  decode() {
    const { player } = window.localStorage;
    return player && JSON.parse(player);
  },
};

const fetchPlayer = function fetchPlayer() {
  const player = localPlayer.decode();
  if (player) return Promise.resolve(player);

  return axios.post('/players')
    .then(({ data }) => {
      log('success', data);
      localPlayer.encode(data);
      return data;
    })
    .catch(error => log('fail', error));
};

const defaultState = {
  id: null,
  isLoading: false,
};

const getters = {
  id: state => state.id,
};

const actions = {
  fetchPlayer({ commit, state }) {
    if (state.player) Promise.resolve(state.player);

    commit(types.WILL_FETCH_PLAYER);

    return fetchPlayer()
      .then((player) => {
        log('player info', player);
        commit(types.DID_FETCH_PLAYER, { player });
        return player;
      });
  },
};

const mutations = {
  [types.WILL_FETCH_PLAYER](state) {
    log(types.WILL_FETCH_PLAYER);
    state.isLoading = true;
  },

  [types.DID_FETCH_PLAYER](state, { player }) {
    log(types.DID_FETCH_PLAYER);
    state.player = player;
    state.isLoading = false;
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
