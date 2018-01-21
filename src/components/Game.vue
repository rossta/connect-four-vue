<template>
  <div class="game">
    <game-board @drop="drop" @land="land"></game-board>
    <score-board />
    <div>Game {{$route.params.id}}</div>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters } from 'vuex';

import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';

const log = debug('app:components/Game');

export default {
  components: {
    GameBoard,
    ScoreBoard,
  },

  data() {
    return {};
  },

  created() {
    log('created');
    this.join();
  },

  watch: {
    $route: 'join',
  },

  computed: {
    gameId() {
      return this.$route.params.id;
    },

    ...mapGetters([
      'gameInPlay',
      'hasTurn',
    ]),
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    join() {
      const gameId = this.gameId;

      this.joinNetworkGame({ gameId })
        .catch((error) => {
          log('flash message', error);
          this.$router.push('/');
        });
    },

    drop(col) {
      const { gameId, playerColor: color } = this;

      if (!this.gameInPlay) {
        log('game is not in play');
        return;
      }

      if (!this.hasTurn) {
        log('not your turn');
        return;
      }

      this.dropChecker({ gameId, col, color });
    },

    land() {
      this.landChecker();
    },

    ...mapActions([
      'dropChecker',
      'landChecker',
      'joinNetworkGame',
    ]),
  },
};
</script>

<style scope>
.game {
  padding: 1em;
}
</style>
