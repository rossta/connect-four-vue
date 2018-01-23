<template>
  <svg :x="col * cellSize" y="0">
    <g @click="drop" class="board-column">
      <board-checker
        v-for="checker in checkers"
        :key="key(checker)"
        :checker="checker"
        :rowCount="rowCount"
        :cellSize="cellSize"
        :radius="checkerRadius"
        :status="status"
        @land="land"
        />
      <rect
        :key="col"
        :col="col"
        :width="cellSize"
        :height="boardHeight"
        :fill="color"
        :fill-opacity="opacity"
        :mask="mask"
        />
    </g>
  </svg>
</template>

<script>
import debug from 'debug';

import { OVER } from '@/constants';

import BoardChecker from './BoardChecker';

const log = debug('app:components/BoardColumn');

export default {
  props: ['checkers', 'col', 'color', 'mask', 'boardHeight', 'checkerRadius', 'rowCount', 'cellSize', 'status'],

  components: {
    BoardChecker,
  },

  created() {
    log('checkers', this.checkers);
  },

  computed: {
    opacity() {
      return (this.status === OVER) ? 0.2 : 1.0;
    },

    nextOpenRow() {
      return Math.max(...this.checkers.map(c => c.row).concat(-1)) + 1;
    },

    canDrop() {
      return this.nextOpenRow < this.rowCount;
    },
  },

  methods: {
    key({ row, col }) {
      return `${row}${col}`;
    },

    drop() {
      if (this.canDrop) {
        this.$emit('drop', this.col);
      } else {
        log('cannot drop', this.col);
      }
    },

    land() {
      this.$emit('land');
    },
  },
};
</script>

<style>
.board-column {
  cursor: pointer;
}
</style>
