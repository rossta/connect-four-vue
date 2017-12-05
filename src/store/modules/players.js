import debug from 'debug';
import axios from 'axios';

import * as types from '@/store/types';

const log = debug('app:store/modules/players');

const defaultState = {
  id: null,
  isLoading: false,
};

const getters = {
  id: state => state.id,
};

const fetchPlayer = function fetchPlayer() {
  const player = window.localStorage.player;
  if (player) Promise.resolve(JSON.parse(player));

  return axios.post(`${process.env.API_URL}/players`)
    .then(({ data }) => {
      log('success', data);
      window.localStorage.player = JSON.stringify(data);
      return data;
    })
    .catch((error) => {
      log('fail', error);
    });
};

const actions = {
  fetchPlayer({ commit }) {
    commit(types.IS_FETCHING_PLAYER);

    return fetchPlayer().then((player) => {
      commit(types.DID_FETCH_PLAYER, { player });
      return player;
    });
  },
};

const mutations = {
  [types.IS_FETCHING_PLAYER](state) {
    state.isLoading = true;
  },

  [types.DID_FETCH_PLAYER](state, { player }) {
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
