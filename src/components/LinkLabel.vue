<template>
  <div>
    <div v-show="false" :id="ids.youtube" />
    <v-chip color="primary" outlined pill @click="loadVideo">
      {{ props.title }}
      <a :href="urlWithTime" target="_blank" rel="noopener">
        <v-icon right>
          mdi-open-in-new
        </v-icon>
      </a>
    </v-chip>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import useId from "@/Hooks/useId";
import useYoutube from "@/Hooks/useYoutube";

export default defineComponent({
  name: "Home",
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
  },
  setup(props) {
    const { start, end } = props;
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    yt.isLoop = true;

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
      return `https://www.youtube.com/watch?v=${videoId.value}&t=${Math.round(start || 0)}`;
    });
    return {
      props,
      ids,
      yt,
      playVideo,
      loadVideo,
      urlWithTime,
    };
  },
});
</script>

<style lang="scss" scoped>
a {
  border-bottom: 0;
}
</style>
