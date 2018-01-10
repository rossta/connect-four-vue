<template>
  <div id="app">
    <h3>Connect Four</h3>
    <game-board></game-board>
  </div>
</template>

<script>
import debug from 'debug';

import GameBoard from '@/components/GameBoard';

const log = debug('app:App');

export default {
  name: 'app',

  components: {
    GameBoard,
  },

  created() {
    log('created');
  },
};
</script>

<style>
body {
  background-color: azure;
}

a {
  text-decoration: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 50px 0;
}

.logo {
  display: inline-block;
}
.logo h3 {
  margin: 0;
}

.logo-svg {
  display: block;
  margin: 0 auto;
  width: 75px;
}

</style>
