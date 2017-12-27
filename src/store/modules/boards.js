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
// const setChecker = (checkers, { row, col, color }) => {
//   return Vue.set(checkers, checkerKey(row, col), { row, col, color });
// };
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
  droppedChecker: undefined,
  rowCount: 6,
  colCount: 7,
  cellSize: 100,
};

const getters = {
  checkerColor: state => (row, col) => getChecker(state.checkers, row, col).color,
  droppedChecker: state => state.droppedChecker,

  checkerX: state => (col) => {
    return (state.cellSize / 2) + (state.cellSize * col);
  },
  checkerY: state => (row) => {
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

    Promise.all([
      dispatch('sendMove', { col, channel }),
      dispatch('fallChecker', { row, col, color }),
    ]);
  },

  fallChecker({ commit, dispatch }, { row, col, color }) {
    commit(types.WILL_GAME_UPDATE);
    commit(types.WILL_FALL_CHECKER, { row, col, color });
    return Promise.resolve(true);
  },

  landChecker({ commit, dispatch, rootState }) {
    commit(types.DID_LAND_CHECKER);
    if (rootState.games.queuedGame) {
      const game = rootState.games.queuedGame;
      commit(types.DEQUEUE_GAME_UPDATE, { game });
      dispatch('updateGame', { game });
    }

    return dispatch('switchTurn');
  },
};

const mutations = {
  [types.WILL_FALL_CHECKER]: (state, { row, col, color }) => {
    log(types.WILL_FALL_CHECKER, { row, col, color });
    Vue.set(state, 'droppedChecker', { row, col, color });
  },

  [types.DID_LAND_CHECKER]: (state) => {
    log(types.DID_LAND_CHECKER);
    Vue.delete(state, 'droppedChecker');
  },

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
