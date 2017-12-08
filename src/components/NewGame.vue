<template>
  <div>Loading new game...</div>
</template>

<script>
import debug from 'debug';

const log = debug('app:components/NewGame');

export default {
  beforeCreate() {
    this.$store.dispatch('createGame')
      .then(({ headers }) => {
        log('redirecting to', headers.location);
        this.$router.push(headers.location);
      })
      .catch(err => log(err));
  },
};
</script>
