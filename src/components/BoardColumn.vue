<template>
  <svg :x="col * cellSize" y="0">
    <g @click="drop(col)" class="column">
      <template v-for="checker in checkers">
        <board-checker
          :key="key(checker)"
          :checker="checker"
          :cellSize="cellSize"
          :rowCount="rowCount"
          :checkerRadius="checkerRadius"
          />
      </template>
      <rect
        :key="col"
        :col="col"
        :width="cellSize"
        :height="boardHeight"
        :fill="color"
        :mask="mask"
        />
    </g>
  </svg>
</template>

<script>
import debug from 'debug';

import BoardChecker from './BoardChecker';

const log = debug('app:components/BoardColumn');

export default {
  props: ['checkers', 'col', 'color', 'cellSize', 'boardHeight', 'checkerRadius', 'rowCount', 'mask'],

  components: {
    BoardChecker,
  },

  computed: {
    // Find the current max occupied row and add 1
    nextOpenRow() {
      return Math.max(...this.checkers.map(c => c.row).concat(-1)) + 1;
    },
  },

  methods: {
    key({ row, col }) {
      return `${row}${col}`;
    },

    drop(col) {
      const row = this.nextOpenRow;

      if (row < this.rowCount) {
        log('dropping', { row, col });
        this.$emit('drop', { row, col });
      } else {
        log('cannot drop', { row, col });
      }
    },
  },
};
</script>

<style scoped>
.column {
  cursor: pointer;
}
</style>
