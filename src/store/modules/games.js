import debug from 'debug';

import axios from '../axios';
import * as types from '../types';

const log = debug('app:store/modules/games');

const defaultState = {
  isCreating: false,
  isLoading: false,
  isJoining: false,
  hasTurn: true,
  colorTurn: 'black',
  colorPlayer: undefined,
  rowCount: 6,
  colCount: 7,
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

  joinGame({ commit, dispatch }, { gameId, channel }) {
    commit(types.WILL_JOIN_GAME, { gameId });

    return new Promise((resolve, reject) => {
      channel.join()
        .receive('ok', () => {
          log('join:success', gameId);
          channel.push('game:joined');
          channel.push('game:status');
        })
        .receive('error', (error) => {
          log('join:error', gameId, error.reason);
          dispatch('leaveGame', { gameId, channel });
          channel.leave();
          reject(error);
        });

      channel.on('game:status', (payload) => {
        commit(types.DID_GAME_UPDATE, payload);
        resolve(payload);
      });
    });
  },

  sendMove({ commit }, { col, channel }) {
    channel.push('game:move', { col });
  },

  leaveGame({ commit }, { gameId, channel }) {
    return new Promise((resolve, reject) => {
      channel.leave()
        .receive('ok', (response) => {
          log('leave:success', gameId, response);
          resolve(response);
        })
        .receive('ok', (error) => {
          log('leave:error', gameId, error.reason);
          reject(error);
        });
    });
  },

  switchTurn({ commit }) {
    commit(types.DID_SWITCH_TURN);
    return Promise.resolve(true);
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

  [types.WILL_JOIN_GAME](state) {
    state.isJoining = true;
  },

  [types.DID_JOIN_GAME](state) {
    state.isJoining = false;
  },

  [types.DID_SWITCH_TURN](state) {
    const color = state.colorTurn === 'black'
      ? 'red'
      : 'black';
    state.colorTurn = color;
  },

  [types.DID_GAME_UPDATE](state, payload) {
    log(types.DID_GAME_UPDATE, payload);
    state.colorPlayer = payload.color;
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
