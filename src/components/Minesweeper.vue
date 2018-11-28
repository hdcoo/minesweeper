<template>
  <div data-namespace="minesweeper">
    <div class="row"
         v-for="(row, y) in grids"
         :key="y"
    >
      <div class="grid"
           v-for="(grid, x) in row"
           :style="gridStyle"
           :key="x"
           @click="onGridClick(x, y, grid)"
      >
        <template v-if="!grid.exposed">
          <div class="cover"></div>
        </template>
        <template v-if="grid.exposed || debug">
          <div class="mine"
               :class="{debug: debug && !grid.exposed}"
               v-if="grid.isMine"
          ></div>
          <div class="num"
               :class="{debug: debug && !grid.exposed, [`color${grid.minesCount}`]: true}"
               v-else-if="grid.minesCount > 0"
          >{{grid.minesCount}}</div>
          <div class="empty"
               :class="{debug: debug && !grid.exposed}"
               v-else
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";

  $main_color: #b3b3b3;
  $shadow_color: #6d6d6d;

  div[data-namespace=minesweeper] {
    @include helpers-user-select(none);

    .row {
      @include flexbox;
    }

    .grid {
      position: relative;
    }

    .mine, .num, .empty, .cover {
      position: absolute;
      background: $main_color;
      @include helpers-full-fill;
      @include helpers-border-box;
    }

    .mine, .num, .empty {
      border: .01rem solid $shadow_color;
    }

    .cover {
      border: .03rem solid #fff;
      border-right-color: $shadow_color;
      border-bottom-color: $shadow_color;
    }

    .mine {
      font-size: 25px;
      background-image: url(~assets/mine.jpg);
      @include helpers-background-config(75% auto, 50% 50%)
    }

    .num {
      font-weight: bold;
      font-size: .13rem;
      @include flexbox;
      @include flex-align-items(center);
      @include flex-justify-content(center);
    }

    .debug {
      background-color: transparent;
      opacity: 0.4;
    }

    .color1 {
      color: blue;
    }

    .color2 {
      color: green;
    }

    .color3 {
      color: red;
    }

    .color4 {
      color: purple;
    }

    .color5 {
      color: maroon;
    }

    .color6 {
      color: turquoise;
    }

    .color7 {
      color: black;
    }

    .color8 {
      color: gray;
    }
  }
</style>

<script>
  import Minesweeper from "common/minesweeper";
  import {forceClone} from "buttercam/utils";

  const minesweeper = new Minesweeper({
    width: 16,
    height: 30,
    minesCount: 99
  });

  export default {
    name: "Minesweeper",
    computed: {
      gridStyle() {
        const percent = `${1 / 16 * 100}%`;
        return {
          width: percent,
          paddingBottom: percent
        }
      }
    },
    props: {
      debug: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        width: minesweeper.width,
        height: minesweeper.height,
        grids: forceClone(minesweeper.grids)
      }
    },
    methods: {
      onGridClick(x, y, grid) {
        minesweeper.expose(x, y)
      }
    }
  }
</script>