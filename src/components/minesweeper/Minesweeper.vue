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
           @mousedown="onGridMousedown(x, y)"
           @mouseup="onGridMouseup(x, y)"
           @touchstart="onGridMousedown(x, y)"
           @touchend="onGridMouseup(x, y)"
           @click="onGridClick(x, y, grid)"
      >
        <template v-if="!grid.exposed">
          <div class="explore" v-if="grid.exploring && !grid.marked"></div>
          <div class="cover" :class="{marked: grid.marked}" v-else></div>
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
  @import "common";

  div[data-namespace=minesweeper] {
    @include helpers-user-select(none);

    .row {
      @include flexbox;
    }

    .grid {
      position: relative;
    }

    .mine, .num, .empty, .cover, .explore {
      position: absolute;
      background: $main_color;
      @include helpers-full-fill;
      @include helpers-border-box;
    }

    .mine, .num, .empty, .explore {
      border: .01rem solid $shadow_color;
    }

    .cover {
      border: .025rem solid #fff;
      border-right-color: $shadow_color;
      border-bottom-color: $shadow_color;
    }

    .marked {
      background-image: url(~assets/mark.jpg);
      @include helpers-background-config(80% auto, 50% 50%)
    }

    .mine {
      font-size: 25px;
      background-image: url(~assets/mine.jpg);
      @include helpers-background-config(75% auto, 50% 50%)
    }

    .num {
      font-weight: bold;
      font-size: .18rem;
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
  import Minesweeper from "common/minesweeper/index";
  import {forceClone} from "buttercam/utils";

  export const DIG = 'DIG';

  export const MARK = 'MARK';

  export default {
    name: "Minesweeper",
    props: {
      debug: {
        type: Boolean,
        default: false
      },
      action: {
        type: String,
        default: DIG
      },
      width: {
        type: Number,
        default: 16
      },
      height: {
        type: Number,
        default: 30
      },
      minesCount: {
        type: Number,
        default: 99
      }
    },
    created() {
      this.initMinesweeper();
      this.assignGrids();
    },
    computed: {
      gridStyle() {
        const percent = `${1 / 16 * 100}%`;
        return {
          width: percent,
          paddingBottom: percent
        }
      }
    },
    data() {
      return {
        isInitial: true,
        marked: {},
        grids: [],
        minesweeper: null
      }
    },
    methods: {
      onGridClick(x, y) {
        const grid = this.minesweeper.getGrid(x, y);
        if(grid.exposed || this.longPressed) {
          return
        }
        if(this.action === MARK) {
          this.mark(x, y)
        } else {
          this.dig(x, y)
        }
      },
      onGridMousedown(x, y) {
        const grid = this.minesweeper.getGrid(x, y);
        if(grid.exposed) {
          this.explore(x, y)
        }
        if(grid.exposed || (!grid.marked && this.action === DIG)) {
          this.$emit('mousedown')
        }
        this.longPressed = false;
        this.mousedownFlag = setTimeout(() => {
          this.longPressed = true;
          if(this.action === DIG) {
            this.mark(x, y)
          } else {
            this.dig(x, y)
          }
        }, 400)
      },
      onGridMouseup(x, y) {
        const grid = this.minesweeper.getGrid(x, y);
        if(grid.exposed && !this.longPressed) {
          this.finishExplore(x, y)
        }
        this.$emit('mouseup');
        clearTimeout(this.mousedownFlag);
      },
      explore(x, y) {
        this.minesweeper.explore(x, y);
        this.assignGrids()
      },
      finishExplore(x, y) {
        this.minesweeper.finishExplore(x, y);
        this.assignGrids()
      },
      mark(x, y) {
        const marked = this.minesweeper.mark(x, y);
        if(this.isInitial) {
          const key = `${x}:${y}`;
          marked ? this.marked[key] = true : delete this.marked[key];
        }
        this.assignGrids();
        this.$emit('mark', this.minesweeper.markedCount)
      },
      dig(x, y) {
        if(this.isInitial) {
          this.initMinesweeper(x, y);
          this.isInitial = false;
          Object.keys(this.marked).forEach(key => {
            const [x, y] = key.split(':');
            this.minesweeper.mark(x, y)
          })
        }
        this.minesweeper.expose(x, y);
        this.assignGrids()
      },
      initMinesweeper(x, y) {
        this.minesweeper = new Minesweeper({
          col: y,
          row: x,
          width: this.width,
          height: this.height,
          minesCount: this.minesCount,
        });
      },
      assignGrids() {
        this.grids = forceClone(this.minesweeper.grids)
      },
      refresh() {
        this.isInitial = true;
        this.initMinesweeper();
        this.assignGrids();
      }
    }
  }
</script>