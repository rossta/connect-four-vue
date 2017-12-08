<template>
  <div>
    <h2>Game {{$route.params.id}}</h2>
    <GameBoard></GameBoard>
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
  },

  created() {
    log('created');
    const gameId = this.gameId;
    const channel = this.$phoenix.channel(`game:${this.gameId}`);
    channel.join()
      .receive('ok', (response) => {
        log(`join:success ${name}`, response);
      })
      .receive('error', (error) => {
        log('join:error', error.reason);
        this.$router.push('/');
      });

    this.$store.dispatch('joinGame', { gameId, channel });
  },
};
</script>
