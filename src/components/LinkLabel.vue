<template>
  <v-chip class="ma-2" :color="color" outlined @click="loadVideo">
    <span class="label-title" :class="{ 'show-edit': showEditButton }">{{ title }}</span>
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
    volume: {
      type: Number,
      default: 50,
    },
  },
  setup(props, context) {
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const loadVideo = async () => {
      yt.player?.loadVideoById({
        videoId: props.videoId,
        startSeconds: props.start || 0,
        endSeconds: props.end || 0,
      });
      yt.player?.unMute();
      yt.player?.setPlaybackQuality("small");
      yt.volume = props.volume;
      yt.player?.playVideo();
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
.label-title {
  max-width: calc(100% - 24px);
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: bold;
  &.show-edit {
    max-width: calc(100% - 48px);
  }
}
</style>
