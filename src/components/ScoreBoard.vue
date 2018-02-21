<template>
  <div class="score-board">
    <div class="player-1 cell">
      <p>
        <span v-bind:style="{ color: redHex }">RED</span><br/>
        <span v-if="playerIsRed">(You)</span>
      </p>
    </div>
    <div class="status cell">
      <p>
        <transition name="slide-fade">
          <span v-if="gameNotStarted">Waiting for more players</span>
          <span v-if="gameInPlay && hasTurn">Your turn!</span>
          <span v-if="gameInPlay && !hasTurn">Waiting for {{next}}</span>
          <span v-if="gameOver">Game over! {{winnerName}} wins!</span>
        </transition>
      </p>
      <a v-if="gameOver" href="#" @click="reset" class="btn">Play again</a>
    </div>
    <div class="player-2 cell">
      <p>
        <span v-bind:style="{ color: blackHex }">BLACK</span><br/>
        <span v-if="playerIsBlack">(You)</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import { HEXES } from '@/constants';

const titleize = text => text[0].toUpperCase() + text.slice(1);

export default {
  methods: {
    reset() {
      this.$emit('reset');
    },
  },
  computed: {
    redHex() {
      return HEXES.red;
    },

    blackHex() {
      return HEXES.black;
    },

    winnerName() {
      return this.winner && titleize(this.winner.color);
    },

    ...mapState({
      cellSize: state => state.boards.cellSize,
      status: state => state.games.status,
      winner: state => state.games.winner,
      next: state => state.games.next,
    }),

    ...mapGetters([
      'boardWidth',
      'hasTurn',
      'playerColor',
      'gameInPlay',
      'gameNotStarted',
      'gameOver',
      'playerIsRed',
      'playerIsBlack',
    ]),
  },
};
</script>

<style scoped>
.score-board {
  width: 80%;
  max-width: 420px;
  display: grid;
  grid-template-columns: [player1] 20% [status] 60% [player2] 20%;
  margin: 0 auto;
  padding: 1em 0;
  font-weight: bold;
}

.score-board .status {
  font-weight: normal;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter {
  transform: translateX(100px);
  opacity: 0;
}
</style>
