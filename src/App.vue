<template>
  <div id="app">
    <router-link to="/" class="logo">
      <svg-icon :path="'logo.svg'" class="logo-svg"></svg-icon>
      <h3><span>Connect</span> Four</h3>
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
  color: #254689;
}
.logo h3 {
  color: #254689;
}
.logo h3 span {
  color: #FC7E69;
}
.logo svg path {
  fill: #254689;
}

.logo-svg {
  display: block;
  margin: 0 auto;
  width: 75px;
}

</style>
