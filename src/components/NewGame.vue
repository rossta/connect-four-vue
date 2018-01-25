<template>
  <div>Loading new game...</div>
</template>

<script>
import debug from 'debug';

const log = debug('app:components/NewGame');

export default {
  created() {
    log('created');
    this.$store.dispatch('createGame')
      .then(({ game }) => {
        log('redirecting to', `/play/games/${game.id}`);
        this.$router.push(`/play/games/${game.id}`);
      })
      .catch(err => log(err));
  },
};
</script>
