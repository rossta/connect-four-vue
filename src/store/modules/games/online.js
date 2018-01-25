import debug from 'debug';

import phoenix from '@/store/phoenix';
import axios from '@/store/axios';
import * as types from '@/store/types';

const log = debug('app:store/modules/games/network');
const gameChannel = gameId => phoenix.channel(`game:${gameId}`);

const defaultState = {};
const getters = {};

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
  playOnline({ commit }) {
    commit(types.WILL_PLAY_ONLINE);
    log('playOnline');
    return Promise.resolve(true);
  },

  createOnlineGame({ commit }) {
    commit(types.WILL_CREATE_GAME);
    commit(types.WILL_RESET_BOARD);

    return createGame().then(({ data }) => {
      return { game: data };
    });
  },

  joinOnlineGame({ commit, dispatch, getters }, { gameId }) {
    const channel = gameChannel(gameId);
    const { playerId } = getters;

    commit(types.WILL_JOIN_GAME, { gameId });

    return new Promise((resolve, reject) => {
      channel.join()
        .receive('ok', game => resolve(game))
        .receive('error', error => reject(error));
    }).then((game) => {
      const updateGame = game => dispatch('updateGame', { game });

      if ([game.red, game.black].some(id => id === playerId)) {
        log('join:success', gameId, game);
        channel.push('game:joined');
      }

      updateGame(game);
      channel.on('game:welcome', updateGame);
      channel.on('game:updated', updateGame);
    }).catch((error) => {
      log('join:error', gameId, error.reason);
      dispatch('leaveNetworkGame', { gameId, channel });
    });
  },

  addOnlineMove({ commit }, { gameId, col }) {
    const channel = gameChannel(gameId);
    const push = channel.push('game:move', { col });
    return Promise.resolve(push);
  },

  checkForOnlineWin({ rootState }) {
    return Promise.resolve(rootState.games.enqueuedWinner);
  },

  leaveNetworkGame({ commit }, { gameId, channel }) {
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

};

const mutations = {
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

