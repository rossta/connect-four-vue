<template>
  <div class="game">
    <game-board @drop="drop" @land="land"></game-board>
    <score-board />
    <div>Game {{$route.params.id}}</div>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions } from 'vuex';

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

    channel() {
      return this.$phoenix.channel(`game:${this.gameId}`);
    },
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    join() {
      const gameId = this.gameId;
      const channel = this.channel;

      this.joinGame({ gameId, channel })
        .catch((error) => {
          log('flash message', error);
          this.$router.push('/');
        });
    },

    drop(col) {
      const { channel, playerColor: color } = this;
      this.dropChecker({ col, color, channel });
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
