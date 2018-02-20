<template>
  <div class="game">
    <game-board :status="status" @drop="drop" @land="land"></game-board>
    <score-board @reset="reset" />
    <div v-if="isGameOnline && gameNotStarted">
      Share this page with a friend to play online!
    </div>
    <div v-if="isGameOffline">
      You're currently playing offline.
      <router-link to="/play/games/new">Go online</router-link> to play against friends!
    </div>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

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
      return this.id || 'offline';
    },

    ...mapState({
      status: state => state.games.status,
    }),

    ...mapGetters([
      'gameInPlay',
      'hasTurn',
      'playerColor',
      'isGameOnline',
      'isGameOffline',
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

    reset() {
      const { gameId } = this;
      this.resetGame({ gameId });
    },

    ...mapActions([
      'dropChecker',
      'landChecker',
      'joinGame',
      'resetGame',
    ]),
  },
};
</script>

<style scope>
.game {
  padding: 1em;
}
</style>
