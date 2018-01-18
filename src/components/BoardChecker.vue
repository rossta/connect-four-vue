<template>
  <transition
    name="drop"
    @enter="enter"
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

  data() {
    return {
      minDuration: 0.2,
      coefficient: 0.4,
    };
  },

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
  },

  methods: {
    duration() {
      const { minDuration, coefficient, rowCount, row } = this;
      const percentage = (rowCount - row) / rowCount;
      return minDuration + coefficient * percentage;
    },

    enter(el, done) {
      log('enter', el.id);

      const fromY = -1 * (this.centerY + this.cellSize);
      const destY = 0;

      const fromParams = {
        y: fromY,
      };
      const destParams = {
        y: destY,
        ease: Bounce.easeOut,
        onComplete: () => {
          this.$emit('land');
          done();
        },
      };

      return TweenMax.fromTo(el, this.duration(), fromParams, destParams);
    },
  },
};
</script>
