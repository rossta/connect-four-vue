<template>
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    >
    <circle cx="100" cy="100" r="80" :fill="color" />
  </svg>
</template>

<script>
import debug from 'debug';

const log = debug('app:components/GameChecker');

export default {
  props: ['color'],
};
</script>
