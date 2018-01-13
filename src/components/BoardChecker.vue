<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false">
    <circle
      :cx="centerX"
      :cy="centerY"
      :r="checkerRadius"
      :fill="adjustedColor"
      :fill-opacity="opacity" />
  </transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { TweenMax, Bounce } from 'gsap';
import debug from 'debug';

const log = debug('app:components/BoardChecker');

export default {
  props: ['col', 'row', 'color'],

  data() {
    return {
      opacity: 1.0,
    };
  },

  watch: {
    winnerUpdate() {
      if (!this.winner || this.isWinningChecker) {
        this.opacity = 1.0;
      } else {
        this.opacity = 0.2;
      }
    },
  },

  computed: {
    adjustedColor() {
      const color = this.color;
      return this.$store.getters.colorHex(color);
    },

    isWinningChecker() {
      if (!this.winner) return false;

      return this.winner.moves
        .some(({ row, col }) => this.row === row && this.col === col);
    },

    winnerUpdate() {
      return !this.isUpdating && this.winner;
    },

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
      isUpdating: state => state.boards.isUpdating,
      winner: state => state.games.winner,
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
