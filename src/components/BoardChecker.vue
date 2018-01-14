<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <circle
      :cx="centerX"
      :cy="centerY"
      :r="radius"
      :fill="adjustedColor"
      :fill-opacity="opacity"
      />
  </transition>
</template>

<script>
import { TweenMax, Bounce } from 'gsap';
import debug from 'debug';

import { HEXES, OVER } from '@/constants';

const log = debug('app:components/BoardChecker');

export default {
  props: ['checker', 'rowCount', 'cellSize', 'radius', 'status'],

  computed: {
    row() { return this.checker.row; },
    col() { return this.checker.col; },
    color() { return this.checker.color; },
    isWinner() { return this.checker.isWinner; },

    opacity() {
      return (this.status === OVER && !this.isWinner) ? 0.2 : 1.0;
    },

    adjustedColor() {
      const color = this.color;
      return HEXES[color] || color;
    },

    centerX() {
      return (this.cellSize / 2);
    },

    centerY() {
      const { cellSize, rowCount, row } = this;
      return (cellSize / 2) + (cellSize * (rowCount - 1 - row));
    },

    fromY() {
      return -1 * (this.centerY + this.cellSize);
    },

    destY() {
      return 0;
    },

    percentage() {
      const { rowCount, row } = this;
      return (rowCount - row) / rowCount;
    },

    duration() {
      return 0.2 + 0.4 * this.percentage;
    },
  },

  methods: {
    beforeEnter(e) {
      log('beforeEnter', e.id);
    },

    enter(el, done) {
      log('enter', el.id);
      const fromParams = { y: this.fromY };
      const destParams = {
        y: this.destY,
        ease: Bounce.easeOut,
        onComplete: () => {
          this.$store.dispatch('landChecker');
          done();
        },
      };

      return TweenMax.fromTo(el, this.duration, fromParams, destParams);
    },

    leave(el, done) {
      log('leave', el.id);
      done();
    },
  },
};
</script>
