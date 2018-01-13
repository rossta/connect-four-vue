<template>
  <svg :viewBox="`0 0 ${boardWidth} ${boardHeight}`" xmlns="http://www.w3.org/2000/svg" class="game-board" stroke="none">
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
        :mask="mask"
        @drop="dropTo"
        />
      </g>
    </template>
  </svg>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

import BoardChecker from './BoardChecker';
import BoardColumn from './BoardColumn';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

const key = (row, col) => `${row}${col}`;
const cssUrl = id => `url(#${id})`;

export default {
  props: ['channel'],

  components: {
    BoardChecker,
    BoardColumn,
  },

  data() {
    return {
      patternId: 'cell-pattern',
      maskId: 'cell-mask',
    };
  },

  computed: {
    pattern() { return cssUrl(this.patternId); },
    mask() { return cssUrl(this.maskId); },

    rows() { return range(this.rowCount); },
    cols() { return range(this.colCount); },

    ...mapState({
      checkers: state => state.boards.checkers,
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
    key,

    colCheckers(col) {
      return Object.values(this.checkers).filter(c => c.col === col);
    },

    dropTo(col) {
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
