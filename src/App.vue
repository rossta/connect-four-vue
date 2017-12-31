<template>
  <div id="app">
    <router-link to="/">
      <svg-icon :path="'logo.svg'" class="logo"></svg-icon>
    </router-link>
    <router-view/>
  </div>
</template>

<script>
import debug from 'debug';

import SvgIcon from '@/components/SvgIcon';

const log = debug('app:App');

export default {
  name: 'app',

  components: {
    SvgIcon,
  },

  created() {
    log('created');
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
  display: block;
  margin: 0 auto;
  width: 75px;
}

body {
  background-color: azure;
}
</style>
