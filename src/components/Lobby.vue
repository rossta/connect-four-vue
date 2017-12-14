<template>
  <div class="lobby">
    <h1>{{ msg }}</h1>
    <h2>{{ status }}</h2>
    <div>
      <router-link to="/games/new">New Game</router-link>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import debug from 'debug';

const log = debug('app:components/Lobby');

export default {
  name: 'Lobby',

  data() {
    return {
      isLoading: false,
      msg: 'Welcome to Connect Four',
    };
  },

  created() {
    log('created');
    this.isLoading = true;
    this.channel.join()
      .receive('ok', () => {
        this.isLoading = false;
      })
      .receive('error', error => log('error', error));
  },

  computed: {
    status() {
      return this.isLoading ? 'Loading...' : 'Welcome!';
    },

    channel() {
      return this.$phoenix.channel('lobby');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
