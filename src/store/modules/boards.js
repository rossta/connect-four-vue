import Vue from 'vue';
import debug from 'debug';
import * as types from '../types';

const log = debug('app:store/modules/boards');

const openRow = (cells, givenCol) => {
  const rows = Object.values(cells)
    .filter(({ col }) => col === givenCol)
    .map(({ row }) => row);
  const top = Math.max(-1, ...rows);
  return top + 1;
};

const cellKey = (row, col) => `${row}${col}`;
const setCell = (cells, { row, col, color }) => {
  return Vue.set(cells, cellKey(row, col), { row, col, color });
};
const getCell = (cells, row, col) => {
  return cells[cellKey(row, col)] || {};
};
const setCells = (state, cells) => {
  Vue.set(state, 'cells', cells);
};

const cells = {};

const defaultState = {
  cells,
  isLocked: true,
  droppedChecker: undefined,
};

const getters = {
  cell: state => (row, col) => getCell(state.cells, row, col).color,
};

const actions = {
  dropChecker: ({ commit, dispatch, state, getters, rootState }, { col, color, channel }) => {
    if (!getters.hasTurn) {
      log('not your turn');
      return;
    }
    const row = openRow(state.cells, col);
    if (row > rootState.games.rowCount) {
      log('row full');
      return;
    }

    Promise.all([
      dispatch('sendMove', { col, channel }),
      dispatch('fallChecker', { col, color })
      .then(() => dispatch('landChecker', { row, col, color })),
    ]).then(dispatch('switchTurn'));
  },

  fallChecker: ({ commit, dispatch }, { col, color }) => {
    commit(types.WILL_GAME_UPDATE);
    commit(types.WILL_FALL_CHECKER, { col, color });
    Promise.resolve(true);
  },

  landChecker: ({ commit }, checker) => {
    commit(types.DID_LAND_CHECKER, { checker });
    Promise.resolve(true);
  },
};

const mutations = {
  [types.WILL_BOARD_UPDATE](state) {
    state.isLocked = true;
  },
  [types.WILL_FALL_CHECKER]: (state, { col, color }) => {
    log(types.WILL_FALL_CHECKER, { col, color });
    state.droppedChecker = { col, color };
  },
  [types.DID_LAND_CHECKER]: (state, { checker }) => {
    log(types.DID_LAND_CHECKER, checker);
    setCell(state.cells, checker);
  },
  [types.DID_BOARD_UPDATE]: (state, { board }) => {
    state.isLocked = false;
    setCells(state, board.cells);
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
