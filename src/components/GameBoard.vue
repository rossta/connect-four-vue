<template>
  <div class="game-board">
    <game-checker
      :id="'falling-checker'"
      ></game-checker>
    <template v-for="row in rows">
      <template v-for="col in cols">
        <div class="cell">
          <game-cell
            :key="key(row, col)"
            v-on:attempt="attempt"
            :row="row"
            :col="col"
            :color="cell(row, col) || 'transparent'"
            >
          </game-cell>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import debug from 'debug';
import { mapActions, mapGetters, mapState } from 'vuex';

import store from '@/store';
import GameCell from './GameCell';
import GameChecker from './GameChecker';

const log = debug('app:components/GameBoard');
const range = num => [...Array(num).keys()];

export default {
  props: ['channel'],

  components: {
    GameCell,
    GameChecker,
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
      'color',
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

      const color = this.color;
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
    background-color: cadetblue;

    width: 420px;
    height: 360px;
    margin: 0 auto;

    display: grid;
    grid-template: repeat(6, 1fr) / repeat(7, 1fr);
  }

  .cell {
    line-height: 0;
    cursor: pointer;
  }

  #falling-checker {
    position: absolute;
    z-index: -1;
  }
</style>
