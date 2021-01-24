<template>
  <v-chip class="ma-2" :color="props.color" outlined @click="loadVideo">
    {{ props.title }}
    <v-icon color="blue" right @click.stop="openLink">
      mdi-open-in-new
    </v-icon>
  </v-chip>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  name: "LinkLabel",
  props: {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    start: Number,
    end: Number,
    color: {
      type: String,
      default: "primary",
    },
  },
  setup(props) {
    const { start, end } = props;
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const videoId = computed(() => {
      return new URL(props.url).searchParams.get("v") as string;
    });

    const loadVideo = async () => {
      const player = await yt.loadVideo(videoId.value, {
        playerVars: { start, end },
      });
      player.unMute();
      player.setPlaybackQuality("small");
    };
    const playVideo = (start: number) => {
      if (yt.player) {
        yt.player.seekTo(start, true);
        yt.player.unMute();
        yt.player?.playVideo();
      }
    };
    const urlWithTime = computed(() => {
      return `https://www.youtube.com/watch?v=${videoId.value}&t=${Math.floor(start || 1) - 1}`;
    });
    const openLink = () => {
      window.open(urlWithTime.value);
    };
    return {
      props,
      yt,
      playVideo,
      loadVideo,
      openLink,
    };
  },
});
</script>

<style lang="scss" scoped>
a {
  border-bottom: 0;
}
</style>
