<template>
  <div data-namespace="action-button"
       :class="pressing ? 'activated' : 'normal'"
       @mousedown="onMousedown"
       @touchstart="onMousedown"
       @mouseup="onMouseup"
       @touchend="onMouseup"
       @mouseout="onMouseup"
       @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";
  @import "common";

  div[data-namespace=normal-button] {
    background-color: $main_color;
    @include helpers-border-box;
    @include helpers-full-size;
  }

  .normal {
    border: 3px solid #fff;
    border-right-color: $shadow_color;
    border-bottom-color: $shadow_color;
  }

  .activated {
    border: 3px solid #fff;
    border-left-color: $shadow_color;
    border-top-color: $shadow_color;
  }

</style>

<script>
  export default {
    name: "ActionButton",
    data() {
      return {
        pressing: false
      }
    },
    methods: {
      onMousedown() {
        this.pressing = true;
      },
      onMouseup() {
        this.pressing = false;
      },
      onClick() {
        this.$emit('click')
      }
    }
  }
</script>