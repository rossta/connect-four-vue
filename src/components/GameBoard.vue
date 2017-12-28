<template>
  <svg :viewBox="`0 0 ${boardWidth} ${boardHeight}`" xmlns="http://www.w3.org/2000/svg" class="game-board" stroke="none">
    <defs>
      <pattern id="cell-spaces" x="0" y="0" patternUnits="userSpaceOnUse" :width="cellSize" :height="cellSize">
        <circle :cx="cellSize / 2" :cy="cellSize / 2" :r="checkerRadius" fill="black" ></circle>
      </pattern>
      <mask id="game-wall" x="0" y="0">
        <rect x="0" y="0" :width="boardWidth" :height="boardHeight" fill="white"></rect>
        <rect x="0" y="0" :width="boardWidth" :height="boardHeight" fill="url(#cell-spaces)"></rect>
      </mask>
    </defs>
    <template v-for="col in cols">
      <g @click="drop(col)" class="column">
        <template v-for="row in rows">
          <board-checker
            v-if="checkerColor(row, col)"
            :key="key(row, col)"
            :row="row"
            :col="col"
            :color="checkerColor(row, col)"
            ></board-checker>
        </template>
        <rect
          :key="col"
          :col="col"
          :width="cellSize"
          :height="boardHeight"
          :x="cellSize * col"
          y="0"
          fill="cadetblue"
          mask="url(#game-wall)"
        ></rect>
      </g>
    </template>
  </svg>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

import store from '@/store';
import BoardChecker from './BoardChecker';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

export default {
  props: ['channel'],

  components: {
    BoardChecker,
  },

  data() {
    const { rowCount, colCount } = store.state.boards;
    return {
      rows: range(rowCount).reverse(), // so rows count up
      cols: range(colCount),
    };
  },

  computed: {
    ...mapState({
      isLocked: state => state.boards.isLocked,
      rowCount: state => state.boards.rowCount,
      colCount: state => state.boards.colCount,
      cellSize: state => state.boards.cellSize,
    }),
    ...mapGetters([
      'boardWidth',
      'boardHeight',
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
}

.column {
  cursor: pointer;
}
</style>
