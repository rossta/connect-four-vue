<template>
  <circle
    :id="domId"
    :cx="cx"
    :cy="cy"
    :r="checkerRadius"
    :fill="adjustedColor" />
</template>

<script>
import { mapGetters } from 'vuex';

const adjust = {
  red: '#FC7E69',
  black: '#254689',
};

export default {
  props: ['domId', 'color', 'cx', 'cy'],

  computed: {
    adjustedColor() {
      const color = this.color;
      return adjust[color] || color;
    },

    ...mapGetters([
      'checkerColor',
      'checkerRadius',
    ]),
  },
};
</script>
