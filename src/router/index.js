import Vue from 'vue';
import Router from 'vue-router';
import debug from 'debug';

import Lobby from '@/components/Lobby';
import NewGame from '@/components/NewGame';
import Game from '@/components/Game';

import store from '@/store';

const log = debug('app:router');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: Lobby,
      children: [
        {
          path: 'play/games/new',
          name: 'NewGame',
          component: NewGame,
        },
      ],
    },
    {
      path: '/play/games/:id',
      name: 'OnlineGame',
      component: Game,
      props: true,
    },
    {
      path: '/play/offline',
      name: 'OfflineGame',
      component: Game,
      beforeEnter(to, from, next) {
        return store.dispatch('playOffline').then(next);
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  log('router before each');
  return store.dispatch('fetchPlayer').then(next);
});

export default router;
