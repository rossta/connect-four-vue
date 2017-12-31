<template>
  <p>
    <span>your color: {{playerColor}}</span> |
    <span>player turn: {{next}}</span>  |

    <span v-if="gameNotStarted">status: Waiting for more players</span>
    <span v-if="gameInPlay">status: {{ hasTurn ? "Your turn!" : "Wait..." }}</span>

    <template v-if="gameOver">
      <span>status: game over!</span> |
      <span>winner: {{winner}}</span>
    </template>
  </p>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      winner: state => state.games.winner,
      next: state => state.games.next,
    }),

    ...mapGetters([
      'hasTurn',
      'playerColor',
      'gameInPlay',
      'gameNotStarted',
      'gameOver',
    ]),
  },
};
</script>
