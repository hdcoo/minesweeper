<template>
  <div data-namespace="movable"
       ref="movable"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @import "~butter-styles/@flex";
  @import "~butter-styles/@helpers";
  @import "~butter-styles/@colors";

  div[data-namespace=movable] {
    @include helpers-full-size;
    @include flex-grow(1);
  }
</style>

<script>
  import Hammer from "hammerjs";
  import MovableItem from "./MovableItem";

  export default {
    name: "Movable",
    mounted() {
      const {movable} = this.$refs;
      const hammer = new Hammer(movable);

      this.getMovableItems();

      hammer.get('pinch').set({enable: true});

      hammer.on('pan', e => {
        const {deltaX, deltaY} = e;
        this.activatedMovableItem.x = this.originalX + deltaX;
        this.activatedMovableItem.y = this.originalY + deltaY;
      });

      hammer.on('pinch', e => {
        this.activatedMovableItem.scale = this.originalScale * e.scale;
      });

      this.hammer = hammer;

      movable.addEventListener('touchstart', this.touchStart);
    },
    data() {
      return {
        movableItems: []
      }
    },
    methods: {
      touchStart(e) {
        const {touches} = e;
        const movableItem = this.getActivatedMovableItem();

        if(!movableItem) {
          return
        }

        this.originalX = movableItem.x;
        this.originalY = movableItem.y;
        this.originalScale = movableItem.scale;
        this.activatedMovableItem = movableItem;

        if(touches.length > 1) {
          this.hammer.get('pan').set({enable: false})
        } else {
          this.hammer.get('pan').set({
            enable: true,
            direction: Hammer.DIRECTION_ALL
          })
        }
      },
      getMovableItems() {
        const {$children} = this;
        $children.forEach((child) => {
          if(child.identifier === MovableItem.identifier) {
            this.movableItems.push(child)
          }
        })
      },
      getActivatedMovableItem() {
        return this.movableItems[0]
      }
    }
  }
</script>