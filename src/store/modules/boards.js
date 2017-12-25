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
const setChecker = (checkers, { row, col, color }) => {
  return Vue.set(checkers, checkerKey(row, col), { row, col, color });
};
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
};

const getters = {
  checkerColor: state => (row, col) => getChecker(state.checkers, row, col).color,
};

const actions = {
  dropChecker: ({ commit, dispatch, state, getters, rootState }, { col, color, channel }) => {
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
  [types.WILL_FALL_CHECKER]: (state, { col, color }) => {
    log(types.WILL_FALL_CHECKER, { col, color });
    state.droppedChecker = { col, color };
  },
  [types.DID_LAND_CHECKER]: (state, { checker }) => {
    log(types.DID_LAND_CHECKER, checker);
    setChecker(state.checkers, checker);
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
