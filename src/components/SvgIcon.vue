<template>
  <span class="icon" v-html="html"></span>
</template>

<script>
export default {
  props: {
    path: String,
  },
  data() {
    return {
      html: '',
    };
  },
  created() {
    import(`@/assets/${this.path}`).then(html => this.html = html);
  },
};
</script>
