import debug from 'debug';

import axios from '../axios';
import * as types from '../types';

const log = debug('app:store/modules/games');

const defaultState = {
  isCreating: false,
  isLoading: false,
};

const getters = {
};

const createGame = function createGame() {
  return axios.post('/games')
    .then((response) => {
      log('success', response);
      return response;
    })
    .catch((error) => {
      log('fail', error);
    });
};

const actions = {
  createGame({ commit }) {
    commit(types.WILL_CREATE_GAME);

    return createGame().then(({ headers, data }) => {
      const game = data;
      commit(types.DID_CREATE_GAME, { game });
      return { headers, data };
    });
  },

  joinGame({ commit }, { gameId, channel }) {
    log('joinGame', gameId, channel);
  },
};

const mutations = {
  [types.WILL_CREATE_GAME](state) {
    state.isCreating = true;
  },

  [types.DID_CREATE_GAME](state, { player }) {
    state.player = player;
    state.isCreating = false;
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
