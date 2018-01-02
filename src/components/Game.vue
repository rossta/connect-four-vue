<template>
  <div>
    <a class="btn"></a>
    <game-board :channel="channel"></game-board>
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

    ...mapActions([
      'joinGame',
    ]),
  },
};
</script>
