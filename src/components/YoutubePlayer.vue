<template>
  <div class="youtube">
    <button @click="loadVideo('xhQc8VsXkWY', 49 * 60 + 31.9, 49 * 60 + 33.1)">
      おかゆボタン
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 19.6, 38 * 60 + 21)">
      のんどこ
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 30, 38 * 60 + 34)">
      たべとこ
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 34.5, 38 * 60 + 35.5)">
      あれ?どこ?
    </button>
    <link-label
      title="のんどこ / たべとこ / あれ？どこ？"
      url="https://www.youtube.com/watch?v=76ykVW5fiK8"
      :start="38 * 60 + 19.6"
      :end="38 * 60 + 37"
    />
    <button @click="pause">
      停止
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import LinkLabel from "./LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  components: { LinkLabel },
  name: "Home",
  setup() {
    const { yt } = StoreUtil.useStore("YoutubeStore");
    yt.isLoop = false;

    const loadVideo = async (videoId: string, start: number, end: number) => {
      const player = await yt.loadVideo(videoId, {
        playerVars: { start, end }
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
    const generateURL = (id: string) => {
      return `https://www.youtube.com/watch?v=${id}`;
    };
    const pause = () => {
      yt.player?.pauseVideo();
    };
    return {
      yt,
      playVideo,
      loadVideo,
      generateURL,
      pause
    };
  }
});
</script>

<style lang="scss" scoped></style>
