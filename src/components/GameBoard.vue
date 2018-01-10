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
            :cellSize="cellSize"
            :rowCount="rowCount"
            :checkerRadius="checkerRadius"
            />
        </template>
        <board-column
          :key="col"
          :col="col"
          :color="'cadetblue'"
          :boardHeight="boardHeight"
          :cellSize="cellSize"
          mask="url(#game-wall)"
          />
      </g>
    </template>
  </svg>
</template>

<script>
import debug from 'debug';

import BoardChecker from './BoardChecker';
import BoardColumn from './BoardColumn';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

export default {
  props: [],

  components: {
    BoardChecker,
    BoardColumn,
  },

  data() {
    return {
      rowCount: 6,
      colCount: 7,
      cellSize: 100,
      checkers: {},
    };
  },

  computed: {
    rows() {
      return range(this.rowCount);
    },

    cols() {
      return range(this.colCount);
    },

    boardWidth() {
      return this.colCount * this.cellSize;
    },

    boardHeight() {
      return this.rowCount * this.cellSize;
    },

    checkerRadius() {
      return this.cellSize * 0.45;
    },
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    getChecker(row, col) {
      return this.checkers[`${row}${col}`] || {};
    },

    checkerColor(row, col) {
      return this.getChecker(row, col).color;
    },

    drop(col) {
      log('drop in column', col);
    },
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
