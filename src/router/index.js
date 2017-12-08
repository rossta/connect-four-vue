import Vue from 'vue';
import Router from 'vue-router';
import Lobby from '@/components/Lobby';
import NewGame from '@/components/NewGame';
import Game from '@/components/Game';

Vue.use(Router);

export default new Router({
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
