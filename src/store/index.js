import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';

import players from './modules/players';
import games from './modules/games';
import boards from './modules/boards';
import lobbies from './modules/lobbies';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    players,
    games,
    boards,
    lobbies,
  },
  strict: debug,
});
