import Vue from 'vue';
import debug from 'debug';
import * as types from '../types';

const log = debug('app:store/modules/boards');

const openRow = (checkers, givenCol) => {
  const rows = Object.values(checkers)
    .filter(({ col }) => col === givenCol)
    .map(({ row }) => row);
  const top = Math.max(-1, ...rows);
  return top + 1;
};

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
  isUpdating: true,
  rowCount: 6,
  colCount: 7,
  cellSize: 100,
  colorHexes: {
    red: '#FC7E69',
    black: '#254689',
  },
};

const getters = {
  checkerColor: state => (row, col) => getChecker(state.checkers, row, col).color,

  colorHex: state => color => state.colorHexes[color] || color,
  redHex: state => state.colorHexes.red,
  blackHex: state => state.colorHexes.black,

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
  dropChecker({ commit, dispatch, state, getters, rootState }, { col, color, channel }) {
    log('status', rootState.games.status, 'gameInPlay', getters.gameInPlay);
    if (!getters.gameInPlay) {
      log('game is not in play');
      return;
    }
    if (!getters.hasTurn) {
      log('not your turn');
      return;
    }
    const row = openRow(state.checkers, col);
    if (row > rootState.games.rowCount) {
      log('row full');
      return;
    }

    commit(types.WILL_GAME_UPDATE);
    commit(types.WILL_BOARD_UPDATE);

    Promise.all([
      dispatch('sendMove', { col, color, channel }),
      dispatch('switchTurn', { color }),
    ]);
  },
};

const mutations = {
  [types.WILL_BOARD_UPDATE](state) {
    state.isLocked = true;
  },

  [types.DID_BOARD_UPDATE]: (state, { board }) => {
    state.isLocked = false;
    setCheckers(state, board.cells);
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
