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
// const clearCell = (cells, key) => {
//   const checker = cells[key];
//   delete checker.color;
//   return Vue.set(cells, key, checker);
// };
const setCell = (cells, { row, col, color }) => {
  return Vue.set(cells, cellKey(row, col), { row, col, color });
};
const getCell = (cells, row, col) => {
  return cells[cellKey(row, col)] || {};
};

const setCells = (state, cells) => {
  // const nextCheckers = new Set(Object.keys(newCells));
  // const prevCheckers = new Set(Object.keys(cells));
  // const oldCheckers = new Set([...prevCheckers].filter(c => !nextCheckers.has(c)));
  // const newCheckers = new Set([...nextCheckers].filter(c => !prevCheckers.has(c)));

  // oldCheckers.forEach(k => clearCell(cells, k));
  // newCheckers.forEach(k => setCell(cells, newCells[k]));
  Vue.set(state, 'cells', cells);
};

const cells = {};
// setCell(cells, { row: 0, col: 3, color: 'red' });
// setCell(cells, { row: 0, col: 4, color: 'black' });

const defaultState = {
  cells,
  droppedChecker: undefined,
};

const getters = {
  cell: state => (row, col) => getCell(state.cells, row, col).color,
};

const actions = {
  dropChecker: ({ commit, dispatch, state, rootState }, { col, color, channel }) => {
    if (!rootState.games.hasTurn) {
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

  fallChecker: ({ commit }, { col, color }) => {
    commit(types.WILL_FALL_CHECKER, { col, color });
    Promise.resolve(true);
  },

  landChecker: ({ commit }, cell) => {
    commit(types.DID_LAND_CHECKER, cell);
    Promise.resolve(true);
  },
};

const mutations = {
  [types.WILL_FALL_CHECKER]: (state, { col, color }) => {
    log(types.WILL_FALL_CHECKER, { col, color });
    state.droppedChecker = { col, color };
  },
  [types.DID_LAND_CHECKER]: (state, checker) => {
    log(types.DID_LAND_CHECKER, checker);
    setCell(state.cells, checker);
  },
  [types.DID_BOARD_UPDATE]: (state, board) => {
    setCells(state, board.cells);
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
