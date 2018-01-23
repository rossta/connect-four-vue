<template>
  <div class="lobby">
    <h1>{{ msg }}</h1>
    <div v-if="isLoading">
      <p>{{ status }}</p>
    </div>
    <div v-else>
      <p><router-link class="btn" to="/play/games/new">Play online</router-link></p>
      <p><router-link class="btn" to="/play/offline">Play offline</router-link></p>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import debug from 'debug';
import { mapState, mapActions } from 'vuex';
import phoenix from '@/store/phoenix';

const log = debug('app:components/Lobby');

export default {
  name: 'Lobby',

  data() {
    return {
      isLoading: false,
      msg: 'Welcome!',
    };
  },

  created() {
    log('created');
    if (!this.hasJoined) {
      log('joining...');
      this.join();
    }
  },

  computed: {
    status() {
      return this.isLoading ? 'Loading...' : 'Ready to play?';
    },

    channel() {
      return phoenix.channel('lobby');
    },

    ...mapState({
      hasJoined: state => state.lobbies.hasJoined,
    }),
  },

  methods: {
    join() {
      this.isLoading = true;
      return this.channel.join()
        .receive('ok', () => {
          this.isLoading = false;
          this.joinedLobby();
        })
        .receive('error', error => log('error', error));
    },

    ...mapActions([
      'joinedLobby',
    ]),
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

  a.btn {
    color: white;
    font-weight: bold;
    display: inline-block;
    padding: 1em 3em;
    border: 1px #CCC solid;
    background: cadetblue;
  }
</style>
