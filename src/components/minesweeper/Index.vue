<template>
  <div data-namespace="minesweeper-controller">
    <section data-name="header">
      <div class="remaining-mines">{{remainingMines}}</div>
      <action-button @click="onRefreshClick">
        <div class="avatar" :style="{backgroundImage: `url(${avatar})`}"></div>
      </action-button>
      <div class="time"></div>
    </section>
    <section data-name="minesweeper">
      <minesweeper :debug="debug"
                   :width="width"
                   :height="height"
                   :action="action"
                   :mines-count="minesCount"
                   @mark="mark"
                   @mousedown="onMousedown"
                   @mouseup="onMouseup"
                   ref="minesweeper"
      ></minesweeper>
    </section>
    <section data-name="tool">
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
    </section>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";
  @import "common";

  $header_height: .6rem;
  $tool_height: .5rem;

  div[data-namespace=minesweeper-controller] {
    background: $main_color;
    @include helpers-full-size;
    @include flex-grow(1);

    section[data-name=header], section[data-name=tool] {
      @include flexbox;
      @include flex-align-items(center);
    }

    section[data-name=header] {
      height: $header_height;
      @include flex-justify-content(space-between);

      .remaining-mines, .time {
        width: 1rem;
        height: 100%;
        font-size: .3rem;
        @include flexbox;
        @include flex-justify-content(center);
        @include flex-align-items(center)
      }

      .avatar {
        width: $header_height - .1rem;
        height: $header_height - .1rem;
        @include helpers-border-box;
        @include helpers-background-config()
      }
    }

    section[data-name=minesweeper] {
      height: calc(100% - #{$header_height} - #{$tool_height});
    }

    section[data-name=tool] {
      height: $tool_height;
      @include flex-justify-content(center);

      .action {
        width: $tool_height - .1rem;
        height: $tool_height - .1rem;
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
</style>

<script>
  import Minesweeper, {DIG, MARK} from "./Minesweeper";
  import ActionButton from "./ActionButton";

  const avatars = {
    smile: require('assets/smile.jpg'),
    surprise: require('assets/surprise.jpg')
  };

  export default {
    name: "MinesweeperController",
    components: {
      Minesweeper,
      ActionButton
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
    },
    data() {
      return {
        DIG,
        MARK,
        action: DIG,
        remainingMines: this.minesCount,
        avatar: avatars.smile
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
        minesweeper.refresh()
      },
      onMousedown() {
        this.avatar = avatars.surprise
      },
      onMouseup() {
        this.avatar = avatars.smile
      }
    }
  }
</script>