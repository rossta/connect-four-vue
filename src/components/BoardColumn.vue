<template>
  <rect
    :key="col"
    :col="col"
    :width="cellSize"
    :height="boardHeight"
    :x="cellSize * col"
    :y="0"
    :fill="color"
    :fill-opacity="opacity"
    />
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['col', 'color'],

  data() {
    return {
      opacity: 1.0,
    };
  },

  watch: {
    winnerUpdate() {
      if (this.winner) {
        this.opacity = 0.2;
      } else {
        this.opacity = 1.0;
      }
    },
  },

  computed: {
    winnerUpdate() {
      return !this.isUpdating && this.winner;
    },

    ...mapState({
      cellSize: state => state.boards.cellSize,
      isUpdating: state => state.boards.isUpdating,
      winner: state => state.games.winner,
    }),

    ...mapGetters([
      'boardHeight',
    ]),
  },
};
</script>
