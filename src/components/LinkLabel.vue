<template>
  <v-chip class="ma-2" :color="color" outlined @click="loadVideo">
    {{ title }}
    <v-icon color="blue" right @click.stop="openLink">
      mdi-open-in-new
    </v-icon>
    <v-icon v-if="showEditButton" color="blue" right @click.stop="openEdit">
      mdi-square-edit-outline
    </v-icon>
  </v-chip>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";
import { getUrlFromId } from "@/Util";

export default defineComponent({
  name: "LinkLabel",
  props: {
    videoId: {
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
    showEditButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const loadVideo = async () => {
      const player = await yt.loadVideo(props.videoId, {
        playerVars: { start: props.start, end: props.end },
      });
      player.unMute();
      player.setPlaybackQuality("small");
      player.playVideo();
    };
    const urlWithTime = computed(() => {
      return getUrlFromId(props.videoId, props.start);
    });
    const openLink = () => {
      window.open(urlWithTime.value);
    };
    const openEdit = () => {
      context.emit("openEdit");
    };
    return {
      yt,
      loadVideo,
      openLink,
      openEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
a {
  border-bottom: 0;
}
</style>
