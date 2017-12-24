<template>
  <game-checker
    :id="domId"
    :color="adjustedColor"
    @click="attempt"
    ></game-checker>
</template>

<script>
import debug from 'debug';

import GameChecker from './GameChecker';

const log = debug('app:components/GameCell');

const adjust = {
  red: '#FC7E69',
  black: '#254689',
};

export default {
  props: ['row', 'col', 'color'],

  components: {
    GameChecker,
  },

  updated() {
    log('drawing cell', this.row, this.col, this.color);
  },

  methods: {
    attempt() {
      const col = this.col;
      this.$emit('attempt', { col });
    },
  },

  computed: {
    domId() {
      return `cell-${this.row}-${this.col}`;
    },

    toObject() {
      return { row: this.row, col: this.col, color: this.color };
    },

    adjustedColor() {
      const color = this.color;
      return adjust[color] || color;
    },
  },
};
</script>

<style scoped>
  svg {
    background-color: transparent;
    cursor: pointer;
  }
</style>
