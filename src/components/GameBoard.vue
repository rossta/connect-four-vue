<template>
  <div class="game-board">
    <template v-for="row in rows">
      <template v-for="col in cols">
        <div class="cell" :key="key(row, col)">
          <game-cell
            v-on:attempt="attempt"
            :row="row"
            :col="col"
            :color="cell(row, col) || 'azure'"
            >
          </game-cell>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import debug from 'debug';
import { mapGetters, mapState } from 'vuex';

import store from '@/store';
import GameCell from './GameCell';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

export default {
  components: {
    GameCell,
  },

  data() {
    const { rowCount, colCount } = store.state.games;
    return {
      rows: range(rowCount).reverse(), // so rows count up
      cols: range(colCount),
    };
  },

  computed: {
    ...mapState({
      isLocked: state => state.boards.isLocked,
    }),
    ...mapGetters([
      'cell',
    ]),
  },

  methods: {
    key(row, col) {
      return `${row}${col}`;
    },

    attempt({ col }) {
      if (this.isLocked) {
        log('board locked');
        return;
      }

      this.$emit('attempt', { col });
    },
  },
};
</script>

<style scoped>
  .game-board {
    border: 5px cadetblue solid;

    width: 525px;
    height: 450px;
    margin: 0 auto;

    display: grid;
    grid-template: repeat(6, 1fr) / repeat(7, 1fr);
  }

  .cell {
    line-height: 0;
    cursor: pointer;
  }
</style>
