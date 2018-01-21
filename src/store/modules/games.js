import debug from 'debug';

import {
  AUDIENCE,
  RED,
  BLACK,
  NOT_STARTED,
  IN_PLAY,
  OVER,
} from '@/constants';

import * as types from '../types';

import network from './games/network';

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

const actions = {
  createGame({ dispatch }) {
    return dispatch('createNetworkGame');
  },

  updateGame({ commit }, { game }) {
    const { board } = game;
    commit(types.DID_UPDATE_GAME, { game });
    commit(types.DID_UPDATE_BOARD, { board });

    return Promise.resolve(true);
  },

  addMove({ dispatch }, { gameId, col, color }) {
    return dispatch('addNetworkMove', { gameId, col, color });
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
  modules: {
    network,
  },
};
