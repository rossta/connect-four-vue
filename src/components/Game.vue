<template>
  <div>
    <h2>Game {{$route.params.id}}</h2>
    <game-board :channel="channel"></game-board>
  </div>
</template>

<script>
import debug from 'debug';

import GameBoard from './GameBoard';

const log = debug('app:components/Game');

export default {
  components: {
    GameBoard,
  },

  data() {
    return {};
  },

  computed: {
    gameId() {
      return this.$route.params.id;
    },

    channel() {
      return this.$phoenix.channel(`game:${this.gameId}`);
    },
  },

  created() {
    log('created');
    this.join();
  },

  methods: {
    join() {
      const gameId = this.gameId;
      const channel = this.channel;

      this.$store.dispatch('joinGame', { gameId, channel })
        .then(() => {
          // this.$store.dispatch('joinedGame', { gameId, channel });
        })
        .catch((error) => {
          log('flash message', error);
          this.$router.push('/');
        });
    },
  },
};
</script>
