<template>
  <div>
    <h2>Game {{$route.params.id}}</h2>
    <p>
      <span>your color: {{playerColor}}</span> |
      <span>player turn: {{next}}</span>  |

      <span v-if="gameNotStarted">status: Waiting for more players</span>
      <span v-if="gameInPlay">status: {{ hasTurn ? "Your turn!" : "Wait..." }}</span>

      <template v-if="gameOver">
        <span>status: game over!</span> |
        <span>winner: {{winner}}</span>
      </template>
    </p>
    <a class="btn"></a>
    <game-board :channel="channel"></game-board>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

import GameBoard from './GameBoard';

const log = debug('app:components/Game');

export default {
  components: {
    GameBoard,
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

    ...mapState({
      winner: state => state.games.winner,
      next: state => state.games.next,
    }),

    ...mapGetters([
      'hasTurn',
      'playerColor',
      'gameInPlay',
      'gameNotStarted',
      'gameOver',
    ]),
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
