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
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: Lobby,
      children: [
        {
          path: 'games/new',
          name: 'NewGame',
          component: NewGame,
        },
      ],
    },
    {
      path: '/games/:id',
      name: 'Game',
      component: Game,
    },
  ],
});

router.beforeEach((to, from, next) => {
  log('router before each');
  store.dispatch('fetchPlayer').then(next);
});

export default router;
