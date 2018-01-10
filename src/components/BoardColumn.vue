<template>
  <rect
    :key="col"
    :col="col"
    :width="cellSize"
    :height="boardHeight"
    :x="cellSize * col"
    :y="0"
    :fill="color"
    />
</template>

<script>
export default {
  props: ['col', 'color', 'cellSize', 'boardHeight'],
};
</script>
