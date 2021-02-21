<template>
  <div class="memory-panel" :style="style" @click="loadVideo"></div>
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
      required: true,
    },
  },
  setup(props) {
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const loadVideo = async () => {
      yt.player?.loadVideoById({
        videoId: props.audioData.videoId,
        startSeconds: props.audioData.start || 0,
        endSeconds: props.audioData.end || 0,
      });
      yt.player?.unMute();
      yt.player?.setPlaybackQuality("small");
      yt.volume = props.audioData.volume ?? 50;
      yt.player?.playVideo();
    };
    const color = computed(() => {
      return props.audioData.color ?? "pink";
    });
    return {
      get style() {
        return {
          backgroundColor: color.value,
        };
      },
      loadVideo,
    };
  },
});
</script>

<style lang="scss" scoped>
.memory-panel {
  width: 50px;
  height: 50px;
}
</style>
