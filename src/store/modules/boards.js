import Vue from 'vue';
import debug from 'debug';
import * as types from '../types';

const log = debug('app:store/modules/boards');

const checkerKey = (row, col) => `${row}${col}`;
const getChecker = (checkers, row, col) => {
  return checkers[checkerKey(row, col)] || {};
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
  checkerColor: state => (row, col) => getChecker(state.checkers, row, col).color,

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

    Promise.all([
      dispatch('sendMove', { gameId, col, color }),
      dispatch('switchTurn', { color }),
    ]);
  },

  landChecker({ commit }) {
    commit(types.DID_LAND_CHECKER);
  },
};

const mutations = {
  [types.WILL_UPDATE_BOARD](state) {
    state.isLocked = true;
  },

  [types.DID_UPDATE_BOARD]: (state, { board }) => {
    setCheckers(state, board.cells);
    state.isLocked = false;
  },

  [types.DID_LAND_CHECKER]: () => {
    log('mutation', types.DID_LAND_CHECKER);
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
