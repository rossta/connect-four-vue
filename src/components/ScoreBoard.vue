<template>
  <div
    class="score-board"
    v-bind:style="{ width: boardWidth + 'px' }">
    <div class="player-1 cell">
      You: {{playerColor}}
    </div>
    <div class="status cell">
      <span v-if="gameNotStarted">Waiting for more players</span>
      <span v-if="gameInPlay">{{ hasTurn ? "Your turn!" : `Wait for ${next}` }}</span>
      <span v-if="gameOver">Game over! {{winner}} wins</span>
    </div>
    <div class="player-2 cell">
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      winner: state => state.games.winner,
      next: state => state.games.next,
      boardWidth: state => state.boards.boardWidth,
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

<style>
.score-board {
  display: grid;
  grid-template: repeat(1, 1fr) / repeat(3, 1fr);
}
</style>
