<template>
  <div id="app">
    <minesweeper-controller></minesweeper-controller>
  </div>
</template>

<style lang="scss">
  @import "~butter-styles/base";

  body, html, #app {
    height: 100%;
  }
</style>

<script>
  import MinesweeperController from "components/minesweeper/Index.vue";

  export default {
    name: "App",
    components: {
      MinesweeperController
    },
  }
</script>