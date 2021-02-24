<template>
  <div
    class="memory-panel"
    :class="{ selected: props.isSelected, hidden: props.isHidden }"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <transition name="slide">
      <div
        v-if="!props.isSelected && !isMouseOver"
        :style="style"
        class="normal"
      ></div>
    </transition>
    <img src="@/assets/image/icon/oozora_subaru.jpg" class="image" />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive } from "@vue/composition-api";
import { AudioData } from "@/store/DataStore/DataStore";
import StoreUtil from "@/store/StoreUtil";
import useMouseOver from "@/Hooks/useMouseOver";

export default defineComponent({
  name: "MemoryGamePanel",
  components: {},
  props: {
    audioData: {
      type: Object as () => AudioData,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const { isMouseOver, onMouseOver, onMouseLeave } = useMouseOver();

    const loadVideo = async () => {
      yt.player?.loadVideoById({
        videoId: props.audioData.videoId,
        startSeconds: props.audioData.start || 0,
        endSeconds: props.audioData.end || 0
      });
      yt.player?.unMute();
      yt.player?.setPlaybackQuality("small");
      yt.volume = props.audioData.volume ?? 50;
      yt.player?.playVideo();
    };
    const onClick = () => {
      loadVideo();
      context.emit("click", props.audioData);
    };
    const color = computed(() => {
      return props.audioData.color ?? "pink";
    });
    return {
      props,
      get style() {
        return {
          backgroundColor: color.value
        };
      },
      onClick,
      isMouseOver,
      onMouseOver,
      onMouseLeave
    };
  }
});
</script>

<style lang="scss" scoped>
.memory-panel {
  position: relative;
  width: 50px;
  height: 50px;
  overflow: hidden;
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s cubic-bezier(0.17, 0.67, 0.43, 0.97);
  }
  .slide-enter, .slide-leave-to /* .slide-leave-active below version 2.1.8 */ {
    transform: translate(0%, -100%);
  }
  .normal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &.selected {
    border: 4px solid rgba(47, 0, 255, 0.836);
  }
  &.hidden {
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
