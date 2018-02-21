import Vue from 'vue';
import debug from 'debug';

import {
  EMPTY,
} from '@/constants';

import * as types from '../types';

const log = debug('app:store/modules/boards');

const checkerKey = (row, col) => `${row}${col}`;
const getChecker = (state, row, col) => {
  return state.checkers[checkerKey(row, col)] || { row, col, color: EMPTY };
};
const setChecker = (state, { row, col, ...attrs }) => {
  Vue.set(state.checkers, checkerKey(row, col), Object.assign({}, { row, col, ...attrs }));
};
const updateChecker = (state, { row, col, ...attrs }) => {
  const checker = getChecker(state, row, col);
  setChecker(state, Object.assign({}, checker, { row, col, ...attrs }));
};
const setCheckers = (state, checkers) => {
  Vue.set(state, 'checkers', checkers);
};

const checkers = {};

const defaultState = {
  checkers,
  isLocked: true,
  rowCount: 6,
  colCount: 7,
  cellSize: 100,
};

const getters = {
  getChecker: state => (row, col) => getChecker(state, row, col),
  checkerColor: state => (row, col) => getChecker(state, row, col).color,

  boardWidth: state => state.colCount * state.cellSize,
  boardHeight: state => state.rowCount * state.cellSize,

  centerX: state => (col) => {
    return (state.cellSize / 2) + (state.cellSize * col);
  },
  centerY: state => (row) => {
    return (state.cellSize / 2) + (state.cellSize * (state.rowCount - 1 - row));
  },
  checkerRadius: state => state.cellSize * 0.45,
};

const actions = {
  dropChecker({ commit, dispatch, state }, { gameId, col, color }) {
    commit(types.WILL_UPDATE_GAME);
    commit(types.WILL_UPDATE_BOARD);

    return dispatch('addMove', { gameId, col, color });
  },

  landChecker({ commit, dispatch, getters }) {
    return dispatch('checkForWin').then((winner) => {
      if (!winner) {
        commit(types.DID_LAND_CHECKER);
        commit(types.DID_SWITCH_TURN, { playerId: getters.playerId });
      }
    });
  },
};

const mutations = {
  [types.WILL_UPDATE_BOARD](state) {
    state.isLocked = true;
  },

  [types.WILL_RESET_BOARD](state) {
    setCheckers(state, {});
    state.isLocked = false;
  },

  [types.DID_UPDATE_BOARD]: (state, { board }) => {
    // TODO: consolidate cells/checkers naming for online/offline
    const checkers = board.cells || board.checkers;
    setCheckers(state, checkers);
    state.isLocked = false;
  },

  [types.DID_UPDATE_CHECKER]: (state, { row, col, color }) => {
    setChecker(state, { row, col, color });
  },

  [types.DID_LAND_CHECKER]: (state) => {
    log(types.DID_LAND_CHECKER);
    state.isLocked = false;
  },

  [types.DID_WIN_BOARD](state, { winner }) {
    log(types.DID_WIN_BOARD, 'WINNER!!!', winner);
    state.isLocked = true;
    winner.moves.forEach((checker) => {
      updateChecker(state, { ...checker, ...{ isWinner: true } });
    });
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
