<template>
  <div data-namespace="minesweeper-controller"
       :data-style-mode="isMobile ? 'mobile' : 'pc'"
  >
    <section data-name="header">
      <div class="header-wrapper">
        <div class="remaining-mines">{{`${remainingMines}`.padStart(3, '0')}}</div>
        <action-button @click="onRefreshClick">
          <div class="avatar" :style="{backgroundImage: `url(${avatar})`}"></div>
        </action-button>
        <div class="time">{{`${timing}`.padStart(3, '0')}}</div>
      </div>
    </section>
    <section data-name="minesweeper">
      <div>
        <movable v-if="isMobile">
          <movable-item>
            <minesweeper :debug="debug"
                         :width="width"
                         :height="height"
                         :action="action"
                         :mines-count="minesCount"
                         :is-mobile="true"
                         @mark="mark"
                         @mousedown="onMousedown"
                         @mouseup="onMouseup"
                         @winning="onWinning"
                         @defeat="onDefeat"
                         @start="onStart"
                         ref="minesweeper"
                         class="minesweeper"
            ></minesweeper>
          </movable-item>
        </movable>
        <minesweeper :debug="debug"
                     :width="width"
                     :height="height"
                     :action="action"
                     :mines-count="minesCount"
                     @mark="mark"
                     @mousedown="onMousedown"
                     @mouseup="onMouseup"
                     @winning="onWinning"
                     @defeat="onDefeat"
                     @start="onStart"
                     ref="minesweeper"
                     class="minesweeper"
                     v-else
        ></minesweeper>
      </div>
    </section>
    <section data-name="tool" v-if="isMobile">
      <div class="tool-wrapper">
        <action-button v-if="action === DIG"
                       @click="onActionClick"
        >
          <div class="action dig"></div>
        </action-button>
        <action-button v-else
                       @click="onActionClick"
        >
          <div class="action mark"></div>
        </action-button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";
  @import "common";

  div[data-namespace=minesweeper-controller] {
    background: $main_color;
    @include helpers-user-select(none);

    section[data-name=header] {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      @include helpers-border-box;
      @include flex(0, 0, auto);

      .header-wrapper {
        position: relative;
        @include helpers-full-size;
        @include flexbox;
        @include flex-align-items(center);
        @include flex-justify-content(space-between);
        @include helpers-border-box;
      }

      .remaining-mines, .time {
        height: 100%;
        @include flexbox;
        @include flex-justify-content(center);
        @include flex-align-items(center)
      }

      .avatar {
        @include helpers-border-box;
        @include helpers-background-config()
      }
    }

    section[data-name=minesweeper] {
      @include helpers-border-box;

      >div {
        border: 4px solid #fff;
        border-top: 0;
        border-left-color: $shadow_color;
        border-top-color: $shadow_color;
        @include helpers-full-size;
        @include helpers-border-box;
      }
    }

    section[data-name=tool] {
      @include helpers-border-box;
      @include flex(0, 0, auto);

      .tool-wrapper {
        @include helpers-full-size;
        @include flexbox;
        @include flex-align-items(center);
        @include flex-justify-content(center);
        @include helpers-border-box;
      }

      .action {
        @include helpers-background-config()
      }

      .dig {
        background-image: url(~assets/shovel.jpg);
      }

      .mark {
        background-image: url(~assets/flag.jpg);
      }
    }

  }

  div[data-style-mode=pc] {
    $header_height: 80px;
    $tool_height: 65px;

    border: 3px solid #fff;
    border-right-color: $shadow_color;
    border-bottom-color: $shadow_color;

    section[data-name=header] {
      height: $header_height;
      padding: 5px 10px;
      border-bottom: 3px solid $shadow_color;

      .header-wrapper {
        border: 2.5px solid #fff;
        border-left-color: $shadow_color;
        border-top-color: $shadow_color;
      }

      .remaining-mines, .time {
        width: 100px;
        font-size: 30px;
      }

      .avatar {
        width: $header_height - 35px;
        height: $header_height - 35px;
      }
    }

    section[data-name=tool] {
      height: $tool_height;

      .tool-wrapper {
        padding: 5px 0;
      }

      .action {
        width: $tool_height - 20px;
        height: $tool_height - 20px;
      }
    }
  }

  div[data-style-mode=mobile] {
    $header_height: .8rem;
    $tool_height: .65rem;

    @include helpers-full-size;
    @include flex-grow(1);
    @include flexbox;
    @include flex-direction(column);

    section[data-name=header] {
      height: $header_height;
      padding: .05rem .1rem;
      border-bottom: .03rem solid $shadow_color;

      .header-wrapper {
        border: .025rem solid #fff;
        border-left-color: $shadow_color;
        border-top-color: $shadow_color;
      }

      .remaining-mines, .time {
        width: 1rem;
        font-size: .3rem;
      }

      .avatar {
        width: $header_height - .35rem;
        height: $header_height - .35rem;
      }
    }

    section[data-name=minesweeper] {
      padding: 0 5px;
      @include flex-grow(1);
      @include flexbox;
      @include flex-direction(column);

      >div {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        @include flex-grow(1)
      }
    }

    section[data-name=tool] {
      height: $tool_height;

      .tool-wrapper {
        padding: .05rem 0;
      }

      .action {
        width: $tool_height - .2rem;
        height: $tool_height - .2rem;
      }
    }
  }
</style>

<script>
  import Minesweeper, {DIG, MARK} from "./Minesweeper";
  import ActionButton from "./ActionButton";

  import Movable from "./Movable";
  import MovableItem from "./MovableItem";

  const avatars = {
    smile: require('assets/smile.jpg'),
    surprise: require('assets/surprise.jpg'),
    cry: require('assets/cry.jpg'),
    victory: require('assets/victory.jpg')
  };

  export default {
    name: "MinesweeperController",
    components: {
      Minesweeper,
      ActionButton,
      Movable,
      MovableItem
    },
    beforeDestroy() {
      this.stopTiming()
    },
    props: {
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
      debug: {
        type: Boolean,
        default: false
      },
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        DIG,
        MARK,
        action: DIG,
        remainingMines: this.minesCount,
        avatar: avatars.smile,
        timing: 0
      }
    },
    methods: {
      mark(count) {
        this.remainingMines = this.minesCount - count
      },
      onActionClick() {
        this.action = this.action === DIG ? MARK : DIG;
      },
      onRefreshClick() {
        const {minesweeper} = this.$refs;
        minesweeper.refresh();
        this.stopTiming();
        this.timing = 0;
        this.action = DIG;
        this.avatar = avatars.smile;
      },
      onMousedown() {
        this.avatar = avatars.surprise
      },
      onMouseup() {
        this.avatar = avatars.smile
      },
      onWinning() {
        this.avatar = avatars.victory;
        this.stopTiming();
      },
      onDefeat() {
        this.avatar = avatars.cry;
        this.stopTiming();
      },
      onStart() {
        this.stopTiming();
        this.timingFlag = setInterval(() => {
          if(this.timing < 1000) {
            this.timing += 1;
          } else {
            this.stopTiming()
          }
        }, 1000)
      },
      stopTiming() {
        clearInterval(this.timingFlag)
      }
    }
  }
</script>