<template>
  <div id="app">
    <minesweeper :debug="true"></minesweeper>
  </div>
</template>

<style lang="scss">
  @import "~butter-styles/base";
</style>

<script>
  import Minesweeper from "components/minesweeper";

  export default {
    name: "App",
    components: {
      Minesweeper
    },
  }
</script>