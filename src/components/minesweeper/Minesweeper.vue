<template>
  <div data-namespace="minesweeper"
       :data-style-mode="isMobile ? 'mobile' : 'pc'"
       :style="{pointerEvents: victory || defeat ? 'none' : 'auto'}"
       @touchmove="onTouchmove"
       @mousemove="onTouchmove"
  >
    <div class="row"
         v-for="(row, y) in grids"
         :key="y"
    >
      <div class="grid"
           v-for="(grid, x) in row"
           :style="gridStyle"
           :key="x"
           @mousedown="!isMobile && onGridMousedown(x, y, $event)"
           @mouseup="!isMobile && onGridMouseup(x, y, $event)"
           @touchstart="isMobile && onGridMousedown(x, y, $event)"
           @touchend="isMobile && onGridMouseup(x, y, $event)"
           @click="isMobile && onGridClick(x, y)"
           @click.left="!isMobile && onLeftClick(x, y)"
           @click.right="!isMobile && onRightClick(x, y, $event)"
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

  div[data-style-mode=pc] {
    .mine, .num, .empty, .explore {
      border: 1px solid $shadow_color;
    }

    .cover {
      border: 2.5px solid #fff;
      border-right-color: $shadow_color;
      border-bottom-color: $shadow_color;
    }

    .num {
      font-size: 18px;
    }
  }

  div[data-style-mode=mobile] {
    .mine, .num, .empty, .explore {
      border: .01rem solid $shadow_color;
    }

    .cover {
      border: .025rem solid #fff;
      border-right-color: $shadow_color;
      border-bottom-color: $shadow_color;
    }

    .num {
      font-size: .18rem;
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
      },
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.initMinesweeper();
      this.assignGrids();
    },
    computed: {
      gridStyle() {
        if(!this.isMobile) {
          return {
            width: '22px',
            height: '22px'
          }
        }
        const percent = `${1 / this.width * 100}%`;
        return {
          width: percent,
          paddingBottom: percent
        }
      }
    },
    data() {
      return {
        defeat: false,
        victory: false,
        isInitial: true,
        marked: {},
        grids: [],
        minesweeper: null,
      }
    },
    methods: {
      onTouchmove(e) {
        this.setCoordinate(e)
      },
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
      onLeftClick(x, y) {
        const grid = this.minesweeper.getGrid(x, y);
        if(grid.exposed || this.longPressed) {
          return
        }
        this.dig(x, y)
      },
      onRightClick(x, y, e) {
        const grid = this.minesweeper.getGrid(x, y);
        e.preventDefault();
        if(grid.exposed || this.longPressed) {
          return
        }
        this.mark(x, y)
      },
      onGridMousedown(x, y, e) {
        const {target} = e;
        const grid = this.minesweeper.getGrid(x, y);

        this.rect = target.getBoundingClientRect();
        this.longPressed = false;
        this.setCoordinate(e);
        this.mousedownAt = (new Date()).getTime();

        if(grid.exposed) {
          this.explore(x, y)
        }
        if(grid.exposed || (!grid.marked && this.action === DIG)) {
          this.$emit('mousedown')
        }
        if(!grid.exposed) {
          this.mousedownFlag = setTimeout(() => {
            if(this.moveout()) {
              return
            }
            this.longPressed = true;
            if(this.action === DIG) {
              this.mark(x, y)
            } else {
              this.dig(x, y)
            }
          }, 400)
        }
      },
      onGridMouseup(x, y) {
        const remainingPressTime = 100 - ((new Date()).getTime() - this.mousedownAt);
        const grid = this.minesweeper.getGrid(x, y);
        if(this.moveout()) {
          this.minesweeper.clearAllExploring()
        } else if(grid.exposed && !this.longPressed) {
          this.finishExplore(x, y)
        }
        clearTimeout(this.timeoutForMouseup);
        clearTimeout(this.mousedownFlag);
        this.timeoutForMouseup = setTimeout(() => {
          !this.victory && !this.defeat && this.$emit('mouseup');
          this.assignGrids();
        }, Math.max(0, remainingPressTime));
      },
      explore(x, y) {
        this.minesweeper.explore(x, y);
        this.assignGrids()
      },
      finishExplore(x, y) {
        this.minesweeper.finishExplore(x, y);
      },
      mark(x, y) {
        const marked = this.minesweeper.mark(x, y);
        if(this.isInitial) {
          const key = `${x}:${y}`;
          marked ? this.marked[key] = true : delete this.marked[key];
        }
        this.assignGrids();
        this.$emit('mark', this.minesweeper.markedCount);
      },
      dig(x, y) {
        if(this.isInitial) {
          this.initMinesweeper(x, y);
          this.isInitial = false;
          this.$emit('start');
          Object.keys(this.marked).forEach(key => {
            const [x, y] = key.split(':');
            this.minesweeper.mark(x, y)
          })
        }
        this.minesweeper.expose(x, y);
        this.assignGrids();
      },
      initMinesweeper(x, y) {
        this.minesweeper = new Minesweeper({
          col: y,
          row: x,
          width: this.width,
          height: this.height,
          minesCount: this.minesCount,
        });
        this.minesweeper.on({
          winning: () => {
            this.$emit('winning');
            this.victory = true;
            this.minesweeper.exposeAllNotMines();
            this.assignGrids();
          },
          defeat: () => {
            this.$emit('defeat');
            this.defeat = true;
          }
        })
      },
      assignGrids() {
        this.grids = forceClone(this.minesweeper.grids)
      },
      refresh() {
        this.isInitial = true;
        this.victory = false;
        this.defeat = false;
        this.marked = [];
        this.minesweeper.markedCount = 0;
        this.initMinesweeper();
        this.assignGrids();
        this.$emit('mark', 0)
      },
      setCoordinate(e) {
        const {touches} = e;
        const {clientX, clientY} = touches ? touches[0] : e;
        this.clientX = clientX;
        this.clientY = clientY;
      },
      moveout() {
        return this.clientX < this.rect.left ||
          this.clientX > this.rect.left + this.rect.width ||
          this.clientY < this.rect.top ||
          this.clientY > this.rect.top + this.rect.height
      },
    }
  }
</script>