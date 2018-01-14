import debug from 'debug';

import {
  AUDIENCE,
  RED,
  BLACK,
  NOT_STARTED,
  IN_PLAY,
  OVER,
} from '@/constants';

import axios from '../axios';

import * as types from '../types';

const log = debug('app:store/modules/games');
// const switchColor = color => (color === 'black' ? 'red' : 'black');

const defaultState = {
  red: undefined,
  black: undefined,
  winner: undefined,
  next: undefined,
  status: NOT_STARTED,
  turns: [],
  isCreating: false,
  isLoading: false,
  isJoining: false,
  isWaiting: true,
};

const getters = {
  gameNotStarted: state => state.status === NOT_STARTED,
  gameInPlay: state => state.status === IN_PLAY,
  gameOver: state => state.status === OVER,

  hasTurn: (state, getter) => getter.playerColor === state.next,

  hasTurnRed: state => state.next === RED,
  hasTurnBlack: state => state.next === BLACK,

  playerIsRed: (state, getter) => state.red === getter.playerId,
  playerIsBlack: (state, getter) => state.black === getter.playerId,

  playerColor: (state, getter) => {
    if (getter.playerIsRed) return RED;
    if (getter.playerIsBlack) return BLACK;
    return AUDIENCE;
  },
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

  joinGame({ commit, dispatch, getters }, { gameId, channel }) {
    commit(types.WILL_JOIN_GAME, { gameId });

    return new Promise((resolve, reject) => {
      channel.join()
        .receive('ok', (game) => {
          const { board } = game;

          if (game.red === getters.playerId || game.black === getters.playerId) {
            log('join:success', gameId, game);
            channel.push('game:joined');
          }

          commit(types.DID_UPDATE_GAME, { game });
          commit(types.DID_UPDATE_BOARD, { board });
          resolve(game);
        })
        .receive('error', (error) => {
          log('join:error', gameId, error.reason);
          dispatch('leaveGame', { gameId, channel });
          channel.leave();
          reject(error);
        });

      const updateGame = game => dispatch('updateGame', { game });
      channel.on('game:welcome', updateGame);
      channel.on('game:updated', updateGame);
    });
  },

  updateGame({ commit }, { game }) {
    const { board } = game;
    commit(types.DID_UPDATE_GAME, { game });
    commit(types.DID_UPDATE_BOARD, { board });
    return Promise.resolve(true);
  },

  sendMove({ commit }, { col, channel }) {
    const push = channel.push('game:move', { col });
    return Promise.resolve(push);
  },

  leaveGame({ commit }, { gameId, channel }) {
    return new Promise((resolve, reject) => {
      channel.leave()
        .receive('ok', (response) => {
          log('leave:success', gameId, response);
        })
        .receive('ok', (error) => {
          log('leave:error', gameId, error.reason);
          reject(error);
        });
    });
  },

  switchTurn({ commit }, { color }) {
    commit(types.DID_SWITCH_TURN, { color });
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

  [types.DID_SWITCH_TURN](state, { color }) {
    log(types.DID_SWITCH_TURN, 'next', state.next, 'from', color);
  },

  [types.WILL_UPDATE_GAME](state) {
    state.isWaiting = true;
  },

  [types.DID_UPDATE_GAME](state, { game }) {
    log(types.DID_UPDATE_GAME, { game });
    const { red, black, next, status, winner, turns } = game;
    if (winner) log('WINNER!!!', winner);
    state.isWaiting = false;
    state.red = red;
    state.black = black;
    state.next = next;
    state.status = status.toUpperCase();
    state.winner = winner;
    state.turns = turns;
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
