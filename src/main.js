// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import debug from 'debug';

import App from './App';
import router from './router';
import store from './store';
import $phoenix from './phoenix';

import phoenix from './store/phoenix';

const log = debug('app:main');

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  log('router before each');
  store.dispatch('fetchPlayer')
    .then(({ id }) => phoenix.connect('/socket', { id }))
    .then(next);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  phoenix: $phoenix,
  template: '<App/>',
  components: { App },
});
