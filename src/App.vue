<template>
  <div id="app" :class="{pc: !isMobile}">
      <minesweeper-controller :is-mobile="isMobile"
                              :width="width"
                              :height="height"
                              :mines-count="minesCount"
      ></minesweeper-controller>
  </div>
</template>

<style lang="scss">
  @import "~butter-styles/base";
  @import "components/minesweeper/common";

  body, html, #app {
    height: 100%;
    background: $main_color;
  }
</style>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";

  .pc {
    @include flexbox;
    @include flex-justify-content(center);
    @include flex-align-items(center);
  }
</style>

<script>
  import MinesweeperController from "components/minesweeper/Index.vue";

  export default {
    name: "App",
    components: {
      MinesweeperController
    },
    data() {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return {
        isMobile,
        width: isMobile ? 16 : 30,
        height: isMobile ? 30 : 16,
        minesCount: 99
      }
    }
  }
</script>