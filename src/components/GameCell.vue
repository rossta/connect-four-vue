<template>
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg">
    <circle
    cx="100"
    cy="100"
    r="80"
    :fill="adjustedColor"
    />
  </svg>
</template>

<script>
  import debug from 'debug';

  const log = debug('app:components/GameCell');

  const adjust = {
    red: '#FC7E69',
    black: '#254689',
  };

  export default {
    props: ['row', 'col', 'color'],

    computed: {
      adjustedColor() {
        return adjust[this.color] || this.color;
      },
    },

    created() {
      log(this.row, this.col, this.color);
    },
  };
</script>

<style scoped>
  svg {
    background-color: cadetblue;
  }
</style>
