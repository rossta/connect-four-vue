<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <game-checker
      :domId="`board-checker-${row}-${col}`"
      :cy="-checkerRadius / 2"
      :cx="cx"
      :r="checkerRadius"
      :color="color"
      ></game-checker>
  </transition>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { TweenLite } from 'gsap';
import CustomEase from '@/../vendor/CustomEase';
import debug from 'debug';

import GameChecker from './GameChecker';

const log = debug('app:components/BoardChecker');

const Ease = CustomEase.create('custom', 'M0,0 C0.14,0 0.421,0.604 0.456,0.726 0.504,0.894 0.514,0.963 0.522,1 0.53,0.985 0.564,0.87 0.61,0.822 0.68,0.748 0.71,0.786 0.724,0.8 0.788,0.864 0.817,0.981 0.824,0.998 0.85,0.938 0.868,0.93 0.894,0.93 0.917,0.93 0.932,0.985 0.946,0.998 0.957,0.994 0.959,0.984 0.974,0.984 0.989,0.984 1,1 1,1');

export default {
  props: ['col', 'row', 'color', 'cx', 'cy', 'r'],

  components: {
    GameChecker,
  },

  computed: {
    fromY() {
      return -this.cellSize * 1.5;
    },

    toY() {
      return this.cy + this.checkerRadius / 2;
    },

    duration() {
      const percentage = (this.rowCount - this.row) / this.rowCount;
      return 0.4 + 0.20 * percentage;
    },

    ...mapState({
      rowCount: state => state.boards.rowCount,
      cellSize: state => state.boards.cellSize,
    }),

    ...mapGetters([
      'checkerRadius',
    ]),
  },

  methods: {
    beforeEnter(e) {
      log('beforeEnter', e.id);
    },

    enter(el, done) {
      log('enter', el.id);

      return TweenLite.fromTo(el, this.duration, {
        y: this.fromY,
      }, {
        y: this.toY,
        ease: Ease,
        onComplete: done,
      });
    },

    leave(el, done) {
      log('leave', el.id);
      done();
    },
  },
};
</script>
