<template>
  <div>
    <h2>Game {{$route.params.id}}</h2>
    <p>
      your color: {{color}}  | player turn: {{turn}}  | {{ hasTurn ? 'Your turn!' : 'Waiting...' }}
    </p>
    <a class="btn"></a>
    <game-board
      v-on:attempt="attempt"
      ></game-board>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters } from 'vuex';

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

    ...mapGetters([
      'hasTurn',
      'turn',
      'color',
    ]),
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    attempt({ col }) {
      log('attempt turn', { col });

      const color = this.color;
      this.dropChecker({ col, color, channel: this.channel });
    },

    join() {
      const gameId = this.gameId;
      const channel = this.channel;

      this.joinGame({ gameId, channel })
        .then(() => {
          // this.$store.dispatch('joinedGame', { gameId, channel });
        })
        .catch((error) => {
          log('flash message', error);
          this.$router.push('/');
        });
    },

    ...mapActions([
      'dropChecker',
      'joinGame',
    ]),
  },
};
</script>
