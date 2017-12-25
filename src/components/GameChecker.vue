<template>
  <circle :id="domId" :cx="cx" :cy="cy" :r="r" :fill="adjustedColor" />
</template>

<script>
const adjust = {
  red: '#FC7E69',
  black: '#254689',
};

export default {
  props: ['domId', 'color', 'cx', 'cy', 'r'],

  computed: {
    adjustedColor() {
      const color = this.color;
      return adjust[color] || color;
    },
  },
};
</script>
