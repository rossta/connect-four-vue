<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <circle
      id="`board-checker-${row}-${col}`"
      :cx="centerX"
      :cy="centerY"
      :r="checkerRadius"
      :fill="adjustedColor"
      />
  </transition>
</template>

<script>
import { TweenLite } from 'gsap';
import debug from 'debug';

import Ease from './utils/Ease';

const log = debug('app:components/BoardChecker');

export default {
  props: ['row', 'col', 'color', 'cellSize', 'rowCount', 'checkerRadius'],

  data() {
    return {
      colorHexes: {
        red: '#FC7E69',
        black: '#254689',
      },
    };
  },

  computed: {
    adjustedColor() {
      return this.colorHexes[this.color];
    },

    centerX() {
      return (this.cellSize / 2) + (this.cellSize * this.col);
    },

    centerY() {
      return (this.cellSize / 2) + (this.cellSize * (this.rowCount - 1 - this.row));
    },

    fromY() {
      return -1 * (this.centerY + this.cellSize);
    },

    destY() {
      return 0;
    },

    percentage() {
      return (this.rowCount - this.row) / this.rowCount;
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
        ease: Ease,
        onComplete: () => {
          done();
        },
      };

      return TweenLite.fromTo(el, this.duration, fromParams, destParams);
    },

    leave(el, done) {
      log('leave', el.id);
      done();
    },
  },
};
</script>
