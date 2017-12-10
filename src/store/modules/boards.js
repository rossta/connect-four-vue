// import debug from 'debug';
// import * as types from '../types';

// const log = debug('app:store/modules/boards');

const cellKey = (row, col) => `${row}${col}`;

const cells = new Map();
cells.set(cellKey(0, 3), 'red');
cells.set(cellKey(0, 4), 'black');

const defaultState = {
  cells,
};

const getters = {
  cell: state => (row, col) => state.cells.get(cellKey(row, col)),
};

const actions = {
};

const mutations = {
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
