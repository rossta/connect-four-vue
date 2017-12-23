import debug from 'debug';

import axios from '../axios';
import * as types from '../types';

const log = debug('app:store/modules/games');

const AUDIENCE = 'audience';
const RED = 'red';
const BLACK = 'black';
const NOT_STARTED = 'NOT_STARTED';
const IN_PLAY = 'IN_PLAY';
const OVER = 'OVER';

const switchColor = color => (color === 'black' ? 'red' : 'black');

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
  rowCount: 6,
  colCount: 7,
};

const getters = {
  gameNotStarted: state => state.status === NOT_STARTED,
  gameInPlay: state => state.status === IN_PLAY,
  gameOver: state => state.status === OVER,

  hasTurn: (state, getter) => getter.color === state.next,

  color: (state, getter) => {
    const { red, black } = state;
    if (getter.playerId === red) return RED;
    if (getter.playerId === black) return BLACK;
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

          if (game.red === getters.playerId || game.black == getters.playerId) {
            log('join:success', gameId, game);
            channel.push('game:joined');
          }

          commit(types.DID_GAME_UPDATE, { game });
          commit(types.DID_BOARD_UPDATE, { board });
          resolve(game);
        })
        .receive('error', (error) => {
          log('join:error', gameId, error.reason);
          dispatch('leaveGame', { gameId, channel });
          channel.leave();
          reject(error);
        });

      const updateGame = (game) => {
        const { board } = game;
        commit(types.DID_GAME_UPDATE, { game });
        commit(types.DID_BOARD_UPDATE, { board });
      };

      channel.on('game:welcome', updateGame);
      channel.on('game:updated', updateGame);
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
    state.next = switchColor(state.next);
  },

  [types.WILL_GAME_UPDATE](state) {
    state.isWaiting = true;
  },

  [types.DID_GAME_UPDATE](state, { game }) {
    log(types.DID_GAME_UPDATE, { game });
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
