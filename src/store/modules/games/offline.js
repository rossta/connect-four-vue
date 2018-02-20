/* eslint-disable max-len, no-plusplus, consistent-return */
import debug from 'debug';
import * as types from '@/store/types';

import {
  NOT_STARTED,
  IN_PLAY,
  OFFLINE,
  RED,
  EMPTY,
} from '@/constants';

const log = debug('app:store/modules/games/offline');

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
  getWinner: (state, getters) => (color, ...segment) => {
    if (segment.length !== 4) return false;
    const moves = segment.map(([row, col]) => getters.getChecker(row, col));
    if (moves.every(c => c.color === color)) return { color, moves };
    return false;
  },
};

const actions = {
  playOffline({ commit }) {
    commit(types.WILL_PLAY_OFFLINE);
    return Promise.resolve(true);
  },

  createOfflineGame({ commit }) {
    commit(types.WILL_CREATE_GAME);
    commit(types.WILL_RESET_BOARD);

    return Promise.resolve({});
  },

  joinOfflineGame({ dispatch, state, getters }) {
    const updates = { status: IN_PLAY, red: getters.playerId };
    log('updateGame', { game: { ...state, ...updates } });
    dispatch('updateGame', { game: { ...state, ...updates } });
  },

  addOfflineMove({ commit, rootState, getters }, { col, color }) {
    const row = nextOpenRow(rootState.boards.checkers, col);

    commit(types.DID_UPDATE_CHECKER, { row, col, color });
    commit(types.DID_TAKE_TURN, { row, col, color });

    return Promise.resolve(true);
  },

  /* eslint-disable */
  checkForOfflineWin({ getters, rootState, commit }) {
    const { lastMove, getWinner, checkerColor } = getters;
    const start = num => Math.max(num - 3, 0);
    const fin = (num, max) => Math.min(num + 3, max);
    const { rowCount, colCount } = rootState.boards;

    if (!lastMove) return;
    const { row:centerRow, col:centerCol, color } = lastMove;

    let winner;
    for (let row = start(centerRow); row < fin(centerRow, rowCount); row++) {
      if (winner) break;

      for (let col = start(centerCol); col < fin(centerCol, colCount); col++) {
        if (winner) break;
        const segmentColor = checkerColor(row, col);
        if (segmentColor === EMPTY) continue;

        if (col + 3 < colCount) {
          winner = getWinner(segmentColor,
            [row, col], [row, col + 1], [row, col + 2], [row, col + 3]);
          if (winner) break;
        }

        if (row + 3 < rowCount) {
          winner = getWinner(segmentColor,
            [row, col], [row + 1, col], [row + 2, col], [row + 3, col]);
          if (winner) break;

          if (col + 3 < colCount) {
            winner = getWinner(segmentColor,
              [row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]);
            if (winner) break;
          }

          if (col - 3 >= 0) {
            winner = getWinner(segmentColor,
              [row, col], [row + 1, col - 1], [row + 2, col - 2], [row + 3, col - 3]);
            if (winner) break;
          }
        }
      }
    }

    return Promise.resolve(winner);
  },
  /* eslint-enable */
};

const mutations = {
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
