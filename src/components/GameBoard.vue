<template>
  <div class="game-board">
    <template v-for="row in rows">
      <template v-for="col in cols">
        <div class="cell">
          <GameCell
            :row="row"
            :col="col"
            :color="cell(row, col) || 'azure'"
            ></GameCell>
        </div>
      </template>
    </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import GameCell from './GameCell';

  const range = num => [...Array(num).keys()];

  export default {
    components: {
      GameCell,
    },
    data() {
      return {
        rows: range(6).reverse(),
        cols: range(7).reverse(),
      };
    },

    computed: {
      ...mapGetters([
        'cell',
      ]),
    },
  };
</script>

<style scoped>
  .game-board {
    border: 5px cadetblue solid;

    width: 525px;
    height: 450px;
    margin: 0 auto;

    display: grid;
    grid-template: repeat(6, 1fr) / repeat(7, 1fr);
  }

  .cell {
    line-height: 0;
  }
</style>
