<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'app',

  created() {
    this.fetchPlayer()
      .then(player => this.connectSocket({ id: player.id }))
      .then(() => this.joinChannel({ name: 'lobby' }));
  },

  methods: {
    connectSocket(params) {
      this.$phoenix.connect('/socket', { params });
    },

    joinChannel(options) {
      this.$phoenix.joinChannel(options);
    },

    ...mapActions([
      'fetchPlayer',
    ]),
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 75px;
}
</style>
