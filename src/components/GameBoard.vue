<template>
  <svg :viewBox="`0 0 ${boardWidth} ${boardHeight}`"
    xmlns="http://www.w3.org/2000/svg"
    class="game-board" stroke="none">
    <defs>
      <pattern :id="patternId" patternUnits="userSpaceOnUse" :width="cellSize" :height="cellSize">
        <circle :cx="cellSize / 2" :cy="cellSize / 2" :r="checkerRadius" fill="black"></circle>
      </pattern>
      <mask :id="maskId">
        <rect :width="cellSize" :height="boardHeight" fill="white"></rect>
        <rect :width="cellSize" :height="boardHeight" :fill="pattern"></rect>
      </mask>
    </defs>
    <template v-for="col in cols">
      <board-column
        :key="col"
        :checkers="colCheckers(col)"
        :col="col"
        :color="'cadetblue'"
        :cellSize="cellSize"
        :checkerRadius="checkerRadius"
        :boardHeight="boardHeight"
        :rowCount="rowCount"
        :mask="mask"
        @drop="dropTo"
        />
      </g>
    </template>
  </svg>
</template>

<script>
import Vue from 'vue';
import debug from 'debug';

import BoardColumn from './BoardColumn';

const log = debug('app:components/GameBoard');

const range = num => [...Array(num).keys()];

const key = (row, col) => `${row}${col}`;
const cssUrl = id => `url(#${id})`;

const RED = 'red';
const BLACK = 'black';

export default {
  components: {
    BoardColumn,
  },

  data() {
    return {
      patternId: 'cell-pattern',
      maskId: 'cell-mask',
      rowCount: 6,
      colCount: 7,
      cellSize: 100,
      checkers: {},
      color: RED,
    };
  },

  computed: {
    pattern() { return cssUrl(this.patternId); },
    mask() { return cssUrl(this.maskId); },

    rows() { return range(this.rowCount); },
    cols() { return range(this.colCount); },

    boardWidth() { return this.colCount * this.cellSize; },
    boardHeight() { return this.rowCount * this.cellSize; },
    checkerRadius() { return this.cellSize * 0.45; },
  },

  methods: {
    key,

    colCheckers(col) {
      return Object.values(this.checkers).filter(c => c.col === col);
    },

    toggleColor() {
      if (this.color === RED) {
        this.color = BLACK;
      } else {
        this.color = RED;
      }
    },

    dropTo({ col, row }) {
      const color = this.color;

      log('setting checker', key(row, col), { row, col, color });
      Vue.set(this.checkers, key(row, col), { row, col, color });
      this.toggleColor();
    },
  },
};
</script>

<style scoped>
.game-board {
  border: 5px cadetblue solid;

  width: 630px;
  margin: 0 auto;
}

.column {
  cursor: pointer;
}
</style>
