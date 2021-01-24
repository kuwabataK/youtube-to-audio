<template>
  <div class="player">
    <div :id="ids.youtube" />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, onUnmounted } from "@vue/composition-api";
import LinkLabel from "./LinkLabel.vue";
import useYoutube from "@/Hooks/useYoutube";
import useId from "@/Hooks/useId";

export default defineComponent({
  components: { LinkLabel },
  name: "Player",
  props: {
    videoId: String,
  },
  setup(props, context) {
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    yt.isLoop = false;

    const loadVideo = async () => {
      if (!props.videoId) return;
      await yt.loadVideo(props.videoId, { height: 360, width: 640 });
    };
    watch(
      () => yt.currentTime,
      () => {
        context.emit("updateCurrentTime", yt.currentTime);
      }
    );
    watch(
      () => props.videoId,
      () => {
        loadVideo();
      }
    );
    onUnmounted(() => {
      yt.destroy();
    });
    return {
      props,
      ids,
      yt,
      loadVideo,
    };
  },
});
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
}
</style>
