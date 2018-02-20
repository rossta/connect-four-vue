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
export const min = num => Math.max(num - 3, 0);
export const max = (num, max) => Math.min(num + 3, max);

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
};

const getters = {
  getWinner: (state, getters) => (...segment) => {
    if (segment.length !== 4) return false;
    const moves = segment.map(([row, col]) => getters.getChecker(row, col));
    const [{ color }] = moves;
    return (color !== EMPTY) &&
      moves.every(c => c.color === color) && { color, moves };
  },

  checkHorizontalSegments: (state, getters) => ({ focalRow, minCol, maxCol }) => {
    let winner;
    for (let row = focalRow, col = minCol; col <= maxCol; col++) {
      winner = getters.getWinner(
        [row, col], [row, col + 1], [row, col + 2], [row, col + 3]);
      if (winner) return winner;
    }
  },
  checkVerticalSegments: (state, getters) => ({ focalRow, focalCol, minRow }) => {
    let winner;
    for (let col = focalCol, row = minRow; row <= focalRow; row++) {
      winner = getters.getWinner(
       [row, col], [row + 1, col], [row + 2, col], [row + 3, col]);
      if (winner) return winner;
    }
  },
  checkForwardSlashSegments: (state, getters) => ({ focalRow, focalCol, minRow, minCol, maxRow, maxCol }) => {
    const startForwardSlash = (row, col) => {
      while (row > minRow && col > minCol) { row--; col--; }
      return [row, col];
    };
    let winner;
    for (let [row, col] = startForwardSlash(focalRow, focalCol);
      row <= maxRow && col <= maxCol; row++, col++) {
      winner = getters.getWinner(
        [row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]);
      if (winner) return winner;
    }
  },
  checkBackwardSlashSegments: (state, getters) => ({ focalRow, focalCol, minRow, minCol, maxRow, maxCol }) => {
    const startBackwardSlash = (row, col) => {
      while (row < maxRow && col > minCol) { row++; col--; }
      return [row, col];
    };
    let winner;
    for (let [row, col] = startBackwardSlash(focalRow, focalCol);
      row >= minRow && col <= maxCol; row--, col++) {
      winner = getters.getWinner(
        [row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]);
      if (winner) return winner;
    }
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

  checkForOfflineWin({ getters, rootState }) {
    const { lastMove } = getters;
    if (!lastMove) return;
    const { rowCount, colCount } = rootState.boards;
    const { row: focalRow, col: focalCol } = lastMove;
    const minCol = min(focalCol);
    const maxCol = max(focalCol, colCount - 1);
    const minRow = min(focalRow);
    const maxRow = max(focalRow, rowCount - 1);
    const coords = { focalRow, focalCol, minRow, minCol, maxRow, maxCol };
    const winner = getters.checkHorizontalSegments(coords) ||
      getters.checkVerticalSegments(coords) ||
      getters.checkForwardSlashSegments(coords) ||
      getters.checkBackwardSlashSegments(coords);

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
