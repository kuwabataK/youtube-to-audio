<template>
  <div
    class="memory-panel"
    :class="{ selected: props.isSelected, hidden: props.isHidden }"
    :style="style"
    @click="onClick"
  ></div>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { AudioData } from "@/store/DataStore/DataStore";
import StoreUtil from "@/store/StoreUtil";

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
      onClick
    };
  }
});
</script>

<style lang="scss" scoped>
.memory-panel {
  width: 50px;
  height: 50px;
  &.selected {
    border: 2px solid gray;
  }
  &.hidden {
    visibility: hidden;
  }
}
</style>
