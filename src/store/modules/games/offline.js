import debug from 'debug';
import * as types from '@/store/types';

import {
  NOT_STARTED,
  IN_PLAY,
  OFFLINE,
  RED,
  BLACK,
} from '@/constants';

const log = debug('app:store/modules/games/offline');

const switchColor = color => (color === BLACK ? RED : BLACK);

const nextOpenRow = (checkers, col) => {
  const stack = Object.values(checkers).filter(c => c.col === col);
  return Math.max(...stack.map(c => c.row).concat(-1)) + 1;
};

const defaultState = {
  mode: OFFLINE,
  red: 'PLAYER_1',
  black: 'PLAYER_2',
  winner: undefined,
  next: RED,
  status: NOT_STARTED,
  turns: [],
  isCreating: false,
  isLoading: false,
  isJoining: false,
  isWaiting: true,

  board: {
    cells: {},
  },
};

const getters = {
};

const actions = {
  playOffline({ commit }) {
    commit(types.WILL_PLAY_OFFLINE);
    return Promise.resolve(true);
  },

  createOfflineGame({ commit }) {
    commit(types.WILL_CREATE_GAME);
    commit(types.WILL_RESET_BOARD);
    commit(types.DID_CREATE_GAME, {});
  },

  joinOfflineGame({ dispatch, state, getters }) {
    const updates = { status: IN_PLAY, red: getters.playerId };
    log('updateGame', { game: { ...state, ...updates } });
    dispatch('updateGame', { game: { ...state, ...updates } });
  },

  addOfflineMove({ commit, rootState, getters }, { col, color }) {
    const row = nextOpenRow(rootState.boards.checkers, col);

    commit(types.DID_UPDATE_CHECKER, { row, col, color });
    commit(types.DID_SWITCH_TURN, { color: switchColor(color), playerId: getters.playerId });
    return Promise.resolve(true);
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
