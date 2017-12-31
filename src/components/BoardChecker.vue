<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <game-checker
      :domId="`board-checker-${row}-${col}`"
      :cy="centerY"
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
      const fromParams = { y: this.fromY };
      const destParams = {
        y: this.destY,
        ease: Ease,
        onComplete: done,
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
