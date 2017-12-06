<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{ status }}</h2>
  </div>
</template>

<script>
// import debug from 'debug';
//
// const log = debug('app:components/Lobby');

export default {
  name: 'Lobby',
  data() {
    return {
      msg: 'Welcome to Connect Four',
    };
  },

  computed: {
    status() {
      return this.isLoading ? 'Loading...' : 'Welcome!';
    },

    isLoading() {
      return !this.lobbyChannel;
    },

    lobbyChannel() {
      return this.$phoenix.channels.lobby;
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
