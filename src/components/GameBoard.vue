<template>
  <svg viewBox="0 0 700 600" xmlns="http://www.w3.org/2000/svg" class="game-board">
    <template v-for="col in cols">
      <g @click="drop(col)" class="column">
        <rect
          fill="cadetblue"
          :key="col"
          :col="col"
          :x="size * col"
          :y="0"
          :width="size"
          :height="size * rows.length">
        </rect>
        <template v-for="row in rows">
          <game-checker
            :key="key(row, col)"
            :domId="`checker-${row}-${col}`"
            :color="checkerColor(row, col) || 'azure'"
            :cx="checkerX(col)"
            :cy="checkerY(row)"
            :r="checkerRadius"
            ></game-checker>
        </template>
      </g>
    </template>
    <dropped-checker :checker="droppedChecker"></dropped-checker>
  </svg>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

import store from '@/store';
import GameChecker from './GameChecker';
import DroppedChecker from './DroppedChecker';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

export default {
  props: ['channel'],

  components: {
    GameChecker,
    DroppedChecker,
  },

  data() {
    const { rowCount, colCount, cellSize } = store.state.boards;
    return {
      rows: range(rowCount).reverse(), // so rows count up
      cols: range(colCount),
      size: cellSize,
    };
  },

  computed: {
    ...mapState({
      isLocked: state => state.boards.isLocked,
    }),
    ...mapGetters([
      'droppedChecker',
      'checkerColor',
      'checkerRadius',
      'playerColor',
    ]),
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    drop(col) {
      log('drop in column', col);

      if (this.isLocked) {
        log('board locked');
        return;
      }

      const color = this.playerColor;
      this.dropChecker({ col, color, channel: this.channel });
    },

    checkerX(col) {
      return this.$store.getters.checkerX(col);
    },

    checkerY(row) {
      return this.$store.getters.checkerY(row);
    },

    ...mapActions([
      'dropChecker',
    ]),
  },
};
</script>

<style scoped>
.game-board {
  border: 5px cadetblue solid;

  width: 420px;
  height: 360px;
  margin: 0 auto;

  display: grid;
  grid-template: repeat(6, 1fr) / repeat(7, 1fr);
}

.column {
  cursor: pointer;
}
</style>
