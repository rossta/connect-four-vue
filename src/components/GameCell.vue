<template>
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    @click="attempt"
    >
    <circle cx="100" cy="100" r="80" :fill="adjustedColor" />
  </svg>
</template>

<script>
  const adjust = {
    red: '#FC7E69',
    black: '#254689',
  };

  export default {
    props: ['row', 'col', 'color'],

    created() {
    },

    methods: {
      attempt() {
        const col = this.col;
        this.$emit('attempt', { col });
      },
    },

    computed: {
      toObject() {
        return { row: this.row, col: this.col, color: this.color };
      },

      adjustedColor() {
        return adjust[this.color] || this.color;
      },
    },
  };
</script>

<style scoped>
  svg {
    background-color: cadetblue;
    cursor: pointer;
  }
</style>
