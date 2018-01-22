<template>
  <div class="game">
    <game-board @drop="drop" @land="land"></game-board>
    <score-board />
    <div>Game {{id}}</div>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters } from 'vuex';

import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';

const log = debug('app:components/Game');

export default {
  props: ['id'],

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
      log('id', this.id);
      return this.id;
    },

    ...mapGetters([
      'gameInPlay',
      'hasTurn',
      'playerColor',
    ]),
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    join() {
      const gameId = this.gameId;

      this.joinGame({ gameId })
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
      'joinGame',
    ]),
  },
};
</script>

<style scope>
.game {
  padding: 1em;
}
</style>
