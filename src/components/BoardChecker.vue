<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <game-checker
      :domId="`board-checker-${row}-${col}`"
      :cy="-checkerRadius / 2"
      :cx="centerX"
      :color="color"
      ></game-checker>
  </transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { TweenLite } from 'gsap';
import debug from 'debug';

import GameChecker from './GameChecker';
import Ease from './utils/Ease';

const log = debug('app:components/BoardChecker');

export default {
  props: ['col', 'row', 'color'],

  components: {
    GameChecker,
  },

  computed: {
    centerX() {
      return this.$store.getters.centerX(this.col);
    },

    centerY() {
      return this.$store.getters.centerY(this.row);
    },

    fromY() {
      return -this.cellSize * 1.5;
    },

    toY() {
      return this.centerY + this.checkerRadius / 2;
    },

    duration() {
      const percentage = (this.rowCount - this.row) / this.rowCount;
      return 0.2 + 0.4 * percentage;
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

      return TweenLite.fromTo(
        el,
        this.duration, {
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
