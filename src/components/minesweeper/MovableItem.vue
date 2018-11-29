<template>
  <div data-namespace="movable-item"
       :style="{transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`}"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";

  div[data-namespace=movable-item] {
    width: 100%;
  }
</style>

<script>
  import {uuid} from "buttercam/utils";

  const identifier = '__movable_item__';

  export default {
    name: "MovableItem",
    identifier,
    props: {
      initialX: {
        type: Number,
        default: 0
      },
      initialY: {
        type: Number,
        default: 0
      },
      initialScale: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        scale: this.initialScale,
        x: this.initialX,
        y: this.initialY,
        identifier,
        id: uuid()
      }
    }
  }
</script>