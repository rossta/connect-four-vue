<template>
  <div class="game-board">
    <div
      v-for="n in 42"
      class="cell">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
  .game-board {
    border-left: 1px #CCC solid;
    border-top: 1px #CCC solid;

    width: 707px;
    height: 606px;
    margin: 0 auto;

    display: grid;
    grid-template: repeat(6, 1fr) / repeat(7, 1fr);
  }

  .cell {
    border-right: 1px #CCC solid;
    border-bottom: 1px #CCC solid;
  }
</style>
