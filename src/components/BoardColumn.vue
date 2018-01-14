<template>
  <svg :x="col * cellSize" y="0">
    <g @click="drop(col)" class="column">
      <template v-for="checker in checkers">
        <board-checker
          :key="key(checker)"
          :checker="checker"
          :rowCount="rowCount"
          :cellSize="cellSize"
          :radius="checkerRadius"
          :status="status"
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
  },

  methods: {
    key({ row, col }) {
      return `${row}${col}`;
    },

    drop(col) {
      this.$emit('drop', col);

      // const row = this.nextOpenRow;
      //
      // if (row < this.rowCount) {
      //   this.$emit('drop', { row, col });
      // } else {
      //   console.log('cannot drop', { row, col });
      // }
    },
  },
};
</script>
