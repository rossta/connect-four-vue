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

export default {
  props: ['domId', 'color', 'cx', 'cy'],

  computed: {
    adjustedColor() {
      const color = this.color;
      return this.$store.getters.colorHex(color);
    },

    ...mapGetters([
      'checkerRadius',
    ]),
  },
};
</script>
