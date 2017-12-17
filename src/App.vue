<template>
  <div id="app">
    <router-link to="/">
      <img class="logo" src="./assets/logo.png">
    </router-link>
    <router-view/>
  </div>
</template>

<script>
import debug from 'debug';

const log = debug('app:App');

export default {
  name: 'app',

  created() {
    log('created');
  },

  methods: {
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
  padding: 50px 0;
}

.logo {
  width: 75px;
}

body {
  background-color: azure;
}
</style>
